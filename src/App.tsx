import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/layout/GameLayout';
import { StartScreen } from './components/StartScreen';
import { DeathScreen } from './components/DeathScreen';
import { EvolutionSelection } from './components/EvolutionSelection';
import { VisceralEffects } from './components/VisceralEffects';
import { WebAPIDoc } from './components/WebAPIDoc';

function App() {
  const phase = useGameStore((s) => s.phase);
  const isAPIDoc = window.location.pathname.endsWith('/api') || window.location.pathname.endsWith('/api/');

  if (isAPIDoc) {
    return <WebAPIDoc />;
  }

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
