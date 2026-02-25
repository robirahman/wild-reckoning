import { useEffect, useState } from 'react';
import { TurnHeader } from '../header/TurnHeader';
import { ActiveEvents } from '../events/ActiveEvents';
import { PassiveEvents } from '../events/PassiveEvents';
import { StatsPanel } from '../stats/StatsPanel';
import { ParasiticInfections } from '../health/ParasiticInfections';
import { HealthComplications } from '../health/HealthComplications';
import { BehavioralSettings } from '../behavior/BehavioralSettings';
import { TurnControls } from '../TurnControls';
import { ActionPanel } from '../ActionPanel';
import { TurnResultsScreen } from '../results/TurnResultsScreen';
import { EventHistoryPanel } from '../history/EventHistoryPanel';
import { JournalView } from '../JournalView';
import { TutorialOverlay } from '../tutorial/TutorialOverlay';
import { AchievementPopup } from '../achievements/AchievementPopup';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useAudio } from '../../hooks/useAudio';
import { useGameStore } from '../../store/gameStore';
import { ThemeToggle } from '../ThemeToggle';
import { AudioControls } from '../AudioControls';
import styles from '../../styles/layout.module.css';

import { MapPanel } from '../MapPanel';

export function GameLayout() {
  const { startTurn, showingResults } = useGameEngine();
  const currentEvents = useGameStore((s) => s.currentEvents);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const advanceTutorial = useGameStore((s) => s.advanceTutorial);
  const skipTutorial = useGameStore((s) => s.skipTutorial);
  const [showHistory, setShowHistory] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <TurnHeader onToggleHistory={() => setShowHistory((h) => !h)} />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => setShowJournal((j) => !j)}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
              }}
            >
              Journal
            </button>
            <AudioControls />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {showHistory && <EventHistoryPanel onClose={() => setShowHistory(false)} />}
      {showJournal && <JournalView onClose={() => setShowJournal(false)} />}

      {tutorialStep !== null && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={advanceTutorial}
          onSkip={skipTutorial}
        />
      )}

      <main className={styles.events} role="region" aria-label="Events area">
        {showingResults ? (
          <TurnResultsScreen />
        ) : (
          <>
            <ActiveEvents />
            <PassiveEvents />
            <ActionPanel />
            <TurnControls />
          </>
        )}
      </main>

      <aside className={styles.sidebar} role="complementary" aria-label="Stats and health sidebar">
        <MapPanel />
        <StatsPanel />
        <ParasiticInfections />
        <HealthComplications />
      </aside>

      <footer className={styles.behavior} role="region" aria-label="Behavioral settings bar">
        <BehavioralSettings />
      </footer>

      <AchievementPopup />
    </div>
  );
}
