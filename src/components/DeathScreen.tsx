import { useGameStore } from '../store/gameStore';
import { deleteSaveGame } from '../store/persistence';
import { AchievementList } from './achievements/AchievementList';
import { RunSummary } from './RunSummary';
import { formatWeight } from '../utils/formatWeight';
import type { Offspring } from '../types/reproduction';
import styles from '../styles/deathscreen.module.css';

function getIteroparousFitnessRating(fitness: number): { label: string; color: string } {
  if (fitness === 0) return { label: 'No Surviving Offspring', color: 'var(--color-danger)' };
  if (fitness === 1) return { label: 'Below Average', color: '#c87533' };
  if (fitness === 2) return { label: 'Average — Replacement Rate', color: 'var(--color-text)' };
  if (fitness <= 4) return { label: 'Above Average', color: '#5a9e5a' };
  return { label: 'Exceptional', color: '#3a8a3a' };
}

function getSemelparousFitnessRating(fitness: number, spawned: boolean): { label: string; color: string } {
  if (!spawned) return { label: 'Failed to Spawn', color: 'var(--color-danger)' };
  if (fitness <= 3) return { label: 'Below Average', color: '#c87533' };
  if (fitness <= 8) return { label: 'Average', color: 'var(--color-text)' };
  if (fitness <= 15) return { label: 'Above Average', color: '#5a9e5a' };
  return { label: 'Exceptional', color: '#3a8a3a' };
}

function offspringFate(o: Offspring): string {
  if (o.matured) return 'Survived to reproductive age';
  if (!o.alive) return o.causeOfDeath || 'Died';
  return `Alive — ${o.ageTurns} weeks old`;
}

function offspringFateClass(o: Offspring): string {
  if (o.matured) return styles.fateMatured;
  if (!o.alive) return styles.fateDead;
  return styles.fateAlive;
}

export function DeathScreen() {
  const animal = useGameStore((s) => s.animal);
  const time = useGameStore((s) => s.time);
  const turnHistory = useGameStore((s) => s.turnHistory);
  const reproduction = useGameStore((s) => s.reproduction);
  const config = useGameStore((s) => s.speciesBundle.config);
  const lineage = useGameStore((s) => s.lineage);
  const tv = config.templateVars;

  const isIteroparous = reproduction.type === 'iteroparous';
  const isSemelparous = reproduction.type === 'semelparous';

  const rating = isIteroparous
    ? getIteroparousFitnessRating(reproduction.totalFitness)
    : getSemelparousFitnessRating(reproduction.totalFitness, reproduction.spawned);

  const hasOffspring = isIteroparous && reproduction.offspring.length > 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        You Have Died
      </h1>

      {lineage && lineage.generation > 1 && (
        <div className={styles.generation}>
          Generation {lineage.generation}
        </div>
      )}

      <p className={styles.causeOfDeath}>
        {animal.causeOfDeath || 'Your body could no longer sustain the burden of survival.'}
      </p>

      {/* ── Fitness Score ── */}
      <div className={styles.fitnessBox}>
        <div className={styles.fitnessLabel}>
          Inclusive Genetic Fitness
        </div>
        <div className={styles.fitnessNumber} style={{ color: rating.color }}>
          {reproduction.totalFitness}
        </div>
        <div className={styles.fitnessCaption}>
          {isSemelparous
            ? 'estimated surviving adults from eggs'
            : 'offspring survived to reproductive age'
          }
        </div>
        <div className={styles.fitnessRating} style={{ color: rating.color }}>
          {rating.label}
        </div>
      </div>

      {/* ── Semelparous Egg Breakdown ── */}
      {isSemelparous && reproduction.spawned && (
        <div className={styles.detailPanelEggs}>
          <div className={styles.panelHeading}>
            Spawning Results
          </div>
          <div><strong>Eggs Spawned:</strong> {reproduction.eggCount.toLocaleString()}</div>
          <div><strong>Estimated Surviving Adults:</strong> {reproduction.estimatedSurvivors}</div>
        </div>
      )}

      {/* ── Iteroparous Offspring Breakdown ── */}
      {hasOffspring && isIteroparous && (
        <div className={styles.detailPanel}>
          <div className={styles.panelHeading}>
            Offspring
          </div>
          {reproduction.offspring.map((o) => (
            <div key={o.id} className={styles.offspringRow}>
              <span>
                {o.sex === 'female' ? '\u2640' : '\u2642'}{' '}
                {tv.youngNoun.charAt(0).toUpperCase() + tv.youngNoun.slice(1)} (born Year {o.bornInYear})
                {o.siredByPlayer && <span className={styles.siredTag}> — sired</span>}
              </span>
              <span className={offspringFateClass(o)}>
                {offspringFate(o)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Summary Stats ── */}
      <div className={styles.detailPanelSummary}>
        <div><strong>Species:</strong> {config.name}</div>
        <div><strong>Sex:</strong> {animal.sex === 'female' ? 'Female' : 'Male'}</div>
        <div><strong>Age at death:</strong> {animal.age} months ({Math.floor(animal.age / 12)} years)</div>
        <div><strong>Final weight:</strong> {formatWeight(animal.weight, config)}</div>
        <div><strong>Survived:</strong> {time.turn} turns ({time.month}, Year {time.year})</div>
        <div><strong>Parasites contracted:</strong> {animal.parasites.length}</div>
        <div><strong>Injuries sustained:</strong> {animal.injuries.length}</div>
        <div><strong>Events experienced:</strong> {turnHistory.length} turns</div>
      </div>

      <RunSummary />

      <AchievementList />

      <button
        onClick={() => {
          deleteSaveGame();
          window.location.reload();
        }}
        className={styles.startOverButton}
      >
        Start Over
      </button>
    </div>
  );
}
