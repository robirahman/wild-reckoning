import type { HarmResult, PartDamageResult, CapabilityImpairmentDelta } from '../harm/types';
import type { HarmEvent, HarmType } from '../harm/types';
import type { BodyZone } from '../anatomy/types';
import type { EventCategory } from '../../types/events';

// ── Narrative Entities ──

/**
 * How a creature/object appears to the animal vs. what it actually is.
 * The renderer selects perceivedAs or actualIdentity based on
 * disclosure rules (WIS threshold, perspective mode, etc.)
 */
export interface NarrativeEntity {
  /** What the animal perceives: size, color, smell, movement */
  perceivedAs: string;
  /** What it actually is (for debriefing / clinical review) */
  actualIdentity: string;
  /** WIS threshold at which the animal "recognizes" this entity by name */
  wisdomThreshold: number;
  /** Sensory modality by which the animal first detects this */
  primarySense: 'sight' | 'smell' | 'sound' | 'touch' | 'vibration';
  /** Entity archetype for template selection */
  archetype: EntityArchetype;
}

export type EntityArchetype =
  | 'predator-canid'
  | 'predator-felid'
  | 'predator-human'
  | 'conspecific'
  | 'vehicle'
  | 'terrain'
  | 'weather'
  | 'unknown';

// ── Narrative Actions ──

/** A discrete action that occurred during the event, ordered chronologically */
export interface NarrativeAction {
  /** What happened in animal-perspective terms */
  animalPerspective: string;
  /** What happened in clinical terms (for debriefing) */
  clinicalDescription: string;
  /** Intensity level affects word choice and sentence structure */
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  /** Body zones involved, if any */
  bodyZones?: BodyZone[];
}

// ── Body Effect Descriptions ──

/** Structured description of physical effects for narrative generation */
export interface NarrativeBodyEffect {
  /** The body part that was affected */
  partId: string;
  partLabel: string;
  /** What happened to it (animal perspective) */
  animalFeeling: string;
  /** Clinical description (debriefing) */
  clinicalDescription: string;
  /** Severity for intensity modulation */
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  /** Whether the animal would be aware of this */
  somaticallyAware: boolean;
}

// ── Narrative Context ──

/**
 * Everything the narrative renderer needs to compose text for an event.
 * Simulation triggers produce this; the renderer consumes it.
 */
export interface NarrativeContext {
  /** Event category for template selection */
  eventCategory: EventCategory;
  /** More specific event type within the category */
  eventType: string;
  /** Entities involved (predators, conspecifics, objects) */
  entities: NarrativeEntity[];
  /** Chronological sequence of actions */
  actions: NarrativeAction[];
  /** Physical effects on the animal's body */
  bodyEffects: NarrativeBodyEffect[];
  /** Environmental conditions at the time */
  environment: NarrativeEnvironment;
  /** Overall emotional register */
  emotionalTone: EmotionalTone;
  /** The harm events that produced the body effects (for debriefing detail) */
  sourceHarmEvents?: HarmEvent[];
  /** The resolved harm results (for debriefing detail) */
  harmResults?: HarmResult[];
  /** Choice that was made, if any */
  choiceMade?: string;
  /** Whether the animal died from this event */
  fatal?: boolean;
  /** Death cause for debriefing */
  deathCause?: string;
}

export interface NarrativeEnvironment {
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  weather?: string;
  terrain?: string;
  /** Atmospheric detail for opening lines */
  atmosphericDetail?: string;
}

export type EmotionalTone =
  | 'fear'        // predator encounters, ambushes
  | 'pain'        // injuries, harm
  | 'aggression'  // territorial fights
  | 'tension'     // near-misses, stalking
  | 'relief'      // escape, recovery
  | 'cold'        // exposure, blizzard
  | 'confusion'   // novel/incomprehensible events
  | 'calm';       // neutral events

// ── Debriefing Entry ──

/**
 * A single event in the animal's life story, stored for game-over review.
 * The debriefing replays these in clinical (human) language.
 */
export interface DebriefingEntry {
  turn: number;
  /** Animal-perspective narrative (what the player saw during gameplay) */
  animalNarrative: string;
  /** Clinical narrative (what actually happened, in medical/zoological terms) */
  clinicalNarrative: string;
  /** Choice the player made, if any */
  choiceLabel?: string;
  /** Whether this event was fatal */
  fatal: boolean;
  /** Summary line for the timeline view */
  summaryLine: string;
}
