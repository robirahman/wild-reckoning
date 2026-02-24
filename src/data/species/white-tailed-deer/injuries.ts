import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';
import { injuryDefinitions as sharedInjuries } from '../../injuries/index';

const deerInjuries: Record<string, InjuryDefinition> = {
  'barbed-wire-wound': {
    id: 'barbed-wire-wound',
    name: 'Barbed Wire Wound',
    bodyParts: ['right shoulder', 'left shoulder', 'right haunch', 'left haunch', 'chest', 'belly'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Shallow lacerations from barbed wire where the deer pushed through a fence.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.10,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'Deep gashes from barbed wire that tore through muscle as the deer struggled to free itself.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.15,
        permanentDebuffChance: 0.06,
      },
    ],
  },

  'arrow-wound': {
    id: 'arrow-wound',
    name: 'Arrow Wound',
    bodyParts: ['right shoulder', 'left shoulder', 'right flank', 'left flank', 'right haunch', 'left haunch'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A broadhead grazed the flesh, leaving a long but shallow cut.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.TRA, amount: 8 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.12,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'An arrow embedded deep in muscle tissue, causing significant bleeding and pain.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.TRA, amount: 12 },
          { stat: StatId.ADV, amount: 10 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.18,
        permanentDebuffChance: 0.10,
      },
      {
        severity: 'severe',
        description: 'An arrow struck bone or a vital organ, causing catastrophic internal damage.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.TRA, amount: 18 },
          { stat: StatId.ADV, amount: 15 },
          { stat: StatId.HOM, amount: 15 },
        ],
        baseHealingTime: 26,
        worseningChance: 0.25,
        permanentDebuffChance: 0.25,
      },
    ],
  },

  'antler-break': {
    id: 'antler-break',
    name: 'Broken Antler Tine',
    bodyParts: ['right antler', 'left antler'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A brow tine snapped off cleanly during rut combat, leaving a jagged stump. The exposed pedicle bone aches but is not bleeding heavily.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.06,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A main beam cracked and partially separated, with splintered bone exposing the vascular core. Blood streams down the face and the remaining antler hangs at an angle, throwing off balance.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 6 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
    ],
  },

  'coyote-bite': {
    id: 'coyote-bite',
    name: 'Coyote Bite',
    bodyParts: ['right hind leg', 'left hind leg', 'right flank', 'left flank', 'tail'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Shallow puncture wounds from coyote teeth after a brief predator encounter.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'A deep bite with torn muscle from a coyote that managed to latch on before being kicked away.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.ADV, amount: 8 },
          { stat: StatId.HOM, amount: 6 },
          { stat: StatId.IMM, amount: 5 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.14,
        permanentDebuffChance: 0.05,
      },
    ],
  },
};

export const WHITE_TAILED_DEER_INJURIES: Record<string, InjuryDefinition> = {
  ...sharedInjuries,
  ...deerInjuries,
};
