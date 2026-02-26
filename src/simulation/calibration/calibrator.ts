import type { MortalityProfile, CalibratedRates, MortalityCause } from './types';
import type { Season } from '../../types/world';

/**
 * Convert annual mortality rates into per-turn encounter probabilities.
 *
 * The key insight: if an event has annual rate R and there are T turns/year,
 * then per-turn probability p satisfies (1-p)^T = 1-R, so p = 1 - (1-R)^(1/T).
 *
 * However, encounter rate != death rate. A predator encounter doesn't always
 * kill you. We calibrate so that the *encounter* happens at a rate that,
 * combined with the harm resolver's lethality, yields approximately the
 * target mortality rate. We use a lethality estimate of ~20% per encounter
 * as the baseline, so encounter rate = death rate / 0.20.
 */
export function calibrate(profile: MortalityProfile): CalibratedRates {
  const encounterRates: Record<string, number> = {};
  const ASSUMED_LETHALITY = 0.20; // ~20% of encounters are fatal on average

  for (const cause of profile.causes) {
    // Per-turn death probability
    const perTurnDeathRate = 1 - Math.pow(1 - cause.annualRate, 1 / profile.turnsPerYear);
    // Per-turn encounter probability (encounters are more frequent than deaths)
    const perTurnEncounterRate = Math.min(0.5, perTurnDeathRate / ASSUMED_LETHALITY);
    encounterRates[cause.id] = perTurnEncounterRate;
  }

  return {
    speciesId: profile.speciesId,
    encounterRates,
    seasonalRate: (causeId: string, season: Season) => {
      const base = encounterRates[causeId] ?? 0;
      const cause = profile.causes.find((c) => c.id === causeId);
      if (!cause?.seasonalWeights) return base;
      return base * (cause.seasonalWeights[season] ?? 1);
    },
  };
}

/** Get the per-turn encounter rate for a specific cause and season */
export function getEncounterRate(
  rates: CalibratedRates,
  causeId: string,
  season: Season,
): number {
  return rates.seasonalRate(causeId, season);
}
