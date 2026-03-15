import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import type { HealthTriggerConfig } from '../../data/healthConfigs';
import { composeNarrative } from '../narrativeComposer';

// Import existing impairment configs — they contain all narrative and logic
import {
  LOCOMOTION_IMPAIRMENT_CONFIG,
  VISION_IMPAIRMENT_CONFIG,
  BREATHING_IMPAIRMENT_CONFIG,
  HERD_SEPARATION_CONFIG,
  STARVATION_INFECTION_CONFIG,
} from '../../data/impairmentConfigs';

// ══════════════════════════════════════════════════
//  IMPAIRMENT NARRATIVE TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 5 impairment narrative triggers:
// locomotion-impairment, vision-impairment, breathing-impairment,
// herd-separation, starvation-infection-compound.
//

const IMPAIRMENT_CONFIGS: HealthTriggerConfig[] = [
  LOCOMOTION_IMPAIRMENT_CONFIG,
  VISION_IMPAIRMENT_CONFIG,
  BREATHING_IMPAIRMENT_CONFIG,
  HERD_SEPARATION_CONFIG,
  STARVATION_INFECTION_CONFIG,
];

function findMatchingConfigs(
  ctx: SimulationContext,
  situations: Situation[],
): { config: HealthTriggerConfig; weight: number }[] {
  const results: { config: HealthTriggerConfig; weight: number }[] = [];

  for (const config of IMPAIRMENT_CONFIGS) {
    if (!config.isPlausible(ctx)) continue;

    let weight = config.computeWeight(ctx);

    // Situation modifiers: terrain compounds impairment effects
    if (situations.some(s => s.type === 'terrain-feature' && s.source === 'steep')) {
      if (config.tags.includes('impairment')) weight *= 1.2;
    }
    // Weather compounds everything
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'harsh')) {
      weight *= 1.15;
    }
    // Body impairment situations reinforce impairment narrative events
    if (situations.some(s => s.type === 'body-impairment')) {
      weight *= 1.1;
    }

    if (weight > 0) {
      results.push({ config, weight });
    }
  }

  return results;
}

export const impairmentTemplate: InteractionTemplate = {
  id: 'impairment-narrative',
  category: 'impairment',
  tags: ['health', 'impairment'],

  requiredSituations: [],
  optionalSituations: [
    'body-impairment',
    'physiological-state',
    'terrain-feature',
    'weather-condition',
    'conspecific-nearby',
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
