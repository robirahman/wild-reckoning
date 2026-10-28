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
import { buildAnatomyIndex } from '../../simulation/anatomy/types';
import { getMetabolismConfig } from '../../simulation/physiology/configs';
import { initializePhysiology } from '../../simulation/physiology/initialize';

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

  // Initialize physiology state if species has a metabolism config
  const startWeight = sex === 'female' ? config.startingWeight.female : config.startingWeight.male;
  const age = config.startingAge[backstory.type] ?? Object.values(config.startingAge)[0];
  const hasMetabolism = config.metabolismId ? getMetabolismConfig(config.metabolismId) : undefined;
  const physiology = hasMetabolism ? initializePhysiology(config, startWeight, sex, age) : undefined;

  return {
    speciesId: config.id,
    age,
    startAge: age,
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
    physiologicalStress: { hypothermia: 0, starvation: 0, panic: 0, dehydration: 0 },
    lifetimeStats: { ...INITIAL_LIFETIME_STATS, regionsVisited: [config.defaultRegion] },
    bodyState: anatomy?.bodyState,
    anatomyIndex: anatomy?.index,
    debriefingLog: anatomy ? [] : undefined,
    physiologyState: physiology,
  };
}

/** JSON-safe form of AnimalState: flags as an array, derived anatomy index omitted */
export type SerializedAnimal = Omit<AnimalState, 'flags' | 'anatomyIndex'> & { flags: string[] };

export function dehydrateAnimal(animal: AnimalState): SerializedAnimal {
  const copy: AnimalState = { ...animal };
  // Derived from the static anatomy definition (and full of Maps); rebuilt on load
  delete copy.anatomyIndex;
  return { ...copy, flags: Array.from(animal.flags) };
}

/**
 * Restore a live AnimalState from saved data, rebuilding derived lookups.
 * Tolerates older saves that stored a (JSON-mangled) anatomyIndex.
 */
export function hydrateAnimal(config: SpeciesConfig, raw: SerializedAnimal): AnimalState {
  const anatomyDef = config.anatomyId ? getAnatomyDefinition(config.anatomyId) : undefined;
  return {
    ...raw,
    flags: new Set(raw.flags as GameFlag[]),
    anatomyIndex: anatomyDef && raw.bodyState ? buildAnatomyIndex(anatomyDef) : undefined,
  };
}

export function initialReproduction(config: SpeciesConfig): ReproductionState {
  return config.reproduction.type === 'iteroparous'
    ? { ...INITIAL_ITEROPAROUS_STATE }
    : { ...INITIAL_SEMELPAROUS_STATE };
}
