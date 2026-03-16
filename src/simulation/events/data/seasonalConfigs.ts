import type { SimulationContext, SimulationChoice } from '../types';
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
      ? 'The new growth pushes outward fast. The velvet-sheathed tines are thick and warm with blood. They will be heavy.'
      : antlerQuality === 'modest'
        ? 'The new antlers emerge smaller than they could have been. The velvet is warm and tender, rich with blood.'
        : 'The growth is thin. A hard winter left too little calcium. The antlers that emerge are narrow, their velvet sparse.';

    return {
      text: `The pedicles on your skull itch with deep pressure. Something is pushing up beneath the skin. ${qualityNarrative} For now they are soft and fragile. You duck branches that once meant nothing.`,
      actionDetail: `The pedicles itch. ${qualityNarrative} They are soft and fragile. You duck low branches.`,
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
        ? 'The swarm finds you at the water\'s edge. Deer flies first, their bites sharp and hot. Then gnats crawling into your ears and nostrils. Bot flies circle in wide arcs. You stamp and shake your head but the cloud follows.'
        : 'Deer flies, horse flies, gnats, mosquitoes. The deer flies are worst, tearing small chunks of skin, drawing blood that attracts more flies. You twitch, stamp, and swing your head. The swarm does not leave.',
      actionDetail: nearWater
        ? 'The swarm finds you at the water\'s edge. Deer flies, gnats, bot flies. You stamp and shake but they follow.'
        : 'Deer flies tear small chunks of skin. You twitch, stamp, and swing your head. The swarm does not leave.',
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
      narrativeResult: 'You keep eating, twitching and stamping between bites. The flies do not stop. You do not stop either.',
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
      narrativeResult: 'You wade into the shallows and lower yourself until mud coats your legs and belly. The mud dries in the sun and hardens. The flies land on it and find no skin.',
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
      ? 'You are heavy with summer fat. Your neck is swollen thick with muscle. Your antlers are hard.'
      : 'You are thinner than you should be. Your ribs still show. The drive does not care. It is here.';

    return {
      text: `The velvet dries, cracks, and peels away in bloody strips. The bone beneath is polished ivory stained brown by sap from the saplings you rake. Your neck swells. Your appetite vanishes. Every doe scent on the wind pulls at you. Every buck scent raises the hair along your spine. ${readyNarrative}`,
      actionDetail: `Your velvet peels away. The bone beneath is hard. Your neck swells. Your appetite vanishes. ${readyNarrative}`,
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
    text: 'The snow is belly-deep. Every step costs more than it earns. Ahead, through falling snow, you see dark hemlocks and cedars. The trails are already packed by earlier arrivals. Other deer are here, does and fawns mostly. The air between the evergreens is warmer. The browse within reach will be stripped bare within weeks.',
    actionDetail: 'Hemlock and cedar shelter ahead, packed trails, other deer. The browse will thin fast.',
    clinicalDetail: 'Winter deer yard (traditional conifer shelter). Communal wintering site with packed trail network. Browse competition will intensify as winter progresses.',
    intensity: 'medium' as const,
    emotionalTone: 'cold',
    eventType: 'winter-yard',
  }),

  choices: (_ctx) => [
    {
      id: 'join-yard',
      label: 'Join the winter yard',
      description: 'Safety in numbers and shared warmth, but limited food.',
      style: 'default' as const,
      narrativeResult: 'You push through the last deep snow onto a packed trail. A doe lifts her head, watches you, then goes back to stripping bark. You are one more body in the shelter, one more mouth on the browse.',
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
      narrativeResult: 'You turn away from the yard and push back into open forest. The browse here is untouched. Hemlock boughs heavy with needles, red maple twigs with dried buds. But the wind cuts through you and the snow is unbroken.',
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
      ? 'You are gaunt. Ribs visible, hip bones jutting, neck muscle wasted.'
      : 'You are thinner than autumn left you, but the reserves hold.';

    return {
      text: `The drive drains out of your muscles. You are gaunt. Your antlers feel heavy and wrong. The bone at the pedicle is softening. They will fall soon. ${exhaustionNarrative} Winter stretches ahead.`,
      actionDetail: `The drive is gone. Your antlers are heavy, the pedicle softening. ${exhaustionNarrative}`,
      clinicalDetail: `Post-rut exhaustion. Testosterone declining, pedicle osteoclast activity increasing (antler drop imminent). BCS: ${bcs}/5. ${bcs <= 2 ? 'Significant body mass depleted during breeding.' : 'Adequate reserves maintained.'}`,
      intensity: bcs <= 2 ? 'high' : 'medium',
      emotionalTone: bcs <= 2 ? 'pain' : 'calm',
      eventType: 'rut-ends',
    };
  },

  // Post-rut is not a choice
};
