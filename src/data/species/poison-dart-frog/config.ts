import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const POISON_DART_FROG_CONFIG: SpeciesConfig = {
  id: 'poison-dart-frog',
  name: 'Strawberry Poison Dart Frog',
  scientificName: 'Oophaga pumilio',
  description:
    'A thumbnail-sized frog whose brilliant red-and-blue coloration warns predators of the alkaloid poisons sequestered in its skin. You are not born toxic — you earn it, one ant at a time, concentrating the chemical defenses of your prey into a living arsenal. Males call from the leaf litter to attract mates, wrestle rivals for territory, and carry tadpoles on their backs to bromeliad pools high in the canopy. Females return to feed each tadpole unfertilized eggs — one of the most devoted forms of parental care in the amphibian world. Your life plays out in a vertical cathedral of green, from the forest floor to the treetops.',
  diet: 'carnivore',
  defaultRegion: 'costa-rican-rainforest',
  defaultRegionDisplayName: 'Costa Rican Rainforest',

  startingWeight: { male: 0.000018, female: 0.000020 },
  startingAge: {
    'bromeliad-raised': 3,
    'forest-floor-hatched': 2,
    'captive-bred': 4,
  },
  baseStats: {
    [StatId.IMM]: 45,
    [StatId.CLI]: 50,
    [StatId.HOM]: 35,
    [StatId.TRA]: 20,
    [StatId.ADV]: 25,
    [StatId.NOV]: 30,
    [StatId.WIS]: 35,
    [StatId.HEA]: 55,
    [StatId.STR]: 25,
  },

  weight: {
    starvationDeath: 0.000006,
    starvationDebuff: 0.000010,
    vulnerabilityThreshold: 0.000014,
    minFloor: 0.000004,
    debuffMaxPenalty: 18,
  },

  age: {
    oldAgeOnsetMonths: 72,
    oldAgeBaseChance: 0.04,
    oldAgeEscalation: 1.5,
    maxOldAgeChance: 0.85,
  },

  diseaseDeathChanceAtCritical: 0.15,

  predationVulnerability: {
    injuryProbIncrease: 0.06,
    parasiteProbIncrease: 0.04,
    underweightFactor: 0.005,
    underweightThreshold: 0.000014,
    deathChanceMin: 0.02,
    deathChanceMax: 0.75,
  },

  seasonalWeight: {
    spring: 0.0000008,
    summer: 0.0000010,
    autumn: 0.0000006,
    winter: 0.0000004,
    foragingBonus: 0.0000003,
  },

  turnUnit: 'week',

  weightUnit: 'g',
  weightDisplayMultiplier: 453.592,

  agePhases: [
    {
      id: 'tadpole',
      label: 'Tadpole',
      minAge: 0,
      maxAge: 3,
      statModifiers: [
        { stat: StatId.ADV, amount: 10 },
        { stat: StatId.NOV, amount: 15 },
      ],
    },
    {
      id: 'metamorph',
      label: 'Metamorph',
      minAge: 3,
      maxAge: 6,
      statModifiers: [
        { stat: StatId.NOV, amount: 10 },
        { stat: StatId.ADV, amount: 5 },
      ],
    },
    {
      id: 'juvenile',
      label: 'Juvenile',
      minAge: 6,
      maxAge: 24,
      statModifiers: [
        { stat: StatId.ADV, amount: 3 },
      ],
    },
    {
      id: 'adult',
      label: 'Adult',
      minAge: 24,
    },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 6,
    matingOnsetAge: 8,
    matingSeasons: 'any',
    matingSeasonResetMonth: 'January',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.40,
      maxWinProb: 0.65,
      minWinProb: 0.15,
      heaFactor: 0.003,
      weightReferencePoint: 0.000018,
      weightFactor: 0.004,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.06,
      parasitePenalty: 0.04,
      lossInjuryChance: 0.20,
      lossInjuryId: 'leg-damage',
      lossInjuryBodyParts: ['front-left-leg', 'front-right-leg', 'hind-left-leg', 'hind-right-leg', 'left-foot', 'right-foot'],
      challengeFlag: 'wrestling-match',
      matedFlag: 'mating-complete',
    },
    gestationTurns: 2,
    offspringCountFormula: {
      weightReference: 0.000018,
      weightDivisor: 0.000018,
      heaReference: 40,
      heaDivisor: 60,
      singleThreshold: 0.6,
      tripletThreshold: 0.05,
      maxOffspring: 5,
    },
    offspringLabel: 'tadpole',
    offspringLabelPlural: 'tadpoles',
    offspringLabelSingle: 'a tadpole',
    offspringLabelTwin: 'two tadpoles',
    offspringLabelTriple: 'three tadpoles',
    dependenceTurns: 12,
    maturationTurns: 48,
    offspringBaseSurvival: 0.70,
    offspringSurvivalWinterPenalty: 0.02,
    offspringSurvivalSummerBonus: 0.05,
    offspringSurvivalYoungPenalty: 0.01,
    offspringSurvivalYoungThreshold: 12,
    offspringSurvivalMin: 0.40,
    offspringSurvivalMax: 0.90,
    offspringDeathCauses: [
      'Bromeliad pool dried out',
      'Eaten by a predatory insect larva',
      'Starved — mother stopped returning with eggs',
      'Washed out of pool by heavy rain',
      'Killed by a tadpole-eating spider',
    ],
    pregnantFlag: 'carrying-eggs',
    dependentFlag: 'carrying-tadpoles',
    independenceFlag: 'tadpoles-independent',
  },

  templateVars: {
    speciesName: 'Strawberry Poison Dart Frog',
    regionName: 'Costa Rican Rainforest',
    maleNoun: 'male',
    femaleNoun: 'female',
    youngNoun: 'tadpole',
    youngNounPlural: 'tadpoles',
    groupNoun: 'army',
    habitat: 'rainforest floor',
  },
};
