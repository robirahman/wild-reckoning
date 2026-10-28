/**
 * The animal's most urgent pull, as the animal feels it. The game speaks only
 * from inside the animal: what it senses and what its body urges, never advice
 * about the game's controls, which the animal knows nothing about.
 */

import type { InstinctNudge } from '../simulation/instinct/types';
import type { BehavioralSettings } from '../types/behavior';

const PRIORITY: Record<InstinctNudge['priority'], number> = { high: 2, medium: 1, low: 0 };

/** How an instinct's pull on a behavior feels, in the animal's terms (no settings named) */
export const INSTINCT_URGES: Record<keyof BehavioralSettings, Record<'increase' | 'decrease', string>> = {
  foraging: { increase: 'The urge to eat crowds out everything else.', decrease: 'Eating can wait.' },
  caution: { increase: 'You want to slow down and watch.', decrease: 'The wariness in you eases.' },
  exploration: { increase: 'You want to move on from here.', decrease: 'You want to stay where you are.' },
  belligerence: { increase: 'Something in you wants a fight.', decrease: 'You want no trouble.' },
  mating: { increase: 'Nothing matters but finding a mate.', decrease: 'The pull toward a mate has gone quiet.' },
  sociability: { increase: 'You want others of your kind close.', decrease: 'You want to be alone.' },
};

export function instinctUrge(behavior: keyof BehavioralSettings, direction: 'increase' | 'decrease'): string {
  return INSTINCT_URGES[behavior][direction];
}

/** The sensation behind the most urgent instinct, or null when nothing presses */
export function mostPressingSensation(nudges: InstinctNudge[]): string | null {
  const top = nudges
    .filter((n) => n.priority !== 'low')
    .sort((a, b) => PRIORITY[b.priority] - PRIORITY[a.priority])[0];
  return top?.description ?? null;
}
