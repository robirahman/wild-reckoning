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

  'spawning-jaw-wound': {
    id: 'spawning-jaw-wound',
    name: 'Spawning Jaw Wound',
    bodyParts: [
      'upper jaw',
      'lower jaw',
      'kype',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The tip of the kype is cracked and splintered from a jaw-locking fight. The cartilage is bruised and swollen, making it painful to hold position against the current.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.15,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'The jaw has been partially dislocated from a prolonged lock with another male. The kype hangs at an unnatural angle, and the joint grinds with each attempt to open or close the mouth. Fungal growth is already colonizing the exposed tissue.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.IMM, amount: 6 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.20,
        permanentDebuffChance: 0.08,
      },
    ],
  },

  'spawning-fin-tear': {
    id: 'spawning-fin-tear',
    name: 'Spawning Fin Tear',
    bodyParts: [
      'dorsal fin',
      'caudal fin',
      'pectoral fin',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The dorsal fin is ragged and torn, its membrane shredded into ribbons by repeated body-slams from rival males. The fin still functions but catches the current unevenly.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.12,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'The caudal fin is badly damaged — half its surface area torn away or collapsed into useless tatters. Swimming is labored and inefficient, each stroke producing less thrust than the last. Holding station in the current requires constant effort.',
        statEffects: [
          { stat: StatId.HEA, amount: -7 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.18,
        permanentDebuffChance: 0.07,
      },
    ],
  },

  'spawning-flank-laceration': {
    id: 'spawning-flank-laceration',
    name: 'Spawning Flank Laceration',
    bodyParts: [
      'left flank',
      'right flank',
      'ventral area',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A rake of teeth has stripped scales from the flank, leaving shallow cuts that weep blood into the current. The exposed skin is pale and raw against the darkening spawning pigment.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
          { stat: StatId.IMM, amount: 3 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.14,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'A deep gash runs the length of the flank, exposing the pale muscle beneath. The wound is open and ragged, too wide to close on its own, and white fungus is already threading into the edges. On a body already decomposing from the spawning transformation, this wound will not heal.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.IMM, amount: 8 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.22,
        permanentDebuffChance: 0.12,
      },
    ],
  },
};
