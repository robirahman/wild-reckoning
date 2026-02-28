import type { SimulationContext, SimulationChoice, SimulationOutcome } from '../types';
import type { StatEffect, Consequence } from '../../../types/events';
import type { NarrativeEntity } from '../../narrative/types';
import { StatId } from '../../../types/stats';
import { resolveSocial } from '../../interactions/social';
import { resolveFight } from '../../interactions/fight';
import { buildEnvironment } from '../../narrative/contextBuilder';
import { pickContextualText, toFragmentContext } from '../../narrative/templates/shared';
import {
  HERD_ALARM_NARRATIVES,
  BACHELOR_GROUP_NARRATIVES,
  DOE_HIERARCHY_NARRATIVES,
  FAWN_PLAY_NARRATIVES,
  TERRITORIAL_NARRATIVES,
  YEARLING_DISPERSAL_NARRATIVES,
} from '../../narrative/templates/social';

// ── Config Types ──

/** Plausibility conditions for social triggers */
export interface SocialPlausibility {
  /** Required animal sex (undefined = any) */
  sex?: 'male' | 'female';
  /** Required seasons (undefined = all) */
  seasons?: string[];
  /** Minimum age in months */
  minAge?: number;
  /** Maximum age in months */
  maxAge?: number;
  /** Required flags (all must be present) */
  requiredFlags?: string[];
  /** Blocking flags (any blocks the trigger) */
  blockingFlags?: string[];
  /** Custom plausibility check */
  custom?: (ctx: SimulationContext) => boolean;
}

/** Weight computation parameters */
export interface SocialWeightParams {
  /** Base weight */
  base: number;
  /** Multiplier for specific terrain */
  terrainMultipliers?: Partial<Record<string, number>>;
  /** Season multipliers */
  seasonMultipliers?: Partial<Record<string, number>>;
  /** Sociability behavior factor: base multiplied by (0.5 + sociability * factor) */
  sociabilityFactor?: number;
  /** Belligerence behavior factor: base multiplied by (0.5 + belligerence * factor) */
  belligerenceFactor?: number;
  /** Caution behavior factor: base multiplied by (0.5 + caution * factor) */
  cautionFactor?: number;
  /** Age threshold for young-animal bonus */
  youngAgeThreshold?: number;
  /** Multiplier when animal is below young age threshold */
  youngAgeMultiplier?: number;
  /** Flags that reduce weight (flag name -> multiplier) */
  flagMultipliers?: Record<string, number>;
  /** Custom weight adjustment */
  custom?: (ctx: SimulationContext, base: number) => number;
}

/** Narrative builder output */
export interface SocialNarrativeOutput {
  /** Full narrative text */
  text: string;
  /** Entities for narrative context */
  entities: NarrativeEntity[];
  /** Action detail (animal-perspective) */
  actionDetail: string;
  /** Clinical detail (for debriefing) */
  clinicalDetail: string;
  /** Intensity of the action */
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  /** Emotional tone */
  emotionalTone: 'fear' | 'tension' | 'calm' | 'relief' | 'aggression';
}

/** Full configuration for a data-driven social trigger */
export interface SocialTriggerConfig {
  id: string;
  category: 'social';
  tags: string[];

  plausibility: SocialPlausibility;
  weight: SocialWeightParams;

  /** Base stat effects on resolve (before choices) */
  statEffects: StatEffect[] | ((ctx: SimulationContext) => StatEffect[]);
  /** Base consequences on resolve */
  consequences: Consequence[] | ((ctx: SimulationContext) => Consequence[]);

  /** Narrative builder */
  narrative: (ctx: SimulationContext) => SocialNarrativeOutput;

  /** Choice builder (returns empty array for passive events) */
  choices: (ctx: SimulationContext) => SimulationChoice[];
}

// ══════════════════════════════════════════════════
//  1. HERD ALARM
// ══════════════════════════════════════════════════

export const HERD_ALARM_CONFIG: SocialTriggerConfig = {
  id: 'sim-herd-alarm',
  category: 'social',
  tags: ['social', 'herd', 'alarm'],

  plausibility: {
    custom(ctx) {
      const hasAlly = ctx.npcs?.some((n) => n.type === 'ally' && n.alive);
      return hasAlly || ctx.behavior.sociability >= 3;
    },
  },

  weight: {
    base: 0.04,
    terrainMultipliers: { plain: 1.5 },
    cautionFactor: 0.15,
  },

  statEffects: [],
  consequences: [],

  narrative(ctx) {
    const allyName = ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.name ?? 'A doe nearby';
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(HERD_ALARM_NARRATIVES, fragmentCtx, ctx.rng);
    return {
      text,
      entities: [{ perceivedAs: `${allyName}'s alarm snort`, actualIdentity: `${allyName} (herd member) alarm signaling`, wisdomThreshold: 0, primarySense: 'sound' }],
      actionDetail: `${allyName} snorts — a sharp, percussive exhalation. The white flag of her tail goes up and she bolts. The signal cascades through every deer within earshot.`,
      clinicalDetail: `Herd alarm response initiated by ${allyName}. Conspecific alarm snort detected; flight response triggered.`,
      intensity: 'high',
      emotionalTone: 'fear',
    };
  },

  choices(ctx) {
    const groupSize = (ctx.npcs?.filter((n) => (n.type === 'ally' || n.type === 'mate') && n.alive).length ?? 0) + 1;

    // These imports are deferred to the factory via callback
    return [
      {
        id: 'follow-alarm',
        label: 'Follow the alarm and bolt',
        description: 'Trust the signal. Run first, assess later.',
        style: 'default' as const,
        narrativeResult: 'You launch yourself into motion without thought, matching the herd\'s trajectory through the trees. The alarm was real — behind you, something large crashes through the brush where you stood moments ago. The herd\'s collective vigilance saved you the critical seconds you needed.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          // resolveSocial is imported in the factory module
          const social = resolveSocial(innerCtx, {
            interactionType: 'alarm-response',
            groupSize,
          });
          return {
            ...base,
            statEffects: social.statEffects,
            consequences: [
              { type: 'add_calories' as const, amount: -10, source: 'alarm-sprint' },
            ],
            footnote: '(Herd alarm — escaped)',
          };
        },
      },
      {
        id: 'assess-alarm',
        label: 'Pause and assess the threat',
        description: 'Sometimes alarms are false. But sometimes they aren\'t.',
        style: 'default' as const,
        narrativeResult: 'You freeze rather than flee, scanning the tree line for the source of the alarm. Long seconds tick past. Your heart hammers. The other deer are already gone, their white tails vanishing into the undergrowth. You are alone, exposed, trying to read the forest for whatever triggered the panic.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          // 20% chance the threat was real and you're now exposed
          const threatened = innerCtx.rng.chance(0.2);
          return {
            ...base,
            statEffects: threatened
              ? [{ stat: StatId.TRA, amount: 6, duration: 2, label: '+TRA' }, { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }]
              : [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.TRA, amount: -2, label: '-TRA' }],
            consequences: [],
            footnote: threatened ? '(The threat was real)' : '(False alarm — good judgment)',
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  2. BACHELOR GROUP
// ══════════════════════════════════════════════════

export const BACHELOR_GROUP_CONFIG: SocialTriggerConfig = {
  id: 'sim-bachelor-group',
  category: 'social',
  tags: ['social', 'herd', 'seasonal'],

  plausibility: {
    sex: 'male',
    seasons: ['spring', 'summer'],
  },

  weight: {
    base: 0.03,
    sociabilityFactor: 0.2,
    youngAgeThreshold: 36,
    youngAgeMultiplier: 1.5,
  },

  statEffects: [
    { stat: StatId.TRA, amount: -3, label: '-TRA' },
    { stat: StatId.ADV, amount: -2, label: '-ADV' },
    { stat: StatId.WIS, amount: 2, label: '+WIS' },
  ],
  consequences: [],

  narrative(ctx) {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(BACHELOR_GROUP_NARRATIVES, fragmentCtx, ctx.rng);
    return {
      text,
      entities: [{ perceivedAs: 'three other bucks with velvet antlers', actualIdentity: 'bachelor group of 3 male deer', wisdomThreshold: 0, primarySense: 'sight' }],
      actionDetail: 'Three other bucks grazing in a clearing. Summer brotherhood — no aggression. One assesses you and returns to feeding. You are accepted.',
      clinicalDetail: 'Joined bachelor group. Non-agonistic male social bonding during summer antler growth period.',
      intensity: 'low',
      emotionalTone: 'calm',
    };
  },

  choices() {
    return []; // Passive event
  },
};

// ══════════════════════════════════════════════════
//  3. DOE HIERARCHY
// ══════════════════════════════════════════════════

export const DOE_HIERARCHY_CONFIG: SocialTriggerConfig = {
  id: 'sim-doe-hierarchy',
  category: 'social',
  tags: ['social', 'herd', 'hierarchy', 'female-competition'],

  plausibility: {
    sex: 'female',
    blockingFlags: ['challenged-doe-hierarchy'],
  },

  weight: {
    base: 0.02,
    seasonMultipliers: { spring: 2 },
    belligerenceFactor: 0.2,
  },

  statEffects: [{ stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }],
  consequences: [],

  narrative(ctx) {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(DOE_HIERARCHY_NARRATIVES, fragmentCtx, ctx.rng);
    return {
      text,
      entities: [{ perceivedAs: 'an older doe with scars, posture broadcasting challenge', actualIdentity: 'dominant doe, hierarchical challenge for fawning territory', wisdomThreshold: 0, primarySense: 'sight' }],
      actionDetail: 'She stops three body lengths away and stares, ears pinned back, one hoof pawing the ground. Yield, or be made to yield.',
      clinicalDetail: 'Female dominance challenge. Intraspecific competition for fawning territory access.',
      intensity: 'medium',
      emotionalTone: 'aggression',
    };
  },

  choices(_ctx) {
    return [
      {
        id: 'challenge-doe',
        label: 'Stand your ground and challenge',
        description: 'Contest the hierarchy. Winner gets prime fawning territory.',
        style: 'default' as const,
        narrativeResult: 'You mirror her posture — ears back, head high, weight forward. For a long, tense moment you stare at each other. Then she lunges, rearing up on hind legs, forelegs striking. You meet her, hooves clashing, and the contest becomes a shoving, kicking scramble for dominance.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          const won = social.rankChange > 0;
          return {
            ...base,
            harmEvents: social.harmEvents,
            statEffects: social.statEffects,
            consequences: [
              { type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' as const },
              ...(won ? [{ type: 'set_flag' as const, flag: 'nest-quality-prime' as const }] : []),
            ],
            footnote: won ? '(Won — prime fawning territory)' : '(Lost the challenge)',
          };
        },
      },
      {
        id: 'yield-doe',
        label: 'Yield to the dominant doe',
        description: 'Accept subordinate status. Safer, but poorer fawning ground.',
        style: 'default' as const,
        narrativeResult: 'You break eye contact and turn aside, ceding the ground. The dominant doe watches you go, satisfied, and reclaims the clearing with a proprietary air. You will find fawning cover elsewhere — not the best, but adequate. Some fights are not worth the injuries.',
        modifyOutcome(base: SimulationOutcome) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              { type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' as const },
              { type: 'set_flag' as const, flag: 'nest-quality-poor' as const },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  4. FAWN PLAY
// ══════════════════════════════════════════════════

export const FAWN_PLAY_CONFIG: SocialTriggerConfig = {
  id: 'sim-fawn-play',
  category: 'social',
  tags: ['social', 'psychological', 'fawn'],

  plausibility: {
    seasons: ['spring', 'summer'],
    requiredFlags: ['has-fawns'],
  },

  weight: {
    base: 0.04,
  },

  statEffects: [
    { stat: StatId.TRA, amount: -4, label: '-TRA' },
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.NOV, amount: -2, label: '-NOV' },
  ],
  consequences: [],

  narrative(ctx) {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(FAWN_PLAY_NARRATIVES, fragmentCtx, ctx.rng);
    return {
      text,
      entities: [{ perceivedAs: 'your fawns chasing each other through tall grass', actualIdentity: 'offspring play behavior', wisdomThreshold: 0, primarySense: 'sight' }],
      actionDetail: 'Your fawns chase each other in looping sprints, white spots flashing in dappled light. They are alive, and they are yours.',
      clinicalDetail: 'Fawn play behavior observed. Locomotive play bouts indicating healthy development and adequate nutrition.',
      intensity: 'low',
      emotionalTone: 'relief',
    };
  },

  choices() {
    return []; // Passive event
  },
};

// ══════════════════════════════════════════════════
//  5. TERRITORIAL SCRAPE
// ══════════════════════════════════════════════════

export const TERRITORIAL_SCRAPE_CONFIG: SocialTriggerConfig = {
  id: 'sim-territorial-scrape',
  category: 'social',
  tags: ['social', 'territorial', 'rut'],

  plausibility: {
    sex: 'male',
    seasons: ['autumn'],
    minAge: 18,
  },

  weight: {
    base: 0.04,
    belligerenceFactor: 0.2,
    flagMultipliers: { 'territorial-scrape-active': 0.5 },
  },

  statEffects: [
    { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
    { stat: StatId.NOV, amount: -3, label: '-NOV' },
  ],
  consequences: [
    { type: 'set_flag' as const, flag: 'territorial-scrape-active' as const },
    { type: 'add_calories' as const, amount: -8, source: 'territorial-scraping' },
  ],

  narrative(ctx) {
    const env = buildEnvironment(ctx);
    const fragmentCtx = toFragmentContext(env);
    const text = pickContextualText(TERRITORIAL_NARRATIVES, fragmentCtx, ctx.rng);
    return {
      text,
      entities: [],
      actionDetail: 'You find a low-hanging branch and work it with your antlers. Then paw the earth into a bare oval. Every buck within half a mile will know you were here.',
      clinicalDetail: 'Territorial marking behavior. Antler rub on overhanging branch, ground scrape with tarsal gland scent deposition. Chemical signaling to conspecific males.',
      intensity: 'low',
      emotionalTone: 'aggression',
    };
  },

  choices() {
    return []; // Instinct-driven, not a choice event
  },
};

// ══════════════════════════════════════════════════
//  6. RIVAL RETURNS
// ══════════════════════════════════════════════════

export const RIVAL_RETURNS_CONFIG: SocialTriggerConfig = {
  id: 'sim-rival-returns',
  category: 'social',
  tags: ['social', 'confrontation', 'territorial'],

  plausibility: {
    sex: 'male',
    seasons: ['autumn', 'winter'],
    custom(ctx) {
      const hasRival = ctx.npcs?.some((n) => n.type === 'rival' && n.alive);
      return !!hasRival;
    },
  },

  weight: {
    base: 0.03,
    belligerenceFactor: 0.2,
    seasonMultipliers: { autumn: 2 },
  },

  statEffects: [
    { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
    { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
  ],
  consequences: [],

  narrative(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'The rival buck';
    return {
      text: `You smell ${rivalName} before you see the buck — that distinctive musk, sharp and aggressive, carried on the wind like a declaration of war. Then the shape materializes between the trees: familiar scarred rack, thick neck, the same contemptuous stare. The buck has been here before. This is not the first time, and something in the set of the rival's shoulders says it won't be the last.`,
      entities: [], // rivalBuckEntity is handled in the factory
      actionDetail: `${rivalName} materializes between the trees: familiar scarred rack, thick neck, the same contemptuous stare. This is not the first time.`,
      clinicalDetail: `Recurring rival encounter. ${rivalName} returning to contested territory during rut.`,
      intensity: 'high',
      emotionalTone: 'aggression',
    };
  },

  choices(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'the rival';
    const rivalWeight = ctx.rng.int(100, 180);
    const rivalStrength = 40 + rivalWeight * 0.1 + ctx.rng.int(-5, 5);

    return [
      {
        id: 'confront-rival',
        label: 'Charge and confront',
        description: `Meet ${rivalName} head-on.${ctx.animal.weight > rivalWeight ? ' You outweigh the rival.' : ''}`,
        style: (ctx.animal.weight < rivalWeight * 0.8 ? 'danger' : 'default') as 'default' | 'danger',
        narrativeResult: `You lower your antlers and close the distance. ${rivalName} meets you without flinching — the crack of antler on antler echoes through the forest. This is personal now.`,
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const fight = resolveFight(innerCtx, {
            opponentStrength: rivalStrength,
            opponentWeight: rivalWeight,
            opponentWeaponType: 'blunt',
            opponentTargetZone: innerCtx.rng.pick(['head', 'neck', 'front-legs'] as const),
            opponentDamageRange: [30, 60],
            opponentStrikeLabel: 'antler strike',
            engagementType: 'charge',
            canDisengage: true,
            mutual: true,
          });

          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: fight.won
              ? [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' }]
              : [{ stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' }],
            consequences: [
              { type: 'set_flag' as const, flag: 'fought-rut-rival' as const },
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rival-fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
            footnote: fight.won ? `(Defeated ${rivalName})` : `(Lost to ${rivalName})`,
          };
        },
      },
      {
        id: 'display-rival',
        label: 'Posture and display',
        description: 'Show your size without committing to combat.',
        style: 'default' as const,
        narrativeResult: `You turn broadside, presenting the full span of your rack, muscles tensed, neck arched. ${rivalName} evaluates you with cold calculation.`,
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          const won = social.rankChange > 0;
          return {
            ...base,
            harmEvents: social.harmEvents,
            statEffects: social.statEffects,
            consequences: [],
            footnote: won ? `(${rivalName} backed down)` : `(${rivalName} wasn't impressed)`,
          };
        },
      },
      {
        id: 'yield-rival',
        label: 'Yield the ground',
        description: 'Turn away. Live to fight another day.',
        style: 'default' as const,
        narrativeResult: `You break eye contact and drift back into the trees. ${rivalName} watches you go, claiming the clearing without a blow. Discretion. Not cowardice. That's what you tell yourself.`,
        modifyOutcome(base: SimulationOutcome) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' },
              { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
            ],
            consequences: [
              { type: 'set_flag' as const, flag: 'lost-rut-contest' as const },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  7. ALLY WARNS
// ══════════════════════════════════════════════════

export const ALLY_WARNS_CONFIG: SocialTriggerConfig = {
  id: 'sim-ally-warns',
  category: 'social',
  tags: ['social', 'herd'],

  plausibility: {
    custom(ctx) {
      const hasAlly = ctx.npcs?.some((n) => n.type === 'ally' && n.alive);
      return !!hasAlly;
    },
  },

  weight: {
    base: 0.025,
    custom(ctx, base) {
      const ally = ctx.npcs?.find((n) => n.type === 'ally' && n.alive);
      if (ally && ally.encounters > 5) return base * 1.3;
      return base;
    },
  },

  statEffects: [
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.TRA, amount: -2, label: '-TRA' },
    { stat: StatId.WIS, amount: 3, label: '+WIS' },
  ],
  consequences: [],

  narrative(ctx) {
    const allyName = ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.name ?? 'Your companion';
    return {
      text: `${allyName} freezes mid-step, head cocked, one ear swiveled hard to the left. You know this posture. You've learned to trust it. The doe's body language is subtle but unmistakable to anyone who has traveled with her: danger, that direction, close. She doesn't bolt — not yet — but the slight shift of her weight onto her hind legs tells you she's ready. Without the warning, you would have walked straight into whatever she's detected.`,
      entities: [{ perceivedAs: `${allyName} frozen mid-step, ear swiveled`, actualIdentity: `${allyName} (ally) early warning signal`, wisdomThreshold: 0, primarySense: 'sight' }],
      actionDetail: `${allyName} freezes mid-step, body language unmistakable: danger, that direction, close. Without the warning, you would have walked straight into it.`,
      clinicalDetail: `Ally early warning. ${allyName} detected threat and communicated via body language, preventing direct encounter.`,
      intensity: 'medium',
      emotionalTone: 'tension',
    };
  },

  choices() {
    return []; // Passive — the ally warns, you benefit
  },
};

// ══════════════════════════════════════════════════
//  8. YEARLING DISPERSAL
// ══════════════════════════════════════════════════

export const YEARLING_DISPERSAL_CONFIG: SocialTriggerConfig = {
  id: 'sim-yearling-dispersal',
  category: 'social',
  tags: ['social'],

  plausibility: {
    sex: 'male',
    minAge: 12,
    maxAge: 24,
    blockingFlags: ['dispersal-begun', 'dispersal-settled'],
  },

  weight: {
    base: 0.03,
    seasonMultipliers: { autumn: 1.5 },
    custom(ctx, base) {
      let w = base;
      if (ctx.animal.age >= 18) w *= 2;
      if (ctx.animal.flags?.has?.('dispersal-pressure')) w *= 2;
      return w;
    },
  },

  statEffects: [
    { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' },
    { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
  ],
  consequences(ctx) {
    const hasDispersalPressure = ctx.animal.flags?.has?.('dispersal-pressure');
    return hasDispersalPressure
      ? []
      : [{ type: 'set_flag' as const, flag: 'dispersal-pressure' as const }];
  },

  narrative(ctx) {
    const hasDispersalPressure = ctx.animal.flags?.has?.('dispersal-pressure');

    let text: string;
    if (hasDispersalPressure) {
      text = 'The dominant buck finds you in the cedar thicket and there is nothing casual about the approach. Head low, ears pinned, moving with the coiled deliberation of an animal about to attack. The message has moved beyond chemical signals and body language — this is a physical eviction. You are not welcome here anymore. The home range that sheltered you since birth has become hostile territory.';
    } else {
      const env = buildEnvironment(ctx);
      const fragmentCtx = toFragmentContext(env);
      text = pickContextualText(YEARLING_DISPERSAL_NARRATIVES, fragmentCtx, ctx.rng);
    }

    return {
      text,
      entities: [],
      actionDetail: text,
      clinicalDetail: hasDispersalPressure
        ? 'Forced dispersal. Dominant buck physically evicting yearling male from natal range.'
        : 'Dispersal instinct onset. Yearling male experiencing restlessness and conspecific aggression signaling need to establish new range.',
      intensity: hasDispersalPressure ? 'high' : 'medium',
      emotionalTone: hasDispersalPressure ? 'fear' : 'tension',
    };
  },

  choices(ctx) {
    const hasDispersalPressure = ctx.animal.flags?.has?.('dispersal-pressure');

    if (!hasDispersalPressure) {
      // First encounter: internal struggle, no forced action
      return [
        {
          id: 'resist-dispersal',
          label: 'Resist the urge to leave',
          description: 'Cling to the familiar. The pressure will only grow.',
          style: 'default' as const,
          narrativeResult: 'You press yourself deeper into the thicket, refusing to acknowledge the chemical imperative in your blood. This is home. You were born here. Every trail, every bedding site, every water source is mapped in your memory. Leaving feels like dying.',
          modifyOutcome(base: SimulationOutcome) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
              ],
            };
          },
        },
        {
          id: 'accept-dispersal',
          label: 'Accept the restlessness',
          description: 'Begin to scout unfamiliar territory.',
          style: 'default' as const,
          narrativeResult: 'You stop fighting it. The next morning, instead of following the familiar trails, you turn north — into country you have never explored. Every step takes you further from everything you know. The forest smells different here. The fear is real, but so is the exhilaration.',
          modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
            const { resolveSocial } = require('../../interactions/social');
            const social = resolveSocial(innerCtx, {
              interactionType: 'dispersal',
              groupSize: 1,
            });
            return {
              ...base,
              harmEvents: social.harmEvents,
              statEffects: social.statEffects,
              consequences: [
                ...social.flagsToSet.map((f: string) => ({ type: 'set_flag' as const, flag: f })),
                ...social.flagsToRemove.map((f: string) => ({ type: 'remove_flag' as const, flag: f })),
                { type: 'add_calories' as const, amount: -20, source: 'dispersal-travel' },
              ],
            };
          },
        },
      ];
    }

    // Second encounter (with pressure): forced dispersal
    return [
      {
        id: 'leave-home',
        label: 'Leave your home range',
        description: 'The dominant buck leaves you no choice.',
        style: 'default' as const,
        narrativeResult: 'The charge catches you off-guard — a blur of antlers and fury that sends you stumbling backwards. You don\'t fight. You can\'t. This is a full-grown buck in rut, and you are a yearling who weighs thirty pounds less. You run, and you keep running, past the boundary markers you\'ve known your whole life, into unfamiliar forest.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dispersal',
            groupSize: 1,
          });
          return {
            ...base,
            harmEvents: [
              ...social.harmEvents,
              {
                id: `dispersal-charge-${innerCtx.time.turn}`,
                sourceLabel: 'dominant buck charge',
                magnitude: innerCtx.rng.int(15, 30),
                targetZone: innerCtx.rng.pick(['torso', 'hind-legs'] as const),
                spread: 0.3,
                harmType: 'blunt' as const,
              },
            ],
            statEffects: social.statEffects,
            consequences: [
              ...social.flagsToSet.map((f: string) => ({ type: 'set_flag' as const, flag: f })),
              ...social.flagsToRemove.map((f: string) => ({ type: 'remove_flag' as const, flag: f })),
              { type: 'add_calories' as const, amount: -25, source: 'forced-dispersal' },
            ],
          };
        },
      },
      {
        id: 'fight-dominant',
        label: 'Stand and fight the dominant buck',
        description: 'A desperate, likely futile stand.',
        style: 'danger' as const,
        narrativeResult: 'Something snaps inside you — not courage exactly, but a refusal to be driven like prey. You wheel to face the charging buck, lowering your small antlers. The impact is devastating.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const fight = resolveFight(innerCtx, {
            opponentStrength: 60,
            opponentWeight: innerCtx.rng.int(140, 200),
            opponentWeaponType: 'blunt',
            opponentTargetZone: innerCtx.rng.pick(['head', 'neck', 'torso'] as const),
            opponentDamageRange: [40, 70],
            opponentStrikeLabel: 'dominant buck charge',
            engagementType: 'charge',
            canDisengage: true,
            mutual: true,
          });

          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: fight.won
              ? [{ stat: StatId.WIS, amount: 5, label: '+WIS' }, { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' }]
              : [{ stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' }, { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' }],
            consequences: [
              { type: 'set_flag' as const, flag: 'dispersal-begun' as const },
              { type: 'remove_flag' as const, flag: 'dispersal-pressure' as const },
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'dispersal-fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
            footnote: fight.won ? '(Stood your ground — barely)' : '(Defeated and driven out)',
          };
        },
      },
    ];
  },
};
