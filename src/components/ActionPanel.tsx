import { useGameStore } from '../store/gameStore';
import { getAvailableActions, buildActionContext } from '../engine/ActionSystem';
import styles from '../styles/actions.module.css';

export function ActionPanel() {
  const animal = useGameStore((s) => s.animal);
  const speciesBundle = useGameStore((s) => s.speciesBundle);
  const territory = useGameStore((s) => s.territory);
  const time = useGameStore((s) => s.time);
  const phase = useGameStore((s) => s.phase);
  const showingResults = useGameStore((s) => s.showingResults);
  const actionsPerformed = useGameStore((s) => s.actionsPerformed);
  const performAction = useGameStore((s) => s.performAction);
  const rng = useGameStore((s) => s.rng);

  if (phase !== 'playing' || showingResults) return null;

  const ctx = buildActionContext({ animal, speciesBundle, territory, time, rng });

  const available = getAvailableActions(ctx);
  if (available.length === 0) return null;

  const alreadyActed = actionsPerformed.length > 0;

  return (
    <div>
      <p className={styles.sectionLabel}>Actions</p>
      <div className={styles.actionsBar}>
        {available.map((action) => (
          <button
            key={action.id}
            className={styles.actionButton}
            disabled={alreadyActed || actionsPerformed.includes(action.id)}
            onClick={() => performAction(action.id)}
            title={action.description}
          >
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
