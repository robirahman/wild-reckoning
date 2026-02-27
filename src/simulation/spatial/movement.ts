import type { MapNode, NodeType } from '../../types/map';
import type { WeatherState } from '../../engine/WeatherSystem';
import type { Season } from '../../types/world';

/**
 * Terrain difficulty multipliers for movement cost.
 * Higher = harder to traverse.
 */
const TERRAIN_DIFFICULTY: Record<NodeType, number> = {
  plain: 0.8,
  forest: 1.0,
  den: 1.0,
  water: 1.5,
  mountain: 2.0,
};

/**
 * Seasonal movement modifiers (snow depth, mud, etc.)
 */
const SEASON_MOVEMENT_MODIFIER: Record<Season, number> = {
  spring: 1.1, // mud season
  summer: 1.0,
  autumn: 1.0,
  winter: 1.4, // snow
};

export interface MovementCostInput {
  /** Target node the animal is moving to */
  targetNode: MapNode;
  /** Locomotion capability from anatomy (0-100, 100 = unimpaired) */
  locomotionCapability: number;
  /** Current weather (optional) */
  weather: WeatherState | null;
  /** Current season */
  season: Season;
}

/**
 * Compute the caloric cost of moving to a target node.
 *
 * cost = baseCost × terrainDifficulty × (100 / locomotion) × seasonModifier × weatherModifier
 *
 * Returns a positive number representing calories expended.
 * This is deducted via add_calories consequence (negative amount).
 */
export function computeMovementCost(input: MovementCostInput): number {
  const { targetNode, locomotionCapability, weather, season } = input;

  const baseCost = targetNode.movementCost;
  const terrainMult = TERRAIN_DIFFICULTY[targetNode.type] ?? 1.0;
  const locomotionMult = 100 / Math.max(10, locomotionCapability); // injured deer pay more
  const seasonMult = SEASON_MOVEMENT_MODIFIER[season] ?? 1.0;

  let weatherMult = 1.0;
  if (weather) {
    if (weather.type === 'blizzard') {
      weatherMult = 1.5 + weather.intensity * 0.5; // 1.5–2.0
    } else if (weather.type === 'snow') {
      weatherMult = 1.2 + weather.intensity * 0.2;
    } else if (weather.type === 'heat_wave') {
      weatherMult = 1.1 + weather.intensity * 0.2;
    }
    // High wind adds drag
    if (weather.windSpeed > 30) {
      weatherMult *= 1 + (weather.windSpeed - 30) / 200;
    }
  }

  return baseCost * terrainMult * locomotionMult * seasonMult * weatherMult;
}
