import type { GameEvent, EventChoice, EventCondition, ResolvedEvent, ResolvedSubEvent } from '../types/events';
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
import { pronounsFor } from '../utils/pronouns';
import { weatherContextMultiplier } from './WeatherSystem';
import { pickIllustration } from './IllustrationPicker';
import { isSimulationMode } from '../simulation/mode';
import { generateSimulationEvents } from '../simulation/events/SimEventGenerator';
import type { SimulationContext } from '../simulation/events/types';
import type { CalibratedRates } from '../simulation/calibration/types';
import type { WorldMemory } from '../simulation/memory/types';
import type { NPCBehaviorState } from '../simulation/npc/types';
import { calibrate } from '../simulation/calibration/calibrator';
import { DEER_MORTALITY } from '../simulation/calibration/data/deer';

export interface GenerationContext {
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
  currentNodeResources?: { food: number; water: number; cover: number };
  currentNodeId?: string;
  fastForward?: boolean;
  calibratedRates?: CalibratedRates;
  worldMemory?: WorldMemory;
  npcBehaviorStates?: Record<string, NPCBehaviorState>;
}

// ── Calibration cache ──
let cachedRates: CalibratedRates | undefined;
export function getCalibratedRates(speciesId: string): CalibratedRates | undefined {
  if (speciesId === 'white-tailed-deer') {
    if (!cachedRates) cachedRates = calibrate(DEER_MORTALITY);
    return cachedRates;
  }
  return undefined;
}

/** Check if a single condition is met */
export function checkCondition(cond: EventCondition, ctx: GenerationContext): boolean {
  switch (cond.type) {
    case 'season':
      return cond.seasons.includes(ctx.time.season);
    case 'month':
      return cond.months.includes(ctx.time.month);
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
    case 'backstory':
      return cond.backstoryTypes.includes(ctx.animal.backstory.type);
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

/** Template variables resolveTemplate understands; content may only use these */
export const TEMPLATE_VARIABLES = [
  'animal.species', 'animal.sex_pronoun', 'animal.sex_object', 'animal.sex_possessive',
  'animal.weight', 'animal.age',
  'time.season', 'time.month',
  'region.name', 'region.flora',
  'species.youngNoun', 'species.youngNounPlural', 'species.maleNoun', 'species.femaleNoun',
  'species.groupNoun', 'species.habitat',
  'npc.rival.name', 'npc.rival.encounters', 'npc.ally.name', 'npc.ally.encounters',
  'npc.predator.name', 'npc.predator.encounters', 'npc.mate.name', 'npc.mate.encounters',
  'weather.type', 'weather.description',
] as const;

type TemplateVariable = typeof TEMPLATE_VARIABLES[number];

function atSentenceStart(text: string, offset: number): boolean {
  if (offset === 0) return true;
  return /(^|[.!?]["')]?\s+|\n\s*)$/.test(text.slice(Math.max(0, offset - 4), offset));
}

/** Apply template variables to narrative text */
export function resolveTemplate(text: string, ctx: GenerationContext): string {
  const tv = ctx.config.templateVars;
  const pronouns = pronounsFor(ctx.animal.sex);
  const npc = (type: NPC['type']) => ctx.npcs?.find((n) => n.type === type && n.alive);

  const values: Record<TemplateVariable, () => string> = {
    'animal.species': () => tv.speciesName,
    'animal.sex_pronoun': () => pronouns.subject,
    'animal.sex_object': () => pronouns.object,
    'animal.sex_possessive': () => pronouns.possessive,
    'animal.weight': () => String(ctx.animal.weight),
    'animal.age': () => String(ctx.animal.age),
    'time.season': () => ctx.time.season,
    'time.month': () => ctx.time.month,
    'region.name': () => tv.regionName,
    'region.flora': () => {
      const flora = ctx.regionDef?.flora.filter((f) =>
        f.availableSeasons.includes(ctx.time.season) && f.abundanceByMonth[ctx.time.monthIndex] > 0.3
      );
      return flora && flora.length > 0 ? ctx.rng.pick(flora).name : 'browse';
    },
    'species.youngNoun': () => tv.youngNoun,
    'species.youngNounPlural': () => tv.youngNounPlural,
    'species.maleNoun': () => tv.maleNoun,
    'species.femaleNoun': () => tv.femaleNoun,
    'species.groupNoun': () => tv.groupNoun,
    'species.habitat': () => tv.habitat,
    'npc.rival.name': () => npc('rival')?.name ?? 'a rival',
    'npc.rival.encounters': () => String(npc('rival')?.encounters ?? 0),
    'npc.ally.name': () => npc('ally')?.name ?? 'a companion',
    'npc.ally.encounters': () => String(npc('ally')?.encounters ?? 0),
    'npc.predator.name': () => npc('predator')?.name ?? 'a predator',
    'npc.predator.encounters': () => String(npc('predator')?.encounters ?? 0),
    'npc.mate.name': () => npc('mate')?.name ?? 'a mate',
    'npc.mate.encounters': () => String(npc('mate')?.encounters ?? 0),
    'weather.type': () => ctx.currentWeather?.type ?? 'clear',
    'weather.description': () => ctx.currentWeather?.description ?? '',
  };

  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_token, name: string, offset: number) => {
    const value = name in values
      ? values[name as TemplateVariable]()
      : unknownTemplateVariable(name, tv.speciesName);
    // A fallback like "a rival" can open a sentence
    return value && atSentenceStart(text, offset) ? value[0].toUpperCase() + value.slice(1) : value;
  });
}

/** Never show raw braces to the player: warn in development and fall back to plain words */
function unknownTemplateVariable(name: string, speciesName: string): string {
  if (import.meta.env?.DEV) console.warn(`Unknown template variable {{${name}}}`);
  return /species/i.test(name) ? speciesName.toLowerCase() : '';
}

/**
 * Generate events for a single turn. Filters eligible events by cooldown
 * and conditions, then weighted-selects 1-3 active and 0-2 passive events.
 *
 * In simulation mode (species with anatomyId), also generates events from
 * simulation triggers. When a simulation event covers the same category as
 * a hardcoded event, the hardcoded event is dropped in favor of the sim one.
 */
export function generateEvents(ctx: GenerationContext): ResolvedEvent[] {
  const events = ctx.events;
  const results: ResolvedEvent[] = [];

  // ── Simulation event generation (only for simulation-mode species) ──
  let simEvents: ResolvedEvent[] = [];
  const simCategories = new Set<string>();

  if (isSimulationMode(ctx.config)) {
    const simCtx: SimulationContext = {
      animal: ctx.animal,
      time: ctx.time,
      behavior: ctx.behavior,
      config: ctx.config,
      rng: ctx.rng,
      difficulty: ctx.difficulty,
      npcs: ctx.npcs,
      regionDef: ctx.regionDef,
      currentWeather: ctx.currentWeather,
      ecosystem: ctx.ecosystem,
      currentNodeType: ctx.currentNodeType,
      currentNodeResources: ctx.currentNodeResources,
      currentNodeId: ctx.currentNodeId,
      calibratedRates: getCalibratedRates(ctx.config.id),
      fastForward: ctx.fastForward,
      worldMemory: ctx.worldMemory,
      npcBehaviorStates: ctx.npcBehaviorStates,
    };

    simEvents = generateSimulationEvents(simCtx);
    // Track which categories the simulation covered (for deduplication)
    for (const ev of simEvents) {
      simCategories.add(ev.definition.category);
    }
  }

  // ── Legacy hardcoded event generation ──

  // Filter eligible events
  const simMode = isSimulationMode(ctx.config);
  const eligible = events.filter((event) => {
    // Check cooldown
    if (ctx.cooldowns[event.id] && ctx.cooldowns[event.id] > 0) return false;
    // In simulation mode, skip events tagged as simulated (replaced by triggers)
    if (simMode && event.simulated) return false;
    // In simulation mode, skip hardcoded events in categories the simulation covered this turn
    if (simCategories.has(event.category)) return false;
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
  const activeCount = baseActiveCount; // FF uses 1x events with 12x consequences
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
    const passiveCount = basePassiveCount; // FF uses 1x events with 12x consequences
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

  // ── Merge simulation events into the result ──
  // Simulation events go first (they're more important/dynamic)
  return [...simEvents, ...results];
}

/**
 * Resolve template variables in every player-visible text field of a set of
 * choices: labels, descriptions, result text, death causes and escape options.
 */
export function resolveChoiceText(
  choices: EventChoice[] | undefined,
  resolve: (text: string) => string,
): EventChoice[] | undefined {
  return choices?.map((c) => ({
    ...c,
    label: resolve(c.label),
    description: c.description && resolve(c.description),
    narrativeResult: c.narrativeResult && resolve(c.narrativeResult),
    deathChance: c.deathChance && {
      ...c.deathChance,
      cause: resolve(c.deathChance.cause),
      escapeOptions: c.deathChance.escapeOptions?.map((o) => ({
        ...o,
        label: resolve(o.label),
        description: resolve(o.description),
      })),
    },
  }));
}

/** Resolve a single event: fill templates, trigger sub-events */
function resolveEvent(event: GameEvent, ctx: GenerationContext): ResolvedEvent {
  const resolvedNarrative = resolveTemplate(event.narrativeText, ctx);
  const choices = resolveChoiceText(event.choices, (text) => resolveTemplate(text, ctx));

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
    definition: { ...event, choices, ...(image ? { image } : {}) },
    resolvedNarrative,
    triggeredSubEvents,
  };
}
