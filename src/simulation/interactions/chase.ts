import type { SimulationContext } from '../events/types';
import type { HarmEvent } from '../harm/types';
import type { ChaseParams, ChaseResult } from './types';
import { getTerrainProfile } from './types';

/**
 * Resolve a chase interaction between a predator and the player animal.
 *
 * The chase resolver is a pure function that encapsulates pursuit dynamics.
 * Instead of each predator trigger computing its own escape probability,
 * all chases flow through this function, which considers:
 * - prey locomotion and vision capabilities
 * - predator speed, endurance, and pack coordination
 * - terrain (footing, cover, water, elevation)
 * - weather (snow/ice affects differential speed)
 * - body condition (exhausted animals run slower)
 *
 * The resolver returns whether the prey escaped, any harm sustained during
 * the chase, caloric cost, and secondary hazards (falls, drowning).
 */
export function resolveChase(ctx: SimulationContext, params: ChaseParams): ChaseResult {
  const rng = ctx.rng;
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

  // ── Prey effective speed ──
  // Base: 100 (full capability), modified by locomotion impairment and terrain
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
  const vision = ctx.animal.bodyState?.capabilities['vision'] ?? 100;

  // Terrain affects the prey's effective speed
  const preyEffectiveSpeed = locomotion * terrain.footingMultiplier;

  // Body condition affects endurance — a malnourished deer tires faster
  const bodyCondition = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
  const preyEndurance = 60 + bodyCondition * 8; // 68 (BCS 1) to 100 (BCS 5)

  // ── Predator effective speed ──
  // Predators are also affected by terrain, but differentially:
  // - wolves in deep snow run ON the crust (less penalty than deer)
  // - cats are ambush predators, poor at sustained chase in open terrain
  const predatorTerrainMult = computePredatorTerrainMultiplier(params, terrain, ctx.time.season);
  const predatorEffectiveSpeed = params.predatorSpeed * predatorTerrainMult;

  // ── Detection advantage ──
  // Good vision means earlier detection, which means more distance at chase start
  const detectionBonus = (vision - 50) * 0.003; // -0.15 to +0.15

  // ── Cover escape ──
  // In dense cover, a chase is shorter and the prey can break sightline
  const coverEscapeBonus = terrain.coverDensity * 0.2; // 0 to 0.16

  // ── Escape probability ──
  // Core formula: based on speed differential, modified by endurance, detection, cover
  const speedRatio = preyEffectiveSpeed / Math.max(1, predatorEffectiveSpeed + params.packBonus);
  const baseEscapeChance = 0.3 + (speedRatio - 1) * 0.5; // 0.3 at equal speed, higher if faster

  const escapeChance = Math.min(0.95, Math.max(0.02,
    baseEscapeChance
    + detectionBonus
    + coverEscapeBonus
    + (preyEndurance - 70) * 0.003 // endurance bonus
    - (params.predatorEndurance - 70) * 0.002 // predator endurance penalty
  ));

  const escaped = rng.chance(escapeChance);

  // ── Harm during chase ──
  const harmEvents: HarmEvent[] = [];

  if (!escaped) {
    // Predator catches up and strikes
    const magnitude = rng.int(params.strikeMagnitudeRange[0], params.strikeMagnitudeRange[1]);
    // Impaired locomotion means harder hit (you're slower, predator has better angle)
    const locoImpairmentBonus = Math.round((100 - locomotion) * 0.15);

    harmEvents.push({
      id: `chase-strike-${ctx.time.turn}`,
      sourceLabel: params.strikeLabel,
      magnitude: Math.min(100, magnitude + locoImpairmentBonus),
      targetZone: params.strikeTargetZone,
      spread: 0.2,
      harmType: params.strikeHarmType,
    });
  } else if (!escaped || rng.chance(0.15)) {
    // Even in a successful escape, there's a chance of a grazing hit
    if (rng.chance(0.25 - coverEscapeBonus)) {
      const grazeMagnitude = rng.int(
        Math.round(params.strikeMagnitudeRange[0] * 0.4),
        Math.round(params.strikeMagnitudeRange[1] * 0.5),
      );
      harmEvents.push({
        id: `chase-graze-${ctx.time.turn}`,
        sourceLabel: `${params.strikeLabel} (grazing)`,
        magnitude: grazeMagnitude,
        targetZone: params.strikeTargetZone,
        spread: 0.3,
        harmType: params.strikeHarmType,
      });
    }
  }

  // ── Secondary hazards from terrain ──
  let secondaryHazard: ChaseResult['secondaryHazard'] | undefined;

  // Mountain/steep terrain: risk of falling during sprint
  if (terrain.isSteep && rng.chance(0.08 + (100 - locomotion) * 0.002)) {
    secondaryHazard = 'fall';
    harmEvents.push({
      id: `chase-fall-${ctx.time.turn}`,
      sourceLabel: 'fall during chase',
      magnitude: rng.int(30, 60),
      targetZone: rng.pick(['front-legs', 'hind-legs', 'torso']),
      spread: 0.4,
      harmType: 'blunt',
    });
  }

  // Water terrain: risk of drowning or ice breaking
  if (terrain.hasWater) {
    const isWinter = ctx.time.season === 'winter';
    if (isWinter && rng.chance(0.12)) {
      secondaryHazard = 'ice-break';
      // Ice breaking is often fatal
    } else if (!isWinter && rng.chance(0.04 + (100 - locomotion) * 0.001)) {
      secondaryHazard = 'drowning';
    }
  }

  // ── Death determination ──
  // Death comes from: failed escape + bad luck, or secondary hazards
  let deathCause: string | undefined;

  if (!escaped) {
    // Failed escape: pack predators may finish the kill
    const killChance = params.packBonus > 0
      ? 0.25 + params.packBonus * 0.01 // pack hunting is more lethal
      : 0.15; // solo predator may not finish the job
    if (rng.chance(killChance)) {
      deathCause = `Killed by ${params.strikeLabel.replace(/ during chase| bite| strike| attack/g, '')}`;
    }
  }

  if (secondaryHazard === 'ice-break') {
    deathCause = 'Drowned after falling through ice during chase';
  } else if (secondaryHazard === 'drowning') {
    deathCause = 'Drowned during river crossing while fleeing';
  }

  // ── Caloric cost ──
  // Sprinting is expensive: ~10-20 kcal-units per chase
  const chaseDuration = escaped ? 1.0 : 1.5; // failed escapes are longer
  const caloriesCost = Math.round(15 * chaseDuration * (1 + (100 - locomotion) * 0.005));

  return {
    escaped,
    harmEvents,
    caloriesCost,
    secondaryHazard,
    deathCause,
  };
}

/**
 * Predators have different terrain interactions than prey.
 * Wolves in snow are faster relative to deer (run on crust).
 * Cats in forest are faster (ambush-adapted). Cats on plains are slower (no stalking cover).
 * Pack predators in open terrain can coordinate better.
 */
function computePredatorTerrainMultiplier(
  params: ChaseParams,
  terrain: ReturnType<typeof getTerrainProfile>,
  season: string,
): number {
  let mult = terrain.footingMultiplier;

  // Wolves in snow: they run on the crust while deer punch through
  // This partially REVERSES the footing penalty that terrain applies to prey
  if (params.packBonus > 0 && season === 'winter') {
    mult = Math.min(1.0, mult * 1.35); // recover most of the snow penalty
  }

  // Solo ambush predators (cats): better in cover, worse in open
  if (params.packBonus === 0 && params.predatorEndurance < 50) {
    mult *= 0.8 + terrain.coverDensity * 0.3; // 0.8 in open, 1.04 in dense forest
  }

  return mult;
}
