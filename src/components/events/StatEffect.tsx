import { StatId } from '../../types/stats';
import styles from '../../styles/events.module.css';

// Stats where higher = worse for the animal (stress/burden stats)
const NEGATIVE_POLARITY_STATS = new Set<string>([
  StatId.IMM, StatId.CLI, StatId.HOM,
  StatId.TRA, StatId.ADV, StatId.NOV, StatId.STR,
]);

interface StatEffectProps {
  label: string; // e.g., "-TRA", "+HOM"
}

export function StatEffect({ label }: StatEffectProps) {
  // Parse direction and stat ID from label like "+TRA" or "-HEA (exhaustion)"
  const isIncrease = label.startsWith('+');
  const statId = label.replace(/^[+-]/, '').split(' ')[0].split('(')[0].trim();
  const isStressStat = NEGATIVE_POLARITY_STATS.has(statId as StatId);

  // Good for the animal: decreasing stress stats OR increasing positive stats
  const isGoodForAnimal = isStressStat ? !isIncrease : isIncrease;
  const colorClass = isGoodForAnimal ? styles.effectPositive : styles.effectNegative;

  return <span className={`${styles.statEffect} ${colorClass}`}>{label}</span>;
}
