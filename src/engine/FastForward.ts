/** Fast-forward: how much time one skip covers, and how the animal lives through it */

import type { ResolvedEvent } from '../types/events';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { TimeSkipSummary } from '../types/turnResult';
import { describeTurnSpan } from '../utils/timeSpan';

/** Turns of the animal's life simulated per fast-forwarded turn */
export const FAST_FORWARD_TURNS = 12;

type TurnUnit = NonNullable<SpeciesConfig['turnUnit']>;

export function fastForwardLabel(turnUnit: TurnUnit = 'week'): string {
  return `Skip ahead: ${describeTurnSpan(FAST_FORWARD_TURNS, turnUnit)} per turn`;
}

// The animal doesn't count weeks or name months, and knows nothing of the
// game skipping ahead. It only feels time blur, the air change, and its own
// body change. The header and identity panel carry the exact figures.

const TIME_BLUR: Record<TurnUnit, string> = {
  day: 'The hours run together.',
  week: 'The days run together.',
  month: 'The days run together.',
};

function temperatureSentence(change: number | undefined): string | null {
  if (change === undefined || Math.abs(change) < 8) return null;
  if (change <= -20) return 'The deep cold has come.';
  if (change < 0) return 'It is colder now.';
  if (change >= 20) return 'The heat has come.';
  return 'It is warmer now.';
}

function bodySentence(weightChange: number, startWeight: number): string | null {
  const relative = startWeight > 0 ? weightChange / startWeight : 0;
  if (relative >= 0.04) return 'Your body is heavier and fuller than it was.';
  if (relative <= -0.12) return 'You have grown thin. The hunger does not let up.';
  if (relative <= -0.04) return 'You are lighter than you were.';
  return null;
}

/** A passive card at the top of the next turn, describing the skipped time as the animal lived it */
export function timeSkipEvent(skip: TimeSkipSummary, config: SpeciesConfig, turn: number): ResolvedEvent {
  const sentences = [
    TIME_BLUR[config.turnUnit ?? 'week'],
    temperatureSentence(skip.temperatureChange),
    bodySentence(skip.weightChange, skip.startWeight),
    ...skip.developments,
  ].filter((s): s is string => !!s);
  const text = sentences.join(' ');

  return {
    definition: {
      id: `time-skip-${turn}`,
      type: 'passive',
      category: 'environmental',
      narrativeText: text,
      statEffects: [],
      consequences: [],
      conditions: [],
      weight: 0,
      tags: ['time-skip'],
    },
    resolvedNarrative: text,
    triggeredSubEvents: [],
    preApplied: true,
  };
}
