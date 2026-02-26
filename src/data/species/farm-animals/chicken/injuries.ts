import type { InjuryDefinition } from '../../../../types/health';
import { StatId } from '../../../../types/stats';

export const CHICKEN_INJURIES: Record<string, InjuryDefinition> = {
  'pecking-wound': {
    id: 'pecking-wound',
    name: 'Pecking Wound',
    bodyParts: ['comb', 'wattle', 'neck', 'back'],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A sharp peck from a rival has left a bleeding sore.',
        statEffects: [{ stat: StatId.HEA, amount: -2 }],
        baseHealingTime: 3,
        worseningChance: 0.1,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: 'Repeated pecking has opened a deep wound, exposing muscle.',
        statEffects: [{ stat: StatId.HEA, amount: -8 }, { stat: StatId.IMM, amount: 5 }],
        baseHealingTime: 8,
        worseningChance: 0.2,
        permanentDebuffChance: 0.05,
      }
    ],
  },
  'fox-bite': {
    id: 'fox-bite',
    name: 'Fox Bite',
    bodyParts: ['wing', 'back', 'thigh'],
    severityLevels: [
      {
        severity: 'severe',
        description: 'A narrow escape from a predator has left deep puncture wounds.',
        statEffects: [{ stat: StatId.HEA, amount: -20 }, { stat: StatId.STR, amount: 15 }],
        baseHealingTime: 20,
        worseningChance: 0.25,
        permanentDebuffChance: 0.3,
      }
    ],
  },
};
