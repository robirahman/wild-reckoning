import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { ContextualFragment } from '../../narrative/templates/shared';
import type { EventCategory } from '../../../types/events';

// ══════════════════════════════════════════════════
//  SITUATION TYPES
// ══════════════════════════════════════════════════

/** Categories of detected world state that can combine into events */
export type SituationType =
  | 'predator-nearby'
  | 'conspecific-nearby'
  | 'terrain-feature'
  | 'weather-condition'
  | 'body-impairment'
  | 'physiological-state'
  | 'activity-exposure'
  | 'seasonal-phase'
  | 'memory-trigger';

/** Where a narrative hook inserts into the composed narrative */
export type NarrativeSlot = 'atmosphere' | 'detection' | 'complication' | 'aftermath';

/**
 * A narrative hook contributed by a situation.
 * The narrative composer collects hooks from all active situations
 * and layers them into the template's narrative structure.
 */
export interface NarrativeHook {
  slot: NarrativeSlot;
  fragments: ContextualFragment[];
  priority: number;
}

/**
 * A detected configuration of world state. Not an event yet — just a
 * recognized pattern. Multiple situations combine to form compound events.
 */
export interface Situation {
  /** Category of this situation */
  type: SituationType;
  /** Identifier for dedup and narrative (e.g., 'wolf', 'water', 'locomotion') */
  source: string;
  /** Base contribution to event likelihood (0-1 range, multiplicative) */
  weight: number;
  /** Type-specific parameters */
  params: Record<string, unknown>;
  /** Optional narrative fragments this situation contributes */
  narrativeHooks?: NarrativeHook[];
}

// ══════════════════════════════════════════════════
//  INTERACTION TEMPLATE TYPES
// ══════════════════════════════════════════════════

/**
 * An InteractionTemplate is a parameterized event skeleton that matches
 * against detected situations. ~10 templates replace ~50 triggers.
 *
 * Templates declare required and optional situations. When all required
 * situations are present, the template can fire. Optional situations
 * modify weight, resolution, choices, and narrative — this is how
 * compound events emerge without being individually authored.
 */
export interface InteractionTemplate {
  id: string;
  category: EventCategory;
  tags: string[];

  /** Mortality cause ID for calibration rate lookup */
  calibrationCauseId?: string;

  /** If true, fires whenever matched (bypasses probability check) */
  guaranteed?: boolean;

  /** Situation types that must ALL be present for this template to match */
  requiredSituations: SituationType[];

  /** Situation types that enhance the event when present (not required) */
  optionalSituations?: SituationType[];

  /** Additional plausibility check beyond situation presence */
  extraPlausibility?: (ctx: SimulationContext, situations: Situation[]) => boolean;

  /** Compute selection weight from calibrated rates + situation modifiers */
  computeWeight: (ctx: SimulationContext, situations: Situation[]) => number;

  /**
   * Resolve the template into a full outcome.
   * Receives the matched situations so it can adjust resolution params.
   */
  resolve: (ctx: SimulationContext, situations: Situation[]) => SimulationOutcome;

  /**
   * Player choices, parameterized by which situations are present.
   * E.g., "make for the water" only when terrain-feature(water) is active.
   */
  getChoices: (ctx: SimulationContext, situations: Situation[]) => SimulationChoice[];
}

/**
 * Result of matching a template against a situation set.
 */
export interface MatchResult {
  template: InteractionTemplate;
  /** The situations that contributed to this match (required + present optionals) */
  situations: Situation[];
  /** Computed weight for probabilistic selection */
  weight: number;
}

// ══════════════════════════════════════════════════
//  SITUATION HELPERS
// ══════════════════════════════════════════════════

/** Find the first situation of a given type */
export function findSituation(situations: Situation[], type: SituationType): Situation | undefined {
  return situations.find(s => s.type === type);
}

/** Find all situations of a given type */
export function filterSituations(situations: Situation[], type: SituationType): Situation[] {
  return situations.filter(s => s.type === type);
}

/** Find a situation by type and source */
export function findSituationBySource(
  situations: Situation[],
  type: SituationType,
  source: string,
): Situation | undefined {
  return situations.find(s => s.type === type && s.source === source);
}

/** Check whether a specific situation type + source is present */
export function hasSituation(
  situations: Situation[],
  type: SituationType,
  source?: string,
): boolean {
  if (source === undefined) return situations.some(s => s.type === type);
  return situations.some(s => s.type === type && s.source === source);
}
