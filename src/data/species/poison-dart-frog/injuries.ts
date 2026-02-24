import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const POISON_DART_FROG_INJURIES: Record<string, InjuryDefinition> = {
  'leg-damage': {
    id: 'leg-damage',
    name: 'Leg Damage',
    bodyParts: [
      'front-left-leg',
      'front-right-leg',
      'hind-left-leg',
      'hind-right-leg',
      'left-foot',
      'right-foot',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A slight sprain from a wrestling bout or an awkward landing. The leg functions but you favor it when jumping.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'A torn muscle or dislocated joint. The leg drags when you try to hop. Climbing bromeliad leaves to reach tadpole pools is agonizing, and escaping predators requires desperate scrambling on three good legs.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.ADV, amount: 6 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.12,
        permanentDebuffChance: 0.15,
      },
      {
        severity: 'severe',
        description: 'The leg is broken or the joint is shattered. You cannot jump at all — only drag yourself through the leaf litter. Hunting is nearly impossible. Without the ability to leap, you are vulnerable to every ground predator in the forest.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.ADV, amount: 12 },
        ],
        baseHealingTime: 18,
        worseningChance: 0.06,
        permanentDebuffChance: 0.30,
      },
    ],
  },

  'vocal-sac-strain': {
    id: 'vocal-sac-strain',
    name: 'Vocal Sac Strain',
    bodyParts: ['throat'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The thin membrane of your vocal sac is inflamed and swollen from hours of aggressive calling during a territorial dispute. Each attempt to call produces a strained, reedy buzz instead of your usual resonant tone. The tissue needs rest, but silence means losing your territory to any male bold enough to call from your perch. You sit on your leaf with your throat pulsing weakly, broadcasting a diminished version of yourself into the forest.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.03,
      },
    ],
  },

  'skin-abrasion': {
    id: 'skin-abrasion',
    name: 'Skin Abrasion',
    bodyParts: [
      'dorsal skin',
      'ventral skin',
      'left flank',
      'right flank',
      'head',
      'throat',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A superficial scrape from rough bark or a rival\'s grasp. The skin is raw but intact. Toxin secretion in the area is temporarily reduced.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.IMM, amount: 4 },
        ],
        baseHealingTime: 3,
        worseningChance: 0.10,
        permanentDebuffChance: 0.03,
      },
      {
        severity: 'moderate',
        description: 'A deep abrasion exposing raw tissue. The wound weeps fluid and is vulnerable to fungal infection. Your skin\'s ability to secrete defensive toxins is compromised across a wide area, and predators may not receive the usual chemical warning.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.15,
        permanentDebuffChance: 0.12,
      },
      {
        severity: 'severe',
        description: 'Large patches of skin are torn away, exposing muscle beneath. Your toxin defense is essentially gone in the affected area. The wound is a highway for chytrid fungus and bacteria. You are in constant pain and losing moisture rapidly through the damaged tissue.',
        statEffects: [
          { stat: StatId.HEA, amount: -16 },
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HOM, amount: 12 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.08,
        permanentDebuffChance: 0.35,
      },
    ],
  },

  'eye-injury': {
    id: 'eye-injury',
    name: 'Eye Injury',
    bodyParts: [
      'left eye',
      'right eye',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Debris or a thorn has scratched your cornea. The eye waters constantly and your depth perception for striking at prey is slightly off.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.WIS, amount: -3 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.10,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'A puncture or deep scratch has clouded the lens. You can detect movement on that side but cannot focus clearly. Hunting small, fast-moving arthropods is significantly harder with impaired binocular vision.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.WIS, amount: -8 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.12,
        permanentDebuffChance: 0.25,
      },
      {
        severity: 'severe',
        description: 'The eye is destroyed — ruptured by impact or infection. You are blind on one side. Predators can approach from your blind spot, and the tiny ants and mites you depend on are nearly impossible to catch with monocular vision alone.',
        statEffects: [
          { stat: StatId.HEA, amount: -14 },
          { stat: StatId.WIS, amount: -14 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.04,
        permanentDebuffChance: 0.60,
      },
    ],
  },
};
