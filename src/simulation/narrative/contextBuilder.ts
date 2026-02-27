import type { SimulationContext } from '../events/types';
import type {
  NarrativeContext,
  NarrativeEnvironment,
  NarrativeAction,
  NarrativeEntity,
  EmotionalTone,
  NarrativeBodyEffect,
} from './types';
import type { EventCategory } from '../../types/events';
import type { HarmEvent } from '../harm/types';
import type { BodyZone } from '../anatomy/types';

// ══════════════════════════════════════════════════
//  ENVIRONMENT BUILDER
// ══════════════════════════════════════════════════

/** Build a NarrativeEnvironment from the current SimulationContext */
export function buildEnvironment(ctx: SimulationContext): NarrativeEnvironment {
  const terrain = ctx.currentNodeType ?? 'forest';
  const terrainLabels: Record<string, string> = {
    forest: 'dense forest',
    mountain: 'rocky mountain slope',
    plain: 'open grassland',
    water: 'near water',
    wetland: 'marshy wetland',
    farmstead: 'agricultural land',
    suburban: 'suburban edge',
    road: 'roadside',
  };

  return {
    timeOfDay: ctx.time.timeOfDay as 'dawn' | 'day' | 'dusk' | 'night',
    season: ctx.time.season as 'spring' | 'summer' | 'autumn' | 'winter',
    weather: ctx.currentWeather?.type,
    terrain: terrainLabels[terrain] ?? terrain,
  };
}

// ══════════════════════════════════════════════════
//  ACTION BUILDER
// ══════════════════════════════════════════════════

/** Create a NarrativeAction from animal-perspective and clinical descriptions */
export function action(
  animalPerspective: string,
  clinicalDescription: string,
  intensity: 'low' | 'medium' | 'high' | 'extreme' = 'medium',
  bodyZones?: BodyZone[],
): NarrativeAction {
  return { animalPerspective, clinicalDescription, intensity, bodyZones };
}

// ══════════════════════════════════════════════════
//  CONTEXT BUILDER
// ══════════════════════════════════════════════════

interface ContextBuilderParams {
  eventCategory: EventCategory;
  eventType: string;
  entities?: NarrativeEntity[];
  actions: NarrativeAction[];
  bodyEffects?: NarrativeBodyEffect[];
  environment: NarrativeEnvironment;
  emotionalTone: EmotionalTone;
  sourceHarmEvents?: HarmEvent[];
  choiceMade?: string;
  fatal?: boolean;
  deathCause?: string;
}

/** Build a NarrativeContext from structured parameters */
export function buildNarrativeContext(params: ContextBuilderParams): NarrativeContext {
  return {
    eventCategory: params.eventCategory,
    eventType: params.eventType,
    entities: params.entities ?? [],
    actions: params.actions,
    bodyEffects: params.bodyEffects ?? [],
    environment: params.environment,
    emotionalTone: params.emotionalTone,
    sourceHarmEvents: params.sourceHarmEvents,
    choiceMade: params.choiceMade,
    fatal: params.fatal,
    deathCause: params.deathCause,
  };
}

// ══════════════════════════════════════════════════
//  COMMON ENTITY BUILDERS
// ══════════════════════════════════════════════════

/** Create a NarrativeEntity for a terrain feature */
export function terrainEntity(label: string, perceivedAs: string): NarrativeEntity {
  return {
    perceivedAs,
    actualIdentity: label,
    wisdomThreshold: 0,
    primarySense: 'sight',
    archetype: 'terrain',
  };
}

/** Create a NarrativeEntity for weather/atmospheric phenomena */
export function weatherEntity(label: string, perceivedAs: string): NarrativeEntity {
  return {
    perceivedAs,
    actualIdentity: label,
    wisdomThreshold: 0,
    primarySense: 'touch',
    archetype: 'weather',
  };
}

/** Create a NarrativeEntity for a conspecific (same species) */
export function conspecificEntity(
  perceivedAs: string,
  actualIdentity: string,
  primarySense: 'sight' | 'smell' | 'sound' = 'sight',
): NarrativeEntity {
  return {
    perceivedAs,
    actualIdentity,
    wisdomThreshold: 0, // always recognized
    primarySense,
    archetype: 'conspecific',
  };
}

/** Create a predator entity for fawn defense (coyote, bobcat, eagle) */
export function smallPredatorEntity(
  type: 'coyote' | 'bobcat' | 'eagle',
): NarrativeEntity {
  const specs: Record<string, { perceivedAs: string; actual: string; sense: 'sight' | 'smell' | 'sound'; archetype: NarrativeEntity['archetype'] }> = {
    coyote: {
      perceivedAs: 'a low shape slinking through the grass toward your fawn',
      actual: 'a coyote stalking a fawn',
      sense: 'sight',
      archetype: 'predator-canid',
    },
    bobcat: {
      perceivedAs: 'a spotted shape creeping low, eyes fixed on the small form in the grass',
      actual: 'a bobcat stalking a fawn',
      sense: 'sight',
      archetype: 'predator-felid',
    },
    eagle: {
      perceivedAs: 'a vast shadow circling overhead, wings barely moving, descending',
      actual: 'a golden eagle targeting a fawn',
      sense: 'sight',
      archetype: 'unknown',
    },
  };
  const s = specs[type];
  return {
    perceivedAs: s.perceivedAs,
    actualIdentity: s.actual,
    wisdomThreshold: 30,
    primarySense: s.sense,
    archetype: s.archetype,
  };
}
