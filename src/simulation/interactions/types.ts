import type { HarmEvent, HarmType } from '../harm/types';
import type { BodyZone } from '../anatomy/types';
import type { StatEffect } from '../../types/events';
import type { GameFlag } from '../../types/flags';

// ── Terrain Helpers ──

/** Terrain modifiers for movement-based interactions */
export interface TerrainProfile {
  /** Effective locomotion multiplier (1.0 = normal, <1 = harder) */
  footingMultiplier: number;
  /** Cover density (0 = open, 1 = dense) */
  coverDensity: number;
  /** Sightline distance multiplier (1.0 = normal, <1 = obstructed) */
  visibilityMultiplier: number;
  /** Whether water crossing is involved */
  hasWater: boolean;
  /** Whether terrain is elevated/steep */
  isSteep: boolean;
}

/** Derive a terrain profile from node type and weather */
export function getTerrainProfile(
  nodeType: string | undefined,
  weatherType: string | undefined,
  season: string,
): TerrainProfile {
  const isSnowy = weatherType === 'snow' || weatherType === 'blizzard';
  const isIcy = weatherType === 'frost' || (season === 'winter' && isSnowy);

  let footing = 1.0;
  let cover = 0.5;
  let visibility = 1.0;
  let hasWater = false;
  let isSteep = false;

  switch (nodeType) {
    case 'forest':
      cover = 0.8;
      visibility = 0.6;
      footing = 0.95;
      break;
    case 'plain':
      cover = 0.15;
      visibility = 1.0;
      footing = 1.0;
      break;
    case 'mountain':
      cover = 0.3;
      visibility = 0.8;
      footing = 0.75;
      isSteep = true;
      break;
    case 'water':
      cover = 0.2;
      visibility = 0.9;
      footing = 0.7;
      hasWater = true;
      break;
    default:
      break;
  }

  // Snow and ice penalties
  if (isSnowy) {
    footing *= 0.7; // deer hooves punch through crust
    visibility *= 0.7;
  }
  if (isIcy) {
    footing *= 0.8;
  }

  return { footingMultiplier: footing, coverDensity: cover, visibilityMultiplier: visibility, hasWater, isSteep };
}

// ── Chase Resolver Types ──

export interface ChaseParams {
  /** Predator speed relative to prey at full health (0-100). 70 = slightly slower, 100 = equal */
  predatorSpeed: number;
  /** Predator endurance (0-100). High = sustained pursuit */
  predatorEndurance: number;
  /** Predator pack coordination bonus (0 for solo, 10-30 for packs) */
  packBonus: number;
  /** Harm type if predator lands a bite/strike during chase */
  strikeHarmType: HarmType;
  /** Body zone the predator targets */
  strikeTargetZone: BodyZone;
  /** Base magnitude range for a strike [min, max] */
  strikeMagnitudeRange: [number, number];
  /** Source label for any harm events generated */
  strikeLabel: string;
}

export interface ChaseResult {
  /** Whether the prey successfully escaped */
  escaped: boolean;
  /** Harm events from the pursuit (bites during chase, falls, etc.) */
  harmEvents: HarmEvent[];
  /** Caloric cost of the sprint */
  caloriesCost: number;
  /** Whether a secondary hazard occurred (fall, ice break, etc.) */
  secondaryHazard?: 'fall' | 'ice-break' | 'drowning';
  /** Death consequence if the chase was fatal */
  deathCause?: string;
}

// ── Fight Resolver Types ──

export interface FightParams {
  /** Opponent's fighting strength (0-100) */
  opponentStrength: number;
  /** Opponent's weight in lbs */
  opponentWeight: number;
  /** Weapon type used by the opponent */
  opponentWeaponType: HarmType;
  /** Body zone the opponent targets */
  opponentTargetZone: BodyZone | 'random';
  /** Damage magnitude range [min, max] */
  opponentDamageRange: [number, number];
  /** Source label for opponent's harm events */
  opponentStrikeLabel: string;
  /** Engagement type affects dynamics */
  engagementType: 'charge' | 'grapple' | 'strike';
  /** Whether the player can disengage mid-fight */
  canDisengage: boolean;
  /** Whether both combatants use weapons (antler vs antler) or just one */
  mutual: boolean;
}

export interface FightResult {
  /** Whether the player won the fight */
  won: boolean;
  /** Harm events dealt to the player */
  harmToPlayer: HarmEvent[];
  /** Caloric cost of the fight */
  caloriesCost: number;
  /** Social dominance change (-1 to +1) */
  dominanceChange: number;
  /** Whether the fight was lethal (antler lock, etc.) */
  deathCause?: string;
}

// ── Forage Resolver Types ──

export interface ForageParams {
  /** Type of food source */
  foodType: 'browse' | 'mast' | 'crop' | 'fungi' | 'aquatic' | 'grass';
  /** Base caloric value of the food source (kcal-units) */
  baseCalories: number;
  /** Toxicity risk (0-1 probability) */
  toxicityRisk: number;
  /** How exposed foraging makes the animal (0-1) */
  predationExposure: number;
  /** Human proximity risk (0-1, for crop raids / orchards) */
  humanProximity: number;
  /** Toxin magnitude if poisoned [min, max] */
  toxinMagnitudeRange?: [number, number];
}

export interface ForageResult {
  /** Net calories gained after digestion efficiency */
  caloriesGained: number;
  /** Harm events from toxic food */
  toxicHarm: HarmEvent[];
  /** Whether predator detected the animal while foraging */
  detectedByPredator: boolean;
  /** Whether a human detected the animal */
  detectedByHuman: boolean;
}

// ── Exposure Resolver Types ──

export interface ExposureParams {
  /** Type of environmental exposure */
  type: 'cold' | 'heat' | 'dehydration';
  /** Intensity of the exposure (0-1 scale, from weather intensity) */
  intensity: number;
  /** Whether shelter is potentially available */
  shelterAvailable: boolean;
  /** Quality of available shelter (0-1, from node cover) */
  shelterQuality: number;
}

export interface ExposureResult {
  /** Harm events from exposure (frostbite, heat damage) */
  harmEvents: HarmEvent[];
  /** Shift to core temperature deviation (feeds into physiology) */
  coreTemperatureShift: number;
  /** Extra caloric cost from thermoregulation */
  caloriesCost: number;
  /** Whether shelter was found */
  shelterFound: boolean;
}

// ── Social Resolver Types ──

export interface SocialParams {
  /** Type of social interaction */
  interactionType: 'dominance-display' | 'alarm-response' | 'group-foraging' | 'dispersal';
  /** Opponent's social rank if applicable */
  opponentRank?: 'dominant' | 'subordinate' | 'peer';
  /** Size of the group involved */
  groupSize: number;
}

export interface SocialResult {
  /** Social rank change (positive = gained status) */
  rankChange: number;
  /** Harm events if the interaction escalated */
  harmEvents: HarmEvent[];
  /** Direct stat effects from the interaction */
  statEffects: StatEffect[];
  /** Game flags to set */
  flagsToSet: GameFlag[];
  /** Game flags to remove */
  flagsToRemove: GameFlag[];
}
