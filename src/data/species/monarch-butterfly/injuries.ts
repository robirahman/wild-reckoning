import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const MONARCH_BUTTERFLY_INJURIES: Record<string, InjuryDefinition> = {
  'wing-tear': {
    id: 'wing-tear',
    name: 'Wing Tear',
    bodyParts: [
      'right forewing',
      'left forewing',
      'right hindwing',
      'left hindwing',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A small tear along the edge of your wing. Flight is slightly less efficient, and you drift in crosswinds more than usual.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'A significant section of wing membrane is torn away. You can still fly, but sustained flight is exhausting and your gliding ability is compromised. Migration may be impossible.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.20,
        permanentDebuffChance: 0.40,
      },
      {
        severity: 'severe',
        description: 'Your wing is shredded — large portions of the membrane are gone, and the veins are damaged. Flight is barely possible. Without functional wings, you cannot feed, migrate, or escape predators. Butterfly wings do not heal.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 22 },
          { stat: StatId.ADV, amount: 18 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.05,
        permanentDebuffChance: 0.85,
      },
    ],
  },

  'bird-attack-damage': {
    id: 'bird-attack-damage',
    name: 'Bird Attack Damage',
    bodyParts: [
      'thorax',
      'abdomen',
      'right forewing',
      'left forewing',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A bird struck at you and missed the body, but its beak clipped your wing. Scale dust was knocked away, leaving a pale streak. The damage is cosmetic but the encounter was terrifying.',
        statEffects: [
          { stat: StatId.TRA, amount: 8 },
          { stat: StatId.HEA, amount: -2 },
        ],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A bird grabbed you and bit down before the cardiac glycosides in your body made it spit you out. Your thorax is bruised, a wing is crumpled, and hemolymph is leaking from puncture wounds. You survived because you are toxic — but the damage is real.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.TRA, amount: 15 },
          { stat: StatId.HOM, amount: 14 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.18,
        permanentDebuffChance: 0.30,
      },
      {
        severity: 'severe',
        description: 'The bird attack crushed part of your body. Your abdomen is punctured, hemolymph is draining freely, and one wing is too damaged to unfurl fully. Even a bird that learned to avoid monarchs was hungry enough to try. You are barely alive.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.TRA, amount: 20 },
          { stat: StatId.HOM, amount: 22 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.25,
        permanentDebuffChance: 0.70,
      },
    ],
  },
};
