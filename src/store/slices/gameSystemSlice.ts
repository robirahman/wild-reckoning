import type { GameSlice, GameSystemSlice } from './types';
import { createRng } from '../../engine/RandomUtils';
import { getSpeciesBundle } from '../../data/species';
import { initializeEcosystem } from '../../engine/EcosystemSystem';
import { INITIAL_TERRITORY } from '../../types/territory';
import { generateRegionMap } from '../../engine/MapSystem';
import { createInitialTime } from '../../engine/TimeSystem';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../../types/behavior';
import { loadGame } from '../persistence';
import { createInitialAnimal, initialReproduction } from './helpers';
import { createWorldMemory } from '../../simulation/memory/types';
import type { WaterKnowledge, WaterSourceKnowledge } from '../../simulation/memory/types';
import type { RegionMap } from '../../types/map';

/** Initialize elephant matriarch water knowledge from the generated map */
function initializeWaterKnowledge(speciesId: string, backstoryType: string, map: RegionMap): WaterKnowledge | undefined {
  if (speciesId !== 'african-elephant') return undefined;

  const waterNodes = map.nodes.filter(n => n.type === 'water');

  if (backstoryType === 'orphaned-by-poachers') {
    // Orphan: matriarch already dead, no water knowledge
    return { knownSources: {}, matriarchAlive: false };
  }

  if (backstoryType === 'translocated') {
    // Translocated: matriarch alive but unfamiliar territory
    return { knownSources: {}, matriarchAlive: true };
  }

  // Wild-born: matriarch knows all water sources
  const sources: Record<string, WaterSourceKnowledge> = {};
  for (const node of waterNodes) {
    sources[node.id] = {
      nodeId: node.id,
      reliability: 'permanent',
      lastVisitedTurn: 0,
    };
  }
  return { knownSources: sources, matriarchAlive: true };
}

export const createGameSystemSlice: GameSlice<GameSystemSlice> = (set) => {
  const seed = Date.now();
  const rng = createRng(seed);
  const defaultBundle = getSpeciesBundle('white-tailed-deer');

  return {
    seed,
    rng,
    speciesBundle: defaultBundle,
    difficulty: 'normal',

    startGame: (speciesId, backstory, sex, difficulty, seed) => {
      const newSeed = seed ?? Date.now();
      const bundle = getSpeciesBundle(speciesId);
      const tutorialSeen = localStorage.getItem('wild-reckoning-tutorial-seen') === 'true';
      const rng = createRng(newSeed);
      const map = generateRegionMap(rng);

      const worldMemory = createWorldMemory('spring');
      const waterKnowledge = initializeWaterKnowledge(speciesId, backstory.type, map);
      if (waterKnowledge) {
        worldMemory.waterKnowledge = waterKnowledge;
      }

      set({
        phase: 'playing',
        seed: newSeed,
        rng,
        difficulty: difficulty ?? 'normal',
        speciesBundle: bundle,
        animal: createInitialAnimal(bundle.config, backstory, sex),
        time: createInitialTime(5, 1),
        behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
        reproduction: initialReproduction(bundle.config),
        currentEvents: [],
        pendingChoices: [],
        revocableChoices: {},
        npcs: [],
        activeStorylines: [],
        tutorialStep: tutorialSeen ? null : 0,
        currentWeather: null,
        turnResult: null,
        showingResults: false,
        turnHistory: [],
        eventCooldowns: {},
        ambientText: null,
        ecosystem: initializeEcosystem(),
        territory: { ...INITIAL_TERRITORY },
        map,
        scenario: null,
        climateShift: 0,
        worldMemory,
        npcBehaviorStates: {},
        lineage: null,
        actionsPerformed: [],
        evolution: { activeMutations: [], availableChoices: [], generationCount: 0, lineageHistory: [] },
        fastForward: false,
      });
    },

    resumeGame: () => {
      const saved = loadGame();
      if (!saved || saved.phase !== 'playing') return false;
      set(saved);
      return true;
    },
  };
};
