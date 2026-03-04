import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import { hasSituation } from '../types';
import { HAZARD_PROFILES, resolveHarmFromProfile } from '../profiles/hazardProfiles';
import type { HazardProfile } from '../profiles/hazardProfiles';
import { getEncounterRate } from '../../../calibration/calibrator';
import { buildEnvironment, action, buildNarrativeContext } from '../../../narrative/contextBuilder';
import { pickContextualText, toFragmentContext } from '../../../narrative/templates/shared';
import { composeNarrative } from '../narrativeComposer';

// ══════════════════════════════════════════════════
//  ENVIRONMENTAL HAZARD TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 9 environmental hazard triggers.
// Matches on terrain-feature OR weather-condition situations,
// then selects the best-matching hazard profile from the registry.
//

/**
 * Find all hazard profiles plausible given the current situations + context.
 */
function findMatchingHazards(
  ctx: SimulationContext,
  situations: Situation[],
): { profile: HazardProfile; weight: number }[] {
  const results: { profile: HazardProfile; weight: number }[] = [];

  for (const profile of Object.values(HAZARD_PROFILES)) {
    // Check required sources
    if (profile.requiredSources.length > 0) {
      const allPresent = profile.requiredSources.every(src =>
        situations.some(s =>
          (s.type === 'terrain-feature' || s.type === 'weather-condition') && s.source === src
        )
      );
      if (!allPresent) continue;
    }

    // Extra plausibility
    if (profile.extraPlausibility && !profile.extraPlausibility(ctx)) continue;

    // Compute weight
    let weight = profile.baseWeight;

    // Calibrated rate
    if (profile.calibrationCauseId && ctx.calibratedRates) {
      const calibrated = getEncounterRate(ctx.calibratedRates, profile.calibrationCauseId, ctx.time.season);
      weight = calibrated * (profile.rateFraction ?? 1.0);
    }

    // Situation modifiers
    if (profile.situationWeightModifiers) {
      weight *= profile.situationWeightModifiers(ctx, situations);
    }

    if (weight > 0) {
      results.push({ profile, weight });
    }
  }

  return results;
}

export const environmentalHazardTemplate: InteractionTemplate = {
  id: 'environmental-hazard',
  category: 'environmental',
  tags: ['danger', 'environmental'],

  // Match when terrain or weather is notable (at least one situation present)
  requiredSituations: [],
  optionalSituations: [
    'terrain-feature',
    'weather-condition',
    'body-impairment',
    'physiological-state',
    'seasonal-phase',
    'memory-trigger',
  ],

  extraPlausibility(ctx, situations) {
    // Must have at least a terrain or weather situation
    const hasTerrainOrWeather =
      situations.some(s => s.type === 'terrain-feature' || s.type === 'weather-condition');
    if (!hasTerrainOrWeather) return false;

    // Must have at least one matching hazard
    return findMatchingHazards(ctx, situations).length > 0;
  },

  computeWeight(ctx, situations) {
    const hazards = findMatchingHazards(ctx, situations);
    if (hazards.length === 0) return 0;
    // Sum all hazard weights (multiple hazards can be relevant)
    return hazards.reduce((sum, h) => sum + h.weight, 0);
  },

  resolve(ctx, situations) {
    const hazards = findMatchingHazards(ctx, situations);
    if (hazards.length === 0) {
      return { harmEvents: [], statEffects: [], consequences: [], narrativeText: '' };
    }

    // Weighted random selection of which hazard fires
    const weights = hazards.map(h => h.weight);
    const idx = ctx.rng.weightedSelect(weights);
    const { profile } = hazards[idx];

    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);

    // Select narrative
    const baseNarrative = pickContextualText(profile.narratives, fragmentCtx, ctx.rng);
    const composedNarrative = composeNarrative(ctx, situations, baseNarrative);

    // Resolve harm
    const harmEvent = resolveHarmFromProfile(profile, ctx);
    const harmEvents = harmEvent ? [harmEvent] : [];

    // Resolve stat effects
    const statEffects = typeof profile.statEffects === 'function'
      ? profile.statEffects(ctx)
      : [...profile.statEffects];

    // Consequences
    const consequences = profile.consequences ? [...profile.consequences] : [];

    return {
      harmEvents,
      statEffects,
      consequences,
      narrativeText: composedNarrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: profile.id,
        actions: [action(composedNarrative, profile.clinicalDetail, 'high')],
        environment: env,
        emotionalTone: profile.emotionalTone,
      }),
    };
  },

  getChoices(ctx, situations) {
    const hazards = findMatchingHazards(ctx, situations);
    if (hazards.length === 0) return [];

    // Use the highest-weight hazard for choices
    hazards.sort((a, b) => b.weight - a.weight);
    const { profile } = hazards[0];

    if (!profile.choices) return [];
    return profile.choices(ctx, situations);
  },
};
