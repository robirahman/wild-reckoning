import type { SimulationTrigger, SimulationContext, SimulationOutcome } from '../types';
import type { HarmEvent } from '../../harm/types';
import type { EnvironmentalHazardConfig, HarmTemplate } from '../data/environmentalConfigs';
import { getEncounterRate } from '../../calibration/calibrator';
import { buildEnvironment, action, buildNarrativeContext, terrainEntity, weatherEntity } from '../../narrative/contextBuilder';
import { vehicleEntity } from '../../narrative/perspective';

// ── Helpers ──

function getLocomotion(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
}

function resolveHarmTemplate(
  template: HarmTemplate | ((ctx: SimulationContext) => HarmTemplate),
  ctx: SimulationContext,
): HarmTemplate {
  return typeof template === 'function' ? template(ctx) : template;
}

function buildHarmEvent(template: HarmTemplate, ctx: SimulationContext): HarmEvent {
  const sourceLabel = typeof template.sourceLabel === 'function'
    ? template.sourceLabel(ctx)
    : template.sourceLabel;
  const [min, max] = typeof template.magnitudeRange === 'function'
    ? template.magnitudeRange(ctx)
    : template.magnitudeRange;

  return {
    id: `${sourceLabel.replace(/\s+/g, '-')}-${ctx.time.turn}`,
    sourceLabel,
    magnitude: ctx.rng.int(min, max),
    targetZone: ctx.rng.pick(template.targetZones),
    spread: template.spread,
    harmType: template.harmType,
  };
}

/**
 * Create a SimulationTrigger from an EnvironmentalHazardConfig.
 *
 * This factory implements the common environmental hazard pattern:
 * - Plausibility from season/weather/terrain/flag rules
 * - Weight from base rate + context multipliers
 * - Harm from template (zone, magnitude range, harm type)
 * - Narrative from context-dependent builder
 * - Choices with outcome modification
 */
export function createEnvironmentalTrigger(config: EnvironmentalHazardConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category as any,
    tags: config.tags,
    calibrationCauseId: config.calibrationCauseId,

    isPlausible(ctx) {
      const p = config.plausibility;

      // Season check
      if (p.seasons && !p.seasons.includes(ctx.time.season)) return false;

      // Weather check
      if (p.weatherTypes && (!ctx.currentWeather || !p.weatherTypes.includes(ctx.currentWeather.type))) return false;

      // Node type check
      if (p.nodeTypes && (!ctx.currentNodeType || !p.nodeTypes.includes(ctx.currentNodeType))) return false;

      // Required flags check
      if (p.requiredFlags) {
        for (const flag of p.requiredFlags) {
          if (!ctx.animal.flags.has(flag)) return false;
        }
      }

      // Custom check
      if (p.custom && !p.custom(ctx)) return false;

      return true;
    },

    computeWeight(ctx) {
      const w = config.weight;

      // Start from calibrated rate or base
      let base: number;
      if (w.calibrationCauseId && ctx.calibratedRates) {
        base = getEncounterRate(ctx.calibratedRates, w.calibrationCauseId, ctx.time.season);
      } else {
        base = w.base;
      }

      // Terrain multiplier
      if (w.terrainMultipliers && ctx.currentNodeType) {
        base *= w.terrainMultipliers[ctx.currentNodeType] ?? 1;
      }

      // Weather multiplier
      if (w.weatherMultipliers && ctx.currentWeather?.type) {
        base *= w.weatherMultipliers[ctx.currentWeather.type] ?? 1;
      }

      // Season multiplier
      if (w.seasonMultipliers) {
        base *= w.seasonMultipliers[ctx.time.season] ?? 1;
      }

      // Time of day multiplier
      if (w.timeMultipliers) {
        base *= w.timeMultipliers[ctx.time.timeOfDay] ?? 1;
      }

      // Locomotion impairment
      if (w.locomotionImpairmentFactor) {
        const impairment = (100 - getLocomotion(ctx)) / 100;
        base *= 1 + impairment * w.locomotionImpairmentFactor;
      }

      // Exploration behavior
      if (w.explorationBehaviorFactor) {
        base *= 0.5 + ctx.behavior.exploration * w.explorationBehaviorFactor;
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

      // Build harm events from template
      const harmEvents: HarmEvent[] = [];
      if (config.harmTemplate) {
        const template = resolveHarmTemplate(config.harmTemplate, ctx);
        harmEvents.push(buildHarmEvent(template, ctx));
      }

      // Resolve stat effects
      const statEffects = typeof config.statEffects === 'function'
        ? config.statEffects(ctx)
        : [...config.statEffects];

      // Resolve consequences
      const consequences = config.consequences
        ? (typeof config.consequences === 'function' ? config.consequences(ctx) : [...config.consequences])
        : [];

      // Build entity from narrative context clues
      const entities = narr.entity ? [narr.entity] : [];

      return {
        harmEvents,
        statEffects,
        consequences,
        narrativeText: narr.text,
        narrativeContext: buildNarrativeContext({
          eventCategory: config.category as any,
          eventType: config.id.replace('sim-', ''),
          entities,
          actions: [action(
            narr.actionDetail,
            narr.clinicalDetail,
            narr.intensity as 'low' | 'medium' | 'high' | 'extreme',
          )],
          environment: env,
          emotionalTone: narr.emotionalTone as any,
          sourceHarmEvents: harmEvents.length > 0 ? harmEvents : undefined,
        }),
      };
    },

    getChoices(ctx) {
      if (!config.choices) return [];
      return config.choices(ctx);
    },
  };
}
