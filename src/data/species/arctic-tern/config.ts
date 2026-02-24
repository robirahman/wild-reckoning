import type { SpeciesConfig } from '../../../types/speciesConfig';
import { StatId } from '../../../types/stats';

export const ARCTIC_TERN_CONFIG: SpeciesConfig = {
  id: 'arctic-tern',
  name: 'Arctic Tern',
  scientificName: 'Sterna paradisaea',
  description:
    'A small seabird that undertakes the longest migration of any animal — pole to pole and back again, up to 44,000 miles per year. You live in perpetual summer, chasing the sun from Arctic breeding colonies to Antarctic pack ice and back. Your life is measured in ocean crossings, and your body is built for endurance: long, narrow wings, a forked tail for agile flight, and a fierce disposition that drives you to dive-bomb anything that threatens your nest. You may live thirty years, and in that time you will see more of the Earth than almost any other creature.',
  diet: 'carnivore',
  defaultRegion: 'arctic-breeding-colony',
  defaultRegionDisplayName: 'Arctic Breeding Colony',

  startingWeight: { male: 0.24, female: 0.22 },
  startingAge: {
    'colony-fledged': 3,
    'first-year-migrant': 12,
    'experienced-flyer': 24,
  },
  baseStats: {
    [StatId.IMM]: 50,
    [StatId.CLI]: 55,
    [StatId.HOM]: 40,
    [StatId.TRA]: 30,
    [StatId.ADV]: 35,
    [StatId.NOV]: 30,
    [StatId.WIS]: 40,
    [StatId.HEA]: 55,
    [StatId.STR]: 45,
  },

  weight: {
    starvationDeath: 0.12,
    starvationDebuff: 0.16,
    vulnerabilityThreshold: 0.18,
    minFloor: 0.08,
    debuffMaxPenalty: 20,
  },

  age: {
    oldAgeOnsetMonths: 300,
    oldAgeBaseChance: 0.04,
    oldAgeEscalation: 1.4,
    maxOldAgeChance: 0.80,
  },

  diseaseDeathChanceAtCritical: 0.12,

  predationVulnerability: {
    injuryProbIncrease: 0.06,
    parasiteProbIncrease: 0.04,
    underweightFactor: 0.005,
    underweightThreshold: 0.18,
    deathChanceMin: 0.03,
    deathChanceMax: 0.65,
  },

  seasonalWeight: {
    spring: 0.005,
    summer: 0.008,
    autumn: 0.003,
    winter: -0.002,
    foragingBonus: 0.003,
  },

  turnUnit: 'month',

  weightUnit: 'g',
  weightDisplayMultiplier: 453.592,

  agePhases: [
    {
      id: 'chick',
      label: 'Chick',
      minAge: 0,
      maxAge: 3,
      statModifiers: [
        { stat: StatId.ADV, amount: 15 },
        { stat: StatId.NOV, amount: 10 },
      ],
    },
    {
      id: 'juvenile',
      label: 'Juvenile',
      minAge: 3,
      maxAge: 24,
      statModifiers: [
        { stat: StatId.ADV, amount: 5 },
        { stat: StatId.NOV, amount: 5 },
      ],
    },
    {
      id: 'adult',
      label: 'Adult',
      minAge: 24,
      maxAge: 240,
    },
    {
      id: 'elder',
      label: 'Elder',
      minAge: 240,
      statModifiers: [
        { stat: StatId.WIS, amount: 15 },
        { stat: StatId.HEA, amount: -10 },
        { stat: StatId.STR, amount: -8 },
      ],
    },
  ],

  migration: {
    winterRegionId: 'antarctic-pack-ice-edge',
    winterRegionName: 'Antarctic Pack Ice Edge',
    migrationFlag: 'will-migrate',
    migratedFlag: 'has-migrated',
    returnFlag: 'returned-from-migration',
    migrationSeason: 'autumn',
    returnSeason: 'spring',
  },

  reproduction: {
    type: 'iteroparous',
    matingMinAge: 24,
    matingOnsetAge: 36,
    matingSeasons: ['summer'],
    matingSeasonResetMonth: 'March',
    maleCompetition: {
      enabled: true,
      baseWinProb: 0.45,
      maxWinProb: 0.70,
      minWinProb: 0.20,
      heaFactor: 0.003,
      weightReferencePoint: 0.24,
      weightFactor: 0.004,
      lowStressThreshold: 30,
      lowStressFactor: 0.002,
      injuryPenalty: 0.08,
      parasitePenalty: 0.05,
      lossInjuryChance: 0.15,
      lossInjuryId: 'wing-strain',
      lossInjuryBodyParts: ['left wing', 'right wing'],
      challengeFlag: 'aerial-display',
      matedFlag: 'mating-complete',
    },
    gestationTurns: 1,
    offspringCountFormula: {
      weightReference: 0.24,
      weightDivisor: 0.24,
      heaReference: 45,
      heaDivisor: 60,
      singleThreshold: 0.55,
      tripletThreshold: 0.08,
      maxOffspring: 3,
    },
    offspringLabel: 'chick',
    offspringLabelPlural: 'chicks',
    offspringLabelSingle: 'a chick',
    offspringLabelTwin: 'two chicks',
    offspringLabelTriple: 'three chicks',
    dependenceTurns: 3,
    maturationTurns: 24,
    offspringBaseSurvival: 0.65,
    offspringSurvivalWinterPenalty: 0.08,
    offspringSurvivalSummerBonus: 0.05,
    offspringSurvivalYoungPenalty: 0.02,
    offspringSurvivalYoungThreshold: 6,
    offspringSurvivalMin: 0.35,
    offspringSurvivalMax: 0.85,
    offspringDeathCauses: [
      'Taken by a great skua',
      'Starved during a storm',
      'Failed first migration — lost over open ocean',
      'Hypothermia during an early autumn gale',
      'Predated by a gull at the colony',
    ],
    pregnantFlag: 'eggs-incubating',
    dependentFlag: 'chicks-dependent',
    independenceFlag: 'chicks-fledged',
  },

  phases: [
    {
      id: 'breeding-colony',
      label: 'Breeding Colony',
      regionId: 'arctic-breeding-colony',
      description: 'The Arctic tundra colony where terns nest, mate, and raise chicks during the endless summer days.',
    },
    {
      id: 'southward-migration',
      label: 'Southward Migration',
      entryFlag: 'will-migrate',
      regionId: 'atlantic-flyway',
      description: 'The long flight south along the Atlantic coast, following the retreating sun toward Antarctica.',
    },
    {
      id: 'antarctic-feeding',
      label: 'Antarctic Feeding Grounds',
      entryFlag: 'has-migrated',
      regionId: 'antarctic-pack-ice-edge',
      description: 'The rich feeding grounds at the edge of Antarctic pack ice, where krill and fish swarm in summer abundance.',
    },
    {
      id: 'northward-return',
      label: 'Northward Return',
      entryFlag: 'returned-from-migration',
      regionId: 'atlantic-flyway',
      description: 'The return flight north, racing spring back to the Arctic breeding grounds.',
    },
  ],

  templateVars: {
    speciesName: 'Arctic Tern',
    regionName: 'Arctic Breeding Colony',
    maleNoun: 'male',
    femaleNoun: 'female',
    youngNoun: 'chick',
    youngNounPlural: 'chicks',
    groupNoun: 'colony',
    habitat: 'coastal tundra',
  },
};
