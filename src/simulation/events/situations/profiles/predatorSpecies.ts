import type { ChaseParams, FightParams } from '../../../interactions/types';
import type { NarrativeEntity } from '../../../narrative/types';
import type { StatEffect } from '../../../../types/events';
import type { ContextualFragment } from '../../../narrative/templates/shared';
import type { SimulationContext } from '../../types';
import type { SimulationChoice } from '../../types';
import { StatId } from '../../../../types/stats';
import { wolfEntity, coyoteEntity, cougarEntity, hunterEntity } from '../../../narrative/perspective';
import {
  WOLF_ENCOUNTER_NARRATIVES,
  COUGAR_ENCOUNTER_NARRATIVES,
  HUNTER_ENCOUNTER_NARRATIVES,
} from '../../../narrative/templates/predator';

// ══════════════════════════════════════════════════
//  PREDATOR SPECIES PROFILES
// ══════════════════════════════════════════════════
//
// Each profile describes a predator species' abstract properties:
//   - calibration mapping (mortality cause ID, rate fraction)
//   - interaction parameters (chase, fight)
//   - plausibility constraints
//   - weight modifiers (how situations affect encounter probability)
//   - narrative fragment pools
//   - choice templates
//
// The predator InteractionTemplate uses these profiles to
// resolve encounters without needing per-species triggers.
//

/** Resolution type for a player choice */
export type ChoiceResolutionType = 'chase' | 'fight' | 'freeze' | 'concealment' | 'water-chase';

/** Template for a player choice, parameterized by resolution type */
export interface PredatorChoiceProfile {
  id: string;
  label: string | ((ctx: SimulationContext) => string);
  description: string | ((ctx: SimulationContext) => string);
  style: string | ((ctx: SimulationContext) => string);
  narrativeResult: string | ((ctx: SimulationContext) => string);
  resolutionType: ChoiceResolutionType;
  chaseParamsOverride?: Partial<ChaseParams>;
  fightParams?: FightParams;
  statEffects?: StatEffect[];
  available?: (ctx: SimulationContext) => boolean;
}

/** Full species profile for a predator */
export interface PredatorSpeciesProfile {
  /** Species label for NPC matching (lowercase) */
  speciesLabel: string;
  /** Calibration cause ID for mortality rate lookup */
  calibrationCauseId: string;
  /** Threat map key in world memory */
  threatMapKey: string;
  /** Rate fraction of calibrated cause (e.g., coyote = 0.4 of canid rate) */
  rateFraction: number;
  /** Fallback weight when no calibrated rates are available */
  fallbackWeight: number;
  /** Tags for behavioral multiplier system */
  tags: string[];

  // ── Plausibility ──
  /** Ecosystem population key to check */
  populationKey?: string;
  /** Minimum population level for encounter */
  minPopulationLevel?: number;
  /** Only fires when prey is vulnerable (young, injured, impaired) */
  requiresPreyVulnerability?: boolean;
  /** Max prey age for vulnerability check */
  maxPreyAge?: number;
  /** Max prey locomotion for vulnerability check */
  maxPreyLocomotion?: number;
  /** Seasons this predator is active (undefined = all) */
  seasons?: string[];
  /** Max month index for seasonal cutoff */
  maxMonthIndex?: number;

  // ── Weight modifiers (how situations adjust probability) ──
  /** Base multiplier from time of day */
  timeMultipliers: Partial<Record<string, number>>;
  /** Base multiplier from terrain */
  terrainMultipliers: Partial<Record<string, number>>;
  /** Base multiplier from weather */
  weatherMultipliers: Partial<Record<string, number>>;
  /** Extra weight from locomotion impairment (0-1 factor) */
  locomotionImpairmentFactor: number;
  /** Extra weight from vision impairment (0-1 factor) */
  visionImpairmentFactor: number;
  /** Multiplier when open wounds present */
  openWoundMultiplier: number;
  /** Multiplier when NPC is nearby and hunting */
  npcHuntingMultiplier: number;
  /** Whether this predator revisits kill sites */
  nodeKillAttraction: boolean;
  /** Whether recent encounters increase return rate */
  threatMapPersistence: boolean;
  /** Turns within which recent encounters boost rate */
  threatMapWindow?: number;
  /** Multiplier for threat persistence */
  threatMapMultiplier?: number;

  // ── Interaction params ──
  chaseParams: ChaseParams;
  fightParams?: FightParams;

  // ── Narrative ──
  entityBuilder: (ctx?: SimulationContext) => NarrativeEntity;
  encounterStatEffects: StatEffect[];
  recurringStatEffects?: StatEffect[];
  emotionalTone: 'fear' | 'tension';
  narrativeEventType: string;
  /** ContextualFragment pool for full encounter narratives */
  encounterNarratives: ContextualFragment[];
  /** Clinical detail for debriefing */
  clinicalDetail: string;
  recurringClinicalDetail: string;

  // ── Choices ──
  choiceTemplates: PredatorChoiceProfile[];
}

// ── Species Profiles ──

export const PREDATOR_SPECIES: Record<string, PredatorSpeciesProfile> = {
  wolf: {
    speciesLabel: 'wolf',
    calibrationCauseId: 'predation-canid',
    threatMapKey: 'Gray Wolf',
    rateFraction: 1.0,
    fallbackWeight: 0.02,
    tags: ['predator', 'danger'],

    populationKey: 'Gray Wolf',
    minPopulationLevel: -1,

    timeMultipliers: { night: 1.5, dusk: 1.5 },
    terrainMultipliers: {},
    weatherMultipliers: { snow: 1.8, blizzard: 1.8 },
    locomotionImpairmentFactor: 0.5,
    visionImpairmentFactor: 0.3,
    openWoundMultiplier: 1.3,
    npcHuntingMultiplier: 3.0,
    nodeKillAttraction: true,
    threatMapPersistence: true,
    threatMapWindow: 4,
    threatMapMultiplier: 1.6,

    chaseParams: {
      predatorSpeed: 75,
      predatorEndurance: 90,
      packBonus: 25,
      strikeHarmType: 'sharp',
      strikeTargetZone: 'hind-legs',
      strikeMagnitudeRange: [35, 70],
      strikeLabel: 'wolf bite',
    },

    entityBuilder: () => wolfEntity(),
    encounterStatEffects: [
      { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
    ],
    recurringStatEffects: [
      { stat: StatId.TRA, amount: 12, duration: 4, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
    ],
    emotionalTone: 'fear',
    narrativeEventType: 'wolf-pack-pursuit',
    encounterNarratives: WOLF_ENCOUNTER_NARRATIVES,
    clinicalDetail: 'Wolf pack detected. Pack in pursuit formation.',
    recurringClinicalDetail: 'Recurring wolf pack encounter. Pack demonstrating learned hunting patterns.',

    choiceTemplates: [
      {
        id: 'flee',
        label: 'Run',
        description: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return `Sprint for cover. ${loco < 70 ? 'Your injured legs will slow you.' : 'Your legs are strong.'}`;
        },
        style: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco < 50 ? 'danger' : 'default';
        },
        narrativeResult: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco >= 70
            ? 'You explode into motion, hooves tearing at the earth. The forest blurs. Behind you, the pack gives chase — but your legs are sound and the fear drives you faster than they can follow. After an agonizing minute of all-out sprint, the sounds of pursuit fade.'
            : 'You run. You run with everything you have, but the ground betrays you — your gait is uneven, favoring the damaged leg, and each stride sends a lance of fire through your body. The wolves sense the weakness. They are gaining.';
        },
        resolutionType: 'chase',
        statEffects: [
          { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
        ],
      },
      {
        id: 'freeze',
        label: 'Freeze and watch',
        description: 'Hold perfectly still. Wolves track movement.',
        style: 'danger',
        narrativeResult: 'You freeze. Every instinct screams at you to run, but you lock your joints and hold, trembling, as the gray shapes circle. Their yellow eyes sweep across the clearing. One raises its nose, testing the air. For a long, terrible moment, the world is silent except for the sound of your own heartbeat hammering in your skull.',
        resolutionType: 'freeze',
        statEffects: [
          { stat: StatId.TRA, amount: 5, duration: 6, label: '+TRA' },
        ],
      },
      {
        id: 'water',
        label: 'Make for the water',
        description: (ctx) => {
          const isWinter = ctx.time.season === 'winter';
          return isWinter ? 'The river ice may hold your weight but not theirs.' : 'Wolves hesitate at deep water.';
        },
        style: 'danger',
        narrativeResult: (ctx) => {
          const isWinter = ctx.time.season === 'winter';
          return isWinter
            ? 'You bolt for the river. The ice groans beneath you, cracking in spiderweb patterns, but it holds — barely. Behind you, the lead wolf stops at the bank, paws testing the surface, then backs away. The others mill at the edge, whining. You stand on the far side, shaking, the cold already seeping through your hooves.'
            : 'You crash into the river, the shock of cold water hitting your chest like a fist. The current pulls at you but you kick hard, driving toward the far bank. Behind you, the wolves pace the shoreline, unwilling to follow into the deep water.';
        },
        resolutionType: 'water-chase',
        chaseParamsOverride: {
          predatorSpeed: 40,
          packBonus: 5,
          predatorEndurance: 40,
        },
        statEffects: [
          { stat: StatId.HOM, amount: 8, duration: 2, label: '+HOM' },
        ],
        // Water choice available when terrain has water or random chance in winter
        available: (ctx) => ctx.currentNodeType === 'water' || (ctx.time.season === 'winter' && ctx.rng.chance(0.3)),
      },
    ],
  },

  coyote: {
    speciesLabel: 'coyote',
    calibrationCauseId: 'predation-canid',
    threatMapKey: 'Coyote',
    rateFraction: 0.4,
    fallbackWeight: 0.01,
    tags: ['predator', 'danger'],

    requiresPreyVulnerability: true,
    maxPreyAge: 24,
    maxPreyLocomotion: 80,

    timeMultipliers: {},
    terrainMultipliers: {},
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0.5,
    visionImpairmentFactor: 0,
    openWoundMultiplier: 1.4,
    npcHuntingMultiplier: 2.5,
    nodeKillAttraction: false,
    threatMapPersistence: false,

    chaseParams: {
      predatorSpeed: 60,
      predatorEndurance: 55,
      packBonus: 8,
      strikeHarmType: 'sharp',
      strikeTargetZone: 'hind-legs',
      strikeMagnitudeRange: [20, 40],
      strikeLabel: 'coyote bite',
    },
    fightParams: {
      opponentStrength: 25,
      opponentWeight: 35,
      opponentWeaponType: 'sharp',
      opponentTargetZone: 'hind-legs',
      opponentDamageRange: [20, 40],
      opponentStrikeLabel: 'coyote bite',
      engagementType: 'strike',
      canDisengage: true,
      mutual: false,
    },

    entityBuilder: () => coyoteEntity(),
    encounterStatEffects: [
      { stat: StatId.TRA, amount: 4, duration: 3, label: '+TRA' },
      { stat: StatId.ADV, amount: 3, duration: 2, label: '+ADV' },
    ],
    emotionalTone: 'tension',
    narrativeEventType: 'coyote-stalk',
    encounterNarratives: [
      { text: 'A pair of shapes shadows you through the brush — smaller than wolves, rangier, more tentative. Coyotes. They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls to each other carry an edge of patient hunger.' },
    ],
    clinicalDetail: 'Coyote pair shadowing deer, assessing vulnerability. Opportunistic predation behavior.',
    recurringClinicalDetail: 'Coyote pair shadowing deer, assessing vulnerability. Opportunistic predation behavior.',

    choiceTemplates: [
      {
        id: 'stand-tall',
        label: 'Stand your ground',
        description: 'Face them directly. You are larger than they are.',
        style: 'default',
        narrativeResult: 'You turn to face them, ears forward, hooves planted. At your full height, you tower over them. The coyotes slow, exchange a glance, and melt back into the underbrush. Not worth the risk. Not today.',
        resolutionType: 'fight',
        statEffects: [],
      },
      {
        id: 'bolt',
        label: 'Bolt immediately',
        description: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return `Don't give them a chance to close in.${loco < 70 ? ' Your legs may betray you.' : ''}`;
        },
        style: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco < 60 ? 'danger' : 'default';
        },
        narrativeResult: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco >= 70
            ? 'You leap away before they can close the gap, crashing through the brush at full speed. The coyotes give a half-hearted chase but break off quickly — an uninjured adult deer is simply too fast.'
            : 'You run, but your stride is wrong — hitching, labored. The coyotes sense it instantly and close the distance with alarming speed. One darts in, snapping at your heels.';
        },
        resolutionType: 'chase',
        statEffects: [
          { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
        ],
      },
    ],
  },

  cougar: {
    speciesLabel: 'cougar',
    calibrationCauseId: 'predation-felid',
    threatMapKey: 'Cougar',
    rateFraction: 1.0,
    fallbackWeight: 0.008,
    tags: ['predator', 'danger'],

    populationKey: 'Cougar',
    minPopulationLevel: -1,

    timeMultipliers: { dusk: 2 },
    terrainMultipliers: { forest: 1.5, mountain: 1.5 },
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0,
    visionImpairmentFactor: 0.8,
    openWoundMultiplier: 1.25,
    npcHuntingMultiplier: 3.0,
    nodeKillAttraction: false,
    threatMapPersistence: false,

    chaseParams: {
      predatorSpeed: 85,
      predatorEndurance: 30,
      packBonus: 0,
      strikeHarmType: 'sharp',
      strikeTargetZone: 'neck',
      strikeMagnitudeRange: [50, 85],
      strikeLabel: 'cougar bite',
    },
    fightParams: {
      opponentStrength: 70,
      opponentWeight: 140,
      opponentWeaponType: 'sharp',
      opponentTargetZone: 'neck',
      opponentDamageRange: [60, 90],
      opponentStrikeLabel: 'cougar bite to neck',
      engagementType: 'strike',
      canDisengage: true,
      mutual: false,
    },

    entityBuilder: () => cougarEntity(),
    encounterStatEffects: [
      { stat: StatId.TRA, amount: 12, duration: 5, label: '+TRA' },
      { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' },
    ],
    emotionalTone: 'fear',
    narrativeEventType: 'cougar-ambush',
    encounterNarratives: COUGAR_ENCOUNTER_NARRATIVES,
    clinicalDetail: 'Cougar ambush. Felid targeting cervical vertebrae — standard kill technique.',
    recurringClinicalDetail: 'Cougar ambush. Felid targeting cervical vertebrae — standard kill technique.',

    choiceTemplates: [
      {
        id: 'dodge-bolt',
        label: 'Dodge and bolt',
        description: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return `Twist away from the lunge and sprint.${loco < 60 ? ' Your legs may fail you.' : ''}`;
        },
        style: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco < 50 ? 'danger' : 'default';
        },
        narrativeResult: (ctx) => {
          const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
          return loco >= 60
            ? 'Instinct saves you. You jerk sideways in the fraction of a second before impact, and the great cat\'s claws rake across your shoulder instead of closing on your throat. You run — not looking back, not thinking, just running — and the distance opens.'
            : 'You try to twist away but your body doesn\'t respond fast enough. Claws tear across your flank as the weight of the cat drives you sideways. You stumble but keep your feet and run, the hot breath fading behind you.';
        },
        resolutionType: 'chase',
        statEffects: [
          { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
        ],
      },
      {
        id: 'rear-kick',
        label: 'Rear up and kick',
        description: 'Fight back with your hooves. Dangerous but can deter the cat.',
        style: 'danger',
        narrativeResult: 'You rear up, lashing out with your front hooves as the great cat closes. A hoof connects — you feel the solid thud of impact against the cat\'s skull. It recoils, shaking its head, stunned for a moment. You use the opening to put distance between you.',
        resolutionType: 'fight',
        statEffects: [
          { stat: StatId.ADV, amount: 6, duration: 3, label: '+ADV' },
        ],
      },
    ],
  },

  hunter: {
    speciesLabel: 'hunter',
    calibrationCauseId: 'hunting',
    threatMapKey: 'Human Hunter',
    rateFraction: 1.0,
    fallbackWeight: 0.01,
    tags: ['predator', 'danger', 'human'],

    seasons: ['autumn', 'winter'],
    maxMonthIndex: 1,

    timeMultipliers: {},
    terrainMultipliers: {},
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0,
    visionImpairmentFactor: 0,
    openWoundMultiplier: 1.0,
    npcHuntingMultiplier: 1.0,
    nodeKillAttraction: false,
    threatMapPersistence: true,
    threatMapWindow: 5,
    threatMapMultiplier: 1.4,

    chaseParams: {
      predatorSpeed: 0,
      predatorEndurance: 0,
      packBonus: 0,
      strikeHarmType: 'sharp',
      strikeTargetZone: 'torso',
      strikeMagnitudeRange: [95, 95],
      strikeLabel: 'rifle bullet',
    },

    entityBuilder: () => hunterEntity(),
    encounterStatEffects: [
      { stat: StatId.TRA, amount: 10, duration: 4, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, duration: 3, label: '+NOV' },
    ],
    emotionalTone: 'fear',
    narrativeEventType: 'hunting-season',
    encounterNarratives: HUNTER_ENCOUNTER_NARRATIVES,
    clinicalDetail: 'Rifle fire detected during hunting season. Deer in active hunting zone.',
    recurringClinicalDetail: 'Rifle fire in hunting season. Repeat encounter in established blind area.',

    choiceTemplates: [
      {
        id: 'flee-deep-cover',
        label: 'Flee to dense cover',
        description: 'Run for the thickest brush you can find.',
        style: 'default',
        narrativeResult: 'You plunge into the densest thicket you can find, thorns raking your flanks as you force your way through the tangled undergrowth. The crashing sounds of pursuit do not follow — the brush is too thick. You stand panting in the green darkness, heart hammering, listening.',
        resolutionType: 'concealment',
        statEffects: [
          { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
        ],
      },
      {
        id: 'hold-position',
        label: 'Hold in the brush',
        description: 'Stay low and motionless. Hunters look for movement.',
        style: 'default',
        narrativeResult: 'You sink into the brush, lowering your body until your belly nearly touches the ground. Every muscle trembles with the effort of stillness. The orange shapes move past, footsteps crunching on dry leaves. They do not see you. This time.',
        resolutionType: 'concealment',
        statEffects: [],
      },
    ],
  },
};

/**
 * Look up a species profile from a predator NPC's speciesLabel.
 * Falls back to matching by substring for labels like "Gray Wolf".
 */
export function findSpeciesProfile(speciesLabel: string): PredatorSpeciesProfile | undefined {
  const lower = speciesLabel.toLowerCase();
  // Direct match
  if (PREDATOR_SPECIES[lower]) return PREDATOR_SPECIES[lower];
  // Substring match
  for (const [key, profile] of Object.entries(PREDATOR_SPECIES)) {
    if (lower.includes(key) || lower.includes(profile.speciesLabel)) return profile;
  }
  return undefined;
}
