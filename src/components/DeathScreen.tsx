import { useGameStore } from '../store/gameStore';
import { deleteSaveGame } from '../store/persistence';
import { AchievementList } from './achievements/AchievementList';
import { RunSummary } from './RunSummary';
import { DebriefingPanel } from './DebriefingPanel';
import { CausalChainPanel } from './CausalChainPanel';
import { formatWeight } from '../utils/formatWeight';
import { pluralize } from '../utils/pluralize';
import { describeTurnSpan, formatAge } from '../utils/timeSpan';
import { getLifeOutcome } from '../engine/LifeOutcome';
import { isCaptive } from '../engine/captivity';
import type { Offspring } from '../types/reproduction';
import type { SpeciesConfig } from '../types/speciesConfig';
import { useAchievementStore } from '../store/achievementStore';
import { SPECIES_UNLOCKS } from '../data/speciesUnlocks';
import { ACHIEVEMENTS } from '../data/achievements';
import { getAllSpeciesBundles } from '../data/species';
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

function offspringFate(o: Offspring, turnUnit: SpeciesConfig['turnUnit']): string {
  if (o.matured) return 'Survived to reproductive age';
  if (!o.alive) return o.causeOfDeath || 'Died';
  return `Alive — ${describeTurnSpan(o.ageTurns, turnUnit)} old`;
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
  const scenario = useGameStore((s) => s.scenario);
  const scenarioOutcome = useGameStore((s) => s.scenarioOutcome);
  const tv = config.templateVars;

  const isIteroparous = reproduction.type === 'iteroparous';
  const isSemelparous = reproduction.type === 'semelparous';

  const outcome = getLifeOutcome(animal, reproduction, config);
  const hasOffspring = isIteroparous && reproduction.offspring.length > 0;
  const isMale = animal.sex === 'male';

  // Fathers sire offspring; mothers give birth to them (a litter counts once)
  const broodCount = !isIteroparous
    ? (reproduction.spawned ? 1 : 0)
    : isMale
      ? reproduction.offspring.length
      : new Set(reproduction.offspring.map(o => o.bornOnTurn)).size;

  const broodLabel = config.id === 'honeybee-worker' ? 'Major contributions'
    : isSemelparous ? 'Spawning events'
    : isMale ? 'Offspring sired'
    : config.reproduction.type === 'iteroparous' && config.reproduction.offspringCountFormula.maxOffspring > 1
      ? 'Litters produced'
      : 'Births given';

  const eventsExperienced = turnHistory.reduce((n, record) => n + record.events.length, 0);

  // Performance highlighting logic
  const lifeExpectancy = config.age.oldAgeOnsetMonths;
  const isPrematureDeath = animal.age < lifeExpectancy * 0.5;
  const isLongLife = animal.age >= lifeExpectancy;
  const ageColorClass = isLongLife ? styles.goodPerformance : (isPrematureDeath ? styles.poorPerformance : '');

  const avgFitness = SPECIES_AVG_FITNESS[config.id] ?? 2;
  const fitnessColorClass = reproduction.totalFitness > avgFitness ? styles.goodPerformance : (reproduction.totalFitness < avgFitness * 0.5 ? styles.poorPerformance : '');

  // Find species unlocked by achievements from the current species
  const unlockedAchievements = useAchievementStore((s) => s.unlockedIds);
  const allBundles = getAllSpeciesBundles();
  const speciesUnlockedThisRun = SPECIES_UNLOCKS.filter((u) => {
    if (u.requirement.type !== 'achievement') return false;
    const req = u.requirement;
    if (!unlockedAchievements.has(req.achievementId)) return false;
    // Only show unlock for achievements tied to the current species
    const achDef = ACHIEVEMENTS.find((a) => a.id === req.achievementId);
    if (!achDef?.species) return false;
    const speciesList = Array.isArray(achDef.species) ? achDef.species : [achDef.species];
    return speciesList.includes(config.id);
  }).map((u) => {
    const bundle = allBundles.find((b) => b.config.id === u.speciesId);
    return bundle ? bundle.config.name : u.speciesId;
  });

  // Find top food source
  const topFoodEntry = Object.entries(animal.lifetimeStats.foodSources).sort((a, b) => b[1] - a[1])[0];
  const favoriteFood = topFoodEntry 
    ? topFoodEntry[0].split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : null;

  // Wandering and weather don't apply to an animal that never left its pen
  const captive = isCaptive(config);
  const { friendsMade, rivalsDefeated, predatorsEvaded, preyEaten } = animal.lifetimeStats;
  const hasLifetimeStats = !captive || friendsMade > 0 || rivalsDefeated > 0
    || predatorsEvaded > 0 || preyEaten > 0 || !!favoriteFood;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        You Have Died
      </h1>

      <div className={styles.generation}>
        Generation {lineage?.generation ?? 1} of {animal.lifetimeStats.maxGeneration}
      </div>

      <p className={styles.causeOfDeath}>
        {animal.causeOfDeath || 'Your body could no longer sustain the burden of survival.'}
      </p>

      <CausalChainPanel />

      {/* ── Reproductive outcome (a biological result, not a score of the player) ── */}
      <div className={styles.fitnessBox}>
        <div className={styles.fitnessLabel}>
          Reproductive Success
        </div>
        {outcome.grade ? (
          <>
            <div className={styles.gradeLetter} style={{ color: outcome.grade.color }}>
              {outcome.grade.letter}
            </div>
            <div className={styles.fitnessNote}>Offspring that survived to adulthood</div>
          </>
        ) : (
          <div className={styles.fitnessNote}>{outcome.note}</div>
        )}
      </div>

      {/* ── Species Unlock Notification ── */}
      {speciesUnlockedThisRun.length > 0 && (
        <div className={styles.unlockNotification}>
          <div className={styles.unlockIcon}>&#x1F513;</div>
          <div>
            <div className={styles.unlockTitle}>New Species Unlocked!</div>
            {speciesUnlockedThisRun.map((name) => (
              <div key={name} className={styles.unlockSpeciesName}>{name}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── Summary Stats ── */}
      <div className={styles.detailPanelSummary}>
        {scenario && (
          <div>
            <strong>Challenge:</strong> {scenario.name} —{' '}
            {scenarioOutcome?.status === 'won' ? 'completed' : 'not completed'}
          </div>
        )}
        <div><strong>Species:</strong> {config.name}</div>
        <div><strong>Sex:</strong> {animal.sex === 'female' ? 'Female' : 'Male'}</div>
        <div>
          <strong>Age at death:</strong>{' '}
          <span className={ageColorClass}>
            {formatAge(animal.age, time.turn, config.turnUnit)}
          </span>
          {isLongLife && ' \u2014 Exceptional Longevity!'}
          {isPrematureDeath && ' \u2014 Premature Death'}
        </div>
        <div><strong>Final weight:</strong> {formatWeight(animal.weight, config)}</div>
        <div>
          <strong>Survived:</strong> {describeTurnSpan(time.turn, config.turnUnit)} ({pluralize(time.turn, 'turn')}),
          until {time.month}, Year {time.year}
        </div>
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
          <strong>Events experienced:</strong> {eventsExperienced}
        </div>
        <div><strong>Parasites contracted:</strong> {animal.parasites.length}</div>
        <div><strong>Injuries sustained:</strong> {animal.injuries.length}</div>
      </div>

      {/* ── Lifetime Achievements ── */}
      {hasLifetimeStats && <div className={styles.lifetimeStatsPanel}>
        <div className={styles.panelHeading}>
          Lifetime Achievements
        </div>
        <div className={styles.statsGrid}>
          {animal.lifetimeStats.friendsMade > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{animal.lifetimeStats.friendsMade}</span>
              <span className={styles.statLabel}>Friends Made</span>
            </div>
          )}
          {animal.lifetimeStats.rivalsDefeated > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{animal.lifetimeStats.rivalsDefeated}</span>
              <span className={styles.statLabel}>Rivals Defeated</span>
            </div>
          )}
          {animal.lifetimeStats.predatorsEvaded > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{animal.lifetimeStats.predatorsEvaded}</span>
              <span className={styles.statLabel}>Predators Evaded</span>
            </div>
          )}
          {animal.lifetimeStats.preyEaten > 0 && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>{animal.lifetimeStats.preyEaten}</span>
              <span className={styles.statLabel}>Prey Eaten</span>
            </div>
          )}
          {favoriteFood && (
            <div className={styles.statItem}>
              <span className={styles.statValue} style={{ fontSize: '1rem', lineHeight: 1.2 }}>{favoriteFood}</span>
              <span className={styles.statLabel}>Top Food Source</span>
            </div>
          )}
          {!captive && (
            <>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{animal.lifetimeStats.distanceTraveled}</span>
                <span className={styles.statLabel}>Nodes Traversed</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{animal.lifetimeStats.weatherEventsSurvived}</span>
                <span className={styles.statLabel}>Severe Weather Turns</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{animal.lifetimeStats.regionsVisited.length}</span>
                <span className={styles.statLabel}>Regions Explored</span>
              </div>
            </>
          )}
        </div>
      </div>}

      {/* ── Genetic Legacy ── */}
      {animal.activeMutations.length > 0 && (
        <div className={styles.detailPanel}>
          <div className={styles.panelHeading}>
            Genetic Traits Acquired
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {animal.activeMutations.map(m => (
              <div key={m.id} style={{ 
                background: 'rgba(142, 68, 173, 0.1)', 
                color: 'var(--color-accent)',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid rgba(142, 68, 173, 0.2)'
              }}>
                {m.name}
              </div>
            ))}
          </div>
        </div>
      )}

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
                {offspringFate(o, config.turnUnit)}
              </span>
            </div>
          ))}
        </div>
      )}

      <DebriefingPanel />

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
