import { useGameEngine } from '../hooks/useGameEngine';
import { useGameStore } from '../store/gameStore';

export function TurnControls() {
  const { confirmChoices, hasPendingChoices } = useGameEngine();
  const fastForward = useGameStore((s) => s.fastForward);
  const toggleFastForward = useGameStore((s) => s.toggleFastForward);

  return (
    <div style={{
      margin: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={toggleFastForward}
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-ui)',
            background: fastForward ? 'var(--color-danger-bg)' : 'var(--color-panel-bg)',
            border: `1px solid ${fastForward ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 4,
            cursor: 'pointer',
            color: fastForward ? 'var(--color-danger)' : 'var(--color-text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          {fastForward ? '▶▶ Fast Forward Active (12x)' : '▶ Normal Speed'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
      }}>
        {hasPendingChoices ? (
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
          }}>
            Make your choices above, then advance to the next turn.
          </p>
        ) : null}
        <button
          onClick={() => {
            confirmChoices();
          }}
          style={{
            padding: '10px 32px',
            fontSize: '1rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            border: '2px solid var(--color-text)',
            borderRadius: 4,
            background: 'var(--color-panel-bg)',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Next Turn
        </button>
      </div>
    </div>
  );
}
