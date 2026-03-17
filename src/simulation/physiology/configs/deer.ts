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
  maxFatMobilization: 2,            // Max lbs/turn loss from fat reserves (real: ~0.4 lb/day = 2.8/wk)
  maxFatDeposition: 5,              // Max lbs/turn gain from caloric surplus (real: ~0.7 lb/day = 5/wk in autumn)

  // ── Foraging ──
  // Real deer: winter deficit produces ~1 lb/week loss. With 25% BMR reduction,
  // BMR in winter ≈ 255. We need winter intake (quality ~0.3) ≈ 220-240 to produce
  // a mild deficit. At quality=1.0 in summer, intake should give ~60-80 surplus for
  // slow weight gain (~0.5-1 lb/week). Base rate = 1100 → quality 0.3 = 330 intake
  // → 330 vs 255 BMR = +75 surplus. That's too high. Quality 0.25 = 275 → deficit
  // of 20 ≈ 0.6 lb/week loss. Reasonable for healthy deer with browse available.
  baseForagingRate: 1100,           // kcal-units/turn at quality=1.0, foraging=3
  foragingBehaviorMultiplier: 0.15, // Each foraging level above/below 3 adds ±15%

  // ── Thermoregulation ──
  // Deer with full winter coat: LCT around 14°F
  // Below LCT, each degree costs ~5 units → at -20°F (34 below), cost = 170 units
  lowerCriticalTemp: 14,            // F — with winter coat
  upperCriticalTemp: 86,            // F
  coldCostPerDegree: 3,             // kcal-units per degree below LCT (with winter coat insulation)
  winterMetabolicReduction: 0.25,  // 25% BMR reduction in winter (reduced thyroid, behavioral torpor)
  insulationLossPerDamagePoint: 0.012, // 1.2% increase in cold cost per skin damage point

  // ── Immune ──
  baseImmuneCapacity: 80,
  malnutritionImmunePenalty: 25,    // Penalty when BCS < 2
  immuneMetabolicCost: 2,           // kcal-units per immune load point per turn

  // ── Reproduction ──
  lactationCost: 80,                // ~2300 real kcal/day for peak lactation
  gestationCost: 40,                // Late gestation metabolic premium
};
