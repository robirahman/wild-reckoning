import type { StatEffect } from '../../../../types/events';
import type { ContextualFragment } from '../../../narrative/templates/shared';
import type { SimulationContext, SimulationChoice } from '../../types';
import type { Situation } from '../types';
import { StatId } from '../../../../types/stats';
import { resolveFight } from '../../../interactions/fight';
import { resolveSocial } from '../../../interactions/social';

// ══════════════════════════════════════════════════
//  SOCIAL INTERACTION PROFILES
// ══════════════════════════════════════════════════

export interface SocialProfile {
  id: string;
  tags: string[];

  /** Sex filter (undefined = any) */
  sex?: 'male' | 'female';
  /** Season filter (undefined = any) */
  seasons?: string[];
  /** Min/max age in months */
  minAge?: number;
  maxAge?: number;
  /** Required game flags */
  requiredFlags?: string[];
  /** Blocking game flags */
  blockingFlags?: string[];
  /** Additional plausibility */
  extraPlausibility?: (ctx: SimulationContext) => boolean;

  /** Requires a conspecific NPC nearby */
  requiresConspecific?: boolean;
  /** Required conspecific NPC types */
  conspecificTypes?: string[];

  /** Base weight */
  baseWeight: number;
  /** Weight modifier based on situations */
  situationWeightModifiers?: (ctx: SimulationContext, situations: Situation[]) => number;

  /** Base stat effects (for passive events with no choices) */
  statEffects: StatEffect[];
  /** Narrative pool */
  narratives: ContextualFragment[];
  /** Clinical detail */
  clinicalDetail: string;
  /** Emotional tone */
  emotionalTone: 'calm' | 'tension' | 'fear' | 'joy' | 'aggression';

  /** Player choices (undefined = passive event) */
  choices?: (ctx: SimulationContext, situations: Situation[]) => SimulationChoice[];
}

// ── Social Profiles ──

const HERD_ALARM: SocialProfile = {
  id: 'sim-herd-alarm',
  tags: ['social', 'danger'],
  requiresConspecific: true,

  extraPlausibility: (ctx) => {
    const hasAlly = ctx.npcs?.some(n => n.alive && n.type === 'ally');
    return !!hasAlly || ctx.behavior.sociability >= 3;
  },

  baseWeight: 0.04,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.currentNodeType === 'plain') mult *= 1.5;
    mult *= 0.5 + ctx.behavior.caution * 0.15;
    return mult;
  },

  statEffects: [],
  narratives: [
    { text: 'A sharp snort from your companion — the kind that makes every muscle lock. Her tail rises like a white flag, and she bolts. The alarm ripples through the group like an electric current: heads up, ears forward, bodies coiled to run. Something is wrong. You cannot see what, but every deer around you is already moving.', terrain: 'open' },
    { text: 'The doe beside you freezes mid-step, one foreleg raised, head swiveled toward the tree line. Then the alarm snort — explosive, urgent — and the herd erupts into motion around you.' },
  ],
  clinicalDetail: 'Herd alarm response triggered by conspecific detection of threat.',
  emotionalTone: 'fear',

  choices(_ctx) {
    return [
      {
        id: 'follow-alarm',
        label: 'Follow the herd',
        description: 'Trust the alarm and run with the group.',
        style: 'default' as const,
        narrativeResult: 'You bolt with the herd, hooves thundering in unison, the safety of numbers surrounding you as you pour across the meadow toward the distant tree line.',
        modifyOutcome: (base) => ({
          ...base,
          consequences: [{ type: 'add_calories' as const, amount: -10, source: 'alarm sprint' }],
        }),
      },
      {
        id: 'assess-alarm',
        label: 'Stop and assess',
        description: 'Hold your ground and look for the threat yourself.',
        style: 'danger' as const,
        narrativeResult: 'You hold while the others flee, ears straining, nostrils flared, scanning the tree line for whatever set them off—',
        modifyOutcome: (base, innerCtx) => {
          if (innerCtx.rng.chance(0.2)) {
            return {
              ...base,
              statEffects: [{ stat: StatId.TRA, amount: 6, duration: 2, label: '+TRA' }, { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }],
            };
          }
          return {
            ...base,
            statEffects: [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.TRA, amount: -2, label: '-TRA' }],
          };
        },
      },
    ];
  },
};

const BACHELOR_GROUP: SocialProfile = {
  id: 'sim-bachelor-group',
  tags: ['social'],
  sex: 'male',
  seasons: ['spring', 'summer'],

  baseWeight: 0.03,
  situationWeightModifiers(ctx) {
    let mult = 0.5 + ctx.behavior.sociability * 0.2;
    if (ctx.animal.age <= 36) mult *= 1.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.TRA, amount: -3, label: '-TRA' },
    { stat: StatId.ADV, amount: -2, label: '-ADV' },
    { stat: StatId.WIS, amount: 2, label: '+WIS' },
  ],
  narratives: [
    { text: 'Three other bucks graze in the clearing ahead — young, like you, their velvet antlers catching the light. They lift their heads as you approach but do not flee. There is no challenge here, no posturing, just the quiet companionship of shared vulnerability. For a little while, the forest feels less vast.' },
  ],
  clinicalDetail: 'Bachelor group social bonding. Stress reduction through conspecific proximity.',
  emotionalTone: 'calm',
};

const DOE_HIERARCHY: SocialProfile = {
  id: 'sim-doe-hierarchy',
  tags: ['social', 'confrontation'],
  sex: 'female',
  blockingFlags: ['challenged-doe-hierarchy'],

  baseWeight: 0.02,
  situationWeightModifiers(ctx) {
    let mult = 0.5 + ctx.behavior.belligerence * 0.2;
    if (ctx.time.season === 'spring') mult *= 2;
    return mult;
  },

  statEffects: [{ stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }],
  narratives: [
    { text: 'The dominant doe approaches with stiff, deliberate steps, ears pinned flat against her skull. Her body language is unmistakable: this feeding ground is hers, and you are trespassing. She lowers her head and stamps, demanding submission or challenge.' },
  ],
  clinicalDetail: 'Doe hierarchy challenge. Dominance display for territory and feeding priority.',
  emotionalTone: 'tension',

  choices(_ctx) {
    return [
      {
        id: 'challenge-doe',
        label: 'Challenge her',
        description: 'Meet her display with your own. Winner gets the prime territory.',
        style: 'danger' as const,
        narrativeResult: 'You lower your head and step forward, matching her posture. For a long moment you stand nose to nose, the air electric with tension—',
        modifyOutcome: (base, innerCtx) => {
          const result = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          if (result.rankChange > 0) {
            return {
              ...base,
              statEffects: [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.ADV, amount: -3, label: '-ADV' }],
              consequences: [{ type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' }, { type: 'set_flag' as const, flag: 'nest-quality-prime' }],
            };
          }
          return {
            ...base,
            statEffects: [{ stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' }],
            consequences: [{ type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' }, { type: 'set_flag' as const, flag: 'nest-quality-poor' }],
          };
        },
      },
      {
        id: 'yield-doe',
        label: 'Yield',
        description: 'Lower your head and back away. Live to fight another day.',
        style: 'default' as const,
        narrativeResult: 'You lower your eyes and step back. The dominant doe watches you retreat, then returns to feeding as if you were never there.',
        modifyOutcome: (base) => ({
          ...base,
          statEffects: [{ stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' }, { stat: StatId.WIS, amount: 2, label: '+WIS' }],
          consequences: [{ type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' }, { type: 'set_flag' as const, flag: 'nest-quality-poor' }],
        }),
      },
    ];
  },
};

const FAWN_PLAY: SocialProfile = {
  id: 'sim-fawn-play',
  tags: ['social'],
  seasons: ['spring', 'summer'],
  requiredFlags: ['has-fawns'],

  baseWeight: 0.04,
  statEffects: [
    { stat: StatId.TRA, amount: -4, label: '-TRA' },
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.NOV, amount: -2, label: '-NOV' },
  ],
  narratives: [
    { text: 'Your fawns chase each other through the tall grass, leaping and twisting with the reckless energy of creatures who do not yet know what the world holds. Their spots catch the dappled light. For a moment, watching them, the weight of survival lifts from your shoulders.' },
  ],
  clinicalDetail: 'Fawn play behavior. Maternal stress reduction through offspring observation.',
  emotionalTone: 'joy',
};

const TERRITORIAL_SCRAPE: SocialProfile = {
  id: 'sim-territorial-scrape',
  tags: ['social', 'territorial'],
  sex: 'male',
  seasons: ['autumn'],
  minAge: 18,

  baseWeight: 0.04,
  situationWeightModifiers(ctx) {
    let mult = 0.5 + ctx.behavior.belligerence * 0.2;
    if (ctx.animal.flags.has('territorial-scrape-active')) mult *= 0.5;
    return mult;
  },

  statEffects: [
    { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
    { stat: StatId.NOV, amount: -3, label: '-NOV' },
  ],
  narratives: [
    { text: 'The urge is chemical and irresistible. You find a low-hanging branch and rake your antlers across it, stripping bark, leaving your scent in long, territorial gouges. Then you paw the earth beneath it, scraping down to bare soil, urinating on the exposed dirt. This ground is yours. The message is clear to anyone who passes.' },
  ],
  clinicalDetail: 'Territorial scraping behavior. Scent marking and antler rubbing during rut.',
  emotionalTone: 'aggression',
};

const RIVAL_RETURNS: SocialProfile = {
  id: 'sim-rival-returns',
  tags: ['social', 'confrontation', 'territorial'],
  sex: 'male',
  seasons: ['autumn', 'winter'],

  extraPlausibility: (ctx) => !!ctx.npcs?.some(n => n.alive && n.type === 'rival'),

  baseWeight: 0.03,
  situationWeightModifiers(ctx) {
    let mult = 0.5 + ctx.behavior.belligerence * 0.2;
    if (ctx.time.season === 'autumn') mult *= 2;
    return mult;
  },

  statEffects: [
    { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
    { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
  ],
  narratives: [
    { text: 'A familiar musk on the wind — the rival. He materializes from the timber with stiff-legged deliberation, antlers lowered just enough to signal intent. His flanks bear the scars of previous encounters, and his eyes hold the flat, unblinking focus of a buck who has fought before and is willing to fight again.' },
  ],
  clinicalDetail: 'Rival buck return. Intraspecific confrontation during rut.',
  emotionalTone: 'aggression',

  choices(ctx) {
    const rivalWeight = ctx.rng.int(100, 180);
    const rivalStrength = 40 + rivalWeight * 0.1 + ctx.rng.int(-5, 5);
    return [
      {
        id: 'confront-rival',
        label: 'Lower antlers and charge',
        description: 'Meet his challenge head-on.',
        style: 'danger' as const,
        narrativeResult: 'You lower your head and charge. The crash of antler against antler echoes through the forest—',
        modifyOutcome: (base, innerCtx) => {
          const fight = resolveFight(innerCtx, {
            opponentStrength: rivalStrength,
            opponentWeight: rivalWeight,
            opponentWeaponType: 'blunt',
            opponentTargetZone: ['head', 'neck', 'front-legs'][innerCtx.rng.int(0, 2)] as 'head' | 'neck' | 'front-legs',
            opponentDamageRange: [30, 60],
            opponentStrikeLabel: 'rival antler strike',
            engagementType: 'charge',
            canDisengage: false,
            mutual: true,
          });
          if (fight.won) {
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' }],
              consequences: [
                { type: 'set_flag' as const, flag: 'fought-rut-rival' },
                ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rut fight' }] : []),
              ],
            };
          }
          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: [{ stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' }],
            consequences: [
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rut fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
          };
        },
      },
      {
        id: 'display-rival',
        label: 'Posture and display',
        description: 'Try to intimidate without engaging.',
        style: 'default' as const,
        narrativeResult: 'You arch your neck and present your antlers at full spread, stamping the ground, making yourself as large and imposing as you can—',
        modifyOutcome: (base, innerCtx) => {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          if (social.rankChange > 0) {
            return { ...base, statEffects: [{ stat: StatId.WIS, amount: 2, label: '+WIS' }, { stat: StatId.TRA, amount: -3, label: '-TRA' }] };
          }
          return { ...base, statEffects: [{ stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }] };
        },
      },
      {
        id: 'yield-rival',
        label: 'Yield and withdraw',
        description: 'Back away. Discretion over valor.',
        style: 'default' as const,
        narrativeResult: 'You lower your antlers submissively and back away, step by careful step. The rival watches you go, nostrils flaring, but does not pursue.',
        modifyOutcome: (base) => ({
          ...base,
          statEffects: [{ stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' }, { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }],
        }),
      },
    ];
  },
};

const ALLY_WARNS: SocialProfile = {
  id: 'sim-ally-warns',
  tags: ['social'],

  extraPlausibility: (ctx) => !!ctx.npcs?.some(n => n.alive && n.type === 'ally'),

  baseWeight: 0.025,

  statEffects: [
    { stat: StatId.ADV, amount: -3, label: '-ADV' },
    { stat: StatId.TRA, amount: -2, label: '-TRA' },
    { stat: StatId.WIS, amount: 3, label: '+WIS' },
  ],
  narratives: [
    { text: 'Your companion freezes mid-stride, one ear swiveled toward the thicket. Her body tenses — not the explosive alarm-freeze, but the slower, more deliberate stillness of an experienced deer processing information. She has seen something you missed, heard something you didn\'t. When she relaxes, you find yourself scanning the shadows with new attention.' },
  ],
  clinicalDetail: 'Ally social learning. Threat detection transferred through conspecific observation.',
  emotionalTone: 'calm',
};

const YEARLING_DISPERSAL: SocialProfile = {
  id: 'sim-yearling-dispersal',
  tags: ['social', 'travel'],
  sex: 'male',
  minAge: 12,
  maxAge: 24,
  blockingFlags: ['dispersal-begun', 'dispersal-settled'],

  baseWeight: 0.03,
  situationWeightModifiers(ctx) {
    let mult = 1.0;
    if (ctx.time.season === 'autumn') mult *= 1.5;
    if (ctx.animal.age >= 18) mult *= 2;
    if (ctx.animal.flags.has('dispersal-pressure')) mult *= 2;
    return mult;
  },

  statEffects: [
    { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' },
    { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
  ],
  narratives: [
    { text: 'The dominant buck finds you again at the edge of the cedar stand. He approaches with lowered head and flattened ears, his body a wall of intent. There is no room for you here anymore — this territory belongs to him, and his tolerance has run out. The message is as old as the species: leave, or be driven out.' },
  ],
  clinicalDetail: 'Yearling dispersal pressure. Dominant male forcing subordinate dispersal.',
  emotionalTone: 'tension',

  choices(ctx) {
    const hasPressure = ctx.animal.flags.has('dispersal-pressure');
    if (!hasPressure) {
      return [
        {
          id: 'resist-dispersal',
          label: 'Resist the pressure',
          description: 'Stay in familiar territory despite the hostility.',
          style: 'default' as const,
          narrativeResult: 'You hold your ground, but the message is clear — this confrontation will come again, and next time it will be worse.',
          modifyOutcome: (base) => ({
            ...base,
            statEffects: [{ stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' }],
            consequences: [{ type: 'set_flag' as const, flag: 'dispersal-pressure' }],
          }),
        },
        {
          id: 'accept-dispersal',
          label: 'Accept and leave',
          description: 'The time has come. Strike out on your own.',
          style: 'default' as const,
          narrativeResult: 'You turn away from the only home you have known and walk into the unknown. The forest ahead is the same forest — the same trees, the same smells — and yet everything about it is different, because none of it is yours.',
          modifyOutcome: (base) => ({
            ...base,
            statEffects: [{ stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' }, { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' }],
            consequences: [{ type: 'set_flag' as const, flag: 'dispersal-begun' }, { type: 'add_calories' as const, amount: -20, source: 'dispersal travel' }],
          }),
        },
      ];
    }
    // Phase 2: forced dispersal
    return [
      {
        id: 'leave-home',
        label: 'Leave before it gets worse',
        description: 'The dominant buck won\'t ask again.',
        style: 'default' as const,
        narrativeResult: 'You lower your head and go. Behind you, the dominant buck watches until you are out of sight, then turns back to his territory. The world ahead is vast and unknown and entirely yours to survive in.',
        modifyOutcome: (base) => ({
          ...base,
          statEffects: [{ stat: StatId.NOV, amount: 10, duration: 3, label: '+NOV' }],
          consequences: [{ type: 'set_flag' as const, flag: 'dispersal-begun' }, { type: 'add_calories' as const, amount: -25, source: 'forced dispersal' }],
        }),
      },
      {
        id: 'fight-dominant',
        label: 'Fight the dominant buck',
        description: 'Challenge him for the right to stay. Risky.',
        style: 'danger' as const,
        narrativeResult: 'You lower your head and charge. The dominant buck meets you head-on—',
        modifyOutcome: (base, innerCtx) => {
          const domWeight = innerCtx.rng.int(140, 200);
          const fight = resolveFight(innerCtx, {
            opponentStrength: 60,
            opponentWeight: domWeight,
            opponentWeaponType: 'blunt',
            opponentTargetZone: ['head', 'neck', 'front-legs'][innerCtx.rng.int(0, 2)] as 'head' | 'neck' | 'front-legs',
            opponentDamageRange: [40, 70],
            opponentStrikeLabel: 'dominant buck antler strike',
            engagementType: 'charge',
            canDisengage: false,
            mutual: true,
          });
          if (fight.won) {
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [{ stat: StatId.WIS, amount: 5, label: '+WIS' }, { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' }],
              consequences: fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : [],
            };
          }
          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: [{ stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' }, { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' }],
            consequences: [
              { type: 'set_flag' as const, flag: 'dispersal-begun' },
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
          };
        },
      },
    ];
  },
};

// ── Registry ──

export const SOCIAL_PROFILES: Record<string, SocialProfile> = {
  'herd-alarm': HERD_ALARM,
  'bachelor-group': BACHELOR_GROUP,
  'doe-hierarchy': DOE_HIERARCHY,
  'fawn-play': FAWN_PLAY,
  'territorial-scrape': TERRITORIAL_SCRAPE,
  'rival-returns': RIVAL_RETURNS,
  'ally-warns': ALLY_WARNS,
  'yearling-dispersal': YEARLING_DISPERSAL,
};
