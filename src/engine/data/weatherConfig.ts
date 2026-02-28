import type { WeatherType } from '../WeatherSystem';
import { StatId } from '../../types/stats';

/** Configuration for a single weather type */
export interface WeatherTypeConfig {
  /** Human-readable label */
  label: string;
  /** Narrative descriptions (randomly selected) */
  descriptions: string[];
  /** Base probability weight (before climate adjustments) */
  baseWeight: number;
  /** Duration range [min, max] turns */
  persistence: [number, number];
  /** Intensity range [min, max] on 0.0-1.0 scale */
  intensity: [number, number];
  /** Direct survival penalties (applied each turn) */
  penalty: {
    /** Weight change per turn (scaled by intensity) */
    weightChange: number;
    /** Stat modifier applied per turn */
    statModifier?: { stat: StatId; baseAmount: number };
  };
  /** Event category probability multipliers (scaled by intensity) */
  eventMultipliers: Partial<Record<string, { base: number; intensityScale: number }>>;
  /** Wind speed range override [min, max] (default 5-40) */
  windSpeed?: [number, number];
}

/** Temperature threshold adjustments to base weights */
export interface TemperatureRule {
  /** Condition: 'below' or 'above' threshold */
  condition: 'below' | 'above';
  /** Temperature threshold in Fahrenheit */
  threshold: number;
  /** Weight adjustments to apply */
  adjustments: Partial<Record<WeatherType, number>>;
  /** Weather types to zero out */
  zeroOut?: WeatherType[];
}

/** Precipitation threshold adjustments */
export interface PrecipitationRule {
  condition: 'below' | 'above';
  threshold: number;
  adjustments: Partial<Record<WeatherType, number>>;
  zeroOut?: WeatherType[];
}

/** Season-specific weight adjustments */
export interface SeasonRule {
  season: string;
  adjustments: Partial<Record<WeatherType, number>>;
}

export const WEATHER_TYPE_CONFIGS: Record<WeatherType, WeatherTypeConfig> = {
  clear: {
    label: 'Clear',
    descriptions: ['Clear skies stretch overhead.', 'The sky is bright and open.', 'Sunlight pours across the landscape.'],
    baseWeight: 30,
    persistence: [1, 3],
    intensity: [0.1, 0.5],
    penalty: { weightChange: 0 },
    eventMultipliers: {},
  },
  cloudy: {
    label: 'Cloudy',
    descriptions: ['Gray clouds blanket the sky.', 'An overcast sky diffuses the light.', 'Clouds move steadily above.'],
    baseWeight: 25,
    persistence: [1, 2],
    intensity: [0.1, 0.5],
    penalty: { weightChange: 0 },
    eventMultipliers: {},
  },
  rain: {
    label: 'Rain',
    descriptions: ['A steady rain falls.', 'Rain patters against the ground.', 'Drizzle mists the air.'],
    baseWeight: 15,
    persistence: [1, 3],
    intensity: [0.1, 0.5],
    penalty: { weightChange: 0 },
    eventMultipliers: {},
  },
  heavy_rain: {
    label: 'Heavy Rain',
    descriptions: ['Heavy rain hammers the ground.', 'A downpour drenches everything.', 'Torrential rain floods the low ground.'],
    baseWeight: 5,
    persistence: [1, 3],
    intensity: [0.6, 1.0],
    penalty: { weightChange: 0, statModifier: { stat: StatId.CLI, baseAmount: 4 } },
    eventMultipliers: {
      environmental: { base: 1.0, intensityScale: 0.5 },
      seasonal: { base: 1.0, intensityScale: 0.5 },
      predator: { base: 1.0, intensityScale: -0.2 },
      foraging: { base: 1.0, intensityScale: -0.3 },
    },
  },
  snow: {
    label: 'Snow',
    descriptions: ['Snow falls softly, muffling all sound.', 'A light snowfall dusts the ground.', 'Snowflakes drift down steadily.'],
    baseWeight: 0,
    persistence: [1, 3],
    intensity: [0.3, 0.7],
    penalty: { weightChange: 0 },
    eventMultipliers: {
      seasonal: { base: 1.0, intensityScale: 0.3 },
    },
  },
  blizzard: {
    label: 'Blizzard',
    descriptions: ['A blizzard howls across the landscape.', 'Driving snow reduces visibility to nothing.', 'The wind screams with ice and snow.'],
    baseWeight: 0,
    persistence: [2, 4],
    intensity: [0.7, 1.0],
    penalty: { weightChange: -2, statModifier: { stat: StatId.CLI, baseAmount: 10 } },
    eventMultipliers: {
      environmental: { base: 1.0, intensityScale: 0.5 },
      seasonal: { base: 1.0, intensityScale: 0.5 },
      predator: { base: 1.0, intensityScale: -0.2 },
      foraging: { base: 1.0, intensityScale: -0.3 },
    },
    windSpeed: [80, 100],
  },
  fog: {
    label: 'Fog',
    descriptions: ['Dense fog clings to the ground.', 'Thick mist obscures everything beyond a few paces.', 'Fog rolls in, swallowing familiar landmarks.'],
    baseWeight: 5,
    persistence: [1, 2],
    intensity: [0.1, 0.5],
    penalty: { weightChange: 0 },
    eventMultipliers: {},
  },
  heat_wave: {
    label: 'Heat Wave',
    descriptions: ['Oppressive heat shimmers off the ground.', 'The air is furnace-hot and still.', 'A brutal heat wave bakes the land.'],
    baseWeight: 0,
    persistence: [2, 4],
    intensity: [0.6, 1.0],
    penalty: { weightChange: -1.5, statModifier: { stat: StatId.CLI, baseAmount: 8 } },
    eventMultipliers: {
      foraging: { base: 1.0, intensityScale: -0.3 },
      health: { base: 1.0, intensityScale: 0.3 },
      environmental: { base: 1.0, intensityScale: 0.4 },
    },
  },
  frost: {
    label: 'Frost',
    descriptions: ['A heavy frost coats every surface.', 'Ice crystals glitter in the early light.', 'Frost has crept over everything overnight.'],
    baseWeight: 0,
    persistence: [1, 2],
    intensity: [0.3, 0.7],
    penalty: { weightChange: -0.5 },
    eventMultipliers: {
      seasonal: { base: 1.0, intensityScale: 0.3 },
    },
  },
  drought_conditions: {
    label: 'Drought',
    descriptions: ['The land is parched and cracked.', 'Dry conditions persist — water sources are shrinking.', 'Dust rises from the bone-dry earth.'],
    baseWeight: 0,
    persistence: [3, 6],
    intensity: [0.5, 1.0],
    penalty: { weightChange: -1, statModifier: { stat: StatId.HOM, baseAmount: 5 } },
    eventMultipliers: {
      foraging: { base: 1.0, intensityScale: -0.3 },
      health: { base: 1.0, intensityScale: 0.3 },
      environmental: { base: 1.0, intensityScale: 0.4 },
    },
  },
};

// Temperature rules are ordered from most extreme to least (matching the original if/else if chain)
export const TEMPERATURE_RULES: TemperatureRule[] = [
  {
    condition: 'below',
    threshold: 20,
    adjustments: { snow: 25, blizzard: 10, frost: 15, clear: -10 },
    zeroOut: ['rain', 'heavy_rain'],
  },
  {
    condition: 'below',
    threshold: 32,
    adjustments: { snow: 15, frost: 10, rain: -5 },
    zeroOut: ['heavy_rain'],
  },
  {
    condition: 'above',
    threshold: 85,
    adjustments: { heat_wave: 20, drought_conditions: 10, clear: 10 },
  },
  {
    condition: 'above',
    threshold: 75,
    adjustments: { heat_wave: 5, clear: 5 },
  },
];

export const PRECIPITATION_RULES: PrecipitationRule[] = [
  {
    condition: 'above',
    threshold: 4.0,
    adjustments: { rain: 15, heavy_rain: 10, fog: 5, clear: -10 },
  },
  {
    condition: 'above',
    threshold: 2.5,
    adjustments: { rain: 8, heavy_rain: 3 },
  },
  {
    condition: 'below',
    threshold: 1.0,
    adjustments: { drought_conditions: 10, clear: 10, rain: -10 },
    zeroOut: ['heavy_rain'],
  },
];

export const SEASON_RULES: SeasonRule[] = [
  { season: 'autumn', adjustments: { fog: 8 } },
  { season: 'spring', adjustments: { rain: 5, fog: 3 } },
];
