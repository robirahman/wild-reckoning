import { useGameStore } from '../../store/gameStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { EventOutcomeCard } from './EventOutcomeCard';
import { DeathChoiceModal } from '../DeathChoiceModal';
import { StatId, STAT_NAMES, STAT_POLARITY } from '../../types/stats';
import styles from '../../styles/results.module.css';

export function TurnResultsScreen() {
  const turnResult = useGameStore((s) => s.turnResult);
  const phase = useGameStore((s) => s.phase);
  const resolveDeathRoll = useGameStore((s) => s.resolveDeathRoll);
  const { dismissResults } = useGameEngine();

  if (!turnResult) return null;

  // If there are pending death rolls, show the escape choice modal first
  const pendingRolls = turnResult.pendingDeathRolls;
  if (pendingRolls && pendingRolls.length > 0) {
    const currentRoll = pendingRolls[0];
    return (
      <DeathChoiceModal
        deathRoll={currentRoll}
        onChoose={(escapeOptionId) => resolveDeathRoll(currentRoll.eventId, escapeOptionId)}
      />
    );
  }

  const hasStatChanges = Object.values(turnResult.statDelta).some((d) => d !== 0);
  const hasHealthNarratives = turnResult.healthNarratives.length > 0;
  const hasOutcomes = turnResult.eventOutcomes.length > 0;

  return (
    <div className={styles.resultsScreen}>
      <h3 className={styles.resultsTitle}>Turn Results</h3>

      {/* Event outcomes */}
      {hasOutcomes && turnResult.eventOutcomes.map((outcome, i) => (
        <EventOutcomeCard key={outcome.eventId} outcome={outcome} index={i + 1} />
      ))}

      {/* Health system narratives */}
      {hasHealthNarratives && (
        <div className={styles.healthSection}>
          <h4 className={styles.healthTitle}>Health Updates</h4>
          {turnResult.healthNarratives.map((narrative, i) => (
            <p key={i} className={styles.healthNarrative}>{narrative}</p>
          ))}
        </div>
      )}

      {/* Stat delta summary */}
      {hasStatChanges && (
        <div className={styles.statSummary}>
          <h4 className={styles.statSummaryTitle}>Stat Changes</h4>
          <div className={styles.statDeltaGrid}>
            {Object.values(StatId).map((statId) => {
              const delta = turnResult.statDelta[statId];
              if (delta === 0) return null;

              // For stress stats, going up is bad. For fitness stats, going up is good.
              const isGood = STAT_POLARITY[statId] === 'positive' ? delta > 0 : delta < 0;
              const deltaClass = isGood ? styles.statDeltaUp : styles.statDeltaDown;

              return (
                <div key={statId} className={styles.statDeltaItem}>
                  <span className={styles.statDeltaName}>{STAT_NAMES[statId]}</span>
                  <span className={deltaClass}>
                    {delta > 0 ? '+' : ''}{Math.round(delta)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue button (not shown if dead) */}
      {phase !== 'dead' && (
        <div className={styles.continueWrapper}>
          <button className={styles.continueButton} onClick={dismissResults}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
