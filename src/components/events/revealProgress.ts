import type { ResolvedEvent } from '../../types/events';

/** How far through the turn's events the player has been shown */
export interface RevealState {
  /** Identity of the event list the count refers to */
  signature: string;
  count: number;
}

/**
 * Identifies a turn's event list independently of choices made within it.
 * Includes the turn so a turn that repeats last turn's events still resets.
 */
export function eventSignature(events: ResolvedEvent[], turn: number): string {
  return `${turn}:${events.map((e) => e.definition.id).join('|')}`;
}

function awaitsChoice(event: ResolvedEvent): boolean {
  return event.definition.type === 'active' && !!event.definition.choices?.length && !event.choiceMade;
}

/** Reveal everything up to and including the first event still waiting for a choice */
export function revealThroughFirstUnanswered(events: ResolvedEvent[]): number {
  const index = events.findIndex(awaitsChoice);
  return index === -1 ? events.length : index + 1;
}

/**
 * How many events to show after the event list changes. Making or undoing a
 * choice keeps the player's place; appended events (an action's result) are
 * shown at once; a new turn starts from the first event.
 *
 * `prev` is null when mounting onto a turn already in progress (e.g. a
 * resumed save), which picks up at the first unanswered event.
 */
export function nextRevealCount(prev: RevealState | null, events: ResolvedEvent[], turn: number): number {
  if (events.length === 0) return 0;
  if (prev === null) return revealThroughFirstUnanswered(events);

  const signature = eventSignature(events, turn);
  if (signature === prev.signature) return Math.min(Math.max(prev.count, 1), events.length);
  if (signature.startsWith(`${prev.signature}|`)) return events.length;
  return 1;
}
