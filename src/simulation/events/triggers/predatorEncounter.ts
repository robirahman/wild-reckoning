import type { SimulationTrigger, SimulationContext, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';
import { resolveChase } from '../../interactions/chase';
import { resolveFight } from '../../interactions/fight';
import { getTerrainProfile } from '../../interactions/types';
import { wolfEntity, coyoteEntity, cougarEntity, hunterEntity } from '../../narrative/perspective';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Helpers ──

function getLocomotion(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
}

function getVision(ctx: SimulationContext): number {
  return ctx.animal.bodyState?.capabilities['vision'] ?? 100;
}

// ══════════════════════════════════════════════════
//  WOLF PACK ENCOUNTER
// ══════════════════════════════════════════════════

export const wolfPackTrigger: SimulationTrigger = {
  id: 'sim-wolf-pack',
  category: 'predator',
  tags: ['predator', 'danger'],
  calibrationCauseId: 'predation-canid',

  isPlausible(ctx) {
    if (!ctx.regionDef) return false;
    const wolfPop = ctx.ecosystem?.populations['Gray Wolf'];
    return !wolfPop || wolfPop.level > -2;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.02;
    const base = getEncounterRate(ctx.calibratedRates, 'predation-canid', ctx.time.season);

    const locoImpairment = (100 - getLocomotion(ctx)) / 100;
    const visionImpairment = (100 - getVision(ctx)) / 100;

    const wolfPop = ctx.ecosystem?.populations['Gray Wolf'];
    const popMult = wolfPop ? 1 + wolfPop.level * 0.3 : 1;
    const timeMult = (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') ? 1.5 : 1;

    const isSnowy = ctx.time.season === 'winter' &&
      (ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard');
    const snowMult = isSnowy ? 1.8 : 1;

    return base * popMult * timeMult * snowMult * (1 + locoImpairment * 0.5 + visionImpairment * 0.3);
  },

  resolve(ctx) {
    const locomotion = getLocomotion(ctx);
    const isWinter = ctx.time.season === 'winter';
    const isSnowy = ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard';
    const env = buildEnvironment(ctx);

    let narrative: string;
    let actionDetail: string;
    let clinicalDetail: string;
    if (isWinter && isSnowy) {
      narrative = 'The snow is deep and crusted, and your hooves punch through with every stride while the gray shapes behind you run on top of it. There are several of them — you can hear their panting, feel the vibration of their coordinated pursuit through the frozen ground. They have been herding you toward the river, where the ice may or may not hold your weight. Your lungs burn. Your legs are heavy. The gap is closing.';
      actionDetail = 'The snow is deep and crusted, and your hooves punch through with every stride while they run on top of it. They have been herding you toward the river. Your lungs burn. The gap is closing.';
      clinicalDetail = 'Wolf pack coordinated pursuit in deep snow. Deer at disadvantage — hooves punch through crust while wolves travel on surface. Pack herding toward river.';
    } else if (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') {
      narrative = 'You smell them before you see them — the sharp, acrid musk that makes every muscle in your body lock rigid. Gray shapes materialize from the tree line, low and deliberate, spreading in a loose arc. Their eyes catch the last light. They are not rushing. They do not need to.';
      actionDetail = 'They spread in a loose arc, low and deliberate. Their eyes catch the last light. They are not rushing. They do not need to.';
      clinicalDetail = 'Wolf pack detected at dusk/night. Pack in pursuit formation, spreading to flank.';
    } else {
      narrative = 'A sound that isn\'t wind. A movement that isn\'t branch-sway. Your head snaps up and your nostrils flare, and then you see them — lean gray shapes flowing between the trunks, silent and purposeful. A hunting pack, already in formation, already committed.';
      actionDetail = 'They flow between the trunks, silent and purposeful. A hunting pack, already in formation, already committed.';
      clinicalDetail = 'Wolf pack detected during daylight. Pack already in hunting formation.';
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA' },
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Locomotion: ${locomotion}%)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: 'wolf-pack-pursuit',
        entities: [wolfEntity()],
        actions: [action(actionDetail, clinicalDetail, 'high')],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);
    const isWinter = ctx.time.season === 'winter';

    // Wolf pack parameters for chase resolver
    const wolfChaseParams = {
      predatorSpeed: 75,
      predatorEndurance: 90,
      packBonus: 25,
      strikeHarmType: 'sharp' as const,
      strikeTargetZone: 'hind-legs' as const,
      strikeMagnitudeRange: [35, 70] as [number, number],
      strikeLabel: 'wolf bite',
    };

    const choices: SimulationChoice[] = [
      {
        id: 'flee',
        label: 'Run',
        description: `Sprint for cover. ${locomotion < 70 ? 'Your injured legs will slow you.' : 'Your legs are strong.'}`,
        style: locomotion < 50 ? 'danger' : 'default',
        narrativeResult: locomotion >= 70
          ? 'You explode into motion, hooves tearing at the earth. The forest blurs. Behind you, the pack gives chase — but your legs are sound and the fear drives you faster than they can follow. After an agonizing minute of all-out sprint, the sounds of pursuit fade.'
          : 'You run. You run with everything you have, but the ground betrays you — your gait is uneven, favoring the damaged leg, and each stride sends a lance of fire through your body. The wolves sense the weakness. They are gaining.',
        modifyOutcome(base, innerCtx) {
          const chase = resolveChase(innerCtx, wolfChaseParams);
          return {
            ...base,
            harmEvents: chase.harmEvents,
            statEffects: [
              ...base.statEffects,
              { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
            ],
            consequences: [
              ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
              ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
            ],
          };
        },
      },
      {
        id: 'freeze',
        label: 'Freeze and watch',
        description: 'Hold perfectly still. Wolves track movement.',
        style: 'danger',
        narrativeResult: 'You freeze. Every instinct screams at you to run, but you lock your joints and hold, trembling, as the gray shapes circle. Their yellow eyes sweep across the clearing. One raises its nose, testing the air. For a long, terrible moment, the world is silent except for the sound of your own heartbeat hammering in your skull.',
        modifyOutcome(base, innerCtx) {
          // Freezing: detection check based on terrain cover and vision
          const terrain = getTerrainProfile(innerCtx.currentNodeType, innerCtx.currentWeather?.type, innerCtx.time.season);
          const detectionChance = 0.55 - terrain.coverDensity * 0.25; // 0.35 in forest, 0.52 in plains
          const spotted = innerCtx.rng.chance(detectionChance);

          if (spotted) {
            // Spotted: wolves close in for a coordinated assault
            const assaultHarm: HarmEvent = {
              id: `wolf-pack-assault-${innerCtx.time.turn}`,
              sourceLabel: 'wolf pack assault',
              magnitude: innerCtx.rng.int(55, 80),
              targetZone: 'random',
              spread: 0.5,
              harmType: 'sharp',
            };
            return {
              ...base,
              harmEvents: [assaultHarm],
              statEffects: [
                ...base.statEffects,
                { stat: StatId.TRA, amount: 15, duration: 6, label: '+TRA' },
              ],
              consequences: innerCtx.rng.chance(0.20)
                ? [{ type: 'death', cause: 'Killed by wolves' }]
                : [],
            };
          }
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              ...base.statEffects,
              { stat: StatId.TRA, amount: 5, duration: 6, label: '+TRA' },
            ],
            consequences: [],
          };
        },
      },
    ];

    // Water escape: use chase resolver with water-forced terrain
    if (ctx.currentNodeType === 'water' || (isWinter && ctx.rng.chance(0.3))) {
      choices.push({
        id: 'water',
        label: 'Make for the water',
        description: isWinter ? 'The river ice may hold your weight but not theirs.' : 'Wolves hesitate at deep water.',
        style: 'danger',
        narrativeResult: isWinter
          ? 'You bolt for the river. The ice groans beneath you, cracking in spiderweb patterns, but it holds — barely. Behind you, the lead wolf stops at the bank, paws testing the surface, then backs away. The others mill at the edge, whining. You stand on the far side, shaking, the cold already seeping through your hooves.'
          : 'You crash into the river, the shock of cold water hitting your chest like a fist. The current pulls at you but you kick hard, driving toward the far bank. Behind you, the wolves pace the shoreline, unwilling to follow into the deep water.',
        modifyOutcome(base, innerCtx) {
          // Water chase: wolves are reluctant to follow into water, giving a big advantage
          const waterChase = resolveChase(innerCtx, {
            ...wolfChaseParams,
            // Wolves are much less effective in water — reduce pack bonus and speed
            predatorSpeed: 40,
            packBonus: 5,
            predatorEndurance: 40,
          });
          return {
            ...base,
            harmEvents: waterChase.harmEvents,
            statEffects: [
              ...base.statEffects,
              { stat: StatId.CLI, amount: isWinter ? 12 : 4, duration: 3, label: '+CLI' },
              { stat: StatId.HOM, amount: 8, duration: 2, label: '+HOM' },
            ],
            consequences: [
              ...(waterChase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -waterChase.caloriesCost, source: 'sprint' }] : []),
              ...(waterChase.deathCause ? [{ type: 'death' as const, cause: waterChase.deathCause }] : []),
            ],
          };
        },
      });
    }

    return choices;
  },
};

// ══════════════════════════════════════════════════
//  COYOTE STALKER
// ══════════════════════════════════════════════════

export const coyoteStalkerTrigger: SimulationTrigger = {
  id: 'sim-coyote-stalker',
  category: 'predator',
  tags: ['predator', 'danger'],
  calibrationCauseId: 'predation-canid',

  isPlausible(ctx) {
    return ctx.animal.age < 24 || ctx.animal.injuries.length > 0 || getLocomotion(ctx) < 80;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.01;
    let base = getEncounterRate(ctx.calibratedRates, 'predation-canid', ctx.time.season) * 0.4;

    if (ctx.animal.injuries.length > 0) base *= 2;
    if (ctx.animal.age < 18) base *= 2;
    if (getLocomotion(ctx) < 60) base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 4, duration: 3, label: '+TRA' },
        { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: 'A pair of shapes shadows you through the brush — smaller than wolves, rangier, more tentative. Coyotes. They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls to each other carry an edge of patient hunger.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: 'coyote-stalk',
        entities: [coyoteEntity()],
        actions: [action(
          'They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls carry an edge of patient hunger.',
          'Coyote pair shadowing deer, maintaining distance and assessing vulnerability. Opportunistic predation behavior typical of injured or juvenile prey targeting.',
          'medium',
        )],
        environment: env,
        emotionalTone: 'tension',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    // Coyote fight parameters: smaller predator, less dangerous than wolf
    const coyoteFightParams = {
      opponentStrength: 25, // coyotes are small
      opponentWeight: 35,
      opponentWeaponType: 'sharp' as const,
      opponentTargetZone: 'hind-legs' as const,
      opponentDamageRange: [20, 40] as [number, number],
      opponentStrikeLabel: 'coyote bite',
      engagementType: 'strike' as const,
      canDisengage: true,
      mutual: false,
    };

    return [
      {
        id: 'stand-tall',
        label: 'Stand your ground',
        description: 'Face them directly. You are larger than they are.',
        style: 'default',
        narrativeResult: 'You turn to face them, ears forward, hooves planted. At your full height, you tower over them. The coyotes slow, exchange a glance, and melt back into the underbrush. Not worth the risk. Not today.',
        modifyOutcome(base, innerCtx) {
          // Intimidation: use fight resolver to determine if coyotes press or retreat
          const fight = resolveFight(innerCtx, coyoteFightParams);
          // Deer almost always "wins" against coyotes via intimidation due to size advantage
          if (fight.won) {
            return {
              ...base,
              harmEvents: [],
              statEffects: [
                { stat: StatId.TRA, amount: -2, label: '-TRA' },
                { stat: StatId.WIS, amount: 2, label: '+WIS' },
              ],
              consequences: [],
            };
          }
          // Rare: coyotes don't back down (injured/very young deer)
          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: [
              { stat: StatId.TRA, amount: 4, duration: 3, label: '+TRA' },
            ],
            consequences: fight.deathCause
              ? [{ type: 'death', cause: fight.deathCause }]
              : [],
          };
        },
      },
      {
        id: 'bolt',
        label: 'Bolt immediately',
        description: `Don't give them a chance to close in.${locomotion < 70 ? ' Your legs may betray you.' : ''}`,
        style: locomotion < 60 ? 'danger' : 'default',
        narrativeResult: locomotion >= 70
          ? 'You leap away before they can close the gap, crashing through the brush at full speed. The coyotes give a half-hearted chase but break off quickly — an uninjured adult deer is simply too fast.'
          : 'You run, but your stride is wrong — hitching, labored. The coyotes sense it instantly and close the distance with alarming speed. One darts in, snapping at your heels.',
        modifyOutcome(base, innerCtx) {
          const chase = resolveChase(innerCtx, {
            predatorSpeed: 60, // coyotes are moderately fast
            predatorEndurance: 55,
            packBonus: 8, // small coordination between pair
            strikeHarmType: 'sharp',
            strikeTargetZone: 'hind-legs',
            strikeMagnitudeRange: [20, 40],
            strikeLabel: 'coyote bite',
          });
          return {
            ...base,
            harmEvents: chase.harmEvents,
            statEffects: [
              { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
            ],
            consequences: [
              ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
              ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  COUGAR AMBUSH
// ══════════════════════════════════════════════════

export const cougarAmbushTrigger: SimulationTrigger = {
  id: 'sim-cougar-ambush',
  category: 'predator',
  tags: ['predator', 'danger'],
  calibrationCauseId: 'predation-felid',

  isPlausible(ctx) {
    const cougarPop = ctx.ecosystem?.populations['Cougar'];
    return !cougarPop || cougarPop.level > -2;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.008;
    let base = getEncounterRate(ctx.calibratedRates, 'predation-felid', ctx.time.season);

    if (ctx.currentNodeType === 'forest' || ctx.currentNodeType === 'mountain') base *= 1.5;
    if (ctx.time.timeOfDay === 'dusk') base *= 2;

    const visionImpairment = (100 - getVision(ctx)) / 100;
    base *= 1 + visionImpairment * 0.8;

    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 12, duration: 5, label: '+TRA' },
        { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: 'Something is wrong. The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink. Then a tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: 'cougar-ambush',
        entities: [cougarEntity()],
        actions: [action(
          'A tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
          'Cougar ambush from elevated position. Felid targeting cervical vertebrae — standard kill technique for large prey.',
          'extreme',
          ['neck'],
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    // Cougar chase parameters: fast but poor endurance, no pack
    const cougarChaseParams = {
      predatorSpeed: 85,          // cougars are very fast in short bursts
      predatorEndurance: 30,      // but tire quickly
      packBonus: 0,               // solitary
      strikeHarmType: 'sharp' as const,
      strikeTargetZone: 'neck' as const,    // cougars go for the neck
      strikeMagnitudeRange: [50, 85] as [number, number],
      strikeLabel: 'cougar bite',
    };

    return [
      {
        id: 'dodge-bolt',
        label: 'Dodge and bolt',
        description: `Twist away from the lunge and sprint.${locomotion < 60 ? ' Your legs may fail you.' : ''}`,
        style: locomotion < 50 ? 'danger' : 'default',
        narrativeResult: locomotion >= 60
          ? 'Instinct saves you. You jerk sideways in the fraction of a second before impact, and the great cat\'s claws rake across your shoulder instead of closing on your throat. You run — not looking back, not thinking, just running — and the distance opens.'
          : 'You try to twist away but your body doesn\'t respond fast enough. Claws tear across your flank as the weight of the cat drives you sideways. You stumble but keep your feet and run, the hot breath fading behind you.',
        modifyOutcome(base, innerCtx) {
          // Two-phase: initial dodge (reaction check) then chase escape
          const dodgeBonus = (locomotion - 50) * 0.004;
          const dodged = innerCtx.rng.chance(0.4 + dodgeBonus);

          if (dodged) {
            // Successful dodge: glancing shoulder hit, then escape chase with distance advantage
            const shoulderSlash: HarmEvent = {
              id: `cougar-claw-${innerCtx.time.turn}`,
              sourceLabel: 'cougar claw rake',
              magnitude: innerCtx.rng.int(25, 45),
              targetZone: 'torso',
              spread: 0.2,
              harmType: 'sharp',
            };
            // Chase with good distance advantage from successful dodge
            const chase = resolveChase(innerCtx, {
              ...cougarChaseParams,
              strikeMagnitudeRange: [30, 50], // less severe if cat has to re-close
            });
            return {
              ...base,
              harmEvents: [shoulderSlash, ...chase.harmEvents],
              statEffects: [
                { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
              ],
              consequences: [
                ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'sprint' }] : []),
                ...(chase.deathCause ? [{ type: 'death' as const, cause: chase.deathCause }] : []),
              ],
            };
          }

          // Failed dodge: full neck bite, then fight to escape
          const neckBite: HarmEvent = {
            id: `cougar-neck-bite-${innerCtx.time.turn}`,
            sourceLabel: 'cougar bite to neck',
            magnitude: innerCtx.rng.int(60, 90),
            targetZone: 'neck',
            spread: 0,
            harmType: 'sharp',
          };
          // Neck bite from a cougar is very dangerous
          const killChance = 0.35;
          return {
            ...base,
            harmEvents: [neckBite],
            statEffects: [
              { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
            ],
            consequences: innerCtx.rng.chance(killChance)
              ? [{ type: 'death', cause: 'Killed by cougar' }]
              : [],
          };
        },
      },
      {
        id: 'rear-kick',
        label: 'Rear up and kick',
        description: 'Fight back with your hooves. Dangerous but can deter the cat.',
        style: 'danger',
        narrativeResult: 'You rear up, lashing out with your front hooves as the great cat closes. A hoof connects — you feel the solid thud of impact against the cat\'s skull. It recoils, shaking its head, stunned for a moment. You use the opening to put distance between you.',
        modifyOutcome(base, innerCtx) {
          // Use fight resolver: deer kicks vs cougar attack
          const fight = resolveFight(innerCtx, {
            opponentStrength: 70,       // cougar is a powerful predator
            opponentWeight: 140,
            opponentWeaponType: 'sharp',
            opponentTargetZone: 'neck',
            opponentDamageRange: [60, 90],
            opponentStrikeLabel: 'cougar bite to neck',
            engagementType: 'strike',
            canDisengage: true,
            mutual: false,
          });
          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: [
              { stat: StatId.ADV, amount: 6, duration: 3, label: '+ADV' },
              ...(fight.won ? [{ stat: StatId.WIS, amount: 3, label: '+WIS' } as const] : []),
            ],
            consequences: [
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  HUNTING SEASON
// ══════════════════════════════════════════════════

export const huntingSeasonTrigger: SimulationTrigger = {
  id: 'sim-hunting-season',
  category: 'predator',
  tags: ['predator', 'danger', 'human'],
  calibrationCauseId: 'hunting',

  isPlausible(ctx) {
    return ctx.time.season === 'autumn' || (ctx.time.season === 'winter' && ctx.time.monthIndex <= 1);
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.01;
    return getEncounterRate(ctx.calibratedRates, 'hunting', ctx.time.season);
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 10, duration: 4, label: '+TRA' },
        { stat: StatId.NOV, amount: 6, duration: 3, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: 'The forest changes in autumn. Strange smells drift between the trees — acrid, chemical, wrong. Bright shapes move where there should be stillness. Then the sound: a sharp, flat crack that splits the air and sends every bird screaming upward. Another follows, closer. The thunder comes from the direction of the ridge, where the trail narrows between two rock faces. Every instinct in your body locks onto a single imperative: move.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: 'hunting-season',
        entities: [hunterEntity()],
        actions: [action(
          'A sharp, flat crack splits the air and sends every bird screaming upward. Another follows, closer. Every instinct locks onto a single imperative: move.',
          'Rifle fire detected during hunting season. Deer in active hunting zone.',
          'high',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);
    const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

    const bulletHarm: HarmEvent = {
      id: `bullet-${ctx.time.turn}`,
      sourceLabel: 'rifle bullet',
      magnitude: 95,
      targetZone: 'random',
      spread: 0,
      harmType: 'sharp',
    };

    // Hunting is fundamentally different from a chase: it's about concealment and escape.
    // Cover density from terrain directly affects survival.
    return [
      {
        id: 'flee-deep-cover',
        label: 'Flee to dense cover',
        description: 'Run for the thickest brush you can find.',
        style: 'default',
        narrativeResult: 'You plunge into the densest thicket you can find, thorns raking your flanks as you force your way through the tangled undergrowth. The crashing sounds of pursuit do not follow — the brush is too thick. You stand panting in the green darkness, heart hammering, listening.',
        modifyOutcome(base, innerCtx) {
          // Hit chance: base 5% reduced by cover and locomotion
          const hitChance = Math.max(0.02, 0.08 - terrain.coverDensity * 0.04 + (100 - locomotion) * 0.001);
          const hit = innerCtx.rng.chance(hitChance);
          return {
            ...base,
            harmEvents: hit ? [bulletHarm] : [],
            statEffects: [
              { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
            ],
            consequences: [
              { type: 'add_calories', amount: -10, source: 'sprint' },
              ...(hit ? [{ type: 'death' as const, cause: 'Shot by hunter' }] : []),
            ],
          };
        },
      },
      {
        id: 'hold-position',
        label: 'Hold in the brush',
        description: 'Stay low and motionless. Hunters look for movement.',
        style: 'default',
        narrativeResult: 'You sink into the brush, lowering your body until your belly nearly touches the ground. Every muscle trembles with the effort of stillness. The orange shapes move past, footsteps crunching on dry leaves. They do not see you. This time.',
        modifyOutcome(base, innerCtx) {
          // Detection chance: reduced by cover, increased by poor cover
          const spotted = innerCtx.rng.chance(Math.max(0.03, 0.12 - terrain.coverDensity * 0.08));
          return {
            ...base,
            harmEvents: spotted ? [bulletHarm] : [],
            statEffects: [
              { stat: StatId.TRA, amount: spotted ? 15 : 5, duration: 4, label: '+TRA' },
            ],
            consequences: spotted ? [{ type: 'death', cause: 'Shot by hunter' }] : [],
          };
        },
      },
    ];
  },
};
