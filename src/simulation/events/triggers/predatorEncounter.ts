import type { SimulationTrigger, SimulationContext, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';

// ── Helper: compute locomotion effectiveness for escape chances ──

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
    // Wolves are present in northern forests
    if (!ctx.regionDef) return false;
    const wolfPop = ctx.ecosystem?.populations['Gray Wolf'];
    // Plausible if wolves aren't completely absent
    return !wolfPop || wolfPop.level > -2;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.02; // fallback
    const base = getEncounterRate(ctx.calibratedRates, 'predation-canid', ctx.time.season);

    // Impaired locomotion makes encounters more dangerous AND more likely
    // (you can't avoid them as easily)
    const locoImpairment = (100 - getLocomotion(ctx)) / 100;
    const visionImpairment = (100 - getVision(ctx)) / 100;

    // Wolf population affects encounter rate
    const wolfPop = ctx.ecosystem?.populations['Gray Wolf'];
    const popMult = wolfPop ? 1 + wolfPop.level * 0.3 : 1;

    // Night/dusk encounters are more likely
    const timeMult = (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') ? 1.5 : 1;

    // Deep snow (winter + blizzard/snow) heavily favors wolves
    const snowMult = ctx.time.season === 'winter' &&
      (ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard')
      ? 1.8 : 1;

    return base * popMult * timeMult * snowMult * (1 + locoImpairment * 0.5 + visionImpairment * 0.3);
  },

  resolve(ctx) {
    const locomotion = getLocomotion(ctx);
    const isWinter = ctx.time.season === 'winter';
    const isSnowy = ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard';

    let narrative: string;
    if (isWinter && isSnowy) {
      narrative = 'The snow is deep and crusted, and your hooves punch through with every stride while the gray shapes behind you run on top of it. There are several of them — you can hear their panting, feel the vibration of their coordinated pursuit through the frozen ground. They have been herding you toward the river, where the ice may or may not hold your weight. Your lungs burn. Your legs are heavy. The gap is closing.';
    } else if (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') {
      narrative = 'You smell them before you see them — the sharp, acrid musk that makes every muscle in your body lock rigid. Gray shapes materialize from the tree line, low and deliberate, spreading in a loose arc. Their eyes catch the last light. They are not rushing. They do not need to.';
    } else {
      narrative = 'A sound that isn\'t wind. A movement that isn\'t branch-sway. Your head snaps up and your nostrils flare, and then you see them — lean gray shapes flowing between the trunks, silent and purposeful. A hunting pack, already in formation, already committed.';
    }

    return {
      harmEvents: [], // Base outcome has no harm; choices determine the encounter
      statEffects: [
        { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA' },
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Locomotion: ${locomotion}%)`,
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);
    const isWinter = ctx.time.season === 'winter';
    const isSnowy = ctx.currentWeather?.type === 'snow' || ctx.currentWeather?.type === 'blizzard';

    const fleeHarm: HarmEvent = {
      id: `wolf-chase-bite-${ctx.time.turn}`,
      sourceLabel: 'wolf bite during chase',
      // Magnitude depends on how impaired your locomotion is
      magnitude: Math.round(35 + (100 - locomotion) * 0.4 + (isSnowy ? 15 : 0)),
      targetZone: 'hind-legs',
      spread: 0.2,
      harmType: 'sharp',
    };

    const standHarm: HarmEvent = {
      id: `wolf-pack-assault-${ctx.time.turn}`,
      sourceLabel: 'wolf pack assault',
      magnitude: ctx.rng.int(55, 80),
      targetZone: 'random',
      spread: 0.5,
      harmType: 'sharp',
    };

    // Death probability for flee: low if healthy, high if impaired
    const fleeDeathBase = 0.04 + (100 - locomotion) * 0.003 + (isSnowy ? 0.08 : 0);
    // Death probability for stand: always high
    const standDeathBase = 0.20;

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
          return {
            ...base,
            harmEvents: innerCtx.rng.chance(fleeDeathBase * 3) ? [fleeHarm] : [],
            statEffects: [
              ...base.statEffects,
              { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
            ],
            consequences: innerCtx.rng.chance(fleeDeathBase)
              ? [{ type: 'death', cause: 'Killed by wolves' }]
              : [],
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
          // Freezing is a gamble: lower encounter intensity but if they find you, it's bad
          const spotted = innerCtx.rng.chance(0.45);
          return {
            ...base,
            harmEvents: spotted ? [standHarm] : [],
            statEffects: [
              ...base.statEffects,
              { stat: StatId.TRA, amount: spotted ? 15 : 5, duration: 6, label: '+TRA' },
            ],
            consequences: spotted && innerCtx.rng.chance(standDeathBase)
              ? [{ type: 'death', cause: 'Killed by wolves' }]
              : [],
          };
        },
      },
    ];

    // If there's water nearby (map node), offer a third choice
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
          // Water escape: risky but can be very effective
          const iceBreaks = isWinter && innerCtx.rng.chance(0.15);
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              ...base.statEffects,
              { stat: StatId.CLI, amount: isWinter ? 12 : 4, duration: 3, label: '+CLI' },
              { stat: StatId.HOM, amount: 8, duration: 2, label: '+HOM' },
            ],
            consequences: iceBreaks
              ? [{ type: 'death', cause: 'Drowned after falling through river ice' }]
              : [],
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
    // Coyotes are present almost everywhere; more dangerous to injured/young deer
    return ctx.animal.age < 24 || ctx.animal.injuries.length > 0 || getLocomotion(ctx) < 80;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.01;
    let base = getEncounterRate(ctx.calibratedRates, 'predation-canid', ctx.time.season) * 0.4;

    // Coyotes target weakened deer
    if (ctx.animal.injuries.length > 0) base *= 2;
    if (ctx.animal.age < 18) base *= 2;
    if (getLocomotion(ctx) < 60) base *= 1.5;

    return base;
  },

  resolve(_ctx) {
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 4, duration: 3, label: '+TRA' },
        { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: 'A pair of shapes shadows you through the brush — smaller than wolves, rangier, more tentative. Coyotes. They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls to each other carry an edge of patient hunger.',
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);
    const harmBite: HarmEvent = {
      id: `coyote-bite-${ctx.time.turn}`,
      sourceLabel: 'coyote bite',
      magnitude: ctx.rng.int(20, 40),
      targetZone: 'hind-legs',
      spread: 0.1,
      harmType: 'sharp',
    };

    return [
      {
        id: 'stand-tall',
        label: 'Stand your ground',
        description: 'Face them directly. You are larger than they are.',
        style: 'default',
        narrativeResult: 'You turn to face them, ears forward, hooves planted. At your full height, you tower over them. The coyotes slow, exchange a glance, and melt back into the underbrush. Not worth the risk. Not today.',
        modifyOutcome(base) {
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              { stat: StatId.TRA, amount: -2, label: '-TRA' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [],
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
          const caught = locomotion < 70 && innerCtx.rng.chance(0.3);
          return {
            ...base,
            harmEvents: caught ? [harmBite] : [],
            statEffects: [
              { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
            ],
            consequences: caught && locomotion < 40 && innerCtx.rng.chance(0.1)
              ? [{ type: 'death', cause: 'Killed by coyotes' }]
              : [],
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

    // Cougars ambush from cover -- forest/mountain terrain increases chance
    if (ctx.currentNodeType === 'forest' || ctx.currentNodeType === 'mountain') base *= 1.5;

    // Dusk is prime cougar hunting time
    if (ctx.time.timeOfDay === 'dusk') base *= 2;

    // Poor vision means you're less likely to spot the ambush
    const visionImpairment = (100 - getVision(ctx)) / 100;
    base *= 1 + visionImpairment * 0.8;

    return base;
  },

  resolve(_ctx) {
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 12, duration: 5, label: '+TRA' },
        { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: 'Something is wrong. The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink. Then a tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    const neckBite: HarmEvent = {
      id: `cougar-neck-bite-${ctx.time.turn}`,
      sourceLabel: 'cougar bite to neck',
      magnitude: ctx.rng.int(60, 90),
      targetZone: 'neck',
      spread: 0,
      harmType: 'sharp',
    };

    const shoulderSlash: HarmEvent = {
      id: `cougar-claw-${ctx.time.turn}`,
      sourceLabel: 'cougar claw rake',
      magnitude: ctx.rng.int(30, 50),
      targetZone: 'torso',
      spread: 0.2,
      harmType: 'sharp',
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
          const dodgeSuccess = innerCtx.rng.chance(0.5 + locomotion * 0.003);
          return {
            ...base,
            harmEvents: dodgeSuccess ? [shoulderSlash] : [neckBite],
            statEffects: [
              { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
            ],
            consequences: !dodgeSuccess && innerCtx.rng.chance(0.35)
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
          const kickLands = innerCtx.rng.chance(0.35);
          return {
            ...base,
            harmEvents: kickLands ? [] : [neckBite],
            statEffects: [
              { stat: StatId.ADV, amount: 6, duration: 3, label: '+ADV' },
              ...(kickLands ? [{ stat: StatId.WIS, amount: 3, label: '+WIS' } as const] : []),
            ],
            consequences: !kickLands && innerCtx.rng.chance(0.4)
              ? [{ type: 'death', cause: 'Killed by cougar' }]
              : [],
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
    // Hunting is overwhelmingly an autumn event
    return ctx.time.season === 'autumn' || (ctx.time.season === 'winter' && ctx.time.monthIndex <= 1);
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.01;
    return getEncounterRate(ctx.calibratedRates, 'hunting', ctx.time.season);
  },

  resolve(_ctx) {
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 10, duration: 4, label: '+TRA' },
        { stat: StatId.NOV, amount: 6, duration: 3, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: 'The forest changes in autumn. Strange smells drift between the trees — acrid, chemical, wrong. Bright shapes move where there should be stillness. Then the sound: a sharp, flat crack that splits the air and sends every bird screaming upward. Another follows, closer. The thunder comes from the direction of the ridge, where the trail narrows between two rock faces. Every instinct in your body locks onto a single imperative: move.',
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx);

    const bulletHarm: HarmEvent = {
      id: `bullet-${ctx.time.turn}`,
      sourceLabel: 'rifle bullet',
      magnitude: 95,
      targetZone: 'random',
      spread: 0,
      harmType: 'sharp',
    };

    return [
      {
        id: 'flee-deep-cover',
        label: 'Flee to dense cover',
        description: 'Run for the thickest brush you can find.',
        style: 'default',
        narrativeResult: 'You plunge into the densest thicket you can find, thorns raking your flanks as you force your way through the tangled undergrowth. The crashing sounds of pursuit do not follow — the brush is too thick. You stand panting in the green darkness, heart hammering, listening.',
        modifyOutcome(base, innerCtx) {
          const hit = innerCtx.rng.chance(0.05 + (100 - locomotion) * 0.001);
          return {
            ...base,
            harmEvents: hit ? [bulletHarm] : [],
            statEffects: [
              { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
            ],
            consequences: hit ? [{ type: 'death', cause: 'Shot by hunter' }] : [],
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
          const spotted = innerCtx.rng.chance(0.08);
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
