import { useGameEngine } from '../hooks/useGameEngine';
import { useGameStore } from '../store/gameStore';
import { saveGame } from '../store/persistence';
import { FastForwardToggle } from './FastForwardToggle';

export function TurnControls() {
  const { confirmChoices, hasPendingChoices } = useGameEngine();
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  const handleQuit = () => {
    if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
      saveGame(useGameStore.getState());
      returnToMenu();
    }
  };

  const handleSave = () => {
    alert(saveGame(useGameStore.getState())
      ? 'Game saved.'
      : 'The game could not be saved. Your browser storage may be full or disabled.');
  };

  return (
    <div style={{
      margin: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <FastForwardToggle />

        <button
          onClick={handleSave}
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-ui)',
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
        >
          Save Game
        </button>

        <button
          onClick={handleQuit}
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-ui)',
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            cursor: 'pointer',
            color: 'var(--color-danger)',
          }}
        >
          Quit
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
