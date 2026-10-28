import { useGameStore } from '../store/gameStore';
import { FAST_FORWARD_TURNS } from '../engine/FastForward';
import { describeTurnSpan } from '../utils/timeSpan';

/** Toggle that says how much of the animal's life each turn will cover */
export function FastForwardToggle({ compact = false }: { compact?: boolean }) {
  const fastForward = useGameStore((s) => s.fastForward);
  const toggleFastForward = useGameStore((s) => s.toggleFastForward);
  const turnUnit = useGameStore((s) => s.speciesBundle.config.turnUnit);
  const skipSpan = describeTurnSpan(FAST_FORWARD_TURNS, turnUnit);

  return (
    <button
      onClick={toggleFastForward}
      aria-pressed={fastForward}
      title={`Fast-forward simulates ${skipSpan} of your animal's life each turn. It pauses on its own for births, injuries, and health crises.`}
      style={{
        padding: compact ? '2px 8px' : '6px 12px',
        fontSize: compact ? '0.75rem' : '0.8rem',
        fontFamily: 'var(--font-ui)',
        background: fastForward ? 'var(--color-danger-bg)' : 'var(--color-panel-bg)',
        border: `1px solid ${fastForward ? 'var(--color-danger)' : 'var(--color-border)'}`,
        borderRadius: 4,
        cursor: 'pointer',
        color: fastForward ? 'var(--color-danger)' : 'var(--color-text-muted)',
        transition: 'all 0.2s ease',
      }}
    >
      {fastForward
        ? `▶▶ Skipping ahead ${skipSpan} per turn`
        : `▶ Normal speed: ${describeTurnSpan(1, turnUnit)} per turn`}
    </button>
  );
}
