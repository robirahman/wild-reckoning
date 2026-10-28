import { useGameStore } from '../../store/gameStore';
import { saveGame } from '../../store/persistence';
import { FastForwardToggle } from '../FastForwardToggle';

const buttonStyle = {
  background: 'none',
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  padding: '2px 8px',
  cursor: 'pointer',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.75rem',
} as const;

/** Save, Quit and fast-forward, available at every point in a turn */
export function GameControls() {
  const returnToMenu = useGameStore((s) => s.returnToMenu);

  const handleSave = () => {
    alert(saveGame(useGameStore.getState())
      ? 'Game saved.'
      : 'The game could not be saved. Your browser storage may be full or disabled.');
  };

  const handleQuit = () => {
    if (confirm('Quit to the main menu? Your progress will be saved.')) {
      saveGame(useGameStore.getState());
      returnToMenu();
    }
  };

  return (
    <>
      <FastForwardToggle compact />
      <button onClick={handleSave} style={buttonStyle}>Save</button>
      <button onClick={handleQuit} style={{ ...buttonStyle, color: 'var(--color-danger)' }}>Quit</button>
    </>
  );
}
