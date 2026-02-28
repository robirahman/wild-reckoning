import type { SimulationContext, SimulationOutcome } from '../types';
import type { HealthTriggerConfig } from './healthConfigs';
import { StatId } from '../../../types/stats';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Helpers ──

function getCapability(ctx: SimulationContext, cap: string): number {
  return ctx.animal.bodyState?.capabilities[cap] ?? 100;
}

function hasFractureInZone(ctx: SimulationContext, zone: string): boolean {
  if (!ctx.animal.bodyState) return false;
  return ctx.animal.bodyState.conditions.some(
    c => c.type === 'fracture' && c.bodyPartId.includes(zone),
  );
}

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
      narrative = 'Movement is agony. The world has shrunk to the patch of ground beneath you. Every shift of weight sends fire through your body. You can feel your muscles trembling — not from cold, but from the effort of simply remaining upright. The herd is long gone. You are alone with your pain and the terrible knowledge that you cannot follow.';
      clinicalDetail = `Severe locomotion impairment (${loco}%). ${hasFracture ? 'Compound fracture preventing weight-bearing.' : 'Multiple injuries preventing effective ambulation.'} Animal effectively immobile. Predation risk critically elevated.`;
      intensity = 'extreme';
    } else if (loco < 40) {
      narrative = 'Walking is a deliberate, calculated act. Each step must be planned, tested, committed to. Your gait is a lurching, three-legged rhythm that draws attention from everything with eyes. You can still move, but the gap between you and everything that moves normally grows wider with every stride.';
      clinicalDetail = `Significant locomotion impairment (${loco}%). ${hasFracture ? 'Weight-bearing compromised by fracture.' : 'Gait severely altered.'} Animal mobile but unable to sustain flight from predators.`;
      intensity = 'high';
    } else {
      narrative = 'Your gait hitches with each stride — a slight catch, a millisecond of hesitation where your body negotiates with the damaged leg before committing to the next step. It is enough to notice, enough to slow you, enough that every predator within eyeshot can see the flag of weakness in the way you move.';
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
        narrativeResult: 'You lower yourself into a thicket, tucking the damaged leg beneath you. The ground is cold but the brush is dense. Nothing can reach you without making noise. You close your eyes and wait for your body to do what it can.',
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
        narrativeResult: 'You force yourself forward, one agonizing step at a time. The pain is a constant companion now, a sharp voice that tells you to stop with every stride. You ignore it. Stopping is dying.',
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
      narrative = 'The world is dissolving. Shapes merge into a gray wash where nothing has edges. You navigate by smell and sound and the memory of paths walked before, but memories are unreliable guides in a forest that is always changing. A shadow moves at the periphery — or does it? You flinch at phantoms, exhausted by a vigilance that can no longer see what it is watching for.';
      clinicalDetail = `Near-total vision loss (${vis}%). Likely meningeal worm optic nerve damage or severe ocular trauma. Animal navigating primarily by olfaction and spatial memory.`;
    } else {
      narrative = 'Shadows take threatening shapes at the edges of your vision. The world is dimming — not the way twilight dims it, but from within, as though a curtain is slowly being drawn across your eyes. Distant details blur and vanish. You find yourself relying more on your ears, turning your head to track sounds that your eyes can no longer resolve.';
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
      narrative = 'Your chest heaves with the effort of simply existing. Each breath is a shallow, wheezing negotiation between your lungs and the air, and the air is winning. The smallest exertion — lifting your head, shifting your weight — leaves you gasping, sides heaving, heart racing to compensate for what your lungs cannot provide. The world narrows to the next breath, and the next, and the desperate hope that there will always be a next.';
      clinicalDetail = `Severe respiratory impairment (${breath}%). Dyspnea at rest. Likely thoracic injury or pneumonia. Any physical exertion risks respiratory failure.`;
    } else {
      narrative = 'Your chest is tight. Not the tightness of cold air or hard running, but a persistent constriction that never fully releases. You breathe in and the air stops short, filling only part of your lungs before something — pain, swelling, damage — refuses it further entry. After the smallest exertion you stand with your legs braced wide, flanks heaving, waiting for the oxygen debt to slowly, painfully clear.';
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
      npc => npc.alive && npc.type === 'conspecific' && npc.currentNodeId === ctx.currentNodeId,
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
      narrativeText: 'The herd moved on without you. You watched them go — the bobbing white tails disappearing into the tree line one by one, a receding constellation of the only safety you have ever known. You called after them, the soft bleating alarm that means wait, come back, I am here, but they did not come back. They cannot afford to wait for the one who cannot keep up. Nothing can.',
      footnote: '(Herd separation — locomotion impairment)',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'herd-separation',
        entities: [],
        actions: [action(
          'The herd moved on without you. You watched them go — the bobbing white tails disappearing into the tree line.',
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
      ? 'Your body is consuming itself. The ribs press against your hide like the bars of a cage you are locked inside. The infection — the hot, throbbing wrongness that radiates from the wound — demands energy your body no longer has. Your immune system is shutting down, one defense at a time, surrendering territory to an invader it can no longer afford to fight. You are being eaten from two directions at once: from without by hunger, from within by infection.'
      : 'The fever is draining what little reserves you have left. Every calorie your body scrapes together goes to fueling the immune response — the shivering, the elevated temperature, the white blood cells flooding toward the wound — leaving nothing for movement, for warmth, for thought. You are caught between two killers, each making the other stronger.';

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
            ? 'Your body is consuming itself. Ribs press against hide. The infection demands energy your body no longer has.'
            : 'The fever drains what little reserves you have. Every calorie fuels the immune response, leaving nothing else.',
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
