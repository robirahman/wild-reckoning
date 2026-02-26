import type { SimulationContext } from '../events/types';
import type { HarmEvent } from '../harm/types';
import type { ForageParams, ForageResult } from './types';
import { getTerrainProfile } from './types';

/**
 * Resolve a foraging interaction.
 *
 * The forage resolver encapsulates food acquisition dynamics. Instead of each
 * foraging trigger computing its own calorie gains and risk outcomes, all
 * foraging flows through this function, which considers:
 * - digestive capability (gut injury → reduced extraction)
 * - locomotion (mobility to reach food)
 * - body condition (desperation increases risky behavior tolerance)
 * - terrain cover (affects predation exposure while feeding)
 * - toxicity risk (varies by food type and animal experience)
 * - human proximity (detection risk near agriculture/orchards)
 */
export function resolveForage(ctx: SimulationContext, params: ForageParams): ForageResult {
  const rng = ctx.rng;
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

  // ── Digestive efficiency ──
  // Gut capability determines how much of the food's calories are extracted
  const digestion = ctx.animal.bodyState?.capabilities['digestion'] ?? 100;
  const digestiveEfficiency = 0.5 + (digestion / 100) * 0.5; // 0.5 at 0%, 1.0 at 100%

  // ── Locomotion affects foraging reach ──
  // Injured animals can't travel as far to find food
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
  const mobilityModifier = 0.7 + (locomotion / 100) * 0.3; // 0.7 at 0%, 1.0 at 100%

  // ── Net calories gained ──
  const caloriesGained = Math.round(params.baseCalories * digestiveEfficiency * mobilityModifier);

  // ── Toxicity check ──
  const toxicHarm: HarmEvent[] = [];
  if (params.toxicityRisk > 0 && rng.chance(params.toxicityRisk)) {
    const range = params.toxinMagnitudeRange ?? [20, 50];
    toxicHarm.push({
      id: `forage-toxin-${ctx.time.turn}`,
      sourceLabel: `${params.foodType} poisoning`,
      magnitude: rng.int(range[0], range[1]),
      targetZone: 'internal',
      spread: 1.0,
      harmType: 'chemical',
    });
  }

  // ── Predation exposure ──
  // Foraging in the open makes the animal visible to predators
  // Cover reduces detection; desperation (low BCS) doesn't help with stealth
  const bodyCondition = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
  const coverProtection = terrain.coverDensity * 0.6; // 0 to 0.48
  const adjustedExposure = params.predationExposure * (1 - coverProtection);
  const detectedByPredator = rng.chance(adjustedExposure);

  // ── Human detection ──
  // Near human areas, activity level and time of day affect detection
  let humanDetectionChance = params.humanProximity;
  // Nighttime foraging near humans is safer
  if (ctx.time.timeOfDay === 'night') humanDetectionChance *= 0.3;
  else if (ctx.time.timeOfDay === 'dusk' || ctx.time.timeOfDay === 'dawn') humanDetectionChance *= 0.6;
  // Desperation makes animals less cautious near humans
  if (bodyCondition <= 2) humanDetectionChance *= 0.8; // slightly less careful but not reckless
  const detectedByHuman = rng.chance(humanDetectionChance);

  return {
    caloriesGained: toxicHarm.length > 0 ? -Math.abs(Math.round(caloriesGained * 0.5)) : caloriesGained,
    toxicHarm,
    detectedByPredator,
    detectedByHuman,
  };
}
