import { useGameStore } from '../store/gameStore';
import { deleteSaveGame } from '../store/persistence';
import { AchievementList } from './achievements/AchievementList';
import { RunSummary } from './RunSummary';
import { formatWeight } from '../utils/formatWeight';
import type { Offspring } from '../types/reproduction';
import styles from '../styles/deathscreen.module.css';

const SPECIES_AVG_FITNESS: Record<string, number> = {
  'white-tailed-deer': 2,
  'gray-wolf': 2,
  'polar-bear': 1.5,
  'african-elephant': 1,
  'arctic-tern': 1.5,
  'chinook-salmon': 5,
  'common-octopus': 5,
  'poison-dart-frog': 4,
  'green-sea-turtle': 2,
  'monarch-butterfly': 2,
  'fig-wasp': 2,
  'honeybee-worker': 50,
};

function getGrade(fitness: number, type: 'iteroparous' | 'semelparous'): { letter: string; color: string } {
  if (fitness === 0) return { letter: 'F', color: 'var(--color-danger)' };
  
  if (type === 'iteroparous') {
    if (fitness === 1) return { letter: 'D', color: '#c87533' };
    if (fitness === 2) return { letter: 'C', color: 'var(--color-text)' };
    if (fitness <= 4) return { letter: 'B', color: '#5a9e5a' };
    return { letter: 'A', color: '#3a8a3a' };
  } else {
    // Semelparous scale (estimated survivors)
    if (fitness <= 2) return { letter: 'D', color: '#c87533' };
    if (fitness <= 5) return { letter: 'C', color: 'var(--color-text)' };
    if (fitness <= 12) return { letter: 'B', color: '#5a9e5a' };
    return { letter: 'A', color: '#3a8a3a' };
  }
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

  const grade = getGrade(reproduction.totalFitness, reproduction.type);
  const hasOffspring = isIteroparous && reproduction.offspring.length > 0;

  // Calculate broods/births
  const broodCount = isIteroparous 
    ? new Set(reproduction.offspring.map(o => o.bornOnTurn)).size
    : (reproduction.spawned ? 1 : 0);
    
  const broodLabel = config.id === 'honeybee-worker' ? 'Major contributions' 
    : (isSemelparous ? 'Spawning events' : (config.reproduction.type === 'iteroparous' && config.reproduction.offspringCountFormula.maxOffspring > 1 ? 'Litters produced' : 'Births given'));

  // Performance highlighting logic
  const lifeExpectancy = config.age.oldAgeOnsetMonths;
  const isPrematureDeath = animal.age < lifeExpectancy * 0.5;
  const isLongLife = animal.age >= lifeExpectancy;
  const ageColorClass = isLongLife ? styles.goodPerformance : (isPrematureDeath ? styles.poorPerformance : '');

  const avgFitness = SPECIES_AVG_FITNESS[config.id] ?? 2;
  const fitnessColorClass = reproduction.totalFitness > avgFitness ? styles.goodPerformance : (reproduction.totalFitness < avgFitness * 0.5 ? styles.poorPerformance : '');

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

      {/* ── Survival Grade ── */}
      <div className={styles.fitnessBox}>
        <div className={styles.fitnessLabel}>
          Life Success Grade
        </div>
        <div className={styles.gradeLetter} style={{ color: grade.color }}>
          {grade.letter}
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className={styles.detailPanelSummary}>
        <div><strong>Species:</strong> {config.name}</div>
        <div><strong>Sex:</strong> {animal.sex === 'female' ? 'Female' : 'Male'}</div>
        <div>
          <strong>Age at death:</strong>{' '}
          <span className={ageColorClass}>
            {animal.age} months ({Math.floor(animal.age / 12)} years)
          </span>
          {isLongLife && ' \u2014 Exceptional Longevity!'}
          {isPrematureDeath && ' \u2014 Premature Death'}
        </div>
        <div><strong>Final weight:</strong> {formatWeight(animal.weight, config)}</div>
        <div><strong>Survived:</strong> {time.turn} turns ({time.month}, Year {time.year})</div>
        <div style={{ marginTop: 8, borderTop: '1px solid var(--color-border-light)', paddingTop: 8 }}>
          <strong>{broodLabel}:</strong> {broodCount}
        </div>
        <div>
          <strong>Offspring survived to adulthood:</strong>{' '}
          <span className={fitnessColorClass}>
            {reproduction.totalFitness}
          </span>
        </div>
        <div style={{ marginTop: 8, borderTop: '1px solid var(--color-border-light)', paddingTop: 8 }}>
          <strong>Events experienced:</strong> {turnHistory.length} turns
        </div>
        <div><strong>Parasites contracted:</strong> {animal.parasites.length}</div>
        <div><strong>Injuries sustained:</strong> {animal.injuries.length}</div>
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
            Offspring Records
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
