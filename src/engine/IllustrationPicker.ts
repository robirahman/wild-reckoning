import type { GameEvent, EventCategory } from '../types/events';
import type { Rng } from './RandomUtils';
import { ILLUSTRATION_POOLS, TAG_ILLUSTRATIONS } from '../data/illustrations';

/**
 * Pick an illustration for an event based on its tags and category.
 * Returns undefined if no illustration is available.
 */
export function pickIllustration(event: GameEvent, rng: Rng): string | undefined {
  // First check tag-based overrides
  for (const tag of event.tags) {
    const pool = TAG_ILLUSTRATIONS[tag];
    if (pool && pool.length > 0) {
      return rng.pick(pool);
    }
  }

  // Fall back to category pool
  const categoryPool = ILLUSTRATION_POOLS[event.category as EventCategory];
  if (categoryPool && categoryPool.length > 0) {
    return rng.pick(categoryPool);
  }

  return undefined;
}
