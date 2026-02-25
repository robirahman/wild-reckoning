import type { ClimateProfile, Season } from '../types/world';
import type { Rng } from './RandomUtils';
import { StatId } from '../types/stats';

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

const WEATHER_DESCRIPTIONS: Record<WeatherType, string[]> = {
  clear: ['Clear skies stretch overhead.', 'The sky is bright and open.', 'Sunlight pours across the landscape.'],
  cloudy: ['Gray clouds blanket the sky.', 'An overcast sky diffuses the light.', 'Clouds move steadily above.'],
  rain: ['A steady rain falls.', 'Rain patters against the ground.', 'Drizzle mists the air.'],
  heavy_rain: ['Heavy rain hammers the ground.', 'A downpour drenches everything.', 'Torrential rain floods the low ground.'],
  snow: ['Snow falls softly, muffling all sound.', 'A light snowfall dusts the ground.', 'Snowflakes drift down steadily.'],
  blizzard: ['A blizzard howls across the landscape.', 'Driving snow reduces visibility to nothing.', 'The wind screams with ice and snow.'],
  fog: ['Dense fog clings to the ground.', 'Thick mist obscures everything beyond a few paces.', 'Fog rolls in, swallowing familiar landmarks.'],
  heat_wave: ['Oppressive heat shimmers off the ground.', 'The air is furnace-hot and still.', 'A brutal heat wave bakes the land.'],
  frost: ['A heavy frost coats every surface.', 'Ice crystals glitter in the early light.', 'Frost has crept over everything overnight.'],
  drought_conditions: ['The land is parched and cracked.', 'Dry conditions persist — water sources are shrinking.', 'Dust rises from the bone-dry earth.'],
};

function getWeatherWeights(
  climate: ClimateProfile | undefined,
  monthIndex: number,
  season: Season,
  tempOffset: number = 0,
): WeatherWeights {
  const weights: WeatherWeights = {
    clear: 30,
    cloudy: 25,
    rain: 15,
    heavy_rain: 5,
    snow: 0,
    blizzard: 0,
    fog: 5,
    heat_wave: 0,
    frost: 0,
    drought_conditions: 0,
  };

  if (!climate) return weights;

  const temp = climate.temperatureByMonth[monthIndex] + tempOffset;
  const precip = climate.precipitationByMonth[monthIndex];

  // Temperature-driven adjustments
  if (temp < 20) {
    weights.snow += 25;
    weights.blizzard += 10;
    weights.frost += 15;
    weights.rain = 0;
    weights.heavy_rain = 0;
    weights.clear -= 10;
  } else if (temp < 32) {
    weights.snow += 15;
    weights.frost += 10;
    weights.rain -= 5;
    weights.heavy_rain = 0;
  } else if (temp > 85) {
    weights.heat_wave += 20;
    weights.drought_conditions += 10;
    weights.clear += 10;
  } else if (temp > 75) {
    weights.heat_wave += 5;
    weights.clear += 5;
  }

  // Precipitation-driven adjustments
  if (precip > 4.0) {
    weights.rain += 15;
    weights.heavy_rain += 10;
    weights.fog += 5;
    weights.clear -= 10;
  } else if (precip > 2.5) {
    weights.rain += 8;
    weights.heavy_rain += 3;
  } else if (precip < 1.0) {
    weights.drought_conditions += 10;
    weights.clear += 10;
    weights.rain -= 10;
    weights.heavy_rain = 0;
  }

  // Season-specific flavor
  if (season === 'autumn') {
    weights.fog += 8;
  }
  if (season === 'spring') {
    weights.rain += 5;
    weights.fog += 3;
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
  switch (type) {
    case 'blizzard': return rng.int(2, 4);
    case 'heavy_rain': return rng.int(1, 3);
    case 'drought_conditions': return rng.int(3, 6);
    case 'heat_wave': return rng.int(2, 4);
    case 'snow': return rng.int(1, 3);
    case 'fog': return rng.int(1, 2);
    case 'frost': return rng.int(1, 2);
    case 'rain': return rng.int(1, 3);
    case 'cloudy': return rng.int(1, 2);
    case 'clear': return rng.int(1, 3);
  }
}

function getIntensity(type: WeatherType, rng: Rng): number {
  switch (type) {
    case 'blizzard': return 0.7 + rng.random() * 0.3;
    case 'heavy_rain': return 0.6 + rng.random() * 0.4;
    case 'heat_wave': return 0.6 + rng.random() * 0.4;
    case 'drought_conditions': return 0.5 + rng.random() * 0.5;
    case 'snow': return 0.3 + rng.random() * 0.4;
    case 'frost': return 0.3 + rng.random() * 0.4;
    default: return 0.1 + rng.random() * 0.4;
  }
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
  const descriptions = WEATHER_DESCRIPTIONS[type];

  return {
    type,
    description: rng.pick(descriptions),
    persistenceTurnsLeft: getPersistence(type, rng),
    intensity: getIntensity(type, rng),
    windDirection: rng.pick(WIND_DIRECTIONS),
    windSpeed: type === 'blizzard' ? 80 + rng.int(0, 20) : rng.int(5, 40),
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

  if (type === 'blizzard' || type === 'heavy_rain') {
    if (category === 'environmental' || category === 'seasonal') {
      mult *= 1.0 + intensity * 0.5;
    }
    if (category === 'predator') {
      mult *= 1.0 - intensity * 0.2;
    }
    if (category === 'foraging') {
      mult *= 1.0 - intensity * 0.3;
    }
  }

  if (type === 'heat_wave' || type === 'drought_conditions') {
    if (category === 'foraging') {
      mult *= 1.0 - intensity * 0.3;
    }
    if (category === 'health') {
      mult *= 1.0 + intensity * 0.3;
    }
    if (category === 'environmental') {
      mult *= 1.0 + intensity * 0.4;
    }
  }

  if (type === 'frost' || type === 'snow') {
    if (category === 'seasonal') {
      mult *= 1.0 + intensity * 0.3;
    }
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

  if (type === 'blizzard') {
    result.weightChange = -2 * intensity;
    result.statModifiers.push({ stat: StatId.CLI, amount: Math.round(10 * intensity), duration: 1 });
  } else if (type === 'heat_wave') {
    result.weightChange = -1.5 * intensity;
    result.statModifiers.push({ stat: StatId.CLI, amount: Math.round(8 * intensity), duration: 1 });
  } else if (type === 'drought_conditions') {
    result.weightChange = -1 * intensity;
    result.statModifiers.push({ stat: StatId.HOM, amount: Math.round(5 * intensity), duration: 1 });
  } else if (type === 'heavy_rain') {
    result.statModifiers.push({ stat: StatId.CLI, amount: Math.round(4 * intensity), duration: 1 });
  } else if (type === 'frost') {
    result.weightChange = -0.5 * intensity;
  }

  return result;
}

export function weatherLabel(type: WeatherType): string {
  switch (type) {
    case 'clear': return 'Clear';
    case 'cloudy': return 'Cloudy';
    case 'rain': return 'Rain';
    case 'heavy_rain': return 'Heavy Rain';
    case 'snow': return 'Snow';
    case 'blizzard': return 'Blizzard';
    case 'fog': return 'Fog';
    case 'heat_wave': return 'Heat Wave';
    case 'frost': return 'Frost';
    case 'drought_conditions': return 'Drought';
  }
}
