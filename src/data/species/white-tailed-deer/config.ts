import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const WHITE_TAILED_DEER_CONFIG: SpeciesConfig = {
  id: 'white-tailed-deer',
  name: 'White-Tailed Deer',
  scientificName: 'Odocoileus virginianus',
  description:
    'A medium-sized ungulate native to the Americas. Adaptable and widespread, but vulnerable to predation, parasites, and the brutal realities of a Minnesota winter.',
  diet: 'herbivore',
  anatomyId: 'white-tailed-deer',
  metabolismId: 'white-tailed-deer',
  naturalHealingRate: 1,
  attentionBudget: 18,
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
    // Real deer die at ~50-55% of lean body mass. Female starts at 84 lbs,
    // male at 110 lbs. 40 lbs represents severe emaciation for either sex.
    starvationDeath: 40,
    starvationDebuff: 60,
    vulnerabilityThreshold: 80,
    minFloor: 40,
    debuffMaxPenalty: 15,
    maximumBiologicalWeight: 300,
  },

  age: {
    oldAgeOnsetMonths: 96,
    oldAgeBaseChance: 0.02,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.95,
  },

  // Reduced from 0.08: deer are adapted to most regional parasites.
  // Lethal disease accounts for ~3% annual mortality in real populations.
  diseaseDeathChanceAtCritical: 0.03,

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
    // Calibrated to real deer: ~+15-20 lbs spring-fall, ~-10-13 lbs winter.
    // A 130-lb doe cycles between ~105 (late winter) and ~140 (late fall).
    spring: 0.4,    // +5.2 lbs over 13 weeks. New growth emerging.
    summer: 0.8,    // +10.4 lbs over 13 weeks. Peak forage abundance.
    autumn: 0.5,    // +6.5 lbs over 13 weeks. Acorn mast, pre-winter fat.
    winter: -0.8,   // -10.4 lbs over 13 weeks. Real deer lose ~15-20% body weight.
    foragingBonus: 0.15,  // +0.15 to +0.75 based on foraging setting (1-5)
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
    autoMatingProbability: 0.25,  // Nearly every doe conceives in first eligible autumn
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
