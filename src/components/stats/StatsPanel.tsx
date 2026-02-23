import { AnimalIdentity } from './AnimalIdentity';
import { StatCategory } from './StatCategory';
import { useGameStore } from '../../store/gameStore';
import { StatId, StatCategory as StatCategoryEnum, computeEffectiveValue } from '../../types';
import styles from '../../styles/stats.module.css';

const CATEGORIES = [
  {
    label: StatCategoryEnum.PHYSICAL,
    stats: [StatId.IMM, StatId.CLI, StatId.HOM] as StatId[],
  },
  {
    label: StatCategoryEnum.MENTAL,
    stats: [StatId.TRA, StatId.ADV, StatId.NOV] as StatId[],
  },
  {
    label: StatCategoryEnum.FITNESS,
    stats: [StatId.WIS, StatId.HEA, StatId.STR] as StatId[],
  },
];

export function StatsPanel() {
  const stats = useGameStore((s) => s.animal.stats);

  // Compute effective values for display
  const effectiveValues = {} as Record<StatId, number>;
  for (const statId of Object.values(StatId)) {
    effectiveValues[statId] = computeEffectiveValue(stats[statId]);
  }

  return (
    <div className={styles.statsPanel}>
      <h2 className={styles.title}>Your Stats</h2>
      <AnimalIdentity />
      <div className={styles.categories}>
        {CATEGORIES.map((cat) => (
          <StatCategory
            key={cat.label}
            label={cat.label}
            stats={cat.stats}
            values={effectiveValues}
          />
        ))}
      </div>
    </div>
  );
}
