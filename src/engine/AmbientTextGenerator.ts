import type { Rng } from './RandomUtils';
import type { Season } from '../types/world';
import { AMBIENT_TEXTS, type AmbientTextEntry } from '../data/ambientText';
import type { TurnResult } from '../types/turnResult';

interface AmbientTextContext {
  season: Season;
  speciesId: string;
  regionId: string;
  weatherType?: string;
  rng: Rng;
  animalSex?: 'male' | 'female';
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

/**
 * Synthesizes a cohesive journal entry from turn results and ambient context.
 */
export function synthesizeJournalEntry(result: TurnResult, ctx: AmbientTextContext): string {
  const ambient = generateAmbientText(ctx) ?? "The days passed in a blur of survival.";
  const sex = ctx.animalSex ?? 'female';
  const pronoun = sex === 'female' ? 'She' : 'He';
  
  let journal = ambient;

  if (result.newInjuries.length > 0) {
    journal += ` The week was harsh, leaving ${pronoun.toLowerCase()} with a ${result.newInjuries[0].toLowerCase()}.`;
  } else if (result.weightChange < -0.5) {
    journal += ` Hunger is a constant companion; ${pronoun.toLowerCase()} grew noticeably thinner.`;
  } else if (result.weightChange > 0.5) {
    journal += ` A rare week of bounty allowed ${pronoun.toLowerCase()} to put on some much-needed weight.`;
  }

  if (result.newParasites.length > 0) {
    journal += ` Something is wrong within — a sickness takes root.`;
  }

  return journal;
}
