import { create } from 'zustand';

const STORAGE_KEY = 'wild-reckoning-achievements';

interface AchievementState {
  unlockedIds: Set<string>;
  speciesPlayed: Set<string>;
  recentUnlock: string | null; // For toast display

  unlock: (id: string) => void;
  recordSpeciesPlayed: (speciesId: string) => void;
  dismissToast: () => void;
}

function loadFromStorage(): { unlockedIds: string[]; speciesPlayed: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { unlockedIds: [], speciesPlayed: [] };
    return JSON.parse(raw);
  } catch {
    return { unlockedIds: [], speciesPlayed: [] };
  }
}

function saveToStorage(unlockedIds: Set<string>, speciesPlayed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      unlockedIds: Array.from(unlockedIds),
      speciesPlayed: Array.from(speciesPlayed),
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

  unlock(id) {
    const state = get();
    if (state.unlockedIds.has(id)) return;
    const newIds = new Set(state.unlockedIds);
    newIds.add(id);
    saveToStorage(newIds, state.speciesPlayed);
    set({ unlockedIds: newIds, recentUnlock: id });
  },

  recordSpeciesPlayed(speciesId) {
    const state = get();
    if (state.speciesPlayed.has(speciesId)) return;
    const newSpecies = new Set(state.speciesPlayed);
    newSpecies.add(speciesId);
    saveToStorage(state.unlockedIds, newSpecies);
    set({ speciesPlayed: newSpecies });
  },

  dismissToast() {
    set({ recentUnlock: null });
  },
}));
