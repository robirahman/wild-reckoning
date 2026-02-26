import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const HONEYBEE_WORKER_CONFIG: SpeciesConfig = {
  id: 'honeybee-worker',
  name: 'Honeybee Worker',
  scientificName: 'Apis mellifera',
  description:
    'You are one among 50,000. You will never reproduce — that privilege belongs to the queen alone. Instead, you will spend your brief life in service to the colony: cleaning cells, feeding larvae, building comb, guarding the entrance, and finally venturing out into a world of flowers, pesticides, and predators. You will fly 500 miles in your lifetime, visit 2 million flowers, and produce one-twelfth of a teaspoon of honey. You will die in six weeks. The colony will not notice.',
  diet: 'herbivore',
  defaultRegion: 'midwest-prairie-apiary',
  defaultRegionDisplayName: 'Midwest Prairie',

  startingWeight: { male: 0.00019, female: 0.00022 },
  startingAge: {
    'spring-brood': 0,
    'summer-brood': 0,
    'winter-brood': 0,
  },
  baseStats: {
    [StatId.IMM]: 35,
    [StatId.CLI]: 40,
    [StatId.HOM]: 30,
    [StatId.TRA]: 20,
    [StatId.ADV]: 25,
    [StatId.NOV]: 30,
    [StatId.WIS]: 40,
    [StatId.HEA]: 55,
    [StatId.STR]: 30,
  },

  weight: {
    starvationDeath: 0.00005,
    starvationDebuff: 0.00010,
    vulnerabilityThreshold: 0.00014,
    minFloor: 0.00003,
    debuffMaxPenalty: 20,
    maximumBiologicalWeight: 0.0004,
  },

  age: {
    oldAgeOnsetMonths: 5,
    oldAgeBaseChance: 0.12,
    oldAgeEscalation: 3.0,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.15,

  predationVulnerability: {
    injuryProbIncrease: 0.10,
    parasiteProbIncrease: 0.08,
    underweightFactor: 0.012,
    underweightThreshold: 0.00014,
    deathChanceMin: 0.02,
    deathChanceMax: 0.90,
  },

  seasonalWeight: {
    spring: 0.000008,
    summer: 0.000010,
    autumn: 0.000005,
    winter: -0.000005,
    foragingBonus: 0.000003,
  },

  agePhases: [
    {
      id: 'nurse',
      label: 'Nurse Bee',
      minAge: 0,
      maxAge: 1,
      statModifiers: [
        { stat: StatId.IMM, amount: -5 },
        { stat: StatId.HOM, amount: -5 },
      ],
    },
    {
      id: 'house-bee',
      label: 'House Bee',
      minAge: 1,
      maxAge: 2,
    },
    {
      id: 'guard',
      label: 'Guard Bee',
      minAge: 2,
      maxAge: 3,
      statModifiers: [
        { stat: StatId.ADV, amount: 8 },
      ],
    },
    {
      id: 'forager',
      label: 'Forager',
      minAge: 3,
      maxAge: 5,
      statModifiers: [
        { stat: StatId.HOM, amount: 10 },
        { stat: StatId.CLI, amount: 8 },
        { stat: StatId.ADV, amount: 5 },
      ],
    },
    {
      id: 'scout',
      label: 'Scout',
      minAge: 5,
      statModifiers: [
        { stat: StatId.ADV, amount: 15 },
        { stat: StatId.WIS, amount: 8 },
        { stat: StatId.HOM, amount: 12 },
      ],
    },
  ],

  reproduction: {
    type: 'semelparous',
    spawningMinAge: 2,
    spawningSeasons: ['spring', 'summer', 'autumn', 'winter'],
    baseEggCount: 0,
    eggCountHeaFactor: 0,
    eggCountWeightFactor: 0,
    eggSurvivalBase: 0,
    eggSurvivalWisFactor: 0,
    spawningMigrationFlag: 'sting-defense-triggered',
    spawningGroundsFlag: 'sacrifice-made',
    spawningCompleteFlag: 'worker-final-act',
    maleCompetition: {
      enabled: false,
      baseWinProb: 0,
      maxWinProb: 0,
      minWinProb: 0,
      heaFactor: 0,
      weightReferencePoint: 0,
      weightFactor: 0,
      lowStressThreshold: 0,
      lowStressFactor: 0,
      injuryPenalty: 0,
      parasitePenalty: 0,
      lossInjuryChance: 0,
      lossInjuryId: '',
      lossInjuryBodyParts: [],
      challengeFlag: '',
      matedFlag: '',
    },
  },

  lineageMode: true,

  weightUnit: 'mg',
  weightDisplayMultiplier: 453592,

  templateVars: {
    speciesName: 'Honeybee Worker',
    regionName: 'Midwest Prairie',
    maleNoun: 'drone',
    femaleNoun: 'worker',
    youngNoun: 'larva',
    youngNounPlural: 'larvae',
    groupNoun: 'colony',
    habitat: 'hive',
  },
};
