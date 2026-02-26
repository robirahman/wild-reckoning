import type { InjuryDefinition } from '../../../../types/health';
import { StatId } from '../../../../types/stats';

export const PIG_INJURIES: Record<string, InjuryDefinition> = {
  'tusk-scrape': {
    id: 'tusk-scrape',
    name: 'Tusk Scrape',
    bodyParts: ['shoulder', 'flank', 'ear'],
    severityLevels: [
      {
        severity: 'minor',
        description: `A shallow but painful scrape from another pig's tusk.`,
        statEffects: [{ stat: StatId.HEA, amount: -2 }],
        baseHealingTime: 4,
        worseningChance: 0.08,
        permanentDebuffChance: 0.01,
      },
      {
        severity: 'moderate',
        description: `A deep tusk gouge that has torn through the hide and into the fat layer.`,
        statEffects: [{ stat: StatId.HEA, amount: -8 }, { stat: StatId.IMM, amount: 6 }],
        baseHealingTime: 12,
        worseningChance: 0.15,
        permanentDebuffChance: 0.04,
      }
    ],
  },
  'snout-abrasion': {
    id: 'snout-abrasion',
    name: 'Snout Abrasion',
    bodyParts: ['snout'],
    severityLevels: [
      {
        severity: 'minor',
        description: `You've rubbed your nose raw rooting against hard ground or fences.`,
        statEffects: [{ stat: StatId.HEA, amount: -1 }, { stat: StatId.NOV, amount: -2 }],
        baseHealingTime: 3,
        worseningChance: 0.05,
        permanentDebuffChance: 0,
      }
    ],
  },
};
