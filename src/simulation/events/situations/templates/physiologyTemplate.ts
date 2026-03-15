import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import type { PressureConfig } from '../../data/pressureConfigs';
import { composeNarrative } from '../narrativeComposer';

// Import pressure factory to build triggers from configs
import { createPressureTrigger } from '../../factories/pressureFactory';
import {
  STARVATION_PRESSURE_CONFIG,
  HYPOTHERMIA_PRESSURE_CONFIG,
  INJURY_IMPACT_CONFIG,
  IMMUNE_PRESSURE_CONFIG,
} from '../../data/pressureConfigs';

// ══════════════════════════════════════════════════
//  PHYSIOLOGY PRESSURE TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 4 physiology-driven pressure triggers:
// starvation-pressure, hypothermia-pressure, injury-impact,
// immune-pressure.
//
// These were previously categorized as 'environmental' but are
// actually body-state-driven. The template gives them proper
// situation-based compound modifiers.
//

interface PressureEntry {
  config: PressureConfig;
  trigger: ReturnType<typeof createPressureTrigger>;
}

const PRESSURE_ENTRIES: PressureEntry[] = [
  STARVATION_PRESSURE_CONFIG,
  HYPOTHERMIA_PRESSURE_CONFIG,
  INJURY_IMPACT_CONFIG,
  IMMUNE_PRESSURE_CONFIG,
].map(config => ({
  config,
  trigger: createPressureTrigger(config),
}));

function findMatchingEntries(
  ctx: SimulationContext,
  situations: Situation[],
): { entry: PressureEntry; weight: number }[] {
  const results: { entry: PressureEntry; weight: number }[] = [];

  for (const entry of PRESSURE_ENTRIES) {
    if (!entry.trigger.isPlausible(ctx)) continue;

    let weight = entry.trigger.computeWeight(ctx);

    // Situation modifiers: weather compounds physiological pressure
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'harsh')) {
      if (entry.config.tags.includes('seasonal')) weight *= 1.4; // hypothermia
      if (entry.config.tags.includes('foraging')) weight *= 1.2; // starvation
    }
    // Deep snow compounds starvation (can't reach browse)
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'deep-snow')) {
      if (entry.config.tags.includes('foraging')) weight *= 1.3;
    }
    // Body impairment compounds injury impact
    if (situations.some(s => s.type === 'body-impairment')) {
      if (entry.config.id === 'sim-injury-impact') weight *= 1.2;
    }
    // Physiological state reinforces pressure events
    if (situations.some(s => s.type === 'physiological-state' && s.source === 'immunocompromised')) {
      if (entry.config.id === 'sim-immune-pressure') weight *= 1.2;
    }
    if (situations.some(s => s.type === 'physiological-state' && s.source === 'hunger')) {
      if (entry.config.id === 'sim-starvation-pressure') weight *= 1.2;
    }

    if (weight > 0) {
      results.push({ entry, weight });
    }
  }

  return results;
}

export const physiologyTemplate: InteractionTemplate = {
  id: 'physiology-pressure',
  category: 'physiology',
  tags: ['danger'],

  requiredSituations: [],
  optionalSituations: [
    'physiological-state',
    'body-impairment',
    'weather-condition',
    'terrain-feature',
    'seasonal-phase',
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
