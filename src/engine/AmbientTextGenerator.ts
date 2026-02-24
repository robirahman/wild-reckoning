import type { Rng } from './RandomUtils';
import type { Season } from '../types/world';
import { AMBIENT_TEXTS, type AmbientTextEntry } from '../data/ambientText';

interface AmbientTextContext {
  season: Season;
  speciesId: string;
  regionId: string;
  weatherType?: string;
  rng: Rng;
}

export function generateAmbientText(ctx: AmbientTextContext): string | null {
  const eligible: { entry: AmbientTextEntry; weight: number }[] = [];

  for (const entry of AMBIENT_TEXTS) {
    if (entry.seasons && !entry.seasons.includes(ctx.season)) continue;
    if (entry.speciesIds && !entry.speciesIds.includes(ctx.speciesId)) continue;
    if (entry.regionIds && !entry.regionIds.includes(ctx.regionId)) continue;
    if (entry.weatherTypes && (!ctx.weatherType || !entry.weatherTypes.includes(ctx.weatherType))) continue;

    // Species/region/weather-specific entries get a bonus weight for relevance
    let w = entry.weight ?? 1;
    if (entry.speciesIds) w *= 2;
    if (entry.regionIds) w *= 1.5;
    if (entry.weatherTypes) w *= 1.5;

    eligible.push({ entry, weight: w });
  }

  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0);
  let roll = ctx.rng.random() * totalWeight;

  for (const { entry, weight } of eligible) {
    roll -= weight;
    if (roll <= 0) return entry.text;
  }

  return eligible[eligible.length - 1].entry.text;
}
