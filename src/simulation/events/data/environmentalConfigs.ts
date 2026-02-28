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
