import type { StatEffect } from '../../../../types/events';
import type { ContextualFragment } from '../../../narrative/templates/shared';
import type { SimulationContext, SimulationChoice } from '../../types';
import type { HarmEvent, HarmType } from '../../../harm/types';
import type { BodyZone } from '../../../anatomy/types';
import type { Situation } from '../types';
import { StatId } from '../../../../types/stats';

// ══════════════════════════════════════════════════
//  ENVIRONMENTAL HAZARD PROFILES
// ══════════════════════════════════════════════════

export interface HazardProfile {
  id: string;
  tags: string[];
  calibrationCauseId?: string;

  /** Which situations must be present (beyond the template's required 'terrain-feature' or 'weather-condition') */
  requiredSources: string[];
  /** Additional plausibility check */
  extraPlausibility?: (ctx: SimulationContext) => boolean;

  /** Base weight */
  baseWeight: number;
  /** Calibrated rate fraction (if using calibration) */
  rateFraction?: number;
  /** How situations modify weight */
  situationWeightModifiers?: (ctx: SimulationContext, situations: Situation[]) => number;

  /** Base stat effects */
  statEffects: StatEffect[] | ((ctx: SimulationContext) => StatEffect[]);
  /** Base harm event (if any) */
  harm?: {
    sourceLabel: string | ((ctx: SimulationContext) => string);
    magnitudeRange: [number, number] | ((ctx: SimulationContext) => [number, number]);
    targetZones: (BodyZone | 'random')[];
    spread: number;
    harmType: HarmType;
  };
  /** Consequences */
  consequences?: Array<{ type: string; amount?: number; source?: string; flag?: string }>;

  /** Narrative pool */
  narratives: ContextualFragment[];
  /** Clinical detail */
  clinicalDetail: string;
  /** Emotional tone */
  emotionalTone: 'fear' | 'tension' | 'discomfort' | 'surprise';

  /** Player choices (if any) */
  choices?: (ctx: SimulationContext, situations: Situation[]) => SimulationChoice[];
}

function resolveHarmFromProfile(
  profile: HazardProfile,
  ctx: SimulationContext,
): HarmEvent | undefined {
  if (!profile.harm) return undefined;
  const mag = typeof profile.harm.magnitudeRange === 'function'
    ? profile.harm.magnitudeRange(ctx)
    : profile.harm.magnitudeRange;
  const zone = profile.harm.targetZones[ctx.rng.int(0, profile.harm.targetZones.length - 1)];
  return {
    id: `${profile.id}-${ctx.time.turn}`,
    sourceLabel: typeof profile.harm.sourceLabel === 'function' ? profile.harm.sourceLabel(ctx) : profile.harm.sourceLabel,
    magnitude: ctx.rng.int(mag[0], mag[1]),
    targetZone: zone,
    spread: profile.harm.spread,
    harmType: profile.harm.harmType,
  };
}

// ── Hazard Profiles ──

const FALL_HAZARD: HazardProfile = {
  id: 'sim-fall-hazard',
  tags: ['danger', 'environmental'],
  requiredSources: ['steep'],

  baseWeight: 0.015,
  situationWeightModifiers(ctx, situations) {
    let mult = 1.0;
    const locoSit = situations.find(s => s.type === 'body-impairment' && s.source === 'locomotion');
    if (locoSit) mult *= 2;
    if (ctx.currentWeather?.type === 'frost' || ctx.currentWeather?.type === 'snow') mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
    { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
  ],
  harm: {
    sourceLabel: 'fall on rocky terrain',
    magnitudeRange: [20, 75],
    targetZones: ['front-legs', 'hind-legs', 'torso'],
    spread: 0.4,
    harmType: 'blunt',
  },
  narratives: [
    { text: 'The scree gives way without warning. One moment you are climbing; the next, the world tilts and you are falling, hooves scrabbling for purchase on rock that crumbles like dry bread. The impact when it comes is sudden and total.', terrain: 'mountain' },
    { text: 'The ice beneath the snow is invisible until your hoof finds it. Your legs go out from under you in an instant and you slam into the frozen ground, the shock radiating through your entire frame.', season: 'winter' },
    { text: 'The trail narrows between boulders and your injured leg buckles at the worst possible moment. You pitch sideways off the ledge, tumbling through brush and stone before coming to rest in a heap on the slope below.' },
  ],
  clinicalDetail: 'Fall injury on steep/icy terrain. Blunt force trauma to limbs and torso.',
  emotionalTone: 'surprise',
};

const BLIZZARD_EXPOSURE: HazardProfile = {
  id: 'sim-blizzard-exposure',
  tags: ['danger', 'environmental', 'weather'],
  calibrationCauseId: 'starvation-exposure',
  requiredSources: ['blizzard'],

  baseWeight: 0.01,
  rateFraction: 0.3,

  statEffects: (ctx) => ctx.currentWeather?.type === 'blizzard'
    ? [{ stat: StatId.CLI, amount: 15, duration: 3, label: '+CLI' }, { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' }]
    : [{ stat: StatId.CLI, amount: 8, duration: 3, label: '+CLI' }, { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' }],
  harm: {
    sourceLabel: 'exposure to severe cold',
    magnitudeRange: (ctx) => ctx.currentWeather?.type === 'blizzard' ? [15, 35] : [5, 20],
    targetZones: ['front-legs', 'hind-legs', 'head'],
    spread: 0.8,
    harmType: 'thermal-cold',
  },
  consequences: [{ type: 'modify_weight', amount: -3, source: 'blizzard exposure' }],
  narratives: [
    { text: 'The wind is a living thing, shrieking through the trees and driving ice crystals into your eyes. The world has been reduced to a white, howling void. Your body burns calories just to keep your core temperature from dropping, and the reserves are running thin.', weather: 'blizzard' },
    { text: 'The cold has teeth. It finds every gap in your winter coat, every patch of thin fur, every injury that weakens your insulation. Standing still means freezing; moving means burning energy you cannot replace.', season: 'winter' },
  ],
  clinicalDetail: 'Severe cold exposure. Thermal stress with progressive hypothermia risk.',
  emotionalTone: 'fear',

  choices(ctx, _situations) {
    const isBlizzard = ctx.currentWeather?.type === 'blizzard';
    return [
      {
        id: 'seek-shelter',
        label: 'Seek shelter',
        description: 'Find the densest cover available and wait it out.',
        style: 'default' as const,
        narrativeResult: 'You push into the thickest stand of conifers you can find, pressing your body against the trunk of a massive spruce. The branches above deflect the worst of the wind, and the snow builds a crude wall around you. It is still cold — brutally cold — but the shelter makes the difference between endurance and surrender.',
        modifyOutcome: (base) => ({
          ...base,
          harmEvents: base.harmEvents.map(h => ({ ...h, magnitude: Math.round(h.magnitude * 0.4) })),
          statEffects: (typeof BLIZZARD_EXPOSURE.statEffects === 'function' ? BLIZZARD_EXPOSURE.statEffects(ctx) : BLIZZARD_EXPOSURE.statEffects).map(e => ({ ...e, amount: Math.round(e.amount * 0.5) })),
        }),
      },
      {
        id: 'hunker-down',
        label: 'Hunker down in the open',
        description: isBlizzard ? 'No shelter in sight. Conserve energy and endure.' : 'Rest in place and wait for conditions to improve.',
        style: 'danger' as const,
        narrativeResult: 'You lower your body as close to the ground as you can, tucking your legs beneath you, pressing your nose into the snow to capture what warmth your breath provides. The wind tears at you from every direction. Time becomes meaningless — there is only the cold, and the effort of surviving it.',
        modifyOutcome: (base) => ({
          ...base,
          consequences: [...base.consequences, { type: 'modify_weight' as const, amount: -2, source: 'exposure weight loss' }],
        }),
      },
    ];
  },
};

const VEHICLE_STRIKE: HazardProfile = {
  id: 'sim-vehicle-strike',
  tags: ['danger', 'environmental', 'human'],
  calibrationCauseId: 'vehicle-strike',
  requiredSources: ['road'],

  baseWeight: 0.005,
  rateFraction: 1.0,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') mult *= 2;
    if (ctx.time.season === 'autumn' && ctx.animal.sex === 'male') mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.NOV, amount: 12, duration: 4, label: '+NOV' },
    { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
  ],
  harm: {
    sourceLabel: 'vehicle impact',
    magnitudeRange: [70, 95],
    targetZones: ['random'],
    spread: 0.6,
    harmType: 'blunt',
  },
  narratives: [
    { text: 'The lights come from nowhere — two blazing eyes rushing toward you with impossible speed, a roaring that shakes the ground. The road, which seemed so easy to cross a moment ago, has become a killing field.', timeOfDay: 'night' },
    { text: 'You step onto the hard, flat surface and something massive hurtles toward you, trailing a scream of heated air. There is no time to think.', timeOfDay: 'dusk' },
    { text: 'The road stretches between the tree lines, deceptively quiet. You are halfway across when the roar begins — a machine-sound, growing from nothing to everything in the space of a heartbeat.' },
  ],
  clinicalDetail: 'Vehicle-deer collision on roadway. High-velocity blunt force trauma.',
  emotionalTone: 'fear',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    return [
      {
        id: 'leap-forward',
        label: 'Leap forward',
        description: 'Commit to crossing. Sprint for the far side.',
        style: (loco < 50 ? 'danger' : 'default') as 'default' | 'danger',
        narrativeResult: 'You explode forward, every muscle firing at once, hooves scrabbling on the hard surface. The machine-scream fills the world—',
        modifyOutcome: (base, innerCtx) => {
          const clearance = 0.6 + loco * 0.003;
          if (innerCtx.rng.chance(clearance)) {
            return { ...base, harmEvents: [], consequences: [{ type: 'add_calories' as const, amount: -20, source: 'sprint' }] };
          }
          return {
            ...base,
            consequences: [...base.consequences, ...(innerCtx.rng.chance(0.65) ? [{ type: 'death' as const, cause: 'Struck by vehicle' }] : [])],
          };
        },
      },
      {
        id: 'freeze-road',
        label: 'Freeze in the road',
        description: 'Instinct locks your legs. You cannot move.',
        style: 'danger' as const,
        narrativeResult: 'Your legs lock. Every instinct tells you to hold perfectly still — the oldest response, the worst response on a road—',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.75)) {
            return {
              ...base,
              statEffects: [...base.statEffects, { stat: StatId.TRA, amount: 15, duration: 6, label: '+TRA' }],
              consequences: [...base.consequences, ...(innerCtx.rng.chance(0.70) ? [{ type: 'death' as const, cause: 'Struck by vehicle' }] : [])],
            };
          }
          return { ...base, harmEvents: [], statEffects: [{ stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA' }] };
        },
      },
      {
        id: 'reverse',
        label: 'Scramble backward',
        description: 'Back the way you came.',
        style: 'default' as const,
        narrativeResult: 'You lurch backward, stumbling off the road edge as the machine hurtles past in a blast of wind and noise—',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.1)) {
            const clipHarm = base.harmEvents.map(h => ({ ...h, magnitude: Math.round(h.magnitude * 0.4) }));
            return {
              ...base,
              harmEvents: clipHarm,
              consequences: innerCtx.rng.chance(0.2) ? [{ type: 'death' as const, cause: 'Clipped by vehicle' }] : [],
            };
          }
          return { ...base, harmEvents: [], consequences: [{ type: 'add_calories' as const, amount: -15, source: 'sprint' }] };
        },
      },
    ];
  },
};

const FOREST_FIRE: HazardProfile = {
  id: 'sim-forest-fire',
  tags: ['danger', 'environmental'],
  requiredSources: [],

  extraPlausibility: (ctx) => ctx.time.season === 'summer' || ctx.time.season === 'autumn',

  baseWeight: 0.003,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.currentWeather?.type === 'heat_wave') mult *= 5;
    if (ctx.currentNodeType === 'forest') mult *= 2;
    if (ctx.time.season === 'summer') mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' },
    { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV' },
  ],
  narratives: [
    { text: 'The air turns acrid and orange. Heat presses through the trees. A crackling roar builds ahead, and through the smoke you see it — a wall of orange light advancing between the trunks. The smoke thickens until every breath burns.', terrain: 'forest' },
    { text: 'A crackling sound fills the air, growing louder by the second. The sky above the canopy glows an angry orange, and embers drift down like burning snow. The forest is on fire, and the fire is moving faster than you expected anything could move.' },
  ],
  clinicalDetail: 'Wildfire event. Thermal and smoke exposure risk.',
  emotionalTone: 'fear',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    return [
      {
        id: 'downhill-creek',
        label: 'Run downhill toward water',
        description: 'Fire moves uphill. Head for the creek.',
        style: 'default' as const,
        narrativeResult: 'You plunge downhill through the thickening smoke, crashing through brush, leaping fallen logs. The creek appears through the haze — shallow, rocky, but wet. You splash into it and crouch low as the fire roars overhead.',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.15)) {
            const burnHarm: HarmEvent = {
              id: `fire-burn-${innerCtx.time.turn}`,
              sourceLabel: 'fire burns',
              magnitude: innerCtx.rng.int(15, 35),
              targetZone: 'torso',
              spread: 0.5,
              harmType: 'thermal-heat',
            };
            return { ...base, harmEvents: [burnHarm], consequences: [{ type: 'add_calories' as const, amount: -200, source: 'fire escape' }, { type: 'set_flag' as const, flag: 'displaced-by-fire' }] };
          }
          return { ...base, harmEvents: [], consequences: [{ type: 'add_calories' as const, amount: -200, source: 'fire escape' }, { type: 'set_flag' as const, flag: 'displaced-by-fire' }] };
        },
      },
      {
        id: 'crosswind-flank',
        label: 'Run crosswind to flank the fire',
        description: `Try to outrun the fire\'s edge.${loco < 60 ? ' Risky with your injuries.' : ''}`,
        style: (loco < 50 ? 'danger' : 'default') as 'default' | 'danger',
        narrativeResult: 'You turn perpendicular to the advancing wall of flame and run — not away from it, but along its edge, looking for a gap, a break, anywhere the fire has not yet reached—',
        modifyOutcome: (base, innerCtx) => {
          const escapeChance = 0.40 + loco * 0.004;
          if (innerCtx.rng.chance(escapeChance)) {
            return {
              ...base,
              harmEvents: [],
              statEffects: [{ stat: StatId.TRA, amount: 8, duration: 2, label: '+TRA' }, { stat: StatId.NOV, amount: 5, label: '+NOV' }],
              consequences: [{ type: 'add_calories' as const, amount: -300, source: 'fire sprint' }],
            };
          }
          const burnHarm: HarmEvent = {
            id: `fire-caught-${innerCtx.time.turn}`,
            sourceLabel: 'wildfire burns',
            magnitude: innerCtx.rng.int(40, 80),
            targetZone: 'random',
            spread: 0.7,
            harmType: 'thermal-heat',
          };
          return {
            ...base,
            harmEvents: [burnHarm],
            statEffects: [{ stat: StatId.TRA, amount: 20, duration: 5, label: '+TRA' }],
            consequences: [{ type: 'modify_weight' as const, amount: -5, source: 'fire damage' }, { type: 'add_calories' as const, amount: -300, source: 'fire sprint' }],
          };
        },
      },
    ];
  },
};

const FLOODING_CREEK: HazardProfile = {
  id: 'sim-flooding-creek',
  tags: ['danger', 'environmental'],
  requiredSources: ['water'],

  extraPlausibility: (ctx) => ctx.time.season === 'spring' || ctx.time.season === 'autumn',

  baseWeight: 0.02,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.currentWeather?.type === 'rain' || ctx.currentWeather?.type === 'heavy_rain') mult *= 3;
    if (ctx.time.season === 'spring') mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.ADV, amount: 6, duration: 2, label: '+ADV' },
    { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
  ],
  narratives: [
    { text: 'The creek has become something else. Brown water surges between the banks, carrying branches and debris, the roar of it drowning out every other sound. The crossing you used last week is gone — buried under a churning, muddy torrent that claws at the banks.', season: 'spring' },
    { text: 'Rain has swollen the creek beyond recognition. What was a gentle trickle is now a violent, turbid rush of water that tears at the earth and carries whole bushes downstream.' },
  ],
  clinicalDetail: 'Flash flooding at creek crossing. Drowning and hypothermia risk.',
  emotionalTone: 'tension',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    const weight = ctx.animal.weight;
    return [
      {
        id: 'swim-across',
        label: 'Swim across',
        description: `The current is strong but the far bank is close.${loco < 60 ? ' Your leg may fail you.' : ''}`,
        style: (loco < 50 ? 'danger' : 'default') as 'default' | 'danger',
        narrativeResult: 'You plunge in. The cold hits first — a whole-body shock that steals your breath — and then the current seizes you, pulling you downstream, spinning you, and you kick with everything you have toward the far bank—',
        modifyOutcome: (base, innerCtx) => {
          const drownChance = Math.max(0.02, 0.15 - (loco * 0.6 + weight * 0.2) * 0.001);
          if (innerCtx.rng.chance(drownChance)) {
            const drownHarm: HarmEvent = {
              id: `flood-impact-${innerCtx.time.turn}`,
              sourceLabel: 'flood debris impact',
              magnitude: innerCtx.rng.int(50, 90),
              targetZone: 'torso',
              spread: 0.5,
              harmType: 'blunt',
            };
            return {
              ...base,
              harmEvents: [drownHarm],
              statEffects: [{ stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' }],
              consequences: [{ type: 'add_calories' as const, amount: -250, source: 'swimming' }],
            };
          }
          return {
            ...base,
            harmEvents: [],
            statEffects: [{ stat: StatId.NOV, amount: 3, duration: 1, label: '+NOV' }, { stat: StatId.WIS, amount: 3, label: '+WIS' }],
            consequences: [{ type: 'add_calories' as const, amount: -150, source: 'swimming' }],
          };
        },
      },
      {
        id: 'wait-recede',
        label: 'Wait for waters to recede',
        description: 'Find cover nearby and wait. It may take time.',
        style: 'default' as const,
        narrativeResult: 'You back away from the churning water and find shelter among the willows. Time passes. The rain eases. The water drops, slowly, slowly, leaving a muddy wasteland of debris on the banks. When you finally cross, the creek is still swollen but passable.',
        modifyOutcome: (base) => ({
          ...base,
          harmEvents: [],
          statEffects: [{ stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }, { stat: StatId.WIS, amount: 2, label: '+WIS' }],
          consequences: [{ type: 'add_calories' as const, amount: -100, source: 'waiting' }],
        }),
      },
    ];
  },
};

const BARBED_WIRE: HazardProfile = {
  id: 'sim-barbed-wire',
  tags: ['danger', 'environmental', 'human'],
  requiredSources: [],

  extraPlausibility: (ctx) => ctx.currentNodeType === 'farmstead' || ctx.currentNodeType === 'plain' || ctx.currentNodeType === 'suburban',

  baseWeight: 0.012,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.currentNodeType === 'farmstead') mult *= 2;
    if (ctx.currentNodeType === 'suburban') mult *= 1.5;
    if (ctx.time.timeOfDay === 'night') mult *= 1.8;
    if (ctx.time.timeOfDay === 'dusk') mult *= 1.3;
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    if (loco < 80) mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
    { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
  ],
  harm: {
    sourceLabel: 'barbed wire lacerations',
    magnitudeRange: (ctx) => {
      const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
      return loco < 60 ? [30, 55] : [15, 35];
    },
    targetZones: ['front-legs', 'hind-legs', 'torso'],
    spread: 0.3,
    harmType: 'sharp',
  },
  narratives: [
    { text: 'The wire is invisible in the dark — a line of metal thorns strung between posts, designed for animals that know it is there. You hit it at speed, the barbs catching flesh and coat alike, and the more you struggle the deeper they bite.', timeOfDay: 'night' },
    { text: 'A fence materializes from the brush — not the wooden kind that blocks your path, but a thin, cruel line of twisted wire hung with barbs that catch the light. You are too close to stop.' },
  ],
  clinicalDetail: 'Barbed wire entanglement. Sharp lacerations to limbs and torso.',
  emotionalTone: 'surprise',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    if (loco >= 70) return []; // healthy deer clear fence, no meaningful choice
    return [
      {
        id: 'force-through',
        label: 'Force through',
        description: 'Power through the wire. It will hurt.',
        style: 'danger' as const,
        narrativeResult: 'You surge forward, feeling the barbs drag across your flanks and legs, tearing coat and skin. The pain is sharp and immediate but you push through, leaving tufts of fur and drops of blood on the wire behind you.',
        modifyOutcome: (base) => base, // default harm applies
      },
      {
        id: 'find-gap',
        label: 'Search for a gap',
        description: 'Look for a break in the wire. Costs energy.',
        style: 'default' as const,
        narrativeResult: 'You pace along the fence line, testing, probing, until you find a section where the wire sags low enough to step over carefully—',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.6)) {
            return { ...base, harmEvents: [], consequences: [{ type: 'add_calories' as const, amount: -20, source: 'searching' }] };
          }
          return base; // couldn't find gap, takes default harm
        },
      },
    ];
  },
};

const ICE_FALL_THROUGH: HazardProfile = {
  id: 'sim-ice-fall-through',
  tags: ['danger', 'environmental'],
  requiredSources: ['water'],

  extraPlausibility: (ctx) => ctx.time.season === 'winter',

  baseWeight: 0.008,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.currentNodeType === 'wetland') mult *= 1.5;
    // Early or late winter: thin ice
    if (ctx.time.monthIndex === 0 || ctx.time.monthIndex === 2) mult *= 2;
    return mult;
  },

  statEffects: [
    { stat: StatId.CLI, amount: 15, duration: 4, label: '+CLI' },
    { stat: StatId.TRA, amount: 10, duration: 3, label: '+TRA' },
  ],
  harm: {
    sourceLabel: 'ice water immersion',
    magnitudeRange: [20, 45],
    targetZones: ['front-legs', 'hind-legs', 'torso'],
    spread: 0.9,
    harmType: 'thermal-cold',
  },
  consequences: [{ type: 'modify_weight', amount: -2, source: 'ice fall hypothermia' }],
  narratives: [
    { text: 'The ice holds for three steps. On the fourth, it gives way with a sound like breaking bone and the black water swallows you to the chest. The cold is beyond anything you have ever felt — not pain, exactly, but a total, all-consuming seizure of every muscle in your body. Your legs churn uselessly in the dark water beneath the ice shelf.' },
  ],
  clinicalDetail: 'Fell through ice into frigid water. Severe hypothermia and drowning risk.',
  emotionalTone: 'fear',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    return [
      {
        id: 'break-ice-forward',
        label: 'Break ice forward',
        description: 'Smash through the ice toward the shore.',
        style: 'danger' as const,
        narrativeResult: 'You lunge forward, forelegs slamming onto the ice shelf, cracking it, pulling yourself up only to break through again. Each cycle drains more heat, more energy—',
        modifyOutcome: (base, innerCtx) => {
          const escapeChance = 0.5 + loco * 0.004;
          if (innerCtx.rng.chance(escapeChance)) {
            return { ...base, consequences: [{ type: 'add_calories' as const, amount: -200, source: 'ice escape' }] };
          }
          return { ...base, consequences: [{ type: 'death' as const, cause: 'Drowned after falling through ice' }] };
        },
      },
      {
        id: 'scramble-back',
        label: 'Scramble back the way you came',
        description: 'The ice behind you held your weight once.',
        style: 'default' as const,
        narrativeResult: 'You turn in the water, pawing at the ice edge behind you. It cracks, holds, cracks again—',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.65)) {
            return { ...base, consequences: [{ type: 'add_calories' as const, amount: -150, source: 'ice escape' }] };
          }
          return {
            ...base,
            harmEvents: base.harmEvents.map(h => ({ ...h, magnitude: Math.round(h.magnitude * 1.5) })),
            consequences: [{ type: 'add_calories' as const, amount: -250, source: 'prolonged ice exposure' }],
          };
        },
      },
    ];
  },
};

const MUD_TRAP: HazardProfile = {
  id: 'sim-mud-trap',
  tags: ['danger', 'environmental'],
  requiredSources: [],

  extraPlausibility: (ctx) => ctx.time.season === 'spring' && (ctx.currentNodeType === 'water' || ctx.currentNodeType === 'wetland'),

  baseWeight: 0.01,
  situationWeightModifiers(ctx, situations) {
    let mult = 1.0;
    if (ctx.currentNodeType === 'wetland') mult *= 2;
    const locoSit = situations.find(s => s.type === 'body-impairment' && s.source === 'locomotion');
    if (locoSit) mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' },
    { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
  ],
  harm: {
    sourceLabel: 'mud trap strain',
    magnitudeRange: [10, 30],
    targetZones: ['hind-legs', 'front-legs'],
    spread: 0.2,
    harmType: 'blunt',
  },
  narratives: [
    { text: 'The ground deceives you. What looked like solid earth gives way to a sucking, clinging mire that seizes your legs and pulls you down with every struggle. The mud is cold and deep and it does not let go easily.' },
  ],
  clinicalDetail: 'Trapped in deep mud. Exhaustion and soft tissue strain.',
  emotionalTone: 'tension',

  choices(ctx) {
    const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    return [
      {
        id: 'thrash-free',
        label: 'Thrash and struggle',
        description: 'Fight your way out with brute force.',
        style: 'danger' as const,
        narrativeResult: 'You thrash wildly, panic lending strength to your legs, churning the mud into a frothy mess—',
        modifyOutcome: (base, innerCtx) => {
          const freeChance = 0.6 + loco * 0.003;
          if (innerCtx.rng.chance(freeChance)) {
            return { ...base, consequences: [{ type: 'add_calories' as const, amount: -150, source: 'mud escape' }] };
          }
          return {
            ...base,
            harmEvents: base.harmEvents.map(h => ({ ...h, magnitude: Math.round(h.magnitude * 1.5) })),
            consequences: [{ type: 'add_calories' as const, amount: -300, source: 'extended mud struggle' }],
          };
        },
      },
      {
        id: 'calm-and-shift',
        label: 'Stay calm, shift weight carefully',
        description: 'Slow, deliberate movements. Let the mud release you.',
        style: 'default' as const,
        narrativeResult: 'You force yourself still. The panic subsides enough for instinct to take over — slow, rocking movements, one leg at a time, letting the suction break before pulling free. It takes an eternity, but it works.',
        modifyOutcome: (base) => ({
          ...base,
          harmEvents: [],
          statEffects: [{ stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' }, { stat: StatId.WIS, amount: 2, label: '+WIS' }],
          consequences: [{ type: 'add_calories' as const, amount: -100, source: 'careful escape' }],
        }),
      },
    ];
  },
};

// ── Registry ──

export const HAZARD_PROFILES: Record<string, HazardProfile> = {
  'fall-hazard': FALL_HAZARD,
  'blizzard-exposure': BLIZZARD_EXPOSURE,
  'vehicle-strike': VEHICLE_STRIKE,
  'forest-fire': FOREST_FIRE,
  'flooding-creek': FLOODING_CREEK,
  'barbed-wire': BARBED_WIRE,
  'ice-fall-through': ICE_FALL_THROUGH,
  'mud-trap': MUD_TRAP,
};

export { resolveHarmFromProfile };
