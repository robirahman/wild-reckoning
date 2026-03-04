import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../../types';
import { composeNarrative } from '../narrativeComposer';

// Import existing configs and factory
import { createMigrationTrigger } from '../../factories/migrationFactory';
import {
  WINTER_YARD_SCOUT_CONFIG,
  TRAVEL_HAZARDS_CONFIG,
  SPRING_RETURN_CONFIG,
} from '../../data/migrationConfigs';
import type { MigrationTriggerConfig } from '../../data/migrationConfigs';

// ══════════════════════════════════════════════════
//  MIGRATION TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 3 migration triggers:
// winter-yard-scout, travel-hazards, spring-return.
//

interface MigrationEntry {
  config: MigrationTriggerConfig;
  trigger: ReturnType<typeof createMigrationTrigger>;
}

const MIGRATION_ENTRIES: MigrationEntry[] = [
  WINTER_YARD_SCOUT_CONFIG,
  TRAVEL_HAZARDS_CONFIG,
  SPRING_RETURN_CONFIG,
].map(config => ({
  config,
  trigger: createMigrationTrigger(config),
}));

function findMatchingEntries(
  ctx: SimulationContext,
  situations: Situation[],
): { entry: MigrationEntry; weight: number }[] {
  const results: { entry: MigrationEntry; weight: number }[] = [];

  for (const entry of MIGRATION_ENTRIES) {
    if (!entry.trigger.isPlausible(ctx)) continue;

    let weight = entry.trigger.computeWeight(ctx);

    // Situation modifiers: weather affects migration urgency
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'harsh')) {
      weight *= 1.3;
    }
    if (situations.some(s => s.type === 'weather-condition' && s.source === 'deep-snow')) {
      weight *= 1.2;
    }
    // Body impairment slows migration
    if (situations.some(s => s.type === 'body-impairment' && s.source === 'locomotion')) {
      // Travel hazards still fire (can't avoid roads), but scouting is less likely
      if (entry.config.id === 'sim-winter-yard-scout') weight *= 0.7;
    }
    // Seasonal phase boosts
    if (situations.some(s => s.type === 'seasonal-phase' && s.source === 'winter-migration')) {
      weight *= 1.3;
    }
    // Travel activity boosts
    if (situations.some(s => s.type === 'activity-exposure' && s.source === 'traveling')) {
      weight *= 1.2;
    }

    if (weight > 0) {
      results.push({ entry, weight });
    }
  }

  return results;
}

export const migrationTemplate: InteractionTemplate = {
  id: 'migration',
  category: 'migration',
  tags: ['migration', 'travel'],

  requiredSituations: [],
  optionalSituations: [
    'seasonal-phase',
    'weather-condition',
    'terrain-feature',
    'body-impairment',
    'physiological-state',
    'activity-exposure',
    'memory-trigger',
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
