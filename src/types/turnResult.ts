import type { StatId } from './stats';
import type { StatEffect, Consequence } from './events';

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

export interface TurnResult {
  eventOutcomes: EventOutcome[];
  healthNarratives: string[];
  weightChange: number;
  newParasites: string[];
  newInjuries: string[];
  statDelta: Record<StatId, number>;
}
