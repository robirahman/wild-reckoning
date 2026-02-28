import type { SimulationTrigger, SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { HarmEvent, HarmType } from '../../harm/types';
import type { BodyZone } from '../../anatomy/types';
import type { StatEffect } from '../../../types/events';
import type { NarrativeEntity } from '../../narrative/types';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';
import { buildEnvironment } from '../../narrative/contextBuilder';
import { toFragmentContext, pickContextualText } from '../../narrative/templates/shared';
import {
  BLIZZARD_NARRATIVES,
  FALL_NARRATIVES,
  VEHICLE_NARRATIVES,
  FIRE_NARRATIVES,
  FLOOD_NARRATIVES,
} from '../../narrative/templates/environment';

// ── Config Types ──

export interface PlausibilityRule {
  /** Required seasons (undefined = all) */
  seasons?: string[];
  /** Required weather types */
  weatherTypes?: string[];
  /** Required node types */
  nodeTypes?: string[];
  /** Required flags on the animal */
  requiredFlags?: string[];
  /** Custom plausibility check (if basic rules aren't sufficient) */
  custom?: (ctx: SimulationContext) => boolean;
}

export interface WeightParams {
  base: number;
  /** Calibration cause ID (if using calibrated rates) */
  calibrationCauseId?: string;
  /** Multipliers by node type */
  terrainMultipliers?: Record<string, number>;
  /** Multipliers by weather type */
  weatherMultipliers?: Record<string, number>;
  /** Multipliers by season */
  seasonMultipliers?: Record<string, number>;
  /** Multipliers by time of day */
  timeMultipliers?: Record<string, number>;
  /** Factor for locomotion impairment (multiplied by impairment 0-1) */
  locomotionImpairmentFactor?: number;
  /** Factor for exploration behavior */
  explorationBehaviorFactor?: number;
  /** Additional weight adjustments */
  custom?: (ctx: SimulationContext, base: number) => number;
}

export interface HarmTemplate {
  sourceLabel: string | ((ctx: SimulationContext) => string);
  magnitudeRange: [number, number] | ((ctx: SimulationContext) => [number, number]);
  targetZones: (BodyZone | 'random' | 'internal')[];
  spread: number;
  harmType: HarmType;
}

export interface EnvironmentalHazardConfig {
  id: string;
  category: string;
  tags: string[];
  calibrationCauseId?: string;

  plausibility: PlausibilityRule;
  weight: WeightParams;

  /** Stat effects applied when event fires */
  statEffects: StatEffect[] | ((ctx: SimulationContext) => StatEffect[]);
  /** Consequences applied when event fires */
  consequences?: any[] | ((ctx: SimulationContext) => any[]);
  /** Harm template (undefined = no base harm) */
  harmTemplate?: HarmTemplate | ((ctx: SimulationContext) => HarmTemplate);

  /** Narrative builder */
  narrative: (ctx: SimulationContext) => {
    text: string;
    entity?: NarrativeEntity;
    actionDetail: string;
    clinicalDetail: string;
    intensity: string;
    emotionalTone: string;
  };

  /** Choice builder (undefined or empty = no choices) */
  choices?: (ctx: SimulationContext) => SimulationChoice[];
}

// ── Configs ──

export const FALL_HAZARD_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-fall-hazard',
  category: 'environmental',
  tags: ['danger', 'exploration'],

  plausibility: {
    custom: (ctx) => {
      return ctx.currentNodeType === 'mountain' ||
        (ctx.time.season === 'winter' && (ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow'));
    },
  },

  weight: {
    base: 0.015,
    terrainMultipliers: { mountain: 2 },
    weatherMultipliers: { frost: 1.5 },
    locomotionImpairmentFactor: 2,
    explorationBehaviorFactor: 0.2,
  },

  statEffects: [
    { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
    { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
  ],

  harmTemplate: (ctx) => {
    const isMountain = ctx.currentNodeType === 'mountain';
    return {
      sourceLabel: isMountain ? 'fall from rocky ledge' : ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow' ? 'fall on ice' : 'stumble and fall',
      magnitudeRange: isMountain ? [40, 75] : [20, 45],
      targetZones: ['front-legs', 'hind-legs', 'torso'],
      spread: 0.4,
      harmType: 'blunt',
    };
  },

  narrative: (ctx) => {
    const isIcy = ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow';
    const isMountain = ctx.currentNodeType === 'mountain';
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(FALL_NARRATIVES, fragmentCtx, ctx.rng);

    return {
      text,
      actionDetail: text,
      clinicalDetail: `Fall on ${isMountain ? 'rocky terrain' : isIcy ? 'ice' : 'forest floor'}.`,
      intensity: isMountain ? 'high' : 'medium',
      emotionalTone: 'pain',
    };
  },
};

export const BLIZZARD_EXPOSURE_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-blizzard-exposure',
  category: 'environmental',
  tags: ['danger', 'seasonal'],
  calibrationCauseId: 'starvation-exposure',

  plausibility: {
    weatherTypes: ['blizzard', 'frost'],
  },

  weight: {
    base: 0.01,
    calibrationCauseId: 'starvation-exposure',
    weatherMultipliers: { blizzard: 3 },
    terrainMultipliers: { plain: 1.5 },
    custom: (ctx, base) => {
      const weightThreshold = ctx.config.weight.vulnerabilityThreshold;
      if (ctx.animal.weight < weightThreshold) {
        return base * (1 + (weightThreshold - ctx.animal.weight) / weightThreshold);
      }
      return base;
    },
  },

  statEffects: (ctx) => {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    return [
      { stat: StatId.CLI, amount: isBlizzard ? 15 : 8, duration: 3, label: '+CLI' },
      { stat: StatId.HOM, amount: isBlizzard ? 10 : 5, duration: 2, label: '+HOM' },
    ];
  },

  consequences: (ctx) => {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    return [{ type: 'modify_weight', amount: isBlizzard ? -3 : -1 }];
  },

  harmTemplate: (ctx) => {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    return {
      sourceLabel: isBlizzard ? 'blizzard exposure' : 'frost exposure',
      magnitudeRange: isBlizzard ? [15, 35] : [5, 15],
      targetZones: ['front-legs', 'hind-legs', 'head'],
      spread: 0.8,
      harmType: 'thermal-cold',
    };
  },

  narrative: (ctx) => {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(BLIZZARD_NARRATIVES, fragmentCtx, ctx.rng);

    return {
      text,
      actionDetail: text,
      clinicalDetail: `${isBlizzard ? 'Blizzard' : 'Frost'} exposure. Thermal-cold harm to extremities. Weight loss from thermoregulatory calorie burn.`,
      intensity: isBlizzard ? 'extreme' : 'high',
      emotionalTone: 'cold',
    };
  },

  choices: (ctx) => {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    if (!isBlizzard) return [];

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

export const VEHICLE_STRIKE_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-vehicle-strike',
  category: 'environmental',
  tags: ['danger', 'human'],
  calibrationCauseId: 'vehicle-strike',

  plausibility: {
    custom: (ctx) => ctx.time.season === 'autumn' || ctx.currentNodeType === 'plain',
  },

  weight: {
    base: 0.005,
    calibrationCauseId: 'vehicle-strike',
    timeMultipliers: { night: 2, dusk: 2 },
    custom: (ctx, base) => {
      if (ctx.time.season === 'autumn' && ctx.animal.sex === 'male') return base * 1.5;
      return base;
    },
  },

  statEffects: [
    { stat: StatId.NOV, amount: 12, duration: 4, label: '+NOV' },
    { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
  ],

  narrative: (ctx) => {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(VEHICLE_NARRATIVES, fragmentCtx, ctx.rng);

    return {
      text,
      actionDetail: text,
      clinicalDetail: 'Deer-vehicle encounter on road. Approaching vehicle at speed.',
      intensity: 'extreme',
      emotionalTone: 'confusion',
    };
  },

  choices: (ctx) => {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

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
              targetZone: 'hind-legs' as const,
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

export const FOREST_FIRE_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-forest-fire',
  category: 'environmental',
  tags: ['danger', 'fire', 'exploration'],

  plausibility: {
    seasons: ['summer', 'autumn'],
  },

  weight: {
    base: 0.003,
    weatherMultipliers: { heat_wave: 5 },
    terrainMultipliers: { forest: 2 },
    seasonMultipliers: { summer: 1.5 },
  },

  statEffects: [
    { stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' },
    { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV' },
  ],

  narrative: (ctx) => {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(FIRE_NARRATIVES, fragmentCtx, ctx.rng);

    return {
      text,
      actionDetail: text,
      clinicalDetail: 'Wildfire approaching. Smoke inhalation risk. Animal must choose escape route.',
      intensity: 'extreme',
      emotionalTone: 'fear',
    };
  },

  choices: (ctx) => {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

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
        description: `Outrun the fire's edge. Faster but riskier.`,
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

export const FLOODING_CREEK_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-flooding-creek',
  category: 'environmental',
  tags: ['danger', 'water', 'exploration'],

  plausibility: {
    seasons: ['spring', 'autumn'],
  },

  weight: {
    base: 0.02,
    weatherMultipliers: { rain: 3 },
    terrainMultipliers: { water: 2 },
    seasonMultipliers: { spring: 1.5 },
  },

  statEffects: [
    { stat: StatId.ADV, amount: 6, duration: 2, label: '+ADV' },
    { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
  ],

  narrative: (ctx) => {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(FLOOD_NARRATIVES, fragmentCtx, ctx.rng);

    return {
      text,
      actionDetail: text,
      clinicalDetail: 'Flash flooding of creek crossing. Drowning risk and cold exposure if crossing attempted.',
      intensity: 'high',
      emotionalTone: 'tension',
    };
  },

  choices: (ctx) => {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
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
                targetZone: 'torso' as const,
                spread: 0.8,
                harmType: 'blunt' as const,
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
//  BARBED WIRE FENCE — year-round hazard near farmland/suburban edges
// ══════════════════════════════════════════════════

export const BARBED_WIRE_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-barbed-wire',
  category: 'environmental',
  tags: ['danger', 'human', 'exploration'],

  plausibility: {
    custom: (ctx) =>
      ctx.currentNodeType === 'farmstead' ||
      ctx.currentNodeType === 'plain' ||
      ctx.currentNodeType === 'suburban',
  },

  weight: {
    base: 0.012,
    locomotionImpairmentFactor: 1.5, // impaired animals get tangled more easily
    explorationBehaviorFactor: 0.3,
    terrainMultipliers: { farmstead: 2, suburban: 1.5 },
    timeMultipliers: { night: 1.8, dusk: 1.3 }, // harder to see in low light
  },

  statEffects: [
    { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
    { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
  ],

  harmTemplate: (ctx) => {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    // Worse injuries if impaired (can't clear the fence cleanly)
    const baseMag = loco < 60 ? [30, 55] as [number, number] : [15, 35] as [number, number];
    return {
      sourceLabel: 'barbed wire laceration',
      magnitudeRange: baseMag,
      targetZones: ['front-legs', 'hind-legs', 'torso'],
      spread: 0.3,
      harmType: 'sharp',
    };
  },

  narrative: (ctx) => {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    const isNight = ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk';
    const env = buildEnvironment(ctx);

    let text: string;
    if (loco < 60) {
      text = 'The fence appears without warning — a line of thin, vicious wire strung between wooden posts. You try to jump, but your damaged legs betray you. The wire catches your belly and legs, biting deep, and for a terrible moment you are tangled, thrashing, the barbs tearing new wounds with every panicked movement. When you finally wrench free, you leave tufts of fur and streaks of blood on the wire behind you.';
    } else if (isNight) {
      text = 'In the darkness, the fence is invisible until you are upon it. The wire catches you mid-stride, barbs raking across your chest and forelegs in a line of fire. You scramble backward, then forward, then over — clearing it with a desperate lunge that leaves a long gash along your flank.';
    } else {
      text = 'The fence line stretches across the meadow — a human boundary invisible in intent but brutally physical in execution. You leap, but the top wire catches your belly, the twisted barbs finding skin beneath the fur. You clear it, but the price is a stinging line of blood that will attract flies for days.';
    }

    return {
      text,
      actionDetail: text,
      clinicalDetail: `Barbed wire fence encounter. Lacerations to ${loco < 60 ? 'multiple body zones from entanglement' : 'ventral and limb surfaces from fence crossing'}. Open wound infection risk elevated.`,
      intensity: loco < 60 ? 'high' : 'medium',
      emotionalTone: 'pain',
    };
  },

  choices: (ctx) => {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    if (loco >= 70) return []; // Healthy deer clear fences without incident often enough

    return [
      {
        id: 'force-through',
        label: 'Force through the fence',
        description: 'Power through. The wire will cut, but you will be free.',
        style: 'danger',
        narrativeResult: 'You lower your head and charge. The wire screams against your hide, barbs tearing furrows in your skin. But momentum carries you through. On the other side, you stand bleeding and panting, but free.',
        modifyOutcome(base) {
          return base; // Default harm applies
        },
      },
      {
        id: 'find-gap',
        label: 'Search for a gap or low point',
        description: 'There may be a place where the fence sags or the bottom wire is loose.',
        style: 'default',
        narrativeResult: 'You walk the fence line, testing, until you find a place where the bottom wire has pulled loose from its staple. You wriggle under, belly pressed to the earth, and emerge on the other side with only minor scratches.',
        modifyOutcome(base, innerCtx) {
          const foundGap = innerCtx.rng.chance(0.6);
          if (foundGap) {
            return {
              ...base,
              harmEvents: [], // No harm from finding a gap
              consequences: [
                { type: 'add_calories' as const, amount: -20, source: 'fence search' },
              ],
            };
          }
          return base; // Couldn't find gap, default harm
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  ICE FALL-THROUGH — winter water hazard
// ══════════════════════════════════════════════════

export const ICE_FALL_THROUGH_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-ice-fall-through',
  category: 'environmental',
  tags: ['danger', 'water', 'seasonal'],

  plausibility: {
    seasons: ['winter'],
    custom: (ctx) => ctx.currentNodeType === 'water' || ctx.currentNodeType === 'wetland',
  },

  weight: {
    base: 0.008,
    terrainMultipliers: { water: 2, wetland: 1.5 },
    custom: (ctx, base) => {
      // Higher risk in early winter (thin ice) and late winter (thaw)
      if (ctx.time.monthIndex === 0 || ctx.time.monthIndex === 2) return base * 2;
      return base;
    },
  },

  statEffects: [
    { stat: StatId.CLI, amount: 15, duration: 4, label: '+CLI' },
    { stat: StatId.TRA, amount: 10, duration: 3, label: '+TRA' },
  ],

  harmTemplate: {
    sourceLabel: 'ice water immersion',
    magnitudeRange: [20, 45],
    targetZones: ['front-legs', 'hind-legs', 'torso'],
    spread: 0.9,
    harmType: 'thermal-cold',
  },

  consequences: [
    { type: 'modify_weight', amount: -2 },
  ],

  narrative: (ctx) => {
    const env = buildEnvironment(ctx);

    return {
      text: 'The ice looks solid — it held your weight yesterday, held it the day before. But today, something is different. The crack comes first — a sharp, gunshot report that freezes you mid-stride. Then the surface tilts beneath you and you are in the water, the cold so intense it stops your breath, stops your heart, stops your thoughts. Your legs churn against nothing. The edges of the hole crumble when you try to climb out. The cold is eating you alive.',
      actionDetail: 'The ice cracks and gives way. You are in the water, the cold so intense it stops your breath. The edges crumble when you try to climb out.',
      clinicalDetail: 'Ice fall-through into sub-zero water. Acute cold water immersion. Hypothermia onset within minutes. Drowning risk if animal cannot self-rescue.',
      intensity: 'extreme',
      emotionalTone: 'fear',
    };
  },

  choices: (ctx) => {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'break-ice-forward',
        label: 'Break the ice forward toward shore',
        description: `Use your chest to smash a path through the ice toward the bank.${loco < 60 ? ' Your legs are weak.' : ''}`,
        style: loco < 50 ? 'danger' : 'default',
        narrativeResult: 'You throw yourself forward, chest crashing against the ice edge. It breaks. You surge forward. More ice breaks. Step by agonizing step, you smash a channel toward the bank, the cold sapping your strength with every second. When your hooves finally touch bottom and you drag yourself onto solid ground, you collapse, shaking violently, steam rising from your soaked hide.',
        modifyOutcome(base, innerCtx) {
          const escapeChance = 0.5 + loco * 0.004;
          const escaped = innerCtx.rng.chance(escapeChance);

          if (!escaped) {
            return {
              ...base,
              consequences: [
                ...base.consequences,
                { type: 'death' as const, cause: 'Drowned after falling through ice' },
              ],
            };
          }

          return {
            ...base,
            consequences: [
              ...base.consequences,
              { type: 'add_calories' as const, amount: -200, source: 'ice escape' },
            ],
          };
        },
      },
      {
        id: 'scramble-back',
        label: 'Scramble back the way you came',
        description: 'The ice behind you held. Try to climb back onto it.',
        style: 'default',
        narrativeResult: 'You twist in the water and fling your forelegs onto the ice behind you. It groans but holds. You kick, hauling yourself up, belly scraping against the wet surface. For a long moment you are half in, half out, hooves scrabbling for purchase. Then you are up, sliding, crawling away from the hole on your belly until you reach solid ground.',
        modifyOutcome(base, innerCtx) {
          const holdChance = 0.65;
          const held = innerCtx.rng.chance(holdChance);

          if (!held) {
            // Ice collapses again — worse situation
            return {
              ...base,
              harmEvents: base.harmEvents.map(h => ({
                ...h,
                magnitude: Math.round(h.magnitude * 1.5),
              })),
              consequences: [
                ...base.consequences,
                { type: 'add_calories' as const, amount: -250, source: 'extended immersion' },
              ],
            };
          }

          return {
            ...base,
            consequences: [
              ...base.consequences,
              { type: 'add_calories' as const, amount: -150, source: 'ice escape' },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  MUD TRAP — spring thaw / wetland hazard
// ══════════════════════════════════════════════════

export const MUD_TRAP_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-mud-trap',
  category: 'environmental',
  tags: ['danger', 'exploration'],

  plausibility: {
    seasons: ['spring'],
    custom: (ctx) => ctx.currentNodeType === 'water' || ctx.currentNodeType === 'wetland',
  },

  weight: {
    base: 0.01,
    terrainMultipliers: { wetland: 2, water: 1.5 },
    locomotionImpairmentFactor: 1.0,
  },

  statEffects: [
    { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' },
    { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
  ],

  harmTemplate: (ctx) => ({
    sourceLabel: 'mud trap strain',
    magnitudeRange: [10, 30] as [number, number],
    targetZones: ['hind-legs', 'front-legs'],
    spread: 0.2,
    harmType: 'blunt' as const,
  }),

  narrative: (_ctx) => {
    return {
      text: 'The ground looks solid — dark earth covered in last year\'s dead grass. But when you step forward, your leg sinks to the knee in cold, sucking mud. The more you pull, the deeper you go. Your other legs begin to sink too, the mud gripping with a patient, mindless hunger. Panic rises in your chest as you realize you cannot simply walk out of this.',
      actionDetail: 'Your legs sink into cold, sucking mud. The more you pull, the deeper you go. Panic rises as you realize you cannot simply walk out.',
      clinicalDetail: 'Animal mired in deep mud (spring thaw bog). Risk of exhaustion, muscle strain, joint injury, and hypothermia from prolonged immersion. Predation risk critically elevated while immobile.',
      intensity: 'high',
      emotionalTone: 'fear',
    };
  },

  choices: (ctx) => {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'thrash-free',
        label: 'Thrash and lunge toward solid ground',
        description: `Brute force. Exhausting but direct.${loco < 60 ? ' Your injured legs make this harder.' : ''}`,
        style: loco < 50 ? 'danger' : 'default',
        narrativeResult: 'You throw yourself forward with everything you have, legs churning in the muck. Mud sprays. Your muscles scream. For a terrible moment you sink deeper — then your front hooves find something solid. You haul yourself forward, belly dragging through the slime, until at last you are free, gasping, coated in black mud, trembling with exhaustion.',
        modifyOutcome(base, innerCtx) {
          const freeChance = 0.6 + loco * 0.003;
          const freed = innerCtx.rng.chance(freeChance);

          if (!freed) {
            // Exhausted but eventually freed
            return {
              ...base,
              harmEvents: base.harmEvents.map(h => ({
                ...h,
                magnitude: Math.round(h.magnitude * 1.5),
              })),
              consequences: [
                ...base.consequences,
                { type: 'add_calories' as const, amount: -300, source: 'prolonged mud struggle' },
              ],
            };
          }

          return {
            ...base,
            consequences: [
              ...base.consequences,
              { type: 'add_calories' as const, amount: -150, source: 'mud escape' },
            ],
          };
        },
      },
      {
        id: 'calm-and-shift',
        label: 'Stop struggling and work free slowly',
        description: 'Calm yourself. Shift weight carefully. Let the suction break naturally.',
        style: 'default',
        narrativeResult: 'You force yourself to stop thrashing. The mud settles around your legs, holding but no longer pulling. Slowly, carefully, you rock your weight forward, lifting one leg at a time, breaking the suction with small, patient movements. It takes a long time. But eventually, covered in mud and shaking, you are free.',
        modifyOutcome(base) {
          return {
            ...base,
            harmEvents: [], // No physical harm from patient escape
            consequences: [
              ...base.consequences,
              { type: 'add_calories' as const, amount: -100, source: 'mud escape' },
            ],
            statEffects: [
              { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
          };
        },
      },
    ];
  },
};

export const DISPERSAL_NEW_RANGE_CONFIG: EnvironmentalHazardConfig = {
  id: 'sim-dispersal-new-range',
  category: 'environmental',
  tags: ['exploration'],

  plausibility: {
    requiredFlags: ['dispersal-begun'],
  },

  weight: {
    base: 0.08,
    terrainMultipliers: { forest: 1.5 },
    custom: (ctx, base) => {
      const cover = ctx.currentNodeResources?.cover ?? 50;
      return cover >= 50 ? base * 1.3 : base;
    },
  },

  statEffects: [
    { stat: StatId.NOV, amount: -5, label: '-NOV' },
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.WIS, amount: 4, label: '+WIS' },
  ],

  narrative: (ctx) => {
    const cover = ctx.currentNodeResources?.cover ?? 50;
    const food = ctx.currentNodeResources?.food ?? 50;
    const quality = (cover + food) / 2;

    const qualityNarrative = quality >= 60
      ? 'This is good ground — thick cedar cover along a south-facing slope, a creek with clean water, abundant browse in every direction.'
      : quality >= 40
        ? 'The territory is adequate — scattered cover, decent browse, water within reach. Not the richest ground, but livable.'
        : 'The land here is marginal — thin cover, sparse browse, a seasonal creek that may run dry. But you are exhausted from traveling.';

    return {
      text: `After days of wandering through unfamiliar woods, crossing roads and fences and fields that smelled of humans, you find it — a creek bottom with potential. ${qualityNarrative}`,
      actionDetail: `After days of wandering, you find a creek bottom with potential. ${qualityNarrative}`,
      clinicalDetail: `Yearling dispersal: potential home range identified. Territory quality: ${quality >= 60 ? 'good' : quality >= 40 ? 'adequate' : 'marginal'}.`,
      intensity: 'low',
      emotionalTone: 'calm',
    };
  },

  choices: () => [
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
  ],
};
