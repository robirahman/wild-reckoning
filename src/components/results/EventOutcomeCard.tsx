import type { EventOutcome } from '../../types/turnResult';
import { useGameStore } from '../../store/gameStore';
import { formatWeightDelta } from '../../utils/formatWeight';
import styles from '../../styles/results.module.css';

interface EventOutcomeCardProps {
  outcome: EventOutcome;
  index: number;
}

function EffectBadge({ label, amount }: { label: string; amount: number }) {
  // For stress stats, going up is bad; for fitness stats, going up is good
  const good = amount > 0 ? !isStressStat(label) : isStressStat(label);
  return (
    <span className={`${styles.badge} ${good ? styles.badgePositive : styles.badgeNegative}`}>
      {label}
    </span>
  );
}

export function EventOutcomeCard({ outcome, index }: EventOutcomeCardProps) {
  const parasiteDefs = useGameStore((s) => s.speciesBundle.parasites);
  const injuryDefs = useGameStore((s) => s.speciesBundle.injuries);

  // Effects that came from the encounter itself rather than the player's choice
  const choiceCount = outcome.choiceStatEffects?.length ?? 0;
  const encounterEffects = outcome.statEffects.slice(0, outcome.statEffects.length - choiceCount);

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

      {/* Separate what the encounter did from what the choice did */}
      {outcome.choiceStatEffects && outcome.choiceStatEffects.length > 0 && encounterEffects.length > 0 && (
        <div className={styles.outcomeBadges}>
          <span className={styles.badgeGroupLabel}>The encounter:</span>
          {encounterEffects.map((effect, i) => <EffectBadge key={i} label={effect.label} amount={effect.amount} />)}
        </div>
      )}

      <div className={styles.outcomeBadges}>
        {outcome.choiceStatEffects && outcome.choiceStatEffects.length > 0 ? (
          <>
            {encounterEffects.length > 0 && <span className={styles.badgeGroupLabel}>Your choice:</span>}
            {outcome.choiceStatEffects.map((effect, i) => <EffectBadge key={i} label={effect.label} amount={effect.amount} />)}
          </>
        ) : (
          outcome.statEffects.map((effect, i) => <EffectBadge key={i} label={effect.label} amount={effect.amount} />)
        )}

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
                {formatWeightDelta(amount, useGameStore.getState().speciesBundle.config)}
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
