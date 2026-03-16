import type { ChaseParams, FightParams } from '../../interactions/types';
import type { NarrativeEntity } from '../../narrative/types';
import type { StatEffect } from '../../../types/events';
import type { SimulationContext } from '../types';
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
  emotionalTone: 'fear' | 'tension';
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
      narrative: 'Your hooves punch through crust. Theirs do not. Panting behind you, several sets of lungs. The gap between their smell and your back legs is shrinking.',
      recurringNarrative: 'That urine-on-snow smell again. Your hooves punch through crust. Theirs do not. They know this ground now. The gap is shrinking.',
      actionDetail: 'Your hooves punch through crust. Theirs do not. The gap is shrinking.',
      recurringActionDetail: 'That smell again. They know this ground. The gap is shrinking.',
      clinicalDetail: 'Wolf pack coordinated pursuit in deep snow. Deer at disadvantage — hooves punch through crust while wolves travel on surface. Pack herding toward river.',
      recurringClinicalDetail: 'Wolf pack return encounter. Pack has learned deer\'s range. Deep snow pursuit.',
    },
    {
      condition: 'night-dusk',
      narrative: 'Musk smell, sharp and close. Your legs lock. Gray shapes low against the dark tree line, fanning wide. Their eyes hold the last light. They are not running yet.',
      recurringNarrative: 'That musk again. Your legs lock before you see them. Gray shapes fanning wide in the half-light. The same ones. They are not running yet.',
      actionDetail: 'Gray shapes fanning wide against the dark tree line. Their eyes hold the last light. They are not running yet.',
      recurringActionDetail: 'That musk again. The same ones, fanning wide. They are not running yet.',
      clinicalDetail: 'Wolf pack detected at dusk/night. Pack in pursuit formation, spreading to flank.',
      recurringClinicalDetail: 'Recurring wolf pack encounter at dusk/night. Pack exhibiting site fidelity to deer\'s range.',
    },
    {
      condition: 'default',
      narrative: 'A soft pad of weight on leaves. Your head snaps up, nostrils wide. Gray shapes between the trunks, moving together, already spread into a line.',
      recurringNarrative: 'That soft padding again. Your head snaps up before you think. Gray shapes between the trunks, the same ones. They found this ground again.',
      actionDetail: 'Gray shapes between the trunks, moving together, already spread into a line.',
      recurringActionDetail: 'That soft padding again. The same gray shapes. They found this ground again.',
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
        return `Sprint for cover. ${loco < 70 ? 'Your legs are wrong.' : 'Your legs are sound.'}`;
      },
      style: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco < 50 ? 'danger' : 'default';
      },
      narrativeResult: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco >= 70
          ? 'Your hindquarters fire. Hooves tear earth. Wind in your ears, then just your own breathing. The panting behind you fades.'
          : 'You run but the bad leg hitches. Each stride jolts through your spine. The panting behind you is not fading.';
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
      narrativeResult: 'Your joints lock. You hold, trembling. The gray shapes circle. One lifts its nose, testing the air. Your heartbeat pounds in your ears.',
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
        return isWinter ? 'The ice may hold your weight but not theirs.' : 'Deep water. They will not follow.';
      },
      style: 'danger',
      narrativeResult: (ctx) => {
        const isWinter = ctx.time.season === 'winter';
        return isWinter
          ? 'You bolt for the ice. It groans under your hooves, cracking, but holds. Behind you the lead one stops at the edge, tests the surface, backs away. The others pace and whine. Cold seeps up through your hooves on the far side.'
          : 'Cold water hits your chest. The current grabs your legs but you kick hard for the far bank. Behind you they pace the shoreline, unwilling to follow.';
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
      narrative: 'Two shapes in the brush, smaller than wolves, rangy. They hold back, watching. One yips to the other. They are waiting for you to stumble.',
      recurringNarrative: 'Two shapes in the brush again, rangy and patient. One yips. They are waiting for you to stumble.',
      actionDetail: 'Two smaller shapes holding back in the brush. One yips to the other. Waiting.',
      recurringActionDetail: 'Two shapes in the brush again. One yips. Waiting.',
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
      narrativeResult: 'You turn, ears forward, hooves planted. You are tall above them. They slow, look at each other, and back into the brush.',
      resolutionType: 'fight',
      statEffects: [],
    },
    {
      id: 'bolt',
      label: 'Bolt immediately',
      description: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return `Sprint before they close in.${loco < 70 ? ' Your legs are wrong.' : ''}`;
      },
      style: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco < 60 ? 'danger' : 'default';
      },
      narrativeResult: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco >= 70
          ? 'You leap and crash through the brush at full speed. They follow for a few strides, then fall back. You are faster.'
          : 'You run but the stride hitches. They close the gap fast. One darts in, snapping at your heels.';
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
      narrative: 'The birds go silent. Your skin twitches along your spine. A tawny shape drops from the rocks above, heavy and fast, claws out, aimed at your neck.',
      recurringNarrative: 'The birds go silent. Your skin twitches. You know this feeling. A tawny shape drops from the rocks above, claws out, aimed at your neck.',
      actionDetail: 'A tawny shape drops from the rocks above, heavy and fast, aimed at your neck.',
      recurringActionDetail: 'That silence again. A tawny shape drops from the rocks, aimed at your neck.',
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
        return `Twist away and sprint.${loco < 60 ? ' Your legs are wrong.' : ''}`;
      },
      style: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco < 50 ? 'danger' : 'default';
      },
      narrativeResult: (ctx) => {
        const loco = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
        return loco >= 60
          ? 'You jerk sideways. Claws rake your shoulder instead of closing on your throat. You run. The distance opens.'
          : 'You twist but your body is slow. Claws tear across your flank. The weight drives you sideways. You stumble, keep your feet, and run.';
      },
      resolutionType: 'chase',
      statEffects: [
        { stat: StatId.HOM, amount: 10, duration: 2, label: '+HOM' },
      ],
    },
    {
      id: 'rear-kick',
      label: 'Rear up and kick',
      description: 'Strike with your hooves.',
      style: 'danger',
      narrativeResult: 'You rear up and strike with your front hooves. One connects, solid thud against the skull. It recoils, shaking its head. You use the opening to run.',
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

  narrativeVariants: [
    {
      condition: 'default',
      narrative: 'Acrid smell, wrong, not from the ground or any animal you know. Bright shapes moving where there should be stillness. A flat crack splits the air. Birds scatter. Another crack, closer. Your legs are already moving.',
      recurringNarrative: 'That acrid smell again. Bright shapes between the trees. A flat crack, then another, closer. Your legs are already moving.',
      actionDetail: 'A flat crack splits the air. Birds scatter. Another crack, closer. Your legs are already moving.',
      recurringActionDetail: 'That crack again, closer. Your legs are already moving.',
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
      narrativeResult: 'You plunge into the thickest brush. Thorns rake your flanks. The sounds do not follow. You stand panting in the dark undergrowth, listening.',
      resolutionType: 'concealment',
      statEffects: [
        { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
      ],
    },
    {
      id: 'hold-position',
      label: 'Hold in the brush',
      description: 'Stay low and motionless. They look for movement.',
      style: 'default',
      narrativeResult: 'You lower your body until your belly nearly touches the ground. Your muscles tremble. Footsteps crunch on dry leaves, passing. The bright shapes move on.',
      resolutionType: 'concealment',
      statEffects: [],
    },
  ],
};
