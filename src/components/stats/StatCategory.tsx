import { StatBar } from './StatBar';
import { StatId, StatCategory as StatCategoryEnum } from '../../types';
import type { StatModifier } from '../../types/stats';
import type { StatTrend } from './StatsPanel';
import styles from '../../styles/stats.module.css';

interface StatCategoryProps {
  label: StatCategoryEnum;
  stats: StatId[];
  values: Record<StatId, number>;
  trends: Record<StatId, StatTrend>;
  modifiers: StatModifier[];
}

export function StatCategory({ label, stats, values, trends, modifiers }: StatCategoryProps) {
  return (
    <div className={styles.category}>
      <h4 className={styles.categoryLabel}>{label} =</h4>
      {stats.map((statId) => (
        <StatBar
          key={statId}
          statId={statId}
          value={values[statId]}
          trend={trends[statId]}
          modifiers={modifiers}
        />
      ))}
    </div>
  );
}
