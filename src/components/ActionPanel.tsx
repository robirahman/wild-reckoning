import { useGameStore } from '../store/gameStore';
import { getAvailableActions, type ActionContext } from '../engine/ActionSystem';
import styles from '../styles/actions.module.css';

export function ActionPanel() {
  const config = useGameStore((s) => s.speciesBundle.config);
  const territory = useGameStore((s) => s.territory);
  const reproduction = config.reproduction;
  const season = useGameStore((s) => s.time.season);
  const phase = useGameStore((s) => s.phase);
  const showingResults = useGameStore((s) => s.showingResults);
  const actionsPerformed = useGameStore((s) => s.actionsPerformed);
  const performAction = useGameStore((s) => s.performAction);
  const rng = useGameStore((s) => s.rng);
  const nutrients = useGameStore((s) => s.animal.nutrients);

  if (phase !== 'playing' || showingResults) return null;

  const ctx: ActionContext = {
    speciesId: config.id,
    config,
    territory,
    reproductionType: reproduction.type,
    season,
    matingSeasons:
      reproduction.type === 'iteroparous'
        ? (reproduction as Extract<typeof reproduction, { type: 'iteroparous' }>).matingSeasons ?? 'any'
        : [],
    rng,
    nutrients,
  };

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
