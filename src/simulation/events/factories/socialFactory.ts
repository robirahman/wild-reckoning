import type { SimulationTrigger } from '../types';
import type { SocialTriggerConfig } from '../data/socialConfigs';
import { buildEnvironment, action, buildNarrativeContext, conspecificEntity } from '../../narrative/contextBuilder';
import { rivalBuckEntity } from '../../narrative/perspective';

/**
 * Create a SimulationTrigger from a SocialTriggerConfig.
 *
 * This factory implements the common social trigger pattern:
 * - Plausibility from sex/season/age/flag rules + custom checks
 * - Weight from base rate + behavior multipliers
 * - Narrative from context-dependent builder
 * - Stat effects and consequences (static or dynamic)
 * - Choices with outcome modification (closures over resolveSocial/resolveFight)
 */
export function createSocialTrigger(config: SocialTriggerConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category,
    tags: config.tags,

    isPlausible(ctx) {
      const p = config.plausibility;

      // Sex check
      if (p.sex && ctx.animal.sex !== p.sex) return false;

      // Season check
      if (p.seasons && !p.seasons.includes(ctx.time.season)) return false;

      // Age checks
      if (p.minAge !== undefined && ctx.animal.age < p.minAge) return false;
      if (p.maxAge !== undefined && ctx.animal.age > p.maxAge) return false;

      // Required flags check
      if (p.requiredFlags) {
        for (const flag of p.requiredFlags) {
          if (!ctx.animal.flags?.has?.(flag)) return false;
        }
      }

      // Blocking flags check
      if (p.blockingFlags) {
        for (const flag of p.blockingFlags) {
          if (ctx.animal.flags?.has?.(flag)) return false;
        }
      }

      // Custom check
      if (p.custom && !p.custom(ctx)) return false;

      return true;
    },

    computeWeight(ctx) {
      const w = config.weight;
      let base = w.base;

      // Terrain multiplier
      if (w.terrainMultipliers && ctx.currentNodeType) {
        base *= w.terrainMultipliers[ctx.currentNodeType] ?? 1;
      }

      // Season multiplier
      if (w.seasonMultipliers) {
        base *= w.seasonMultipliers[ctx.time.season] ?? 1;
      }

      // Behavior factors
      if (w.sociabilityFactor) {
        base *= 0.5 + ctx.behavior.sociability * w.sociabilityFactor;
      }
      if (w.belligerenceFactor) {
        base *= 0.5 + ctx.behavior.belligerence * w.belligerenceFactor;
      }
      if (w.cautionFactor) {
        base *= 0.5 + ctx.behavior.caution * w.cautionFactor;
      }

      // Young age bonus
      if (w.youngAgeThreshold && w.youngAgeMultiplier) {
        if (ctx.animal.age < w.youngAgeThreshold) base *= w.youngAgeMultiplier;
      }

      // Flag multipliers
      if (w.flagMultipliers) {
        for (const [flag, mult] of Object.entries(w.flagMultipliers)) {
          if (ctx.animal.flags?.has?.(flag)) base *= mult;
        }
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

      // Build entities — use conspecificEntity helper for standard entities
      const entities = narr.entities.length > 0
        ? narr.entities.map(e => conspecificEntity(e.perceivedAs, e.actualIdentity, e.primarySense))
        : [];

      // Special case: rival-returns uses rivalBuckEntity
      if (config.id === 'sim-rival-returns') {
        const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'The rival buck';
        entities.length = 0;
        entities.push(rivalBuckEntity(rivalName));
      }

      return {
        harmEvents: [],
        statEffects,
        consequences,
        narrativeText: narr.text,
        narrativeContext: buildNarrativeContext({
          eventCategory: 'social',
          eventType: config.id.replace('sim-', ''),
          entities,
          actions: [action(
            narr.actionDetail,
            narr.clinicalDetail,
            narr.intensity,
          )],
          environment: env,
          emotionalTone: narr.emotionalTone,
        }),
      };
    },

    getChoices(ctx) {
      return config.choices(ctx);
    },
  };
}
