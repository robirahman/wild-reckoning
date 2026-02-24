import { useState } from 'react';
import { StatId, STAT_NAMES, STAT_POLARITY, STAT_DESCRIPTIONS, getStatLevel } from '../../types';
import type { StatModifier } from '../../types/stats';
import type { StatTrend } from './StatsPanel';
import styles from '../../styles/stats.module.css';

interface StatBarProps {
  statId: StatId;
  value: number; // 0-100
  trend?: StatTrend;
  modifiers?: StatModifier[];
}

export function StatBar({ statId, value, trend, modifiers }: StatBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const name = STAT_NAMES[statId];
  const level = getStatLevel(value);
  const polarity = STAT_POLARITY[statId];
  const description = STAT_DESCRIPTIONS[statId];

  const sign = statId === StatId.STR
    ? (value > 50 ? '-' : '+')
    : '+';

  const barColorClass = polarity === 'negative'
    ? styles.barFillNegative
    : styles.barFillPositive;

  // Trend arrow
  let trendArrow = '';
  let trendClass = styles.trendStable;
  if (trend === 'up') {
    trendArrow = '\u25B2';
    trendClass = polarity === 'negative' ? styles.trendBad : styles.trendGood;
  } else if (trend === 'down') {
    trendArrow = '\u25BC';
    trendClass = polarity === 'negative' ? styles.trendGood : styles.trendBad;
  }

  const activeModifiers = modifiers?.filter((m) => m.stat === statId) ?? [];
  const polarityLabel = polarity === 'negative' ? 'Higher is worse' : 'Higher is better';

  return (
    <div
      className={styles.statBar}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="meter"
      aria-label={`${name}: ${value}`}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.statNameRow}>
        <span className={styles.statName}>{name}</span>
        {trend && trend !== 'stable' && (
          <span className={`${styles.trendArrow} ${trendClass}`}>{trendArrow}</span>
        )}
      </div>
      <div className={styles.barContainer}>
        <div
          className={`${styles.barFill} ${barColorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={styles.statLevel}>{sign} {level}</span>

      {showTooltip && (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDesc}>{description}</p>
          <p className={styles.tooltipPolarity}>{polarityLabel}</p>
          {activeModifiers.length > 0 && (
            <div className={styles.tooltipModifiers}>
              <p className={styles.tooltipModTitle}>Active modifiers:</p>
              {activeModifiers.map((m, i) => (
                <p key={i} className={styles.tooltipMod}>
                  <span className={m.amount > 0 ? styles.tooltipModPos : styles.tooltipModNeg}>
                    {m.amount > 0 ? '+' : ''}{m.amount}
                  </span>
                  {' '}{m.source}
                  {m.duration !== undefined && ` (${m.duration}t)`}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
