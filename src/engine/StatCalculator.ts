import { StatId, computeEffectiveValue } from '../types/stats';
import type { StatBlock, StatValue, StatModifier } from '../types/stats';

/** Tick all stat modifiers: decrease durations, remove expired ones */
export function tickModifiers(stats: StatBlock): StatBlock {
  const result = { ...stats };

  for (const statId of Object.values(StatId)) {
    const stat = result[statId];
    const updatedModifiers = stat.modifiers
      .map((mod) => {
        if (mod.duration === undefined) return mod; // Permanent
        return { ...mod, duration: mod.duration - 1 };
      })
      .filter((mod) => mod.duration === undefined || mod.duration > 0);

    result[statId] = { ...stat, modifiers: updatedModifiers };
  }

  return result;
}

/** Add a modifier to the appropriate stat in the stat block */
export function addModifier(stats: StatBlock, modifier: StatModifier): StatBlock {
  const statId = modifier.stat;
  const stat = stats[statId];
  return {
    ...stats,
    [statId]: {
      ...stat,
      modifiers: [...stat.modifiers, modifier],
    },
  };
}

/** Remove all modifiers with a given source ID */
export function removeModifiersBySource(stats: StatBlock, sourceId: string): StatBlock {
  const result = { ...stats };

  for (const statId of Object.values(StatId)) {
    const stat = result[statId];
    const filtered = stat.modifiers.filter((m) => m.id !== sourceId);
    if (filtered.length !== stat.modifiers.length) {
      result[statId] = { ...stat, modifiers: filtered };
    }
  }

  return result;
}

/** Get the effective value for a single stat */
export function getEffective(stat: StatValue): number {
  return computeEffectiveValue(stat);
}

/** Get effective values for all stats as a flat record */
export function getAllEffective(stats: StatBlock): Record<StatId, number> {
  const result = {} as Record<StatId, number>;
  for (const statId of Object.values(StatId)) {
    result[statId] = computeEffectiveValue(stats[statId]);
  }
  return result;
}

/** Create an initial stat block with given base values and no modifiers */
export function createStatBlock(bases: Record<StatId, number>): StatBlock {
  const block = {} as StatBlock;
  for (const statId of Object.values(StatId)) {
    block[statId] = {
      base: bases[statId] ?? 50,
      modifiers: [],
    };
  }
  return block;
}
