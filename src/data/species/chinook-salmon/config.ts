import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const CHINOOK_SALMON_CONFIG: SpeciesConfig = {
  id: 'chinook-salmon',
  name: 'Chinook Salmon',
  scientificName: 'Oncorhynchus tshawytscha',
  description:
    'The largest of the Pacific salmon species. Born in freshwater, they migrate to the ocean to feed and grow before returning to their natal streams to spawn and die — a single, all-consuming act of reproduction.',
  diet: 'carnivore',
  defaultRegion: 'pacific-northwest-ocean',
  defaultRegionDisplayName: 'Pacific Northwest Ocean',

  startingWeight: { male: 30, female: 25 },
  startingAge: {
    'hatchery-raised': 18,
    'wild-spawned': 12,
    'transplanted-stock': 24,
  },
  baseStats: {
    [StatId.IMM]: 40,
    [StatId.CLI]: 20,
    [StatId.HOM]: 35,
    [StatId.TRA]: 30,
    [StatId.ADV]: 30,
    [StatId.NOV]: 40,
    [StatId.WIS]: 25,
    [StatId.HEA]: 60,
    [StatId.STR]: 35,
  },

  weight: {
    starvationDeath: 4,
    starvationDebuff: 8,
    vulnerabilityThreshold: 12,
    minFloor: 2,
    debuffMaxPenalty: 15,
    maximumBiologicalWeight: 130,
  },

  age: {
    oldAgeOnsetMonths: 72,
    oldAgeBaseChance: 0.05,
    oldAgeEscalation: 2.0,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.10,

  predationVulnerability: {
    injuryProbIncrease: 0.08,
    parasiteProbIncrease: 0.05,
    underweightFactor: 0.005,
    underweightThreshold: 12,
    deathChanceMin: 0.02,
    deathChanceMax: 0.85,
  },

  thermalProfile: {
    type: 'ectotherm',
    heatPenalty: 0.5,
    coldPenalty: 0,
    coldBenefit: 0.2,
  },

  seasonalWeight: {
    spring: 0.8,    // Good ocean feeding
    summer: 1.0,    // Peak ocean feeding
    autumn: -0.5,   // Migration drain (if migrating)
    winter: -0.3,   // Reduced ocean food
    foragingBonus: 0.2,
  },

  agePhases: [
    { id: 'smolt', label: 'Smolt', minAge: 0, maxAge: 12, statModifiers: [{ stat: StatId.ADV, amount: 10 }] },
    { id: 'ocean-juvenile', label: 'Ocean Juvenile', minAge: 12, maxAge: 36, statModifiers: [{ stat: StatId.ADV, amount: 3 }] },
    { id: 'adult', label: 'Adult', minAge: 36 },
  ],

  reproduction: {
    type: 'semelparous',
    spawningMinAge: 36,
    spawningSeasons: ['autumn'],
    baseEggCount: 4000,
    eggCountHeaFactor: 30,
    eggCountWeightFactor: 100,
    eggSurvivalBase: 0.001,
    eggSurvivalWisFactor: 0.00003,
    spawningMigrationFlag: 'spawning-migration-begun',
    spawningGroundsFlag: 'reached-spawning-grounds',
    spawningCompleteFlag: 'spawning-complete',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.30,
      maxWinProb: 0.60,
      minWinProb: 0.05,
      heaFactor: 0.003,
      weightReferencePoint: 25,
      weightFactor: 0.005,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.08,
      parasitePenalty: 0.05,
      lossInjuryChance: 0.3,
      lossInjuryId: 'scale-damage',
      lossInjuryBodyParts: ['left flank', 'right flank', 'dorsal fin', 'tail'],
      challengeFlag: 'attempted-spawning-fight',
      matedFlag: 'spawning-position-won',
    },
  },

  phases: [
    { id: 'ocean', label: 'Ocean Life', regionId: 'pacific-northwest-ocean', description: 'Open ocean feeding and growth' },
    { id: 'migration', label: 'Upstream Migration', entryFlag: 'spawning-migration-begun', regionId: 'columbia-river', description: 'Battling upstream to spawning grounds' },
    { id: 'spawning', label: 'Spawning', entryFlag: 'reached-spawning-grounds', regionId: 'spawning-stream', description: 'Final spawning and death' },
  ],

  actions: {
    overrides: {
      explore: {
        narrative: 'You range through the water column and discover a rich pocket of krill and small squid.',
        weightGain: 0.5,
      },
      rest: {
        narrative: 'You find a pocket of calm water behind a submerged reef and conserve your energy.',
      }
    }
  },

  templateVars: {
    speciesName: 'Chinook Salmon',
    regionName: 'Pacific Northwest',
    maleNoun: 'jack',
    femaleNoun: 'hen',
    youngNoun: 'fry',
    youngNounPlural: 'fry',
    groupNoun: 'run',
    habitat: 'ocean',
  },
};
