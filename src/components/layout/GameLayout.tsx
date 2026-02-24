import { useEffect, useState } from 'react';
import { TurnHeader } from '../header/TurnHeader';
import { ActiveEvents } from '../events/ActiveEvents';
import { PassiveEvents } from '../events/PassiveEvents';
import { StatsPanel } from '../stats/StatsPanel';
import { ParasiticInfections } from '../health/ParasiticInfections';
import { HealthComplications } from '../health/HealthComplications';
import { BehavioralSettings } from '../behavior/BehavioralSettings';
import { TurnControls } from '../TurnControls';
import { TurnResultsScreen } from '../results/TurnResultsScreen';
import { EventHistoryPanel } from '../history/EventHistoryPanel';
import { TutorialOverlay } from '../tutorial/TutorialOverlay';
import { AchievementPopup } from '../achievements/AchievementPopup';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/layout.module.css';

export function GameLayout() {
  const { startTurn, showingResults } = useGameEngine();
  const currentEvents = useGameStore((s) => s.currentEvents);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const advanceTutorial = useGameStore((s) => s.advanceTutorial);
  const skipTutorial = useGameStore((s) => s.skipTutorial);
  const [showHistory, setShowHistory] = useState(false);
  useAudio();

  // Generate first turn's events on mount
  useEffect(() => {
    if (currentEvents.length === 0 && !showingResults) {
      startTurn();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.gameLayout}>
      <header className={styles.header}>
        <TurnHeader onToggleHistory={() => setShowHistory((h) => !h)} />
      </header>

      {showHistory && <EventHistoryPanel onClose={() => setShowHistory(false)} />}

      {tutorialStep !== null && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={advanceTutorial}
          onSkip={skipTutorial}
        />
      )}

      <main className={styles.events}>
        {showingResults ? (
          <TurnResultsScreen />
        ) : (
          <>
            <ActiveEvents />
            <PassiveEvents />
            <TurnControls />
          </>
        )}
      </main>

      <aside className={styles.sidebar}>
        <StatsPanel />
        <ParasiticInfections />
        <HealthComplications />
      </aside>

      <footer className={styles.behavior}>
        <BehavioralSettings />
      </footer>

      <AchievementPopup />
    </div>
  );
}
