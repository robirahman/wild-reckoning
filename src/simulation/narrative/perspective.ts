import type { NarrativeEntity, NarrativeBodyEffect } from './types';
import type { PartDamageResult, HarmResult } from '../harm/types';
import type { AnatomyIndex } from '../anatomy/types';

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
  contusion: {
    animalView: 'deeply bruised',
    clinicalView: 'contusion',
    discloseTermDuringPlay: true,
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
  sprain: {
    animalView: 'swollen and tender, refusing to bear full weight',
    clinicalView: 'ligament sprain',
    discloseTermDuringPlay: true, // felt directly
  },
  dislocation: {
    animalView: 'wrong — the joint sits at an angle that makes your body recoil',
    clinicalView: 'joint dislocation',
    discloseTermDuringPlay: true, // felt directly
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
  // ── Additional conditions for expanded simulation ──
  hypothermia_mild: {
    animalView: 'sluggish, as though moving through cold water from the inside',
    clinicalView: 'mild hypothermia',
    discloseTermDuringPlay: true, // non-actionable
  },
  hypothermia_severe: {
    animalView: 'the shivering has stopped — a strange warmth spreads through you, and you feel almost peaceful',
    clinicalView: 'severe hypothermia (paradoxical undressing phase)',
    discloseTermDuringPlay: false, // the "warmth" is itself the danger — disclosing would break immersion
  },
  malnutrition: {
    animalView: 'your ribs press against your hide — food fills your stomach but leaves you hollow',
    clinicalView: 'chronic malnutrition (BCS 1-2)',
    discloseTermDuringPlay: true, // non-actionable
  },
  abscess: {
    animalView: 'a hard, hot lump beneath the skin, pulsing with your heartbeat',
    clinicalView: 'subcutaneous abscess',
    discloseTermDuringPlay: true, // non-actionable
  },
  parasitic_neuro: {
    animalView: 'something behind your eyes that shouldn\'t be there — the world tilts when you turn your head',
    clinicalView: 'meningeal worm (P. tenuis) neurological damage',
    discloseTermDuringPlay: true, // knowing it's a "brainworm" doesn't help you fix it
  },
  parasitic_liver: {
    animalView: 'a deep ache in your side that worsens after eating, and nothing you do eases it',
    clinicalView: 'liver fluke (F. magna) hepatic damage',
    discloseTermDuringPlay: true, // non-actionable
  },
  tick_infestation: {
    animalView: 'hundreds of pinpoint irritations across your neck and shoulders, each one a tiny mouth burrowing deeper',
    clinicalView: 'winter tick infestation (D. albipictus)',
    discloseTermDuringPlay: true, // non-actionable
  },
  antler_damage: {
    animalView: 'a piece of your crown is gone — splintered where it struck, leaving a jagged edge',
    clinicalView: 'antler tine fracture',
    discloseTermDuringPlay: true, // felt directly
  },
  pneumonia: {
    animalView: 'a wet, rattling sound in your chest with every breath, and a feeling of drowning on dry land',
    clinicalView: 'pneumonia',
    discloseTermDuringPlay: true, // non-actionable
  },
  sepsis: {
    animalView: 'everything is wrong — trembling, burning, the world tilting and spinning',
    clinicalView: 'sepsis (systemic inflammatory response)',
    discloseTermDuringPlay: true, // non-actionable
  },
};

// ══════════════════════════════════════════════════
//  CAPABILITY IMPAIRMENT DESCRIPTIONS
// ══════════════════════════════════════════════════

interface CapabilityDescription {
  /** Threshold ranges and their animal-perspective descriptions */
  ranges: Array<{
    max: number; // capability value must be < this
    min: number; // capability value must be >= this
    animalView: string;
    clinicalView: string;
  }>;
}

const CAPABILITY_DESCRIPTIONS: Record<string, CapabilityDescription> = {
  locomotion: {
    ranges: [
      { max: 100, min: 80, animalView: 'Your gait hitches slightly with each stride — a small hesitation where the body negotiates with damage before committing.', clinicalView: 'Mild locomotor impairment — gait asymmetry detectable.' },
      { max: 80, min: 60, animalView: 'Every step is a conscious act. You favor the damaged side, listing slightly, and your pace has slowed to something that would shame a fawn.', clinicalView: 'Moderate locomotor impairment — compensatory gait pattern, reduced speed.' },
      { max: 60, min: 40, animalView: 'Walking is a deliberate, calculated act. Each step must be planned, tested, committed to. Your gait draws attention from everything with eyes.', clinicalView: 'Significant locomotor impairment — sustained flight impossible.' },
      { max: 40, min: 20, animalView: 'You drag yourself forward on trembling legs. The world has shrunk to the next few steps and the desperate hope that you can make them.', clinicalView: 'Severe locomotor impairment — animal effectively hobbled.' },
      { max: 20, min: 0, animalView: 'Movement is agony. The world has shrunk to the patch of ground beneath you. Your muscles tremble from the effort of simply remaining upright.', clinicalView: 'Near-total locomotor failure — animal immobile.' },
    ],
  },
  vision: {
    ranges: [
      { max: 100, min: 70, animalView: 'Distant details are slightly blurred, as though seen through heat shimmer.', clinicalView: 'Mild visual impairment.' },
      { max: 70, min: 50, animalView: 'The world is dimming — not the way twilight dims it, but from within. You rely more on your ears, turning your head to track sounds your eyes can no longer resolve.', clinicalView: 'Moderate visual impairment — increasingly dependent on auditory detection.' },
      { max: 50, min: 20, animalView: 'Shadows take threatening shapes. The edges of everything blur and merge. You flinch at phantoms.', clinicalView: 'Significant visual impairment — spatial awareness severely degraded.' },
      { max: 20, min: 0, animalView: 'The world is dissolving into a gray wash where nothing has edges. You navigate by smell and memory alone.', clinicalView: 'Near-total vision loss.' },
    ],
  },
  breathing: {
    ranges: [
      { max: 100, min: 70, animalView: 'Your breath catches slightly after exertion, a tightness that takes a moment longer than it should to clear.', clinicalView: 'Mild respiratory compromise.' },
      { max: 70, min: 50, animalView: 'Your chest is tight. You breathe in and the air stops short, filling only part of your lungs before something refuses it further entry.', clinicalView: 'Moderate respiratory impairment — exercise intolerance.' },
      { max: 50, min: 25, animalView: 'The smallest exertion leaves you gasping, sides heaving, heart racing to compensate for what your lungs cannot provide.', clinicalView: 'Significant respiratory impairment — dyspnea on minimal exertion.' },
      { max: 25, min: 0, animalView: 'Each breath is a shallow, wheezing negotiation between your lungs and the air, and the air is winning. The world narrows to the next breath.', clinicalView: 'Severe respiratory failure — dyspnea at rest.' },
    ],
  },
  digestion: {
    ranges: [
      { max: 100, min: 60, animalView: 'Your stomach feels unsettled — food sits heavy and seems to pass through without nourishing.', clinicalView: 'Mild digestive impairment — reduced caloric extraction.' },
      { max: 60, min: 30, animalView: 'Eating is followed by cramping and nausea. Your body rejects what it desperately needs.', clinicalView: 'Moderate digestive impairment — malabsorption.' },
      { max: 30, min: 0, animalView: 'Food passes through you like water through sand. Your body is starving no matter how much you eat.', clinicalView: 'Severe digestive failure — critical malabsorption.' },
    ],
  },
};

/**
 * Get an animal-perspective description of the current capability level.
 * Returns undefined if the capability is not impaired enough to describe.
 */
export function describeCapabilityImpairment(
  capability: string,
  value: number,
  mode: 'gameplay' | 'debriefing',
): string | undefined {
  const desc = CAPABILITY_DESCRIPTIONS[capability];
  if (!desc) return undefined;

  for (const range of desc.ranges) {
    if (value < range.max && value >= range.min) {
      return mode === 'debriefing' ? range.clinicalView : range.animalView;
    }
  }
  return undefined;
}

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
