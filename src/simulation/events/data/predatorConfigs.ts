import type { ChaseParams, FightParams } from '../../interactions/types';
import type { HarmType } from '../../harm/types';
import type { BodyZone } from '../../anatomy/types';
import type { NarrativeEntity } from '../../narrative/types';
import type { StatEffect } from '../../../types/events';
import type { SimulationContext, SimulationChoice } from '../types';
import { StatId } from '../../../types/stats';
import { wolfEntity, coyoteEntity, cougarEntity, hunterEntity } from '../../narrative/perspective';

// ── Config Types ──

/** Narrative variants for a predator encounter, keyed by context */
export interface PredatorNarrativeVariant {
  /** When this variant applies */
  condition: 'winter-snow' | 'night-dusk' | 'default';
  /** Full narrative text (animal perspective) */
  narrative: string;
  /** Recurring variant (wolf pack seen before) */
  recurringNarrative: string;
  /** Short action detail for NarrativeContext */
  actionDetail: string;
  /** Recurring action detail */
  recurringActionDetail: string;
  /** Clinical description for debriefing */
  clinicalDetail: string;
  /** Recurring clinical detail */
  recurringClinicalDetail: string;
}

/** Template for a player choice in a predator encounter */
export interface PredatorChoiceTemplate {
  id: string;
  label: string | ((ctx: SimulationContext) => string);
  description: string | ((ctx: SimulationContext) => string);
  style: string | ((ctx: SimulationContext) => string);
  narrativeResult: string | ((ctx: SimulationContext) => string);
  /** How this choice modifies the outcome */
  resolutionType: 'chase' | 'fight' | 'freeze' | 'concealment' | 'water-chase';
  /** Override chase params for this specific choice (merged with encounter defaults) */
  chaseParamsOverride?: Partial<ChaseParams>;
  /** Fight params for fight-type choices */
  fightParams?: FightParams;
  /** Additional stat effects for this choice */
  statEffects?: StatEffect[];
  /** When this choice is available (undefined = always) */
  available?: (ctx: SimulationContext) => boolean;
}

/** Weight multipliers that modulate encounter probability */
export interface PredatorWeightModifiers {
  /** Multipliers by time of day */
  timeMultipliers: Partial<Record<string, number>>;
  /** Multipliers by terrain/node type */
  terrainMultipliers: Partial<Record<string, number>>;
  /** Multipliers by season */
  seasonMultipliers: Partial<Record<string, number>>;
  /** Multipliers by weather type */
  weatherMultipliers: Partial<Record<string, number>>;
  /** Extra weight per point of locomotion impairment (0-1 scale) */
  locomotionImpairmentFactor: number;
  /** Extra weight per point of vision impairment (0-1 scale) */
  visionImpairmentFactor: number;
  /** Multiplier when animal has open wounds (blood scent) */
  openWoundMultiplier: number;
  /** Multiplier when NPC of this species is nearby and hunting */
  npcHuntingMultiplier: number;
  /** Whether this predator revisits successful hunting nodes */
  nodeKillAttraction: boolean;
  /** Whether recent encounters increase return rate (pack persistence) */
  threatMapPersistence: boolean;
  /** Turns within which recent encounters boost rate */
  threatMapWindow?: number;
  /** Multiplier for threat persistence */
  threatMapMultiplier?: number;
}

/** Plausibility conditions for when this encounter can fire */
export interface PredatorPlausibility {
  /** Minimum ecosystem population level (-2 to +2) */
  minPopulationLevel?: number;
  /** Ecosystem population key to check */
  populationKey?: string;
  /** Required seasons (undefined = all) */
  seasons?: string[];
  /** Maximum season month index (e.g., winter month 1 for hunting season) */
  maxMonthIndex?: number;
  /** Only plausible if prey is vulnerable (young, injured, impaired) */
  requiresPreyVulnerability?: boolean;
  /** Max prey age in months for vulnerability check */
  maxPreyAge?: number;
  /** Max locomotion for vulnerability check */
  maxPreyLocomotion?: number;
}

/** Full configuration for a data-driven predator encounter */
export interface PredatorEncounterConfig {
  id: string;
  tags: string[];
  /** Species label for NPC matching */
  speciesLabel: string;
  /** Calibration cause ID for mortality rate lookup */
  calibrationCauseId: string;
  /** Threat map key for world memory */
  threatMapKey: string;
  /** Rate fraction of calibrated cause (e.g., coyote = 0.4 of canid rate) */
  rateFraction: number;
  /** Fallback weight if no calibrated rates available */
  fallbackWeight: number;

  plausibility: PredatorPlausibility;
  weightModifiers: PredatorWeightModifiers;

  /** Default chase parameters for this predator */
  chaseParams: ChaseParams;
  /** Default fight parameters (if standing ground is an option) */
  fightParams?: FightParams;

  /** Entity builder for narrative context */
  entityBuilder: (ctx?: SimulationContext) => NarrativeEntity;

  /** Base stat effects when the encounter is triggered (before choices) */
  encounterStatEffects: StatEffect[];
  /** Recurring encounter stat effects (overrides encounterStatEffects when recurring) */
  recurringStatEffects?: StatEffect[];

  /** Narrative variants ordered by priority (first matching wins) */
  narrativeVariants: PredatorNarrativeVariant[];
  /** Emotional tone for narrative context */
  emotionalTone: 'fear' | 'tension' | 'alarm';
  /** Event type for narrative context */
  narrativeEventType: string;

  /** Player choice templates */
  choiceTemplates: PredatorChoiceTemplate[];
}

// ── Deer Predator Configs ──

export const WOLF_PACK_CONFIG: PredatorEncounterConfig = {
  id: 'sim-wolf-pack',
  tags: ['predator', 'danger'],
  speciesLabel: 'wolf',
  calibrationCauseId: 'predation-canid',
  threatMapKey: 'Gray Wolf',
  rateFraction: 1.0,
  fallbackWeight: 0.02,

  plausibility: {
    populationKey: 'Gray Wolf',
    minPopulationLevel: -1,
  },

  weightModifiers: {
    timeMultipliers: { night: 1.5, dusk: 1.5 },
    terrainMultipliers: {},
    seasonMultipliers: {},
    weatherMultipliers: { snow: 1.8, blizzard: 1.8 },
    locomotionImpairmentFactor: 0.5,
    visionImpairmentFactor: 0.3,
    openWoundMultiplier: 1.3,
    npcHuntingMultiplier: 3.0,
    nodeKillAttraction: true,
    threatMapPersistence: true,
    threatMapWindow: 4,
    threatMapMultiplier: 1.6,
  },

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

  narrativeVariants: [
    {
      condition: 'winter-snow',
      narrative: 'The snow is deep and crusted, and your hooves punch through with every stride while the gray shapes behind you run on top of it. There are several of them — you can hear their panting, feel the vibration of their coordinated pursuit through the frozen ground. They have been herding you toward the river, where the ice may or may not hold your weight. Your lungs burn. Your legs are heavy. The gap is closing.',
      recurringNarrative: 'The same deep tracks in the crusted snow. The same acrid scent riding the wind. They are back — the gray shapes that have been shadowing you through this frozen landscape. Your hooves punch through the crust with every stride while they glide across the surface. They know your territory now. They know your weaknesses. The gap is closing.',
      actionDetail: 'The snow is deep and crusted, and your hooves punch through with every stride while they run on top of it. They have been herding you toward the river. Your lungs burn. The gap is closing.',
      recurringActionDetail: 'They are back. They know your territory now. Your hooves punch through the crust while they glide across. The gap is closing.',
      clinicalDetail: 'Wolf pack coordinated pursuit in deep snow. Deer at disadvantage — hooves punch through crust while wolves travel on surface. Pack herding toward river.',
      recurringClinicalDetail: 'Wolf pack return encounter. Pack has learned deer\'s range. Deep snow pursuit.',
    },
    {
      condition: 'night-dusk',
      narrative: 'You smell them before you see them — the sharp, acrid musk that makes every muscle in your body lock rigid. Gray shapes materialize from the tree line, low and deliberate, spreading in a loose arc. Their eyes catch the last light. They are not rushing. They do not need to.',
      recurringNarrative: 'That smell again. The sharp, acrid musk you know now — the one that makes your heart lurch before your mind catches up. You know what comes next. Gray shapes in the half-light, spreading in their patient arc. The same pack. The same deliberate hunger. They remember you, too.',
      actionDetail: 'They spread in a loose arc, low and deliberate. Their eyes catch the last light. They are not rushing. They do not need to.',
      recurringActionDetail: 'That smell again. The same pack. The same deliberate hunger. They remember you, too.',
      clinicalDetail: 'Wolf pack detected at dusk/night. Pack in pursuit formation, spreading to flank.',
      recurringClinicalDetail: 'Recurring wolf pack encounter at dusk/night. Pack exhibiting site fidelity to deer\'s range.',
    },
    {
      condition: 'default',
      narrative: 'A sound that isn\'t wind. A movement that isn\'t branch-sway. Your head snaps up and your nostrils flare, and then you see them — lean gray shapes flowing between the trunks, silent and purposeful. A hunting pack, already in formation, already committed.',
      recurringNarrative: 'You know the sound now — not wind, not branch-sway, but the soft pad of organized weight moving through undergrowth. Your body reacts before your mind does: head up, nostrils wide, muscles coiled. The same lean gray shapes flow between the trunks. They found you again.',
      actionDetail: 'They flow between the trunks, silent and purposeful. A hunting pack, already in formation, already committed.',
      recurringActionDetail: 'You know the sound now. The same lean gray shapes. They found you again.',
      clinicalDetail: 'Wolf pack detected during daylight. Pack already in hunting formation.',
      recurringClinicalDetail: 'Recurring wolf pack encounter. Pack demonstrating learned hunting patterns in this territory.',
    },
  ],

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
      available: (ctx) => ctx.currentNodeType === 'water' || (ctx.time.season === 'winter' && ctx.rng.chance(0.3)),
    },
  ],
};

export const COYOTE_CONFIG: PredatorEncounterConfig = {
  id: 'sim-coyote-stalker',
  tags: ['predator', 'danger'],
  speciesLabel: 'coyote',
  calibrationCauseId: 'predation-canid',
  threatMapKey: 'Coyote',
  rateFraction: 0.4,
  fallbackWeight: 0.01,

  plausibility: {
    requiresPreyVulnerability: true,
    maxPreyAge: 24,
    maxPreyLocomotion: 80,
  },

  weightModifiers: {
    timeMultipliers: {},
    terrainMultipliers: {},
    seasonMultipliers: {},
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0.5,
    visionImpairmentFactor: 0,
    openWoundMultiplier: 1.4,
    npcHuntingMultiplier: 2.5,
    nodeKillAttraction: false,
    threatMapPersistence: false,
  },

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

  narrativeVariants: [
    {
      condition: 'default',
      narrative: 'A pair of shapes shadows you through the brush — smaller than wolves, rangier, more tentative. Coyotes. They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls to each other carry an edge of patient hunger.',
      recurringNarrative: 'A pair of shapes shadows you through the brush — smaller than wolves, rangier, more tentative. Coyotes. They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls to each other carry an edge of patient hunger.',
      actionDetail: 'They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls carry an edge of patient hunger.',
      recurringActionDetail: 'They keep their distance, testing your awareness, waiting for a stumble or a moment of inattention. Their yipping calls carry an edge of patient hunger.',
      clinicalDetail: 'Coyote pair shadowing deer, maintaining distance and assessing vulnerability. Opportunistic predation behavior typical of injured or juvenile prey targeting.',
      recurringClinicalDetail: 'Coyote pair shadowing deer, maintaining distance and assessing vulnerability. Opportunistic predation behavior typical of injured or juvenile prey targeting.',
    },
  ],

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
};

export const COUGAR_CONFIG: PredatorEncounterConfig = {
  id: 'sim-cougar-ambush',
  tags: ['predator', 'danger'],
  speciesLabel: 'cougar',
  calibrationCauseId: 'predation-felid',
  threatMapKey: 'Cougar',
  rateFraction: 1.0,
  fallbackWeight: 0.008,

  plausibility: {
    populationKey: 'Cougar',
    minPopulationLevel: -1,
  },

  weightModifiers: {
    timeMultipliers: { dusk: 2 },
    terrainMultipliers: { forest: 1.5, mountain: 1.5 },
    seasonMultipliers: {},
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0,
    visionImpairmentFactor: 0.8,
    openWoundMultiplier: 1.25,
    npcHuntingMultiplier: 3.0,
    nodeKillAttraction: false,
    threatMapPersistence: false,
  },

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

  narrativeVariants: [
    {
      condition: 'default',
      narrative: 'Something is wrong. The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink. Then a tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
      recurringNarrative: 'Something is wrong. The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink. Then a tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
      actionDetail: 'A tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
      recurringActionDetail: 'A tawny shape launches from the rocks above, silent and enormous, all muscle and claw, aimed directly at your neck.',
      clinicalDetail: 'Cougar ambush from elevated position. Felid targeting cervical vertebrae — standard kill technique for large prey.',
      recurringClinicalDetail: 'Cougar ambush from elevated position. Felid targeting cervical vertebrae — standard kill technique for large prey.',
    },
  ],

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
};

export const HUNTING_CONFIG: PredatorEncounterConfig = {
  id: 'sim-hunting-season',
  tags: ['predator', 'danger', 'human'],
  speciesLabel: 'hunter',
  calibrationCauseId: 'hunting',
  threatMapKey: 'Human Hunter',
  rateFraction: 1.0,
  fallbackWeight: 0.01,

  plausibility: {
    seasons: ['autumn', 'winter'],
    maxMonthIndex: 1, // only first 2 months of winter
  },

  weightModifiers: {
    timeMultipliers: {},
    terrainMultipliers: {},
    seasonMultipliers: {},
    weatherMultipliers: {},
    locomotionImpairmentFactor: 0,
    visionImpairmentFactor: 0,
    openWoundMultiplier: 1.0,
    npcHuntingMultiplier: 1.0,
    nodeKillAttraction: false,
    threatMapPersistence: true,
    threatMapWindow: 5,
    threatMapMultiplier: 1.4,
  },

  chaseParams: {
    predatorSpeed: 0,   // not used — hunting is concealment-based
    predatorEndurance: 0,
    packBonus: 0,
    strikeHarmType: 'sharp',
    strikeTargetZone: 'random',
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

  narrativeVariants: [
    {
      condition: 'default',
      narrative: 'The forest changes in autumn. Strange smells drift between the trees — acrid, chemical, wrong. Bright shapes move where there should be stillness. Then the sound: a sharp, flat crack that splits the air and sends every bird screaming upward. Another follows, closer. The thunder comes from the direction of the ridge, where the trail narrows between two rock faces. Every instinct in your body locks onto a single imperative: move.',
      recurringNarrative: 'The forest changes in autumn. Strange smells drift between the trees — acrid, chemical, wrong. Bright shapes move where there should be stillness. Then the sound: a sharp, flat crack that splits the air and sends every bird screaming upward. Another follows, closer. The thunder comes from the direction of the ridge, where the trail narrows between two rock faces. Every instinct in your body locks onto a single imperative: move.',
      actionDetail: 'A sharp, flat crack splits the air and sends every bird screaming upward. Another follows, closer. Every instinct locks onto a single imperative: move.',
      recurringActionDetail: 'A sharp, flat crack splits the air and sends every bird screaming upward. Another follows, closer. Every instinct locks onto a single imperative: move.',
      clinicalDetail: 'Rifle fire detected during hunting season. Deer in active hunting zone.',
      recurringClinicalDetail: 'Rifle fire detected during hunting season. Deer in active hunting zone. Repeat encounter in established blind area.',
    },
  ],

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
};
