import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const CHINOOK_SALMON_INJURIES: Record<string, InjuryDefinition> = {
  'scale-damage': {
    id: 'scale-damage',
    name: 'Scale Damage',
    bodyParts: [
      'left flank',
      'right flank',
      'dorsal fin',
      'tail',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Patches of scales have been scraped away, exposing raw skin to the water. The area is inflamed but functional.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.10,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A large area of scales has been torn away, leaving open tissue exposed to infection. Swimming causes visible discomfort.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.IMM, amount: 5 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.15,
        permanentDebuffChance: 0.06,
      },
    ],
  },

  'bear-claw-wound': {
    id: 'bear-claw-wound',
    name: 'Bear Claw Wound',
    bodyParts: [
      'left flank',
      'right flank',
      'dorsal area',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Shallow claw marks rake across your body — a near miss from a bear swipe. The wounds are bloody but not deep.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.12,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'Deep lacerations from a bear claw have torn through muscle tissue. The wounds are ragged and bleeding freely into the current.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.IMM, amount: 8 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.18,
        permanentDebuffChance: 0.10,
      },
    ],
  },
};
