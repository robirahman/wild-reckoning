import type { ActiveBodyCondition } from '../anatomy/bodyState';
import type { PhysiologyState } from '../physiology/types';
import type { Rng } from '../../engine/RandomUtils';
import type {
  ConditionProgression,
  ConditionTickResult,
  ConditionProgressionEntry,
  PhaseTransitionParams,
} from './types';
import {
  getTransitionParams,
  getWoundCategory,
  createConditionProgression,
} from './types';

/** Context needed by the condition progression engine */
export interface ConditionProgressionContext {
  /** Current physiology state (for immune capacity, BCS) */
  physiology: PhysiologyState;
  /** Current body conditions from anatomy system */
  conditions: ActiveBodyCondition[];
  /** Existing progression state (keyed by condition ID) */
  progressions: Record<string, ConditionProgression>;
  /** Current turn */
  turn: number;
  /** RNG */
  rng: Rng;
  /** Fast-forward multiplier */
  ffMult: number;
  /** Current foraging behavior (1-5 scale, low = resting) */
  foragingBehavior: number;
  /** Whether the animal is near water (for wound cleaning) */
  nearWater: boolean;
}

/**
 * Tick condition progression for all active conditions.
 * Pure function: reads conditions + physiology state, produces updated
 * progression states, narratives, and death causes.
 *
 * This replaces the flat 5%/turn infection logic in HealthSystem.tickBodyState().
 */
export function tickConditionProgression(ctx: ConditionProgressionContext): ConditionTickResult {
  const entries: ConditionProgressionEntry[] = [];
  const narratives: string[] = [];
  const newlyInfected: string[] = [];
  const newlySeptic: string[] = [];
  let totalFeverLevel = 0;
  let deathCause: string | undefined;

  const isImmunocompromised = ctx.physiology.immunocompromised;
  const bcs = ctx.physiology.bodyConditionScore;
  const isResting = ctx.foragingBehavior <= 2;

  for (const condition of ctx.conditions) {
    // Get or create progression state for this condition
    let prog = ctx.progressions[condition.id];
    if (!prog) {
      prog = createConditionProgression(undefined, ctx.turn);
    } else {
      prog = { ...prog }; // clone to avoid mutation
    }

    // Update environmental factors
    prog.resting = isResting;
    if (ctx.nearWater && !prog.cleaned) {
      // Near water allows wound cleaning (one-time benefit)
      prog.cleaned = true;
    }

    const params = getTransitionParams(condition.type);
    const woundCategory = getWoundCategory(condition.type);

    // Advance turns in phase
    prog.turnsInPhase += ctx.ffMult;

    // Process phase transitions
    const prevPhase = prog.phase;
    prog = advancePhase(prog, params, condition, ctx, woundCategory);

    // Track phase transitions for event triggers
    if (prevPhase !== 'infected' && prog.phase === 'infected') {
      newlyInfected.push(condition.id);
    }
    if (prevPhase !== 'septic' && prog.phase === 'septic') {
      newlySeptic.push(condition.id);
    }

    // Update fever based on phase
    prog.feverLevel = updateFever(prog, params, ctx.ffMult);
    totalFeverLevel += prog.feverLevel;

    // Generate transition narratives
    if (prevPhase !== prog.phase) {
      const narrative = getTransitionNarrative(prevPhase, prog.phase, condition.bodyPartId, woundCategory);
      if (narrative) narratives.push(narrative);
    }

    // Check for sepsis death
    if (prog.phase === 'septic') {
      const mortalityChance = params.sepsisMortalityChance
        * (isImmunocompromised ? 2 : 1)
        * (bcs <= 1 ? 2 : bcs <= 2 ? 1.3 : 1)
        * ctx.ffMult;

      if (ctx.rng.chance(Math.min(0.8, mortalityChance))) {
        deathCause = 'Sepsis';
        narratives.push('The infection has spread through your blood. Your body is shutting down.');
      }
    }

    entries.push({
      conditionId: condition.id,
      progression: prog,
      resolved: prog.phase === 'resolved',
    });
  }

  return {
    conditions: entries,
    totalFeverLevel,
    narratives,
    deathCause,
    newlyInfected,
    newlySeptic,
  };
}

/**
 * Advance a single condition through its phase model.
 */
function advancePhase(
  prog: ConditionProgression,
  params: PhaseTransitionParams,
  condition: ActiveBodyCondition,
  ctx: ConditionProgressionContext,
  _woundCategory: 'open' | 'thermal' | 'closed',
): ConditionProgression {
  const rng = ctx.rng;
  const isImmunocompromised = ctx.physiology.immunocompromised;
  const bcs = ctx.physiology.bodyConditionScore;

  switch (prog.phase) {
    case 'acute': {
      // Acute phase: initial trauma. Transition to inflammatory after min turns.
      if (prog.turnsInPhase >= params.acuteMinTurns) {
        prog.phase = 'inflammatory';
        prog.turnsInPhase = 0;
      }
      break;
    }

    case 'inflammatory': {
      // Inflammatory phase: body's initial response.
      // Open/thermal wounds: chance of infection or normal healing.
      // Closed injuries: always proceed to healing (rare infection).
      if (prog.turnsInPhase < params.inflammatoryMinTurns) break;

      // Compute infection probability
      let infectionChance = params.baseInfectionChance;
      if (isImmunocompromised) infectionChance *= params.immunoCompromisedMultiplier;
      if (prog.cleaned) infectionChance *= params.cleanedMultiplier;
      if (bcs < 3) infectionChance *= params.lowBCSMultiplier * (3 - bcs);
      if (!prog.resting) infectionChance *= 1.3; // activity aggravates wounds
      if (condition.severity >= 2) infectionChance *= 1.5; // severe wounds infect more easily

      // Scale by ffMult for fast-forward (approximate: 1-(1-p)^n)
      const effectiveInfectionChance = 1 - Math.pow(1 - infectionChance, ctx.ffMult);

      if (rng.chance(effectiveInfectionChance)) {
        prog.phase = 'infected';
        prog.turnsInPhase = 0;
      } else if (prog.turnsInPhase >= params.inflammatoryMinTurns + 2) {
        // If no infection after inflammatory period, begin normal healing
        prog.phase = 'healing';
        prog.turnsInPhase = 0;
      }
      break;
    }

    case 'healing': {
      // Normal healing trajectory. Condition resolves when turnsActive is high
      // enough and underlying tissue damage is low (handled by HealthSystem).
      // Can still become chronic if healing is prolonged.
      if (prog.turnsInPhase > 8 && condition.turnsActive > 12) {
        if (condition.severity >= 2 && rng.chance(params.chronicChance)) {
          prog.phase = 'chronic';
          prog.turnsInPhase = 0;
        } else {
          prog.phase = 'resolved';
          prog.turnsInPhase = 0;
        }
      }
      break;
    }

    case 'infected': {
      // Infection has taken hold. Can progress to sepsis or recover.
      let recoveryChance = params.baseRecoveryChance;
      if (!isImmunocompromised) recoveryChance *= 1.5; // healthy immune system helps
      if (prog.resting) recoveryChance *= 1.3; // rest helps
      if (prog.cleaned) recoveryChance *= 1.2;

      let sepsisChance = params.baseSepsisChance;
      if (isImmunocompromised) sepsisChance *= 2;
      if (bcs <= 2) sepsisChance *= 1.5;

      const effectiveRecovery = 1 - Math.pow(1 - recoveryChance, ctx.ffMult);
      const effectiveSepsis = 1 - Math.pow(1 - sepsisChance, ctx.ffMult);

      // Sepsis check first (higher priority)
      if (rng.chance(effectiveSepsis)) {
        prog.phase = 'septic';
        prog.turnsInPhase = 0;
      } else if (rng.chance(effectiveRecovery)) {
        prog.phase = 'recovering';
        prog.turnsInPhase = 0;
      }
      break;
    }

    case 'septic': {
      // Systemic infection. Recovery possible if immune system is strong enough.
      const survivalChance = isImmunocompromised ? 0.05 : 0.12;
      const effectiveSurvival = 1 - Math.pow(1 - survivalChance, ctx.ffMult);

      if (rng.chance(effectiveSurvival)) {
        prog.phase = 'recovering';
        prog.turnsInPhase = 0;
      }
      // Otherwise, mortality check happens in the main loop
      break;
    }

    case 'recovering': {
      // Past the crisis. Fever subsides. May become chronic or fully resolve.
      if (prog.turnsInPhase >= 4) {
        if (condition.severity >= 2 && rng.chance(params.chronicChance * 2)) {
          prog.phase = 'chronic';
          prog.turnsInPhase = 0;
        } else {
          prog.phase = 'resolved';
          prog.turnsInPhase = 0;
        }
      }
      break;
    }

    case 'chronic': {
      // Permanent or long-term condition. Does not resolve on its own.
      // The condition remains but stops progressing.
      break;
    }

    case 'resolved': {
      // Fully healed. Will be cleaned up.
      break;
    }
  }

  return prog;
}

/**
 * Update fever level based on current phase.
 */
function updateFever(
  prog: ConditionProgression,
  params: PhaseTransitionParams,
  ffMult: number,
): number {
  switch (prog.phase) {
    case 'infected':
      return Math.min(5, prog.feverLevel + params.feverRateInfected * ffMult);
    case 'septic':
      return Math.min(8, prog.feverLevel + params.feverRateSeptic * ffMult);
    case 'recovering':
      return Math.max(0, prog.feverLevel - params.feverRecoveryRate * ffMult);
    default:
      // Fever decays in non-infected phases
      return Math.max(0, prog.feverLevel - 0.3 * ffMult);
  }
}

/**
 * Generate a narrative for a phase transition.
 */
function getTransitionNarrative(
  from: string,
  to: string,
  _bodyPartId: string,
  woundCategory: 'open' | 'thermal' | 'closed',
): string | undefined {
  if (from === 'inflammatory' && to === 'infected') {
    if (woundCategory === 'open') {
      return 'The wound has begun to fester. A foul warmth radiates from it, and the edges are swollen and discolored. Your body is losing this fight.';
    }
    if (woundCategory === 'thermal') {
      return 'The damaged tissue has become infected. The area is swollen, hot to the touch, weeping fluid that smells wrong.';
    }
    return 'Something is wrong inside. A deep, throbbing heat where the injury was, growing stronger instead of fading.';
  }

  if (to === 'septic') {
    return 'The infection has spread beyond the wound. Your whole body feels wrong — trembling, burning, sluggish. The fever is climbing. You can feel yourself weakening.';
  }

  if (from === 'infected' && to === 'recovering') {
    return 'The fever is breaking. The wound still aches, but the angry heat is receding. Your body rallied.';
  }

  if (from === 'septic' && to === 'recovering') {
    return 'Against all odds, the fever has broken. You are impossibly weak, but alive. The worst is behind you.';
  }

  if (to === 'chronic') {
    if (woundCategory === 'closed') {
      return 'The old injury has left its mark. The area is stiff and weak — it may never fully recover.';
    }
    return 'The wound has closed, but the scar tissue is thick and tight. A permanent reminder.';
  }

  if (to === 'healing') {
    return undefined; // Normal healing doesn't need a dramatic narrative
  }

  if (to === 'resolved') {
    return undefined; // Clean resolution is handled by HealthSystem
  }

  return undefined;
}
