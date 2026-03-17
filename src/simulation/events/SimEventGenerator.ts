import type { SimulationContext, SimulationOutcome, SimulationChoice } from './types';
import type { ResolvedEvent, GameEvent, EventChoice } from '../../types/events';
import type { DebriefingEntry } from '../narrative/types';
import { StatId, computeEffectiveValue } from '../../types/stats';
import { renderAnimalPerspective, toDebriefingEntry } from '../narrative/renderer';
import { detectSituations } from './situations/detector';
import type { Situation, InteractionTemplate, MatchResult } from './situations/types';
import { matchTemplates } from './situations/matcher';

// ── Template Registry (generative event system) ──

import { predatorEncounterTemplate } from './situations/templates/predatorTemplate';
import { environmentalHazardTemplate } from './situations/templates/environmentalTemplate';
import { socialInteractionTemplate } from './situations/templates/socialTemplate';
import { reproductionTemplate } from './situations/templates/reproductionTemplate';
import { foragingTemplate } from './situations/templates/foragingTemplate';
import { healthTemplate } from './situations/templates/healthTemplate';
import { seasonalTemplate } from './situations/templates/seasonalTemplate';
import { migrationTemplate } from './situations/templates/migrationTemplate';
import { impairmentTemplate } from './situations/templates/impairmentTemplate';
import { physiologyTemplate } from './situations/templates/physiologyTemplate';
import { rehabilitationTemplate } from './situations/templates/rehabilitationTemplate';

const ALL_TEMPLATES: InteractionTemplate[] = [
  predatorEncounterTemplate,
  environmentalHazardTemplate,
  socialInteractionTemplate,
  reproductionTemplate,
  foragingTemplate,
  healthTemplate,
  seasonalTemplate,
  migrationTemplate,
  impairmentTemplate,
  physiologyTemplate,
  rehabilitationTemplate,
];

// ── Behavioral Multiplier ──

function behaviorMultiplierForTags(tags: string[], ctx: SimulationContext): number {
  let mult = 1.0;
  if (tags.includes('predator') || tags.includes('danger')) {
    mult *= 1.5 - ctx.behavior.caution * 0.2;
  }
  if (tags.includes('confrontation') || tags.includes('territorial')) {
    mult *= 0.3 + ctx.behavior.belligerence * 0.3;
  }
  if (tags.includes('exploration') || tags.includes('travel')) {
    mult *= 0.5 + ctx.behavior.exploration * 0.3;
  }
  return mult;
}

// ── Body-State Multiplier ──
// Applies global weight modifiers based on the animal's physical condition.
// This creates emergent feedback loops: injuries attract predators, hunger
// drives foraging, sickness suppresses exploration, etc.

function stateMultiplierForTags(tags: string[], ctx: SimulationContext): number {
  let mult = 1.0;
  const bs = ctx.animal.bodyState;
  const ps = ctx.animal.physiologyState;

  // ── Locomotion impairment ──
  const locomotion = bs?.capabilities['locomotion'] ?? 100;
  const locoImpairment = (100 - locomotion) / 100;

  if (tags.includes('predator') || tags.includes('danger')) {
    mult *= 1 + locoImpairment * 0.6;
  }
  if (tags.includes('travel') || tags.includes('exploration') || tags.includes('migration')) {
    mult *= 1 - locoImpairment * 0.5;
  }

  // ── Open wounds ──
  const openWounds = bs?.conditions.filter(
    c => (c.type === 'laceration' || c.type === 'puncture') && c.infectionLevel < 30
  ).length ?? 0;
  if (openWounds > 0) {
    if (tags.includes('predator')) mult *= 1 + openWounds * 0.15;
    if (tags.includes('disease') || tags.includes('parasite')) mult *= 1 + openWounds * 0.25;
  }

  // ── Caloric state ──
  const bcs = ps?.bodyConditionScore ?? 3;
  if (bcs <= 2) {
    if (tags.includes('foraging') || tags.includes('food')) mult *= 1.4;
    if (tags.includes('social') || tags.includes('exploration')) mult *= 0.7;
    if (tags.includes('predator')) mult *= 1 + (3 - bcs) * 0.15;
  }

  // ── Fever / immunocompromised ──
  if (ps?.immunocompromised) {
    if (tags.includes('disease') || tags.includes('parasite')) mult *= 1.5;
    if (tags.includes('confrontation') || tags.includes('territorial')) mult *= 0.5;
  }
  if (ps && ps.feverLevel > 2) {
    if (tags.includes('travel') || tags.includes('exploration') || tags.includes('confrontation')) {
      mult *= Math.max(0.3, 1 - ps.feverLevel * 0.1);
    }
  }

  // ── High trauma ──
  const tra = computeEffectiveValue(ctx.animal.stats[StatId.TRA]);
  if (tra > 60) {
    if (tags.includes('predator') || tags.includes('danger')) {
      mult *= 1 + (tra - 60) * 0.005;
    }
  }

  // ── Vision impairment ──
  const vision = bs?.capabilities['vision'] ?? 100;
  if (vision < 70) {
    if (tags.includes('predator')) mult *= 1 + (70 - vision) * 0.008;
    if (tags.includes('foraging')) mult *= 0.8;
  }

  return Math.max(0.1, mult);
}

// ── Generator ──

/** Most recently detected situations (for diagnostics) */
let lastDetectedSituations: Situation[] = [];

/** Get the situations detected on the most recent turn (for diagnostics) */
export function getLastDetectedSituations(): Readonly<Situation[]> {
  return lastDetectedSituations;
}

/**
 * Detect situations → match templates → weighted selection → resolve.
 * Returns ResolvedEvent[] compatible with the existing event pipeline.
 */
export function generateSimulationEvents(ctx: SimulationContext): ResolvedEvent[] {
  // 1. Detect situations (unified world scan)
  lastDetectedSituations = detectSituations(ctx);

  // 2. Match templates against detected situations
  const templateMatches = matchTemplates(ctx, lastDetectedSituations, ALL_TEMPLATES);

  if (templateMatches.length === 0) return [];

  // 3. Build weighted pool with behavioral + body-state multipliers
  const weights: number[] = [];
  for (const match of templateMatches) {
    const bMult = behaviorMultiplierForTags(match.template.tags, ctx);
    const sMult = stateMultiplierForTags(match.template.tags, ctx);
    weights.push(Math.max(0, match.weight * bMult * sMult));
  }

  const results: ResolvedEvent[] = [];
  const selectedIndices = new Set<number>();

  // 4a. Guaranteed entries (milestone events like rehabilitation)
  for (let i = 0; i < templateMatches.length; i++) {
    if (templateMatches[i].template.guaranteed) {
      selectedIndices.add(i);
      results.push(resolveTemplateMatch(templateMatches[i], ctx));
    }
  }

  // 4b. Probabilistic selection (0-2 total including guaranteed)
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) return results;

  const maxEvents = 1; // FF uses 1x events with 12x consequences
  const maxProbEvents = Math.max(0, maxEvents - results.length);

  for (let j = 0; j < maxProbEvents && selectedIndices.size < templateMatches.length; j++) {
    const remainingWeights = weights.map((w, idx) => selectedIndices.has(idx) ? 0 : w);
    const remainingTotal = remainingWeights.reduce((a, b) => a + b, 0);

    const fireChance = Math.min(0.8, remainingTotal);
    if (!ctx.rng.chance(fireChance)) break;

    const idx = ctx.rng.weightedSelect(remainingWeights);
    selectedIndices.add(idx);
    results.push(resolveTemplateMatch(templateMatches[idx], ctx));
  }

  return results;
}

/**
 * Resolve a template match into a ResolvedEvent.
 */
function resolveTemplateMatch(match: MatchResult, ctx: SimulationContext): ResolvedEvent {
  const { template, situations } = match;
  const outcome = template.resolve(ctx, situations);
  const choices = template.getChoices(ctx, situations);
  return convertTemplateToResolvedEvent(template, outcome, choices, ctx);
}

/** Get the set of event categories covered by templates */
export function getSimulationCategories(): Set<string> {
  return new Set(ALL_TEMPLATES.map(t => t.category));
}

// ── Debriefing Log ──

/** Debriefing entries collected during generation for later storage */
let pendingDebriefingEntries: DebriefingEntry[] = [];

/** Drain pending debriefing entries (called by the store after event generation) */
export function drainDebriefingEntries(): DebriefingEntry[] {
  const entries = pendingDebriefingEntries;
  pendingDebriefingEntries = [];
  return entries;
}

// ── Conversion to Legacy Format ──

/**
 * Convert a template-resolved outcome into a ResolvedEvent.
 */
function convertTemplateToResolvedEvent(
  template: InteractionTemplate,
  outcome: SimulationOutcome,
  choices: SimulationChoice[],
  ctx: SimulationContext,
): ResolvedEvent {
  // Determine narrative text: use renderer if NarrativeContext is available
  let narrativeText = outcome.narrativeText;
  if (outcome.narrativeContext) {
    const wisdomLevel = computeEffectiveValue(ctx.animal.stats[StatId.WIS]);
    narrativeText = renderAnimalPerspective(outcome.narrativeContext, wisdomLevel, ctx.rng);
  }

  // Build consequences: include apply_harm for each harm event
  const consequences = [
    ...outcome.consequences,
    ...outcome.harmEvents.map((harm) => ({ type: 'apply_harm' as const, harm })),
  ];

  // Convert SimulationChoices to EventChoices
  const eventChoices: EventChoice[] = choices.map((choice) => {
    const modifiedOutcome = choice.modifyOutcome({ ...outcome }, ctx);
    const choiceConsequences = [
      ...modifiedOutcome.consequences,
      ...modifiedOutcome.harmEvents.map((harm) => ({ type: 'apply_harm' as const, harm })),
    ];

    return {
      id: choice.id,
      label: choice.label,
      description: choice.description,
      narrativeResult: choice.narrativeResult,
      statEffects: modifiedOutcome.statEffects,
      consequences: choiceConsequences,
      revocable: false,
      style: choice.style,
    };
  });

  const syntheticEvent: GameEvent = {
    id: `sim-${template.id}-${ctx.time.turn}`,
    type: 'active',
    category: template.category,
    narrativeText,
    image: outcome.image,
    statEffects: eventChoices.length > 0 ? [] : outcome.statEffects,
    consequences: eventChoices.length > 0 ? [] : consequences,
    choices: eventChoices.length > 0 ? eventChoices : undefined,
    conditions: [],
    weight: 0,
    tags: template.tags,
    footnote: outcome.footnote,
  };

  // Store debriefing entry
  if (outcome.narrativeContext) {
    const wisdomLevel = computeEffectiveValue(ctx.animal.stats[StatId.WIS]);
    const entry = toDebriefingEntry(
      outcome.narrativeContext,
      ctx.time.turn,
      narrativeText,
      wisdomLevel,
    );
    pendingDebriefingEntries.push(entry);
  }

  return {
    definition: syntheticEvent,
    resolvedNarrative: narrativeText,
    triggeredSubEvents: [],
  };
}
