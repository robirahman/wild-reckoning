import type { SimulationTrigger, SimulationContext, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import type { PredatorEncounterConfig, PredatorNarrativeVariant } from '../data/predatorConfigs';
import { StatId } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';
import { resolveChase } from '../../interactions/chase';
import { resolveFight } from '../../interactions/fight';
import { getTerrainProfile } from '../../interactions/types';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Helpers ──

function getLocomotion(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
}

function getVision(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['vision'] ?? 100;
}

function hasNearbyHuntingNPC(ctx: SimulationContext, speciesLabel: string): boolean {
  if (!ctx.npcs || !ctx.npcBehaviorStates || !ctx.currentNodeId) return false;
  const currentNode = ctx.currentNodeId;
  for (const npc of ctx.npcs) {
    if (!npc.alive || npc.type !== 'predator') continue;
    if (!npc.speciesLabel.toLowerCase().includes(speciesLabel)) continue;
    const behavior = ctx.npcBehaviorStates[npc.id];
    if (!behavior || behavior.intent !== 'hunting') continue;
    if (npc.currentNodeId === currentNode) return true;
  }
  return false;
}

function hasOpenWound(ctx: SimulationContext): boolean {
  return ctx.animal.bodyState?.conditions.some(
    c => (c.type === 'laceration' || c.type === 'puncture') && c.infectionLevel < 30,
  ) ?? false;
}

function resolveStringOrFn(val: string | ((ctx: SimulationContext) => string), ctx: SimulationContext): string {
  return typeof val === 'function' ? val(ctx) : val;
}

/** Select the best-matching narrative variant for the current context */
function selectVariant(
  variants: PredatorNarrativeVariant[],
  ctx: SimulationContext,
): PredatorNarrativeVariant {
  const isWinterSnow = ctx.time.season === 'winter' &&
    (ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard');
  const isNightDusk = ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk';

  for (const v of variants) {
    if (v.condition === 'winter-snow' && isWinterSnow) return v;
    if (v.condition === 'night-dusk' && isNightDusk) return v;
  }
  // Return the 'default' variant, or the last one
  return variants.find(v => v.condition === 'default') ?? variants[variants.length - 1];
}

/**
 * Create a SimulationTrigger from a PredatorEncounterConfig.
 *
 * This factory implements the common predator encounter pattern:
 * - Plausibility from ecosystem population + prey state
 * - Weight from calibrated rates + context multipliers + world memory
 * - Narrative from contextual variant selection
 * - Choices resolved through chase/fight/concealment resolvers
 */
export function createPredatorTrigger(config: PredatorEncounterConfig): SimulationTrigger {
  return {
    id: config.id,
    category: 'predator',
    tags: config.tags,
    calibrationCauseId: config.calibrationCauseId,

    isPlausible(ctx) {
      const p = config.plausibility;

      // Population check
      if (p.populationKey && p.minPopulationLevel !== undefined) {
        const pop = ctx.ecosystem?.populations[p.populationKey];
        if (pop && pop.level < p.minPopulationLevel) return false;
      }

      // Season check
      if (p.seasons && !p.seasons.includes(ctx.time.season)) return false;
      if (p.maxMonthIndex !== undefined && ctx.time.season === 'winter' && ctx.time.monthIndex > p.maxMonthIndex) return false;

      // Prey vulnerability check
      if (p.requiresPreyVulnerability) {
        const isYoung = p.maxPreyAge !== undefined && ctx.animal.age < p.maxPreyAge;
        const isInjured = ctx.animal.injuries.length > 0;
        const isImpaired = p.maxPreyLocomotion !== undefined && getLocomotion(ctx) < p.maxPreyLocomotion;
        if (!isYoung && !isInjured && !isImpaired) return false;
      }

      if (!ctx.regionDef) return false;
      return true;
    },

    computeWeight(ctx) {
      if (!ctx.calibratedRates) return config.fallbackWeight;
      let base = getEncounterRate(ctx.calibratedRates, config.calibrationCauseId, ctx.time.season) * config.rateFraction;

      const wm = config.weightModifiers;

      // Impairment factors
      const locoImpairment = (100 - getLocomotion(ctx)) / 100;
      const visionImpairment = (100 - getVision(ctx)) / 100;
      base *= 1 + locoImpairment * wm.locomotionImpairmentFactor + visionImpairment * wm.visionImpairmentFactor;

      // Population multiplier
      if (config.plausibility.populationKey) {
        const pop = ctx.ecosystem?.populations[config.plausibility.populationKey];
        if (pop) base *= 1 + pop.level * 0.3;
      }

      // Vulnerability-based multipliers (for coyote-type predators)
      if (config.plausibility.requiresPreyVulnerability) {
        if (ctx.animal.injuries.length > 0) base *= 2;
        if (config.plausibility.maxPreyAge !== undefined && ctx.animal.age < 18) base *= 2;
        if (getLocomotion(ctx) < 60) base *= 1.5;
      }

      // Time of day
      const timeMult = wm.timeMultipliers[ctx.time.timeOfDay] ?? 1;
      base *= timeMult;

      // Terrain
      if (ctx.currentNodeType) {
        const terrainMult = wm.terrainMultipliers[ctx.currentNodeType] ?? 1;
        base *= terrainMult;
      }

      // Weather
      if (ctx.currentWeather?.type) {
        const weatherMult = wm.weatherMultipliers[ctx.currentWeather.type] ?? 1;
        base *= weatherMult;
      }

      // Open wounds (blood scent)
      if (hasOpenWound(ctx)) base *= wm.openWoundMultiplier;

      // World memory: threat persistence
      if (wm.threatMapPersistence) {
        const threat = ctx.worldMemory?.threatMap[config.threatMapKey];
        if (threat && threat.recentEncounters >= 2) {
          const turnsSince = ctx.time.turn - threat.lastEncounterTurn;
          if (turnsSince < (wm.threatMapWindow ?? 4)) base *= (wm.threatMapMultiplier ?? 1.6);
        }
      }

      // Node with recent kills
      if (wm.nodeKillAttraction) {
        const nodeMemory = ctx.currentNodeId ? ctx.worldMemory?.nodeMemory[ctx.currentNodeId] : undefined;
        if (nodeMemory && nodeMemory.killCount > 0 && (ctx.time.turn - nodeMemory.lastKillTurn) < 6) {
          base *= 1.2;
        }
      }

      // Hunter-specific: predictable movement patterns
      if (config.id === 'sim-hunting-season') {
        const nodeMemory = ctx.currentNodeId ? ctx.worldMemory?.nodeMemory[ctx.currentNodeId] : undefined;
        if (nodeMemory && nodeMemory.turnsOccupied > 5) base *= 1.3;
      }

      // NPC nearby and hunting
      if (hasNearbyHuntingNPC(ctx, config.speciesLabel)) {
        base *= wm.npcHuntingMultiplier;
      }

      return base;
    },

    resolve(ctx) {
      const locomotion = getLocomotion(ctx);
      const env = buildEnvironment(ctx);

      // Select narrative variant
      const wolfThreat = ctx.worldMemory?.threatMap[config.threatMapKey];
      const isRecurring = wolfThreat !== undefined && wolfThreat.recentEncounters >= 1;
      const variant = selectVariant(config.narrativeVariants, ctx);

      const narrative = isRecurring ? variant.recurringNarrative : variant.narrative;
      const actionDetail = isRecurring ? variant.recurringActionDetail : variant.actionDetail;
      let clinicalDetail = isRecurring ? variant.recurringClinicalDetail : variant.clinicalDetail;

      // Append encounter count to clinical detail for recurring encounters
      if (isRecurring && wolfThreat) {
        clinicalDetail = clinicalDetail.replace(
          /encounter/,
          `encounter (#${wolfThreat.recentEncounters + 1})`,
        );
      }

      const statEffects = isRecurring && config.recurringStatEffects
        ? config.recurringStatEffects
        : config.encounterStatEffects;

      return {
        harmEvents: [],
        statEffects: [...statEffects],
        consequences: [],
        narrativeText: narrative,
        footnote: `(Locomotion: ${locomotion}%)`,
        narrativeContext: buildNarrativeContext({
          eventCategory: 'predator',
          eventType: config.narrativeEventType,
          entities: [config.entityBuilder(ctx)],
          actions: [action(actionDetail, clinicalDetail, 'high')],
          environment: env,
          emotionalTone: config.emotionalTone,
        }),
      };
    },

    getChoices(ctx) {
      const choices: SimulationChoice[] = [];

      for (const template of config.choiceTemplates) {
        // Check availability
        if (template.available && !template.available(ctx)) continue;

        const choice: SimulationChoice = {
          id: template.id,
          label: resolveStringOrFn(template.label, ctx),
          description: resolveStringOrFn(template.description, ctx),
          style: resolveStringOrFn(template.style, ctx),
          narrativeResult: resolveStringOrFn(template.narrativeResult, ctx),
          modifyOutcome: buildOutcomeModifier(config, template, ctx),
        };
        choices.push(choice);
      }

      return choices;
    },
  };
}

// ── Outcome Modifier Builders ──

function buildOutcomeModifier(
  config: PredatorEncounterConfig,
  template: import('../data/predatorConfigs').PredatorChoiceTemplate,
  _outerCtx: SimulationContext,
): SimulationChoice['modifyOutcome'] {
  return (base, innerCtx) => {
    switch (template.resolutionType) {
      case 'chase':
        return resolveChaseOutcome(config, template, base, innerCtx);
      case 'water-chase':
        return resolveWaterChaseOutcome(config, template, base, innerCtx);
      case 'fight':
        return resolveFightOutcome(config, template, base, innerCtx);
      case 'freeze':
        return resolveFreezeOutcome(config, base, innerCtx);
      case 'concealment':
        return resolveConcealmentOutcome(config, template, base, innerCtx);
      default:
        return base;
    }
  };
}

function resolveChaseOutcome(
  config: PredatorEncounterConfig,
  template: import('../data/predatorConfigs').PredatorChoiceTemplate,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  // For cougar: two-phase dodge + chase
  if (config.id === 'sim-cougar-ambush' && template.id === 'dodge-bolt') {
    return resolveCougarDodgeChase(config, base, ctx);
  }

  const chaseParams = template.chaseParamsOverride
    ? { ...config.chaseParams, ...template.chaseParamsOverride }
    : config.chaseParams;

  const chase = resolveChase(ctx, chaseParams);
  return {
    ...base,
    harmEvents: chase.harmEvents,
    statEffects: [
      ...base.statEffects,
      ...(template.statEffects ?? []),
    ],
    consequences: [
      ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
      ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
    ],
  };
}

function resolveWaterChaseOutcome(
  config: PredatorEncounterConfig,
  template: import('../data/predatorConfigs').PredatorChoiceTemplate,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  const isWinter = ctx.time.season === 'winter';
  const chaseParams = { ...config.chaseParams, ...template.chaseParamsOverride };
  const waterChase = resolveChase(ctx, chaseParams);

  return {
    ...base,
    harmEvents: waterChase.harmEvents,
    statEffects: [
      ...base.statEffects,
      { stat: StatId.CLI, amount: isWinter ? 12 : 4, duration: 3, label: '+CLI' },
      ...(template.statEffects ?? []),
    ],
    consequences: [
      ...(waterChase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -waterChase.caloriesCost, source: 'sprint' }] : []),
      ...(waterChase.deathCause ? [{ type: 'death' as const, cause: waterChase.deathCause }] : []),
    ],
  };
}

function resolveFightOutcome(
  config: PredatorEncounterConfig,
  template: import('../data/predatorConfigs').PredatorChoiceTemplate,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  const fightParams = template.fightParams ?? config.fightParams;
  if (!fightParams) return base;

  const fight = resolveFight(ctx, fightParams);

  if (fight.won) {
    return {
      ...base,
      harmEvents: fight.harmToPlayer, // might be empty if intimidation win
      statEffects: [
        { stat: StatId.TRA, amount: -2, label: '-TRA' },
        { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ...(template.statEffects ?? []).filter(e => e.stat === StatId.WIS || e.stat === StatId.ADV),
      ],
      consequences: [],
    };
  }

  return {
    ...base,
    harmEvents: fight.harmToPlayer,
    statEffects: [
      ...base.statEffects,
      ...(template.statEffects ?? []),
    ],
    consequences: [
      ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'fight' }] : []),
      ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
    ],
  };
}

function resolveFreezeOutcome(
  config: PredatorEncounterConfig,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);
  const detectionChance = 0.55 - terrain.coverDensity * 0.25;
  const spotted = ctx.rng.chance(detectionChance);

  if (spotted) {
    const assaultHarm: HarmEvent = {
      id: `${config.speciesLabel}-pack-assault-${ctx.time.turn}`,
      sourceLabel: `${config.speciesLabel} pack assault`,
      magnitude: ctx.rng.int(55, 80),
      targetZone: 'random',
      spread: 0.5,
      harmType: 'sharp',
    };
    return {
      ...base,
      harmEvents: [assaultHarm],
      statEffects: [
        ...base.statEffects,
        { stat: StatId.TRA, amount: 15, duration: 6, label: '+TRA' },
      ],
      consequences: ctx.rng.chance(0.20)
        ? [{ type: 'death' as const, cause: `Killed by ${config.speciesLabel}s` }]
        : [],
    };
  }

  return {
    ...base,
    harmEvents: [],
    statEffects: [
      ...base.statEffects,
      { stat: StatId.TRA, amount: 5, duration: 6, label: '+TRA' },
    ],
    consequences: [],
  };
}

function resolveConcealmentOutcome(
  config: PredatorEncounterConfig,
  template: import('../data/predatorConfigs').PredatorChoiceTemplate,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  const locomotion = getLocomotion(ctx);
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

  // Create bullet harm event from config
  const bulletHarm: HarmEvent = {
    id: `bullet-${ctx.time.turn}`,
    sourceLabel: config.chaseParams.strikeLabel,
    magnitude: config.chaseParams.strikeMagnitudeRange[0],
    targetZone: config.chaseParams.strikeTargetZone,
    spread: 0,
    harmType: config.chaseParams.strikeHarmType,
  };

  if (template.id === 'flee-deep-cover') {
    const hitChance = Math.max(0.02, 0.08 - terrain.coverDensity * 0.04 + (100 - locomotion) * 0.001);
    const hit = ctx.rng.chance(hitChance);
    return {
      ...base,
      harmEvents: hit ? [bulletHarm] : [],
      statEffects: [
        ...(template.statEffects ?? []),
      ],
      consequences: [
        { type: 'add_calories' as const, amount: -10, source: 'sprint' },
        ...(hit ? [{ type: 'death' as const, cause: 'Shot by hunter' }] : []),
      ],
    };
  }

  // hold-position
  const spotted = ctx.rng.chance(Math.max(0.03, 0.12 - terrain.coverDensity * 0.08));
  return {
    ...base,
    harmEvents: spotted ? [bulletHarm] : [],
    statEffects: [
      { stat: StatId.TRA, amount: spotted ? 15 : 5, duration: 4, label: '+TRA' },
    ],
    consequences: spotted ? [{ type: 'death' as const, cause: 'Shot by hunter' }] : [],
  };
}

/** Cougar-specific dodge+chase two-phase resolution */
function resolveCougarDodgeChase(
  config: PredatorEncounterConfig,
  base: import('../types').SimulationOutcome,
  ctx: SimulationContext,
) {
  const locomotion = getLocomotion(ctx);
  const dodgeBonus = (locomotion - 50) * 0.004;
  const dodged = ctx.rng.chance(0.4 + dodgeBonus);

  if (dodged) {
    const shoulderSlash: HarmEvent = {
      id: `cougar-claw-${ctx.time.turn}`,
      sourceLabel: 'cougar claw rake',
      magnitude: ctx.rng.int(25, 45),
      targetZone: 'torso',
      spread: 0.2,
      harmType: 'sharp',
    };
    const chase = resolveChase(ctx, {
      ...config.chaseParams,
      strikeMagnitudeRange: [30, 50],
    });
    return {
      ...base,
      harmEvents: [shoulderSlash, ...chase.harmEvents],
      statEffects: [
        { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
      ],
      consequences: [
        ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
        ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
      ],
    };
  }

  // Failed dodge: full neck bite
  const neckBite: HarmEvent = {
    id: `cougar-neck-bite-${ctx.time.turn}`,
    sourceLabel: 'cougar bite to neck',
    magnitude: ctx.rng.int(60, 90),
    targetZone: 'neck',
    spread: 0,
    harmType: 'sharp',
  };
  const killChance = 0.35;
  return {
    ...base,
    harmEvents: [neckBite],
    statEffects: [
      { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
    ],
    consequences: ctx.rng.chance(killChance)
      ? [{ type: 'death' as const, cause: 'Killed by cougar' }]
      : [],
  };
}
