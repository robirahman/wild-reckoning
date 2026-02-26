import type { SimulationContext } from '../events/types';
import type { HarmEvent } from '../harm/types';
import type { ExposureParams, ExposureResult } from './types';
import { computeAverageSkinDamage } from '../physiology/helpers';

/**
 * Resolve an environmental exposure event.
 *
 * The exposure resolver encapsulates thermoregulatory dynamics for acute
 * weather events. While the physiology engine handles baseline thermoregulation
 * every turn, this resolver handles discrete exposure events (blizzards,
 * extreme cold snaps, heat waves) that triggers present as narrative moments.
 *
 * Considers:
 * - skin/fur damage (insulation loss from injuries)
 * - body condition (fat reserves = thermal buffer)
 * - shelter availability and quality (terrain cover)
 * - locomotion (ability to seek shelter)
 * - exposure intensity and type
 */
export function resolveExposure(ctx: SimulationContext, params: ExposureParams): ExposureResult {
  const rng = ctx.rng;

  // ── Insulation from fur/skin condition ──
  const skinDamage = computeAverageSkinDamage(ctx.animal.bodyState);
  const insulationFactor = Math.max(0.3, 1 - skinDamage * 0.01); // 0.3 at 70% skin damage, 1.0 at 0%

  // ── Fat reserves as thermal buffer ──
  const bodyCondition = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
  const fatBuffer = 0.6 + bodyCondition * 0.08; // 0.68 at BCS 1, 1.0 at BCS 5

  // ── Shelter seeking ──
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
  let shelterFound = false;

  if (params.shelterAvailable) {
    // Chance of finding shelter depends on mobility and shelter quality
    const shelterChance = params.shelterQuality * (locomotion / 100) * 0.8 + 0.1;
    shelterFound = rng.chance(Math.min(0.9, shelterChance));
  }

  // ── Effective exposure ──
  // Shelter dramatically reduces exposure intensity
  const shelterReduction = shelterFound ? 0.3 + params.shelterQuality * 0.3 : 0; // 30-60% reduction
  const effectiveIntensity = params.intensity * (1 - shelterReduction);

  // ── Harm from exposure ──
  const harmEvents: HarmEvent[] = [];

  if (params.type === 'cold') {
    // Cold harm: magnitude scales with intensity, reduced by insulation and fat
    const coldSeverity = effectiveIntensity / (insulationFactor * fatBuffer);
    const magnitude = Math.round(coldSeverity * rng.int(10, 30));

    if (magnitude > 5) {
      harmEvents.push({
        id: `exposure-cold-${ctx.time.turn}`,
        sourceLabel: shelterFound ? 'cold exposure (sheltered)' : 'cold exposure',
        magnitude: Math.min(100, magnitude),
        targetZone: rng.pick(['front-legs', 'hind-legs', 'head']),
        spread: 0.8, // cold affects broadly
        harmType: 'thermal-cold',
      });
    }
  } else if (params.type === 'heat') {
    // Heat harm: less common for deer but relevant in summer
    const heatSeverity = effectiveIntensity * 0.7; // heat is less lethal than cold for deer
    const magnitude = Math.round(heatSeverity * rng.int(8, 20));

    if (magnitude > 5) {
      harmEvents.push({
        id: `exposure-heat-${ctx.time.turn}`,
        sourceLabel: 'heat stress',
        magnitude: Math.min(80, magnitude),
        targetZone: 'internal',
        spread: 1.0,
        harmType: 'thermal-heat',
      });
    }
  } else {
    // Dehydration
    const dehydrationSeverity = effectiveIntensity * 0.6;
    const magnitude = Math.round(dehydrationSeverity * rng.int(10, 25));

    if (magnitude > 5) {
      harmEvents.push({
        id: `exposure-dehydration-${ctx.time.turn}`,
        sourceLabel: 'dehydration',
        magnitude: Math.min(70, magnitude),
        targetZone: 'internal',
        spread: 1.0,
        harmType: 'chemical',
      });
    }
  }

  // ── Core temperature shift ──
  // Feeds into the physiology engine's thermoregulation on the next tick
  let coreTemperatureShift = 0;
  if (params.type === 'cold') {
    // Shift is negative (toward hypothermia)
    coreTemperatureShift = -effectiveIntensity * (2 / (insulationFactor * fatBuffer));
  } else if (params.type === 'heat') {
    coreTemperatureShift = effectiveIntensity * 1.5;
  }

  // ── Caloric cost ──
  // Thermoregulation burns calories: shivering in cold, panting in heat
  let caloriesCost = 0;
  if (params.type === 'cold') {
    caloriesCost = Math.round(effectiveIntensity * 25 / (insulationFactor * fatBuffer));
  } else if (params.type === 'heat') {
    caloriesCost = Math.round(effectiveIntensity * 15);
  } else {
    caloriesCost = Math.round(effectiveIntensity * 10);
  }

  return {
    harmEvents,
    coreTemperatureShift,
    caloriesCost,
    shelterFound,
  };
}
