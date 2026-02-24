import type { GameState } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { useAchievementStore } from '../store/achievementStore';
import { getAllSpeciesBundles } from '../data/species';

/**
 * Check achievements after a turn or on death.
 * Returns newly unlocked achievement IDs.
 */
export function checkAchievements(state: GameState, trigger: 'turn' | 'death'): string[] {
  const store = useAchievementStore.getState();
  const newlyUnlocked: string[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (store.unlockedIds.has(ach.id)) continue;
    if (ach.checkOn !== trigger && ach.checkOn !== 'both') continue;

    // Special case: biodiversity achievement
    if (ach.id === 'play-all-species') {
      const allBundles = getAllSpeciesBundles();
      if (store.speciesPlayed.size >= allBundles.length) {
        store.unlock(ach.id);
        newlyUnlocked.push(ach.id);
      }
      continue;
    }

    if (ach.check(state)) {
      store.unlock(ach.id);
      newlyUnlocked.push(ach.id);
    }
  }

  return newlyUnlocked;
}
