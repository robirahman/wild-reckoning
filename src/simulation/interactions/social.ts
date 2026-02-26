import type { SimulationContext } from '../events/types';
import type { HarmEvent } from '../harm/types';
import type { SocialParams, SocialResult } from './types';
import type { StatEffect } from '../../types/events';
import type { GameFlag } from '../../types/flags';
import { StatId, computeEffectiveValue } from '../../types/stats';

/**
 * Resolve a social interaction.
 *
 * The social resolver encapsulates hierarchy, alarm, group, and dispersal
 * dynamics. Instead of each social trigger computing its own rank changes
 * and outcomes, all social interactions flow through this function.
 *
 * Considers:
 * - animal weight, age, and sex (dominance factors)
 * - existing injuries and body condition (weakened animals lose rank)
 * - opponent rank (dominant vs peer vs subordinate)
 * - group size (larger groups = stronger alarm effect)
 * - interaction type (dominance-display, alarm-response, group-foraging, dispersal)
 */
export function resolveSocial(ctx: SimulationContext, params: SocialParams): SocialResult {
  const rng = ctx.rng;

  switch (params.interactionType) {
    case 'dominance-display':
      return resolveDominanceDisplay(ctx, params);
    case 'alarm-response':
      return resolveAlarmResponse(ctx, params);
    case 'group-foraging':
      return resolveGroupForaging(ctx, params);
    case 'dispersal':
      return resolveDispersal(ctx, params);
    default:
      return { rankChange: 0, harmEvents: [], statEffects: [], flagsToSet: [], flagsToRemove: [] };
  }
}

function resolveDominanceDisplay(ctx: SimulationContext, params: SocialParams): SocialResult {
  const rng = ctx.rng;
  const weight = ctx.animal.weight;
  const age = ctx.animal.age;
  const bodyCondition = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
  const injuryCount = ctx.animal.injuries.length;

  // Dominance power: weight, age, condition, minus injuries
  let power = 0;
  power += weight * 0.1; // heavier = more dominant
  power += Math.min(age, 60) * 0.2; // age up to 5 years adds dominance
  power += (bodyCondition - 3) * 5; // condition matters
  power -= injuryCount * 3;
  power += (locomotion - 70) * 0.1; // mobility signals fitness

  // Opponent difficulty based on rank
  let opponentPower: number;
  switch (params.opponentRank) {
    case 'dominant':
      opponentPower = power * 1.3 + rng.int(-5, 10);
      break;
    case 'subordinate':
      opponentPower = power * 0.6 + rng.int(-5, 5);
      break;
    case 'peer':
    default:
      opponentPower = power * 0.9 + rng.int(-8, 8);
      break;
  }

  const won = power > opponentPower;
  const harmEvents: HarmEvent[] = [];
  const statEffects: StatEffect[] = [];
  const flagsToSet: GameFlag[] = [];

  if (won) {
    statEffects.push({ stat: StatId.ADV, amount: -3, label: '-ADV' });
    statEffects.push({ stat: StatId.WIS, amount: 2, label: '+WIS' });
  } else {
    statEffects.push({ stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' });
    // Escalation chance: 15% of dominance displays turn physical
    if (rng.chance(0.15)) {
      const magnitude = rng.int(15, 35);
      harmEvents.push({
        id: `social-escalation-${ctx.time.turn}`,
        sourceLabel: 'dominance contest escalation',
        magnitude,
        targetZone: rng.pick(['head', 'neck', 'front-legs']),
        spread: 0.2,
        harmType: 'blunt',
      });
    }
  }

  return {
    rankChange: won ? 0.3 : -0.3,
    harmEvents,
    statEffects,
    flagsToSet,
    flagsToRemove: [],
  };
}

function resolveAlarmResponse(ctx: SimulationContext, params: SocialParams): SocialResult {
  const rng = ctx.rng;
  const vision = ctx.animal.bodyState?.capabilities['vision'] ?? 100;

  // Alarm effectiveness scales with group size
  // Larger groups detect threats faster and more reliably
  const groupEffectiveness = Math.min(1.0, 0.4 + params.groupSize * 0.15);

  // Player's own detection ability modifies the benefit
  const visionBonus = (vision - 50) * 0.005;
  const warningQuality = Math.min(1.0, groupEffectiveness + visionBonus);

  const statEffects: StatEffect[] = [];

  if (warningQuality > 0.6) {
    // Good warning: reduced trauma, gained wisdom
    statEffects.push({ stat: StatId.TRA, amount: -2, label: '-TRA' });
    statEffects.push({ stat: StatId.WIS, amount: 3, label: '+WIS' });
  } else {
    // Poor warning: startled but survived
    statEffects.push({ stat: StatId.TRA, amount: 3, duration: 1, label: '+TRA' });
    statEffects.push({ stat: StatId.HOM, amount: 3, duration: 1, label: '+HOM' });
  }

  return {
    rankChange: 0,
    harmEvents: [],
    statEffects,
    flagsToSet: [],
    flagsToRemove: [],
  };
}

function resolveGroupForaging(ctx: SimulationContext, params: SocialParams): SocialResult {
  // Group foraging: safety in numbers, slight competition for food
  const groupBonus = Math.min(0.3, params.groupSize * 0.06);

  const statEffects: StatEffect[] = [
    { stat: StatId.ADV, amount: -2, label: '-ADV' },
    { stat: StatId.HOM, amount: -2, label: '-HOM' },
  ];

  return {
    rankChange: 0,
    harmEvents: [],
    statEffects,
    flagsToSet: [],
    flagsToRemove: [],
  };
}

function resolveDispersal(ctx: SimulationContext, params: SocialParams): SocialResult {
  const rng = ctx.rng;
  const age = ctx.animal.age;
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

  // Dispersal risk: road crossings, unfamiliar territory, no social support
  const harmEvents: HarmEvent[] = [];
  const statEffects: StatEffect[] = [
    { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' },
    { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
    { stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' },
  ];

  // Road crossing hazard during dispersal
  if (rng.chance(0.12)) {
    harmEvents.push({
      id: `dispersal-road-${ctx.time.turn}`,
      sourceLabel: 'road crossing during dispersal',
      magnitude: rng.int(20, 50),
      targetZone: rng.pick(['front-legs', 'hind-legs', 'torso']),
      spread: 0.4,
      harmType: 'blunt',
    });
  }

  const flagsToSet: GameFlag[] = ['dispersal-begun'];
  const flagsToRemove: GameFlag[] = ['dispersal-pressure'];

  return {
    rankChange: -0.5, // leaving home range costs social standing
    harmEvents,
    statEffects,
    flagsToSet,
    flagsToRemove,
  };
}
