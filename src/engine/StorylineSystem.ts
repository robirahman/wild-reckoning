import type { ActiveStoryline, StorylineDefinition, StorylineStep } from '../types/storyline';
import type { AnimalState } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { ResolvedEvent } from '../types/events';
import type { Rng } from './RandomUtils';
import type { NPC } from '../types/npc';
import { resolveTemplate } from './EventGenerator';
import { computeEffectiveValue } from '../types/stats';
import { STORYLINES } from '../data/storylines';
import { STORYLINE_ADVANCE_CHANCE } from './constants';

interface StorylineContext {
  animal: AnimalState;
  time: TimeState;
  behavior: BehavioralSettings;
  config: SpeciesConfig;
  rng: Rng;
  npcs: NPC[];
  activeStorylines: ActiveStoryline[];
  currentEvents?: ResolvedEvent[];
}

interface StorylineTickResult {
  /** New storylines started */
  newStorylines: ActiveStoryline[];
  /** Updated active storylines (with advanced step indices) */
  updatedStorylines: ActiveStoryline[];
  /** Resolved events injected into the turn */
  injectedEvents: ResolvedEvent[];
}

function checkStorylineConditions(
  def: StorylineDefinition,
  ctx: StorylineContext,
): boolean {
  // Check species restriction
  if (def.speciesIds.length > 0 && !def.speciesIds.includes(ctx.animal.speciesId)) {
    return false;
  }

  // Check start conditions using a simple inline checker
  for (const cond of def.startConditions) {
    switch (cond.type) {
      case 'season':
        if (!cond.seasons.includes(ctx.time.season)) return false;
        break;
      case 'age_range':
        if (cond.min !== undefined && ctx.animal.age < cond.min) return false;
        if (cond.max !== undefined && ctx.animal.age > cond.max) return false;
        break;
      case 'has_flag':
        if (!ctx.animal.flags.has(cond.flag)) return false;
        break;
      case 'stat_above': {
        const val = computeEffectiveValue(ctx.animal.stats[cond.stat]);
        if (val <= cond.threshold) return false;
        break;
      }
      default:
        break;
    }
  }

  return true;
}

function createStorylineEvent(
  step: StorylineStep,
  def: StorylineDefinition,
  ctx: StorylineContext,
): ResolvedEvent {
  // Build a minimal GenerationContext for template resolution
  const templateCtx = {
    animal: ctx.animal,
    time: ctx.time,
    behavior: ctx.behavior,
    cooldowns: {},
    rng: ctx.rng,
    events: [],
    config: ctx.config,
    npcs: ctx.npcs,
  };

  const resolvedNarrative = resolveTemplate(step.narrativeText, templateCtx);

  // Inject completion flag as a consequence so storylines don't restart
  const consequences = [...step.consequences];
  if (step.completionFlag) {
    consequences.push({ type: 'set_flag', flag: step.completionFlag });
  }

  const isActive = step.choices && step.choices.length > 0;

  return {
    definition: {
      id: `storyline-${def.id}-${step.id}`,
      type: isActive ? 'active' : 'passive',
      category: 'environmental',
      narrativeText: step.narrativeText,
      statEffects: step.statEffects,
      consequences,
      choices: isActive ? step.choices : undefined,
      conditions: [],
      weight: 0,
      tags: def.tags,
      footnote: step.footnote ?? `Part of "${def.name}"`,
    },
    resolvedNarrative,
    triggeredSubEvents: [],
  };
}

/**
 * Process storylines for a turn: start new ones, advance active ones, inject events.
 */
export function tickStorylines(ctx: StorylineContext): StorylineTickResult {
  const newStorylines: ActiveStoryline[] = [];
  const updatedStorylines: ActiveStoryline[] = [];
  const injectedEvents: ResolvedEvent[] = [];

  const activeIds = new Set(ctx.activeStorylines.map((s) => s.definitionId));

  // Check for new storylines to start
  for (const def of STORYLINES) {
    if (activeIds.has(def.id)) continue;

    // Don't restart completed storylines (check all terminal step completion flags)
    const anyStepCompleted = def.steps.some(
      (step) => step.completionFlag && ctx.animal.flags.has(step.completionFlag)
    );
    if (anyStepCompleted) continue;

    if (checkStorylineConditions(def, ctx) && ctx.rng.chance(def.startChance)) {
      const newStoryline: ActiveStoryline = {
        definitionId: def.id,
        currentStepIndex: 0,
        turnsAtCurrentStep: 0,
        startedOnTurn: ctx.time.turn,
      };

      // Immediately trigger the first step
      const step = def.steps[0];
      injectedEvents.push(createStorylineEvent(step, def, ctx));

      newStorylines.push({
        ...newStoryline,
        turnsAtCurrentStep: 1,
      });
    }
  }

  // Advance existing storylines
  for (const active of ctx.activeStorylines) {
    const def = STORYLINES.find((s) => s.id === active.definitionId);
    if (!def) continue;

    const choicesMade: Record<number, string> = { ...(active.choicesMade ?? {}) };

    // Check if current step had choices and record what was chosen
    const currentStep = def.steps[active.currentStepIndex];
    if (currentStep.choices && ctx.currentEvents) {
      const storylineEventId = `storyline-${def.id}-${currentStep.id}`;
      const matchingEvent = ctx.currentEvents.find(e => e.definition.id === storylineEventId);
      if (matchingEvent?.choiceMade) {
        choicesMade[active.currentStepIndex] = matchingEvent.choiceMade;
      }
    }

    // Determine next step index using branchMap if a choice was made
    let nextIndex = active.currentStepIndex + 1;
    if (currentStep.branchMap && choicesMade[active.currentStepIndex]) {
      const branchTarget = currentStep.branchMap[choicesMade[active.currentStepIndex]];
      if (branchTarget !== undefined) nextIndex = branchTarget;
    }

    if (nextIndex >= def.steps.length) {
      // Storyline complete, don't keep tracking it
      continue;
    }

    const nextStep = def.steps[nextIndex];
    const turnsWaited = active.turnsAtCurrentStep + 1;

    // Check if delay has been met
    if (turnsWaited >= nextStep.delayMin) {
      const shouldTrigger = turnsWaited >= nextStep.delayMax || ctx.rng.chance(STORYLINE_ADVANCE_CHANCE);

      if (shouldTrigger) {
        injectedEvents.push(createStorylineEvent(nextStep, def, ctx));
        updatedStorylines.push({
          ...active,
          currentStepIndex: nextIndex,
          turnsAtCurrentStep: 0,
          choicesMade,
        });
        continue;
      }
    }

    // Still waiting
    updatedStorylines.push({
      ...active,
      turnsAtCurrentStep: turnsWaited,
      choicesMade,
    });
  }

  return { newStorylines, updatedStorylines, injectedEvents };
}
