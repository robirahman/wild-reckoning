import type { EventCondition, StatEffect, Consequence, EventChoice } from './events';

export interface StorylineStep {
  id: string;
  /** Minimum turns after previous step (or storyline start) before this step triggers */
  delayMin: number;
  /** Maximum turns delay */
  delayMax: number;
  /** Additional conditions for this step */
  conditions?: EventCondition[];
  /** Narrative text shown as a passive event */
  narrativeText: string;
  footnote?: string;
  statEffects: StatEffect[];
  consequences: Consequence[];
  /** Flag set when this step triggers (used to track progression) */
  completionFlag: string;
  /** If present, this step shows as an active event with choices */
  choices?: EventChoice[];
  /** If a choice leads to a specific next step ID instead of sequential advancement */
  branchMap?: Record<string, number>;  // choiceId -> step index to jump to
}

export interface StorylineDefinition {
  id: string;
  name: string;
  /** Species this storyline applies to (empty = all species) */
  speciesIds: string[];
  /** Conditions to start this storyline */
  startConditions: EventCondition[];
  /** Probability of starting per eligible turn */
  startChance: number;
  /** The sequence of steps */
  steps: StorylineStep[];
  /** Tags for behavioral influence */
  tags: string[];
}

export interface ActiveStoryline {
  definitionId: string;
  currentStepIndex: number;
  turnsAtCurrentStep: number;
  startedOnTurn: number;
  /** Tracks which choices were made at each step (stepIndex -> choiceId) */
  choicesMade?: Record<number, string>;
}
