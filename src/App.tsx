import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/layout/GameLayout';
import { StartScreen } from './components/StartScreen';
import { DeathScreen } from './components/DeathScreen';

function App() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'menu':
      return <StartScreen />;
    case 'playing':
      return <GameLayout />;
    case 'dead':
      return <DeathScreen />;
  }
}

export default App;
