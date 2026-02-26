import type { AnimalState, Backstory } from '../../types/species';
import type { SpeciesConfig } from '../../types/speciesConfig';
import type { ReproductionState } from '../../types/reproduction';
import type { GameFlag } from '../../types/flags';
import { StatId, INITIAL_LIFETIME_STATS } from '../../types/stats';
import { createStatBlock } from '../../engine/StatCalculator';
import { INITIAL_SOCIAL_STATE } from '../../types/social';
import { INITIAL_ITEROPAROUS_STATE, INITIAL_SEMELPAROUS_STATE } from '../../types/reproduction';
import { getAnatomyDefinition } from '../../simulation/anatomy/definitions';
import { initializeAnatomy } from '../../simulation/anatomy/bodyState';

export function createInitialAnimal(config: SpeciesConfig, backstory: Backstory, sex: 'male' | 'female'): AnimalState {
  const baseBases: Record<StatId, number> = { ...config.baseStats };

  for (const adj of backstory.statAdjustments) {
    const statId = adj.stat as StatId;
    if (statId in baseBases) {
      baseBases[statId] = Math.max(0, Math.min(100, baseBases[statId] + adj.amount));
    }
  }

  // Initialize anatomy-based body state if species has an anatomy definition
  const anatomyDef = config.anatomyId ? getAnatomyDefinition(config.anatomyId) : undefined;
  const anatomy = anatomyDef ? initializeAnatomy(anatomyDef) : undefined;

  return {
    speciesId: config.id,
    age: config.startingAge[backstory.type] ?? Object.values(config.startingAge)[0],
    weight: sex === 'female' ? config.startingWeight.female : config.startingWeight.male,
    sex,
    region: config.defaultRegion,
    stats: createStatBlock(baseBases),
    parasites: [],
    injuries: [],
    conditions: [],
    backstory,
    flags: new Set<GameFlag>(),
    alive: true,
    activeMutations: [],
    social: { ...INITIAL_SOCIAL_STATE },
    energy: 100,
    perceptionRange: 1,
    nutrients: { minerals: 80, vitamins: 80 },
    physiologicalStress: { hypothermia: 0, starvation: 0, panic: 0 },
    lifetimeStats: { ...INITIAL_LIFETIME_STATS, regionsVisited: [config.defaultRegion] },
    bodyState: anatomy?.bodyState,
    anatomyIndex: anatomy?.index,
    debriefingLog: anatomy ? [] : undefined,
  };
}

export function initialReproduction(config: SpeciesConfig): ReproductionState {
  return config.reproduction.type === 'iteroparous'
    ? { ...INITIAL_ITEROPAROUS_STATE }
    : { ...INITIAL_SEMELPAROUS_STATE };
}
