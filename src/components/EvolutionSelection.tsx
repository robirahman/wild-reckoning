import { useGameStore } from '../store/gameStore';
import styles from '../styles/evolution.module.css';

export function EvolutionSelection() {
  const choices = useGameStore((s) => s.evolution.availableChoices);
  const selectMutation = useGameStore((s) => s.selectMutation);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'evolving') return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>The Cycle Continues</h2>
        <p className={styles.subtitle}>Choose a mutation to pass down to the next generation.</p>
        
        <div className={styles.choices}>
          {choices.map((choice) => (
            <div 
              key={choice.id} 
              className={styles.choiceCard}
              onClick={() => selectMutation(choice.id)}
            >
              <div className={styles.mutationName}>{choice.name}</div>
              <div className={styles.description}>{choice.description}</div>
              <div className={`${styles.rarity} ${styles[choice.rarity]}`}>
                {choice.rarity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
