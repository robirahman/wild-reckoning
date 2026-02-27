import type { SimulationContext, SimulationTrigger, SimulationOutcome, SimulationChoice } from './types';
import type { ResolvedEvent, GameEvent, EventChoice } from '../../types/events';
import type { DebriefingEntry } from '../narrative/types';
import { StatId, computeEffectiveValue } from '../../types/stats';
import { renderAnimalPerspective, toDebriefingEntry } from '../narrative/renderer';

// ── Trigger Registry ──

import { wolfPackTrigger, coyoteStalkerTrigger, cougarAmbushTrigger, huntingSeasonTrigger } from './triggers/predatorEncounter';
import { rutCombatTrigger } from './triggers/intraspecificFight';
import { fallHazardTrigger, blizzardExposureTrigger, vehicleStrikeTrigger, forestFireTrigger, floodingCreekTrigger, dispersalNewRangeTrigger } from './triggers/environmentalHazard';
import { seasonalBrowseTrigger, riskyForagingTrigger, toxicPlantTrigger } from './triggers/foraging';
import { parasiteExposureTrigger, woundInfectionTrigger, diseaseOutbreakTrigger } from './triggers/disease';
import { rehabilitationIntroTrigger } from './triggers/rehabilitationIntro';
import { starvationPressureTrigger } from './triggers/starvationPressure';
import { hypothermiaPressureTrigger } from './triggers/hypothermiaPressure';
import { injuryImpactTrigger } from './triggers/injuryImpact';
import { immunePressureTrigger } from './triggers/immunePressure';
import {
  herdAlarmTrigger,
  bachelorGroupTrigger,
  doeHierarchyTrigger,
  fawnPlayTrigger,
  territorialScrapeTrigger,
  rivalReturnsTrigger,
  allyWarnsTrigger,
  yearlingDispersalTrigger,
} from './triggers/social';
import {
  antlerVelvetTrigger,
  insectHarassmentTrigger,
  autumnRutTrigger,
  winterYardTrigger,
  rutEndsTrigger,
} from './triggers/seasonal';
import {
  winterYardScoutTrigger,
  travelHazardsTrigger,
  springReturnTrigger,
} from './triggers/migration';
import {
  fawnBirthTrigger,
  fawnDefenseTrigger,
  rutDisplayTrigger,
} from './triggers/reproduction';
import {
  woundDeteriorationTrigger,
  feverEventTrigger,
  sepsisEventTrigger,
} from './triggers/woundProgression';

const ALL_TRIGGERS: SimulationTrigger[] = [
  rehabilitationIntroTrigger,
  wolfPackTrigger,
  coyoteStalkerTrigger,
  cougarAmbushTrigger,
  huntingSeasonTrigger,
  rutCombatTrigger,
  fallHazardTrigger,
  blizzardExposureTrigger,
  vehicleStrikeTrigger,
  seasonalBrowseTrigger,
  riskyForagingTrigger,
  toxicPlantTrigger,
  parasiteExposureTrigger,
  woundInfectionTrigger,
  diseaseOutbreakTrigger,
  // Physiology-driven triggers (fire based on physiological state)
  starvationPressureTrigger,
  hypothermiaPressureTrigger,
  injuryImpactTrigger,
  immunePressureTrigger,
  // Social triggers
  herdAlarmTrigger,
  bachelorGroupTrigger,
  doeHierarchyTrigger,
  fawnPlayTrigger,
  territorialScrapeTrigger,
  rivalReturnsTrigger,
  allyWarnsTrigger,
  yearlingDispersalTrigger,
  // Seasonal triggers
  antlerVelvetTrigger,
  insectHarassmentTrigger,
  autumnRutTrigger,
  winterYardTrigger,
  rutEndsTrigger,
  // Migration triggers
  winterYardScoutTrigger,
  travelHazardsTrigger,
  springReturnTrigger,
  // Reproduction triggers
  fawnBirthTrigger,
  fawnDefenseTrigger,
  rutDisplayTrigger,
  // Additional environmental hazards
  forestFireTrigger,
  floodingCreekTrigger,
  dispersalNewRangeTrigger,
  // Wound progression triggers (condition cascades)
  woundDeteriorationTrigger,
  feverEventTrigger,
  sepsisEventTrigger,
];

// ── Behavioral Multiplier (mirrors EventGenerator logic) ──

function behaviorMultiplier(trigger: SimulationTrigger, ctx: SimulationContext): number {
  let mult = 1.0;
  const tags = trigger.tags;

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

// ── Generator ──

/**
 * Evaluate all registered simulation triggers and select 0-2 events.
 * Returns ResolvedEvent[] compatible with the existing event pipeline.
 */
export function generateSimulationEvents(ctx: SimulationContext): ResolvedEvent[] {
  // 1. Filter plausible triggers
  const plausible = ALL_TRIGGERS.filter((t) => t.isPlausible(ctx));
  if (plausible.length === 0) return [];

  // 2. Compute weights
  const weights = plausible.map((t) => {
    const base = t.computeWeight(ctx);
    const bMult = behaviorMultiplier(t, ctx);
    return Math.max(0, base * bMult);
  });

  const results: ResolvedEvent[] = [];
  const selectedIndices = new Set<number>();

  // 3a. Guaranteed triggers always fire when plausible (intro events, etc.)
  for (let i = 0; i < plausible.length; i++) {
    if (plausible[i].guaranteed) {
      selectedIndices.add(i);
      const trigger = plausible[i];
      const outcome = trigger.resolve(ctx);
      const choices = trigger.getChoices(ctx);
      results.push(convertToResolvedEvent(trigger, outcome, choices, ctx));
    }
  }

  // 3b. Probabilistic selection for remaining triggers (0-2 total including guaranteed)
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight <= 0) return results;

  const maxEvents = ctx.fastForward ? 2 : 1;
  const maxProbEvents = Math.max(0, maxEvents - results.length);

  for (let i = 0; i < maxProbEvents && selectedIndices.size < plausible.length; i++) {
    const remainingWeights = weights.map((w, idx) => selectedIndices.has(idx) ? 0 : w);
    const remainingTotal = remainingWeights.reduce((a, b) => a + b, 0);

    // Probability that ANY simulation trigger fires this turn
    // With full simulation coverage (39/41 deer events + NarrativeContext on all 34 triggers)
    const fireChance = Math.min(0.8, remainingTotal);
    if (!ctx.rng.chance(fireChance)) break;

    // Weighted selection among remaining triggers
    const idx = ctx.rng.weightedSelect(remainingWeights);
    selectedIndices.add(idx);

    const trigger = plausible[idx];
    const outcome = trigger.resolve(ctx);
    const choices = trigger.getChoices(ctx);

    results.push(convertToResolvedEvent(trigger, outcome, choices, ctx));
  }

  return results;
}

/** Get the set of event categories covered by simulation triggers */
export function getSimulationCategories(): Set<string> {
  const categories = new Set<string>();
  for (const t of ALL_TRIGGERS) {
    categories.add(t.category);
  }
  return categories;
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
 * Convert a simulation outcome into a ResolvedEvent that the existing
 * turn processing pipeline can handle.
 */
function convertToResolvedEvent(
  trigger: SimulationTrigger,
  outcome: SimulationOutcome,
  choices: SimulationChoice[],
  ctx: SimulationContext,
): ResolvedEvent {
  // Determine narrative text: use renderer if NarrativeContext is available,
  // otherwise fall back to the hardcoded narrativeText
  let narrativeText = outcome.narrativeText;
  if (outcome.narrativeContext) {
    const wisdomLevel = computeEffectiveValue(ctx.animal.stats[StatId.WIS]);
    narrativeText = renderAnimalPerspective(outcome.narrativeContext, wisdomLevel, ctx.rng);
  }

  // Build legacy-compatible consequences: include apply_harm for each harm event
  const consequences = [
    ...outcome.consequences,
    ...outcome.harmEvents.map((harm) => ({ type: 'apply_harm' as const, harm })),
  ];

  // Convert SimulationChoices to legacy EventChoices
  const eventChoices: EventChoice[] = choices.map((choice) => {
    // Pre-resolve the modified outcome for each choice to extract effects
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

  // Build the synthetic GameEvent definition
  const syntheticEvent: GameEvent = {
    id: `sim-${trigger.id}-${ctx.time.turn}`,
    type: 'active',
    category: trigger.category,
    narrativeText,
    image: outcome.image,
    // If there are choices, the base effects go on the event itself only when no choices
    statEffects: eventChoices.length > 0 ? [] : outcome.statEffects,
    consequences: eventChoices.length > 0 ? [] : consequences,
    choices: eventChoices.length > 0 ? eventChoices : undefined,
    conditions: [], // Already evaluated by isPlausible
    weight: 0, // Not used (already selected)
    tags: trigger.tags,
    footnote: outcome.footnote,
  };

  // Store debriefing entry if narrative context is available
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
