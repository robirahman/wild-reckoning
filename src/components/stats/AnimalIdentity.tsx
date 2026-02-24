import { useGameStore } from '../../store/gameStore';
import { formatWeight } from '../../utils/formatWeight';
import styles from '../../styles/stats.module.css';

export function AnimalIdentity() {
  const animal = useGameStore((s) => s.animal);
  const reproduction = useGameStore((s) => s.reproduction);
  const config = useGameStore((s) => s.speciesBundle.config);
  const sexSymbol = animal.sex === 'female' ? '\u2640' : '\u2642';
  const tv = config.templateVars;

  const pregnancyWeeks = reproduction.type === 'iteroparous' && reproduction.pregnancy
    ? reproduction.pregnancy.turnsRemaining
    : null;

  const dependentYoung = reproduction.type === 'iteroparous'
    ? reproduction.offspring.filter((o) => o.alive && !o.independent).length
    : 0;

  // Determine lifecycle phase for species with phases
  const currentPhase = config.phases?.slice().reverse().find(
    (p) => !p.entryFlag || animal.flags.has(p.entryFlag)
  );

  const agePhase = config.agePhases.find(
    (p) => animal.age >= p.minAge && (p.maxAge === undefined || animal.age < p.maxAge)
  );

  return (
    <div className={styles.identity}>
      <div className={styles.identityMain}>
        <span className={styles.speciesName}>{config.name}</span>
        <span className={styles.region}>({tv.regionName})</span>
      </div>
      <div className={styles.identityDetails}>
        <span>{animal.age} months old</span>
        <span className={styles.separator}>|</span>
        <span>{formatWeight(animal.weight, config)}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.sexSymbol}>{sexSymbol}</span>
        {agePhase && (
          <>
            <span className={styles.separator}>|</span>
            <span>{agePhase.label}</span>
          </>
        )}
      </div>
      {animal.backstory.monthsSinceEvent > 0 && (
        <div className={styles.backstoryNote}>
          {animal.backstory.monthsSinceEvent} months since {animal.backstory.label.toLowerCase()}
        </div>
      )}
      {currentPhase && config.phases && config.phases.length > 1 && (
        <div className={styles.statusNote}>
          {currentPhase.label}
        </div>
      )}
      {pregnancyWeeks !== null && (
        <div className={styles.statusNote}>
          Pregnant — {pregnancyWeeks} weeks until birth
        </div>
      )}
      {dependentYoung > 0 && (
        <div className={styles.statusNote}>
          Caring for {dependentYoung} dependent {dependentYoung > 1 ? tv.youngNounPlural : tv.youngNoun}
        </div>
      )}
    </div>
  );
}
