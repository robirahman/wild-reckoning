import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import { composeNarrative } from '../narrativeComposer';

// Import existing configs — they contain all resolve/choice logic
import {
  WOUND_DETERIORATION_CONFIG,
  FEVER_EVENT_CONFIG,
  SEPSIS_EVENT_CONFIG,
  PARASITE_EXPOSURE_CONFIG,
  WOUND_INFECTION_CONFIG,
  DISEASE_OUTBREAK_CONFIG,
} from '../../data/healthConfigs';
import type { HealthTriggerConfig } from '../../data/healthConfigs';

// ══════════════════════════════════════════════════
//  HEALTH TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 6 health triggers:
// wound-deterioration, fever, sepsis, parasite-exposure,
// wound-infection, disease-outbreak.
//

const HEALTH_CONFIGS: HealthTriggerConfig[] = [
  WOUND_DETERIORATION_CONFIG,
  FEVER_EVENT_CONFIG,
  SEPSIS_EVENT_CONFIG,
  PARASITE_EXPOSURE_CONFIG,
  WOUND_INFECTION_CONFIG,
  DISEASE_OUTBREAK_CONFIG,
];

function findMatchingConfigs(
  ctx: SimulationContext,
  situations: Situation[],
): { config: HealthTriggerConfig; weight: number }[] {
  const results: { config: HealthTriggerConfig; weight: number }[] = [];

  for (const config of HEALTH_CONFIGS) {
    if (!config.isPlausible(ctx)) continue;

    let weight = config.computeWeight(ctx);

    // Situation modifiers: body impairment compounds health events
    if (situations.some(s => s.type === 'body-impairment' && s.source === 'open-wound')) {
      if (config.tags.includes('infection') || config.tags.includes('parasite')) {
        weight *= 1.2;
      }
    }
    // Weather affects disease/infection risk
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'harsh')) {
      if (config.tags.includes('infection') || config.tags.includes('fever')) {
        weight *= 1.15;
      }
    }
    // Physiological stress compounds health events
    if (situations.some(s => s.type === 'physiological-state' && s.source === 'hunger')) {
      weight *= 1.1;
    }
    if (situations.some(s => s.type === 'physiological-state' && s.source === 'immunocompromised')) {
      weight *= 1.25;
    }

    if (weight > 0) {
      results.push({ config, weight });
    }
  }

  return results;
}

export const healthTemplate: InteractionTemplate = {
  id: 'health-progression',
  category: 'health',
  tags: ['health'],

  requiredSituations: [],
  optionalSituations: [
    'body-impairment',
    'physiological-state',
    'weather-condition',
    'terrain-feature',
    'seasonal-phase',
  ],

  extraPlausibility(ctx, situations) {
    return findMatchingConfigs(ctx, situations).length > 0;
  },

  computeWeight(ctx, situations) {
    const matches = findMatchingConfigs(ctx, situations);
    if (matches.length === 0) return 0;
    return matches.reduce((sum, m) => sum + m.weight, 0);
  },

  resolve(ctx, situations) {
    const matches = findMatchingConfigs(ctx, situations);
    if (matches.length === 0) {
      return { harmEvents: [], statEffects: [], consequences: [], narrativeText: '' };
    }

    const weights = matches.map(m => m.weight);
    const idx = ctx.rng.weightedSelect(weights);
    const outcome = matches[idx].config.resolve(ctx);

    // Layer situation hooks into narrative
    if (outcome.narrativeText && !outcome.narrativeContext) {
      outcome.narrativeText = composeNarrative(ctx, situations, outcome.narrativeText);
    }

    return outcome;
  },

  getChoices(ctx, situations) {
    const matches = findMatchingConfigs(ctx, situations);
    if (matches.length === 0) return [];

    matches.sort((a, b) => b.weight - a.weight);
    return matches[0].config.getChoices(ctx);
  },
};
