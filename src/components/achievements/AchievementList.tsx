import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import styles from '../../styles/achievements.module.css';

export function AchievementList() {
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  if (ACHIEVEMENTS.length === 0) return null;

  const unlocked = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id));
  const locked = ACHIEVEMENTS.filter((a) => !unlockedIds.has(a.id));

  return (
    <div className={styles.list}>
      <div className={styles.listTitle}>
        Achievements ({unlocked.length}/{ACHIEVEMENTS.length})
      </div>
      {unlocked.map((ach) => (
        <div key={ach.id} className={styles.item}>
          <span className={styles.itemIcon}>&#x2713;</span>
          <div className={styles.itemContent}>
            <div className={styles.itemName}>{ach.name}</div>
            <div className={styles.itemDesc}>{ach.description}</div>
          </div>
        </div>
      ))}
      {locked.map((ach) => (
        <div key={ach.id} className={styles.item}>
          <span className={styles.itemIcon} style={{ opacity: 0.3 }}>&#x25CB;</span>
          <div className={styles.itemContent}>
            <div className={styles.itemNameLocked}>{ach.name}</div>
            <div className={styles.itemDesc}>{ach.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
