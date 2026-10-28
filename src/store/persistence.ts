import type { StateStorage } from 'zustand/middleware';
import type { GameState } from './gameStore';
import { createRng } from '../engine/RandomUtils';
import { getSpeciesBundle } from '../data/species';
import type { WorldMemory, SeasonalTotals } from '../simulation/memory/types';
import { createWorldMemory } from '../simulation/memory/types';
import { generateRegionMap } from '../engine/MapSystem';
import { initializeEcosystem } from '../engine/EcosystemSystem';
import { initialTerritoryFor } from '../engine/TerritorySystem';
import { dehydrateAnimal, hydrateAnimal, type SerializedAnimal } from './slices/helpers';

const STORAGE_KEY = 'wild-reckoning-save';

/**
 * Bump when the serialized shape changes. Saves without a version are v1,
 * which predate the world fields below; they are backfilled on load.
 */
export const SAVE_VERSION = 2;

/** Serialized form of SeasonalTotals (Set → array) */
interface SerializedSeasonalTotals extends Omit<SeasonalTotals, 'nodesVisited'> {
  nodesVisited: string[];
}

/** Serialized form of WorldMemory (Set fields converted to arrays) */
interface SerializedWorldMemory extends Omit<WorldMemory, 'seasonalTotals'> {
  seasonalTotals: SerializedSeasonalTotals;
}

/**
 * JSON-safe snapshot of a game in progress. Differs from GameState:
 * Sets become arrays, the Rng becomes its internal state, and derived
 * structures (the anatomy index, the species bundle) are rebuilt on load.
 */
export interface SerializedState {
  version?: number;
  phase: GameState['phase'];
  seed: number;
  rngState: number;
  difficulty: GameState['difficulty'];
  animal: SerializedAnimal;
  time: GameState['time'];
  behavioralSettings: GameState['behavioralSettings'];
  reproduction: GameState['reproduction'];
  currentEvents: GameState['currentEvents'];
  pendingChoices: GameState['pendingChoices'];
  revocableChoices: GameState['revocableChoices'];
  npcs: GameState['npcs'];
  activeStorylines: GameState['activeStorylines'];
  currentWeather: GameState['currentWeather'];
  turnHistory: GameState['turnHistory'];
  eventCooldowns: GameState['eventCooldowns'];
  worldMemory?: SerializedWorldMemory;
  // ── Added in v2 ──
  map?: GameState['map'];
  territory?: GameState['territory'];
  ecosystem?: GameState['ecosystem'];
  scenario?: GameState['scenario'];
  scenarioOutcome?: GameState['scenarioOutcome'];
  climateShift?: GameState['climateShift'];
  npcBehaviorStates?: GameState['npcBehaviorStates'];
  evolution?: GameState['evolution'];
  lineage?: GameState['lineage'];
  actionsPerformed?: GameState['actionsPerformed'];
  ambientText?: GameState['ambientText'];
  instinctNudges?: GameState['instinctNudges'];
  showingResults?: GameState['showingResults'];
  turnResult?: GameState['turnResult'];
}

/** Convert live game state to a JSON-safe object */
export function serializeState(state: GameState): SerializedState {
  return {
    version: SAVE_VERSION,
    phase: state.phase,
    seed: state.seed,
    rngState: state.rng.getState(),
    difficulty: state.difficulty,
    animal: dehydrateAnimal(state.animal),
    time: state.time,
    behavioralSettings: state.behavioralSettings,
    reproduction: state.reproduction,
    currentEvents: state.currentEvents,
    pendingChoices: state.pendingChoices,
    revocableChoices: state.revocableChoices,
    npcs: state.npcs,
    activeStorylines: state.activeStorylines,
    currentWeather: state.currentWeather,
    turnHistory: state.turnHistory,
    eventCooldowns: state.eventCooldowns,
    worldMemory: state.worldMemory ? {
      ...state.worldMemory,
      seasonalTotals: {
        ...state.worldMemory.seasonalTotals,
        nodesVisited: Array.from(state.worldMemory.seasonalTotals.nodesVisited),
      },
    } : undefined,
    map: state.map,
    territory: state.territory,
    ecosystem: state.ecosystem,
    scenario: state.scenario,
    scenarioOutcome: state.scenarioOutcome,
    climateShift: state.climateShift,
    npcBehaviorStates: state.npcBehaviorStates,
    evolution: state.evolution,
    lineage: state.lineage,
    actionsPerformed: state.actionsPerformed,
    ambientText: state.ambientText,
    instinctNudges: state.instinctNudges,
    // A save made on the results screen resumes there, so already-applied
    // effects can't be resolved a second time
    showingResults: state.showingResults,
    turnResult: state.turnResult,
  };
}

/** Restore live game state from a serialized object */
export function deserializeState(data: SerializedState): Partial<GameState> {
  const speciesBundle = getSpeciesBundle(data.animal.speciesId);
  const rng = createRng(data.seed);
  rng.setState(data.rngState);
  const animal = hydrateAnimal(speciesBundle.config, data.animal);
  const isLegacy = (data.version ?? 1) < 2;
  const showingResults = !!(data.showingResults && data.turnResult);

  return {
    phase: data.phase,
    seed: data.seed,
    rng,
    difficulty: data.difficulty,
    speciesBundle,
    animal,
    time: data.time,
    behavioralSettings: data.behavioralSettings,
    reproduction: data.reproduction,
    currentEvents: data.currentEvents,
    pendingChoices: data.pendingChoices,
    revocableChoices: data.revocableChoices ?? {},
    npcs: data.npcs ?? [],
    activeStorylines: data.activeStorylines ?? [],
    currentWeather: data.currentWeather ?? null,
    turnHistory: data.turnHistory ?? [],
    eventCooldowns: data.eventCooldowns ?? {},
    worldMemory: data.worldMemory ? {
      ...data.worldMemory,
      seasonalTotals: {
        ...data.worldMemory.seasonalTotals,
        nodesVisited: new Set(data.worldMemory.seasonalTotals.nodesVisited),
      },
    } : createWorldMemory(data.time.season),
    // v1 saves never stored the map; give them a fresh one so movement works
    map: isLegacy ? generateRegionMap(rng) : data.map ?? null,
    territory: data.territory ?? initialTerritoryFor(animal.flags),
    ecosystem: data.ecosystem ?? initializeEcosystem(),
    scenario: data.scenario ?? null,
    scenarioOutcome: data.scenarioOutcome ?? null,
    climateShift: data.climateShift ?? 0,
    npcBehaviorStates: data.npcBehaviorStates ?? {},
    evolution: data.evolution ?? {
      activeMutations: animal.activeMutations,
      availableChoices: [],
      generationCount: 0,
      lineageHistory: [],
    },
    lineage: data.lineage ?? null,
    actionsPerformed: data.actionsPerformed ?? [],
    ambientText: data.ambientText ?? null,
    instinctNudges: data.instinctNudges ?? [],
    showingResults,
    turnResult: showingResults ? data.turnResult ?? null : null,
  };
}

/** Save game state to localStorage. Returns false if the browser refused it. */
export function saveGame(state: GameState): boolean {
  try {
    const serialized = serializeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    return true;
  } catch (err) {
    console.error('Could not save game:', err);
    return false;
  }
}

/** Load game state from localStorage, returns null if no usable save exists */
export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: SerializedState = JSON.parse(raw);
    // Basic validation
    if (!data.phase || !data.animal || !data.time) return null;
    return deserializeState(data);
  } catch (err) {
    console.error('Could not load saved game:', err);
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
