import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

// Note: healing times are in turns (1 turn = 1 month for green sea turtles)
export const GREEN_SEA_TURTLE_INJURIES: Record<string, InjuryDefinition> = {
  'boat-strike': {
    id: 'boat-strike',
    name: 'Boat Strike',
    bodyParts: [
      'shell',
      'left flipper',
      'right flipper',
      'head',
    ],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'A boat propeller has carved a deep gash across your carapace. The shell is cracked but not shattered, and the wound weeps in the salt water. Swimming is painful, and the exposed tissue beneath is vulnerable to infection.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.TRA, amount: 10 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'The propeller strike has shattered a section of your shell, exposing the bone and tissue beneath. One flipper is deeply lacerated. Every stroke through the water sends fire through your body. Infection is almost certain in these warm waters.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.HOM, amount: 15 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.18,
        permanentDebuffChance: 0.15,
      },
      {
        severity: 'critical',
        description: 'A catastrophic boat strike has crushed a large section of your carapace and severed tissue down to the spine. You can barely swim. Blood trails behind you in the water, and the warmth of the tropical sea accelerates the onset of systemic infection.',
        statEffects: [
          { stat: StatId.HEA, amount: -28 },
          { stat: StatId.TRA, amount: 20 },
          { stat: StatId.HOM, amount: 22 },
          { stat: StatId.ADV, amount: 15 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.25,
        permanentDebuffChance: 0.30,
      },
    ],
  },

  'shark-bite': {
    id: 'shark-bite',
    name: 'Shark Bite',
    bodyParts: [
      'left flipper',
      'right flipper',
      'shell',
      'hindquarters',
    ],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'A shark has taken a crescent-shaped bite from the trailing edge of your flipper. The wound is clean but deep, and you can feel the difference in propulsion immediately. The missing tissue will never fully regenerate.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.TRA, amount: 12 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.10,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'severe',
        description: 'A tiger shark has bitten through your flipper, removing a large section of the limb. The bone is exposed and the blood loss is significant. You spiral awkwardly through the water, unable to maintain a straight course.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.TRA, amount: 18 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.15,
        permanentDebuffChance: 0.20,
      },
      {
        severity: 'critical',
        description: 'The shark has crushed a section of your shell and torn deep into the flesh beneath. Your rear flippers are badly damaged. You are losing blood rapidly, and the scent trail will attract every predator in the area. Survival is uncertain.',
        statEffects: [
          { stat: StatId.HEA, amount: -28 },
          { stat: StatId.TRA, amount: 22 },
          { stat: StatId.HOM, amount: 20 },
          { stat: StatId.ADV, amount: 15 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.22,
        permanentDebuffChance: 0.30,
      },
    ],
  },

  'flipper-wound': {
    id: 'flipper-wound',
    name: 'Flipper Wound',
    bodyParts: [
      'left flipper',
      'right flipper',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A shallow bite mark on the leading edge of your flipper from a rival female during a nesting dispute. The wound stings in salt water but does not impede swimming.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.08,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A deep, crescent-shaped tear in the flipper where a rival female\'s serrated beak ripped through skin and into the underlying tissue. The wound trails blood in the water and each stroke is painful.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.12,
        permanentDebuffChance: 0.06,
      },
    ],
  },

  'fishing-line-entanglement': {
    id: 'fishing-line-entanglement',
    name: 'Fishing Line Entanglement',
    bodyParts: [
      'left flipper',
      'right flipper',
      'neck',
    ],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'Monofilament fishing line has wrapped tightly around your flipper, cutting into the skin and restricting blood flow. The line is invisible in the water and impossible to remove. With every movement, it digs deeper into the tissue.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.TRA, amount: 8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.15,
        permanentDebuffChance: 0.10,
      },
      {
        severity: 'severe',
        description: 'The fishing line has cut through skin and into muscle, nearly severing your flipper. Around your neck, the line has created a deep, infected groove that restricts your breathing when you surface. The constriction worsens with every passing day as scar tissue builds around the embedded line.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.TRA, amount: 14 },
          { stat: StatId.HOM, amount: 16 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.20,
        permanentDebuffChance: 0.25,
      },
    ],
  },
};
