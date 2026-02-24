import { useGameStore } from '../../store/gameStore';
import { TurnHistoryEntry } from './TurnHistoryEntry';
import styles from '../../styles/history.module.css';

interface Props {
  onClose: () => void;
}

export function EventHistoryPanel({ onClose }: Props) {
  const turnHistory = useGameStore((s) => s.turnHistory);

  // Show most recent turns first
  const reversedHistory = [...turnHistory].reverse();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Event History</span>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        {reversedHistory.length === 0 ? (
          <div className={styles.emptyState}>No history yet.</div>
        ) : (
          reversedHistory.map((record) => (
            <TurnHistoryEntry key={record.turn} record={record} />
          ))
        )}
      </div>
    </div>
  );
}
