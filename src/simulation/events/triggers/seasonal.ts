import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';
import type { HarmEvent } from '../../harm/types';

// ══════════════════════════════════════════════════
//  ANTLER VELVET — spring antler growth
// ══════════════════════════════════════════════════

export const antlerVelvetTrigger: SimulationTrigger = {
  id: 'sim-antler-velvet',
  category: 'seasonal',
  tags: ['seasonal', 'health'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'spring') return false;
    if (ctx.animal.flags.has('antlers-growing')) return false;
    return true;
  },

  computeWeight(ctx) {
    // Guaranteed to happen once per spring for bucks
    return 0.15;
  },

  resolve(ctx) {
    const age = ctx.animal.age;
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    // Antler size depends on age and body condition
    const antlerQuality = bcs >= 3 ? 'robust' : bcs >= 2 ? 'modest' : 'stunted';
    const qualityNarrative = antlerQuality === 'robust'
      ? 'The new growth pushes outward with startling speed — you can almost feel the calcium being pulled from your bones to feed the velvet-sheathed tines. They will be formidable.'
      : antlerQuality === 'modest'
        ? 'The new antlers emerge cautiously, smaller than you might have grown if winter had been kinder. The velvet is warm and tender, rich with blood vessels that will feed months of growth.'
        : 'The growth is thin, almost tentative. A hard winter has left too little calcium in your skeleton, and the antlers that emerge are narrow, their velvet sparse. They will be a poor weapon come autumn.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HOM, amount: 5, duration: 3, label: '+HOM' },
        { stat: StatId.NOV, amount: -4, label: '-NOV' },
      ],
      consequences: [
        { type: 'set_flag', flag: 'antlers-growing' as any },
        // Antler growth costs calories — more for larger racks
        { type: 'add_calories', amount: bcs >= 3 ? -150 : -80, source: 'antler growth' },
      ],
      narrativeText: `The pedicles on your skull itch with a deep, insistent pressure. Something is happening beneath the skin — a biological imperative written in bone and blood. ${qualityNarrative} For now, they are fragile, easily damaged. You move through the woods with uncharacteristic caution, ducking branches that once meant nothing.`,
    };
  },

  getChoices() {
    return []; // Passive seasonal event
  },
};

// ══════════════════════════════════════════════════
//  INSECT HARASSMENT — summer parasite exposure
// ══════════════════════════════════════════════════

export const insectHarassmentTrigger: SimulationTrigger = {
  id: 'sim-insect-harassment',
  category: 'seasonal',
  tags: ['seasonal', 'health', 'parasite'],

  isPlausible(ctx) {
    return ctx.time.season === 'summer';
  },

  computeWeight(ctx) {
    let base = 0.06;

    // Near water = more biting insects
    if (ctx.currentNodeType === 'water') base *= 2;
    // Forest edges attract deer flies
    if (ctx.currentNodeType === 'forest') base *= 1.3;
    // Heat intensifies insect activity
    if (ctx.currentWeather?.type === 'heat_wave') base *= 1.8;

    return base;
  },

  resolve(ctx) {
    const nearWater = ctx.currentNodeType === 'water';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.IMM, amount: 5, duration: 3, label: '+IMM' },
        { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
        { stat: StatId.CLI, amount: 3, duration: 2, label: '+CLI' },
      ],
      consequences: [],
      narrativeText: nearWater
        ? 'The swarm finds you at the water\'s edge — deer flies first, their bites like hot needles, then the smaller gnats that crawl into your ears and nostrils. Bot flies circle in wide, lazy arcs, waiting for their moment to deposit eggs on your legs. You stamp and shake your head, but the cloud follows you, a personal torment that will not lift until the first hard frost.'
        : 'They come with the rising heat — deer flies, horse flies, gnats, mosquitoes, each species with its own schedule of misery. The deer flies are the worst, tearing small chunks of skin with scissor-like mouthparts, drawing blood that attracts still more flies. You twitch your skin, stamp your hooves, and swing your head constantly, burning energy on a battle you cannot win.',
    };
  },

  getChoices(ctx) {
    return [
      {
        id: 'endure',
        label: 'Endure the swarm',
        description: 'Keep foraging despite the torment.',
        style: 'default' as const,
        narrativeResult: 'You grit through it, twitching and stamping but refusing to abandon the browse. The constant irritation is exhausting — each bite drains a fraction of your reserves, and the cumulative effect is a slow bleed of energy and patience.',
        modifyOutcome(base) {
          // Risk of tick infestation from staying in brush
          const tickChance = ctx.rng.chance(0.25);
          return {
            ...base,
            consequences: tickChance
              ? [{ type: 'add_parasite' as const, parasiteId: 'deer-tick' }]
              : [],
          };
        },
      },
      {
        id: 'seek-mud',
        label: 'Seek mud or water',
        description: 'Coat yourself in mud to deter the flies.',
        style: 'default' as const,
        narrativeResult: 'You wade into the shallows and lower yourself until the mud coats your legs and belly. The cool earth hardens in the sun, forming a crude armor against the worst of the biting. The flies circle, frustrated, landing on the dried mud and finding no purchase. It won\'t last, but for now, relief.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.IMM, amount: 2, duration: 1, label: '+IMM' },
              { stat: StatId.HOM, amount: -2, label: '-HOM' },
            ],
            consequences: [],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  AUTUMN RUT — hormonal frenzy begins
// ══════════════════════════════════════════════════

export const autumnRutTrigger: SimulationTrigger = {
  id: 'sim-autumn-rut',
  category: 'seasonal',
  tags: ['seasonal', 'mating', 'rut'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn') return false;
    if (ctx.animal.age < 18) return false;
    if (ctx.animal.flags.has('rut-active')) return false;
    return true;
  },

  computeWeight(ctx) {
    // Guaranteed to fire once per autumn for eligible bucks
    return 0.2;
  },

  resolve(ctx) {
    const weight = ctx.animal.weight;
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    const readyNarrative = bcs >= 3
      ? 'You are heavy with summer fat, your neck swollen thick with muscle, your antlers hardened into weapons. You are ready.'
      : 'You are thinner than you should be — winter\'s echo still lives in your ribs. But the hormones do not care about preparation. The rut will happen whether your body can afford it or not.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: 8, duration: 4, label: '+NOV' },
        { stat: StatId.ADV, amount: 6, duration: 4, label: '+ADV' },
        { stat: StatId.HOM, amount: 5, duration: 3, label: '+HOM' },
      ],
      consequences: [
        { type: 'set_flag', flag: 'rut-active' as any },
        { type: 'remove_flag', flag: 'antlers-growing' as any },
        { type: 'modify_weight', amount: -4 },
      ],
      narrativeText: `The change is chemical and absolute. The shortening daylight triggers a hormonal cascade that rewrites your priorities in a matter of days. Your velvet dries, cracks, and peels away in bloody strips, revealing the polished bone beneath — pale ivory stained rust-brown by the sap of the saplings you rake obsessively. Your neck swells. Your appetite vanishes. Every doe on the wind is a signal you cannot ignore, every other buck a threat that must be confronted. ${readyNarrative} The rut has begun.`,
    };
  },

  getChoices() {
    return []; // The rut is not optional — it's a hormonal imperative
  },
};

// ══════════════════════════════════════════════════
//  WINTER YARD — congregation in sheltered area
// ══════════════════════════════════════════════════

export const winterYardTrigger: SimulationTrigger = {
  id: 'sim-winter-yard',
  category: 'seasonal',
  tags: ['seasonal', 'weather', 'social'],

  isPlausible(ctx) {
    if (ctx.time.season !== 'winter') return false;
    if (ctx.animal.flags.has('wintering-in-yard')) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.12;

    // Blizzard or deep cold makes yarding more urgent
    if (ctx.currentWeather?.type === 'blizzard') base *= 2.5;
    if (ctx.currentWeather?.type === 'frost') base *= 1.5;

    // Low body condition makes communal warmth more attractive
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    if (bcs <= 2) base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.CLI, amount: -6, label: '-CLI' },
        { stat: StatId.ADV, amount: -3, label: '-ADV' },
        { stat: StatId.HOM, amount: 3, duration: 3, label: '+HOM' },
      ],
      consequences: [],
      narrativeText: 'The snow is belly-deep now, and every step is a labor that costs more calories than it earns. But ahead, through the grey curtain of falling snow, you see the dark shapes of hemlocks and cedars — the traditional winter yard, known to generations of deer through your mother\'s mother\'s memory. The trails are already packed by earlier arrivals, hard-beaten paths between bedding areas and browse. Other deer are here — does and fawns mostly, their body heat warming the sheltered spaces between the evergreens. The yard is safety, but it is also confinement. The browse within reach will be stripped bare within weeks, and then the real test begins.',
    };
  },

  getChoices(ctx) {
    return [
      {
        id: 'join-yard',
        label: 'Join the winter yard',
        description: 'Safety in numbers and shared warmth, but limited food.',
        style: 'default' as const,
        narrativeResult: 'You push through the last of the deep snow and onto the packed trail. A doe lifts her head, watches you approach, then returns to stripping bark from a hemlock bough. You are accepted — another body in the communal shelter, another mouth competing for the dwindling browse.',
        modifyOutcome(base) {
          return {
            ...base,
            consequences: [
              { type: 'set_flag' as const, flag: 'wintering-in-yard' as any },
            ],
          };
        },
      },
      {
        id: 'stay-independent',
        label: 'Stay independent',
        description: 'More browse, but no shelter and no herd warmth.',
        style: 'default' as const,
        narrativeResult: 'You turn away from the yard and push back into the open forest. The browse here is untouched — low-hanging hemlock boughs heavy with needles, red maple twigs still carrying their dried buds. But the wind cuts through you without the buffer of other bodies, and the snow is unbroken, each step a battle.',
        modifyOutcome(base, innerCtx) {
          const exposure = resolveExposure(innerCtx, {
            type: 'cold',
            intensity: 0.4,
            shelterAvailable: false,
            shelterQuality: 0,
          });
          return {
            ...base,
            harmEvents: exposure.harmEvents,
            statEffects: [
              { stat: StatId.ADV, amount: 4, duration: 3, label: '+ADV' },
              { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
            ],
            consequences: [
              ...(exposure.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -exposure.caloriesCost, source: 'winter exposure' }] : []),
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  RUT ENDS — post-rut exhaustion and antler drop
// ══════════════════════════════════════════════════

export const rutEndsTrigger: SimulationTrigger = {
  id: 'sim-rut-ends',
  category: 'seasonal',
  tags: ['seasonal', 'rut'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'winter') return false;
    if (!ctx.animal.flags.has('rut-active')) return false;
    return true;
  },

  computeWeight() {
    // Guaranteed to fire once rut is active and winter arrives
    return 0.25;
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const exhaustionNarrative = bcs <= 2
      ? 'You are gaunt — ribs visible, hip bones jutting, the muscle that swelled your neck during the rut consumed by weeks of obsessive breeding. You have perhaps spent too much.'
      : 'You are thinner than autumn left you, but the reserves hold. The rut took its toll, but you entered it strong enough to pay the price.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: -5, label: '-NOV' },
        { stat: StatId.ADV, amount: -8, label: '-ADV' },
        { stat: StatId.HOM, amount: -3, label: '-HOM' },
      ],
      consequences: [
        { type: 'remove_flag', flag: 'rut-active' as any },
        { type: 'remove_flag', flag: 'fought-rut-rival' as any },
        { type: 'remove_flag', flag: 'lost-rut-contest' as any },
        { type: 'remove_flag', flag: 'rut-challenge-won' as any },
      ],
      narrativeText: `The fire is gone. One morning you simply wake up and the obsessive urgency that ruled your every thought for weeks has vanished, replaced by a hollowed-out exhaustion. Your antlers feel heavy and wrong — the bone at the pedicle is being dissolved from within, weakened by the same hormonal shift that ended the rut. They will fall soon, sometimes one at a time, leaving you lopsided and vulnerable until the second drops. ${exhaustionNarrative} Winter stretches ahead, long and hungry, and you must survive it on whatever reserves remain.`,
    };
  },

  getChoices() {
    return []; // Post-rut is not a choice
  },
};
