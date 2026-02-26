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

export const createGameSystemSlice: GameSlice<GameSystemSlice> = (set, get) => {
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
        map: generateRegionMap(rng),
        scenario: null,
        climateShift: 0,
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
