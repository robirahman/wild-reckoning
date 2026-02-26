import { useGameStore } from '../../store/gameStore';
import { BEHAVIOR_LABELS } from '../../types';
import styles from '../../styles/instinct.module.css';

/**
 * Displays instinct nudges as small badges near the behavioral settings panel.
 *
 * Each badge shows a short label (e.g., "Exposed", "Starving") with a hover
 * tooltip that explains the instinct in animal-perspective prose. If the nudge
 * suggests a behavioral adjustment, the tooltip includes a hint like
 * "Instinct suggests: increase Caution."
 *
 * Nudges are advisory only — clicking does nothing. The player decides.
 */
export function InstinctBadges() {
  const nudges = useGameStore((s) => s.instinctNudges);

  if (nudges.length === 0) return null;

  return (
    <div className={styles.nudgeRow}>
      {nudges.map((nudge) => {
        const priorityClass =
          nudge.priority === 'high' ? styles.nudgeBadgeHigh :
          nudge.priority === 'medium' ? styles.nudgeBadgeMedium :
          styles.nudgeBadgeLow;

        return (
          <span
            key={nudge.id}
            className={`${styles.nudgeBadge} ${priorityClass}`}
            aria-label={nudge.description}
          >
            <span className={styles.nudgeLabel}>{nudge.label}</span>
            {nudge.suggestedBehavior && nudge.suggestedDirection && (
              <span className={styles.nudgeArrow}>
                {nudge.suggestedDirection === 'increase' ? '\u2191' : '\u2193'}
              </span>
            )}
            <span className={styles.nudgeTooltip}>
              {nudge.description}
              {nudge.suggestedBehavior && nudge.suggestedDirection && (
                <div className={styles.tooltipBehavior}>
                  Instinct suggests: {nudge.suggestedDirection}{' '}
                  {BEHAVIOR_LABELS[nudge.suggestedBehavior]}
                </div>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}
