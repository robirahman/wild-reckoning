import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const FIG_WASP_CONFIG: SpeciesConfig = {
  id: 'fig-wasp',
  name: 'Fig Pollinator Wasp',
  scientificName: 'Pegoscapus mexicanus',
  description:
    'A creature so small it is invisible to most of the world, performing one of nature\'s most ancient partnerships. You are half of an obligate mutualism 80 million years old — without you, the strangler fig cannot reproduce. Without the fig, you cannot exist. Your entire adult life lasts less than 48 hours. In that time, you must find a fig, enter it, pollinate it, lay your eggs, and die. You are not just an insect. You are a key that fits exactly one lock in the living world.',
  diet: 'herbivore',
  defaultRegion: 'florida-fig-hammock',
  defaultRegionDisplayName: 'Florida Tropical Hammock',

  startingWeight: { male: 0.000000030, female: 0.000000040 },
  startingAge: {
    'healthy-fig': 0,
    'stressed-fig': 0,
    'crowded-gall': 0,
  },
  baseStats: {
    [StatId.IMM]: 30,
    [StatId.CLI]: 55,
    [StatId.HOM]: 25,
    [StatId.TRA]: 20,
    [StatId.ADV]: 30,
    [StatId.NOV]: 35,
    [StatId.WIS]: 15,
    [StatId.HEA]: 55,
    [StatId.STR]: 30,
  },

  weight: {
    starvationDeath: 0.000000008,
    starvationDebuff: 0.000000015,
    vulnerabilityThreshold: 0.000000020,
    minFloor: 0.000000005,
    debuffMaxPenalty: 25,
  },

  age: {
    oldAgeOnsetMonths: 3,
    oldAgeBaseChance: 0.15,
    oldAgeEscalation: 3.0,
    maxOldAgeChance: 0.98,
  },

  diseaseDeathChanceAtCritical: 0.20,

  predationVulnerability: {
    injuryProbIncrease: 0.12,
    parasiteProbIncrease: 0.08,
    underweightFactor: 0.015,
    underweightThreshold: 0.000000020,
    deathChanceMin: 0.03,
    deathChanceMax: 0.92,
  },

  seasonalWeight: {
    spring: 0.000000003,
    summer: 0.000000004,
    autumn: 0.000000002,
    winter: -0.000000001,
    foragingBonus: 0.000000001,
  },

  agePhases: [
    {
      id: 'gall-larva',
      label: 'Gall Larva',
      minAge: 0,
      maxAge: 1,
    },
    {
      id: 'pupa',
      label: 'Pupa',
      minAge: 1,
      maxAge: 2,
      statModifiers: [
        { stat: StatId.ADV, amount: 15 },
        { stat: StatId.NOV, amount: 10 },
      ],
    },
    {
      id: 'adult-in-fig',
      label: 'Adult (Inside Fig)',
      minAge: 2,
      maxAge: 3,
    },
    {
      id: 'free-flying-adult',
      label: 'Free-Flying Adult',
      minAge: 3,
      statModifiers: [
        { stat: StatId.HOM, amount: 10 },
        { stat: StatId.CLI, amount: 5 },
      ],
    },
  ],

  reproduction: {
    type: 'semelparous',
    spawningMinAge: 2,
    spawningSeasons: ['spring', 'summer', 'autumn', 'winter'],
    baseEggCount: 300,
    eggCountHeaFactor: 2,
    eggCountWeightFactor: 5000000000,
    eggSurvivalBase: 0.08,
    eggSurvivalWisFactor: 0.0005,
    spawningMigrationFlag: 'entered-new-fig',
    spawningGroundsFlag: 'pollinating-fig',
    spawningCompleteFlag: 'eggs-laid',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.35,
      maxWinProb: 0.65,
      minWinProb: 0.10,
      heaFactor: 0.004,
      weightReferencePoint: 0.000000030,
      weightFactor: 0.008,
      lowStressThreshold: 35,
      lowStressFactor: 0.003,
      injuryPenalty: 0.10,
      parasitePenalty: 0.06,
      lossInjuryChance: 0.35,
      lossInjuryId: 'mandible-damage',
      lossInjuryBodyParts: ['left mandible', 'right mandible'],
      challengeFlag: 'fig-combat-attempted',
      matedFlag: 'mated-in-fig',
    },
  },

  phases: [
    { id: 'natal-fig', label: 'Natal Fig', regionId: 'florida-fig-hammock', description: 'Developing inside a gall in your natal fig syconium' },
    { id: 'emergence', label: 'Emergence Inside Fig', entryFlag: 'emerged-from-gall', regionId: 'florida-fig-hammock', description: 'Adult life inside the fig — mating, tunnel-chewing, pollen collection' },
    { id: 'dispersal-flight', label: 'Dispersal Flight', entryFlag: 'exited-fig', regionId: 'florida-fig-hammock', description: 'Free flight searching for a new receptive fig' },
    { id: 'new-fig', label: 'Inside New Fig', entryFlag: 'entered-new-fig', regionId: 'florida-fig-hammock', description: 'Pollinating and ovipositing inside a new fig' },
  ],

  lineageMode: true,

  weightUnit: 'μg',
  weightDisplayMultiplier: 453592000,

  templateVars: {
    speciesName: 'Fig Wasp',
    regionName: 'Florida Tropical Hammock',
    maleNoun: 'male',
    femaleNoun: 'female',
    youngNoun: 'larva',
    youngNounPlural: 'larvae',
    groupNoun: 'brood',
    habitat: 'fig syconium',
  },
};
