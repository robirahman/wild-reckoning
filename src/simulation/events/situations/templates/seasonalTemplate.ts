import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import { composeNarrative } from '../narrativeComposer';

// Import existing configs and factory
import { createSeasonalTrigger } from '../../factories/seasonalFactory';
import {
  ANTLER_VELVET_CONFIG,
  INSECT_HARASSMENT_CONFIG,
  AUTUMN_RUT_CONFIG,
  WINTER_YARD_CONFIG,
  RUT_ENDS_CONFIG,
} from '../../data/seasonalConfigs';
import type { SeasonalTriggerConfig } from '../../data/seasonalConfigs';

// ══════════════════════════════════════════════════
//  SEASONAL TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 5 seasonal triggers:
// antler-velvet, insect-harassment, autumn-rut,
// winter-yard, rut-ends.
//

interface SeasonalEntry {
  config: SeasonalTriggerConfig;
  trigger: ReturnType<typeof createSeasonalTrigger>;
}

const SEASONAL_ENTRIES: SeasonalEntry[] = [
  ANTLER_VELVET_CONFIG,
  INSECT_HARASSMENT_CONFIG,
  AUTUMN_RUT_CONFIG,
  WINTER_YARD_CONFIG,
  RUT_ENDS_CONFIG,
].map(config => ({
  config,
  trigger: createSeasonalTrigger(config),
}));

function findMatchingEntries(
  ctx: SimulationContext,
  situations: Situation[],
): { entry: SeasonalEntry; weight: number }[] {
  const results: { entry: SeasonalEntry; weight: number }[] = [];

  for (const entry of SEASONAL_ENTRIES) {
    if (!entry.trigger.isPlausible(ctx)) continue;

    let weight = entry.trigger.computeWeight(ctx);

    // Situation modifiers: seasonal phase boosts relevant events
    if (situations.some(s => s.type === 'seasonal-phase')) {
      weight *= 1.15;
    }
    // Weather compounds seasonal events
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'harsh')) {
      if (entry.config.tags.includes('weather')) weight *= 1.3;
    }
    // Insect season situation boosts insect events
    if (situations.some(s => s.type === 'seasonal-phase' && s.source === 'insect-season')) {
      if (entry.config.id === 'sim-insect-harassment') weight *= 1.4;
    }

    if (weight > 0) {
      results.push({ entry, weight });
    }
  }

  return results;
}

export const seasonalTemplate: InteractionTemplate = {
  id: 'seasonal-transition',
  category: 'seasonal',
  tags: ['seasonal'],

  requiredSituations: [],
  optionalSituations: [
    'seasonal-phase',
    'weather-condition',
    'terrain-feature',
    'physiological-state',
    'body-impairment',
  ],

  extraPlausibility(ctx, situations) {
    return findMatchingEntries(ctx, situations).length > 0;
  },

  computeWeight(ctx, situations) {
    const entries = findMatchingEntries(ctx, situations);
    if (entries.length === 0) return 0;
    return entries.reduce((sum, e) => sum + e.weight, 0);
  },

  resolve(ctx, situations) {
    const entries = findMatchingEntries(ctx, situations);
    if (entries.length === 0) {
      return { harmEvents: [], statEffects: [], consequences: [], narrativeText: '' };
    }

    const weights = entries.map(e => e.weight);
    const idx = ctx.rng.weightedSelect(weights);
    const outcome = entries[idx].entry.trigger.resolve(ctx);

    // Layer situation hooks into narrative
    if (outcome.narrativeText && !outcome.narrativeContext) {
      outcome.narrativeText = composeNarrative(ctx, situations, outcome.narrativeText);
    }

    return outcome;
  },

  getChoices(ctx, situations) {
    const entries = findMatchingEntries(ctx, situations);
    if (entries.length === 0) return [];

    entries.sort((a, b) => b.weight - a.weight);
    return entries[0].entry.trigger.getChoices(ctx);
  },
};
