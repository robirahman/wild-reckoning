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
    [StatId.HEA]: 100,
    [StatId.STR]: 35,
  },

  weight: {
    starvationDeath: 1500,    // ~25% of female weight (6000lbs); was 2000
    starvationDebuff: 2500,   // Healing gate; gives females 3500lbs buffer (was 3500 = only 2500)
    vulnerabilityThreshold: 2200,
    minFloor: 1000,
    debuffMaxPenalty: 15,
    maximumBiologicalWeight: 15000,
  },

  age: {
    // Real: elephants have 6 sets of molars; last set wears out at ~60-65yr,
    // leading to starvation. Onset at 55yr matches tooth-wear timeline.
    oldAgeOnsetMonths: 660,
    oldAgeBaseChance: 0.06,
    oldAgeEscalation: 1.4,
    maxOldAgeChance: 0.95,
  },

  diseaseDeathChanceAtCritical: 0.001,  // Elephants rarely die from infections; robust immune system

  predationVulnerability: {
    injuryProbIncrease: 0.03,
    parasiteProbIncrease: 0.01,
    underweightFactor: 0.001,
    underweightThreshold: 3000,
    deathChanceMin: 0.002,
    deathChanceMax: 0.005,  // Adult elephants have almost no natural predators
  },

  turnUnit: 'month',
  naturalHealingRate: 100,  // Must outpace 2+ parasites at moderate (~15 drain) + event damage; elephants have exceptionally robust immune systems

  // Well-fed elephants invest body reserves into immune recovery.
  // Real: elephants carry substantial fat (especially females) that fuels immune function.
  weightBasedHealing: {
    minWeight: 4500,        // Only when above healthy weight (lower threshold helps females at 6000lbs)
    healPerTurn: 12,        // HEA restored per month — elephants invest heavily in immune recovery
    weightCostPerHeal: 20,  // lbs lost per healing turn
  },
  attentionBudget: 22,

  hydration: {
    baseDehydrationRate: 0.3,
    heatMultiplier: 2.0,
    waterNodeRecovery: 50,
    passiveMoistureRecovery: 0.3,
    debuffThreshold: 50,
    movementPenaltyThreshold: 70,
    lethalThreshold: 92,
    heaPenalty: -10,
  },

  seasonalWeight: {
    spring: 10.0,   // Wet season start, excellent grazing (scaled for monthly turns)
    summer: 8.0,    // Wet season peak, abundant forage
    autumn: 2.0,    // Dry season approach, still some forage
    winter: -8.0,   // Dry season, significant scarcity
    foragingBonus: 2.0,
  },

  agePhases: [
    { id: 'calf', label: 'Calf', minAge: 0, maxAge: 48 },
    { id: 'juvenile', label: 'Juvenile', minAge: 48, maxAge: 144, statModifiers: [{ stat: StatId.ADV, amount: 5 }, { stat: StatId.WIS, amount: -3 }] },
    { id: 'prime', label: 'Prime Adult', minAge: 144, maxAge: 540, statModifiers: [{ stat: StatId.HEA, amount: 8 }] },
    { id: 'elderly', label: 'Elder', minAge: 540, statModifiers: [{ stat: StatId.HEA, amount: -8 }, { stat: StatId.WIS, amount: 15 }] },
  ],

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 120,
    matingOnsetAge: 144,
    matingSeasons: 'any',
    matingSeasonResetMonth: 'January',
    autoMatingProbability: 0.015,  // Real IBI ~4-5yr; dependency gate blocks mating while calves dependent (54mo)
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.10,   // Low base: young/average bulls rarely win
      maxWinProb: 0.55,    // Prime musth bulls in peak condition dominate
      minWinProb: 0.01,    // Undersized/injured bulls almost never win
      heaFactor: 0.004,    // Health matters more: musth is physically demanding
      weightReferencePoint: 10000,  // Reference is prime adult male weight
      weightFactor: 0.00004, // +0.20 at 15000lbs, -0.20 at 5000lbs — size is decisive
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.08,  // Injured bulls are at severe disadvantage
      parasitePenalty: 0.05, // Parasitized bulls lose condition
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
    dependenceTurns: 54,  // Real: calves nurse 2yr but stay dependent 4-5yr; was 36
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
