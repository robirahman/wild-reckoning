import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const WHITE_TAILED_DEER_CONFIG: SpeciesConfig = {
  id: 'white-tailed-deer',
  name: 'White-Tailed Deer',
  scientificName: 'Odocoileus virginianus',
  description:
    'A medium-sized ungulate native to the Americas. Adaptable and widespread, but vulnerable to predation, parasites, and the brutal realities of a Minnesota winter.',
  diet: 'herbivore',
  defaultRegion: 'northern-minnesota',
  defaultRegionDisplayName: 'Northern Minnesota',

  startingWeight: { male: 110, female: 84 },
  startingAge: {
    rehabilitation: 17,
    'wild-born': 12,
    orphaned: 12,
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
    starvationDeath: 35,
    starvationDebuff: 60,
    vulnerabilityThreshold: 80,
    minFloor: 20,
    debuffMaxPenalty: 15,
    maximumBiologicalWeight: 300,
  },

  age: {
    oldAgeOnsetMonths: 96,
    oldAgeBaseChance: 0.02,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.08,

  predationVulnerability: {
    injuryProbIncrease: 0.05,
    parasiteProbIncrease: 0.02,
    underweightFactor: 0.003,
    underweightThreshold: 80,
    deathChanceMin: 0.01,
    deathChanceMax: 0.80,
  },

  thermalProfile: {
    type: 'endotherm',
    heatPenalty: 0.4,
    coldPenalty: 0.5,
    coldBenefit: 0,
  },

  seasonalWeight: {
    spring: 0.5,    // Moderate gain — new growth
    summer: 1.0,    // Good gain — abundant food
    autumn: 0.8,    // Good gain — acorn mast
    winter: -1.5,   // Significant loss — food scarcity
    foragingBonus: 0.3,  // +0.3 to +1.5 based on foraging setting
  },

  agePhases: [
    { id: 'fawn', label: 'Fawn', minAge: 0, maxAge: 12 },
    { id: 'yearling', label: 'Yearling', minAge: 12, maxAge: 24, statModifiers: [{ stat: StatId.ADV, amount: 5 }, { stat: StatId.WIS, amount: -5 }] },
    { id: 'prime', label: 'Prime Adult', minAge: 24, maxAge: 96 },
    { id: 'elderly', label: 'Elderly', minAge: 96, statModifiers: [{ stat: StatId.HEA, amount: -8 }, { stat: StatId.WIS, amount: 10 }] },
  ],

  migration: {
    winterRegionId: 'minnesota-winter-yard',
    winterRegionName: 'Winter Yard',
    migrationFlag: 'will-migrate',
    migratedFlag: 'has-migrated',
    returnFlag: 'returned-from-migration',
    migrationSeason: 'winter',
    returnSeason: 'spring',
  },

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 16,
    matingOnsetAge: 18,
    matingSeasons: ['autumn'],
    matingSeasonResetMonth: 'September',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.15,
      maxWinProb: 0.45,
      minWinProb: 0.02,
      heaFactor: 0.003,
      weightReferencePoint: 130,
      weightFactor: 0.001,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.05,
      parasitePenalty: 0.03,
      lossInjuryChance: 0.4,
      lossInjuryId: 'antler-wound',
      lossInjuryBodyParts: ['right shoulder', 'left shoulder', 'left flank', 'right flank', 'right haunch'],
      challengeFlag: 'attempted-buck-challenge',
      matedFlag: 'mated-this-season',
    },
    gestationTurns: 28,
    offspringCountFormula: {
      weightReference: 80,
      weightDivisor: 80,
      heaReference: 40,
      heaDivisor: 60,
      singleThreshold: 0.40,
      tripletThreshold: 0.90,
      maxOffspring: 3,
    },
    offspringLabel: 'fawn',
    offspringLabelPlural: 'fawns',
    offspringLabelSingle: 'a single fawn',
    offspringLabelTwin: 'twin fawns',
    offspringLabelTriple: 'triplet fawns',
    dependenceTurns: 20,
    maturationTurns: 72,
    offspringBaseSurvival: 0.992,
    offspringSurvivalWinterPenalty: 0.008,
    offspringSurvivalSummerBonus: 0.003,
    offspringSurvivalYoungPenalty: 0.005,
    offspringSurvivalYoungThreshold: 32,
    offspringSurvivalMin: 0.90,
    offspringSurvivalMax: 0.998,
    offspringDeathCauses: [
      'Killed by predators',
      'Died of exposure',
      'Succumbed to disease',
      'Lost to starvation',
    ],
    pregnantFlag: 'pregnant',
    dependentFlag: 'fawns-dependent',
    independenceFlag: 'fawns-just-independent',
  },

  templateVars: {
    speciesName: 'White-Tailed Deer',
    regionName: 'Northern Minnesota',
    maleNoun: 'buck',
    femaleNoun: 'doe',
    youngNoun: 'fawn',
    youngNounPlural: 'fawns',
    groupNoun: 'herd',
    habitat: 'forest',
  },
};
