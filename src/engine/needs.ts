/**
 * The animal's most urgent pull, as the animal feels it. The game speaks only
 * from inside the animal: what it senses and what its body urges, never advice
 * about the game's controls, which the animal knows nothing about.
 */

import type { InstinctNudge } from '../simulation/instinct/types';

const PRIORITY: Record<InstinctNudge['priority'], number> = { high: 2, medium: 1, low: 0 };

/** The sensation behind the most urgent instinct, or null when nothing presses */
export function mostPressingSensation(nudges: InstinctNudge[]): string | null {
  const top = nudges
    .filter((n) => n.priority !== 'low')
    .sort((a, b) => PRIORITY[b.priority] - PRIORITY[a.priority])[0];
  return top?.description ?? null;
}
