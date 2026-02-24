import { useGameStore } from '../../store/gameStore';
import styles from '../../styles/header.module.css';

export function TurnHeader() {
  const time = useGameStore((s) => s.time);
  const config = useGameStore((s) => s.speciesBundle.config);
  const animal = useGameStore((s) => s.animal);

  // Determine lifecycle phase for species with phases
  const currentPhase = config.phases?.slice().reverse().find(
    (p) => !p.entryFlag || animal.flags.has(p.entryFlag)
  );

  return (
    <div className={styles.turnHeader}>
      <span className={styles.date}>
        Week {time.week}, {time.month}, Year {time.year}
        {currentPhase && config.phases && config.phases.length > 1 && (
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
            — {currentPhase.label}
          </span>
        )}
      </span>
      <span className={styles.turn}>Turn {time.turn}</span>
    </div>
  );
}
