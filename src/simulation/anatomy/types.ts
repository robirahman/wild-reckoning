import { StatId } from '../../types/stats';

// ── Tissue Types ──

/** A tissue type defines material properties of biological structures */
export interface TissueType {
  id: string; // 'bone', 'muscle', 'skin', 'nerve', 'organ', 'cartilage', 'tendon'
  label: string;
  /** Normalized force threshold (0-100) needed to cause damage */
  fractureThreshold: number;
  /** Base healing speed per turn (0-1 scale; 0 = no healing, 1 = heals in one turn) */
  healingRate: number;
  /** How much damage to this tissue contributes to pain/TRA (0-1 multiplier) */
  painSensitivity: number;
  /** How much damage to this tissue causes blood loss (0-1 multiplier) */
  bleedRate: number;
  /** How susceptible damage here is to infection (0-1 multiplier) */
  infectionSusceptibility: number;
}

// ── Body Parts ──

/** A single body part in the anatomical tree */
export interface BodyPart {
  id: string; // 'front-left-ulna', 'torso', 'left-eye'
  label: string; // 'front left ulna', 'torso', 'left eye'
  /** Parent body part ID. Undefined for root parts (e.g., 'torso') */
  parent?: string;
  /** Tissue type IDs present in this body part */
  tissues: string[];
  /** Capabilities this body part contributes to, with contribution weight */
  capabilityContributions: CapabilityContribution[];
  /** Paired bilateral part ID (e.g., front-left-leg pairs with front-right-leg) */
  bilateral?: string;
  /** If true, severe damage here can directly cause death */
  vital: boolean;
  /** Relative size/surface area (0-1) — affects targeting probability */
  targetWeight: number;
  /** Body zone for grouping (used in harm targeting) */
  zone: BodyZone;
  /** Whether this part exists conditionally (e.g., antlers only in certain seasons or sexes) */
  conditional?: {
    sex?: 'male' | 'female';
    seasonal?: boolean; // e.g., antlers shed and regrow
  };
}

export interface CapabilityContribution {
  capabilityId: string;
  /** How much this body part contributes to the capability (0-1) */
  weight: number;
}

/** Body zones for targeting groups of parts */
export type BodyZone =
  | 'head'
  | 'neck'
  | 'torso'
  | 'front-legs'
  | 'hind-legs'
  | 'tail'
  | 'skin' // covering zone
  | 'internal'; // organs

// ── Capabilities ──

/**
 * A capability is something the animal can do, derived from contributing
 * body part health. Impairment affects game stats.
 */
export interface Capability {
  id: string; // 'locomotion', 'vision', 'breathing', 'digestion', 'thermoregulation'
  label: string;
  /** How impairment of this capability maps to game stat changes */
  statMappings: CapabilityStatMapping[];
  /** If true, full impairment (100%) triggers a death check */
  survivalCritical: boolean;
  /** Death cause description if this capability fails completely */
  deathCause?: string;
}

export interface CapabilityStatMapping {
  stat: StatId;
  /**
   * Per percentage point of impairment (0-100), add this much to the stat.
   * E.g., locomotion impairment: +0.3 per point to STR means 50% impairment = +15 STR.
   * Use positive for stress stats (bad), negative for fitness stats (bad).
   */
  perPointImpairment: number;
}

// ── Anatomy Definition ──

/** Complete anatomy definition for a species */
export interface AnatomyDefinition {
  speciesId: string;
  tissues: TissueType[];
  bodyParts: BodyPart[];
  capabilities: Capability[];
}

// ── Lookup helpers ──

/** Build indexed lookups from an anatomy definition for fast access */
export interface AnatomyIndex {
  definition: AnatomyDefinition;
  tissueById: Map<string, TissueType>;
  partById: Map<string, BodyPart>;
  capabilityById: Map<string, Capability>;
  /** All body parts in a given zone */
  partsByZone: Map<BodyZone, BodyPart[]>;
  /** Direct children of a body part */
  childrenOf: Map<string, BodyPart[]>;
}

export function buildAnatomyIndex(def: AnatomyDefinition): AnatomyIndex {
  const tissueById = new Map(def.tissues.map((t) => [t.id, t]));
  const partById = new Map(def.bodyParts.map((p) => [p.id, p]));
  const capabilityById = new Map(def.capabilities.map((c) => [c.id, c]));

  const partsByZone = new Map<BodyZone, BodyPart[]>();
  for (const part of def.bodyParts) {
    const list = partsByZone.get(part.zone) ?? [];
    list.push(part);
    partsByZone.set(part.zone, list);
  }

  const childrenOf = new Map<string, BodyPart[]>();
  for (const part of def.bodyParts) {
    if (part.parent) {
      const siblings = childrenOf.get(part.parent) ?? [];
      siblings.push(part);
      childrenOf.set(part.parent, siblings);
    }
  }

  return { definition: def, tissueById, partById, capabilityById, partsByZone, childrenOf };
}
