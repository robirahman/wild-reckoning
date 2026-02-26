import type { GameSlice, AnimalSlice } from './types';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../../types/behavior';
import { getScaling } from '../../engine/SpeciesScale';
import { VOLUNTARY_ACTIONS } from '../../engine/ActionSystem';
import { getAvailableMutations } from '../../engine/EvolutionSystem';
import { addModifier } from '../../engine/StatCalculator';
import { deleteSaveGame } from '../persistence';
import { createInitialAnimal, initialReproduction } from './helpers';
import { generateRegionMap } from '../../engine/MapSystem';
import { getSpeciesBundle } from '../../data/species';
import { INITIAL_LIFETIME_STATS } from '../../types/stats';

export const createAnimalSlice: GameSlice<AnimalSlice> = (set, get) => {
  const defaultBundle = getSpeciesBundle('white-tailed-deer');
  
  return {
    animal: createInitialAnimal(defaultBundle.config, defaultBundle.backstories[0], 'female'),
    behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
    reproduction: initialReproduction(defaultBundle.config),
    actionsPerformed: [],
    evolution: { activeMutations: [], availableChoices: [], generationCount: 0, lineageHistory: [] },
    lineage: null,
    lifetimeStats: { ...INITIAL_LIFETIME_STATS, regionsVisited: [defaultBundle.config.defaultRegion], maxGeneration: 1 },

    updateBehavioralSetting: (key, value) => {
      set({
        behavioralSettings: {
          ...get().behavioralSettings,
          [key]: value,
        },
      });
    },

    performAction: (actionId) => {
      const state = get();
      const action = VOLUNTARY_ACTIONS.find((a) => a.id === actionId);
      if (!action || state.actionsPerformed.includes(actionId)) return;

      const ctx = {
        speciesId: state.animal.speciesId,
        config: state.speciesBundle.config,
        territory: state.territory,
        reproductionType: state.speciesBundle.config.reproduction.type,
        season: state.time.season,
        matingSeasons:
          state.speciesBundle.config.reproduction.type === 'iteroparous'
            ? (state.speciesBundle.config.reproduction as Extract<typeof state.speciesBundle.config.reproduction, { type: 'iteroparous' }>).matingSeasons ?? 'any'
            : [],
        rng: state.rng,
        nutrients: state.animal.nutrients,
      };

      const result = action.execute(ctx);

      if (result.statEffects.length > 0) {
        get().applyStatEffects(result.statEffects);
      }

      for (const c of result.consequences) {
        get().applyConsequence(c);
      }

      const actionEvent = {
        definition: {
          id: `action-${actionId}`,
          type: 'passive' as const,
          category: 'environmental' as const,
          narrativeText: result.narrative,
          statEffects: result.statEffects,
          consequences: result.consequences,
          conditions: [],
          weight: 0,
          tags: ['action'],
        },
        resolvedNarrative: result.narrative,
        triggeredSubEvents: [],
      };

      set({
        actionsPerformed: [...state.actionsPerformed, actionId],
        currentEvents: [...get().currentEvents, actionEvent],
      });
    },

    killAnimal: (cause) => {
      const state = get();
      const config = state.speciesBundle.config;

      if (config.lineageMode && state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
        const availableChoices = getAvailableMutations(state.rng, 3);
        const ancestor = {
          generation: state.evolution.generationCount,
          speciesId: state.animal.speciesId,
          name: state.animal.name,
          causeOfDeath: cause,
          mutationChosen: state.evolution.activeMutations[state.evolution.activeMutations.length - 1],
        };

        set({
          phase: 'evolving',
          evolution: {
            ...state.evolution,
            availableChoices,
            lineageHistory: [...state.evolution.lineageHistory, ancestor],
          }
        });
        return;
      }

      deleteSaveGame();

      if (state.reproduction.type === 'iteroparous') {
        let updatedOffspring = state.reproduction.offspring;
        if (state.animal.sex === 'female') {
          updatedOffspring = updatedOffspring.map((o) => {
            if (o.alive && !o.independent) {
              return { ...o, alive: false, causeOfDeath: 'Mother died while dependent' };
            }
            return o;
          });
        }

        set({
          phase: 'dead',
          animal: { ...state.animal, alive: false, causeOfDeath: cause },
          reproduction: {
            ...state.reproduction,
            offspring: updatedOffspring,
            totalFitness: updatedOffspring.filter((o) => o.matured).length,
          },
        });
      } else {
        set({
          phase: 'dead',
          animal: { ...state.animal, alive: false, causeOfDeath: cause },
        });
      }
    },

    moveLocation: (nodeId) => {
      const state = get();
      if (!state.map) return;
      
      const currentNode = state.map.nodes.find(n => n.id === state.map!.currentLocationId);
      if (!currentNode?.connections.includes(nodeId)) return;
      
      const scaling = getScaling(state.speciesBundle.config.massType);
      
      const newMap = { ...state.map };
      newMap.currentLocationId = nodeId;
      newMap.nodes = newMap.nodes.map(n => n.id === nodeId ? { ...n, visited: true, discovered: true } : n);
      
      const newFlags = new Set(state.animal.flags);
      newFlags.add('just-moved');
      
      const regions = new Set(state.animal.lifetimeStats.regionsVisited);
      regions.add(state.animal.region);

      set({ 
        map: newMap, 
        animal: { 
          ...state.animal, 
          flags: newFlags,
          energy: Math.max(0, state.animal.energy - scaling.movementCost),
          lifetimeStats: {
            ...state.animal.lifetimeStats,
            distanceTraveled: state.animal.lifetimeStats.distanceTraveled + 1,
            regionsVisited: Array.from(regions),
          }
        } 
      });
    },

    sniff: () => {
      const state = get();
      if (!state.map) return;
      
      const range = state.animal.perceptionRange;
      const currentNode = state.map.nodes.find(n => n.id === state.map!.currentLocationId);
      if (!currentNode) return;

      const discoveredIds = new Set<string>([currentNode.id]);
      let currentLevel = [currentNode.id];

      for (let i = 0; i < range; i++) {
        const nextLevel: string[] = [];
        for (const id of currentLevel) {
          const node = state.map.nodes.find(n => n.id === id);
          node?.connections.forEach(connId => {
            if (!discoveredIds.has(connId)) {
              discoveredIds.add(connId);
              nextLevel.push(connId);
            }
          });
        }
        currentLevel = nextLevel;
      }

      set({
        map: {
          ...state.map,
          nodes: state.map.nodes.map(n => discoveredIds.has(n.id) ? { ...n, discovered: true } : n)
        },
        animal: { ...state.animal, energy: Math.max(0, state.animal.energy - 5) }
      });
    },

    selectMutation: (mutationId) => {
      const state = get();
      const choice = state.evolution.availableChoices.find(m => m.id === mutationId);
      if (!choice) return;

      const config = state.speciesBundle.config;
      const backstory = state.animal.backstory;
      const sex = state.rng.chance(0.5) ? 'male' as const : 'female' as const;

      const newAnimal = createInitialAnimal(config, backstory, sex);
      newAnimal.activeMutations = [...state.evolution.activeMutations, choice];
      
      const nextGen = state.evolution.generationCount + 1;
      newAnimal.lifetimeStats = {
        ...state.animal.lifetimeStats,
        maxGeneration: Math.max(state.animal.lifetimeStats.maxGeneration, nextGen),
      };
      
      if (choice.statModifiers) {
        for (const mod of choice.statModifiers) {
          newAnimal.stats = addModifier(newAnimal.stats, {
            id: `mutation-${choice.id}`,
            source: choice.name,
            sourceType: 'condition',
            stat: mod.stat,
            amount: mod.amount,
          });
        }
      }

      set({
        phase: 'playing',
        animal: newAnimal,
        reproduction: initialReproduction(config),
        evolution: {
          ...state.evolution,
          activeMutations: newAnimal.activeMutations,
          availableChoices: [],
          generationCount: state.evolution.generationCount + 1,
        },
        currentEvents: [],
        pendingChoices: [],
        revocableChoices: {},
        map: generateRegionMap(state.rng),
      });
    }
  };
};
