import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const ARCTIC_TERN_INJURIES: Record<string, InjuryDefinition> = {
  'wing-strain': {
    id: 'wing-strain',
    name: 'Wing Strain',
    bodyParts: [
      'left wing',
      'right wing',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A strained flight muscle from a sudden aerial maneuver. You compensate by adjusting your wingbeat, but long flights ache.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.10,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'A torn flight muscle or damaged tendon. The wing does not extend fully, and sustained flight is exhausting. You fall behind the flock and must rest more frequently.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 6 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.12,
        permanentDebuffChance: 0.20,
      },
      {
        severity: 'severe',
        description: 'The wing is broken or the primary flight feathers are shattered. You cannot sustain flight. Over open ocean, this is a death sentence. Even near land, you are grounded and vulnerable to every predator.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 16 },
          { stat: StatId.ADV, amount: 14 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.06,
        permanentDebuffChance: 0.40,
      },
    ],
  },

  'talon-strike': {
    id: 'talon-strike',
    name: 'Talon Strike',
    bodyParts: [
      'back',
      'left flank',
      'right flank',
      'head',
      'tail',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A glancing strike from a skua or gull. The wound is superficial, but the skin is broken beneath your feathers.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'Deep puncture wounds from a predatory bird\'s talons. Feathers are torn out and muscle is exposed. The wound bleeds and is vulnerable to infection.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.ADV, amount: 8 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.14,
        permanentDebuffChance: 0.15,
      },
      {
        severity: 'severe',
        description: 'A crushing strike that broke bones or ruptured internal organs. You are bleeding internally and shock is setting in. Without time to recover in a safe place, this wound will be fatal.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.ADV, amount: 14 },
          { stat: StatId.HOM, amount: 12 },
        ],
        baseHealingTime: 18,
        worseningChance: 0.08,
        permanentDebuffChance: 0.35,
      },
    ],
  },

  'wing-strike': {
    id: 'wing-strike',
    name: 'Wing Strike Bruise',
    bodyParts: [
      'left wing',
      'right wing',
      'back',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A sharp blow from a rival tern\'s wing during a nest dispute. The impact bruised the flight muscles and the wing aches during sustained flight.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 3 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.08,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'A hard wing blow that strained the joint and bruised the pectoral muscle. The wing does not fold cleanly and each wingbeat sends a dull ache through your chest. Long flights are significantly more tiring.',
        statEffects: [
          { stat: StatId.HEA, amount: -7 },
          { stat: StatId.HOM, amount: 7 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.10,
        permanentDebuffChance: 0.08,
      },
    ],
  },

  'beak-damage': {
    id: 'beak-damage',
    name: 'Beak Damage',
    bodyParts: [
      'upper mandible',
      'lower mandible',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A chip in the beak from a mid-air collision or aggressive encounter. Fish are slightly harder to grip.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 3 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.06,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'A significant crack runs along your beak. Plunge-diving for fish sends pain lancing through your skull, and you drop catches more often than you keep them.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.WIS, amount: -5 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.10,
        permanentDebuffChance: 0.20,
      },
      {
        severity: 'severe',
        description: 'The beak is shattered or severely misaligned. You cannot catch fish at all. Starvation is inevitable unless the keratin regrows, which will take many months.',
        statEffects: [
          { stat: StatId.HEA, amount: -16 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.WIS, amount: -10 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.04,
        permanentDebuffChance: 0.45,
      },
    ],
  },
};
