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

  'rut-puncture-wound': {
    id: 'rut-puncture-wound',
    name: 'Antler Puncture Wound',
    bodyParts: ['right shoulder', 'left shoulder', 'right flank', 'left flank', 'neck'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A tine punched through the hide and into the muscle beneath, leaving a deep, narrow wound that bleeds freely but missed anything vital. The puncture will close over quickly — too quickly, trapping bacteria inside.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.18,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'A deep antler puncture that has abscessed beneath the skin, forming a hot, swollen pocket of infection. The surrounding tissue is inflamed and rigid with fever. Each movement pulls at the wound and sends pain radiating across the shoulder.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.IMM, amount: 8 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'severe',
        description: 'The puncture wound has become a deep abscess that ruptured inward, spreading sepsis into the surrounding tissue. The flesh is necrotic, the smell is foul, and systemic infection is setting in. Fever and lethargy are constant.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 16 },
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.20,
        permanentDebuffChance: 0.15,
      },
    ],
  },

  'rut-eye-injury': {
    id: 'rut-eye-injury',
    name: 'Eye Injury',
    bodyParts: ['right eye', 'left eye'],
    severityLevels: [
      {
        severity: 'moderate',
        description: 'An antler tine raked across the eye, tearing the cornea and flooding the socket with blood. Vision on that side is blurred and painful, reduced to smears of light and shadow. The eyelid is swollen shut most of the time.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.TRA, amount: 10 },
          { stat: StatId.ADV, amount: 10 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.12,
        permanentDebuffChance: 0.35,
      },
      {
        severity: 'severe',
        description: 'The tine punctured the eyeball directly, destroying it. The orbit is a ruin of blood and vitreous fluid. That eye will never see again. Depth perception is gone, and the entire blind side is now a vulnerability that every predator will eventually learn to exploit.',
        statEffects: [
          { stat: StatId.HEA, amount: -14 },
          { stat: StatId.TRA, amount: 18 },
          { stat: StatId.ADV, amount: 16 },
          { stat: StatId.HOM, amount: 12 },
        ],
        baseHealingTime: 24,
        worseningChance: 0.08,
        permanentDebuffChance: 0.85,
      },
    ],
  },

  'rut-laceration': {
    id: 'rut-laceration',
    name: 'Rut Laceration',
    bodyParts: ['right flank', 'left flank', 'right shoulder', 'left shoulder', 'chest'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Long, shallow scrapes where antler tines dragged across the hide during the grappling. The cuts are raw and weeping but superficial — more painful than dangerous.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 3 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.06,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'A tine caught in the hide and tore a long flap of skin loose, exposing the red muscle beneath. The wound is too wide to close on its own and will attract flies if the weather is warm.',
        statEffects: [
          { stat: StatId.HEA, amount: -6 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.IMM, amount: 5 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.12,
        permanentDebuffChance: 0.04,
      },
    ],
  },

  'doe-foreleg-strike': {
    id: 'doe-foreleg-strike',
    name: 'Foreleg Strike Bruise',
    bodyParts: ['right shoulder', 'left shoulder', 'right flank', 'left flank', 'ribs'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A deep bruise from a dominant doe\'s foreleg blow. The impact site is swollen and tender, and you flinch when it brushes against brush or branches.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.06,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'The foreleg strike cracked cartilage along your ribs. Every breath is a dull ache, and running sends sharp pain radiating through your chest. The bruise has spread into a dark, swollen mass beneath the hide.',
        statEffects: [
          { stat: StatId.HEA, amount: -7 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.ADV, amount: 4 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.10,
        permanentDebuffChance: 0.04,
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
