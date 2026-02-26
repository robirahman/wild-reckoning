import type { SimulationTrigger, SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';

function getLocomotion(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
}

// ══════════════════════════════════════════════════
//  FALL / TERRAIN HAZARD
// ══════════════════════════════════════════════════

export const fallHazardTrigger: SimulationTrigger = {
  id: 'sim-fall-hazard',
  category: 'environmental',
  tags: ['danger', 'exploration'],

  isPlausible(ctx) {
    // Falls happen in mountainous/rocky terrain, or on ice
    const isRisky = ctx.currentNodeType === 'mountain' ||
      (ctx.time.season === 'winter' && (ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow'));
    return isRisky;
  },

  computeWeight(ctx) {
    let base = 0.015;

    // Mountain terrain doubles fall risk
    if (ctx.currentNodeType === 'mountain') base *= 2;

    // Ice/frost increases risk
    if (ctx.currentWeather?.type === 'frost') base *= 1.5;

    // Impaired locomotion means more stumbles
    const locoImpairment = (100 - getLocomotion(ctx)) / 100;
    base *= 1 + locoImpairment * 2;

    // Exploration behavior increases exposure
    base *= 0.5 + ctx.behavior.exploration * 0.2;

    return base;
  },

  resolve(ctx) {
    const isIcy = ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow';
    const isMountain = ctx.currentNodeType === 'mountain';

    let narrative: string;
    if (isIcy) {
      narrative = 'The ground betrays you without warning. What looked like firm earth is a sheet of black ice beneath a dusting of snow, and your hooves lose purchase mid-stride. For one sickening moment you are weightless, legs splaying, and then the impact — hard, jarring, the world tilting sideways as you slam into the frozen ground.';
    } else if (isMountain) {
      narrative = 'The trail narrows along a rocky ledge, loose shale sliding beneath your hooves. You step carefully, but the rock face crumbles — a section of trail simply vanishes, and you are scrabbling at empty air, hind legs kicking at nothing, before the slope catches you and you tumble.';
    } else {
      narrative = 'A root hidden beneath the leaf litter catches your hoof at full stride. The world spins as your front legs buckle and momentum carries you forward into a rolling, crashing fall through the undergrowth.';
    }

    // Fall force depends on terrain
    const fallMagnitude = isMountain ? ctx.rng.int(40, 75) : ctx.rng.int(20, 45);

    const fallHarm: HarmEvent = {
      id: `fall-impact-${ctx.time.turn}`,
      sourceLabel: isMountain ? 'fall from rocky ledge' : isIcy ? 'fall on ice' : 'stumble and fall',
      magnitude: fallMagnitude,
      targetZone: ctx.rng.pick(['front-legs', 'hind-legs', 'torso']),
      spread: 0.4,
      harmType: 'blunt',
    };

    return {
      harmEvents: [fallHarm],
      statEffects: [
        { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
        { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: narrative,
    };
  },

  getChoices() {
    // Falls are not choice events -- they just happen
    return [];
  },
};

// ══════════════════════════════════════════════════
//  BLIZZARD EXPOSURE
// ══════════════════════════════════════════════════

export const blizzardExposureTrigger: SimulationTrigger = {
  id: 'sim-blizzard-exposure',
  category: 'environmental',
  tags: ['danger', 'seasonal'],
  calibrationCauseId: 'starvation-exposure',

  isPlausible(ctx) {
    return ctx.currentWeather?.type === 'blizzard' || ctx.currentWeather?.type === 'frost';
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.01;
    let base = getEncounterRate(ctx.calibratedRates, 'starvation-exposure', ctx.time.season);

    // Blizzard much worse than frost
    if (ctx.currentWeather?.type === 'blizzard') base *= 3;

    // Underweight deer are more vulnerable
    const weightThreshold = ctx.config.weight.vulnerabilityThreshold;
    if (ctx.animal.weight < weightThreshold) {
      base *= 1 + (weightThreshold - ctx.animal.weight) / weightThreshold;
    }

    // Being in open terrain is worse
    if (ctx.currentNodeType === 'plain') base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';

    const coldHarm: HarmEvent = {
      id: `cold-exposure-${ctx.time.turn}`,
      sourceLabel: isBlizzard ? 'blizzard exposure' : 'frost exposure',
      magnitude: isBlizzard ? ctx.rng.int(15, 35) : ctx.rng.int(5, 15),
      targetZone: ctx.rng.pick(['front-legs', 'hind-legs', 'head']),
      spread: 0.8, // cold affects broadly
      harmType: 'thermal-cold',
    };

    const narrative = isBlizzard
      ? 'The wind hits like a wall of frozen knives. Snow drives horizontally, stinging your eyes shut, packing into your nostrils. You cannot see. You cannot hear anything over the roar. The temperature is dropping by the minute and the wind strips the heat from your body faster than your metabolism can replace it. You need shelter. Now.'
      : 'The cold deepens overnight into something that feels personal — malicious, searching, finding every thin patch of fur and pressing in. Frost crystallizes on your muzzle and around your eyes. Your legs feel leaden and stiff. Even the act of shivering is becoming exhausting.';

    return {
      harmEvents: [coldHarm],
      statEffects: [
        { stat: StatId.CLI, amount: isBlizzard ? 15 : 8, duration: 3, label: '+CLI' },
        { stat: StatId.HOM, amount: isBlizzard ? 10 : 5, duration: 2, label: '+HOM' },
      ],
      consequences: [
        { type: 'modify_weight', amount: isBlizzard ? -3 : -1 },
      ],
      narrativeText: narrative,
    };
  },

  getChoices(ctx) {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';

    if (!isBlizzard) return []; // Frost is not a choice event

    return [
      {
        id: 'seek-shelter',
        label: 'Fight toward the tree line',
        description: 'The wind is weaker in dense forest.',
        style: 'default',
        narrativeResult: 'You lower your head and push into the wind, step by agonizing step, until the dark mass of the tree line swallows you. The wind drops instantly — still cold, brutally cold, but no longer stripping the life from your skin. You wedge yourself between two fallen trunks and wait.',
        modifyOutcome(base) {
          return {
            ...base,
            // Shelter reduces the harm significantly
            harmEvents: base.harmEvents.map((h) => ({
              ...h,
              magnitude: Math.round(h.magnitude * 0.4),
            })),
            statEffects: base.statEffects.map((e) => ({
              ...e,
              amount: Math.round(e.amount * 0.5),
            })),
          };
        },
      },
      {
        id: 'hunker-down',
        label: 'Hunker down where you are',
        description: 'Conserve energy. Curl tight. Endure.',
        style: 'danger',
        narrativeResult: 'You fold your legs beneath you, pressing your belly to the ground, tucking your nose against your flank. The snow begins to accumulate on your back. It is, paradoxically, insulating — but beneath it, the cold works its way inward, and your body burns its reserves fighting it.',
        modifyOutcome(base) {
          return {
            ...base,
            consequences: [
              ...base.consequences,
              { type: 'modify_weight', amount: -2 },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  VEHICLE STRIKE
// ══════════════════════════════════════════════════

export const vehicleStrikeTrigger: SimulationTrigger = {
  id: 'sim-vehicle-strike',
  category: 'environmental',
  tags: ['danger', 'human'],
  calibrationCauseId: 'vehicle-strike',

  isPlausible(ctx) {
    // Vehicles are associated with roads near human areas
    // More common during rut (autumn) when deer cross roads frantically
    return ctx.time.season === 'autumn' || ctx.currentNodeType === 'plain';
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.005;
    let base = getEncounterRate(ctx.calibratedRates, 'vehicle-strike', ctx.time.season);

    // Night crossings are much more dangerous
    if (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') base *= 2;

    // Rut-driven movement increases road crossing
    if (ctx.time.season === 'autumn' && ctx.animal.sex === 'male') base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const vehicleHarm: HarmEvent = {
      id: `vehicle-impact-${ctx.time.turn}`,
      sourceLabel: 'vehicle impact',
      magnitude: ctx.rng.int(70, 95),
      targetZone: 'random',
      spread: 0.6,
      harmType: 'blunt',
    };

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: 12, duration: 4, label: '+NOV' },
        { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
      ],
      consequences: [],
      narrativeText: 'You step out of the tree line and something is wrong — the ground beneath your hooves is flat and hard and smells of tar. Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar. Every nerve in your body fires at once.',
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    const vehicleHarm: HarmEvent = {
      id: `vehicle-impact-${ctx.time.turn}`,
      sourceLabel: 'vehicle impact',
      magnitude: ctx.rng.int(70, 95),
      targetZone: 'random',
      spread: 0.6,
      harmType: 'blunt',
    };

    return [
      {
        id: 'leap-forward',
        label: 'Leap forward across',
        description: `Commit to the crossing.${locomotion < 60 ? ' Your legs are sluggish.' : ''}`,
        style: locomotion < 50 ? 'danger' : 'default',
        narrativeResult: locomotion >= 60
          ? 'You launch yourself forward, muscles firing, legs a blur of motion. The roaring light passes behind you close enough that the wind of it ruffles your tail. You clear the far edge of the hard ground and crash into the brush, alive, heart exploding in your chest.'
          : 'You try to leap but your body is slow — the damaged leg hesitates, and the monster of light is upon you.',
        modifyOutcome(base, innerCtx) {
          const clearance = 0.6 + locomotion * 0.003;
          const hit = !innerCtx.rng.chance(clearance);
          return {
            ...base,
            harmEvents: hit ? [vehicleHarm] : [],
            consequences: hit && innerCtx.rng.chance(0.6)
              ? [{ type: 'death', cause: 'Struck by vehicle' }]
              : [],
          };
        },
      },
      {
        id: 'freeze-road',
        label: 'Freeze in the lights',
        description: 'The lights paralyze you.',
        style: 'danger',
        narrativeResult: 'The lights pin you in place. Your legs lock. Your mind empties. The roar fills the world. Then impact.',
        modifyOutcome(base, innerCtx) {
          // Freezing on a road is almost always bad
          const hit = innerCtx.rng.chance(0.75);
          return {
            ...base,
            harmEvents: hit ? [vehicleHarm] : [],
            consequences: hit && innerCtx.rng.chance(0.7)
              ? [{ type: 'death', cause: 'Struck by vehicle' }]
              : [],
            statEffects: [
              { stat: StatId.TRA, amount: 15, duration: 6, label: '+TRA' },
            ],
          };
        },
      },
      {
        id: 'reverse',
        label: 'Whirl back the way you came',
        description: 'Retreat to the tree line.',
        style: 'default',
        narrativeResult: 'Instinct overcomes the paralysis. You spin on your haunches and spring back toward the trees, the roaring light screaming past behind you. The hard ground shakes beneath your hooves. Then darkness and silence close around you, and the familiar smell of pine replaces the stench of burning air.',
        modifyOutcome(base, innerCtx) {
          const clipped = innerCtx.rng.chance(0.1);
          return {
            ...base,
            harmEvents: clipped ? [{
              ...vehicleHarm,
              magnitude: Math.round(vehicleHarm.magnitude * 0.4),
              targetZone: 'hind-legs',
            }] : [],
            consequences: clipped && innerCtx.rng.chance(0.2)
              ? [{ type: 'death', cause: 'Struck by vehicle' }]
              : [],
          };
        },
      },
    ];
  },
};
