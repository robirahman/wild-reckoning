import type { StatId } from './stats';
import type { StatEffect, Consequence, EscapeOption } from './events';

export interface EventOutcome {
  eventId: string;
  eventNarrative: string;
  choiceLabel?: string;
  choiceId?: string;
  narrativeResult?: string;
  /** Every stat effect from this event: the encounter itself plus the choice */
  statEffects: StatEffect[];
  /** The part of statEffects that came from the player's choice */
  choiceStatEffects?: StatEffect[];
  consequences: Consequence[];
  deathRollSurvived?: boolean;
  deathRollProbability?: number;
}

export interface PendingDeathRoll {
  eventId: string;
  choiceId: string;
  baseProbability: number;
  cause: string;
  escapeOptions: EscapeOption[];
}

export interface TurnResult {
  eventOutcomes: EventOutcome[];
  healthNarratives: string[];
  weightChange: number;
  newParasites: string[];
  newInjuries: string[];
  statDelta: Record<StatId, number>;
  pendingDeathRolls?: PendingDeathRoll[];
  journalEntry?: string;
  /** Short system notes shown above the results, e.g. why fast-forward paused */
  notices?: string[];
}

/** What happened while fast-forward skipped several turns at once */
export interface TimeSkipSummary {
  turnsAdvanced: number;
  turnsRequested: number;
  from: { month: string; year: number; season: string };
  to: { month: string; year: number; season: string };
  weightChange: number;
  developments: string[];
  /** Set when the skip stopped early because something important happened */
  stoppedFor?: string;
}
