import type { PendingDeathRoll } from '../types/turnResult';
import { useGameStore } from '../store/gameStore';
import styles from '../styles/deathchoice.module.css';

interface Props {
  deathRoll: PendingDeathRoll;
  onChoose: (escapeOptionId: string) => void;
}

export function DeathChoiceModal({ deathRoll, onChoose }: Props) {
  const animalFlags = useGameStore((s) => s.animal.flags);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.title}>Predator Encounter</div>
        <div className={styles.description}>{deathRoll.cause}</div>
        <div className={styles.options}>
          {deathRoll.escapeOptions.map((option) => {
            const locked = option.requiredFlag ? !animalFlags.has(option.requiredFlag) : false;
            const survivalPct = Math.round(option.survivalModifier * 100);
            const sign = survivalPct >= 0 ? '+' : '';

            return (
              <button
                key={option.id}
                className={styles.optionButton}
                disabled={locked}
                onClick={() => onChoose(option.id)}
              >
                <div className={styles.optionLabel}>{option.label}</div>
                <div className={styles.optionDesc}>
                  {option.description}
                  {locked && option.requiredFlag && ` (Requires: ${option.requiredFlag})`}
                </div>
                <div className={styles.optionModifier}>
                  Survival: {sign}{survivalPct}%
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
