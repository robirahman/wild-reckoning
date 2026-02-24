/** Phase 9: Trait Inheritance engine */

import type { LineageTraits } from '../types/lineage';
import { StatId } from '../types/stats';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { Rng } from './RandomUtils';

/**
 * Compute inherited trait biases for the next generation.
 * Offspring get ±5% of parent's deviation from species baseline,
 * with diminishing returns per generation and random mutation.
 */
export function computeInheritedTraits(
  parentStats: Record<StatId, number>,
  parentLineage: LineageTraits | null,
  config: SpeciesConfig,
  rng: Rng,
): LineageTraits {
  const generation = (parentLineage?.generation ?? 0) + 1;
  const biases: Partial<Record<StatId, number>> = {};

  // Diminishing returns factor: each generation dilutes inheritance
  const inheritFactor = 0.05 * Math.pow(0.85, generation - 1);

  for (const stat of Object.values(StatId)) {
    const baseline = config.baseStats[stat];
    const parentValue = parentStats[stat];
    const deviation = parentValue - baseline;

    // Inherited bias = fraction of parent's deviation
    let bias = deviation * inheritFactor;

    // Random mutation: small random adjustment
    bias += (rng.random() - 0.5) * 3;

    // Only store meaningful biases
    if (Math.abs(bias) >= 0.5) {
      biases[stat] = Math.round(bias * 10) / 10;
    }
  }

  // Carry forward lineage flags
  const lineageFlags = parentLineage?.lineageFlags ?? [];

  return {
    generation,
    parentFinalStats: { ...parentStats },
    traitBiases: biases,
    lineageFlags,
  };
}

/**
 * Apply inherited biases to a new animal's base stats.
 */
export function applyLineageBiases(
  baseStats: Record<StatId, number>,
  lineage: LineageTraits,
): Record<StatId, number> {
  const result = { ...baseStats };
  for (const [stat, bias] of Object.entries(lineage.traitBiases)) {
    const statId = stat as StatId;
    if (statId in result && bias !== undefined) {
      result[statId] = Math.max(0, Math.min(100, Math.round(result[statId] + bias)));
    }
  }
  return result;
}
