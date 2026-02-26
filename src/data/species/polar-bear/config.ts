import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const POLAR_BEAR_CONFIG: SpeciesConfig = {
  id: 'polar-bear',
  name: 'Polar Bear',
  scientificName: 'Ursus maritimus',
  description:
    'The largest living land carnivore, master of a vanishing world. Every year the sea ice season shortens, and the window to hunt seals narrows.',
  diet: 'carnivore',
  defaultRegion: 'western-hudson-bay',
  defaultRegionDisplayName: 'Western Hudson Bay',

  startingWeight: { male: 600, female: 350 },
  startingAge: {
    'wild-born': 36,
    'orphaned-cub': 24,
    'satellite-tagged': 48,
  },
  baseStats: {
    [StatId.IMM]: 35,
    [StatId.CLI]: 15,
    [StatId.HOM]: 30,
    [StatId.TRA]: 20,
    [StatId.ADV]: 30,
    [StatId.NOV]: 35,
    [StatId.WIS]: 30,
    [StatId.HEA]: 65,
    [StatId.STR]: 30,
  },

  weight: {
    starvationDeath: 150,
    starvationDebuff: 280,
    vulnerabilityThreshold: 300,
    minFloor: 100,
    debuffMaxPenalty: 20,
    maximumBiologicalWeight: 1600,
  },

  age: {
    oldAgeOnsetMonths: 240,
    oldAgeBaseChance: 0.02,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.09,

  predationVulnerability: {
    injuryProbIncrease: 0.03,
    parasiteProbIncrease: 0.01,
    underweightFactor: 0.002,
    underweightThreshold: 300,
    deathChanceMin: 0.005,
    deathChanceMax: 0.50,
  },

  turnUnit: 'month',

  thermalProfile: {
    type: 'endotherm',
    heatPenalty: 8.0,
    coldPenalty: 0,
    coldBenefit: 0,
  },

  seasonalWeight: {
    spring: 2.5,    // Sea ice still holds — prime seal hunting
    summer: -3.5,   // Ice breakup — forced ashore, fasting begins
    autumn: -1.0,   // Waiting for freeze-up, limited terrestrial foraging
    winter: 1.5,    // Ice returns — hunting resumes but daylight is scarce
    foragingBonus: 0.8,
  },

  agePhases: [
    { id: 'cub', label: 'Cub', minAge: 0, maxAge: 30 },
    {
      id: 'sub-adult',
      label: 'Sub-Adult',
      minAge: 30,
      maxAge: 60,
      statModifiers: [
        { stat: StatId.ADV, amount: 8 },
        { stat: StatId.NOV, amount: 5 },
      ],
    },
    { id: 'prime', label: 'Prime Adult', minAge: 60, maxAge: 240 },
    {
      id: 'elder',
      label: 'Elder',
      minAge: 240,
      statModifiers: [
        { stat: StatId.HEA, amount: -10 },
        { stat: StatId.WIS, amount: 10 },
      ],
    },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 48,
    matingOnsetAge: 60,
    matingSeasons: ['spring'],
    matingSeasonResetMonth: 'March',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.45,
      maxWinProb: 0.70,
      minWinProb: 0.10,
      heaFactor: 0.004,
      weightReferencePoint: 500,
      weightFactor: 0.0002,
      lowStressThreshold: 25,
      lowStressFactor: 0.003,
      injuryPenalty: 0.08,
      parasitePenalty: 0.04,
      lossInjuryChance: 0.40,
      lossInjuryId: 'rival-bear-wound',
      lossInjuryBodyParts: ['shoulder', 'flank', 'neck', 'forepaw'],
      challengeFlag: 'attempted-dominance-challenge',
      matedFlag: 'mated-this-season',
    },
    gestationTurns: 8,   // 8 months including delayed implantation
    offspringCountFormula: {
      weightReference: 350,
      weightDivisor: 350,
      heaReference: 50,
      heaDivisor: 100,
      singleThreshold: 0.55,
      tripletThreshold: 0.92,
      maxOffspring: 3,
    },
    offspringLabel: 'cub',
    offspringLabelPlural: 'cubs',
    offspringLabelSingle: 'a single cub',
    offspringLabelTwin: 'twin cubs',
    offspringLabelTriple: 'triplet cubs',
    dependenceTurns: 30,    // ~2.5 years in months
    maturationTurns: 60,    // ~5 years to full maturity
    offspringBaseSurvival: 0.994,
    offspringSurvivalWinterPenalty: 0.012,
    offspringSurvivalSummerBonus: 0.002,
    offspringSurvivalYoungPenalty: 0.015,
    offspringSurvivalYoungThreshold: 6,
    offspringSurvivalMin: 0.80,
    offspringSurvivalMax: 0.995,
    offspringDeathCauses: [
      'Succumbed to starvation during ice-free season',
      'Drowned during long-distance swim between floes',
      'Killed by rival male bear',
      'Lost to hypothermia in early den emergence',
    ],
    pregnantFlag: 'pregnant',
    dependentFlag: 'cubs-dependent',
    independenceFlag: 'cubs-just-independent',
  },

  templateVars: {
    speciesName: 'Polar Bear',
    regionName: 'Western Hudson Bay',
    maleNoun: 'boar',
    femaleNoun: 'sow',
    youngNoun: 'cub',
    youngNounPlural: 'cubs',
    groupNoun: 'solitary',
    habitat: 'arctic tundra',
  },
};
