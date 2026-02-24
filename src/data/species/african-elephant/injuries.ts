import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

// Note: healing times are in turns (1 turn = 1 month for elephants)
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
        baseHealingTime: 2,
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
        baseHealingTime: 4,
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
        baseHealingTime: 2,
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
        baseHealingTime: 4,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
    ],
  },

  'leg-fracture': {
    id: 'leg-fracture',
    name: 'Leg Fracture',
    bodyParts: [
      'hind left tibia',
      'hind right tibia',
      'front left radius',
      'front right radius',
    ],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'A crocodile\'s jaws have cracked the bone in your leg. You can put weight on it, but each step sends a sickening jolt of pain through your body. The herd slows for you, but they will not wait forever.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.ADV, amount: 6 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'severe',
        description: 'The crocodile\'s death-roll has shattered the bone. Your leg buckles with every step, and the swelling is grotesque. Without rest you cannot heal, but standing still on the savanna makes you vulnerable to everything.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 15 },
          { stat: StatId.ADV, amount: 12 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.22,
        permanentDebuffChance: 0.20,
      },
    ],
  },

  'scrape-wound': {
    id: 'scrape-wound',
    name: 'Scrape Wound',
    bodyParts: [
      'right flank',
      'left flank',
      'right shoulder',
      'left shoulder',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A raw patch of scraped hide where you stumbled against rough ground. It stings in the heat and attracts flies, but it is little more than an indignity.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
        ],
        baseHealingTime: 1,
        worseningChance: 0.05,
        permanentDebuffChance: 0.0,
      },
      {
        severity: 'moderate',
        description: 'The scrape has torn away a wide section of skin, exposing raw flesh underneath. Dust and dirt have ground into the wound, and it weeps a thin, clear fluid that draws insects.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 2,
        worseningChance: 0.10,
        permanentDebuffChance: 0.02,
      },
    ],
  },

  'snare-laceration': {
    id: 'snare-laceration',
    name: 'Snare Laceration',
    bodyParts: [
      'left front ankle',
      'right front ankle',
      'left hind ankle',
      'right hind ankle',
    ],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'The braided wire has cut a deep ring around your ankle, slicing through hide and into the flesh beneath. Every step reopens the wound, and the wire has left fragments of rust and grit embedded in the laceration.',
        statEffects: [
          { stat: StatId.HEA, amount: -7 },
          { stat: StatId.TRA, amount: 8 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.15,
        permanentDebuffChance: 0.10,
      },
      {
        severity: 'severe',
        description: 'The snare wire has cut nearly to the bone. The wound is angry and inflamed, the flesh around it hot to the touch. Infection has set in, and the ankle is swollen to twice its normal size. Walking is agony.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.20,
        permanentDebuffChance: 0.18,
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
        baseHealingTime: 3,
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
        baseHealingTime: 5,
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
        baseHealingTime: 8,
        worseningChance: 0.25,
        permanentDebuffChance: 0.25,
      },
    ],
  },
};
