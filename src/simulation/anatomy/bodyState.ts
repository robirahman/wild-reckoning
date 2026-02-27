import type { AnatomyDefinition, AnatomyIndex } from './types';
import { buildAnatomyIndex } from './types';
import type { ConditionProgression } from '../conditions/types';

// ── Body Condition Types ──

export type ConditionType =
  | 'fracture'
  | 'laceration'
  | 'contusion' // bruise
  | 'puncture'
  | 'burn'
  | 'frostbite'
  | 'infection'
  | 'sprain'
  | 'dislocation'
  | 'hemorrhage';

/** An active condition on a specific body part */
export interface ActiveBodyCondition {
  id: string; // unique instance ID
  type: ConditionType;
  bodyPartId: string;
  /** 0 = minor, 1 = moderate, 2 = severe, 3 = critical */
  severity: number;
  turnsActive: number;
  /** Whether the condition is trending toward recovery */
  healing: boolean;
  /** Secondary infection level (0-100). Rises if untreated, especially with open wounds */
  infectionLevel: number;
}

/** Damage state of a single body part */
export interface PartState {
  /** Tissue damage levels: tissue ID -> damage (0-100, where 0 = healthy) */
  tissueDamage: Record<string, number>;
  /** Whether this part has been destroyed/amputated beyond recovery */
  destroyed: boolean;
}

/** Runtime state of the animal's entire body */
export interface BodyState {
  /** Per-part damage state, keyed by body part ID */
  parts: Record<string, PartState>;
  /** Current capability effectiveness (0-100, where 100 = fully functional) */
  capabilities: Record<string, number>;
  /** Active conditions (fractures, infections, etc.) */
  conditions: ActiveBodyCondition[];
  /** Condition cascade progression state (keyed by condition ID) */
  conditionProgressions: Record<string, ConditionProgression>;
}

// ── Initialization ──

/** Create a fresh, undamaged BodyState from an anatomy definition */
export function initializeBodyState(anatomy: AnatomyDefinition): BodyState {
  const parts: Record<string, PartState> = {};

  for (const part of anatomy.bodyParts) {
    const tissueDamage: Record<string, number> = {};
    for (const tissueId of part.tissues) {
      tissueDamage[tissueId] = 0;
    }
    parts[part.id] = { tissueDamage, destroyed: false };
  }

  // All capabilities start at 100% effectiveness
  const capabilities: Record<string, number> = {};
  for (const cap of anatomy.capabilities) {
    capabilities[cap.id] = 100;
  }

  return { parts, capabilities, conditions: [], conditionProgressions: {} };
}

/** Create an AnatomyIndex and initialized BodyState in one call */
export function initializeAnatomy(anatomy: AnatomyDefinition): {
  index: AnatomyIndex;
  bodyState: BodyState;
} {
  return {
    index: buildAnatomyIndex(anatomy),
    bodyState: initializeBodyState(anatomy),
  };
}
