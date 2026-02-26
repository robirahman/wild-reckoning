import { create } from 'zustand';

const STORAGE_KEY = 'wild-reckoning-achievements';

interface AchievementState {
  unlockedIds: Set<string>;
  speciesPlayed: Set<string>;
  recentUnlock: string | null; // For toast display
  debugAllUnlocked: boolean;

  unlock: (id: string) => void;
  recordSpeciesPlayed: (speciesId: string) => void;
  dismissToast: () => void;
  toggleDebugAllUnlocked: () => void;
}

function loadFromStorage(): { unlockedIds: string[]; speciesPlayed: string[]; debugAllUnlocked?: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedIds: [], speciesPlayed: [], debugAllUnlocked: false };
    return JSON.parse(raw);
  } catch {
    return { unlockedIds: [], speciesPlayed: [], debugAllUnlocked: false };
  }
}

function saveToStorage(unlockedIds: Set<string>, speciesPlayed: Set<string>, debugAllUnlocked: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      unlockedIds: Array.from(unlockedIds),
      speciesPlayed: Array.from(speciesPlayed),
      debugAllUnlocked,
    }));
  } catch {
    // Silently fail
  }
}

const initial = loadFromStorage();

export const useAchievementStore = create<AchievementState>((set, get) => ({
  unlockedIds: new Set(initial.unlockedIds),
  speciesPlayed: new Set(initial.speciesPlayed),
  recentUnlock: null,
  debugAllUnlocked: initial.debugAllUnlocked ?? false,

  unlock(id) {
    const state = get();
    if (state.unlockedIds.has(id)) return;
    const newIds = new Set(state.unlockedIds);
    newIds.add(id);
    saveToStorage(newIds, state.speciesPlayed, state.debugAllUnlocked);
    set({ unlockedIds: newIds, recentUnlock: id });
  },

  recordSpeciesPlayed(speciesId) {
    const state = get();
    if (state.speciesPlayed.has(speciesId)) return;
    const newSpecies = new Set(state.speciesPlayed);
    newSpecies.add(speciesId);
    saveToStorage(state.unlockedIds, newSpecies, state.debugAllUnlocked);
    set({ speciesPlayed: newSpecies });
  },

  dismissToast() {
    set({ recentUnlock: null });
  },

  toggleDebugAllUnlocked() {
    const nextState = !get().debugAllUnlocked;
    saveToStorage(get().unlockedIds, get().speciesPlayed, nextState);
    set({ debugAllUnlocked: nextState });
  },
}));
