import type { InteractionTemplate, Situation, SituationType } from '../types';
import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../../types';
import { composeNarrative } from '../narrativeComposer';

// Import existing configs directly — they contain all narrative and logic
import { createSeasonalBrowseTrigger, createRiskyForagingTrigger, createToxicPlantTrigger } from '../../factories/foragingFactory';
import { SEASONAL_BROWSE_CONFIG, RISKY_FORAGING_CONFIG, TOXIC_PLANT_CONFIG } from '../../data/foragingConfigs';

// ══════════════════════════════════════════════════
//  FORAGING TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 3 foraging triggers:
// seasonal-browse, risky-foraging, toxic-plant.
//

interface ForagingEntry {
  id: string;
  tags: string[];
  isPlausible: (ctx: SimulationContext) => boolean;
  computeWeight: (ctx: SimulationContext) => number;
  resolve: (ctx: SimulationContext) => SimulationOutcome;
  getChoices: (ctx: SimulationContext) => SimulationChoice[];
}

// Build entries from existing factory-created triggers
const browseTrigger = createSeasonalBrowseTrigger(SEASONAL_BROWSE_CONFIG);
const riskyTrigger = createRiskyForagingTrigger(RISKY_FORAGING_CONFIG);
const toxicTrigger = createToxicPlantTrigger(TOXIC_PLANT_CONFIG);

const FORAGING_ENTRIES: ForagingEntry[] = [
  { id: browseTrigger.id, tags: browseTrigger.tags, isPlausible: browseTrigger.isPlausible, computeWeight: browseTrigger.computeWeight, resolve: browseTrigger.resolve, getChoices: browseTrigger.getChoices },
  { id: riskyTrigger.id, tags: riskyTrigger.tags, isPlausible: riskyTrigger.isPlausible, computeWeight: riskyTrigger.computeWeight, resolve: riskyTrigger.resolve, getChoices: riskyTrigger.getChoices },
  { id: toxicTrigger.id, tags: toxicTrigger.tags, isPlausible: toxicTrigger.isPlausible, computeWeight: toxicTrigger.computeWeight, resolve: toxicTrigger.resolve, getChoices: toxicTrigger.getChoices },
];

function findMatchingEntries(
  ctx: SimulationContext,
  situations: Situation[],
): { entry: ForagingEntry; weight: number }[] {
  const results: { entry: ForagingEntry; weight: number }[] = [];

  for (const entry of FORAGING_ENTRIES) {
    if (!entry.isPlausible(ctx)) continue;

    let weight = entry.computeWeight(ctx);

    // Situation modifiers: terrain features affect foraging
    if (situations.some(s => s.type === 'terrain-feature' && s.source === 'water')) {
      // Near water = better browse (riparian zones are rich)
      weight *= 1.15;
    }
    // Hunger situation boosts foraging weight
    if (situations.some(s => s.type === 'physiological-state' && s.source === 'hunger')) {
      weight *= 1.3;
    }
    // Foraging activity boosts
    if (situations.some(s => s.type === 'activity-exposure' && s.source === 'foraging')) {
      weight *= 1.2;
    }

    if (weight > 0) {
      results.push({ entry, weight });
    }
  }

  return results;
}

export const foragingTemplate: InteractionTemplate = {
  id: 'foraging',
  category: 'foraging',
  tags: ['foraging', 'food'],

  requiredSituations: [],
  optionalSituations: [
    'terrain-feature',
    'weather-condition',
    'seasonal-phase',
    'physiological-state',
    'activity-exposure',
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
    const outcome = entries[idx].entry.resolve(ctx);

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
    return entries[0].entry.getChoices(ctx);
  },
};
