import type { EventOutcome } from '../../types/turnResult';
import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/results.module.css';

interface EventOutcomeCardProps {
  outcome: EventOutcome;
  index: number;
}

export function EventOutcomeCard({ outcome, index }: EventOutcomeCardProps) {
  const parasiteDefs = useGameStore((s) => s.speciesBundle.parasites);
  const injuryDefs = useGameStore((s) => s.speciesBundle.injuries);

  // Truncate the event narrative for the summary view
  const shortNarrative = outcome.eventNarrative.length > 120
    ? outcome.eventNarrative.slice(0, 120) + '...'
    : outcome.eventNarrative;

  return (
    <div className={styles.outcomeCard}>
      <p className={styles.outcomeNarrative}>
        {index}. {shortNarrative}
      </p>

      {outcome.choiceLabel && (
        <p className={styles.outcomeChoice}>
          You chose: {outcome.choiceLabel}
        </p>
      )}

      {outcome.narrativeResult && (
        <p className={styles.outcomeResult}>
          {outcome.narrativeResult}
        </p>
      )}

      <div className={styles.outcomeBadges}>
        {/* Stat effect badges */}
        {outcome.statEffects.map((effect, i) => (
          <span
            key={i}
            className={`${styles.badge} ${
              effect.amount > 0
                ? isStressStat(effect.label) ? styles.badgeNegative : styles.badgePositive
                : isStressStat(effect.label) ? styles.badgePositive : styles.badgeNegative
            }`}
          >
            {effect.label}
          </span>
        ))}

        {/* Weight change badges */}
        {outcome.consequences
          .filter((c) => c.type === 'modify_weight')
          .map((c, i) => {
            const amount = c.type === 'modify_weight' ? c.amount : 0;
            return (
              <span
                key={`w-${i}`}
                className={`${styles.badge} ${amount > 0 ? styles.badgePositive : styles.badgeNegative}`}
              >
                {amount > 0 ? '+' : ''}{amount} lbs
              </span>
            );
          })}

        {/* Parasite/injury badges */}
        {outcome.consequences
          .filter((c) => c.type === 'add_parasite')
          .map((c, i) => (
            <span key={`p-${i}`} className={`${styles.badge} ${styles.badgeNegative}`}>
              {'parasiteId' in c ? `Contracted ${parasiteDefs[c.parasiteId]?.name ?? c.parasiteId}` : ''}
            </span>
          ))}

        {outcome.consequences
          .filter((c) => c.type === 'add_injury')
          .map((c, i) => (
            <span key={`inj-${i}`} className={`${styles.badge} ${styles.badgeNegative}`}>
              {'injuryId' in c ? `Injury: ${injuryDefs[c.injuryId]?.name ?? c.injuryId}` : ''}
            </span>
          ))}

        {/* Death roll result */}
        {outcome.deathRollSurvived === true && outcome.deathRollProbability !== undefined && (
          <span className={`${styles.badge} ${styles.badgeSurvived}`}>
            Survived ({Math.round((1 - outcome.deathRollProbability) * 100)}% chance)
          </span>
        )}
        {outcome.deathRollSurvived === false && (
          <span className={`${styles.badge} ${styles.badgeDeath}`}>
            Fatal
          </span>
        )}
      </div>
    </div>
  );
}

/** Stat labels starting with '+' on stress stats (IMM, CLI, HOM, TRA, ADV, NOV) are bad */
function isStressStat(label: string): boolean {
  const stressLabels = ['IMM', 'CLI', 'HOM', 'TRA', 'ADV', 'NOV'];
  return stressLabels.some((s) => label.includes(s));
}
