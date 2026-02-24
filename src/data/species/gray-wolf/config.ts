import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const GRAY_WOLF_CONFIG: SpeciesConfig = {
  id: 'gray-wolf',
  name: 'Gray Wolf',
  scientificName: 'Canis lupus',
  description:
    'An apex predator of the northern forests. Pack hunters that shape ecosystems through fear. In Northern Minnesota, wolves and deer have coexisted for millennia.',
  diet: 'carnivore',
  defaultRegion: 'northern-minnesota',
  defaultRegionDisplayName: 'Northern Minnesota',

  startingWeight: { male: 85, female: 72 },
  startingAge: {
    'pack-raised': 18,
    'lone-wolf': 24,
    'rescued-pup': 14,
  },
  baseStats: {
    [StatId.IMM]: 35,
    [StatId.CLI]: 25,
    [StatId.HOM]: 30,
    [StatId.TRA]: 25,
    [StatId.ADV]: 35,
    [StatId.NOV]: 35,
    [StatId.WIS]: 30,
    [StatId.HEA]: 65,
    [StatId.STR]: 30,
  },

  weight: {
    starvationDeath: 30,
    starvationDebuff: 50,
    vulnerabilityThreshold: 60,
    minFloor: 20,
    debuffMaxPenalty: 15,
  },

  age: {
    oldAgeOnsetMonths: 72,
    oldAgeBaseChance: 0.025,
    oldAgeEscalation: 1.6,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.10,

  predationVulnerability: {
    injuryProbIncrease: 0.04,
    parasiteProbIncrease: 0.02,
    underweightFactor: 0.003,
    underweightThreshold: 60,
    deathChanceMin: 0.01,
    deathChanceMax: 0.60,
  },

  seasonalWeight: {
    spring: 0.8,     // Good gain — prey abundant after winter die-off
    summer: 0.4,     // Moderate gain — pup rearing demands energy
    autumn: 0.6,     // Good gain — prey fattened for winter
    winter: -0.8,    // Loss — prey scarce and difficult to catch
    foragingBonus: 0.4,  // +0.4 to +2.0 based on hunting setting
  },

  agePhases: [
    { id: 'pup', label: 'Pup', minAge: 0, maxAge: 12 },
    { id: 'yearling', label: 'Yearling', minAge: 12, maxAge: 24, statModifiers: [{ stat: StatId.ADV, amount: 8 }, { stat: StatId.WIS, amount: -5 }] },
    { id: 'prime', label: 'Prime Adult', minAge: 24, maxAge: 72 },
    { id: 'elder', label: 'Elder', minAge: 72, statModifiers: [{ stat: StatId.HEA, amount: -10 }, { stat: StatId.WIS, amount: 10 }] },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 22,
    matingOnsetAge: 24,
    matingSeasons: ['winter'],
    matingSeasonResetMonth: 'January',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.50,
      maxWinProb: 0.75,
      minWinProb: 0.10,
      heaFactor: 0.003,
      weightReferencePoint: 85,
      weightFactor: 0.001,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.05,
      parasitePenalty: 0.03,
      lossInjuryChance: 0.4,
      lossInjuryId: 'rival-bite',
      lossInjuryBodyParts: ['flank', 'muzzle', 'foreleg', 'hindleg'],
      challengeFlag: 'attempted-alpha-challenge',
      matedFlag: 'mated-this-season',
    },
    gestationTurns: 9,
    offspringCountFormula: {
      weightReference: 70,
      weightDivisor: 70,
      heaReference: 50,
      heaDivisor: 50,
      singleThreshold: 0.20,
      tripletThreshold: 0.60,
      maxOffspring: 6,
    },
    offspringLabel: 'pup',
    offspringLabelPlural: 'pups',
    offspringLabelSingle: 'a single pup',
    offspringLabelTwin: 'twin pups',
    offspringLabelTriple: 'a litter of pups',
    dependenceTurns: 24,
    maturationTurns: 48,
    offspringBaseSurvival: 0.97,
    offspringSurvivalWinterPenalty: 0.010,
    offspringSurvivalSummerBonus: 0.004,
    offspringSurvivalYoungPenalty: 0.006,
    offspringSurvivalYoungThreshold: 30,
    offspringSurvivalMin: 0.88,
    offspringSurvivalMax: 0.995,
    offspringDeathCauses: [
      'Killed by rival pack',
      'Died of exposure',
      'Succumbed to canine distemper',
      'Lost to starvation',
    ],
    pregnantFlag: 'pregnant',
    dependentFlag: 'pups-dependent',
    independenceFlag: 'pups-just-independent',
  },

  templateVars: {
    speciesName: 'Gray Wolf',
    regionName: 'Northern Minnesota',
    maleNoun: 'wolf',
    femaleNoun: 'she-wolf',
    youngNoun: 'pup',
    youngNounPlural: 'pups',
    groupNoun: 'pack',
    habitat: 'northern forest',
  },
};
