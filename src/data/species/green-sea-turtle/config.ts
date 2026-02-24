import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const GREEN_SEA_TURTLE_CONFIG: SpeciesConfig = {
  id: 'green-sea-turtle',
  name: 'Green Sea Turtle',
  scientificName: 'Chelonia mydas',
  description:
    'One of the oldest lineages of life on Earth, unchanged for 110 million years. Green sea turtles cross entire oceans to return to the same beach where they were born.',
  diet: 'herbivore',
  defaultRegion: 'caribbean-sea',
  defaultRegionDisplayName: 'Caribbean Sea',

  startingWeight: { male: 290, female: 310 },
  startingAge: {
    'open-ocean-survivor': 180,
    'rescued-from-net': 240,
    'satellite-tracked': 300,
  },
  baseStats: {
    [StatId.IMM]: 30,
    [StatId.CLI]: 30,
    [StatId.HOM]: 25,
    [StatId.TRA]: 20,
    [StatId.ADV]: 25,
    [StatId.NOV]: 30,
    [StatId.WIS]: 35,
    [StatId.HEA]: 65,
    [StatId.STR]: 25,
  },

  weight: {
    starvationDeath: 80,
    starvationDebuff: 150,
    vulnerabilityThreshold: 180,
    minFloor: 50,
    debuffMaxPenalty: 18,
  },

  age: {
    oldAgeOnsetMonths: 720,
    oldAgeBaseChance: 0.04,
    oldAgeEscalation: 1.3,
    maxOldAgeChance: 0.90,
  },

  diseaseDeathChanceAtCritical: 0.20,

  predationVulnerability: {
    injuryProbIncrease: 0.02,
    parasiteProbIncrease: 0.01,
    underweightFactor: 0.001,
    underweightThreshold: 180,
    deathChanceMin: 0.005,
    deathChanceMax: 0.50,
  },

  turnUnit: 'month',

  seasonalWeight: {
    spring: 2.0,
    summer: 1.0,
    autumn: 1.5,
    winter: 0.5,
    foragingBonus: 0.5,
  },

  agePhases: [
    { id: 'hatchling', label: 'Hatchling', minAge: 0, maxAge: 6 },
    { id: 'juvenile', label: 'Juvenile', minAge: 6, maxAge: 120 },
    { id: 'sub-adult', label: 'Sub-Adult', minAge: 120, maxAge: 240, statModifiers: [{ stat: StatId.WIS, amount: 5 }] },
    { id: 'adult', label: 'Adult', minAge: 240, statModifiers: [{ stat: StatId.WIS, amount: 8 }, { stat: StatId.HEA, amount: 3 }] },
  ],

  migration: {
    winterRegionId: 'nesting-beach-caribbean',
    winterRegionName: 'Nesting Beach',
    migrationFlag: 'nesting-migration-begun',
    migratedFlag: 'reached-nesting-beach',
    returnFlag: 'returning-to-ocean',
    migrationSeason: 'summer',
    returnSeason: 'autumn',
  },

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 240,
    matingOnsetAge: 300,
    matingSeasons: ['spring', 'summer'],
    matingSeasonResetMonth: 'March',
    maleCompetition: {
      enabled: false,
      baseWinProb: 0.5,
      maxWinProb: 0.5,
      minWinProb: 0.5,
      heaFactor: 0,
      weightReferencePoint: 300,
      weightFactor: 0,
      lowStressThreshold: 30,
      lowStressFactor: 0,
      injuryPenalty: 0,
      parasitePenalty: 0,
      lossInjuryChance: 0,
      lossInjuryId: 'shark-bite',
      lossInjuryBodyParts: ['flipper', 'shell'],
      challengeFlag: 'mating-attempted',
      matedFlag: 'mated-this-season',
    },
    gestationTurns: 2,
    offspringCountFormula: {
      weightReference: 250,
      weightDivisor: 500,
      heaReference: 50,
      heaDivisor: 100,
      singleThreshold: 0.0,    // Always produces clutch (80-120 eggs)
      tripletThreshold: 0.0,
      maxOffspring: 120,
    },
    offspringLabel: 'hatchling',
    offspringLabelPlural: 'hatchlings',
    offspringLabelSingle: 'a clutch of eggs',
    offspringLabelTwin: 'a large clutch of eggs',
    offspringLabelTriple: 'a massive clutch of eggs',
    dependenceTurns: 0,
    maturationTurns: 240,
    offspringBaseSurvival: 0.50,
    offspringSurvivalWinterPenalty: 0.05,
    offspringSurvivalSummerBonus: 0.03,
    offspringSurvivalYoungPenalty: 0.10,
    offspringSurvivalYoungThreshold: 6,
    offspringSurvivalMin: 0.20,
    offspringSurvivalMax: 0.65,
    offspringDeathCauses: [
      'Eaten by ghost crabs',
      'Taken by frigatebirds',
      'Disoriented by artificial lights',
      'Lost to ocean predators',
      'Killed by raccoons at nest',
      'Died from beach erosion flooding nest',
    ],
    pregnantFlag: 'carrying-eggs',
    dependentFlag: 'hatchlings-emerging',
    independenceFlag: 'hatchlings-dispersed',
  },

  templateVars: {
    speciesName: 'Green Sea Turtle',
    regionName: 'Caribbean Sea',
    maleNoun: 'bull',
    femaleNoun: 'cow',
    youngNoun: 'hatchling',
    youngNounPlural: 'hatchlings',
    groupNoun: 'bale',
    habitat: 'coral reef',
  },
};
