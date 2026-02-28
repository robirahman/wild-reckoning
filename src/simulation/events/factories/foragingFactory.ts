import type { SimulationTrigger, SimulationContext } from '../types';
import type { HarmEvent } from '../../harm/types';
import type {
  SeasonalBrowseConfig,
  SeasonalBrowseEntry,
  RiskyForagingConfig,
  ToxicPlantConfig,
} from '../data/foragingConfigs';
import { StatId } from '../../../types/stats';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Seasonal Browse Factory ──

/**
 * Match a seasonal browse entry against the current context.
 * First matching entry wins; entries with `chance` require an RNG check.
 */
function matchBrowseEntry(
  entries: SeasonalBrowseEntry[],
  ctx: SimulationContext,
): SeasonalBrowseEntry | undefined {
  const season = ctx.time.season;
  const terrain = ctx.currentNodeType;
  const weather = ctx.currentWeather?.type;

  for (const entry of entries) {
    if (entry.season !== season) continue;
    if (entry.terrain && entry.terrain !== terrain) continue;
    if (entry.weather && entry.weather !== weather) continue;
    if (entry.chance !== undefined && !ctx.rng.chance(entry.chance)) continue;
    return entry;
  }
  return undefined;
}

export function createSeasonalBrowseTrigger(config: SeasonalBrowseConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category as any,
    tags: config.tags,

    isPlausible(_ctx) {
      return true; // Foraging is always plausible
    },

    computeWeight(ctx) {
      let base = config.baseWeight;

      // Season multiplier
      base *= config.seasonWeightMultipliers[ctx.time.season] ?? 1;

      // Terrain multiplier
      if (ctx.currentNodeType) {
        base *= config.terrainWeightMultipliers[ctx.currentNodeType] ?? 1;
      }

      // World memory: foraging pressure
      const nodeMemory = ctx.currentNodeId ? ctx.worldMemory?.nodeMemory[ctx.currentNodeId] : undefined;
      if (nodeMemory && nodeMemory.foragingPressure > config.foragingPressureThreshold) {
        base *= Math.max(0.3, 1 - nodeMemory.foragingPressure * config.foragingPressureFactor);
      }

      return base;
    },

    resolve(ctx) {
      const entry = matchBrowseEntry(config.entries, ctx) ?? config.fallback;
      const env = buildEnvironment(ctx);

      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.HOM, amount: entry.homChange, label: entry.homChange >= 0 ? '+HOM' : '-HOM' },
        ],
        consequences: entry.bonusCalories !== 0
          ? [{ type: 'add_calories' as const, amount: entry.bonusCalories, source: 'seasonal-browse' }]
          : [],
        narrativeText: entry.narrative,
        narrativeContext: buildNarrativeContext({
          eventCategory: config.category as any,
          eventType: 'seasonal-browse',
          actions: [action(
            entry.narrative,
            entry.clinicalDetail || `Seasonal foraging in ${ctx.time.season}/${ctx.currentNodeType ?? 'forest'}. ${entry.bonusCalories >= 0 ? `+${entry.bonusCalories}` : entry.bonusCalories} bonus kcal vs baseline.`,
            entry.bonusCalories < -50 ? 'high' : 'low',
          )],
          environment: env,
          emotionalTone: entry.bonusCalories < -30 ? 'tension' : 'calm',
        }),
      };
    },

    getChoices() {
      return []; // Passive foraging has no choices
    },
  };
}

// ── Risky Foraging Factory ──

export function createRiskyForagingTrigger(config: RiskyForagingConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category as any,
    tags: config.tags,

    isPlausible(ctx) {
      return config.plausibleSeasons.includes(ctx.time.season);
    },

    computeWeight(ctx) {
      let base = config.baseWeight;

      // Hunger multiplier
      const weightThreshold = ctx.config.weight.vulnerabilityThreshold;
      if (ctx.animal.weight < weightThreshold) {
        base *= config.hungerMultiplier;
      }

      // Terrain multiplier
      if (ctx.currentNodeType) {
        base *= config.terrainWeightMultipliers[ctx.currentNodeType] ?? 1;
      }

      return base;
    },

    resolve(ctx) {
      const scenarioIndex = ctx.rng.int(0, config.scenarios.length - 1);
      const scenario = config.scenarios[scenarioIndex](ctx);
      const env = buildEnvironment(ctx);

      return {
        harmEvents: [],
        statEffects: [...scenario.statEffects],
        consequences: [...scenario.consequences],
        narrativeText: scenario.narrativeText,
        narrativeContext: buildNarrativeContext({
          eventCategory: config.category as any,
          eventType: `risky-foraging-${scenario.id}`,
          actions: [action(
            scenario.narrativeText.substring(0, 200) + '...',
            scenario.clinicalDetail,
            'medium',
          )],
          environment: env,
          emotionalTone: scenario.emotionalTone as any,
        }),
      };
    },

    getChoices(ctx) {
      // Use the same random selection as resolve by seeding from the same state
      const scenarioIndex = ctx.rng.int(0, config.scenarios.length - 1);
      const scenario = config.scenarios[scenarioIndex](ctx);
      return scenario.choices;
    },
  };
}

// ── Toxic Plant Factory ──

export function createToxicPlantTrigger(config: ToxicPlantConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category as any,
    tags: config.tags,

    isPlausible(ctx) {
      return config.plausibleSeasons.includes(ctx.time.season);
    },

    computeWeight(ctx) {
      let base = config.baseWeight;

      if (ctx.currentNodeType) {
        base *= config.terrainWeightMultipliers[ctx.currentNodeType] ?? 1;
      }

      if (ctx.animal.age < config.youngAgeCutoff) {
        base *= config.youngAgeMultiplier;
      }

      return base;
    },

    resolve(ctx) {
      const [minMag, maxMag] = config.magnitudeRange;
      const harmEvent: HarmEvent = {
        id: `poison-${ctx.time.turn}`,
        sourceLabel: config.sourceLabel,
        magnitude: ctx.rng.int(minMag, maxMag),
        targetZone: config.targetZone,
        spread: config.spread,
        harmType: config.harmType,
      };

      const env = buildEnvironment(ctx);
      return {
        harmEvents: [harmEvent],
        statEffects: [...config.statEffects],
        consequences: [
          { type: 'add_calories' as const, amount: -config.caloryCost, source: 'plant-poisoning' },
        ],
        narrativeText: config.narrativeText,
        narrativeContext: buildNarrativeContext({
          eventCategory: config.category as any,
          eventType: 'toxic-plant',
          actions: [action(
            config.narrativeText.substring(0, 200) + '...',
            config.clinicalDetail,
            'high',
            [config.targetZone as any],
          )],
          environment: env,
          emotionalTone: config.emotionalTone as any,
          sourceHarmEvents: [harmEvent],
        }),
      };
    },

    getChoices() {
      return []; // Poisoning is not a choice event
    },
  };
}
