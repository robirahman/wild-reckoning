import type { SimulationContext, SimulationChoice } from '../types';
import type { StatEffect } from '../../../types/events';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';

// ── Migration Trigger Config ──

export interface MigrationTriggerConfig {
  id: string;
  category: string;
  tags: string[];

  /** Quick-check: given context, is this trigger plausible? */
  isPlausible: (ctx: SimulationContext) => boolean;

  /** Compute selection weight from context */
  computeWeight: (ctx: SimulationContext) => number;

  /** Build the resolve payload from context */
  buildResolve: (ctx: SimulationContext) => {
    statEffects: StatEffect[];
    consequences: any[];
    narrativeText: string;
    /** emotional tone for narrative context */
    emotionalTone: string;
    /** event type key for narrative context */
    eventType: string;
    /** short action narrative */
    actionNarrative: string;
    /** clinical detail for action */
    clinicalDetail: string;
    /** urgency level for action */
    urgency: 'low' | 'medium' | 'high';
  };

  /** Build choices from context */
  buildChoices: (ctx: SimulationContext) => SimulationChoice[];
}

// ══════════════════════════════════════════════════
//  WINTER YARD SCOUTING — autumn migration preparation
// ══════════════════════════════════════════════════

export const WINTER_YARD_SCOUT_CONFIG: MigrationTriggerConfig = {
  id: 'sim-winter-yard-scout',
  category: 'migration',
  tags: ['migration', 'exploration', 'seasonal'],

  isPlausible(ctx) {
    if (ctx.time.season !== 'autumn') return false;
    if (ctx.animal.flags.has('scouting-winter-yard')) return false;
    if (ctx.animal.flags.has('wintering-in-yard')) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.08;

    // Later autumn = more urgent
    if (ctx.time.monthIndex >= 10) base *= 2;

    // Frost weather pushes migration urge
    if (ctx.currentWeather?.type === 'frost') base *= 1.8;

    // Females with fawns are more motivated to find shelter
    if (ctx.animal.sex === 'female' && ctx.animal.flags.has('has-fawns')) base *= 1.5;

    return base;
  },

  buildResolve(ctx) {
    const hasFawns = ctx.animal.flags.has('has-fawns');

    return {
      statEffects: [
        { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
        { stat: StatId.WIS, amount: 3, label: '+WIS' },
      ],
      consequences: [],
      narrativeText: hasFawns
        ? 'The first killing frost settles in overnight, rimming the grass with white crystal. Something deep in your memory stirs — not a thought exactly, but a pull, a directional certainty inherited from your mother. The winter yard lies to the southwest, in the hemlock valley where generations of does have sheltered their fawns through the worst of winter. Your fawns are strong enough to travel now. The time has come to scout the route.'
        : 'The nights are growing cold with a speed that your body registers before your mind does. You find yourself drifting southwest during your daily wanderings, drawn by a memory that is not quite yours — a scent trail laid down by your mother, and her mother before her, leading to the traditional wintering grounds. The urge to scout the route is becoming difficult to ignore.',
      emotionalTone: 'tension',
      eventType: 'winter-yard-scout',
      actionNarrative: hasFawns
        ? 'Something deep in your memory stirs — a pull toward the hemlock valley. Your fawns are strong enough to travel. The time has come to scout the route.'
        : 'You find yourself drifting southwest, drawn by inherited memory. The urge to scout the route is becoming difficult to ignore.',
      clinicalDetail: `Autumn migration scouting initiated. ${hasFawns ? 'Female with fawns seeking traditional wintering grounds.' : 'Seasonal migration instinct onset, following matrilineal scent trail to traditional deer yard.'}`,
      urgency: 'low',
    };
  },

  buildChoices() {
    return [
      {
        id: 'follow-matriarch',
        label: 'Follow the ancestral route',
        description: 'The traditional path is known. Safer, but may be degraded.',
        style: 'default' as const,
        narrativeResult: 'You follow the scent-memory southwest, tracing paths beaten by generations of hooves. The route is familiar even though you may never have walked it — buried in the inherited map of your kind. The journey takes you through familiar territory, past landmarks your body recognizes even if your mind does not.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
              { stat: StatId.WIS, amount: 4, label: '+WIS' },
            ],
            consequences: [
              { type: 'set_flag' as const, flag: 'scouting-winter-yard' as any },
            ],
          };
        },
      },
      {
        id: 'explore-new',
        label: 'Scout a new route',
        description: 'Unknown territory. Riskier, but might find better shelter.',
        style: 'default' as const,
        narrativeResult: 'You break from the ancestral trail and push into unfamiliar ground. The forest here is different — the trees taller, the undergrowth thicker, the scent of other deer faint and old. You are mapping new territory, building your own knowledge. It is exhilarating and terrifying in equal measure.',
        modifyOutcome(base, innerCtx) {
          // Exploring unfamiliar territory has risks
          const roadCrossing = innerCtx.rng.chance(0.15);
          const consequences: any[] = [
            { type: 'set_flag' as const, flag: 'scouting-winter-yard' as any },
          ];

          if (roadCrossing) {
            consequences.push({ type: 'add_calories' as const, amount: -100, source: 'road crossing detour' });
          }

          return {
            ...base,
            statEffects: [
              { stat: StatId.NOV, amount: 7, duration: 3, label: '+NOV' },
              { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences,
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  TRAVEL HAZARDS — road crossing during migration
// ══════════════════════════════════════════════════

export const TRAVEL_HAZARDS_CONFIG: MigrationTriggerConfig = {
  id: 'sim-travel-hazards',
  category: 'migration',
  tags: ['migration', 'danger', 'travel'],

  isPlausible(ctx) {
    // Only fires during active migration (scouting or dispersal)
    return ctx.animal.flags.has('scouting-winter-yard') || ctx.animal.flags.has('dispersal-begun');
  },

  computeWeight(ctx) {
    let base = 0.05;

    // Night crossings are more dangerous but more likely
    if (ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk') base *= 2;

    // Autumn rut makes bucks reckless near roads
    if (ctx.animal.sex === 'male' && ctx.animal.flags.has('rut-active')) base *= 1.5;

    return base;
  },

  buildResolve(ctx) {
    const isNight = ctx.time.timeOfDay === 'night' || ctx.time.timeOfDay === 'dusk';

    return {
      statEffects: [
        { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
        { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: isNight
        ? 'The road appears suddenly — a flat, pale scar cutting through the forest. You can smell the asphalt, the rubber, the exhaust fumes that linger like a toxic fog. Headlights sweep through the trees at irregular intervals, each pair a fast-moving predator with no scent and no sound until it is upon you. The other side is twenty meters away. It might as well be twenty miles.'
        : 'The highway is a river of metal and noise. You stand at the tree line, every instinct screaming to cross — the wintering grounds are on the other side, you can smell the hemlocks from here — but the traffic is relentless. Cars, trucks, an eighteen-wheeler that shakes the ground as it passes. The gap between vehicles is your window, and it is closing fast.',
      emotionalTone: 'fear',
      eventType: 'travel-hazard-road',
      actionNarrative: isNight
        ? 'The road appears suddenly. Headlights sweep through the trees at irregular intervals. The other side is twenty meters away. It might as well be twenty miles.'
        : 'The highway is a river of metal and noise. The gap between vehicles is your window, and it is closing fast.',
      clinicalDetail: `Road crossing hazard during ${ctx.animal.flags.has('scouting-winter-yard') ? 'migration' : 'dispersal'}. ${isNight ? 'Night crossing — headlight disorientation risk.' : 'Daytime — heavy traffic volume.'}`,
      urgency: 'high',
    };
  },

  buildChoices(ctx) {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    const vision = ctx.animal.bodyState?.capabilities['vision'] ?? 100;

    return [
      {
        id: 'cross-now',
        label: 'Cross during the next gap',
        description: 'Sprint across. Speed is everything.',
        style: 'danger' as const,
        narrativeResult: 'You launch yourself forward the moment the road clears, hooves striking asphalt with a sound like gunshots. The far side seems impossibly far away. Headlights appear on the horizon, growing with terrifying speed. Your muscles burn, your lungs heave, and then — grass under your hooves, darkness around you, the road behind you. You made it. Barely.',
        modifyOutcome(base, innerCtx) {
          // Crossing success depends on locomotion and vision (timing)
          const crossSpeed = locomotion / 100;
          const timing = vision / 100;
          const hitChance = Math.max(0.02, 0.12 - crossSpeed * 0.05 - timing * 0.03);

          if (innerCtx.rng.chance(hitChance)) {
            // Vehicle strike during crossing
            return {
              ...base,
              harmEvents: [{
                id: `migration-vehicle-${innerCtx.time.turn}`,
                sourceLabel: 'vehicle strike during crossing',
                magnitude: innerCtx.rng.int(70, 130),
                targetZone: innerCtx.rng.pick(['torso', 'hind-legs', 'front-legs']),
                spread: 0.5,
                harmType: 'blunt' as const,
              }],
              statEffects: [
                { stat: StatId.TRA, amount: 15, duration: 5, label: '+TRA' },
                { stat: StatId.HOM, amount: 10, duration: 4, label: '+HOM' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: -200, source: 'vehicle impact trauma' },
              ],
            };
          }

          return {
            ...base,
            statEffects: [
              { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
              { stat: StatId.WIS, amount: 3, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -80, source: 'road sprint' },
            ],
          };
        },
      },
      {
        id: 'wait-dawn',
        label: 'Wait for a quieter time',
        description: 'Patience. The traffic will thin.',
        style: 'default' as const,
        narrativeResult: 'You settle into the brush at the road\'s edge and wait. Hours pass. The traffic thins as the night deepens, and finally — a long, silent gap. You cross in the dark, quickly but not desperately, and reach the far side without incident. The delay cost time and warmth, but you are alive and unbroken.',
        modifyOutcome(base, innerCtx) {
          // Waiting is safer but costs calories from cold exposure
          const exposure = resolveExposure(innerCtx, {
            type: 'cold',
            intensity: 0.3,
            shelterAvailable: true,
            shelterQuality: 0.3,
          });

          // Reduced hit chance
          const hitChance = 0.03;
          if (innerCtx.rng.chance(hitChance)) {
            return {
              ...base,
              harmEvents: [{
                id: `migration-vehicle-late-${innerCtx.time.turn}`,
                sourceLabel: 'clipped by vehicle',
                magnitude: innerCtx.rng.int(30, 60),
                targetZone: innerCtx.rng.pick(['hind-legs', 'torso']),
                spread: 0.3,
                harmType: 'blunt' as const,
              }],
              statEffects: [
                { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
              ],
              consequences: [],
            };
          }

          return {
            ...base,
            harmEvents: exposure.harmEvents,
            statEffects: [
              { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              ...(exposure.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -exposure.caloriesCost, source: 'waiting at roadside' }] : []),
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  SPRING RETURN — migration back to summer range
// ══════════════════════════════════════════════════

export const SPRING_RETURN_CONFIG: MigrationTriggerConfig = {
  id: 'sim-spring-return',
  category: 'migration',
  tags: ['migration', 'seasonal'],

  isPlausible(ctx) {
    if (ctx.time.season !== 'spring') return false;
    if (!ctx.animal.flags.has('wintering-in-yard')) return false;
    return true;
  },

  computeWeight() {
    // Guaranteed to fire in spring if wintering
    return 0.2;
  },

  buildResolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    const conditionNarrative = bcs >= 3
      ? 'You are thinner than autumn, but the core of your strength survived the winter. The journey home will restore what the yard took.'
      : bcs >= 2
        ? 'Winter has hollowed you out. Your ribs are visible, your haunches gaunt. But the green is calling, and with it, the promise of recovery.'
        : 'You are barely alive. The winter yard\'s browse ran out weeks ago, and you have been surviving on bark and dry leaves. The walk north may be the last thing you do — but staying is certain death.';

    return {
      statEffects: [
        { stat: StatId.CLI, amount: -5, label: '-CLI' },
        { stat: StatId.TRA, amount: -5, label: '-TRA' },
        { stat: StatId.ADV, amount: -4, label: '-ADV' },
        { stat: StatId.WIS, amount: 3, label: '+WIS' },
      ],
      consequences: [
        { type: 'remove_flag', flag: 'wintering-in-yard' as any },
        { type: 'remove_flag', flag: 'scouting-winter-yard' as any },
      ],
      narrativeText: `The snow is retreating. What was belly-deep a month ago is now patchy and grey, undermined by the warming earth. The packed trails of the winter yard, trodden by dozens of hooves into hard-packed ice, are turning to slush. And from the north, carried on a warm wind, comes the scent of green — new growth, tender shoots, the first herbs pushing through the thawing soil. The pull is irresistible. One by one, the deer begin to drift away from the yard, following the retreating snow line northward to the summer range. ${conditionNarrative}`,
      emotionalTone: bcs <= 1 ? 'tension' : 'relief',
      eventType: 'spring-return',
      actionNarrative: `The snow is retreating. From the north comes the scent of green. The pull is irresistible. ${conditionNarrative}`,
      clinicalDetail: `Spring migration from winter yard to summer range. BCS: ${bcs}/5. ${bcs <= 1 ? 'Critical condition — may not survive journey.' : bcs <= 2 ? 'Poor condition — recovery dependent on spring forage.' : 'Adequate condition for return journey.'}`,
      urgency: bcs <= 1 ? 'high' : 'low',
    };
  },

  buildChoices() {
    return []; // Spring return is not optional — the yard is exhausted
  },
};
