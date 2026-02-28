import type { ClimateProfile, Season } from '../types/world';
import type { Rng } from './RandomUtils';
import { StatId } from '../types/stats';
import {
  WEATHER_TYPE_CONFIGS,
  TEMPERATURE_RULES,
  PRECIPITATION_RULES,
  SEASON_RULES,
} from './data/weatherConfig';

export type WeatherType =
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'snow'
  | 'blizzard'
  | 'fog'
  | 'heat_wave'
  | 'frost'
  | 'drought_conditions';

export type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface WeatherState {
  type: WeatherType;
  description: string;
  persistenceTurnsLeft: number;
  intensity: number; // 0.0–1.0
  windDirection: WindDirection;
  windSpeed: number; // 0-100
}

const WIND_DIRECTIONS: WindDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const ALL_WEATHER_TYPES: WeatherType[] = [
  'clear', 'cloudy', 'rain', 'heavy_rain', 'snow',
  'blizzard', 'fog', 'heat_wave', 'frost', 'drought_conditions',
];

interface WeatherWeights {
  clear: number;
  cloudy: number;
  rain: number;
  heavy_rain: number;
  snow: number;
  blizzard: number;
  fog: number;
  heat_wave: number;
  frost: number;
  drought_conditions: number;
}

function getWeatherWeights(
  climate: ClimateProfile | undefined,
  monthIndex: number,
  season: Season,
  tempOffset: number = 0,
): WeatherWeights {
  // Initialize from base weights in config
  const weights = {} as WeatherWeights;
  for (const type of ALL_WEATHER_TYPES) {
    weights[type] = WEATHER_TYPE_CONFIGS[type].baseWeight;
  }

  if (!climate) return weights;

  const temp = climate.temperatureByMonth[monthIndex] + tempOffset;
  const precip = climate.precipitationByMonth[monthIndex];

  // Temperature-driven adjustments (first matching rule wins, like the original if/else if)
  let tempMatched = false;
  for (const rule of TEMPERATURE_RULES) {
    if (tempMatched) break;
    const matches =
      (rule.condition === 'below' && temp < rule.threshold) ||
      (rule.condition === 'above' && temp > rule.threshold);
    if (matches) {
      tempMatched = true;
      if (rule.zeroOut) {
        for (const t of rule.zeroOut) {
          weights[t] = 0;
        }
      }
      for (const [t, adj] of Object.entries(rule.adjustments) as [WeatherType, number][]) {
        weights[t] += adj;
      }
    }
  }

  // Precipitation-driven adjustments (first matching rule wins)
  let precipMatched = false;
  for (const rule of PRECIPITATION_RULES) {
    if (precipMatched) break;
    const matches =
      (rule.condition === 'below' && precip < rule.threshold) ||
      (rule.condition === 'above' && precip > rule.threshold);
    if (matches) {
      precipMatched = true;
      if (rule.zeroOut) {
        for (const t of rule.zeroOut) {
          weights[t] = 0;
        }
      }
      for (const [t, adj] of Object.entries(rule.adjustments) as [WeatherType, number][]) {
        weights[t] += adj;
      }
    }
  }

  // Season-specific flavor (all matching rules apply)
  for (const rule of SEASON_RULES) {
    if (season === rule.season) {
      for (const [t, adj] of Object.entries(rule.adjustments) as [WeatherType, number][]) {
        weights[t] += adj;
      }
    }
  }

  // Ensure no negative weights
  for (const key of Object.keys(weights) as (keyof WeatherWeights)[]) {
    weights[key] = Math.max(0, weights[key]);
  }

  return weights;
}

function selectWeather(weights: WeatherWeights, rng: Rng): WeatherType {
  const types = Object.keys(weights) as WeatherType[];
  const values = types.map((t) => weights[t]);
  const idx = rng.weightedSelect(values);
  return types[idx];
}

function getPersistence(type: WeatherType, rng: Rng): number {
  const [min, max] = WEATHER_TYPE_CONFIGS[type].persistence;
  return rng.int(min, max);
}

function getIntensity(type: WeatherType, rng: Rng): number {
  const [min, max] = WEATHER_TYPE_CONFIGS[type].intensity;
  return min + rng.random() * (max - min);
}

export function generateWeather(
  climate: ClimateProfile | undefined,
  season: Season,
  monthIndex: number,
  rng: Rng,
  tempOffset: number = 0,
): WeatherState {
  const weights = getWeatherWeights(climate, monthIndex, season, tempOffset);
  const type = selectWeather(weights, rng);
  const config = WEATHER_TYPE_CONFIGS[type];
  const [windMin, windMax] = config.windSpeed ?? [5, 40];

  return {
    type,
    description: rng.pick(config.descriptions),
    persistenceTurnsLeft: getPersistence(type, rng),
    intensity: getIntensity(type, rng),
    windDirection: rng.pick(WIND_DIRECTIONS),
    windSpeed: windMin + rng.int(0, windMax - windMin),
  };
}

export function tickWeather(
  current: WeatherState,
  climate: ClimateProfile | undefined,
  season: Season,
  monthIndex: number,
  rng: Rng,
  tempOffset: number = 0,
): WeatherState {
  if (current.persistenceTurnsLeft > 1) {
    // Wind can shift even if weather stays
    const shift = rng.chance(0.2);
    let newDir = current.windDirection;
    if (shift) {
      const idx = WIND_DIRECTIONS.indexOf(current.windDirection);
      const move = rng.pick([-1, 1]);
      newDir = WIND_DIRECTIONS[(idx + move + WIND_DIRECTIONS.length) % WIND_DIRECTIONS.length];
    }

    return {
      ...current,
      persistenceTurnsLeft: current.persistenceTurnsLeft - 1,
      windDirection: newDir,
      windSpeed: Math.max(0, Math.min(100, current.windSpeed + rng.int(-5, 5))),
    };
  }
  return generateWeather(climate, season, monthIndex, rng, tempOffset);
}

/** Compute event weight multiplier based on current weather */
export function weatherContextMultiplier(
  category: string,
  weather: WeatherState,
): number {
  let mult = 1.0;
  const { type, intensity } = weather;
  const config = WEATHER_TYPE_CONFIGS[type];

  const entry = config.eventMultipliers[category];
  if (entry) {
    mult *= entry.base + intensity * entry.intensityScale;
  }

  return mult;
}

/** Compute direct survival penalties from extreme weather */
export interface WeatherPenalty {
  weightChange: number;
  statModifiers: { stat: StatId; amount: number; duration: number }[];
}

export function computeWeatherPenalty(weather: WeatherState): WeatherPenalty {
  const result: WeatherPenalty = { weightChange: 0, statModifiers: [] };
  const { type, intensity } = weather;
  const config = WEATHER_TYPE_CONFIGS[type];

  result.weightChange = config.penalty.weightChange * intensity;

  if (config.penalty.statModifier) {
    const { stat, baseAmount } = config.penalty.statModifier;
    result.statModifiers.push({ stat, amount: Math.round(baseAmount * intensity), duration: 1 });
  }

  return result;
}

export function weatherLabel(type: WeatherType): string {
  return WEATHER_TYPE_CONFIGS[type].label;
}
