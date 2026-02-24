/** Phase 14: Encyclopedia persistence */

import { create } from 'zustand';

const STORAGE_KEY = 'wild-reckoning-encyclopedia';

interface EncyclopediaState {
  unlockedEntryIds: Set<string>;
  unlock: (id: string) => void;
  isUnlocked: (id: string) => boolean;
}

function loadUnlocked(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUnlocked(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Silently fail
  }
}

export const useEncyclopediaStore = create<EncyclopediaState>((set, get) => ({
  unlockedEntryIds: new Set(loadUnlocked()),

  unlock(id) {
    const state = get();
    if (state.unlockedEntryIds.has(id)) return;
    const newIds = new Set(state.unlockedEntryIds);
    newIds.add(id);
    saveUnlocked(newIds);
    set({ unlockedEntryIds: newIds });
  },

  isUnlocked(id) {
    return get().unlockedEntryIds.has(id);
  },
}));
