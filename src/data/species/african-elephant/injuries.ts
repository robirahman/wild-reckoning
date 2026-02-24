import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const AFRICAN_ELEPHANT_INJURIES: Record<string, InjuryDefinition> = {
  'tusk-wound': {
    id: 'tusk-wound',
    name: 'Tusk Wound',
    bodyParts: [
      'right shoulder',
      'left shoulder',
      'left flank',
      'right flank',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A shallow gash from a rival bull\'s tusk during a musth confrontation. The wound is painful but not debilitating.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'A deep tusk wound that has torn through muscle. Movement is painful and the wound is prone to infection in the savanna heat.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
    ],
  },

  'thorn-wound': {
    id: 'thorn-wound',
    name: 'Thorn Wound',
    bodyParts: [
      'right front foot',
      'left front foot',
      'right hind foot',
      'left hind foot',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A thorn tip embedded in the soft pad of your foot. Each step is uncomfortable, but you can still walk.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.10,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'The embedded thorn has caused a deep abscess in your foot pad. Walking is agonizing and you are visibly limping.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
    ],
  },

  'gunshot-wound': {
    id: 'gunshot-wound',
    name: 'Gunshot Wound',
    bodyParts: [
      'right shoulder',
      'left shoulder',
      'left flank',
      'right flank',
      'left hindquarter',
      'right hindquarter',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A bullet has grazed you, tearing a shallow furrow through your thick hide. The wound bleeds freely but is not deep.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.TRA, amount: 8 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.12,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'A bullet is lodged in your muscle tissue. The wound is hot and swollen, and every movement sends a deep ache through your body.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.HOM, amount: 10 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.18,
        permanentDebuffChance: 0.10,
      },
      {
        severity: 'severe',
        description: 'A high-caliber round has shattered bone and destroyed tissue. You can barely walk. Infection is almost certain without intervention that will never come.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.TRA, amount: 20 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.ADV, amount: 12 },
        ],
        baseHealingTime: 30,
        worseningChance: 0.25,
        permanentDebuffChance: 0.25,
      },
    ],
  },
};
