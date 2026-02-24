import { StatId } from './stats';

export type Severity = 'minor' | 'moderate' | 'severe' | 'critical';

export const SEVERITY_ORDER: Severity[] = ['minor', 'moderate', 'severe', 'critical'];

// ── Parasites ──

export interface ParasiteStage {
  severity: Severity;
  description: string;
  statEffects: { stat: StatId; amount: number }[];
  secondaryEffects: string[]; // "leads to helminthiasis", "minor chance of neurodegenerative disease"
  turnDuration: { min: number; max: number }; // How long this stage lasts before progression check
  progressionChance: number; // 0-1 chance per turn to advance to next stage
  remissionChance: number; // 0-1 chance per turn to improve to previous stage
}

export interface ParasiteDefinition {
  id: string;
  name: string;
  scientificName?: string;
  description: string;
  transmissionMethod: string;
  affectedSpecies: string[]; // Species IDs that can be infected
  stages: ParasiteStage[];
  image?: string;
}

export interface ActiveParasite {
  definitionId: string;
  currentStage: number; // Index into ParasiteDefinition.stages
  turnsAtCurrentStage: number;
  acquiredOnTurn: number;
}

// ── Injuries ──

export interface InjurySeverityLevel {
  severity: Severity;
  description: string;
  statEffects: { stat: StatId; amount: number }[];
  baseHealingTime: number; // Turns to heal at this severity with rest
  worseningChance: number; // 0-1 chance per turn to worsen if not resting
  permanentDebuffChance: number; // 0-1 chance of permanent stat damage if untreated
}

export interface InjuryDefinition {
  id: string;
  name: string;
  bodyParts: string[]; // Possible body parts: "front left ulna", "hind right femur", etc.
  severityLevels: InjurySeverityLevel[];
}

export interface ActiveInjury {
  definitionId: string;
  currentSeverity: number; // Index into InjuryDefinition.severityLevels
  turnsRemaining: number; // Turns until healed (if resting)
  bodyPartDetail: string; // Specific body part: "front left ulna"
  isResting: boolean; // Whether the animal is resting this injury
  acquiredOnTurn: number;
}

// ── Secondary Conditions ──

export interface ConditionDefinition {
  id: string;
  name: string;
  description: string;
  triggeredBy: { sourceType: 'parasite' | 'injury'; sourceId: string; minSeverity: Severity };
  statEffects: { stat: StatId; amount: number }[];
  permanent: boolean;
}

export interface ActiveCondition {
  definitionId: string;
  acquiredOnTurn: number;
}
