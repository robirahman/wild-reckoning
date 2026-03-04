import type { InteractionTemplate, Situation } from '../types';
import type { SimulationContext } from '../../types';
import { SOCIAL_PROFILES } from '../profiles/socialProfiles';
import type { SocialProfile } from '../profiles/socialProfiles';
import { buildEnvironment, action, buildNarrativeContext } from '../../../narrative/contextBuilder';
import { pickContextualText, toFragmentContext } from '../../../narrative/templates/shared';
import { composeNarrative } from '../narrativeComposer';

// ══════════════════════════════════════════════════
//  SOCIAL INTERACTION TEMPLATE
// ══════════════════════════════════════════════════
//
// One template replaces 8 social triggers.
// Matches on conspecific-nearby, seasonal-phase, or activity-exposure
// situations, then selects matching social profiles.
//

function checkProfilePlausibility(
  profile: SocialProfile,
  ctx: SimulationContext,
): boolean {
  if (profile.sex && ctx.animal.sex !== profile.sex) return false;
  if (profile.seasons && !profile.seasons.includes(ctx.time.season)) return false;
  if (profile.minAge !== undefined && ctx.animal.age < profile.minAge) return false;
  if (profile.maxAge !== undefined && ctx.animal.age > profile.maxAge) return false;
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
  if (profile.requiresConspecific) {
    if (!ctx.npcs?.some(n => n.alive && n.currentNodeId === ctx.currentNodeId && n.type !== 'predator')) return false;
  }
  if (profile.extraPlausibility && !profile.extraPlausibility(ctx)) return false;
  return true;
}

function findMatchingSocials(
  ctx: SimulationContext,
  situations: Situation[],
): { profile: SocialProfile; weight: number }[] {
  const results: { profile: SocialProfile; weight: number }[] = [];

  for (const profile of Object.values(SOCIAL_PROFILES)) {
    if (!checkProfilePlausibility(profile, ctx)) continue;

    let weight = profile.baseWeight;
    if (profile.situationWeightModifiers) {
      weight *= profile.situationWeightModifiers(ctx, situations);
    }
    if (weight > 0) {
      results.push({ profile, weight });
    }
  }

  return results;
}

export const socialInteractionTemplate: InteractionTemplate = {
  id: 'social-interaction',
  category: 'social',
  tags: ['social'],

  requiredSituations: [],
  optionalSituations: [
    'conspecific-nearby',
    'seasonal-phase',
    'activity-exposure',
    'body-impairment',
    'physiological-state',
    'memory-trigger',
  ],

  extraPlausibility(ctx, situations) {
    return findMatchingSocials(ctx, situations).length > 0;
  },

  computeWeight(ctx, situations) {
    const socials = findMatchingSocials(ctx, situations);
    if (socials.length === 0) return 0;

    // Conspecific nearby boosts all social events
    const hasConspecific = situations.some(s => s.type === 'conspecific-nearby');
    const conspecificBonus = hasConspecific ? 1.3 : 1.0;

    // Socializing activity boosts
    const socActivity = situations.find(s => s.type === 'activity-exposure' && s.source === 'socializing');
    const activityBonus = socActivity ? 1.2 : 1.0;

    return socials.reduce((sum, s) => sum + s.weight, 0) * conspecificBonus * activityBonus;
  },

  resolve(ctx, situations) {
    const socials = findMatchingSocials(ctx, situations);
    if (socials.length === 0) {
      return { harmEvents: [], statEffects: [], consequences: [], narrativeText: '' };
    }

    const weights = socials.map(s => s.weight);
    const idx = ctx.rng.weightedSelect(weights);
    const { profile } = socials[idx];

    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const baseNarrative = pickContextualText(profile.narratives, fragmentCtx, ctx.rng);
    const composedNarrative = composeNarrative(ctx, situations, baseNarrative);

    return {
      harmEvents: [],
      statEffects: [...profile.statEffects],
      consequences: [],
      narrativeText: composedNarrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: profile.id,
        actions: [action(composedNarrative, profile.clinicalDetail, 'medium')],
        environment: env,
        emotionalTone: profile.emotionalTone,
      }),
    };
  },

  getChoices(ctx, situations) {
    const socials = findMatchingSocials(ctx, situations);
    if (socials.length === 0) return [];

    socials.sort((a, b) => b.weight - a.weight);
    const { profile } = socials[0];

    if (!profile.choices) return [];
    return profile.choices(ctx, situations);
  },
};
