import type { AnatomyIndex } from './types';
import type { BodyState } from './bodyState';
import type { StatModifier } from '../../types/stats';

/**
 * Recompute all capability levels from current body part health.
 *
 * Each capability's effectiveness (0-100) is the weighted sum of its contributing
 * body parts' health. A body part's health is 100 minus its worst tissue damage.
 *
 * Returns updated capabilities map and stat modifiers for impairment.
 */
export function recomputeCapabilities(
  bodyState: BodyState,
  anatomy: AnatomyIndex,
): { capabilities: Record<string, number>; modifiers: StatModifier[] } {
  const capabilities: Record<string, number> = {};
  const modifiers: StatModifier[] = [];

  for (const [capId, capDef] of anatomy.capabilityById) {
    let totalWeight = 0;
    let weightedHealth = 0;

    // Sum contributions from all body parts
    for (const part of anatomy.definition.bodyParts) {
      for (const contrib of part.capabilityContributions) {
        if (contrib.capabilityId !== capId) continue;

        const partState = bodyState.parts[part.id];
        if (!partState || partState.destroyed) {
          // Destroyed part contributes 0 health
          totalWeight += contrib.weight;
          continue;
        }

        // Part health = 100 - max tissue damage across all tissues
        const maxDamage = Math.max(
          0,
          ...Object.values(partState.tissueDamage),
        );
        const partHealth = Math.max(0, 100 - maxDamage);

        weightedHealth += partHealth * contrib.weight;
        totalWeight += contrib.weight;
      }
    }

    // Effectiveness is the weighted average health of contributing parts
    const effectiveness = totalWeight > 0 ? Math.round(weightedHealth / totalWeight) : 100;
    capabilities[capId] = Math.max(0, Math.min(100, effectiveness));

    // Convert impairment to stat modifiers
    const impairment = 100 - effectiveness;
    if (impairment > 0) {
      for (const mapping of capDef.statMappings) {
        const amount = Math.round(impairment * mapping.perPointImpairment);
        if (amount !== 0) {
          modifiers.push({
            id: `capability-${capId}-${mapping.stat}`,
            source: `${capDef.label} Impairment`,
            sourceType: 'condition',
            stat: mapping.stat,
            amount,
          });
        }
      }
    }
  }

  return { capabilities, modifiers };
}

/**
 * Check if any survival-critical capability has fully failed.
 * Returns the death cause string if so, undefined otherwise.
 */
export function checkCapabilityDeath(
  bodyState: BodyState,
  anatomy: AnatomyIndex,
): string | undefined {
  for (const [capId, capDef] of anatomy.capabilityById) {
    if (!capDef.survivalCritical) continue;
    const effectiveness = bodyState.capabilities[capId] ?? 100;
    if (effectiveness <= 0) {
      return capDef.deathCause ?? `Critical ${capDef.label} failure`;
    }
  }
  return undefined;
}
