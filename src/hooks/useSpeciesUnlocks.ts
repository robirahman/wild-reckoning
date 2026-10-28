import { useCallback } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import { isSpeciesUnlocked } from '../data/speciesUnlocks';

/** Species unlock checks bound to the player's current progression */
export function useSpeciesUnlocks() {
  const unlockedAchievementIds = useAchievementStore((s) => s.unlockedIds);
  const speciesPlayed = useAchievementStore((s) => s.speciesPlayed);
  const debugAllUnlocked = useAchievementStore((s) => s.debugAllUnlocked);

  const isUnlocked = useCallback(
    (speciesId: string) =>
      isSpeciesUnlocked(speciesId, { unlockedAchievementIds, speciesPlayed, debugAllUnlocked }),
    [unlockedAchievementIds, speciesPlayed, debugAllUnlocked],
  );

  return { isUnlocked };
}
