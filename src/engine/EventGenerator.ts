import type { GameEvent, EventCondition, ResolvedEvent, ResolvedSubEvent } from '../types/events';
import type { AnimalState } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { SpeciesConfig } from '../types/speciesConfig';
import { StatId, computeEffectiveValue } from '../types/stats';
import type { Rng } from './RandomUtils';
import type { Difficulty } from '../types/difficulty';
import type { NPC } from '../types/npc';
import type { RegionDefinition } from '../types/world';
import type { WeatherState } from './WeatherSystem';
import type { EcosystemState } from '../types/ecosystem';
import { DIFFICULTY_PRESETS } from '../types/difficulty';
import { weatherContextMultiplier } from './WeatherSystem';
import { pickIllustration } from './IllustrationPicker';

interface GenerationContext {
  animal: AnimalState;
  time: TimeState;
  behavior: BehavioralSettings;
  cooldowns: Record<string, number>;
  rng: Rng;
  events: GameEvent[];
  config: SpeciesConfig;
  difficulty?: Difficulty;
  npcs?: NPC[];
  regionDef?: RegionDefinition;
  currentWeather?: WeatherState;
  ecosystem?: EcosystemState;
  currentNodeType?: string;
  fastForward?: boolean;
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
      if (cond.injuryId) return ctx.animal.injuries.some((i) => i.definitionId === cond.injuryId);
      return ctx.animal.injuries.length > 0;
    case 'no_injury':
      return !ctx.animal.injuries.some((i) => i.definitionId === cond.injuryId);
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
    case 'turn_above':
      return ctx.time.turn > cond.threshold;
    case 'sex':
      return ctx.animal.sex === cond.sex;
    case 'weather':
      return !!ctx.currentWeather && cond.weatherTypes.includes(ctx.currentWeather.type);
    case 'population_above': {
      const pop = ctx.ecosystem?.populations[cond.speciesName];
      return pop ? pop.level > cond.threshold : false;
    }
    case 'population_below': {
      const pop = ctx.ecosystem?.populations[cond.speciesName];
      return pop ? pop.level < cond.threshold : false;
    }
    case 'has_npc':
      return !!ctx.npcs?.some((n) => n.type === cond.npcType && n.alive);
    case 'no_npc':
      return !ctx.npcs?.some((n) => n.type === cond.npcType && n.alive);
    case 'node_type': {
      if (!ctx.currentNodeType) return true;
      return (cond.nodeTypes as string[]).includes(ctx.currentNodeType);
    }
    case 'social_rank':
      return cond.ranks.includes(ctx.animal.social.rank);
    case 'mutation_active':
      return ctx.animal.activeMutations.some(m => m.id === cond.mutationId);
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
    // High immune stress → more health events (parasites/disease)
    const imm = computeEffectiveValue(ctx.animal.stats[StatId.IMM]);
    mult *= 0.8 + (imm / 100) * 0.8;  // 0.8 to 1.6x
  }

  // High climate stress → more environmental/seasonal events
  if (event.category === 'environmental' || event.category === 'seasonal') {
    const cli = computeEffectiveValue(ctx.animal.stats[StatId.CLI]);
    mult *= 0.7 + (cli / 100) * 1.0;  // 0.7 to 1.7x
  }

  // High novelty → more exploration/migration events
  if (event.category === 'migration') {
    const nov = computeEffectiveValue(ctx.animal.stats[StatId.NOV]);
    mult *= 0.6 + (nov / 100) * 1.0;  // 0.6 to 1.6x
  }

  // High adversity → more predator encounters
  if (event.category === 'predator') {
    const adv = computeEffectiveValue(ctx.animal.stats[StatId.ADV]);
    mult *= 0.7 + (adv / 100) * 0.8;  // 0.7 to 1.5x
  }

  // Weather influence on event probability
  if (ctx.currentWeather) {
    mult *= weatherContextMultiplier(event.category, ctx.currentWeather);
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
    .replace(/\{\{species\.habitat\}\}/g, tv.habitat)
    .replace(/\{\{npc\.rival\.name\}\}/g, ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'a rival')
    .replace(/\{\{npc\.rival\.encounters\}\}/g, String(ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.ally\.name\}\}/g, ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.name ?? 'a companion')
    .replace(/\{\{npc\.ally\.encounters\}\}/g, String(ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.predator\.name\}\}/g, ctx.npcs?.find((n) => n.type === 'predator' && n.alive)?.name ?? 'a predator')
    .replace(/\{\{npc\.predator\.encounters\}\}/g, String(ctx.npcs?.find((n) => n.type === 'predator' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.mate\.name\}\}/g, ctx.npcs?.find((n) => n.type === 'mate' && n.alive)?.name ?? 'a mate')
    .replace(/\{\{npc\.mate\.encounters\}\}/g, String(ctx.npcs?.find((n) => n.type === 'mate' && n.alive)?.encounters ?? 0))
    .replace(/\{\{weather\.type\}\}/g, ctx.currentWeather?.type ?? 'clear')
    .replace(/\{\{weather\.description\}\}/g, ctx.currentWeather?.description ?? '')
    .replace(/\{\{region\.flora\}\}/g, () => {
      const flora = ctx.regionDef?.flora.filter((f) =>
        f.availableSeasons.includes(ctx.time.season) && f.abundanceByMonth[ctx.time.monthIndex] > 0.3
      );
      return flora && flora.length > 0 ? ctx.rng.pick(flora).name : 'browse';
    });
}

/**
 * Generate events for a single turn. Filters eligible events by cooldown
 * and conditions, then weighted-selects 1-3 active and 0-2 passive events.
 */
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
  const predatorFactor = DIFFICULTY_PRESETS[ctx.difficulty ?? 'normal'].predatorEncounterFactor;
  const activeWeights = activePool.map(
    (e) => {
      let w = e.weight * behaviorMultiplier(e, ctx.behavior) * contextMultiplier(e, ctx);
      if (e.tags.includes('predator') || e.tags.includes('danger')) {
        w *= predatorFactor;
      }
      return w;
    }
  );

  // Select 1-3 active events
  const baseActiveCount = ctx.rng.int(1, Math.min(3, activePool.length));
  const activeCount = ctx.fastForward ? Math.min(baseActiveCount * 3, activePool.length) : baseActiveCount;
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
    const basePassiveCount = ctx.rng.int(0, Math.min(2, passivePool.length));
    const passiveCount = ctx.fastForward ? Math.min(basePassiveCount * 3, passivePool.length) : basePassiveCount;
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

  // Pick an illustration if the event doesn't already have one
  const image = event.image ?? pickIllustration(event, ctx.rng);

  return {
    definition: image ? { ...event, image } : event,
    resolvedNarrative,
    triggeredSubEvents,
  };
}
