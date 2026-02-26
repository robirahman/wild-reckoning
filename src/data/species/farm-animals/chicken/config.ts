import type { SpeciesConfig } from '../../../../types/speciesConfig';
import { StatId } from '../../../../types/stats';

export const CHICKEN_CONFIG: SpeciesConfig = {
  id: 'chicken',
  name: 'Chicken',
  scientificName: 'Gallus gallus domesticus',
  description: 'Confined in a vast, windowless shed with tens of thousands of others. Selected for unnaturally rapid growth, your body is a machine optimized for production at the cost of your own welfare.',
  diet: 'omnivore',
  defaultRegion: 'farmstead',
  defaultRegionDisplayName: 'Intensive Confinement Facility',

  startingWeight: { male: 0.1, female: 0.1 }, // Starting as chicks
  startingAge: {
    'broiler': 0,
    'layer': 0,
  },
  turnUnit: 'day', // 4 turns per day
  baseStats: {
    [StatId.IMM]: 30, // Stressed immune system
    [StatId.CLI]: 40,
    [StatId.HOM]: 20, // Low homing/natural instinct
    [StatId.TRA]: 60, // High trauma
    [StatId.ADV]: 10,
    [StatId.NOV]: 5,  // Almost no novelty
    [StatId.WIS]: 10,
    [StatId.HEA]: 40, // Selective breeding causes health issues
    [StatId.STR]: 50, // High physiological stress
  },

  weight: {
    starvationDeath: 0.05,  // Below starting weight — chicks are tiny but fed immediately
    starvationDebuff: 0.08,
    vulnerabilityThreshold: 3.5,
    minFloor: 0.05,
    debuffMaxPenalty: 30,
    maximumBiologicalWeight: 12,
  },

  age: {
    oldAgeOnsetMonths: 18, // Most don't live past a few months/years
    oldAgeBaseChance: 0.1,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.9,
  },

  diseaseDeathChanceAtCritical: 0.2, // High disease pressure

  predationVulnerability: {
    injuryProbIncrease: 0.2,
    parasiteProbIncrease: 0.1,
    underweightFactor: 0.02,
    underweightThreshold: 3.5,
    deathChanceMin: 0.01,
    deathChanceMax: 0.95,
  },

  thermalProfile: {
    type: 'endotherm',
    heatPenalty: 0.8, // Ammonia and crowding make heat deadly
    coldPenalty: 0.3,
    coldBenefit: 0,
  },

  seasonalWeight: {
    // Broilers gain ~0.12-0.15 lbs/day on growth-optimized feed
    // Reaches 6+ lbs in 42 days — faster than skeletons can support
    spring: 0.13,
    summer: 0.11,  // Heat stress in packed sheds
    autumn: 0.13,
    winter: 0.12,
    foragingBonus: 0,  // No foraging in confinement — all feed is delivered
  },

  agePhases: [
    { id: 'chick', label: 'Chick', minAge: 0, maxAge: 1 },
    { id: 'juvenile', label: 'Fast-Growing Juvenile', minAge: 1, maxAge: 2, statModifiers: [{ stat: StatId.HEA, amount: -10 }] },
    { id: 'slaughter-weight', label: 'Slaughter Weight', minAge: 2, statModifiers: [{ stat: StatId.HEA, amount: -20 }] },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 6,
    matingOnsetAge: 7,
    matingSeasons: 'any',
    matingSeasonResetMonth: 'January',
    maleCompetition: {
      enabled: false, // No natural competition in factory farms
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
    gestationTurns: 21 * 4, // 21 days
    offspringCountFormula: {
      weightReference: 4,
      weightDivisor: 4,
      heaReference: 60,
      heaDivisor: 100,
      singleThreshold: 0.1,
      tripletThreshold: 0.5,
      maxOffspring: 1, // Eggs are removed
    },
    offspringLabel: 'egg',
    offspringLabelPlural: 'eggs',
    offspringLabelSingle: 'an egg',
    offspringLabelTwin: 'two eggs',
    offspringLabelTriple: 'a clutch of eggs',
    dependenceTurns: 0,
    maturationTurns: 56, // 8 weeks for broiler maturation
    offspringBaseSurvival: 0.5,
    offspringSurvivalWinterPenalty: 0,
    offspringSurvivalSummerBonus: 0,
    offspringSurvivalYoungPenalty: 0,
    offspringSurvivalYoungThreshold: 0,
    offspringSurvivalMin: 0.1,
    offspringSurvivalMax: 0.6,
    offspringDeathCauses: ['Culled', 'Incubator Failure'],
    pregnantFlag: 'laying',
    dependentFlag: 'not-dependent',
    independenceFlag: 'independent-from-hatch',
  },

  templateVars: {
    speciesName: 'Chicken',
    regionName: 'Intensive Confinement Facility',
    maleNoun: 'cockerel',
    femaleNoun: 'pullet',
    youngNoun: 'chick',
    youngNounPlural: 'chicks',
    groupNoun: 'stocking density',
    habitat: 'industrial shed',
  },
};
