import type { StatId } from './stats';
import type { StatEffect, Consequence, EscapeOption } from './events';

export interface EventOutcome {
  eventId: string;
  eventNarrative: string;
  choiceLabel?: string;
  choiceId?: string;
  narrativeResult?: string;
  statEffects: StatEffect[];
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
}
