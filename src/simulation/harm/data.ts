import type { HarmType } from './types';
import type { ConditionType } from '../anatomy/bodyState';

/**
 * Harm type affinity multipliers: how effective each harm type is against each tissue.
 *
 * Values > 1 mean the harm type is especially effective against that tissue.
 * Values < 1 mean the tissue is resistant to that harm type.
 * Default (missing entry) = 1.0.
 */
export const HARM_TYPE_AFFINITIES: Record<HarmType, Record<string, number>> = {
  blunt:         { bone: 1.2, muscle: 0.8, skin: 0.6, tendon: 0.9, nerve: 0.5, organ: 1.0, cartilage: 1.0, 'eye-tissue': 0.8, antler: 1.3 },
  sharp:         { bone: 0.5, muscle: 1.3, skin: 1.5, tendon: 1.2, nerve: 0.8, organ: 1.4, cartilage: 0.7, 'eye-tissue': 1.5, antler: 0.3 },
  'thermal-cold': { bone: 0.3, muscle: 0.5, skin: 1.2, tendon: 0.4, nerve: 0.8, organ: 0.3, cartilage: 0.3, 'eye-tissue': 0.6, antler: 0.1 },
  'thermal-heat': { bone: 0.2, muscle: 0.6, skin: 1.4, tendon: 0.5, nerve: 0.7, organ: 0.4, cartilage: 0.3, 'eye-tissue': 0.8, antler: 0.1 },
  chemical:      { bone: 0.1, muscle: 0.4, skin: 1.0, tendon: 0.3, nerve: 0.6, organ: 1.5, cartilage: 0.2, 'eye-tissue': 1.3, antler: 0.0 },
  biological:    { bone: 0.2, muscle: 0.5, skin: 0.8, tendon: 0.3, nerve: 0.8, organ: 1.2, cartilage: 0.2, 'eye-tissue': 0.5, antler: 0.0 },
};

/**
 * Mapping from (tissue, harmType) to the condition type produced.
 *
 * Lookup order: first check for a specific (tissue, harmType) pair,
 * then fall back to the tissue's default condition.
 */
interface ConditionMapping {
  tissueId: string;
  harmType?: HarmType;
  conditionType: ConditionType;
}

const CONDITION_MAPPINGS: ConditionMapping[] = [
  // Bone: always fracture regardless of harm type
  { tissueId: 'bone', conditionType: 'fracture' },

  // Muscle/tendon: blunt → contusion, other → laceration
  { tissueId: 'muscle', harmType: 'blunt', conditionType: 'contusion' },
  { tissueId: 'muscle', conditionType: 'laceration' },
  { tissueId: 'tendon', harmType: 'blunt', conditionType: 'contusion' },
  { tissueId: 'tendon', conditionType: 'laceration' },

  // Skin: varies by harm type
  { tissueId: 'skin', harmType: 'sharp', conditionType: 'laceration' },
  { tissueId: 'skin', harmType: 'blunt', conditionType: 'contusion' },
  { tissueId: 'skin', harmType: 'thermal-cold', conditionType: 'frostbite' },
  { tissueId: 'skin', harmType: 'thermal-heat', conditionType: 'burn' },
  { tissueId: 'skin', conditionType: 'puncture' }, // default for chemical, biological

  // Organ: sharp → puncture, other → hemorrhage
  { tissueId: 'organ', harmType: 'sharp', conditionType: 'puncture' },
  { tissueId: 'organ', conditionType: 'hemorrhage' },

  // Nerve: always contusion
  { tissueId: 'nerve', conditionType: 'contusion' },
];

/**
 * Look up the harm type multiplier for a given harm type and tissue.
 */
export function getHarmTypeMultiplier(harmType: HarmType, tissueId: string): number {
  return HARM_TYPE_AFFINITIES[harmType]?.[tissueId] ?? 1.0;
}

/**
 * Determine what condition type is produced when a harm type damages a tissue.
 * Returns undefined for tissues that don't produce conditions (e.g. cartilage, eye-tissue, antler).
 */
export function determineConditionType(harmType: HarmType, tissueId: string): ConditionType | undefined {
  // First try specific (tissue, harmType) match
  const specific = CONDITION_MAPPINGS.find(m => m.tissueId === tissueId && m.harmType === harmType);
  if (specific) return specific.conditionType;

  // Fall back to tissue default (entry with no harmType)
  const fallback = CONDITION_MAPPINGS.find(m => m.tissueId === tissueId && !m.harmType);
  return fallback?.conditionType;
}
