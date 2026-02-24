import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const HONEYBEE_WORKER_INJURIES: Record<string, InjuryDefinition> = {
  'wing-damage': {
    id: 'wing-damage',
    name: 'Wing Damage',
    bodyParts: [
      'right forewing',
      'left forewing',
      'right hindwing',
      'left hindwing',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A small tear in one wing membrane. Flight is slightly less efficient — you burn more energy per trip.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.15,
        permanentDebuffChance: 0.70,
      },
      {
        severity: 'moderate',
        description: 'A large section of wing membrane is torn. Your flight is labored and you cannot carry full pollen loads. Every foraging trip takes longer and yields less.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.12,
        permanentDebuffChance: 0.90,
      },
      {
        severity: 'severe',
        description: 'Your wings are shredded. You cannot generate enough lift to fly. You are grounded — a forager who cannot forage, a worker who cannot work. The colony has no use for you.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.HOM, amount: 16 },
          { stat: StatId.ADV, amount: 15 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },

  'leg-loss': {
    id: 'leg-loss',
    name: 'Leg Damage',
    bodyParts: [
      'right foreleg',
      'left foreleg',
      'right midleg',
      'left midleg',
      'right hindleg',
      'left hindleg',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The tarsal claws on one leg are damaged. Gripping flowers and comb cells is harder.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 3 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.10,
        permanentDebuffChance: 0.50,
      },
      {
        severity: 'moderate',
        description: 'A leg is partially crushed — bent at an unnatural angle. Your pollen baskets on the hind legs are compromised. You can walk but your foraging capacity is reduced.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.08,
        permanentDebuffChance: 0.80,
      },
      {
        severity: 'severe',
        description: 'An entire leg is gone — torn off by a predator or caught in a mechanism. Insects cannot regenerate limbs. You will compensate with your remaining five legs, but your balance and carrying capacity are permanently diminished.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 14 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },

  'sting-apparatus-injury': {
    id: 'sting-apparatus-injury',
    name: 'Sting Apparatus Damage',
    bodyParts: [
      'sting apparatus',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'Your sting venom sac is partially depleted from a previous defense. You can still sting, but with reduced venom.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.ADV, amount: 3 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.05,
        permanentDebuffChance: 0.40,
      },
      {
        severity: 'moderate',
        description: 'Your sting barb is bent. Stinging would be difficult and might not penetrate. Your last line of defense is compromised.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.05,
        permanentDebuffChance: 0.70,
      },
      {
        severity: 'severe',
        description: 'Your sting apparatus is destroyed. You have already stung once — the barbed sting pulled free from your abdomen, taking your venom sac and part of your digestive tract with it. This is fatal. Every honeybee who stings a mammal dies for the colony.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },
};
