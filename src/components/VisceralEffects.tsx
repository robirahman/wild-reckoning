import { useGameStore } from '../store/gameStore';
import styles from '../styles/visceral.module.css';

export function VisceralEffects() {
  const stress = useGameStore((s) => s.animal.physiologicalStress);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'playing') return null;

  const isHypothermic = stress.hypothermia > 50;
  const isStarving = stress.starvation > 50;
  const isPanicked = stress.panic > 50;

  return (
    <div className={styles.visceralContainer}>
      {isHypothermic && <div className={`${styles.visceralContainer} ${styles.frost} ${stress.hypothermia > 80 ? styles.jitter : ''}`} />}
      {isStarving && <div className={`${styles.visceralContainer} ${styles.starvation}`} />}
      {isPanicked && <div className={`${styles.visceralContainer} ${styles.panic} ${stress.panic > 80 ? styles.shake : ''}`} />}
      
      <style>{`
        body {
          filter: ${isStarving ? `grayscale(${stress.starvation / 100})` : 'none'};
          transition: filter 2s ease;
        }
      `}</style>
    </div>
  );
}
