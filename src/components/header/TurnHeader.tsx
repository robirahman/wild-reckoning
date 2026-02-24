import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/header.module.css';

export function TurnHeader() {
  const time = useGameStore((s) => s.time);

  return (
    <div className={styles.turnHeader}>
      <span className={styles.date}>
        Week {time.week}, {time.month}, Year {time.year}
      </span>
      <span className={styles.turn}>Turn {time.turn}</span>
    </div>
  );
}
