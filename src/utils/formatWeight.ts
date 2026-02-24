import type { SpeciesConfig } from '../types/speciesConfig';

/**
 * Format a weight value for display using species-specific units.
 * E.g., for monarch butterflies: "399 mg" instead of "0.00088 lbs"
 */
export function formatWeight(weightInLbs: number, config: SpeciesConfig): string {
  const unit = config.weightUnit ?? 'lbs';
  const multiplier = config.weightDisplayMultiplier ?? 1;
  const displayValue = weightInLbs * multiplier;

  if (multiplier > 1) {
    return `${Math.round(displayValue).toLocaleString()} ${unit}`;
  }
  return `${Number(displayValue.toFixed(1))} ${unit}`;
}

/**
 * Format a weight delta (change) with +/- sign.
 */
export function formatWeightDelta(deltaInLbs: number, config: SpeciesConfig): string {
  const unit = config.weightUnit ?? 'lbs';
  const multiplier = config.weightDisplayMultiplier ?? 1;
  const displayValue = deltaInLbs * multiplier;
  const sign = displayValue > 0 ? '+' : '';

  if (multiplier > 1) {
    return `${sign}${Math.round(displayValue).toLocaleString()} ${unit}`;
  }
  return `${sign}${Number(displayValue.toFixed(1))} ${unit}`;
}
