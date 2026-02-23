import type { InjuryDefinition } from '../../types/health';
import { StatId } from '../../types/stats';

export const injuryDefinitions: Record<string, InjuryDefinition> = {
  'antler-wound': {
    id: 'antler-wound',
    name: 'Antler Wound',
    bodyParts: [
      'right shoulder',
      'left shoulder',
      'left flank',
      'right flank',
      'right haunch',
      'left haunch',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A shallow puncture wound from antler tines during a rut competition.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 5 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'A deep antler wound that tore muscle tissue. Movement is painful.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 12 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.12,
        permanentDebuffChance: 0.05,
      },
    ],
  },
  'leg-fracture': {
    id: 'leg-fracture',
    name: 'Leg Fracture',
    bodyParts: [
      'front left ulna',
      'front right ulna',
      'hind left tibia',
      'hind right tibia',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A minor fracture that does not interfere with ordinary activities, but may worsen if not rested.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.10,
        permanentDebuffChance: 0.02,
      },
      {
        severity: 'moderate',
        description: 'A significant fracture causing a visible limp. Running is painful and slow.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.15,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'severe',
        description: 'A compound fracture. You can barely put weight on the limb. Predators will notice.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.ADV, amount: 12 },
        ],
        baseHealingTime: 24,
        worseningChance: 0.20,
        permanentDebuffChance: 0.20,
      },
    ],
  },
};
