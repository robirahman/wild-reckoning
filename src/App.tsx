import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/layout/GameLayout';
import { StartScreen } from './components/StartScreen';
import { DeathScreen } from './components/DeathScreen';
import { EvolutionSelection } from './components/EvolutionSelection';
import { VisceralEffects } from './components/VisceralEffects';
import { WebAPIDoc } from './components/WebAPIDoc';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const phase = useGameStore((s) => s.phase);
  const returnToMenu = useGameStore((s) => s.returnToMenu);
  const isAPIDoc = window.location.pathname.endsWith('/api') || window.location.pathname.endsWith('/api/');

  if (isAPIDoc) {
    return <WebAPIDoc />;
  }

  return (
    <ErrorBoundary onReset={returnToMenu}>
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
    </ErrorBoundary>
  );
}

export default App;
