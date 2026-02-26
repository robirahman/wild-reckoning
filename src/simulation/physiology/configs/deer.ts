import type { MetabolismConfig } from '../types';

/**
 * Metabolic parameters for white-tailed deer (Odocoileus virginianus).
 *
 * Sources:
 * - Moen (1978): BMR ~70 × (kg^0.75) kcal/day → ~4900 kcal/day for 70 kg deer
 * - Parker et al. (1984): thermoregulation costs in northern Minnesota winters
 * - Pekins et al. (1998): winter tick metabolic burden
 * - Verme & Ullrey (1984): seasonal weight cycle 15-25% of body mass
 *
 * One game turn = 1 week. Weekly BMR ≈ 34,300 kcal for adult male.
 * We use "kcal-units" where 1 unit = 100 real kcal → BMR ≈ 343 units/turn.
 * Simplified to 340 for round numbers.
 */
export const DEER_METABOLISM: MetabolismConfig = {
  // ── Base Metabolism ──
  basalMetabolicRate: 340,          // kcal-units/turn at reference weight
  referenceWeight: 150,              // lbs (adult male reference)
  metabolicScalingExponent: 0.75,    // Kleiber's law
  caloricDensityPerLb: 35,          // kcal-units per lb of body fat
  maxFatMobilization: 4,            // Max lbs/turn loss from fat reserves
  maxFatDeposition: 3,              // Max lbs/turn gain from caloric surplus

  // ── Foraging ──
  // At quality=1.0 and foraging=3 (neutral), intake ≈ 400 → surplus of ~60 → slow gain
  // At quality=0.3 (harsh winter) and foraging=3, intake ≈ 120 → deficit of ~220 → rapid loss
  baseForagingRate: 400,            // kcal-units/turn at quality=1.0, foraging=3
  foragingBehaviorMultiplier: 0.15, // Each foraging level above/below 3 adds ±15%

  // ── Thermoregulation ──
  // Deer with full winter coat: LCT around 14°F
  // Below LCT, each degree costs ~5 units → at -20°F (34 below), cost = 170 units
  lowerCriticalTemp: 14,            // F — with winter coat
  upperCriticalTemp: 86,            // F
  coldCostPerDegree: 5,             // kcal-units per degree below LCT
  insulationLossPerDamagePoint: 0.012, // 1.2% increase in cold cost per skin damage point

  // ── Immune ──
  baseImmuneCapacity: 80,
  malnutritionImmunePenalty: 25,    // Penalty when BCS < 2
  immuneMetabolicCost: 2,           // kcal-units per immune load point per turn

  // ── Reproduction ──
  lactationCost: 80,                // ~2300 real kcal/day for peak lactation
  gestationCost: 40,                // Late gestation metabolic premium
};
