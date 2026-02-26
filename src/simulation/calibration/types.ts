import type { Season } from '../../types/world';

/** Annual mortality rate for a specific cause */
export interface MortalityCause {
  id: string;
  label: string;
  /** Annual mortality rate (e.g., 0.05 = 5% of adults die per year from this) */
  annualRate: number;
  /** Seasonal weighting. If omitted, rate is uniform across seasons. */
  seasonalWeights?: Record<Season, number>;
  /** Event category this maps to (for deduplication with hardcoded events) */
  eventCategory: string;
}

/** Complete mortality profile for a species */
export interface MortalityProfile {
  speciesId: string;
  /** Annual adult survival rate in good condition (e.g., 0.75 = 75%) */
  baseAnnualSurvival: number;
  /** Number of game turns per year */
  turnsPerYear: number;
  /** Individual mortality causes */
  causes: MortalityCause[];
}

/** Calibrated per-turn rates derived from a mortality profile */
export interface CalibratedRates {
  speciesId: string;
  /** Per-turn encounter probability for each cause */
  encounterRates: Record<string, number>;
  /** Per-turn encounter rate adjusted for current season */
  seasonalRate: (causeId: string, season: Season) => number;
}
