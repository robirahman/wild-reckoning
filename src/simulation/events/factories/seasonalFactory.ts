import type { SimulationTrigger, SimulationContext } from '../types';
import type { SeasonalTriggerConfig } from '../data/seasonalConfigs';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

/**
 * Create a SimulationTrigger from a SeasonalTriggerConfig.
 *
 * This factory implements the common seasonal event pattern:
 * - Plausibility from season/sex/age/flag rules
 * - Weight from base rate + terrain/weather multipliers + custom adjustments
 * - Narrative from context-dependent builder
 * - Choices with outcome modification (or empty for passive events)
 */
export function createSeasonalTrigger(config: SeasonalTriggerConfig): SimulationTrigger {
  return {
    id: config.id,
    category: 'seasonal',
    tags: config.tags,

    isPlausible(ctx) {
      const p = config.plausibility;

      // Sex check
      if (p.sex && ctx.animal.sex !== p.sex) return false;

      // Season check
      if (p.seasons && !p.seasons.includes(ctx.time.season)) return false;

      // Minimum age check
      if (p.minAge !== undefined && ctx.animal.age < p.minAge) return false;

      // Required flags check
      if (p.requiredFlags) {
        for (const flag of p.requiredFlags) {
          if (!ctx.animal.flags.has(flag)) return false;
        }
      }

      // Excluded flags check
      if (p.excludedFlags) {
        for (const flag of p.excludedFlags) {
          if (ctx.animal.flags.has(flag)) return false;
        }
      }

      return true;
    },

    computeWeight(ctx) {
      const w = config.weight;
      let base = w.base;

      // Terrain multiplier
      if (w.terrainMultipliers && ctx.currentNodeType) {
        base *= w.terrainMultipliers[ctx.currentNodeType] ?? 1;
      }

      // Weather multiplier
      if (w.weatherMultipliers && ctx.currentWeather?.type) {
        base *= w.weatherMultipliers[ctx.currentWeather.type] ?? 1;
      }

      // Custom weight adjustment
      if (w.custom) {
        base = w.custom(ctx, base);
      }

      return base;
    },

    resolve(ctx) {
      const env = buildEnvironment(ctx);
      const narr = config.narrative(ctx);

      // Resolve stat effects
      const statEffects = typeof config.statEffects === 'function'
        ? config.statEffects(ctx)
        : [...config.statEffects];

      // Resolve consequences
      const consequences = typeof config.consequences === 'function'
        ? config.consequences(ctx)
        : [...config.consequences];

      return {
        harmEvents: [],
        statEffects,
        consequences,
        narrativeText: narr.text,
        narrativeContext: buildNarrativeContext({
          eventCategory: 'seasonal',
          eventType: narr.eventType,
          actions: [action(
            narr.actionDetail,
            narr.clinicalDetail,
            narr.intensity,
          )],
          environment: env,
          emotionalTone: narr.emotionalTone as any,
        }),
      };
    },

    getChoices(ctx) {
      if (!config.choices) return [];
      return config.choices(ctx);
    },
  };
}
