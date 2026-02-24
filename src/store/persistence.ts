import type { StateStorage } from 'zustand/middleware';
import type { GameState } from './gameStore';
import { createRng } from '../engine/RandomUtils';
import { getSpeciesBundle } from '../data/species';

const STORAGE_KEY = 'wild-reckoning-save';

/**
 * Serializable shape of game state stored in localStorage.
 * Differs from GameState: Set<string> → string[], Rng → number (internal state).
 */
interface SerializedState {
  phase: GameState['phase'];
  seed: number;
  rngState: number;
  difficulty: GameState['difficulty'];
  animal: Omit<GameState['animal'], 'flags'> & { flags: string[] };
  time: GameState['time'];
  behavioralSettings: GameState['behavioralSettings'];
  reproduction: GameState['reproduction'];
  currentEvents: GameState['currentEvents'];
  pendingChoices: GameState['pendingChoices'];
  revocableChoices: GameState['revocableChoices'];
  npcs: GameState['npcs'];
  activeStorylines: GameState['activeStorylines'];
  turnHistory: GameState['turnHistory'];
  eventCooldowns: GameState['eventCooldowns'];
}

/** Convert live game state to a JSON-safe object */
export function serializeState(state: GameState): SerializedState {
  return {
    phase: state.phase,
    seed: state.seed,
    rngState: state.rng.getState(),
    difficulty: state.difficulty,
    animal: {
      ...state.animal,
      flags: Array.from(state.animal.flags),
    },
    time: state.time,
    behavioralSettings: state.behavioralSettings,
    reproduction: state.reproduction,
    currentEvents: state.currentEvents,
    pendingChoices: state.pendingChoices,
    revocableChoices: state.revocableChoices,
    npcs: state.npcs,
    activeStorylines: state.activeStorylines,
    turnHistory: state.turnHistory,
    eventCooldowns: state.eventCooldowns,
  };
}

/** Restore live game state from a serialized object */
export function deserializeState(data: SerializedState): Partial<GameState> {
  const rng = createRng(data.seed);
  rng.setState(data.rngState);

  const speciesBundle = getSpeciesBundle(data.animal.speciesId);

  return {
    phase: data.phase,
    seed: data.seed,
    rng,
    difficulty: data.difficulty,
    speciesBundle,
    animal: {
      ...data.animal,
      flags: new Set(data.animal.flags),
    } as GameState['animal'],
    time: data.time,
    behavioralSettings: data.behavioralSettings,
    reproduction: data.reproduction,
    currentEvents: data.currentEvents,
    pendingChoices: data.pendingChoices,
    revocableChoices: data.revocableChoices,
    npcs: data.npcs ?? [],
    activeStorylines: data.activeStorylines ?? [],
    turnResult: null,
    showingResults: false,
    turnHistory: data.turnHistory,
    eventCooldowns: data.eventCooldowns,
  };
}

/** Save game state to localStorage */
export function saveGame(state: GameState): void {
  try {
    const serialized = serializeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // Silently fail if localStorage is full or unavailable
  }
}

/** Load game state from localStorage, returns null if no save exists */
export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: SerializedState = JSON.parse(raw);
    // Basic validation
    if (!data.phase || !data.animal || !data.time) return null;
    return deserializeState(data);
  } catch {
    return null;
  }
}

/** Check if a save game exists */
export function hasSaveGame(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Delete the save game */
export function deleteSaveGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

/** Custom Zustand storage adapter (not used directly with persist middleware — we use manual save/load) */
export const gameStorage: StateStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: (name: string, value: string) => localStorage.setItem(name, value),
  removeItem: (name: string) => localStorage.removeItem(name),
};
