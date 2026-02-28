import type { SimulationTrigger, SimulationContext } from '../types';
import type { ReproductionTriggerConfig } from '../data/reproductionConfigs';

/**
 * Create a SimulationTrigger from a ReproductionTriggerConfig.
 *
 * This factory implements the common reproduction trigger pattern:
 * - Plausibility from sex, season, flags, and age
 * - Weight from config-provided computation function
 * - Resolve and choices delegated to config callbacks (each reproduction
 *   trigger has unique resolve/choice logic unlike the more uniform
 *   predator encounters)
 */
export function createReproductionTrigger(config: ReproductionTriggerConfig): SimulationTrigger {
  return {
    id: config.id,
    category: 'reproduction',
    tags: config.tags,

    isPlausible(ctx) {
      const p = config.plausibility;

      // Sex check
      if (ctx.animal.sex !== p.requiredSex) return false;

      // Season check
      if (p.seasons && !p.seasons.includes(ctx.time.season)) return false;

      // Required flags
      if (p.requiredFlags) {
        for (const flag of p.requiredFlags) {
          if (!ctx.animal.flags.has(flag)) return false;
        }
      }

      // Blocking flags
      if (p.blockingFlags) {
        for (const flag of p.blockingFlags) {
          if (ctx.animal.flags.has(flag)) return false;
        }
      }

      // Minimum age
      if (p.minAge !== undefined && ctx.animal.age < p.minAge) return false;

      return true;
    },

    computeWeight(ctx) {
      return config.weight.computeWeight(ctx, config.weight.baseWeight);
    },

    resolve(ctx) {
      return config.resolve(ctx);
    },

    getChoices(ctx) {
      return config.getChoices(ctx);
    },
  };
}
