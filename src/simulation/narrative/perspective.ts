import type { NarrativeEntity, NarrativeBodyEffect, EntityArchetype } from './types';
import type { PartDamageResult, HarmResult } from '../harm/types';
import type { AnatomyIndex } from '../anatomy/types';
import type { ActiveBodyCondition } from '../anatomy/bodyState';

// ══════════════════════════════════════════════════
//  ENTITY DISCLOSURE
// ══════════════════════════════════════════════════

/**
 * Determine how to describe an entity based on the animal's wisdom level.
 *
 * Below the WIS threshold: use perceivedAs (sensory impression).
 * At or above: use actualIdentity (species name / object name).
 *
 * From simulation_refactor.md: "the narration itself shouldn't make this
 * information any clearer than it natively is to the animal"
 */
export function describeEntity(entity: NarrativeEntity, wisdomLevel: number): string {
  if (wisdomLevel >= entity.wisdomThreshold) {
    return entity.actualIdentity;
  }
  return entity.perceivedAs;
}

/**
 * For the debriefing mode: always return the clinical identity.
 */
export function describeEntityClinical(entity: NarrativeEntity): string {
  return entity.actualIdentity;
}

// ══════════════════════════════════════════════════
//  PREDATOR ENTITY BUILDERS
// ══════════════════════════════════════════════════

/** Create a NarrativeEntity for a wolf / wolf pack */
export function wolfEntity(packSize?: number): NarrativeEntity {
  const count = packSize ?? 3;
  return {
    perceivedAs: count > 1
      ? 'lean gray shapes flowing between the trunks, spreading in a loose arc'
      : 'a large gray shape, low and deliberate, watching from the tree line',
    actualIdentity: count > 1 ? `a pack of ${count} gray wolves` : 'a gray wolf',
    wisdomThreshold: 40,
    primarySense: 'smell',
    archetype: 'predator-canid',
  };
}

/** Create a NarrativeEntity for a coyote / pair */
export function coyoteEntity(): NarrativeEntity {
  return {
    perceivedAs: 'smaller shapes, rangier than wolves, shadowing through the brush with tentative patience',
    actualIdentity: 'a pair of coyotes',
    wisdomThreshold: 35,
    primarySense: 'sight',
    archetype: 'predator-canid',
  };
}

/** Create a NarrativeEntity for a cougar */
export function cougarEntity(): NarrativeEntity {
  return {
    perceivedAs: 'a tawny shape launching from above, silent and enormous, all muscle and claw',
    actualIdentity: 'a cougar',
    wisdomThreshold: 50,
    primarySense: 'sight',
    archetype: 'predator-felid',
  };
}

/** Create a NarrativeEntity for a human hunter */
export function hunterEntity(): NarrativeEntity {
  return {
    perceivedAs: 'bright shapes moving where there should be stillness, trailing sharp chemical scent',
    actualIdentity: 'a human hunter with a rifle',
    wisdomThreshold: 60,
    primarySense: 'smell',
    archetype: 'predator-human',
  };
}

/** Create a NarrativeEntity for a vehicle */
export function vehicleEntity(): NarrativeEntity {
  return {
    perceivedAs: 'two blazing lights growing at impossible speed, accompanied by a rising roar',
    actualIdentity: 'a vehicle',
    wisdomThreshold: 55,
    primarySense: 'sight',
    archetype: 'vehicle',
  };
}

/** Create a NarrativeEntity for a rival buck */
export function rivalBuckEntity(name?: string): NarrativeEntity {
  return {
    perceivedAs: 'another buck, antlers lowered, walking toward you with stiff-legged fury',
    actualIdentity: name ? `a rival buck (${name})` : 'a rival buck',
    wisdomThreshold: 0, // conspecifics are always recognized
    primarySense: 'smell',
    archetype: 'conspecific',
  };
}

// ══════════════════════════════════════════════════
//  BODY PART DISCLOSURE
// ══════════════════════════════════════════════════

/**
 * Body part names are ALWAYS disclosed.
 * From simulation_refactor.md: "we should say 'broken ulna' and so on,
 * because the deer obviously feels *where* a prolonged injury is"
 */
export function describeBodyPart(partId: string, anatomy: AnatomyIndex): string {
  const part = anatomy.partById.get(partId);
  return part?.label ?? partId;
}

// ══════════════════════════════════════════════════
//  CONDITION / MEDICAL TERM DISCLOSURE
// ══════════════════════════════════════════════════

/**
 * Medical terms are disclosed when the information is NOT actionable —
 * i.e., knowing the name doesn't help the player metagame.
 *
 * From simulation_refactor.md:
 * - "Knowing that a foul-smelling sore is a 'bacterial infection' doesn't
 *    allow you to do anything you wouldn't otherwise do"
 * - "Knowing that lancing pain is a 'brainworm' doesn't help you fix it"
 *
 * Actionable information (like "these are your intestines, don't chew them")
 * is withheld and described literally instead.
 */

interface ConditionDescription {
  /** Animal-perspective description */
  animalView: string;
  /** Clinical description (always used in debriefing) */
  clinicalView: string;
  /** Whether the medical term is safe to disclose during gameplay */
  discloseTermDuringPlay: boolean;
}

const CONDITION_DESCRIPTIONS: Record<string, ConditionDescription> = {
  fracture: {
    animalView: 'broken',
    clinicalView: 'fracture',
    discloseTermDuringPlay: true, // "broken bone" is felt, not metagamed
  },
  laceration: {
    animalView: 'torn open',
    clinicalView: 'laceration',
    discloseTermDuringPlay: true, // you feel the wound
  },
  bruise: {
    animalView: 'deeply bruised',
    clinicalView: 'contusion',
    discloseTermDuringPlay: true,
  },
  infection: {
    animalView: 'hot, swollen, oozing foul-smelling discharge',
    clinicalView: 'bacterial infection',
    discloseTermDuringPlay: true, // non-actionable
  },
  frostbite: {
    animalView: 'numb and stiff, the skin waxy and pale',
    clinicalView: 'frostbite',
    discloseTermDuringPlay: true, // non-actionable
  },
  burn: {
    animalView: 'blistered and raw',
    clinicalView: 'thermal burn',
    discloseTermDuringPlay: true,
  },
  puncture: {
    animalView: 'a deep hole that won\'t stop seeping',
    clinicalView: 'puncture wound',
    discloseTermDuringPlay: true,
  },
  organ_damage: {
    animalView: 'a deep, nauseating wrongness inside',
    clinicalView: 'internal organ damage',
    discloseTermDuringPlay: false, // the animal wouldn't conceptualize "organ damage"
  },
  disembowelment: {
    animalView: 'large pink ropes hanging from your belly, heavy and warm',
    clinicalView: 'disembowelment (evisceration)',
    discloseTermDuringPlay: false, // classic example from the design doc
  },
  hemorrhage: {
    animalView: 'warmth leaving you, pooling beneath, the world dimming',
    clinicalView: 'severe hemorrhage',
    discloseTermDuringPlay: false, // animal doesn't understand blood loss abstractly
  },
  spinal_injury: {
    animalView: 'nothing below the impact — your legs have stopped listening',
    clinicalView: 'spinal cord injury',
    discloseTermDuringPlay: false, // terrifyingly non-understandable to the animal
  },
};

/**
 * Get the appropriate description for a body condition.
 * In gameplay: use animalView, with clinicalView appended if disclosable.
 * In debriefing: always use clinicalView.
 */
export function describeCondition(
  conditionType: string,
  mode: 'gameplay' | 'debriefing',
): string {
  const desc = CONDITION_DESCRIPTIONS[conditionType];
  if (!desc) return conditionType;

  if (mode === 'debriefing') {
    return desc.clinicalView;
  }

  // During gameplay: use animal view, optionally append medical term
  if (desc.discloseTermDuringPlay) {
    return desc.clinicalView; // terms like "fracture", "laceration" are fine
  }
  return desc.animalView; // terms like "disembowelment" are hidden
}

// ══════════════════════════════════════════════════
//  HARM RESULT → NARRATIVE BODY EFFECTS
// ══════════════════════════════════════════════════

/**
 * Convert a HarmResult into NarrativeBodyEffect[], which the renderer
 * uses to compose injury descriptions.
 */
export function harmResultToBodyEffects(
  result: HarmResult,
  anatomy: AnatomyIndex,
): NarrativeBodyEffect[] {
  const effects: NarrativeBodyEffect[] = [];

  for (const part of result.damagedParts) {
    const severity = partDamageSeverity(part);
    const condition = part.conditionProduced;

    const animalFeeling = condition
      ? `${describeCondition(condition.type, 'gameplay')} ${describeBodyPart(part.bodyPartId, anatomy)}`
      : `pain in your ${describeBodyPart(part.bodyPartId, anatomy)}`;

    const clinicalDescription = condition
      ? `${describeCondition(condition.type, 'debriefing')} of the ${describeBodyPart(part.bodyPartId, anatomy)}`
      : `tissue damage to the ${describeBodyPart(part.bodyPartId, anatomy)}`;

    effects.push({
      partId: part.bodyPartId,
      partLabel: part.bodyPartLabel,
      animalFeeling,
      clinicalDescription,
      severity,
      somaticallyAware: true, // all physical damage is felt
    });
  }

  return effects;
}

function partDamageSeverity(part: PartDamageResult): 'minor' | 'moderate' | 'severe' | 'critical' {
  if (part.conditionProduced) {
    const sev = part.conditionProduced.severity;
    if (sev >= 3) return 'critical';
    if (sev >= 2) return 'severe';
    if (sev >= 1) return 'moderate';
  }
  const maxDamage = Math.max(...part.tissueDamage.map((t) => t.damageInflicted));
  if (maxDamage > 60) return 'severe';
  if (maxDamage > 30) return 'moderate';
  return 'minor';
}

// ══════════════════════════════════════════════════
//  VISCERAL / LITERAL DESCRIPTION
// ══════════════════════════════════════════════════

/**
 * For severe injuries, generate the Lynchian literal description
 * that the animal would actually perceive, without the clinical framing.
 *
 * From simulation_refactor.md: "The player is told that large pink ropes
 * are attached to the place where a towering monster struck them"
 */
export function describeInjuryVisceral(
  conditionType: string,
  bodyPartLabel: string,
  severity: 'minor' | 'moderate' | 'severe' | 'critical',
): string {
  const desc = CONDITION_DESCRIPTIONS[conditionType];
  if (!desc) {
    return `something wrong with your ${bodyPartLabel}`;
  }

  // For non-disclosed conditions, use the full animal-view description
  if (!desc.discloseTermDuringPlay) {
    return desc.animalView;
  }

  // For disclosed conditions, combine with body part
  switch (severity) {
    case 'critical':
      return `Your ${bodyPartLabel} is ${desc.animalView}. The pain is blinding.`;
    case 'severe':
      return `Your ${bodyPartLabel} is ${desc.animalView}. Each movement sends fire through you.`;
    case 'moderate':
      return `Your ${bodyPartLabel} is ${desc.animalView}. It throbs with every heartbeat.`;
    default:
      return `Your ${bodyPartLabel} aches where it was struck.`;
  }
}
