import { useMemo } from 'react';
import { AnimalIdentity } from './AnimalIdentity';
import { StatCategory } from './StatCategory';
import { useGameStore } from '../../store/gameStore';
import { StatId, StatCategory as StatCategoryEnum, computeEffectiveValue } from '../../types';
import type { StatModifier } from '../../types/stats';
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

export type StatTrend = 'up' | 'down' | 'stable';

function computeTrends(
  current: Record<StatId, number>,
  history: { statSnapshot: Record<StatId, number> }[],
): Record<StatId, StatTrend> {
  const trends = {} as Record<StatId, StatTrend>;
  const lookback = history.slice(-4);

  for (const statId of Object.values(StatId)) {
    if (lookback.length === 0) {
      trends[statId] = 'stable';
      continue;
    }

    const pastValues = lookback
      .map((r) => r.statSnapshot[statId])
      .filter((v) => v !== undefined && v !== 0);

    if (pastValues.length === 0) {
      trends[statId] = 'stable';
      continue;
    }

    const avg = pastValues.reduce((a, b) => a + b, 0) / pastValues.length;
    const delta = current[statId] - avg;

    if (delta > 3) trends[statId] = 'up';
    else if (delta < -3) trends[statId] = 'down';
    else trends[statId] = 'stable';
  }

  return trends;
}

export function StatsPanel() {
  const stats = useGameStore((s) => s.animal.stats);
  const turnHistory = useGameStore((s) => s.turnHistory);

  // Compute effective values for display
  const effectiveValues = {} as Record<StatId, number>;
  for (const statId of Object.values(StatId)) {
    effectiveValues[statId] = computeEffectiveValue(stats[statId]);
  }

  // Collect all modifiers for tooltips
  const allModifiers: StatModifier[] = [];
  for (const statId of Object.values(StatId)) {
    allModifiers.push(...stats[statId].modifiers);
  }

  const trends = useMemo(
    () => computeTrends(effectiveValues, turnHistory),
    [effectiveValues, turnHistory],
  );

  const social = useGameStore((s) => s.animal.social);

  return (
    <div className={styles.statsPanel}>
      <h2 className={styles.title}>Your Stats</h2>
      <AnimalIdentity />
      {social.rank !== 'lone' && (
        <div style={{ 
          marginBottom: 16, 
          padding: '8px 12px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: 4,
          fontFamily: 'var(--font-ui)',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Pack Rank: </span>
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{social.rank}</span>
          <span style={{ marginLeft: 8, fontSize: '0.8rem' }}>(Dominance: {social.dominance})</span>
        </div>
      )}
      <div className={styles.categories}>
        {CATEGORIES.map((cat) => (
          <StatCategory
            key={cat.label}
            label={cat.label}
            stats={cat.stats}
            values={effectiveValues}
            trends={trends}
            modifiers={allModifiers}
          />
        ))}
      </div>
    </div>
  );
}
