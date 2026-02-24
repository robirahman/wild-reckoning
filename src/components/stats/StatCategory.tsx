import { StatBar } from './StatBar';
import { StatId, StatCategory as StatCategoryEnum } from '../../types';
import styles from '../../styles/stats.module.css';

interface StatCategoryProps {
  label: StatCategoryEnum;
  stats: StatId[];
  values: Record<StatId, number>;
}

export function StatCategory({ label, stats, values }: StatCategoryProps) {
  return (
    <div className={styles.category}>
      <h4 className={styles.categoryLabel}>{label} =</h4>
      {stats.map((statId) => (
        <StatBar key={statId} statId={statId} value={values[statId]} />
      ))}
    </div>
  );
}
