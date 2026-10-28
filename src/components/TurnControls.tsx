import { useGameEngine } from '../hooks/useGameEngine';

/** End-of-turn control: shown once every event has been revealed */
export function TurnControls() {
  const { confirmChoices, hasPendingChoices } = useGameEngine();

  return (
    <div style={{
      margin: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
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
          disabled={hasPendingChoices}
          title={hasPendingChoices ? 'Answer every event above first' : undefined}
          style={{
            padding: '10px 32px',
            fontSize: '1rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            border: '2px solid var(--color-text)',
            borderRadius: 4,
            background: 'var(--color-panel-bg)',
            cursor: hasPendingChoices ? 'not-allowed' : 'pointer',
            opacity: hasPendingChoices ? 0.5 : 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Next Turn
        </button>
      </div>
    </div>
  );
}
