import { useGameStore } from '../store/gameStore';
import styles from '../styles/lineage.module.css';

export function LineageHistory() {
  const history = useGameStore((s) => s.evolution.lineageHistory);

  if (history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
        Your lineage is just beginning. Survive and reproduce to see your history here.
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      {history.slice().reverse().map((record, i) => (
        <div key={`${record.speciesId}-${i}`} className={styles.ancestorCard}>
          <div className={styles.genBadge}>Gen {record.generation}</div>
          <div className={styles.ancestorInfo}>
            <div className={styles.name}>{record.name || 'Unnamed Ancestor'}</div>
            <div className={styles.details}>
              Species: {record.speciesId} | {record.causeOfDeath}
            </div>
            {record.mutationChosen && (
              <div className={styles.mutation}>
                🧬 {record.mutationChosen.name}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
