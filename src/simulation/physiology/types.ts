import type { AnimalState } from '../../types/species';
import type { StatModifier } from '../../types/stats';
import type { TimeState, RegionDefinition } from '../../types/world';
import type { SpeciesConfig } from '../../types/speciesConfig';
import type { BehavioralSettings } from '../../types/behavior';
import type { WeatherState } from '../../engine/WeatherSystem';
import type { Rng } from '../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  PHYSIOLOGY STATE — lives on AnimalState
// ══════════════════════════════════════════════════

/**
 * Runtime physiological state of the animal.
 * All values are continuous variables that tick each turn.
 * Present only for simulation-mode species (those with metabolismId).
 */
export interface PhysiologyState {
  // ── Metabolism ──
  /** Current caloric reserves in kcal-units (1 unit = ~100 real kcal). Maps to body fat. */
  caloricReserve: number;
  /** Bonus calories consumed this turn from event consequences. Reset each turn after processing. */
  caloricIntakeThisTurn: number;
  /** Running average of caloric balance, smoothed over 4 turns. For UI display / narrative. */
  avgCaloricBalance: number;

  // ── Thermoregulation ──
  /** Core body temperature deviation from normal, in degrees F.
   *  0 = normal. Negative = hypothermic. Positive = hyperthermic. */
  coreTemperatureDeviation: number;
  /** Thermoregulatory caloric cost this turn (kcal-units). Elevated when cold. */
  thermoregulationCost: number;

  // ── Immune System ──
  /** Immune capacity (0-100). Decreases with malnutrition, stress, age. */
  immuneCapacity: number;
  /** Total immune load from all active infections/parasites (0-100+). */
  immuneLoad: number;
  /** Whether the animal is currently immunocompromised (load > capacity). */
  immunocompromised: boolean;

  // ── Condition Cascades ──
  /** Total fever level from infected/septic conditions (degrees deviation, 0-8+). */
  feverLevel: number;

  // ── Derived / Cached ──
  /** Body condition score (1-5 scale, like real wildlife biology BCS). */
  bodyConditionScore: number;
  /** Whether the animal was in negative energy balance this turn. */
  negativeEnergyBalance: boolean;
}

// ══════════════════════════════════════════════════
//  METABOLISM CONFIG — per-species parameters
// ══════════════════════════════════════════════════

/**
 * Species-specific metabolic parameters. Stored alongside anatomy definitions.
 * All caloric values in "kcal-units" (1 unit ≈ 100 real kcal) to keep numbers manageable.
 * One game turn = 1 week for deer.
 */
export interface MetabolismConfig {
  /** Basal metabolic rate in kcal-units per turn at reference weight. */
  basalMetabolicRate: number;
  /** Reference body weight (lbs) for BMR scaling. */
  referenceWeight: number;
  /** Kleiber scaling exponent (0.75 for mammals). */
  metabolicScalingExponent: number;
  /** Kcal-units stored per lb of body weight change. */
  caloricDensityPerLb: number;
  /** Maximum weight loss from fat mobilization per turn (lbs). */
  maxFatMobilization: number;
  /** Maximum weight gain from fat deposition per turn (lbs). */
  maxFatDeposition: number;

  // ── Foraging ──
  /** Base foraging yield in kcal-units per turn at quality=1.0, foraging=3. */
  baseForagingRate: number;
  /** Per-level multiplier for behavioral foraging setting. Each level adds this fraction. */
  foragingBehaviorMultiplier: number;

  // ── Thermoregulation ──
  /** Lower critical temperature (F). Below this, thermoregulation costs calories. */
  lowerCriticalTemp: number;
  /** Upper critical temperature (F). Above this, heat stress begins. */
  upperCriticalTemp: number;
  /** Kcal-units cost per degree F below LCT per turn. */
  coldCostPerDegree: number;
  /** How much skin damage increases cold cost (multiplier per damage point, 0-100). */
  insulationLossPerDamagePoint: number;

  // ── Immune ──
  /** Baseline immune capacity at full health and nutrition. */
  baseImmuneCapacity: number;
  /** How much poor body condition (BCS < 2) reduces immune capacity. */
  malnutritionImmunePenalty: number;
  /** Caloric cost of immune activity: kcal-units per immune load point per turn. */
  immuneMetabolicCost: number;

  // ── Reproduction ──
  /** Kcal-units per turn during lactation (nursing dependent young). */
  lactationCost: number;
  /** Kcal-units per turn during late gestation. */
  gestationCost: number;
}

// ══════════════════════════════════════════════════
//  ENGINE I/O — tick input/output
// ══════════════════════════════════════════════════

/**
 * Snapshot of everything the physiology engine needs for one tick.
 * Assembled by the caller from GameState, keeping the tick function pure.
 */
export interface PhysiologyTickInput {
  animal: AnimalState;
  time: TimeState;
  weather: WeatherState | null;
  config: SpeciesConfig;
  metabolismConfig: MetabolismConfig;
  behavior: BehavioralSettings;
  regionDef: RegionDefinition | undefined;
  currentNodeType: string | undefined;
  currentNodeResources: { food: number; cover: number } | undefined;
  isPregnant: boolean;
  isLactating: boolean;
  rng: Rng;
  ffMult: number;
}

/**
 * Pure output of a single physiology tick. No side effects.
 */
export interface PhysiologyTickResult {
  /** Updated physiology state (caller should write back to animal). */
  physiology: PhysiologyState;
  /** Weight change this turn (lbs). May be positive or negative. */
  weightChange: number;
  /** Stat modifiers produced by physiological state this turn. */
  modifiers: StatModifier[];
  /** If non-null, the animal died from physiological failure. */
  deathCause: string | undefined;
  /** Narrative fragments for turn result display. */
  narratives: string[];
}
