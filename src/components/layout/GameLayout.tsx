import { useEffect } from 'react';
import { TurnHeader } from '../header/TurnHeader';
import { ActiveEvents } from '../events/ActiveEvents';
import { PassiveEvents } from '../events/PassiveEvents';
import { StatsPanel } from '../stats/StatsPanel';
import { ParasiticInfections } from '../health/ParasiticInfections';
import { HealthComplications } from '../health/HealthComplications';
import { BehavioralSettings } from '../behavior/BehavioralSettings';
import { TurnControls } from '../TurnControls';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/layout.module.css';

export function GameLayout() {
  const { startTurn } = useGameEngine();
  const currentEvents = useGameStore((s) => s.currentEvents);

  // Generate first turn's events on mount
  useEffect(() => {
    if (currentEvents.length === 0) {
      startTurn();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.gameLayout}>
      <header className={styles.header}>
        <TurnHeader />
      </header>

      <main className={styles.events}>
        <ActiveEvents />
        <PassiveEvents />
        <TurnControls />
      </main>

      <aside className={styles.sidebar}>
        <StatsPanel />
        <ParasiticInfections />
        <HealthComplications />
      </aside>

      <footer className={styles.behavior}>
        <BehavioralSettings />
      </footer>
    </div>
  );
}
