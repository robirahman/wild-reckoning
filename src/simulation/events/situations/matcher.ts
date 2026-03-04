import type { SimulationContext } from '../types';
import type { Situation, InteractionTemplate, MatchResult } from './types';

// ══════════════════════════════════════════════════
//  TEMPLATE MATCHER
// ══════════════════════════════════════════════════
//
// Matches detected situations against interaction templates.
// A template matches when all its required situations are present.
// Optional situations are collected when present and enhance the event.
//

/**
 * Find all templates that match the current situation set.
 * Returns MatchResult[] sorted by weight (highest first).
 */
export function matchTemplates(
  ctx: SimulationContext,
  situations: Situation[],
  templates: InteractionTemplate[],
): MatchResult[] {
  const results: MatchResult[] = [];
  const typeSet = new Set(situations.map(s => s.type));

  for (const template of templates) {
    // Check all required situations are present
    const allRequired = template.requiredSituations.every(req => typeSet.has(req));
    if (!allRequired) continue;

    // Extra plausibility check
    if (template.extraPlausibility && !template.extraPlausibility(ctx, situations)) continue;

    // Collect relevant situations (required + present optionals)
    const relevantTypes = new Set([
      ...template.requiredSituations,
      ...(template.optionalSituations ?? []),
    ]);
    const relevantSituations = situations.filter(s => relevantTypes.has(s.type));

    // Compute weight
    const weight = template.computeWeight(ctx, relevantSituations);
    if (weight <= 0) continue;

    results.push({ template, situations: relevantSituations, weight });
  }

  // Sort by weight descending for deterministic priority
  results.sort((a, b) => b.weight - a.weight);
  return results;
}
