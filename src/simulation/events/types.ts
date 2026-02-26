import type { AnimalState } from '../../types/species';
import type { TimeState } from '../../types/world';
import type { BehavioralSettings } from '../../types/behavior';
import type { SpeciesConfig } from '../../types/speciesConfig';
import type { Rng } from '../../engine/RandomUtils';
import type { Difficulty } from '../../types/difficulty';
import type { NPC } from '../../types/npc';
import type { RegionDefinition } from '../../types/world';
import type { WeatherState } from '../../engine/WeatherSystem';
import type { EcosystemState } from '../../types/ecosystem';
import type { HarmEvent } from '../harm/types';
import type { StatEffect, Consequence, EventCategory } from '../../types/events';
import type { CalibratedRates } from '../calibration/types';
import type { NarrativeContext } from '../narrative/types';

// ── Simulation Context ──

/** Everything a simulation trigger needs to evaluate plausibility and resolve */
export interface SimulationContext {
  animal: AnimalState;
  time: TimeState;
  behavior: BehavioralSettings;
  config: SpeciesConfig;
  rng: Rng;
  difficulty?: Difficulty;
  npcs?: NPC[];
  regionDef?: RegionDefinition;
  currentWeather?: WeatherState;
  ecosystem?: EcosystemState;
  currentNodeType?: string;
  /** Map node resources (food/cover) at the animal's current location */
  currentNodeResources?: { food: number; water: number; cover: number };
  calibratedRates?: CalibratedRates;
  fastForward?: boolean;
}

// ── Simulation Choices ──

/** A player choice that modifies the simulation outcome */
export interface SimulationChoice {
  id: string;
  label: string;
  description: string;
  style: 'default' | 'danger';
  /** Modify the base outcome when this choice is selected */
  modifyOutcome: (base: SimulationOutcome, ctx: SimulationContext) => SimulationOutcome;
  /** Narrative text shown after this choice is made */
  narrativeResult: string;
}

// ── Simulation Outcome ──

/** The full result of resolving a simulation trigger */
export interface SimulationOutcome {
  /** Physical harm events to apply through the harm resolver */
  harmEvents: HarmEvent[];
  /** Direct stat effects */
  statEffects: StatEffect[];
  /** Legacy consequences (weight changes, flags, parasites, etc.) */
  consequences: Consequence[];
  /** Narrative text for the event (animal-perspective) */
  narrativeText: string;
  /** Image key for illustration */
  image?: string;
  /** Footnote shown in UI */
  footnote?: string;
  /**
   * Structured narrative context for the renderer. When present, the
   * renderer composes narrativeText from this; when absent, narrativeText
   * is used directly (backward-compatible with hardcoded text).
   */
  narrativeContext?: NarrativeContext;
}

// ── Simulation Trigger ──

/**
 * A SimulationTrigger generates events from world state and rules,
 * rather than from a hardcoded event pool.
 */
export interface SimulationTrigger {
  id: string;
  /** Event category (for deduplication with hardcoded events) */
  category: EventCategory;
  /** Tags for behavioral influence (same system as hardcoded events) */
  tags: string[];
  /** Mortality cause ID from the calibration system (for rate lookup) */
  calibrationCauseId?: string;
  /** If true, this trigger always fires when plausible (bypasses probability check) */
  guaranteed?: boolean;

  /**
   * Is this trigger plausible given the current world state?
   * This is a quick check -- if false, the trigger is skipped entirely.
   */
  isPlausible: (ctx: SimulationContext) => boolean;

  /**
   * Compute the selection weight for this trigger.
   * Higher weight = more likely to be selected.
   * Should factor in calibrated rates, behavioral settings, and conditions.
   */
  computeWeight: (ctx: SimulationContext) => number;

  /**
   * Resolve the trigger into a full outcome.
   * Called only if this trigger is selected.
   * Returns a base outcome (before player choice modifications).
   */
  resolve: (ctx: SimulationContext) => SimulationOutcome;

  /**
   * Player choices available for this trigger.
   * Each choice modifies the base outcome.
   */
  getChoices: (ctx: SimulationContext) => SimulationChoice[];
}
