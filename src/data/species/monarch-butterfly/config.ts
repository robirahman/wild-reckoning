import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const MONARCH_BUTTERFLY_CONFIG: SpeciesConfig = {
  id: 'monarch-butterfly',
  name: 'Monarch Butterfly',
  scientificName: 'Danaus plexippus',
  description:
    'A creature of impossible fragility performing an impossible journey. No single monarch completes the full migration cycle — the knowledge to navigate thousands of miles is written in their genes, not their memory. You are not just an animal. You are a lineage.',
  diet: 'herbivore',
  defaultRegion: 'great-lakes-milkweed',
  defaultRegionDisplayName: 'Great Lakes Milkweed Corridor',

  startingWeight: { male: 0.00088, female: 0.00092 },
  startingAge: {
    'wild-hatched': 0,
    'lab-hatched': 0,
    'generation-4': 4,
  },
  baseStats: {
    [StatId.IMM]: 25,
    [StatId.CLI]: 50,
    [StatId.HOM]: 20,
    [StatId.TRA]: 30,
    [StatId.ADV]: 35,
    [StatId.NOV]: 40,
    [StatId.WIS]: 15,
    [StatId.HEA]: 50,
    [StatId.STR]: 30,
  },

  weight: {
    starvationDeath: 0.00022,
    starvationDebuff: 0.00044,
    vulnerabilityThreshold: 0.00055,
    minFloor: 0.00011,
    debuffMaxPenalty: 25,
  },

  age: {
    oldAgeOnsetMonths: 7,
    oldAgeBaseChance: 0.08,
    oldAgeEscalation: 2.0,
    maxOldAgeChance: 0.98,
  },

  diseaseDeathChanceAtCritical: 0.15,

  predationVulnerability: {
    injuryProbIncrease: 0.10,
    parasiteProbIncrease: 0.05,
    underweightFactor: 0.010,
    underweightThreshold: 0.00055,
    deathChanceMin: 0.02,
    deathChanceMax: 0.90,
  },

  seasonalWeight: {
    spring: 0.00003,
    summer: 0.00004,
    autumn: 0.00002,
    winter: -0.00001,
    foragingBonus: 0.00001,
  },

  agePhases: [
    {
      id: 'caterpillar',
      label: 'Caterpillar',
      minAge: 0,
      maxAge: 1,
    },
    {
      id: 'chrysalis',
      label: 'Chrysalis',
      minAge: 1,
      maxAge: 2,
      statModifiers: [
        { stat: StatId.ADV, amount: 20 },
        { stat: StatId.NOV, amount: 15 },
      ],
    },
    {
      id: 'adult-butterfly',
      label: 'Adult Butterfly',
      minAge: 2,
      maxAge: 6,
    },
    {
      id: 'migratory-generation',
      label: 'Migratory Generation',
      minAge: 6,
      statModifiers: [
        { stat: StatId.HEA, amount: 5 },
        { stat: StatId.WIS, amount: 8 },
      ],
    },
  ],

  migration: {
    winterRegionId: 'oyamel-fir-forest-mexico',
    winterRegionName: 'Oyamel Fir Forest, Mexico',
    migrationFlag: 'southward-migration-begun',
    migratedFlag: 'reached-overwintering-site',
    returnFlag: 'northward-migration-begun',
    migrationSeason: 'autumn',
    returnSeason: 'spring',
  },

  reproduction: {
    type: 'semelparous',
    spawningMinAge: 2,
    spawningSeasons: ['spring', 'summer'],
    baseEggCount: 400,
    eggCountHeaFactor: 3,
    eggCountWeightFactor: 100000,
    eggSurvivalBase: 0.02,
    eggSurvivalWisFactor: 0.0001,
    spawningMigrationFlag: 'milkweed-found',
    spawningGroundsFlag: 'eggs-laid',
    spawningCompleteFlag: 'reproduction-complete',
    maleCompetition: {
      enabled: false,
      baseWinProb: 0.50,
      maxWinProb: 0.50,
      minWinProb: 0.50,
      heaFactor: 0,
      weightReferencePoint: 0.0009,
      weightFactor: 0,
      lowStressThreshold: 50,
      lowStressFactor: 0,
      injuryPenalty: 0,
      parasitePenalty: 0,
      lossInjuryChance: 0.1,
      lossInjuryId: 'wing-tear',
      lossInjuryBodyParts: ['right forewing', 'left forewing'],
      challengeFlag: 'mating-attempted',
      matedFlag: 'mated',
    },
  },

  phases: [
    { id: 'larval', label: 'Larval Stage', regionId: 'great-lakes-milkweed', description: 'Feeding on milkweed as a caterpillar' },
    { id: 'chrysalis', label: 'Chrysalis', regionId: 'great-lakes-milkweed', description: 'Metamorphosis within the chrysalis' },
    { id: 'adult', label: 'Adult Butterfly', regionId: 'great-lakes-milkweed', description: 'Nectaring, mating, and egg-laying' },
    { id: 'migration-south', label: 'Southward Migration', entryFlag: 'southward-migration-begun', regionId: 'texas-gulf-coast-stopover', description: 'Flying south toward overwintering grounds' },
    { id: 'overwintering', label: 'Overwintering', entryFlag: 'reached-overwintering-site', regionId: 'oyamel-fir-forest-mexico', description: 'Clustering in oyamel fir forests through winter' },
  ],

  lineageMode: true,

  weightUnit: 'mg',
  weightDisplayMultiplier: 453592,

  templateVars: {
    speciesName: 'Monarch Butterfly',
    regionName: 'Great Lakes',
    maleNoun: 'male',
    femaleNoun: 'female',
    youngNoun: 'larva',
    youngNounPlural: 'larvae',
    groupNoun: 'kaleidoscope',
    habitat: 'milkweed meadow',
  },
};
