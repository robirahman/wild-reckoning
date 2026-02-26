import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const AFRICAN_ELEPHANT_CONFIG: SpeciesConfig = {
  id: 'african-elephant',
  name: 'African Elephant',
  scientificName: 'Loxodonta africana',
  description:
    'The largest living land animal, roaming the savannas and forests of sub-Saharan Africa. Highly intelligent and deeply social, elephants live in matriarchal herds and face threats from poaching, habitat loss, and human-wildlife conflict.',
  diet: 'herbivore',
  massType: 'mega',
  defaultRegion: 'east-african-savanna',
  defaultRegionDisplayName: 'East African Savanna',

  startingWeight: { male: 10000, female: 6000 },
  startingAge: {
    'orphaned-by-poachers': 48,
    'wild-born': 36,
    translocated: 60,
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
    starvationDeath: 2000,
    starvationDebuff: 3500,
    vulnerabilityThreshold: 3000,
    minFloor: 1000,
    debuffMaxPenalty: 15,
    maximumBiologicalWeight: 15000,
  },

  age: {
    oldAgeOnsetMonths: 540,
    oldAgeBaseChance: 0.08,   // Scaled for monthly turns (was 0.02 at weekly)
    oldAgeEscalation: 1.3,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.22,  // Scaled for monthly turns (was 0.06 at weekly)

  predationVulnerability: {
    injuryProbIncrease: 0.03,
    parasiteProbIncrease: 0.01,
    underweightFactor: 0.001,
    underweightThreshold: 3000,
    deathChanceMin: 0.01,
    deathChanceMax: 0.60,
  },

  turnUnit: 'month',

  seasonalWeight: {
    spring: 6.0,    // Wet season start — good grazing (scaled for monthly turns)
    summer: 4.0,    // Wet season — moderate
    autumn: 0.0,    // Dry season approach — neutral
    winter: -8.0,   // Dry season — significant scarcity
    foragingBonus: 1.6,
  },

  agePhases: [
    { id: 'calf', label: 'Calf', minAge: 0, maxAge: 48 },
    { id: 'juvenile', label: 'Juvenile', minAge: 48, maxAge: 144, statModifiers: [{ stat: StatId.ADV, amount: 5 }, { stat: StatId.WIS, amount: -3 }] },
    { id: 'prime', label: 'Prime Adult', minAge: 144, maxAge: 540 },
    { id: 'elderly', label: 'Elder', minAge: 540, statModifiers: [{ stat: StatId.HEA, amount: -5 }, { stat: StatId.WIS, amount: 15 }] },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 120,
    matingOnsetAge: 144,
    matingSeasons: 'any',
    matingSeasonResetMonth: 'January',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.20,
      maxWinProb: 0.50,
      minWinProb: 0.03,
      heaFactor: 0.003,
      weightReferencePoint: 8000,
      weightFactor: 0.0001,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.05,
      parasitePenalty: 0.03,
      lossInjuryChance: 0.35,
      lossInjuryId: 'tusk-wound',
      lossInjuryBodyParts: [
        'right shoulder',
        'left shoulder',
        'left flank',
        'right flank',
        'right tusk area',
      ],
      challengeFlag: 'attempted-musth-challenge',
      matedFlag: 'mated-this-season',
    },
    gestationTurns: 22,
    offspringCountFormula: {
      weightReference: 5000,
      weightDivisor: 5000,
      heaReference: 40,
      heaDivisor: 80,
      singleThreshold: 0.95,
      tripletThreshold: 0.999,
      maxOffspring: 2,
    },
    offspringLabel: 'calf',
    offspringLabelPlural: 'calves',
    offspringLabelSingle: 'a single calf',
    offspringLabelTwin: 'twin calves',
    offspringLabelTriple: 'twin calves',
    dependenceTurns: 36,
    maturationTurns: 120,
    offspringBaseSurvival: 0.998,
    offspringSurvivalWinterPenalty: 0.008,
    offspringSurvivalSummerBonus: 0.004,
    offspringSurvivalYoungPenalty: 0.012,
    offspringSurvivalYoungThreshold: 12,
    offspringSurvivalMin: 0.95,
    offspringSurvivalMax: 0.999,
    offspringDeathCauses: [
      'Killed by lions',
      'Died of drought',
      'Succumbed to disease',
      'Lost to poachers',
    ],
    pregnantFlag: 'pregnant',
    dependentFlag: 'calves-dependent',
    independenceFlag: 'calves-just-independent',
  },

  templateVars: {
    speciesName: 'African Elephant',
    regionName: 'East African Savanna',
    maleNoun: 'bull',
    femaleNoun: 'cow',
    youngNoun: 'calf',
    youngNounPlural: 'calves',
    groupNoun: 'herd',
    habitat: 'savanna',
  },
};
