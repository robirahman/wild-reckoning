import type { Rng } from '../../engine/RandomUtils';
import type {
  NarrativeContext,
  NarrativeBodyEffect,
  DebriefingEntry,
} from './types';
import { describeEntity, describeEntityClinical } from './perspective';

// ── Template imports ──
import { pickZonePain, describeCapabilityImpairment } from './templates/injury';
import { pickDetection, CANID_DETECTIONS, FELID_DETECTIONS, HUMAN_DETECTIONS } from './templates/predator';

// ══════════════════════════════════════════════════
//  ANIMAL-PERSPECTIVE RENDERER
// ══════════════════════════════════════════════════

/**
 * Render a NarrativeContext into animal-perspective text for gameplay.
 * This is the Lynchian literal view — things described as the animal perceives them,
 * with body parts and non-actionable medical terms disclosed.
 */
export function renderAnimalPerspective(
  ctx: NarrativeContext,
  wisdomLevel: number,
  rng: Rng,
): string {
  const parts: string[] = [];

  // 1. Opening: entity detection or atmospheric setup
  const opening = composeOpening(ctx, wisdomLevel, rng);
  if (opening) parts.push(opening);

  // 2. Action sequence: chronological actions from the event
  for (const action of ctx.actions) {
    parts.push(action.animalPerspective);
  }

  // 3. Body effects: injury descriptions in animal-perspective
  const injuryText = composeInjuryNarrative(ctx.bodyEffects, rng);
  if (injuryText) parts.push(injuryText);

  // 4. Capability impairment: what the animal feels functionally
  const impairmentText = composeImpairmentNarrative(ctx);
  if (impairmentText) parts.push(impairmentText);

  return parts.join(' ');
}

// ══════════════════════════════════════════════════
//  DEBRIEFING RENDERER
// ══════════════════════════════════════════════════

/**
 * Render a NarrativeContext into clinical text for the game-over debriefing.
 * From simulation_refactor.md: "a 'debriefing' at the end that re-runs through
 * the events of the animal's life in the way we would conceptualize them"
 */
export function renderDebriefing(ctx: NarrativeContext): string {
  const parts: string[] = [];

  // 1. Entity identification (always clinical)
  for (const entity of ctx.entities) {
    parts.push(`Encountered ${describeEntityClinical(entity)}.`);
  }

  // 2. Clinical action sequence
  for (const action of ctx.actions) {
    parts.push(action.clinicalDescription);
  }

  // 3. Medical injury descriptions
  for (const effect of ctx.bodyEffects) {
    parts.push(`Sustained ${effect.clinicalDescription} (${effect.severity}).`);
  }

  // 4. Fatal outcome
  if (ctx.fatal && ctx.deathCause) {
    parts.push(`Cause of death: ${ctx.deathCause}.`);
  }

  return parts.join(' ');
}

/**
 * Convert a NarrativeContext into a DebriefingEntry for storage and later review.
 */
export function toDebriefingEntry(
  ctx: NarrativeContext,
  turn: number,
  animalNarrative: string,
  _wisdomLevel: number,
): DebriefingEntry {
  const clinicalNarrative = renderDebriefing(ctx);

  // Build a concise summary line for the timeline
  const entityNames = ctx.entities.map((e) => describeEntityClinical(e));
  const effectSummaries = ctx.bodyEffects
    .filter((e) => e.severity !== 'minor')
    .map((e) => e.clinicalDescription);

  let summaryLine: string;
  if (ctx.fatal) {
    summaryLine = `FATAL: ${ctx.deathCause ?? 'Unknown cause of death'}`;
  } else if (entityNames.length > 0) {
    summaryLine = entityNames.join(', ');
    if (effectSummaries.length > 0) {
      summaryLine += ` — ${effectSummaries.join('; ')}`;
    }
  } else if (effectSummaries.length > 0) {
    summaryLine = effectSummaries.join('; ');
  } else {
    summaryLine = ctx.eventType;
  }

  return {
    turn,
    animalNarrative,
    clinicalNarrative,
    choiceLabel: ctx.choiceMade,
    fatal: ctx.fatal ?? false,
    summaryLine,
  };
}

// ══════════════════════════════════════════════════
//  COMPOSITION HELPERS
// ══════════════════════════════════════════════════

function composeOpening(
  ctx: NarrativeContext,
  wisdomLevel: number,
  rng: Rng,
): string | undefined {
  // If there are entities, describe the primary one
  if (ctx.entities.length > 0) {
    const primary = ctx.entities[0];
    const name = describeEntity(primary, wisdomLevel);

    // For predators, use detection pools if available
    if (primary.archetype === 'predator-canid') {
      const detection = pickDetection(
        CANID_DETECTIONS, rng, primary.primarySense, ctx.environment.timeOfDay,
      );
      return detection.text;
    }
    if (primary.archetype === 'predator-felid') {
      const detection = pickDetection(
        FELID_DETECTIONS, rng, primary.primarySense, ctx.environment.timeOfDay,
      );
      return detection.text;
    }
    if (primary.archetype === 'predator-human') {
      const detection = pickDetection(
        HUMAN_DETECTIONS, rng, primary.primarySense, ctx.environment.timeOfDay,
      );
      return detection.text;
    }

    // Default: describe the entity directly
    return `You become aware of ${name}.`;
  }

  // No entities: use atmospheric detail
  if (ctx.environment.atmosphericDetail) {
    return ctx.environment.atmosphericDetail;
  }

  return undefined;
}

function composeInjuryNarrative(
  effects: NarrativeBodyEffect[],
  rng: Rng,
): string | undefined {
  if (effects.length === 0) return undefined;

  // Group by severity, describe the worst first
  const sorted = [...effects].sort((a, b) => {
    const order = { critical: 0, severe: 1, moderate: 2, minor: 3 };
    return order[a.severity] - order[b.severity];
  });

  const descriptions: string[] = [];

  for (const effect of sorted) {
    if (!effect.somaticallyAware) continue;

    // Use the animal-feeling description
    descriptions.push(effect.animalFeeling);

    // Add zone-specific pain for moderate+ injuries
    if (effect.severity !== 'minor') {
      const zonePain = pickZonePain(
        // Derive zone from part label heuristics
        guessZoneFromPart(effect.partId),
        rng,
      );
      descriptions.push(zonePain);
    }
  }

  if (descriptions.length === 0) return undefined;

  // Limit to 2-3 injury descriptions to avoid wall of text
  return descriptions.slice(0, 3).join(' ');
}

function composeImpairmentNarrative(ctx: NarrativeContext): string | undefined {
  if (!ctx.harmResults || ctx.harmResults.length === 0) return undefined;

  const impairments: string[] = [];

  for (const result of ctx.harmResults) {
    for (const cap of result.capabilityImpairment) {
      const desc = describeCapabilityImpairment(cap.capabilityId, cap.newEffectiveness);
      if (desc) impairments.push(desc);
    }
  }

  if (impairments.length === 0) return undefined;
  return impairments.slice(0, 2).join(' ');
}

function guessZoneFromPart(partId: string): string {
  if (partId.includes('head') || partId.includes('skull') || partId.includes('eye') || partId.includes('jaw') || partId.includes('antler') || partId.includes('brain')) return 'head';
  if (partId.includes('neck')) return 'neck';
  if (partId.includes('front')) return 'front-legs';
  if (partId.includes('hind') || partId.includes('rear')) return 'hind-legs';
  if (partId.includes('torso') || partId.includes('rib') || partId.includes('spine')) return 'torso';
  if (partId.includes('lung') || partId.includes('heart') || partId.includes('liver') || partId.includes('stomach') || partId.includes('intestine')) return 'internal';
  if (partId.includes('skin') || partId.includes('hide')) return 'skin';
  if (partId.includes('tail')) return 'tail';
  return 'torso';
}
