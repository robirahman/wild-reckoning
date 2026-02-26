import type { SpeciesConfig } from '../../../../types/speciesConfig';
import { StatId } from '../../../../types/stats';

export const PIG_CONFIG: SpeciesConfig = {
  id: 'pig',
  name: 'Pig',
  scientificName: 'Sus scrofa domesticus',
  description: 'Highly intelligent and social, but here you are a unit of production. Confined to concrete floors and metal bars, your life is measured in weight gain and litter size.',
  diet: 'omnivore',
  defaultRegion: 'farmstead',
  defaultRegionDisplayName: 'Concentrated Animal Feeding Operation',

  startingWeight: { male: 15, female: 15 }, // Weaned piglets
  startingAge: {
    'industrial-sow': 8,
    'grower-pig': 3,
  },
  turnUnit: 'day',
  baseStats: {
    [StatId.IMM]: 40,
    [StatId.CLI]: 30,
    [StatId.HOM]: 10,
    [StatId.TRA]: 50,
    [StatId.ADV]: 15,
    [StatId.NOV]: 2,  // Barren environment
    [StatId.WIS]: 20,
    [StatId.HEA]: 50,
    [StatId.STR]: 60,
  },

  weight: {
    starvationDeath: 10,   // Below starting weight — piglets are small but not starving
    starvationDebuff: 12,
    vulnerabilityThreshold: 120,
    minFloor: 5,
    debuffMaxPenalty: 20,
    maximumBiologicalWeight: 900,
  },

  age: {
    oldAgeOnsetMonths: 36, // Sows are culled after 3-4 years
    oldAgeBaseChance: 0.2,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.15,

  predationVulnerability: {
    injuryProbIncrease: 0.05,
    parasiteProbIncrease: 0.05,
    underweightFactor: 0.01,
    underweightThreshold: 120,
    deathChanceMin: 0,
    deathChanceMax: 0.1, // Few predators in a CAFO, just "culling"
  },

  thermalProfile: {
    type: 'endotherm',
    heatPenalty: 0.7, // Pigs cannot sweat; heat in sheds is lethal
    coldPenalty: 0.4,
    coldBenefit: 0,
  },

  seasonalWeight: {
    // Industrial pigs gain ~1.5-2.0 lbs/day on high-energy feed
    // Slightly reduced in summer (heat stress in sheds)
    spring: 1.6,
    summer: 1.3,  // Heat stress reduces feed conversion
    autumn: 1.6,
    winter: 1.5,
    foragingBonus: 0,  // No foraging in confinement — all feed is delivered
  },

  agePhases: [
    { id: 'piglet', label: 'Piglet', minAge: 0, maxAge: 1 },
    { id: 'grower', label: 'Grower Pig', minAge: 1, maxAge: 6, statModifiers: [{ stat: StatId.HEA, amount: -5 }] },
    { id: 'finisher', label: 'Finisher', minAge: 6, maxAge: 12, statModifiers: [{ stat: StatId.HEA, amount: -15 }] },
    { id: 'breeding-stock', label: 'Breeding Stock', minAge: 12 },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 8,
    matingOnsetAge: 10,
    matingSeasons: 'any',
    matingSeasonResetMonth: 'January',
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
      challengeFlag: 'no-challenge',
      matedFlag: 'no-mate',
    },
    gestationTurns: 114 * 4, // 114 days
    offspringCountFormula: {
      weightReference: 150,
      weightDivisor: 150,
      heaReference: 60,
      heaDivisor: 80,
      singleThreshold: 0.01,
      tripletThreshold: 0.05,
      maxOffspring: 16, // Maximized litters
    },
    offspringLabel: 'piglet',
    offspringLabelPlural: 'piglets',
    offspringLabelSingle: 'a single piglet',
    offspringLabelTwin: 'two piglets',
    offspringLabelTriple: 'a large litter of piglets',
    dependenceTurns: 21 * 4, // Weaned at 3 weeks
    maturationTurns: 180 * 4, // 6 months to market weight
    offspringBaseSurvival: 0.85, // Significant pre-weaning mortality
    offspringSurvivalWinterPenalty: 0,
    offspringSurvivalSummerBonus: 0,
    offspringSurvivalYoungPenalty: 0.1,
    offspringSurvivalYoungThreshold: 10,
    offspringSurvivalMin: 0.5,
    offspringSurvivalMax: 0.9,
    offspringDeathCauses: ['Crushing', 'Scours', 'Culling'],
    pregnantFlag: 'pregnant',
    dependentFlag: 'nursing',
    independenceFlag: 'weaned',
  },

  templateVars: {
    speciesName: 'Pig',
    regionName: 'Concentrated Animal Feeding Operation',
    maleNoun: 'boar',
    femaleNoun: 'sow',
    youngNoun: 'piglet',
    youngNounPlural: 'piglets',
    groupNoun: 'herd',
    habitat: 'concrete pen',
  },
};
