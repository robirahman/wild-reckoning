import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';
import { injuryDefinitions as sharedInjuries } from '../../injuries/index';

const wolfInjuries: Record<string, InjuryDefinition> = {
  'elk-kick': {
    id: 'elk-kick',
    name: 'Elk Kick',
    bodyParts: ['ribs', 'skull', 'foreleg', 'shoulder'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A glancing blow from an elk hoof that left heavy bruising along the ribcage.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.08,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A solid kick that cracked ribs or fractured a leg bone. Breathing is painful and movement is limited.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.ADV, amount: 6 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'severe',
        description: 'A crushing blow to the skull or chest that caused internal bleeding and shattered bone. Hunting is impossible.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.ADV, amount: 12 },
          { stat: StatId.TRA, amount: 8 },
        ],
        baseHealingTime: 24,
        worseningChance: 0.22,
        permanentDebuffChance: 0.20,
      },
    ],
  },

  'trap-wound': {
    id: 'trap-wound',
    name: 'Trap Wound',
    bodyParts: ['foreleg', 'hindleg'],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'A leg-hold trap clamped down on the lower leg, crushing tissue and cutting through skin to the bone. You tore free, but the damage is severe.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.TRA, amount: 10 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.18,
        permanentDebuffChance: 0.12,
      },
      {
        severity: 'severe',
        description: 'The trap mangled the leg beyond natural repair. Tendons are severed, the paw is crushed, and infection is setting in. You may never run at full speed again.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 20 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.ADV, amount: 12 },
          { stat: StatId.IMM, amount: 8 },
        ],
        baseHealingTime: 28,
        worseningChance: 0.25,
        permanentDebuffChance: 0.30,
      },
    ],
  },

  'rival-bite': {
    id: 'rival-bite',
    name: 'Rival Bite',
    bodyParts: ['flank', 'muzzle', 'foreleg', 'hindleg', 'throat'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Shallow puncture wounds from a brief dominance scuffle. The teeth broke skin but did not reach muscle.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'A deep bite that tore through muscle and sinew during a serious territorial or dominance fight. The wound weeps and stiffens overnight.',
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

export const GRAY_WOLF_INJURIES: Record<string, InjuryDefinition> = {
  ...sharedInjuries,
  ...wolfInjuries,
};
