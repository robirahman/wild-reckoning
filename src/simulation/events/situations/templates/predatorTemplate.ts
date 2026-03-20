import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../../types';
import type { HarmEvent } from '../../../harm/types';
import { findSituation, hasSituation } from '../types';
import { findSpeciesProfile } from '../profiles/predatorSpecies';
import type { PredatorSpeciesProfile, PredatorChoiceProfile } from '../profiles/predatorSpecies';
import { getEncounterRate } from '../../../calibration/calibrator';
import { resolveChase } from '../../../interactions/chase';
import { resolveFight } from '../../../interactions/fight';
import { getTerrainProfile } from '../../../interactions/types';
import { buildEnvironment, action, buildNarrativeContext } from '../../../narrative/contextBuilder';
import { pickContextualText, toFragmentContext } from '../../../narrative/templates/shared';
import { composeNarrative } from '../narrativeComposer';
import { StatId } from '../../../../types/stats';

// ══════════════════════════════════════════════════
//  PREDATOR ENCOUNTER TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 4 predator triggers (wolf, coyote, cougar, hunter).
// Situations determine which species, and optional situations (terrain,
// weather, body state, memory) modify weight, resolution, choices, and
// narrative — enabling compound events to emerge without being authored.
//

function getLocomotion(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
}

/**
 * Check species-specific plausibility that goes beyond situation detection.
 */
function checkSpeciesPlausibility(
  profile: PredatorSpeciesProfile,
  ctx: SimulationContext,
): boolean {
  // Population check
  if (profile.populationKey && profile.minPopulationLevel !== undefined) {
    const pop = ctx.ecosystem?.populations[profile.populationKey];
    if (pop && pop.level < profile.minPopulationLevel) return false;
  }

  // Season check
  if (profile.seasons && !profile.seasons.includes(ctx.time.season)) return false;
  if (profile.maxMonthIndex !== undefined && ctx.time.season === 'winter' && ctx.time.monthIndex > profile.maxMonthIndex) return false;

  // Prey vulnerability check
  if (profile.requiresPreyVulnerability) {
    const isYoung = profile.maxPreyAge !== undefined && ctx.animal.age < profile.maxPreyAge;
    const isInjured = ctx.animal.injuries.length > 0;
    const isImpaired = profile.maxPreyLocomotion !== undefined && getLocomotion(ctx) < profile.maxPreyLocomotion;
    if (!isYoung && !isInjured && !isImpaired) return false;
  }

  if (!ctx.regionDef) return false;
  return true;
}

/**
 * Compute encounter weight from calibrated rates + situation modifiers.
 * This replaces the per-config computeWeight in predatorFactory.
 */
function computePredatorWeight(
  profile: PredatorSpeciesProfile,
  ctx: SimulationContext,
  situations: Situation[],
): number {
  if (!ctx.calibratedRates) return profile.fallbackWeight;

  let base = getEncounterRate(ctx.calibratedRates, profile.calibrationCauseId, ctx.time.season) * profile.rateFraction;

  // ── Situation-driven modifiers (replace hardcoded multiplier tables) ──

  // Locomotion impairment
  const locoSit = findSituation(situations, 'body-impairment');
  if (locoSit?.source === 'locomotion') {
    const impairment = (100 - (locoSit.params.capability as number)) / 100;
    base *= 1 + impairment * profile.locomotionImpairmentFactor;
  }

  // Vision impairment
  const visionSit = situations.find(s => s.type === 'body-impairment' && s.source === 'vision');
  if (visionSit) {
    const impairment = (100 - (visionSit.params.capability as number)) / 100;
    base *= 1 + impairment * profile.visionImpairmentFactor;
  }

  // Open wounds (blood scent)
  if (hasSituation(situations, 'body-impairment', 'open-wound')) {
    base *= profile.openWoundMultiplier;
  }

  // Population multiplier
  if (profile.populationKey) {
    const pop = ctx.ecosystem?.populations[profile.populationKey];
    if (pop) base *= 1 + pop.level * 0.3;
  }

  // Prey vulnerability multipliers
  if (profile.requiresPreyVulnerability) {
    if (ctx.animal.injuries.length > 0) base *= 2;
    if (profile.maxPreyAge !== undefined && ctx.animal.age < 18) base *= 2;
    if (getLocomotion(ctx) < 60) base *= 1.5;
  }

  // Time of day
  const timeMult = profile.timeMultipliers[ctx.time.timeOfDay] ?? 1;
  base *= timeMult;

  // Terrain (from profile multipliers)
  if (ctx.currentNodeType) {
    const terrainMult = profile.terrainMultipliers[ctx.currentNodeType] ?? 1;
    base *= terrainMult;
  }

  // Weather
  if (ctx.currentWeather?.type) {
    const weatherMult = profile.weatherMultipliers[ctx.currentWeather.type] ?? 1;
    base *= weatherMult;
  }

  // ── Compound situation modifiers (the new emergent stuff) ──

  // Water terrain: some predators hesitate at water, prey is vulnerable crossing
  if (hasSituation(situations, 'terrain-feature', 'water')) {
    base *= profile.speciesLabel === 'wolf' ? 0.8 : 1.2;
  }

  // Steep terrain: affects ambush predators
  if (hasSituation(situations, 'terrain-feature', 'steep')) {
    base *= profile.speciesLabel === 'cougar' ? 1.3 : 0.9;
  }

  // Exposed terrain: increases all predator encounters
  if (hasSituation(situations, 'terrain-feature', 'exposed')) {
    base *= 1.15;
  }

  // Memory: dangerous node
  if (hasSituation(situations, 'memory-trigger', 'dangerous-node')) {
    base *= 1.2;
  }

  // Memory: recent kill site
  if (hasSituation(situations, 'memory-trigger', 'recent-kill-site') && profile.nodeKillAttraction) {
    base *= 1.2;
  }

  // Memory: persistent threat
  const persistentThreat = situations.find(
    s => s.type === 'memory-trigger' && s.source === `persistent-threat:${profile.threatMapKey}`
  );
  if (persistentThreat && profile.threatMapPersistence) {
    base *= profile.threatMapMultiplier ?? 1.6;
  }

  // NPC nearby and hunting
  const predSit = findSituation(situations, 'predator-nearby');
  if (predSit && (predSit.params.intent as string) === 'hunting') {
    base *= profile.npcHuntingMultiplier;
  }

  // Hunger situation: starving animals are easier prey
  if (hasSituation(situations, 'physiological-state', 'hunger')) {
    const hungerSit = findSituation(situations, 'physiological-state')!;
    const bcs = hungerSit.params.bcs as number;
    base *= 1 + (3 - bcs) * 0.15;
  }

  return base;
}

/**
 * Resolve a string-or-function value.
 */
function resolveStringOrFn(val: string | ((ctx: SimulationContext) => string), ctx: SimulationContext): string {
  return typeof val === 'function' ? val(ctx) : val;
}

/**
 * Build a SimulationChoice from a choice profile + resolution logic.
 */
function buildChoice(
  profile: PredatorSpeciesProfile,
  choiceProfile: PredatorChoiceProfile,
  ctx: SimulationContext,
  situations: Situation[],
): SimulationChoice {
  return {
    id: choiceProfile.id,
    label: resolveStringOrFn(choiceProfile.label, ctx),
    description: resolveStringOrFn(choiceProfile.description, ctx),
    style: resolveStringOrFn(choiceProfile.style, ctx) as 'default' | 'danger',
    narrativeResult: resolveStringOrFn(choiceProfile.narrativeResult, ctx),
    modifyOutcome: (base, innerCtx) =>
      resolveChoiceOutcome(profile, choiceProfile, base, innerCtx, situations),
  };
}

/**
 * Resolve the outcome modification for a player choice.
 */
function resolveChoiceOutcome(
  profile: PredatorSpeciesProfile,
  choice: PredatorChoiceProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
  situations: Situation[],
): SimulationOutcome {
  switch (choice.resolutionType) {
    case 'chase':
      return resolveChaseOutcome(profile, choice, base, ctx, situations);
    case 'water-chase':
      return resolveWaterChaseOutcome(profile, choice, base, ctx, situations);
    case 'fight':
      return resolveFightOutcome(profile, choice, base, ctx);
    case 'freeze':
      return resolveFreezeOutcome(profile, base, ctx);
    case 'concealment':
      return resolveConcealmentOutcome(profile, choice, base, ctx);
    default:
      return base;
  }
}

function resolveChaseOutcome(
  profile: PredatorSpeciesProfile,
  choice: PredatorChoiceProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
  situations: Situation[],
): SimulationOutcome {
  // Cougar special: two-phase dodge + chase
  if (profile.speciesLabel === 'cougar' && choice.id === 'dodge-bolt') {
    return resolveCougarDodgeChase(profile, base, ctx);
  }

  const chaseParams = choice.chaseParamsOverride
    ? { ...profile.chaseParams, ...choice.chaseParamsOverride }
    : { ...profile.chaseParams };

  // ── Compound situation modifiers on chase params ──

  // Steep terrain reduces footing for both parties
  if (hasSituation(situations, 'terrain-feature', 'steep')) {
    chaseParams.predatorSpeed = Math.round(chaseParams.predatorSpeed * 0.9);
  }

  // Deep snow advantages wolves (they run on crust)
  if (hasSituation(situations, 'weather-condition', 'deep-snow') && profile.speciesLabel === 'wolf') {
    chaseParams.predatorEndurance = Math.round(chaseParams.predatorEndurance * 1.15);
  }

  const chase = resolveChase(ctx, chaseParams);
  return {
    ...base,
    harmEvents: chase.harmEvents,
    statEffects: [
      ...base.statEffects,
      ...(choice.statEffects ?? []),
    ],
    consequences: [
      ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
      ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
    ],
  };
}

function resolveWaterChaseOutcome(
  profile: PredatorSpeciesProfile,
  choice: PredatorChoiceProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
  _situations: Situation[],
): SimulationOutcome {
  const isWinter = ctx.time.season === 'winter';
  const chaseParams = { ...profile.chaseParams, ...choice.chaseParamsOverride };
  const waterChase = resolveChase(ctx, chaseParams);

  return {
    ...base,
    harmEvents: waterChase.harmEvents,
    statEffects: [
      ...base.statEffects,
      { stat: StatId.CLI, amount: isWinter ? 12 : 4, duration: 3, label: '+CLI' },
      ...(choice.statEffects ?? []),
    ],
    consequences: [
      ...(waterChase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -waterChase.caloriesCost, source: 'sprint' }] : []),
      ...(waterChase.deathCause ? [{ type: 'death' as const, cause: waterChase.deathCause }] : []),
    ],
  };
}

function resolveFightOutcome(
  profile: PredatorSpeciesProfile,
  choice: PredatorChoiceProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
): SimulationOutcome {
  const fightParams = choice.fightParams ?? profile.fightParams;
  if (!fightParams) return base;

  const fight = resolveFight(ctx, fightParams);

  if (fight.won) {
    return {
      ...base,
      harmEvents: fight.harmToPlayer,
      statEffects: [
        { stat: StatId.TRA, amount: -2, label: '-TRA' },
        { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ...(choice.statEffects ?? []).filter(e => e.stat === StatId.WIS || e.stat === StatId.ADV),
      ],
      consequences: [],
    };
  }

  return {
    ...base,
    harmEvents: fight.harmToPlayer,
    statEffects: [
      ...base.statEffects,
      ...(choice.statEffects ?? []),
    ],
    consequences: [
      ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'fight' }] : []),
      ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
    ],
  };
}

function resolveFreezeOutcome(
  profile: PredatorSpeciesProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
): SimulationOutcome {
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);
  const detectionChance = 0.55 - terrain.coverDensity * 0.25;
  const spotted = ctx.rng.chance(detectionChance);

  if (spotted) {
    const assaultHarm: HarmEvent = {
      id: `${profile.speciesLabel}-pack-assault-${ctx.time.turn}`,
      sourceLabel: `${profile.speciesLabel} pack assault`,
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
        ? [{ type: 'death' as const, cause: `Killed by ${profile.speciesLabel}s` }]
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
  profile: PredatorSpeciesProfile,
  choice: PredatorChoiceProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
): SimulationOutcome {
  const locomotion = getLocomotion(ctx);
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

  const bulletHarm: HarmEvent = {
    id: `bullet-${ctx.time.turn}`,
    sourceLabel: profile.chaseParams.strikeLabel,
    magnitude: profile.chaseParams.strikeMagnitudeRange[0],
    targetZone: profile.chaseParams.strikeTargetZone,
    spread: 0,
    harmType: profile.chaseParams.strikeHarmType,
  };

  if (choice.id === 'flee-deep-cover') {
    const hitChance = Math.max(0.02, 0.08 - terrain.coverDensity * 0.04 + (100 - locomotion) * 0.001);
    const hit = ctx.rng.chance(hitChance);
    return {
      ...base,
      harmEvents: hit ? [bulletHarm] : [],
      statEffects: [...(choice.statEffects ?? [])],
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

function resolveCougarDodgeChase(
  profile: PredatorSpeciesProfile,
  base: SimulationOutcome,
  ctx: SimulationContext,
): SimulationOutcome {
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
      ...profile.chaseParams,
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
  return {
    ...base,
    harmEvents: [neckBite],
    statEffects: [
      { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
    ],
    consequences: ctx.rng.chance(0.35)
      ? [{ type: 'death' as const, cause: 'Killed by cougar' }]
      : [],
  };
}

// ══════════════════════════════════════════════════
//  TEMPLATE DEFINITION
// ══════════════════════════════════════════════════

export const predatorEncounterTemplate: InteractionTemplate = {
  id: 'predator-encounter',
  category: 'predator',
  tags: ['predator', 'danger'],

  requiredSituations: ['predator-nearby'],
  optionalSituations: [
    'terrain-feature',
    'weather-condition',
    'body-impairment',
    'physiological-state',
    'memory-trigger',
    'seasonal-phase',
  ],

  extraPlausibility(ctx, situations) {
    const predSit = findSituation(situations, 'predator-nearby');
    if (!predSit) return false;

    const profile = findSpeciesProfile(predSit.params.speciesLabel as string);
    if (!profile) return false;

    return checkSpeciesPlausibility(profile, ctx);
  },

  computeWeight(ctx, situations) {
    const predSit = findSituation(situations, 'predator-nearby');
    if (!predSit) return 0;

    const profile = findSpeciesProfile(predSit.params.speciesLabel as string);
    if (!profile) return 0;

    return computePredatorWeight(profile, ctx, situations);
  },

  resolve(ctx, situations) {
    const predSit = findSituation(situations, 'predator-nearby')!;
    const profile = findSpeciesProfile(predSit.params.speciesLabel as string)!;

    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env, isRecurring(profile, ctx));

    // Select narrative from the profile's encounter narrative pool
    const baseNarrative = pickContextualText(profile.encounterNarratives, fragmentCtx, ctx.rng);

    // Compose with situation hooks (atmosphere, complications)
    const composedNarrative = composeNarrative(ctx, situations, baseNarrative);

    const isRec = isRecurring(profile, ctx);
    const statEffects = isRec && profile.recurringStatEffects
      ? profile.recurringStatEffects
      : profile.encounterStatEffects;

    const clinicalDetail = isRec ? profile.recurringClinicalDetail : profile.clinicalDetail;

    return {
      harmEvents: [],
      statEffects: [...statEffects],
      consequences: [],
      narrativeText: composedNarrative,
      footnote: `(Locomotion: ${getLocomotion(ctx)}%)`,
      extraTags: profile.tags.filter(t => t !== 'predator' && t !== 'danger'),
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: profile.narrativeEventType,
        entities: [profile.entityBuilder(ctx)],
        actions: [action(composedNarrative, clinicalDetail, 'high')],
        environment: env,
        emotionalTone: profile.emotionalTone,
      }),
    };
  },

  getChoices(ctx, situations) {
    const predSit = findSituation(situations, 'predator-nearby')!;
    const profile = findSpeciesProfile(predSit.params.speciesLabel as string)!;

    const choices: SimulationChoice[] = [];

    for (const choiceProfile of profile.choiceTemplates) {
      // Check static availability
      if (choiceProfile.available && !choiceProfile.available(ctx)) {
        // But: water choice becomes available when terrain-feature(water) is present
        // even if the static check fails — this is compound event emergence!
        if (choiceProfile.id === 'water' && hasSituation(situations, 'terrain-feature', 'water')) {
          // Allow the water choice
        } else {
          continue;
        }
      }

      choices.push(buildChoice(profile, choiceProfile, ctx, situations));
    }

    // ── Situation-driven additional choices ──

    // If locomotion is critically low and not already handled, add a "collapse" option
    const locoSit = situations.find(s => s.type === 'body-impairment' && s.source === 'locomotion');
    if (locoSit && (locoSit.params.capability as number) < 20) {
      // Remove flee-type choices that are impossible
      return choices.filter(c => c.id !== 'flee' && c.id !== 'bolt' && c.id !== 'dodge-bolt');
    }

    return choices;
  },
};

/** Check if this is a recurring encounter (same predator seen before) */
function isRecurring(profile: PredatorSpeciesProfile, ctx: SimulationContext): boolean {
  const threat = ctx.worldMemory?.threatMap[profile.threatMapKey];
  return threat !== undefined && threat.recentEncounters >= 1;
}
