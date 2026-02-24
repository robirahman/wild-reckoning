import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';
import { parasiteDefinitions as sharedParasites } from '../../parasites/index';

const deerParasites: Record<string, ParasiteDefinition> = {
  'chronic-wasting-disease': {
    id: 'chronic-wasting-disease',
    name: 'Chronic Wasting Disease',
    scientificName: 'CWD prion (PrPSc)',
    description:
      'A transmissible spongiform encephalopathy caused by misfolded prion proteins that progressively destroy brain tissue. Always fatal. Spread through direct contact or contaminated soil.',
    transmissionMethod: 'Contact with infected deer or contaminated environment',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description:
          'Subclinical infection, prions replicating but no outward signs.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 8, max: 20 },
        progressionChance: 0.15,
        remissionChance: 0,
      },
      {
        severity: 'moderate',
        description:
          'Subtle weight loss and behavioral changes. Occasional stumbling.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.WIS, amount: -5 },
        ],
        secondaryEffects: ['behavioral changes'],
        turnDuration: { min: 6, max: 14 },
        progressionChance: 0.20,
        remissionChance: 0,
      },
      {
        severity: 'severe',
        description:
          'Dramatic weight loss, drooling, head tremors, loss of coordination.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.WIS, amount: -12 },
          { stat: StatId.ADV, amount: 10 },
        ],
        secondaryEffects: ['severe neurological impairment', 'high predation vulnerability'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.25,
        remissionChance: 0,
      },
      {
        severity: 'critical',
        description:
          'Emaciation, inability to stand, vacant stare.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
          { stat: StatId.IMM, amount: 30 },
          { stat: StatId.WIS, amount: -20 },
          { stat: StatId.ADV, amount: 15 },
        ],
        secondaryEffects: ['organ failure imminent', 'complete neurological collapse'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },

  'winter-tick': {
    id: 'winter-tick',
    name: 'Winter Tick',
    scientificName: 'Dermacentor albipictus',
    description:
      'A one-host tick that infests deer primarily in late autumn through spring. Massive infestations can cause anemia, hair loss, and death in severe cases. The deer self-grooms compulsively, creating "ghost moose" appearance patches of bare skin.',
    transmissionMethod: 'Walking through vegetation hosting questing tick larvae in autumn',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description:
          'Small number of ticks feeding, occasional itching.',
        statEffects: [
          { stat: StatId.IMM, amount: 4 },
          { stat: StatId.HOM, amount: 3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.20,
        remissionChance: 0.25,
      },
      {
        severity: 'moderate',
        description:
          'Heavy tick load causing significant blood loss and hair loss from grooming.',
        statEffects: [
          { stat: StatId.HEA, amount: -6 },
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.ADV, amount: 4 },
        ],
        secondaryEffects: ['hair loss from excessive grooming', 'minor anemia'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.12,
        remissionChance: 0.15,
      },
      {
        severity: 'severe',
        description:
          'Massive infestation, severe anemia, large patches of bare skin.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HOM, amount: 15 },
          { stat: StatId.ADV, amount: 10 },
          { stat: StatId.CLI, amount: 8 },
        ],
        secondaryEffects: ['severe anemia', 'hypothermia risk from hair loss', 'high predation vulnerability'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.08,
      },
    ],
  },
};

export const WHITE_TAILED_DEER_PARASITES: Record<string, ParasiteDefinition> = {
  ...sharedParasites,
  ...deerParasites,
};
