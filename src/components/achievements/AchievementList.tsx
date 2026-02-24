import { useAchievementStore } from '../../store/achievementStore';
import { useGameStore } from '../../store/gameStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import styles from '../../styles/achievements.module.css';

export function AchievementList() {
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);
  const speciesPlayed = useAchievementStore((s) => s.speciesPlayed);
  const gameState = useGameStore.getState();
  const currentSpecies = gameState.speciesBundle?.config?.id;

  // Filter achievements relevant to the current species (or universal)
  const relevant = ACHIEVEMENTS.filter((a) => {
    if (!a.species) return true;
    const speciesList = Array.isArray(a.species) ? a.species : [a.species];
    return speciesList.includes(currentSpecies);
  });

  const unlocked = relevant.filter((a) => unlockedIds.has(a.id));
  const locked = relevant.filter((a) => !unlockedIds.has(a.id));

  if (relevant.length === 0) return null;

  return (
    <div className={styles.list}>
      <div className={styles.listTitle}>
        Achievements ({unlocked.length}/{relevant.length})
      </div>

      {/* Unlocked achievements */}
      {unlocked.map((ach) => (
        <div key={ach.id} className={styles.item}>
          <span className={styles.itemIcon}>&#x2713;</span>
          <div className={styles.itemContent}>
            <div className={styles.itemName}>{ach.name}</div>
            <div className={styles.itemDesc}>{ach.description}</div>
          </div>
        </div>
      ))}

      {/* Locked achievements */}
      {locked.map((ach) => {
        // Compute progress if available
        let progressInfo: { current: number; target: number } | null = null;
        if (ach.progress) {
          try {
            // Special handling for species-played achievements
            if (ach.id === 'cross-species-observer') {
              progressInfo = { current: Math.min(speciesPlayed.size, 4), target: 4 };
            } else if (ach.id === 'play-all-species') {
              progressInfo = { current: speciesPlayed.size, target: 12 };
            } else {
              progressInfo = ach.progress(gameState);
            }
          } catch {
            progressInfo = null;
          }
        }

        if (progressInfo) {
          const pct = Math.min((progressInfo.current / progressInfo.target) * 100, 100);
          return (
            <div key={ach.id} className={styles.item}>
              <span className={styles.itemIcon} style={{ opacity: 0.4 }}>&#x25CB;</span>
              <div className={styles.itemContent}>
                <div className={styles.itemNameLocked}>{ach.name}</div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                </div>
                <div className={styles.progressText}>
                  {progressInfo.current}/{progressInfo.target}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={ach.id} className={`${styles.item} ${styles.lockedItem}`}>
            <span className={styles.itemIcon}>&#x1F512;</span>
            <div className={styles.itemContent}>
              <div className={styles.itemNameLocked}>{ach.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
