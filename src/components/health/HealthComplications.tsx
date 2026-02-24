import { useGameStore } from '../../store/gameStore';
import { InjuryCard } from './InjuryCard';
import styles from '../../styles/health.module.css';

export function HealthComplications() {
  const injuries = useGameStore((s) => s.animal.injuries);

  if (injuries.length === 0) return null;

  return (
    <section className={styles.healthSection}>
      <h3 className={styles.sectionTitle}>Health Complications</h3>
      {injuries.map((injury) => (
        <InjuryCard
          key={`${injury.definitionId}-${injury.bodyPartDetail}`}
          name={injury.definitionId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          description={`Your ${injury.bodyPartDetail} was injured. ${injury.turnsRemaining} turns remaining until healed${injury.isResting ? ' (resting)' : ' (not resting — risk of worsening)'}.`}
        />
      ))}
    </section>
  );
}
