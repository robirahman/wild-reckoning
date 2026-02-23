import { useGameEngine } from '../hooks/useGameEngine';

export function TurnControls() {
  const { startTurn, confirmChoices, hasPendingChoices } = useGameEngine();

  return (
    <div style={{
      margin: '24px 0',
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
          startTurn();
        }}
        style={{
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          border: '2px solid var(--color-text)',
          borderRadius: 4,
          background: 'var(--color-panel-bg)',
          cursor: 'pointer',
        }}
      >
        Next Turn
      </button>
    </div>
  );
}
