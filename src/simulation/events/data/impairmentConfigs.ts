import type { SimulationContext, SimulationOutcome } from '../types';
import type { HealthTriggerConfig } from './healthConfigs';
import { StatId } from '../../../types/stats';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Helpers ──

function getCapability(ctx: SimulationContext, cap: string): number {
  return ctx.animal.bodyState?.capabilities[cap] ?? 100;
}

// Removed unused _hasFractureInZone helper

// ══════════════════════════════════════════════════
//  LOCOMOTION IMPAIRMENT — fires when movement is significantly impaired
// ══════════════════════════════════════════════════

export const LOCOMOTION_IMPAIRMENT_CONFIG: HealthTriggerConfig = {
  id: 'sim-locomotion-impairment',
  category: 'health',
  tags: ['health', 'impairment', 'passive'],

  isPlausible(ctx) {
    return getCapability(ctx, 'locomotion') < 60;
  },

  computeWeight(ctx) {
    const loco = getCapability(ctx, 'locomotion');
    if (loco >= 60) return 0;
    // Higher weight as impairment worsens; cap at moderate frequency
    return 0.15 + (60 - loco) * 0.003;
  },

  resolve(ctx) {
    const loco = getCapability(ctx, 'locomotion');
    const hasFracture = ctx.animal.bodyState?.conditions.some(c => c.type === 'fracture') ?? false;
    const env = buildEnvironment(ctx);

    let narrative: string;
    let clinicalDetail: string;
    let intensity: 'low' | 'medium' | 'high' | 'extreme';

    if (loco < 20) {
      narrative = 'Every shift of weight sends fire through your body. Your muscles tremble from the effort of standing. The herd is gone. You cannot follow.';
      clinicalDetail = `Severe locomotion impairment (${loco}%). ${hasFracture ? 'Compound fracture preventing weight-bearing.' : 'Multiple injuries preventing effective ambulation.'} Animal effectively immobile. Predation risk critically elevated.`;
      intensity = 'extreme';
    } else if (loco < 40) {
      narrative = 'Each step is deliberate. Your gait is a lurching, three-legged rhythm. Everything with eyes can see it. You still move, but slowly.';
      clinicalDetail = `Significant locomotion impairment (${loco}%). ${hasFracture ? 'Weight-bearing compromised by fracture.' : 'Gait severely altered.'} Animal mobile but unable to sustain flight from predators.`;
      intensity = 'high';
    } else {
      narrative = 'Your gait hitches with each stride. A slight catch, a hesitation before the weight commits. It slows you. Anything watching can see the unevenness.';
      clinicalDetail = `Moderate locomotion impairment (${loco}%). Gait asymmetry visible. Animal compensating but performance degraded for sustained flight or rough terrain.`;
      intensity = 'medium';
    }

    return {
      harmEvents: [],
      statEffects: loco < 30
        ? [{ stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' }]
        : [],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Locomotion: ${loco}%)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'locomotion-impairment',
        entities: [],
        actions: [action(narrative, clinicalDetail, intensity)],
        environment: env,
        emotionalTone: loco < 30 ? 'fear' : 'pain',
      }),
    };
  },

  getChoices(ctx) {
    const loco = getCapability(ctx, 'locomotion');
    if (loco >= 40) return [];

    return [
      {
        id: 'rest-and-heal',
        label: 'Find a sheltered spot and rest',
        description: 'Give the injury time. You cannot outrun anything right now.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
          ],
        }),
        narrativeResult: 'You lower yourself into a thicket, tucking the damaged leg beneath you. The ground is cold but the brush is dense. Nothing can reach you without making noise.',
      },
      {
        id: 'push-on',
        label: 'Keep moving despite the pain',
        description: 'Staying still means no food. And predators find the ones that stop.',
        style: 'danger' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.ADV, amount: 3, duration: 1, label: '+ADV' },
          ],
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: -15, source: 'painful locomotion' },
          ],
        }),
        narrativeResult: 'You force yourself forward, one step at a time. The pain comes with every stride. You keep moving.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  VISION IMPAIRMENT — fires when sight is significantly degraded
// ══════════════════════════════════════════════════

export const VISION_IMPAIRMENT_CONFIG: HealthTriggerConfig = {
  id: 'sim-vision-impairment',
  category: 'health',
  tags: ['health', 'impairment', 'passive'],

  isPlausible(ctx) {
    return getCapability(ctx, 'vision') < 50;
  },

  computeWeight(ctx) {
    const vis = getCapability(ctx, 'vision');
    if (vis >= 50) return 0;
    return 0.12 + (50 - vis) * 0.004;
  },

  resolve(ctx) {
    const vis = getCapability(ctx, 'vision');
    const env = buildEnvironment(ctx);

    let narrative: string;
    let clinicalDetail: string;

    if (vis < 20) {
      narrative = 'Shapes merge into gray. Nothing has edges. You navigate by smell and sound and the memory of paths walked before. A shadow moves at the edge of your sight, or does not. You flinch.';
      clinicalDetail = `Near-total vision loss (${vis}%). Likely meningeal worm optic nerve damage or severe ocular trauma. Animal navigating primarily by olfaction and spatial memory.`;
    } else {
      narrative = 'The world is dimming. Distant details blur and vanish. You turn your head more, tracking sounds that your eyes can no longer resolve. Your ears do the work now.';
      clinicalDetail = `Moderate vision impairment (${vis}%). Progressive visual degradation. Animal increasingly dependent on auditory and olfactory detection.`;
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: vis < 20 ? 8 : 4, duration: 3, label: '+TRA' },
        { stat: StatId.NOV, amount: vis < 20 ? 6 : 3, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Vision: ${vis}%)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'vision-impairment',
        entities: [],
        actions: [action(narrative, clinicalDetail, vis < 20 ? 'high' : 'medium')],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices() {
    return []; // Vision impairment is a passive observation
  },
};

// ══════════════════════════════════════════════════
//  BREATHING IMPAIRMENT — fires when respiratory function is degraded
// ══════════════════════════════════════════════════

export const BREATHING_IMPAIRMENT_CONFIG: HealthTriggerConfig = {
  id: 'sim-breathing-impairment',
  category: 'health',
  tags: ['health', 'impairment', 'passive'],

  isPlausible(ctx) {
    return getCapability(ctx, 'breathing') < 50;
  },

  computeWeight(ctx) {
    const breath = getCapability(ctx, 'breathing');
    if (breath >= 50) return 0;
    return 0.12 + (50 - breath) * 0.004;
  },

  resolve(ctx) {
    const breath = getCapability(ctx, 'breathing');
    const env = buildEnvironment(ctx);

    let narrative: string;
    let clinicalDetail: string;

    if (breath < 25) {
      narrative = 'Your chest heaves just standing still. Each breath is shallow and wheezing. Lifting your head leaves you gasping, sides heaving, heart racing.';
      clinicalDetail = `Severe respiratory impairment (${breath}%). Dyspnea at rest. Likely thoracic injury or pneumonia. Any physical exertion risks respiratory failure.`;
    } else {
      narrative = 'Your chest is tight. You breathe in and the air stops short, filling only part of your lungs. After the smallest exertion you stand with legs braced wide, flanks heaving, waiting to catch your breath.';
      clinicalDetail = `Moderate respiratory impairment (${breath}%). Exercise intolerance. Likely rib fracture, pleural effusion, or early pneumonia.`;
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HOM, amount: breath < 25 ? 6 : 3, duration: 2, label: '+HOM' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Breathing: ${breath}%)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'breathing-impairment',
        entities: [],
        actions: [action(narrative, clinicalDetail, breath < 25 ? 'high' : 'medium')],
        environment: env,
        emotionalTone: 'pain',
      }),
    };
  },

  getChoices() {
    return []; // Breathing impairment is a passive observation
  },
};

// ══════════════════════════════════════════════════
//  HERD SEPARATION — fires when locomotion impairment isolates from herd
// ══════════════════════════════════════════════════

export const HERD_SEPARATION_CONFIG: HealthTriggerConfig = {
  id: 'sim-herd-separation',
  category: 'health',
  tags: ['health', 'social', 'impairment'],

  isPlausible(ctx) {
    const loco = getCapability(ctx, 'locomotion');
    // Only if significantly impaired and herd exists
    if (loco >= 50) return false;
    // Check for nearby conspecifics
    const hasNearbyHerd = ctx.npcs?.some(
      npc => npc.alive && (npc.type === 'ally' || npc.type === 'mate') && npc.currentNodeId === ctx.currentNodeId,
    ) ?? false;
    // Fire when there's no nearby herd (separated due to impairment)
    return !hasNearbyHerd;
  },

  computeWeight(ctx) {
    const loco = getCapability(ctx, 'locomotion');
    if (loco >= 50) return 0;
    return 0.1;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' },
        { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' },
      ],
      consequences: [],
      narrativeText: 'The herd moved on. White tails bobbed into the tree line, one by one, until they were gone. You bleated after them. No answer came back.',
      footnote: '(Herd separation, locomotion impairment)',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'herd-separation',
        entities: [],
        actions: [action(
          'The herd moved on. White tails disappeared into the tree line. You bleated after them. No answer.',
          'Animal separated from social group due to locomotion impairment. Isolation increases predation risk and eliminates group vigilance benefits.',
          'high',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices() {
    return [];
  },
};

// ══════════════════════════════════════════════════
//  STARVATION + INFECTION COMPOUND — fires when starving with active infection
// ══════════════════════════════════════════════════

export const STARVATION_INFECTION_CONFIG: HealthTriggerConfig = {
  id: 'sim-starvation-infection-compound',
  category: 'health',
  tags: ['health', 'compound', 'danger'],

  isPlausible(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const hasInfection = ctx.animal.bodyState?.conditionProgressions
      ? Object.values(ctx.animal.bodyState.conditionProgressions).some(
          p => p.phase === 'infected' || p.phase === 'septic',
        )
      : false;
    return bcs <= 2 && hasInfection;
  },

  computeWeight(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    if (bcs > 2) return 0;
    return 0.2 + (2 - bcs) * 0.15;
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const env = buildEnvironment(ctx);

    const narrative = bcs <= 1
      ? 'Your ribs press against your hide. The wound radiates heat. Your body has nothing left to fight with. You shiver and cannot stop.'
      : 'The fever burns through what little you have left. You shiver, you sweat, you cannot eat enough to keep up. The wound stays hot.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HEA, amount: bcs <= 1 ? -10 : -5, duration: 3, label: '-HEA' },
        { stat: StatId.CLI, amount: bcs <= 1 ? 10 : 5, duration: 2, label: '+CLI' },
      ],
      consequences: [
        { type: 'add_calories' as const, amount: bcs <= 1 ? -30 : -15, source: 'immune response during starvation' },
      ],
      narrativeText: narrative,
      footnote: `(BCS: ${bcs}, active infection)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'starvation-infection-compound',
        entities: [],
        actions: [action(
          bcs <= 1
            ? 'Ribs press against hide. The wound radiates heat. Nothing left to fight with.'
            : 'The fever burns through what little remains. The wound stays hot.',
          `Compound crisis: malnutrition (BCS ${bcs}) concurrent with active infection. Immune function severely compromised. Metabolic demands exceed intake. Prognosis poor without resolution of either condition.`,
          bcs <= 1 ? 'extreme' : 'high',
        )],
        environment: env,
        emotionalTone: 'pain',
      }),
    };
  },

  getChoices() {
    return []; // This is a passive compound event
  },
};
