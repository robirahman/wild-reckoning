import type { GameEvent, EventCondition, ResolvedEvent, ResolvedSubEvent } from '../types/events';
import type { AnimalState, Diet } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { SpeciesConfig } from '../types/speciesConfig';
import { StatId, computeEffectiveValue } from '../types/stats';
import type { Rng } from './RandomUtils';

interface GenerationContext {
  animal: AnimalState;
  time: TimeState;
  behavior: BehavioralSettings;
  cooldowns: Record<string, number>;
  rng: Rng;
  events: GameEvent[];
  config: SpeciesConfig;
}

/** Check if a single condition is met */
function checkCondition(cond: EventCondition, ctx: GenerationContext): boolean {
  switch (cond.type) {
    case 'season':
      return cond.seasons.includes(ctx.time.season);
    case 'region':
      return cond.regionIds.includes(ctx.animal.region);
    case 'species':
      return cond.speciesIds.includes(ctx.animal.speciesId);
    case 'diet':
      return cond.diets.includes(ctx.config.diet);
    case 'stat_above': {
      const val = computeEffectiveValue(ctx.animal.stats[cond.stat]);
      return val > cond.threshold;
    }
    case 'stat_below': {
      const val = computeEffectiveValue(ctx.animal.stats[cond.stat]);
      return val < cond.threshold;
    }
    case 'has_parasite':
      return ctx.animal.parasites.some((p) => p.definitionId === cond.parasiteId);
    case 'no_parasite':
      return !ctx.animal.parasites.some((p) => p.definitionId === cond.parasiteId);
    case 'has_injury':
      return ctx.animal.injuries.length > 0;
    case 'age_range': {
      if (cond.min !== undefined && ctx.animal.age < cond.min) return false;
      if (cond.max !== undefined && ctx.animal.age > cond.max) return false;
      return true;
    }
    case 'has_flag':
      return ctx.animal.flags.has(cond.flag);
    case 'no_flag':
      return !ctx.animal.flags.has(cond.flag);
    case 'weight_above':
      return ctx.animal.weight > cond.threshold;
    case 'weight_below':
      return ctx.animal.weight < cond.threshold;
    case 'sex':
      return ctx.animal.sex === cond.sex;
    default:
      return true;
  }
}

/** Check if all conditions for an event are met */
function meetsConditions(event: GameEvent, ctx: GenerationContext): boolean {
  return event.conditions.every((cond) => checkCondition(cond, ctx));
}

/** Compute the behavioral weight multiplier for an event based on its tags */
function behaviorMultiplier(event: GameEvent, behavior: BehavioralSettings): number {
  let mult = 1.0;
  const tags = event.tags;

  if (tags.includes('foraging') || tags.includes('food')) {
    mult *= 0.5 + behavior.foraging * 0.3; // 0.8 to 2.0
  }
  if (tags.includes('predator') || tags.includes('danger')) {
    mult *= 1.5 - behavior.caution * 0.2; // 0.5 to 1.3
  }
  if (tags.includes('social') || tags.includes('herd')) {
    mult *= 0.5 + behavior.sociability * 0.3;
  }
  if (tags.includes('mating') || tags.includes('reproductive')) {
    mult *= 0.3 + behavior.mating * 0.3;
  }
  if (tags.includes('exploration') || tags.includes('travel')) {
    mult *= 0.5 + behavior.exploration * 0.3;
  }
  if (tags.includes('confrontation') || tags.includes('territorial')) {
    mult *= 0.3 + behavior.belligerence * 0.3;
  }

  return mult;
}

/** Context-based weight multiplier (stats influence which events are more likely) */
function contextMultiplier(event: GameEvent, ctx: GenerationContext): number {
  let mult = 1.0;

  // High trauma increases psychological event probability
  if (event.category === 'psychological') {
    const tra = computeEffectiveValue(ctx.animal.stats[StatId.TRA]);
    mult *= 0.5 + (tra / 100) * 1.5;
  }

  // Low health increases health-related events
  if (event.category === 'health') {
    const hea = computeEffectiveValue(ctx.animal.stats[StatId.HEA]);
    mult *= 1.5 - (hea / 100);
  }

  return mult;
}

/** Apply template variables to narrative text */
export function resolveTemplate(text: string, ctx: GenerationContext): string {
  const tv = ctx.config.templateVars;
  return text
    .replace(/\{\{animal\.species\}\}/g, tv.speciesName)
    .replace(/\{\{animal\.sex_pronoun\}\}/g, ctx.animal.sex === 'female' ? 'she' : 'he')
    .replace(/\{\{animal\.sex_possessive\}\}/g, ctx.animal.sex === 'female' ? 'her' : 'his')
    .replace(/\{\{animal\.weight\}\}/g, String(ctx.animal.weight))
    .replace(/\{\{animal\.age\}\}/g, String(ctx.animal.age))
    .replace(/\{\{time\.season\}\}/g, ctx.time.season)
    .replace(/\{\{time\.month\}\}/g, ctx.time.month)
    .replace(/\{\{region\.name\}\}/g, tv.regionName)
    .replace(/\{\{species\.youngNoun\}\}/g, tv.youngNoun)
    .replace(/\{\{species\.youngNounPlural\}\}/g, tv.youngNounPlural)
    .replace(/\{\{species\.maleNoun\}\}/g, tv.maleNoun)
    .replace(/\{\{species\.femaleNoun\}\}/g, tv.femaleNoun)
    .replace(/\{\{species\.groupNoun\}\}/g, tv.groupNoun)
    .replace(/\{\{species\.habitat\}\}/g, tv.habitat);
}

/** Generate events for a single turn */
export function generateEvents(ctx: GenerationContext): ResolvedEvent[] {
  const events = ctx.events;
  const results: ResolvedEvent[] = [];

  // Filter eligible events
  const eligible = events.filter((event) => {
    // Check cooldown
    if (ctx.cooldowns[event.id] && ctx.cooldowns[event.id] > 0) return false;
    // Check conditions
    return meetsConditions(event, ctx);
  });

  // Separate active and passive events
  const activePool = eligible.filter((e) => e.type === 'active');
  const passivePool = eligible.filter((e) => e.type === 'passive');

  // Compute weights for active events
  const activeWeights = activePool.map(
    (e) => e.weight * behaviorMultiplier(e, ctx.behavior) * contextMultiplier(e, ctx)
  );

  // Select 1-3 active events
  const activeCount = ctx.rng.int(1, Math.min(3, activePool.length));
  const selectedActiveIndices = new Set<number>();

  for (let i = 0; i < activeCount && selectedActiveIndices.size < activePool.length; i++) {
    // Zero out already-selected weights
    const adjustedWeights = activeWeights.map((w, idx) =>
      selectedActiveIndices.has(idx) ? 0 : w
    );
    const idx = ctx.rng.weightedSelect(adjustedWeights);
    selectedActiveIndices.add(idx);
  }

  for (const idx of selectedActiveIndices) {
    const event = activePool[idx];
    results.push(resolveEvent(event, ctx));
  }

  // Select 0-2 passive events
  if (passivePool.length > 0) {
    const passiveWeights = passivePool.map(
      (e) => e.weight * contextMultiplier(e, ctx)
    );
    const passiveCount = ctx.rng.int(0, Math.min(2, passivePool.length));
    const selectedPassiveIndices = new Set<number>();

    for (let i = 0; i < passiveCount && selectedPassiveIndices.size < passivePool.length; i++) {
      const adjustedWeights = passiveWeights.map((w, idx) =>
        selectedPassiveIndices.has(idx) ? 0 : w
      );
      const idx = ctx.rng.weightedSelect(adjustedWeights);
      selectedPassiveIndices.add(idx);
    }

    for (const idx of selectedPassiveIndices) {
      const event = passivePool[idx];
      results.push(resolveEvent(event, ctx));
    }
  }

  return results;
}

/** Resolve a single event: fill templates, trigger sub-events */
function resolveEvent(event: GameEvent, ctx: GenerationContext): ResolvedEvent {
  const resolvedNarrative = resolveTemplate(event.narrativeText, ctx);

  // Evaluate sub-event triggers
  const triggeredSubEvents: ResolvedSubEvent[] = [];
  if (event.subEvents) {
    for (const sub of event.subEvents) {
      // Check sub-event conditions
      const conditionsMet = !sub.conditions || sub.conditions.every((c) => checkCondition(c, ctx));
      if (conditionsMet && ctx.rng.chance(sub.chance)) {
        triggeredSubEvents.push({
          eventId: sub.eventId,
          narrativeText: resolveTemplate(sub.narrativeText, ctx),
          footnote: sub.footnote,
          statEffects: sub.statEffects,
          consequences: sub.consequences,
        });
      }
    }
  }

  return {
    definition: event,
    resolvedNarrative,
    triggeredSubEvents,
  };
}
