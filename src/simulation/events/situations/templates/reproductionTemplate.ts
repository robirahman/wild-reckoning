import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import { REPRODUCTION_PROFILES } from '../profiles/reproductionProfiles';
import type { ReproductionProfile } from '../profiles/reproductionProfiles';
import { composeNarrative } from '../narrativeComposer';

// ══════════════════════════════════════════════════
//  REPRODUCTION TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 4 reproduction triggers:
// fawn-birth, fawn-defense, rut-display, rut-combat.
// Matches on seasonal-phase, conspecific-nearby, and
// activity-exposure situations, then selects matching profiles.
//

function checkProfilePlausibility(
  profile: ReproductionProfile,
  ctx: SimulationContext,
): boolean {
  if (ctx.animal.sex !== profile.sex) return false;
  if (profile.seasons && !profile.seasons.includes(ctx.time.season)) return false;
  if (profile.minAge !== undefined && ctx.animal.age < profile.minAge) return false;
  if (profile.requiredFlags) {
    for (const flag of profile.requiredFlags) {
      if (!ctx.animal.flags.has(flag)) return false;
    }
  }
  if (profile.blockingFlags) {
    for (const flag of profile.blockingFlags) {
      if (ctx.animal.flags.has(flag)) return false;
    }
  }
  if (profile.extraPlausibility && !profile.extraPlausibility(ctx)) return false;
  return true;
}

function findMatchingProfiles(
  ctx: SimulationContext,
  situations: Situation[],
): { profile: ReproductionProfile; weight: number }[] {
  const results: { profile: ReproductionProfile; weight: number }[] = [];

  for (const profile of Object.values(REPRODUCTION_PROFILES)) {
    if (!checkProfilePlausibility(profile, ctx)) continue;

    const weight = profile.computeWeight(ctx, situations, profile.baseWeight);
    if (weight > 0) {
      results.push({ profile, weight });
    }
  }

  return results;
}

export const reproductionTemplate: InteractionTemplate = {
  id: 'reproduction',
  category: 'reproduction',
  tags: ['mating'],

  requiredSituations: [],
  optionalSituations: [
    'seasonal-phase',
    'conspecific-nearby',
    'activity-exposure',
    'terrain-feature',
    'body-impairment',
    'physiological-state',
  ],

  extraPlausibility(ctx, situations) {
    return findMatchingProfiles(ctx, situations).length > 0;
  },

  computeWeight(ctx, situations) {
    const matches = findMatchingProfiles(ctx, situations);
    if (matches.length === 0) return 0;

    // Mating activity boosts
    const matingActivity = situations.find(s => s.type === 'activity-exposure' && s.source === 'mating');
    const activityBonus = matingActivity ? 1.3 : 1.0;

    // Seasonal phase (rut/fawning) boosts
    const seasonalRut = situations.some(s => s.type === 'seasonal-phase' && s.source === 'rut');
    const seasonalFawning = situations.some(s => s.type === 'seasonal-phase' && s.source === 'fawning');
    const seasonalBonus = (seasonalRut || seasonalFawning) ? 1.2 : 1.0;

    return matches.reduce((sum, m) => sum + m.weight, 0) * activityBonus * seasonalBonus;
  },

  resolve(ctx, situations) {
    const matches = findMatchingProfiles(ctx, situations);
    if (matches.length === 0) {
      return { harmEvents: [], statEffects: [], consequences: [], narrativeText: '' };
    }

    const weights = matches.map(m => m.weight);
    const idx = ctx.rng.weightedSelect(weights);
    const { profile } = matches[idx];

    // Delegate to profile's resolve (reproduction events have highly varied logic)
    const outcome = profile.resolve(ctx, situations);

    // Compose narrative with situation hooks if the profile returned plain text
    if (outcome.narrativeText && !outcome.narrativeContext) {
      outcome.narrativeText = composeNarrative(ctx, situations, outcome.narrativeText);
    }

    return outcome;
  },

  getChoices(ctx, situations) {
    const matches = findMatchingProfiles(ctx, situations);
    if (matches.length === 0) return [];

    matches.sort((a, b) => b.weight - a.weight);
    const { profile } = matches[0];

    return profile.choices(ctx, situations);
  },
};
