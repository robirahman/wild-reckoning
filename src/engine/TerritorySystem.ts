/** Phase 6: Territory/Home Range engine */

import type { TerritoryState } from '../types/territory';
import type { Rng } from './RandomUtils';

/** Territorial species IDs — others ignore territory mechanics */
export const TERRITORIAL_SPECIES = new Set([
  'white-tailed-deer',
  'gray-wolf',
  'african-elephant',
  'polar-bear',
  'common-octopus',
  'poison-dart-frog',
]);

export function tickTerritory(
  territory: TerritoryState,
  speciesId: string,
  rng: Rng,
): TerritoryState {
  if (!TERRITORIAL_SPECIES.has(speciesId)) return territory;
  if (!territory.established) return territory;

  let { quality, contested, markedTurns, intruderPresent } = territory;

  // Territory degrades without regular marking
  markedTurns++;
  if (markedTurns > 4) {
    quality = Math.max(0, quality - 3);
    // Higher chance of intruder when unmarked
    if (rng.chance(0.15)) {
      intruderPresent = true;
      contested = true;
    }
  }

  // Quality naturally drifts slightly
  if (rng.chance(0.1)) {
    quality = Math.max(0, Math.min(100, quality + rng.int(-2, 2)));
  }

  // Contested territory loses quality
  if (contested) {
    quality = Math.max(0, quality - 2);
  }

  // Intruders may leave on their own
  if (intruderPresent && rng.chance(0.2)) {
    intruderPresent = false;
    contested = false;
  }

  return { ...territory, quality, contested, markedTurns, intruderPresent };
}

/**
 * Weight gain modifier based on territory quality.
 * Returns a multiplier: 0.7 (poor) to 1.3 (excellent).
 */
export function territoryWeightModifier(territory: TerritoryState): number {
  if (!territory.established) return 1.0;
  return 0.7 + (territory.quality / 100) * 0.6;
}
