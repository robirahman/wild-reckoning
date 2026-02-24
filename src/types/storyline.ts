import type { EventCondition, StatEffect, Consequence } from './events';

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
}
