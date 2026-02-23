import { StatId, STAT_NAMES, STAT_POLARITY, getStatLevel } from '../../types';
import styles from '../../styles/stats.module.css';

interface StatBarProps {
  statId: StatId;
  value: number; // 0-100
}

export function StatBar({ statId, value }: StatBarProps) {
  const name = STAT_NAMES[statId];
  const level = getStatLevel(value);
  const polarity = STAT_POLARITY[statId];

  // For display: stress stats show "+" when they have pressure,
  // fitness stats show "+" for positive, "-" for low
  const sign = statId === StatId.STR
    ? (value > 50 ? '-' : '+')
    : '+';

  const barColorClass = polarity === 'negative'
    ? styles.barFillNegative
    : styles.barFillPositive;

  return (
    <div className={styles.statBar}>
      <span className={styles.statName}>{name}</span>
      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${barColorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={styles.statLevel}>{sign} {level}</span>
    </div>
  );
}
