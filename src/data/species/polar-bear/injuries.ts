import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

// Note: healing times are in turns (1 turn = 1 month for polar bears)
export const POLAR_BEAR_INJURIES: Record<string, InjuryDefinition> = {
  'seal-bite': {
    id: 'seal-bite',
    name: 'Seal Bite',
    bodyParts: ['forepaw', 'muzzle', 'foreleg'],
    severityLevels: [
      {
        severity: 'minor',
        description:
          'A ringed seal sank its teeth into you during a kill. The puncture wounds are small but deep, and the salt water stings when you submerge your paw. Seal mouths harbor bacteria that can cause infection in warm tissue.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 2,
        worseningChance: 0.10,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description:
          'A bearded seal — much larger and stronger than a ringed seal — bit deeply into your flesh before you could pin it. The wound is ragged and inflamed, and you favor the injured limb when walking. Hunting efficiency is reduced until it heals.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.15,
        permanentDebuffChance: 0.04,
      },
    ],
  },

  'thin-ice-fall': {
    id: 'thin-ice-fall',
    name: 'Thin Ice Fall',
    bodyParts: ['ribs', 'foreleg', 'hindleg'],
    severityLevels: [
      {
        severity: 'moderate',
        description:
          'You broke through rotten ice and the jagged edge caught your body as you fell. Bruised ribs make breathing painful, and the cold water sapped your core temperature before you could haul yourself out. You are stiff and sore.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.CLI, amount: 6 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'severe',
        description:
          'A catastrophic ice collapse plunged you into the freezing water and the sharp ice edge lacerated your side deeply. You barely escaped, dragging yourself onto solid ice with immense effort. The wound is serious, your core temperature dangerously low, and the nearest shelter is far away.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 15 },
          { stat: StatId.CLI, amount: 12 },
          { stat: StatId.TRA, amount: 8 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.20,
        permanentDebuffChance: 0.12,
      },
    ],
  },

  'rival-bear-wound': {
    id: 'rival-bear-wound',
    name: 'Rival Bear Wound',
    bodyParts: ['shoulder', 'flank', 'neck', 'forepaw'],
    severityLevels: [
      {
        severity: 'minor',
        description:
          'A brief scuffle with a rival bear left you with shallow claw rake marks across your hide. The wounds sting in the cold but are not deep. The fur around them is matted with blood that freezes almost instantly in the Arctic air.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.TRA, amount: 5 },
        ],
        baseHealingTime: 2,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description:
          'A dominant male pinned you and bit deep into your flesh. The canine punctures are surrounded by crush damage, and the wound weeps a mixture of blood and serum. Movement is painful, and you must rest more than usual.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.TRA, amount: 8 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.14,
        permanentDebuffChance: 0.06,
      },
      {
        severity: 'severe',
        description:
          'A brutal fight with a massive rival has left you with deep lacerations and a partially dislocated shoulder. The bear outweighed you by a hundred pounds and only your retreat saved your life. Infection is likely in the torn tissue, and the cold slows healing.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.22,
        permanentDebuffChance: 0.15,
      },
    ],
  },
};
