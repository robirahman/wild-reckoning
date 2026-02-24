import styles from '../../styles/events.module.css';

interface StatEffectProps {
  label: string; // e.g., "-TRA", "+HOM"
}

export function StatEffect({ label }: StatEffectProps) {
  const isPositive = label.startsWith('-'); // Reducing stress = positive for the animal
  const colorClass = isPositive ? styles.effectPositive : styles.effectNegative;

  return <span className={`${styles.statEffect} ${colorClass}`}>{label}</span>;
}
