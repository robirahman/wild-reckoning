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
  highlighted?: boolean;
}

// Stat color: red for negative-polarity stats (higher=worse), green for positive (higher=better)
function getStatColor(polarity: 'positive' | 'negative'): string {
  return polarity === 'negative' ? '#c04040' : '#4a8a4a';
}

export function StatBar({ statId, value, trend, modifiers, highlighted }: StatBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const name = STAT_NAMES[statId];
  const level = getStatLevel(value);
  const polarity = STAT_POLARITY[statId];
  const description = STAT_DESCRIPTIONS[statId];

  const sign = statId === StatId.STR
    ? (value > 50 ? '-' : '+')
    : '+';

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

  // Gradient bar: gray on left → stat color on right.
  // The bar fills to value%, and opacity encodes the magnitude.
  const statColor = getStatColor(polarity);
  // Opacity ranges from 0.15 (at value=0) to 1.0 (at value=100)
  const fillOpacity = 0.15 + (value / 100) * 0.85;
  const barStyle = {
    width: '100%',
    background: `linear-gradient(to right, var(--color-bar-bg), ${statColor})`,
    opacity: fillOpacity,
  };

  return (
    <div
      className={`${styles.statBar}${highlighted ? ` ${styles.statBarHighlighted}` : ''}`}
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
          className={styles.barFill}
          style={barStyle}
        />
      </div>
      <span className={styles.statLevel}>{sign} {level}</span>

      {showTooltip && (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDesc}>{description}</p>
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
