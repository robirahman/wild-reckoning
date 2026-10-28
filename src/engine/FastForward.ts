/** Fast-forward: how much time one skip covers, and how it's described to the player */

import type { ResolvedEvent } from '../types/events';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { TimeSkipSummary } from '../types/turnResult';
import { describeTurnSpan } from '../utils/timeSpan';
import { formatWeight } from '../utils/formatWeight';

/** Turns of the animal's life simulated per fast-forwarded turn */
export const FAST_FORWARD_TURNS = 12;

type TurnUnit = NonNullable<SpeciesConfig['turnUnit']>;

export function fastForwardLabel(turnUnit: TurnUnit = 'week'): string {
  return `Skip ahead: ${describeTurnSpan(FAST_FORWARD_TURNS, turnUnit)} per turn`;
}

/** A passive card at the top of the next turn summarizing a skip */
export function timeSkipEvent(skip: TimeSkipSummary, config: SpeciesConfig, turn: number): ResolvedEvent {
  const span = describeTurnSpan(skip.turnsAdvanced, config.turnUnit);
  const sentences = [
    skip.from.month === skip.to.month && skip.from.year === skip.to.year
      ? `${span[0].toUpperCase()}${span.slice(1)} pass.`
      : `${span[0].toUpperCase()}${span.slice(1)} pass, ${skip.from.month} to ${skip.to.month}.`,
  ];
  if (Math.abs(skip.weightChange) >= 0.05) {
    sentences.push(`You ${skip.weightChange > 0 ? 'gained' : 'lost'} ${formatWeight(Math.abs(skip.weightChange), config)}.`);
  }
  sentences.push(...skip.developments);
  if (skip.stoppedFor) {
    sentences.push(`Fast-forward paused early because of ${skip.stoppedFor}.`);
  }
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
