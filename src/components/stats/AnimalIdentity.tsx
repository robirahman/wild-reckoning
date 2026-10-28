import { useGameStore } from '../../store/gameStore';
import { formatWeight } from '../../utils/formatWeight';
import { describeTurnSpan, formatAge } from '../../utils/timeSpan';
import styles from '../../styles/stats.module.css';

export function AnimalIdentity() {
  const animal = useGameStore((s) => s.animal);
  const reproduction = useGameStore((s) => s.reproduction);
  const config = useGameStore((s) => s.speciesBundle.config);
  const turn = useGameStore((s) => s.time.turn);
  const sexSymbol = animal.sex === 'female' ? '\u2640' : '\u2642';
  const tv = config.templateVars;

  const pregnancyTurnsLeft = reproduction.type === 'iteroparous' && reproduction.pregnancy
    ? reproduction.pregnancy.turnsRemaining
    : null;

  // Short-term stamina vs. long-term fat reserves: two different things, shown as words
  const stamina = animal.energy >= 70 ? 'Rested'
    : animal.energy >= 35 ? 'Tired'
    : animal.energy >= 10 ? 'Worn out'
    : 'Exhausted';
  const bodyCondition = animal.physiologyState
    ? ['Emaciated', 'Thin', 'Good', 'Well fed', 'Fat'][animal.physiologyState.bodyConditionScore - 1]
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
        <span>{formatAge(animal.age, turn, config.turnUnit)} old</span>
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
      <div className={styles.conditionNote}>
        <span title="Short-term energy for moving and acting. It comes back with rest.">Stamina: {stamina}</span>
        {bodyCondition && (
          <>
            <span className={styles.separator}>|</span>
            <span title="Fat reserves built up over weeks of eating well, or burned by going hungry.">Body condition: {bodyCondition}</span>
          </>
        )}
      </div>
      {/* Who the animal is. A count of months "since" reads wrong for labels
          like "Pack-Raised", and the age above already shows time passing. */}
      <div className={styles.backstoryNote}>{animal.backstory.label}</div>
      {currentPhase && config.phases && config.phases.length > 1 && (
        <div className={styles.statusNote}>
          {currentPhase.label}
        </div>
      )}
      {pregnancyTurnsLeft !== null && (
        <div className={styles.statusNote}>
          Pregnant — {describeTurnSpan(pregnancyTurnsLeft, config.turnUnit)} until birth
        </div>
      )}
      {dependentYoung > 0 && (
        <div className={styles.statusNote}>
          Caring for {dependentYoung} dependent {dependentYoung > 1 ? tv.youngNounPlural : tv.youngNoun}
        </div>
      )}
      {animal.activeMutations.length > 0 && (
        <div className={styles.mutationsList}>
          {animal.activeMutations.map((m) => (
            <span key={m.id} className={styles.mutationBadge} title={m.description}>
              🧬 {m.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
