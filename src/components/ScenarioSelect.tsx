/** Phase 8: Scenario/Challenge Mode selection screen */

import { SCENARIOS } from '../data/scenarios';
import { useScenarioStore } from '../store/scenarioStore';
import { findSpeciesBundle } from '../data/species';
import { getUnlockHint } from '../data/speciesUnlocks';
import { useSpeciesUnlocks } from '../hooks/useSpeciesUnlocks';
import styles from '../styles/scenario.module.css';

interface Props {
  onSelect: (scenarioId: string) => void;
  onBack: () => void;
}

export function ScenarioSelect({ onSelect, onBack }: Props) {
  const getBestScore = useScenarioStore((s) => s.getBestScore);
  const { isUnlocked } = useSpeciesUnlocks();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Challenge Mode</h2>
      <p className={styles.subtitle}>
        Pre-built scenarios with specific win conditions. Can you beat them all?
      </p>

      <div className={styles.grid}>
        {SCENARIOS.map((scenario) => {
          const bundle = findSpeciesBundle(scenario.speciesId);
          const unlocked = isUnlocked(scenario.speciesId);
          const playable = !!bundle && unlocked;
          const best = getBestScore(scenario.id);

          return (
            <button
              key={scenario.id}
              className={`${styles.card} ${playable ? '' : styles.locked}`}
              onClick={() => playable && onSelect(scenario.id)}
              disabled={!playable}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>{scenario.name}</span>
                <span className={`${styles.difficulty} ${styles[scenario.difficulty]}`}>
                  {scenario.difficulty}
                </span>
              </div>
              {!bundle ? (
                <div className={styles.lockedHint}>Unavailable in this version of the game.</div>
              ) : !unlocked ? (
                <>
                  <div className={styles.species}>???</div>
                  <div className={styles.lockedHint}>Locked — {getUnlockHint(scenario.speciesId)}</div>
                </>
              ) : (
                <>
                  <div className={styles.species}>{bundle.config.name}</div>
                  <div className={styles.description}>{scenario.description}</div>
                  <div className={styles.objective}>
                    Goal: {scenario.winCondition.description}
                  </div>
                  {best && (
                    <div className={styles.bestScore}>
                      Best: {best.turnsCompleted} turns, fitness {best.fitness}
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      <button className={styles.backButton} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
