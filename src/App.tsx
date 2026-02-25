import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/layout/GameLayout';
import { StartScreen } from './components/StartScreen';
import { DeathScreen } from './components/DeathScreen';
import { EvolutionSelection } from './components/EvolutionSelection';
import { VisceralEffects } from './components/VisceralEffects';

function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <>
      <VisceralEffects />
      {(() => {
        switch (phase) {
          case 'menu':
            return <StartScreen />;
          case 'playing':
            return <GameLayout />;
          case 'dead':
            return <DeathScreen />;
          case 'evolving':
            return (
              <>
                <GameLayout />
                <EvolutionSelection />
              </>
            );
        }
      })()}
    </>
  );
}

export default App;
