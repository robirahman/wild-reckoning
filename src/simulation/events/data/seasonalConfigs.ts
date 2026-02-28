import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { StatEffect } from '../../../types/events';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';

// ── Config Types ──

export interface SeasonalPlausibility {
  /** Required seasons (undefined = all) */
  seasons?: string[];
  /** Required sex ('male' | 'female' | undefined for any) */
  sex?: string;
  /** Minimum age in months (undefined = any) */
  minAge?: number;
  /** Flags that must be present */
  requiredFlags?: string[];
  /** Flags that must NOT be present */
  excludedFlags?: string[];
}

export interface SeasonalWeightParams {
  base: number;
  /** Multipliers by node type */
  terrainMultipliers?: Record<string, number>;
  /** Multipliers by weather type */
  weatherMultipliers?: Record<string, number>;
  /** Custom weight adjustment */
  custom?: (ctx: SimulationContext, base: number) => number;
}

export interface SeasonalTriggerConfig {
  id: string;
  tags: string[];

  plausibility: SeasonalPlausibility;
  weight: SeasonalWeightParams;

  /** Stat effects applied when event fires */
  statEffects: StatEffect[] | ((ctx: SimulationContext) => StatEffect[]);
  /** Consequences applied when event fires */
  consequences: any[] | ((ctx: SimulationContext) => any[]);

  /** Narrative builder */
  narrative: (ctx: SimulationContext) => {
    text: string;
    actionDetail: string;
    clinicalDetail: string;
    intensity: 'low' | 'medium' | 'high' | 'extreme';
    emotionalTone: string;
    eventType: string;
  };

  /** Choice builder (undefined or empty = no choices, passive event) */
  choices?: (ctx: SimulationContext) => SimulationChoice[];
}

// ── Configs ──

export const ANTLER_VELVET_CONFIG: SeasonalTriggerConfig = {
  id: 'sim-antler-velvet',
  tags: ['seasonal', 'health'],

  plausibility: {
    seasons: ['spring'],
    sex: 'male',
    excludedFlags: ['antlers-growing'],
  },

  weight: {
    // Guaranteed to happen once per spring for bucks
    base: 0.15,
  },

  statEffects: [
    { stat: StatId.HOM, amount: 5, duration: 3, label: '+HOM' },
    { stat: StatId.NOV, amount: -4, label: '-NOV' },
  ],

  consequences: (ctx) => {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    return [
      { type: 'set_flag', flag: 'antlers-growing' as any },
      // Antler growth costs calories -- more for larger racks
      { type: 'add_calories', amount: bcs >= 3 ? -150 : -80, source: 'antler growth' },
    ];
  },

  narrative: (ctx) => {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const antlerQuality = bcs >= 3 ? 'robust' : bcs >= 2 ? 'modest' : 'stunted';
    const qualityNarrative = antlerQuality === 'robust'
      ? 'The new growth pushes outward with startling speed — you can almost feel the calcium being pulled from your bones to feed the velvet-sheathed tines. They will be formidable.'
      : antlerQuality === 'modest'
        ? 'The new antlers emerge cautiously, smaller than you might have grown if winter had been kinder. The velvet is warm and tender, rich with blood vessels that will feed months of growth.'
        : 'The growth is thin, almost tentative. A hard winter has left too little calcium in your skeleton, and the antlers that emerge are narrow, their velvet sparse. They will be a poor weapon come autumn.';

    return {
      text: `The pedicles on your skull itch with a deep, insistent pressure. Something is happening beneath the skin — a biological imperative written in bone and blood. ${qualityNarrative} For now, they are fragile, easily damaged. You move through the woods with uncharacteristic caution, ducking branches that once meant nothing.`,
      actionDetail: `The pedicles itch with a deep pressure. ${qualityNarrative} For now they are fragile. You move with uncharacteristic caution.`,
      clinicalDetail: `Spring antler growth initiated. Velvet antler quality: ${antlerQuality}. BCS: ${bcs}/5. Caloric cost: ${bcs >= 3 ? 150 : 80} kcal.`,
      intensity: 'low',
      emotionalTone: 'calm',
      eventType: 'antler-velvet',
    };
  },

  // Passive seasonal event -- no choices
};

export const INSECT_HARASSMENT_CONFIG: SeasonalTriggerConfig = {
  id: 'sim-insect-harassment',
  tags: ['seasonal', 'health', 'parasite'],

  plausibility: {
    seasons: ['summer'],
  },

  weight: {
    base: 0.06,
    terrainMultipliers: { water: 2, forest: 1.3 },
    weatherMultipliers: { heat_wave: 1.8 },
  },

  statEffects: [
    { stat: StatId.IMM, amount: 5, duration: 3, label: '+IMM' },
    { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
    { stat: StatId.CLI, amount: 3, duration: 2, label: '+CLI' },
  ],

  consequences: [],

  narrative: (ctx) => {
    const nearWater = ctx.currentNodeType === 'water';
    return {
      text: nearWater
        ? 'The swarm finds you at the water\'s edge — deer flies first, their bites like hot needles, then the smaller gnats that crawl into your ears and nostrils. Bot flies circle in wide, lazy arcs, waiting for their moment to deposit eggs on your legs. You stamp and shake your head, but the cloud follows you, a personal torment that will not lift until the first hard frost.'
        : 'They come with the rising heat — deer flies, horse flies, gnats, mosquitoes, each species with its own schedule of misery. The deer flies are the worst, tearing small chunks of skin with scissor-like mouthparts, drawing blood that attracts still more flies. You twitch your skin, stamp your hooves, and swing your head constantly, burning energy on a battle you cannot win.',
      actionDetail: nearWater
        ? 'The swarm finds you at the water\'s edge — deer flies, gnats, bot flies. A personal torment until the first hard frost.'
        : 'Deer flies tear small chunks of skin. You twitch, stamp, and swing your head constantly, burning energy on a battle you cannot win.',
      clinicalDetail: `Summer insect harassment. ${nearWater ? 'Near water — elevated biting fly density (Chrysops, Culicoides, Hypoderma).' : 'Forest/field exposure to Tabanidae (deer flies, horse flies). Metabolic cost of defensive behavior.'}`,
      intensity: 'medium',
      emotionalTone: 'pain',
      eventType: 'insect-harassment',
    };
  },

  choices: (ctx) => [
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
  ],
};

export const AUTUMN_RUT_CONFIG: SeasonalTriggerConfig = {
  id: 'sim-autumn-rut',
  tags: ['seasonal', 'mating', 'rut'],

  plausibility: {
    seasons: ['autumn'],
    sex: 'male',
    minAge: 18,
    excludedFlags: ['rut-active'],
  },

  weight: {
    // Guaranteed to fire once per autumn for eligible bucks
    base: 0.2,
  },

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

  narrative: (ctx) => {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const readyNarrative = bcs >= 3
      ? 'You are heavy with summer fat, your neck swollen thick with muscle, your antlers hardened into weapons. You are ready.'
      : 'You are thinner than you should be — winter\'s echo still lives in your ribs. But the hormones do not care about preparation. The rut will happen whether your body can afford it or not.';

    return {
      text: `The change is chemical and absolute. The shortening daylight triggers a hormonal cascade that rewrites your priorities in a matter of days. Your velvet dries, cracks, and peels away in bloody strips, revealing the polished bone beneath — pale ivory stained rust-brown by the sap of the saplings you rake obsessively. Your neck swells. Your appetite vanishes. Every doe on the wind is a signal you cannot ignore, every other buck a threat that must be confronted. ${readyNarrative} The rut has begun.`,
      actionDetail: `Your velvet peels away in bloody strips, revealing polished bone. Your neck swells. Your appetite vanishes. ${readyNarrative} The rut has begun.`,
      clinicalDetail: `Rut onset. Photoperiod-triggered testosterone surge. Velvet shedding, cervical muscle hypertrophy, behavioral shift to breeding mode. BCS: ${bcs}/5.`,
      intensity: 'high',
      emotionalTone: 'aggression',
      eventType: 'autumn-rut-onset',
    };
  },

  // The rut is not optional -- it's a hormonal imperative
};

export const WINTER_YARD_CONFIG: SeasonalTriggerConfig = {
  id: 'sim-winter-yard',
  tags: ['seasonal', 'weather', 'social'],

  plausibility: {
    seasons: ['winter'],
    excludedFlags: ['wintering-in-yard'],
  },

  weight: {
    base: 0.12,
    weatherMultipliers: { blizzard: 2.5, frost: 1.5 },
    custom: (ctx, base) => {
      // Low body condition makes communal warmth more attractive
      const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
      if (bcs <= 2) return base * 1.5;
      return base;
    },
  },

  statEffects: [
    { stat: StatId.CLI, amount: -6, label: '-CLI' },
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.HOM, amount: 3, duration: 3, label: '+HOM' },
  ],

  consequences: [],

  narrative: () => ({
    text: 'The snow is belly-deep now, and every step is a labor that costs more calories than it earns. But ahead, through the grey curtain of falling snow, you see the dark shapes of hemlocks and cedars — the traditional winter yard, known to generations of deer through your mother\'s mother\'s memory. The trails are already packed by earlier arrivals, hard-beaten paths between bedding areas and browse. Other deer are here — does and fawns mostly, their body heat warming the sheltered spaces between the evergreens. The yard is safety, but it is also confinement. The browse within reach will be stripped bare within weeks, and then the real test begins.',
    actionDetail: 'The traditional winter yard — hemlock and cedar shelter, packed trails, other deer. Safety, but also confinement. The browse will be stripped bare within weeks.',
    clinicalDetail: 'Winter deer yard (traditional conifer shelter). Communal wintering site with packed trail network. Browse competition will intensify as winter progresses.',
    intensity: 'medium' as const,
    emotionalTone: 'cold',
    eventType: 'winter-yard',
  }),

  choices: (ctx) => [
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
  ],
};

export const RUT_ENDS_CONFIG: SeasonalTriggerConfig = {
  id: 'sim-rut-ends',
  tags: ['seasonal', 'rut'],

  plausibility: {
    seasons: ['winter'],
    sex: 'male',
    requiredFlags: ['rut-active'],
  },

  weight: {
    // Guaranteed to fire once rut is active and winter arrives
    base: 0.25,
  },

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

  narrative: (ctx) => {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const exhaustionNarrative = bcs <= 2
      ? 'You are gaunt — ribs visible, hip bones jutting, the muscle that swelled your neck during the rut consumed by weeks of obsessive breeding. You have perhaps spent too much.'
      : 'You are thinner than autumn left you, but the reserves hold. The rut took its toll, but you entered it strong enough to pay the price.';

    return {
      text: `The fire is gone. One morning you simply wake up and the obsessive urgency that ruled your every thought for weeks has vanished, replaced by a hollowed-out exhaustion. Your antlers feel heavy and wrong — the bone at the pedicle is being dissolved from within, weakened by the same hormonal shift that ended the rut. They will fall soon, sometimes one at a time, leaving you lopsided and vulnerable until the second drops. ${exhaustionNarrative} Winter stretches ahead, long and hungry, and you must survive it on whatever reserves remain.`,
      actionDetail: `The fire is gone. The obsessive urgency has vanished. Your antlers feel heavy and wrong — bone dissolving at the pedicle. ${exhaustionNarrative}`,
      clinicalDetail: `Post-rut exhaustion. Testosterone declining, pedicle osteoclast activity increasing (antler drop imminent). BCS: ${bcs}/5. ${bcs <= 2 ? 'Significant body mass depleted during breeding.' : 'Adequate reserves maintained.'}`,
      intensity: bcs <= 2 ? 'high' : 'medium',
      emotionalTone: bcs <= 2 ? 'pain' : 'calm',
      eventType: 'rut-ends',
    };
  },

  // Post-rut is not a choice
};
