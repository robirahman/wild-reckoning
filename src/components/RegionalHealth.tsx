import { useGameStore } from '../store/gameStore';
import { StatId } from '../types/stats';
import styles from '../styles/stats.module.css';

export function RegionalHealth() {
  const ecosystem = useGameStore((s) => s.ecosystem);
  const animalRegion = useGameStore((s) => s.animal.region);
  
  if (!ecosystem) return null;

  // Filter populations relevant to current region logic could go here
  // For now, show top 3 fluctuating populations
  const populations = Object.values(ecosystem.populations)
    .filter(p => Math.abs(p.level) > 0.5)
    .sort((a, b) => Math.abs(b.level) - Math.abs(a.level))
    .slice(0, 3);

  const pressureColor = ecosystem.resourcePressure > 70 ? 'var(--color-danger)' 
    : ecosystem.resourcePressure > 40 ? 'var(--color-warning)' 
    : 'var(--color-success)';

  return (
    <div className={styles.statGroup}>
      <h3 className={styles.groupTitle}>Regional Ecosystem</h3>
      
      <div className={styles.statRow}>
        <span className={styles.statLabel}>Resource Pressure</span>
        <div className={styles.statValue} style={{ color: pressureColor }}>
          {ecosystem.resourcePressure.toFixed(0)}%
        </div>
      </div>

      {populations.map((pop) => (
        <div key={pop.speciesName} className={styles.statRow}>
          <span className={styles.statLabel}>{pop.speciesName}</span>
          <div className={styles.statValue}>
            {pop.trend === 'growing' && '↑'}
            {pop.trend === 'declining' && '↓'}
            {pop.trend === 'stable' && '—'}
            {' '}
            {pop.level > 0 ? '+' : ''}{pop.level.toFixed(1)}
          </div>
        </div>
      ))}
      
      {populations.length === 0 && (
        <div className={styles.statRow}>
          <span className={styles.statLabel} style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Ecosystem Stable
          </span>
        </div>
      )}
    </div>
  );
}
