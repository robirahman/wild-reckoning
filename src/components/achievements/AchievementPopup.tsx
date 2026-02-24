import { useEffect } from 'react';
import { useAchievementStore } from '../../store/achievementStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import styles from '../../styles/achievements.module.css';

export function AchievementPopup() {
  const recentUnlock = useAchievementStore((s) => s.recentUnlock);
  const dismissToast = useAchievementStore((s) => s.dismissToast);

  useEffect(() => {
    if (recentUnlock) {
      const timer = setTimeout(dismissToast, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, dismissToast]);

  if (!recentUnlock) return null;

  const ach = ACHIEVEMENTS.find((a) => a.id === recentUnlock);
  if (!ach) return null;

  return (
    <div className={styles.toast} onClick={dismissToast}>
      <div className={styles.toastLabel}>Achievement Unlocked</div>
      <div className={styles.toastName}>{ach.name}</div>
      <div className={styles.toastDesc}>{ach.description}</div>
    </div>
  );
}
