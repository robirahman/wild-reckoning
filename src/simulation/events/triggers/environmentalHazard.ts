import type { SimulationTrigger, SimulationContext } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';

import { resolveExposure } from '../../interactions/exposure';
import { vehicleEntity } from '../../narrative/perspective';
import { buildEnvironment, action, buildNarrativeContext, weatherEntity, terrainEntity } from '../../narrative/contextBuilder';

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

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [fallHarm],
      statEffects: [
        { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
        { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: narrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'fall-hazard',
        entities: [terrainEntity(
          isMountain ? 'rocky ledge' : isIcy ? 'ice-covered ground' : 'uneven terrain',
          isMountain ? 'loose shale on a narrow ledge' : isIcy ? 'black ice beneath snow' : 'hidden root in leaf litter',
        )],
        actions: [action(
          narrative,
          `Fall on ${isMountain ? 'rocky terrain' : isIcy ? 'ice' : 'forest floor'}. Impact magnitude: ${fallMagnitude}.`,
          isMountain ? 'high' : 'medium',
        )],
        environment: env,
        emotionalTone: 'pain',
        sourceHarmEvents: [fallHarm],
      }),
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

    const env = buildEnvironment(ctx);
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
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: isBlizzard ? 'blizzard-exposure' : 'frost-exposure',
        entities: [weatherEntity(
          isBlizzard ? 'blizzard' : 'deep frost',
          isBlizzard ? 'a wall of frozen wind and driving snow' : 'cold that seeps inward through every thin patch of fur',
        )],
        actions: [action(
          narrative,
          `${isBlizzard ? 'Blizzard' : 'Frost'} exposure. Thermal-cold harm to extremities. Weight loss from thermoregulatory calorie burn.`,
          isBlizzard ? 'extreme' : 'high',
        )],
        environment: env,
        emotionalTone: 'cold',
        sourceHarmEvents: [coldHarm],
      }),
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
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: 12, duration: 4, label: '+NOV' },
        { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
      ],
      consequences: [],
      narrativeText: 'You step out of the tree line and something is wrong — the ground beneath your hooves is flat and hard and smells of tar. Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar. Every nerve in your body fires at once.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'vehicle-strike',
        entities: [vehicleEntity()],
        actions: [action(
          'Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar. Every nerve in your body fires at once.',
          'Deer-vehicle encounter on road. Approaching vehicle at speed.',
          'extreme',
        )],
        environment: env,
        emotionalTone: 'confusion',
      }),
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

// ══════════════════════════════════════════════════
//  FOREST FIRE
// ══════════════════════════════════════════════════

export const forestFireTrigger: SimulationTrigger = {
  id: 'sim-forest-fire',
  category: 'environmental',
  tags: ['danger', 'fire', 'exploration'],

  isPlausible(ctx) {
    return ctx.time.season === 'summer' || ctx.time.season === 'autumn';
  },

  computeWeight(ctx) {
    let base = 0.003;
    if (ctx.currentWeather?.type === 'heat_wave') base *= 5;
    if (ctx.currentNodeType === 'forest') base *= 2;
    if (ctx.time.season === 'summer') base *= 1.5;
    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' },
        { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: 'You smell it before the sky turns — smoke, acrid and thickening, rolling through the understory in low, grey waves that sting your eyes and coat the back of your throat. Then the sound reaches you: a distant, continuous roar, like a river made of heat. Through the trees you see an orange glow that is not sunset — it is fire, and it is coming toward you at the speed of wind.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'forest-fire',
        entities: [weatherEntity('wildfire', 'an orange glow that is not sunset, a roar like a river made of heat')],
        actions: [action(
          'Smoke rolls through the understory, stinging your eyes. Through the trees — an orange glow, coming toward you at the speed of wind.',
          'Wildfire approaching. Smoke inhalation risk. Animal must choose escape route.',
          'extreme',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    return [
      {
        id: 'downhill-creek',
        label: 'Run downhill toward the creek',
        description: 'Fire runs uphill. Water is safety.',
        style: 'default',
        narrativeResult: 'You plunge downhill, crashing through brush, leaping fallen logs. The smoke thickens but the air is cooler here, the ground damper. The creek appears — shallow, muddy, but wet — and you wade in, standing chest-deep as the fire roars overhead through the canopy above.',
        modifyOutcome(base, innerCtx) {
          const burnChance = 0.15;
          const harmEvents: HarmEvent[] = [];

          if (innerCtx.rng.chance(burnChance)) {
            harmEvents.push({
              id: `fire-burn-${innerCtx.time.turn}`,
              sourceLabel: 'wildfire burns',
              magnitude: innerCtx.rng.int(15, 35),
              targetZone: innerCtx.rng.pick(['torso', 'hind-legs']),
              spread: 0.5,
              harmType: 'thermal-heat',
            });
          }

          return {
            ...base,
            harmEvents,
            statEffects: [
              { stat: StatId.TRA, amount: 10, duration: 3, label: '+TRA' },
              { stat: StatId.WIS, amount: 4, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -200, source: 'fire escape' },
              { type: 'set_flag' as const, flag: 'displaced-by-fire' as any },
            ],
          };
        },
      },
      {
        id: 'crosswind-flank',
        label: 'Run crosswind to flank the fire',
        description: 'Outrun the fire\'s edge. Faster but riskier.',
        style: locomotion < 70 ? 'danger' : 'default',
        narrativeResult: 'You bolt perpendicular to the wind, legs pumping, lungs burning from the smoke. The fire\'s edge is a wall of heat to your left, embers swirling around you.',
        modifyOutcome(base, innerCtx) {
          const escapeChance = 0.4 + locomotion * 0.004;
          const escaped = innerCtx.rng.chance(escapeChance);

          if (escaped) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.TRA, amount: 8, duration: 2, label: '+TRA' },
                { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: -300, source: 'fire sprint' },
                { type: 'set_flag' as const, flag: 'displaced-by-fire' as any },
              ],
            };
          } else {
            return {
              ...base,
              harmEvents: [{
                id: `fire-caught-${innerCtx.time.turn}`,
                sourceLabel: 'caught by wildfire',
                magnitude: innerCtx.rng.int(40, 80),
                targetZone: 'random',
                spread: 0.7,
                harmType: 'thermal-heat',
              }],
              statEffects: [
                { stat: StatId.TRA, amount: 20, duration: 5, label: '+TRA' },
              ],
              consequences: [
                { type: 'modify_weight' as const, amount: -5 },
                { type: 'set_flag' as const, flag: 'displaced-by-fire' as any },
              ],
            };
          }
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  FLOODING CREEK
// ══════════════════════════════════════════════════

export const floodingCreekTrigger: SimulationTrigger = {
  id: 'sim-flooding-creek',
  category: 'environmental',
  tags: ['danger', 'water', 'exploration'],

  isPlausible(ctx) {
    return ctx.time.season === 'spring' || ctx.time.season === 'autumn';
  },

  computeWeight(ctx) {
    let base = 0.02;
    if (ctx.currentWeather?.type === 'rain') base *= 3;
    if (ctx.currentNodeType === 'water') base *= 2;
    if (ctx.time.season === 'spring') base *= 1.5;
    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: 6, duration: 2, label: '+ADV' },
        { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: 'The creek that you crossed yesterday at ankle depth is unrecognizable. Muddy water surges bank to bank, carrying branches, leaves, and the occasional drowned rodent spinning in the current. The far side holds better browse — you can see the green from here — but the water between you and it is fast, cold, and deep enough to swallow you whole.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'flooding-creek',
        entities: [terrainEntity('flooding creek', 'muddy water surging bank to bank, fast and deep')],
        actions: [action(
          'The creek that you crossed yesterday at ankle depth is unrecognizable. The water is fast, cold, and deep enough to swallow you whole.',
          'Flash flooding of creek crossing. Drowning risk and cold exposure if crossing attempted.',
          'high',
        )],
        environment: env,
        emotionalTone: 'tension',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);
    const weight = ctx.animal.weight;

    return [
      {
        id: 'swim-across',
        label: 'Swim across',
        description: `The current is strong.${locomotion < 70 ? ' Your legs are compromised.' : ''}`,
        style: locomotion < 60 ? 'danger' : 'default',
        narrativeResult: 'You wade in and the current hits you like a moving wall. The water is shockingly cold — snowmelt, not rain — and it grabs your legs and pulls downstream. You swim with desperate, churning strokes, head barely above the surface.',
        modifyOutcome(base, innerCtx) {
          const swimStrength = locomotion * 0.6 + weight * 0.2;
          const drownChance = Math.max(0.02, 0.15 - swimStrength * 0.001);

          if (innerCtx.rng.chance(drownChance)) {
            return {
              ...base,
              harmEvents: [{
                id: `drowning-${innerCtx.time.turn}`,
                sourceLabel: 'near-drowning in flood',
                magnitude: innerCtx.rng.int(50, 90),
                targetZone: 'torso',
                spread: 0.8,
                harmType: 'blunt',
              }],
              statEffects: [
                { stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: -250, source: 'near-drowning' },
              ],
            };
          }

          const coldExposure = resolveExposure(innerCtx, {
            type: 'cold',
            intensity: 0.5,
            shelterAvailable: false,
            shelterQuality: 0,
          });

          return {
            ...base,
            harmEvents: coldExposure.harmEvents,
            statEffects: [
              { stat: StatId.NOV, amount: 3, duration: 1, label: '+NOV' },
              { stat: StatId.WIS, amount: 3, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -150, source: 'swimming flood' },
              ...(coldExposure.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -coldExposure.caloriesCost, source: 'cold water exposure' }] : []),
            ],
          };
        },
      },
      {
        id: 'wait-recede',
        label: 'Wait for the water to recede',
        description: 'Patience costs calories, not life.',
        style: 'default',
        narrativeResult: 'You bed down in the brush on this side, watching the water. By evening the flood has subsided to something manageable — still high, still fast, but no longer lethal.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -100, source: 'waiting for flood' },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  DISPERSAL — FINDING NEW RANGE
// ══════════════════════════════════════════════════

export const dispersalNewRangeTrigger: SimulationTrigger = {
  id: 'sim-dispersal-new-range',
  category: 'environmental',
  tags: ['exploration'],

  isPlausible(ctx) {
    return ctx.animal.flags.has('dispersal-begun');
  },

  computeWeight(ctx) {
    let base = 0.08;
    if (ctx.currentNodeType === 'forest') base *= 1.5;
    if (ctx.currentNodeResources?.cover && ctx.currentNodeResources.cover >= 50) base *= 1.3;
    return base;
  },

  resolve(ctx) {
    const cover = ctx.currentNodeResources?.cover ?? 50;
    const food = ctx.currentNodeResources?.food ?? 50;
    const quality = (cover + food) / 2;

    const qualityNarrative = quality >= 60
      ? 'This is good ground — thick cedar cover along a south-facing slope, a creek with clean water, abundant browse in every direction.'
      : quality >= 40
        ? 'The territory is adequate — scattered cover, decent browse, water within reach. Not the richest ground, but livable.'
        : 'The land here is marginal — thin cover, sparse browse, a seasonal creek that may run dry. But you are exhausted from traveling.';

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: -5, label: '-NOV' },
        { stat: StatId.ADV, amount: -3, label: '-ADV' },
        { stat: StatId.WIS, amount: 4, label: '+WIS' },
      ],
      consequences: [],
      narrativeText: `After days of wandering through unfamiliar woods, crossing roads and fences and fields that smelled of humans, you find it — a creek bottom with potential. ${qualityNarrative}`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'dispersal-new-range',
        actions: [action(
          `After days of wandering, you find a creek bottom with potential. ${qualityNarrative}`,
          `Yearling dispersal: potential home range identified. Territory quality: ${quality >= 60 ? 'good' : quality >= 40 ? 'adequate' : 'marginal'}.`,
          'low',
        )],
        environment: env,
        emotionalTone: 'calm',
      }),
    };
  },

  getChoices() {
    return [
      {
        id: 'claim-range',
        label: 'Claim this range',
        description: 'Make this your home territory.',
        style: 'default',
        narrativeResult: 'You begin to mark — rubbing your forehead glands on low branches, scraping the earth at trail junctions. The wandering is over. You are home.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.NOV, amount: -8, label: '-NOV' },
              { stat: StatId.ADV, amount: -5, label: '-ADV' },
              { stat: StatId.TRA, amount: -4, label: '-TRA' },
              { stat: StatId.WIS, amount: 5, label: '+WIS' },
            ],
            consequences: [
              { type: 'remove_flag' as const, flag: 'dispersal-begun' as any },
              { type: 'remove_flag' as const, flag: 'dispersal-pressure' as any },
              { type: 'set_flag' as const, flag: 'territory-established' as any },
            ],
          };
        },
      },
      {
        id: 'keep-searching',
        label: 'Keep searching',
        description: 'There might be better ground ahead.',
        style: 'default',
        narrativeResult: 'Something about this place doesn\'t feel right. You push on, legs heavy but will unbroken, searching for ground that matches the image burned into your genes.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.NOV, amount: 4, duration: 2, label: '+NOV' },
              { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -120, source: 'continued dispersal' },
            ],
          };
        },
      },
    ];
  },
};
