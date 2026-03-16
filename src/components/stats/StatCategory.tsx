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
  highlightedStat?: string | null;
}

export function StatCategory({ label, stats, values, trends, modifiers, highlightedStat }: StatCategoryProps) {
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
          highlighted={highlightedStat === statId}
        />
      ))}
    </div>
  );
}
