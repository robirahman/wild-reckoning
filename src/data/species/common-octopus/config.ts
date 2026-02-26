import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const COMMON_OCTOPUS_CONFIG: SpeciesConfig = {
  id: 'common-octopus',
  name: 'Common Octopus',
  scientificName: 'Octopus vulgaris',
  description:
    'Eight arms, three hearts, blue blood, and a brain that wraps around your esophagus. You are among the most intelligent invertebrates on Earth — capable of solving puzzles, using tools, and changing color in milliseconds. Your life is tragically short: one to two years, ending inevitably after you mate. Females brood their eggs for months without eating, wasting away as their offspring develop. Males wander after mating, their bodies slowly shutting down in a programmed senescence. You are brilliant, brief, and alone.',
  diet: 'carnivore',
  defaultRegion: 'mediterranean-reef',
  defaultRegionDisplayName: 'Mediterranean Reef',

  startingWeight: { male: 4.5, female: 5.0 },
  startingAge: {
    'reef-hatched': 2,
    'tide-pool-survivor': 1,
    'lab-escaped': 3,
  },
  baseStats: {
    [StatId.IMM]: 35,
    [StatId.CLI]: 30,
    [StatId.HOM]: 30,
    [StatId.TRA]: 25,
    [StatId.ADV]: 40,
    [StatId.NOV]: 45,
    [StatId.WIS]: 55,
    [StatId.HEA]: 60,
    [StatId.STR]: 35,
  },

  weight: {
    starvationDeath: 1.0,
    starvationDebuff: 2.0,
    vulnerabilityThreshold: 3.0,
    minFloor: 0.5,
    debuffMaxPenalty: 20,
    maximumBiologicalWeight: 20,
  },

  age: {
    oldAgeOnsetMonths: 14,
    oldAgeBaseChance: 0.08,
    oldAgeEscalation: 2.5,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.12,

  predationVulnerability: {
    injuryProbIncrease: 0.10,
    parasiteProbIncrease: 0.06,
    underweightFactor: 0.008,
    underweightThreshold: 3.0,
    deathChanceMin: 0.03,
    deathChanceMax: 0.88,
  },

  thermalProfile: {
    type: 'ectotherm',
    heatPenalty: 0.8,
    coldPenalty: 0,
    coldBenefit: 0.3,
  },

  seasonalWeight: {
    spring: 0.4,
    summer: 0.5,
    autumn: 0.3,
    winter: -0.1,
    foragingBonus: 0.15,
  },

  agePhases: [
    {
      id: 'hatchling',
      label: 'Hatchling',
      minAge: 0,
      maxAge: 3,
      statModifiers: [
        { stat: StatId.ADV, amount: 15 },
        { stat: StatId.NOV, amount: 10 },
      ],
    },
    {
      id: 'juvenile',
      label: 'Juvenile',
      minAge: 3,
      maxAge: 8,
      statModifiers: [
        { stat: StatId.ADV, amount: 5 },
      ],
    },
    {
      id: 'adult',
      label: 'Adult',
      minAge: 8,
      maxAge: 14,
    },
    {
      id: 'senescent',
      label: 'Senescent',
      minAge: 14,
      statModifiers: [
        { stat: StatId.HEA, amount: -25 },
        { stat: StatId.WIS, amount: -10 },
        { stat: StatId.HOM, amount: 15 },
      ],
    },
  ],

  reproduction: {
    type: 'semelparous',
    spawningMinAge: 8,
    spawningSeasons: ['spring', 'summer'],
    baseEggCount: 200000,
    eggCountHeaFactor: 5000,
    eggCountWeightFactor: 20000,
    eggSurvivalBase: 0.0001,
    eggSurvivalWisFactor: 0.000002,
    spawningMigrationFlag: 'den-search-begun',
    spawningGroundsFlag: 'brooding-den-found',
    spawningCompleteFlag: 'eggs-laid',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.30,
      maxWinProb: 0.65,
      minWinProb: 0.08,
      heaFactor: 0.004,
      weightReferencePoint: 5.0,
      weightFactor: 0.006,
      lowStressThreshold: 35,
      lowStressFactor: 0.003,
      injuryPenalty: 0.08,
      parasitePenalty: 0.05,
      lossInjuryChance: 0.25,
      lossInjuryId: 'arm-loss',
      lossInjuryBodyParts: ['arm-1', 'arm-2', 'arm-3', 'arm-4', 'arm-5', 'arm-6', 'arm-7', 'arm-8'],
      challengeFlag: 'rival-confrontation',
      matedFlag: 'mating-complete',
    },
  },

  phases: [
    { id: 'planktonic', label: 'Planktonic Phase', regionId: 'mediterranean-reef', description: 'Drifting in open water as a tiny paralarva' },
    { id: 'settlement', label: 'Reef Settlement', entryFlag: 'settled-on-reef', regionId: 'mediterranean-reef', description: 'Settled on the reef and learning to hunt' },
    { id: 'adult-life', label: 'Adult Life', entryFlag: 'first-hunt-success', regionId: 'mediterranean-reef', description: 'Hunting, denning, and navigating the reef' },
    { id: 'brooding', label: 'Brooding / Senescence', entryFlag: 'eggs-laid', regionId: 'mediterranean-reef', description: 'Guarding eggs until they hatch — or wandering toward death' },
  ],

  templateVars: {
    speciesName: 'Common Octopus',
    regionName: 'Mediterranean',
    maleNoun: 'male',
    femaleNoun: 'female',
    youngNoun: 'paralarva',
    youngNounPlural: 'paralarvae',
    groupNoun: 'consortium',
    habitat: 'reef',
  },
};
