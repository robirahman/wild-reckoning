import type { BodyZone } from '../anatomy/types';

// ── Harm Events ──

/** The type of physical interaction causing harm */
export type HarmType = 'blunt' | 'sharp' | 'thermal-cold' | 'thermal-heat' | 'chemical' | 'biological';

/**
 * A HarmEvent represents a physical interaction applied to the animal.
 * This is the input to the harm resolver.
 */
export interface HarmEvent {
  id: string;
  /** Human-readable source: "coyote bite", "fall from ledge", "antler strike" */
  sourceLabel: string;
  /** Force magnitude (0-100). Higher = more damaging. */
  magnitude: number;
  /** Target body zone, or 'random' for an unfocused event */
  targetZone: BodyZone | 'random';
  /**
   * How spread out the force is across the zone.
   * 0 = concentrated on one body part, 1 = distributed across the whole zone.
   */
  spread: number;
  /** The type of interaction */
  harmType: HarmType;
  /** Optional: specific body part ID to target (overrides zone-based targeting) */
  targetPartId?: string;
}

// ── Harm Results ──

/** Damage result for a single body part */
export interface PartDamageResult {
  bodyPartId: string;
  bodyPartLabel: string;
  /** Per-tissue damage inflicted */
  tissueDamage: { tissueId: string; tissueLabel: string; damageInflicted: number; newTotal: number }[];
  /** The condition produced (fracture, laceration, etc.), if any */
  conditionProduced?: {
    type: string; // ConditionType
    severity: number; // 0-3
  };
}

/** Impairment change for a capability */
export interface CapabilityImpairmentDelta {
  capabilityId: string;
  capabilityLabel: string;
  /** How many points the capability dropped (0-100 scale) */
  impairmentDelta: number;
  /** New absolute effectiveness (0-100) */
  newEffectiveness: number;
}

/**
 * The full result of resolving a HarmEvent against an anatomy.
 * This is what the harm resolver returns.
 */
export interface HarmResult {
  /** Source harm event ID */
  harmEventId: string;
  /** Per-part damage breakdown */
  damagedParts: PartDamageResult[];
  /** Capability impairment changes */
  capabilityImpairment: CapabilityImpairmentDelta[];
  /** Pain generated (maps to TRA increase). 0-100 scale. */
  painGenerated: number;
  /** Blood loss rate (maps to ongoing HEA decrease). 0-100 scale. */
  bloodLoss: number;
  /** Infection risk (maps to IMM pressure). 0-1 probability. */
  infectionRisk: number;
  /** Whether this harm event directly killed the animal */
  fatal: boolean;
  /** Death cause if fatal */
  fatalReason?: string;
}
