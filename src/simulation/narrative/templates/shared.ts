import type { Rng } from '../../../engine/RandomUtils';
import type { NarrativeEnvironment } from '../types';

// ══════════════════════════════════════════════════
//  SHARED NARRATIVE FRAGMENT INFRASTRUCTURE
// ══════════════════════════════════════════════════

/**
 * A narrative fragment with optional contextual filters.
 * When multiple fragments match the current context, one is picked at random.
 * More specific fragments (with more filters) are preferred over generic ones.
 */
export interface ContextualFragment {
  /** Fragment text */
  text: string;

  // ── Optional contextual filters ──
  // Omitted filters match any value.

  /** Season filter */
  season?: string;
  /** Terrain filter (matches NarrativeEnvironment.terrain label or raw node type) */
  terrain?: string;
  /** Weather filter */
  weather?: string;
  /** Time of day filter */
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  /** Whether this fragment is for a recurring event (animal has seen this before) */
  isRecurring?: boolean;
}

/**
 * Context for fragment selection, derived from NarrativeEnvironment + optional extras.
 */
export interface FragmentContext {
  season?: string;
  terrain?: string;
  weather?: string;
  timeOfDay?: string;
  isRecurring?: boolean;
}

/**
 * Build a FragmentContext from a NarrativeEnvironment.
 */
export function toFragmentContext(
  env: NarrativeEnvironment,
  isRecurring?: boolean,
): FragmentContext {
  return {
    season: env.season,
    terrain: env.terrain,
    weather: env.weather,
    timeOfDay: env.timeOfDay,
    isRecurring,
  };
}

/**
 * Count how many contextual filters a fragment specifies.
 * More specific = higher score.
 */
function specificity(f: ContextualFragment): number {
  let score = 0;
  if (f.season !== undefined) score++;
  if (f.terrain !== undefined) score++;
  if (f.weather !== undefined) score++;
  if (f.timeOfDay !== undefined) score++;
  if (f.isRecurring !== undefined) score++;
  return score;
}

/**
 * Check whether a fragment's filters match the given context.
 * Omitted filters are treated as wildcards (match anything).
 */
function matches(f: ContextualFragment, ctx: FragmentContext): boolean {
  if (f.season !== undefined && f.season !== ctx.season) return false;
  if (f.terrain !== undefined && ctx.terrain && !ctx.terrain.includes(f.terrain)) return false;
  if (f.weather !== undefined && f.weather !== ctx.weather) return false;
  if (f.timeOfDay !== undefined && f.timeOfDay !== ctx.timeOfDay) return false;
  if (f.isRecurring !== undefined && f.isRecurring !== ctx.isRecurring) return false;
  return true;
}

/**
 * Pick a contextual fragment from a pool based on the current context.
 *
 * Strategy:
 * 1. Filter to all fragments whose conditions match the context
 * 2. Among matches, prefer the most specific (most filters)
 * 3. Pick randomly from the most-specific tier
 * 4. Fallback: pick any fragment if nothing matches
 */
export function pickContextual(
  pool: ContextualFragment[],
  ctx: FragmentContext,
  rng: Rng,
): ContextualFragment {
  // Find all matching fragments
  const matched = pool.filter((f) => matches(f, ctx));

  if (matched.length === 0) {
    // Fallback: pick any fragment
    return pool[rng.int(0, pool.length - 1)];
  }

  // Find the highest specificity among matches
  const maxSpec = Math.max(...matched.map(specificity));

  // Pick from the most specific tier
  const best = matched.filter((f) => specificity(f) === maxSpec);
  return best[rng.int(0, best.length - 1)];
}

/**
 * Pick text from a contextual fragment pool.
 * Convenience wrapper that returns just the text string.
 */
export function pickContextualText(
  pool: ContextualFragment[],
  ctx: FragmentContext,
  rng: Rng,
): string {
  return pickContextual(pool, ctx, rng).text;
}

/**
 * Generic pick from a plain string pool.
 * Re-exported here for convenience so callers don't need to import from each template file.
 */
export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
