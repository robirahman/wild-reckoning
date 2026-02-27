/**
 * Condition Cascade System — Wound Progression Types
 *
 * Replaces the flat infection logic (5% per turn, +10 increment) with a
 * phase-based model where conditions evolve through biologically realistic
 * stages. Each phase has different transition probabilities affected by
 * immune state, body condition, and environmental factors.
 */

// ── Condition Phases ──

/**
 * Phases a wound or condition can progress through.
 *
 * Open wounds (laceration, puncture):
 *   acute → inflammatory → [healing | infected]
 *   infected → [septic | recovering]
 *   septic → [death | recovering]
 *   recovering → [healed | chronic]
 *
 * Closed injuries (fracture, contusion, sprain, dislocation):
 *   acute → inflammatory → recovering → [healed | chronic]
 *
 * Burns/frostbite:
 *   acute → inflammatory → [infected | recovering]
 *   (same as open wounds but with different transition rates)
 */
export type ConditionPhase =
  | 'acute'         // initial trauma (0-3 turns)
  | 'inflammatory'  // body's initial response (swelling, pain)
  | 'healing'       // normal recovery trajectory
  | 'infected'      // bacterial infection has taken hold
  | 'septic'        // systemic infection — life-threatening
  | 'recovering'    // past the crisis, on the mend
  | 'chronic'       // permanent or long-term damage (scarring, weakness)
  | 'resolved';     // fully healed, condition can be removed

// ── Condition Progression State ──

/** Extended state tracked for each condition during cascade progression */
export interface ConditionProgression {
  /** Current phase */
  phase: ConditionPhase;
  /** Turns spent in current phase */
  turnsInPhase: number;
  /** Fever level (degrees of core temperature deviation, 0-5+) */
  feverLevel: number;
  /** Whether the wound has been cleaned (water access, grooming) */
  cleaned: boolean;
  /** Whether the animal is resting (low foraging effort) */
  resting: boolean;
  /** The trigger ID that caused this condition (for causal chain tracking) */
  sourceTrigger?: string;
  /** Turn the condition was acquired */
  acquiredTurn: number;
}

// ── Phase Transition Parameters ──

/** Parameters controlling transition probabilities between phases */
export interface PhaseTransitionParams {
  /** Base chance per turn to transition from inflammatory → infected (0-1) */
  baseInfectionChance: number;
  /** Modifier when immunocompromised (multiplied) */
  immunoCompromisedMultiplier: number;
  /** Modifier when wound has been cleaned (multiplied, < 1 = reduces chance) */
  cleanedMultiplier: number;
  /** Modifier when body condition score is low (multiplied per BCS point below 3) */
  lowBCSMultiplier: number;
  /** Base chance per turn to transition from infected → septic */
  baseSepsisChance: number;
  /** Base chance per turn to recover from infected → recovering */
  baseRecoveryChance: number;
  /** Chance that sepsis is fatal per turn */
  sepsisMortalityChance: number;
  /** Chance recovering → chronic (permanent scarring/weakness) */
  chronicChance: number;
  /** Min turns in acute phase before transition */
  acuteMinTurns: number;
  /** Min turns in inflammatory phase before transition */
  inflammatoryMinTurns: number;
  /** Fever increase per turn when infected */
  feverRateInfected: number;
  /** Fever increase per turn when septic */
  feverRateSeptic: number;
  /** Fever recovery rate per turn when recovering */
  feverRecoveryRate: number;
}

// ── Default Parameters ──

/** Default transition parameters for open wounds (laceration, puncture) */
export const OPEN_WOUND_PARAMS: PhaseTransitionParams = {
  baseInfectionChance: 0.12,
  immunoCompromisedMultiplier: 2.5,
  cleanedMultiplier: 0.3,
  lowBCSMultiplier: 1.4,
  baseSepsisChance: 0.08,
  baseRecoveryChance: 0.15,
  sepsisMortalityChance: 0.12,
  chronicChance: 0.1,
  acuteMinTurns: 2,
  inflammatoryMinTurns: 2,
  feverRateInfected: 0.6,
  feverRateSeptic: 1.2,
  feverRecoveryRate: 0.4,
};

/** Parameters for burns and frostbite (higher infection risk) */
export const THERMAL_WOUND_PARAMS: PhaseTransitionParams = {
  ...OPEN_WOUND_PARAMS,
  baseInfectionChance: 0.18,
  baseSepsisChance: 0.1,
  chronicChance: 0.2, // burns/frostbite often leave permanent damage
};

/** Parameters for closed injuries (fracture, contusion, sprain, dislocation) */
export const CLOSED_INJURY_PARAMS: PhaseTransitionParams = {
  ...OPEN_WOUND_PARAMS,
  baseInfectionChance: 0.02, // closed injuries rarely get infected
  baseSepsisChance: 0.01,
  baseRecoveryChance: 0.2,
  chronicChance: 0.15, // fractures can leave chronic weakness
  feverRateInfected: 0.3,
  feverRateSeptic: 0.8,
};

// ── Condition Category Classification ──

/** Classify a condition type into its wound category for parameter selection */
export function getWoundCategory(conditionType: string): 'open' | 'thermal' | 'closed' {
  switch (conditionType) {
    case 'laceration':
    case 'puncture':
    case 'hemorrhage':
      return 'open';
    case 'burn':
    case 'frostbite':
      return 'thermal';
    case 'fracture':
    case 'contusion':
    case 'sprain':
    case 'dislocation':
    case 'infection':
    default:
      return 'closed';
  }
}

/** Get the transition parameters for a given condition type */
export function getTransitionParams(conditionType: string): PhaseTransitionParams {
  const category = getWoundCategory(conditionType);
  switch (category) {
    case 'open': return OPEN_WOUND_PARAMS;
    case 'thermal': return THERMAL_WOUND_PARAMS;
    case 'closed': return CLOSED_INJURY_PARAMS;
  }
}

// ── Tick Result ──

/** Result of ticking condition progression for one turn */
export interface ConditionTickResult {
  /** Updated conditions (some may have been resolved) */
  conditions: ConditionProgressionEntry[];
  /** Total fever level across all infected/septic conditions */
  totalFeverLevel: number;
  /** Narratives generated by condition phase transitions */
  narratives: string[];
  /** Death cause if sepsis is fatal */
  deathCause?: string;
  /** Conditions that just transitioned to 'infected' (for event triggers) */
  newlyInfected: string[];
  /** Conditions that just transitioned to 'septic' (for event triggers) */
  newlySeptic: string[];
}

/** A condition with its cascade progression state */
export interface ConditionProgressionEntry {
  /** The condition's unique instance ID (matches ActiveBodyCondition.id) */
  conditionId: string;
  /** Cascade progression state */
  progression: ConditionProgression;
  /** Whether this condition should be removed (resolved) */
  resolved: boolean;
}

// ── Factory ──

/** Create an initial progression state for a newly acquired condition */
export function createConditionProgression(
  sourceTrigger: string | undefined,
  acquiredTurn: number,
): ConditionProgression {
  return {
    phase: 'acute',
    turnsInPhase: 0,
    feverLevel: 0,
    cleaned: false,
    resting: false,
    sourceTrigger,
    acquiredTurn,
  };
}
