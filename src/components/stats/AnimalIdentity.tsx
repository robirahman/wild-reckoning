import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/stats.module.css';

export function AnimalIdentity() {
  const animal = useGameStore((s) => s.animal);
  const reproduction = useGameStore((s) => s.reproduction);
  const sexSymbol = animal.sex === 'female' ? '\u2640' : '\u2642';

  const backstoryNote = animal.backstory.type === 'rehabilitation'
    ? `${animal.backstory.monthsSinceEvent} months post-rehabilitation`
    : animal.backstory.type === 'orphaned'
    ? `${animal.backstory.monthsSinceEvent} months since orphaned`
    : undefined;

  const pregnancyWeeks = reproduction.pregnancy
    ? reproduction.pregnancy.turnsRemaining
    : null;

  const dependentFawns = reproduction.offspring.filter(
    (o) => o.alive && !o.independent,
  ).length;

  return (
    <div className={styles.identity}>
      <div className={styles.identityMain}>
        <span className={styles.speciesName}>White-Tailed Deer</span>
        <span className={styles.region}>(Northern Minnesota)</span>
      </div>
      <div className={styles.identityDetails}>
        <span>{animal.age} months old</span>
        <span className={styles.separator}>|</span>
        <span>{animal.weight} lbs</span>
        <span className={styles.separator}>|</span>
        <span className={styles.sexSymbol}>{sexSymbol}</span>
      </div>
      {backstoryNote && (
        <div className={styles.backstoryNote}>{backstoryNote}</div>
      )}
      {pregnancyWeeks !== null && (
        <div className={styles.statusNote}>
          Pregnant — {pregnancyWeeks} weeks until birth
        </div>
      )}
      {dependentFawns > 0 && (
        <div className={styles.statusNote}>
          Caring for {dependentFawns} dependent fawn{dependentFawns > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
