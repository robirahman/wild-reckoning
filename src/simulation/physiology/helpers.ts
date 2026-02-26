import type { TimeState, RegionDefinition } from '../../types/world';
import type { WeatherState } from '../../engine/WeatherSystem';
import type { BodyState } from '../anatomy/bodyState';
import type { SpeciesConfig } from '../../types/speciesConfig';

/**
 * Compute forage quality (0-1) from region flora, season, and map node.
 * 1.0 = the richest possible forage a deer could find.
 */
export function computeForageQuality(
  regionDef: RegionDefinition | undefined,
  time: TimeState,
  nodeType: string | undefined,
  nodeResources: { food: number } | undefined,
): number {
  if (!regionDef) return 0.5;

  // Sum nutritive value × abundance for all available flora this month
  let totalNutrition = 0;
  let floraCount = 0;

  for (const flora of regionDef.flora) {
    if (flora.availableSeasons.includes(time.season)) {
      const abundance = flora.abundanceByMonth[time.monthIndex] ?? 0;
      if (abundance > 0) {
        totalNutrition += (flora.nutritiveValue / 100) * abundance;
        floraCount++;
      }
    }
  }

  // Normalize: if 3+ good food sources are available at decent abundance, quality ≈ 1.0
  const floraQuality = floraCount > 0
    ? Math.min(1, totalNutrition / 1.5)
    : 0.1; // Bare minimum (bark, dead leaves)

  // Map node food resources (0-100 scale)
  const nodeModifier = nodeResources
    ? 0.5 + (nodeResources.food / 100) * 0.5 // 0.5–1.0
    : 0.7;

  // Terrain suitability for browsing
  const terrainModifier =
    nodeType === 'forest' ? 1.0 :
    nodeType === 'plain' ? 0.85 :
    nodeType === 'water' ? 0.7 :
    nodeType === 'mountain' ? 0.55 :
    0.75;

  return Math.min(1, floraQuality * nodeModifier * terrainModifier);
}

/**
 * Get ambient temperature (F) from climate profile + weather modifiers.
 */
export function getAmbientTemperature(
  regionDef: RegionDefinition | undefined,
  time: TimeState,
  weather: WeatherState | null,
): number {
  const baseTemp = regionDef?.climate.temperatureByMonth[time.monthIndex] ?? 50;

  let modifier = 0;
  if (weather) {
    if (weather.type === 'blizzard') modifier = -20 * weather.intensity;
    else if (weather.type === 'frost') modifier = -10 * weather.intensity;
    else if (weather.type === 'snow') modifier = -8 * weather.intensity;
    else if (weather.type === 'heat_wave') modifier = 15 * weather.intensity;

    // Wind chill approximation (only matters in cold)
    if (weather.windSpeed > 20 && baseTemp + modifier < 50) {
      modifier -= (weather.windSpeed - 20) * 0.3;
    }
  }

  return baseTemp + modifier;
}

/**
 * Compute average skin tissue damage across all body parts (0-100).
 * Used for insulation loss calculation in thermoregulation.
 */
export function computeAverageSkinDamage(bodyState: BodyState | undefined): number {
  if (!bodyState) return 0;

  let totalSkinDamage = 0;
  let skinPartCount = 0;

  for (const partState of Object.values(bodyState.parts)) {
    const skinDamage = partState.tissueDamage['skin'];
    if (skinDamage !== undefined) {
      totalSkinDamage += skinDamage;
      skinPartCount++;
    }
  }

  return skinPartCount > 0 ? totalSkinDamage / skinPartCount : 0;
}

/**
 * Body Condition Score (1-5) derived from weight relative to species frame.
 * Mirrors the real BCS system used by wildlife biologists.
 *
 * 5 = obese, 4 = fat, 3 = average, 2 = thin, 1 = emaciated
 */
export function computeBodyCondition(weight: number, config: SpeciesConfig): number {
  const midWeight = (config.weight.maximumBiologicalWeight + config.weight.starvationDeath) / 2;
  const ratio = weight / midWeight;

  if (ratio >= 1.3) return 5;
  if (ratio >= 1.1) return 4;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  return 1;
}
