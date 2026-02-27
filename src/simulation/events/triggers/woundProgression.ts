import type { SimulationTrigger, SimulationContext } from '../types';
import { StatId } from '../../../types/stats';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

/**
 * Wound Progression Triggers
 *
 * These fire based on condition cascade phase transitions (Phase 2).
 * They give the player visibility into wound progression and provide
 * choices that can influence the outcome (rest, clean, push through).
 */

// ── Helpers ──

function hasInfectedCondition(ctx: SimulationContext): boolean {
  if (!ctx.animal.bodyState) return false;
  const progs = ctx.animal.bodyState.conditionProgressions;
  return Object.values(progs).some(p => p.phase === 'infected');
}

function hasSepticCondition(ctx: SimulationContext): boolean {
  if (!ctx.animal.bodyState) return false;
  const progs = ctx.animal.bodyState.conditionProgressions;
  return Object.values(progs).some(p => p.phase === 'septic');
}

function getFeverLevel(ctx: SimulationContext): number {
  return ctx.animal.physiologyState?.feverLevel ?? 0;
}

// ══════════════════════════════════════════════════
//  WOUND DETERIORATION — fires when a wound becomes infected
// ══════════════════════════════════════════════════

export const woundDeteriorationTrigger: SimulationTrigger = {
  id: 'sim-wound-deterioration',
  category: 'health',
  tags: ['health', 'injury', 'infection'],

  isPlausible(ctx) {
    return hasInfectedCondition(ctx);
  },

  computeWeight(ctx) {
    // Fires once when infection is detected. Higher weight if multiple infected wounds.
    if (!ctx.animal.bodyState) return 0;
    const progs = ctx.animal.bodyState.conditionProgressions;
    const infectedCount = Object.values(progs).filter(p => p.phase === 'infected').length;
    // Only fire if infection is fresh (within first 2 turns of infected phase)
    const freshInfection = Object.values(progs).some(
      p => p.phase === 'infected' && p.turnsInPhase <= 2,
    );
    return freshInfection ? 0.3 + infectedCount * 0.1 : 0;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    const isNearWater = ctx.currentNodeType === 'water';

    const narrative = isNearWater
      ? 'Something is wrong with the wound. The edges are swollen and angry, weeping a fluid that smells acrid and wrong. But you are near water — the cool current could wash the corruption away, if you can stand the sting.'
      : 'Something is wrong with the wound. The edges are swollen and angry, and a dull heat radiates from beneath the skin. Each time you move, the area pulses with a deep, insistent ache. Your body is fighting something it is losing to.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HEA, amount: -6, duration: 3, label: '-HEA' },
        { stat: StatId.STR, amount: 4, duration: 2, label: '+STR' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: '(Wound infection detected)',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'wound-infection',
        entities: [],
        actions: [action(
          'The wound edges are swollen and angry, weeping acrid fluid. The body is losing this fight.',
          'Wound infection progressing. Inflammatory response inadequate. Risk of sepsis if untreated.',
          'medium',
        )],
        environment: env,
        emotionalTone: 'pain',
      }),
    };
  },

  getChoices(ctx) {
    const isNearWater = ctx.currentNodeType === 'water';
    return [
      {
        id: 'seek-water',
        label: isNearWater ? 'Clean the wound in the stream' : 'Seek water to clean the wound',
        description: isNearWater
          ? 'The cool water will help fight the infection, but the movement will hurt.'
          : 'Moving to find water costs energy, but cleaning the wound greatly reduces infection risk.',
        style: 'default' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: isNearWater ? -5 : -20, source: 'wound cleaning' },
            { type: 'set_flag' as const, flag: 'wound-cleaned' as never },
          ],
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HEA, amount: 3, duration: 2, label: '+HEA' },
          ],
        }),
        narrativeResult: isNearWater
          ? 'You lower yourself into the stream. The cold water lances through the wound like fire, but you hold steady. When you emerge, the swelling already feels less angry.'
          : 'You find a stream and wade in, letting the cold current wash over the wound. The pain is sharp but brief. The water carries away the worst of the corruption.',
      },
      {
        id: 'rest',
        label: 'Rest and conserve energy',
        description: 'Give your immune system the best chance by resting. But you won\'t be foraging.',
        style: 'default' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
            { stat: StatId.IMM, amount: -3, duration: 2, label: '-IMM' },
          ],
        }),
        narrativeResult: 'You find a sheltered spot and lie down, tucking your legs beneath you. Your body trembles with the effort of fighting the infection, but at least you are not spending energy on movement.',
      },
      {
        id: 'push-through',
        label: 'Ignore it and keep moving',
        description: 'The wound will worsen, but you can\'t afford to stop.',
        style: 'danger' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HEA, amount: -4, duration: 3, label: '-HEA' },
            { stat: StatId.ADV, amount: 3, duration: 1, label: '+ADV' },
          ],
        }),
        narrativeResult: 'You push yourself upright and walk. Every step sends a pulse of heat through the wound, but stopping means starving, and starvation kills just as surely as infection.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  FEVER EVENT — fires when fever level exceeds threshold
// ══════════════════════════════════════════════════

export const feverEventTrigger: SimulationTrigger = {
  id: 'sim-fever',
  category: 'health',
  tags: ['health', 'infection', 'fever'],

  isPlausible(ctx) {
    return getFeverLevel(ctx) > 2;
  },

  computeWeight(ctx) {
    const fever = getFeverLevel(ctx);
    if (fever <= 2) return 0;
    return 0.2 + (fever - 2) * 0.15; // increases with fever severity
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    const fever = getFeverLevel(ctx);
    const isHighFever = fever > 4;

    const narrative = isHighFever
      ? 'The world has gone strange. Colors are too bright, sounds too sharp, and your legs feel like they belong to someone else. A fire burns inside you that has nothing to do with the sun. Your thoughts fragment — where were you going? Why are you standing? The fever has taken hold of your mind.'
      : 'A deep heat has settled into your body that has nothing to do with the weather. Your muscles ache, your eyes are heavy, and every few steps you shiver despite the warmth radiating from within. The infection is winning, and your body is burning itself to fight back.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.CLI, amount: isHighFever ? 12 : 6, duration: 2, label: '+CLI' },
        { stat: StatId.WIS, amount: isHighFever ? -8 : -3, duration: 2, label: '-WIS' },
        { stat: StatId.TRA, amount: isHighFever ? 6 : 3, duration: 2, label: '+TRA' },
      ],
      consequences: [],
      narrativeText: narrative,
      footnote: `(Fever level: ${fever.toFixed(1)}°)`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'fever',
        entities: [],
        actions: [action(
          isHighFever
            ? 'The world has gone strange. Colors too bright, thoughts fragmenting. The fever has taken hold.'
            : 'A deep heat. Muscles aching, shivering despite the warmth radiating from within.',
          isHighFever
            ? `High fever (${fever.toFixed(1)}° deviation). Cognitive impairment, dehydration risk. Immune system in crisis.`
            : `Moderate fever (${fever.toFixed(1)}° deviation). Elevated metabolic demand, immune response active.`,
          isHighFever ? 'high' : 'medium',
        )],
        environment: env,
        emotionalTone: 'pain',
      }),
    };
  },

  getChoices(ctx) {
    const isNearShelter = ctx.currentNodeType === 'forest' || ctx.currentNodeType === 'den';
    return [
      {
        id: 'find-shade',
        label: isNearShelter ? 'Rest in the shade' : 'Find shade or shelter',
        description: 'Reduce the thermal burden on your body. The fever needs to break.',
        style: 'default' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HOM, amount: 3, duration: 1, label: '+HOM' },
          ],
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: -10, source: 'fever metabolic cost' },
          ],
        }),
        narrativeResult: isNearShelter
          ? 'You press yourself into the deepest shade you can find, flanks heaving. The coolness of the earth seeps into your overheated body. You close your eyes and let the fever do its work.'
          : 'You stagger toward the tree line, seeking any relief from the heat radiating from your own body. Under the canopy, the air is cooler. You collapse and wait.',
      },
      {
        id: 'keep-moving',
        label: 'Push through the fever',
        description: 'Dangerous, but staying still means no food.',
        style: 'danger' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HEA, amount: -5, duration: 3, label: '-HEA' },
          ],
        }),
        narrativeResult: 'You force yourself forward. Each step is an act of will against a body that wants nothing more than to stop. The world tilts and sways, but your legs keep moving.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  SEPSIS EVENT — fires when condition reaches septic phase
// ══════════════════════════════════════════════════

export const sepsisEventTrigger: SimulationTrigger = {
  id: 'sim-sepsis',
  category: 'health',
  tags: ['health', 'infection', 'sepsis', 'danger'],

  isPlausible(ctx) {
    return hasSepticCondition(ctx);
  },

  computeWeight(ctx) {
    if (!hasSepticCondition(ctx)) return 0;
    // High priority — this is a life-threatening event
    return 0.5;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HEA, amount: -15, duration: 4, label: '-HEA' },
        { stat: StatId.CLI, amount: 15, duration: 3, label: '+CLI' },
        { stat: StatId.STR, amount: 10, duration: 3, label: '+STR' },
        { stat: StatId.WIS, amount: -10, duration: 3, label: '-WIS' },
      ],
      consequences: [],
      narrativeText: 'Your body is betraying you. The infection has spread beyond the wound, poisoning your blood, turning your own defenses against you. You shake uncontrollably. Your vision dims and brightens in sickening waves. The ground feels distant, as though you are watching yourself from above. This is what dying feels like — not sudden, but a slow untethering from the world. Every instinct screams at you to do something, anything, but your body has nothing left to give.',
      footnote: '(Systemic infection — sepsis)',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'sepsis',
        entities: [],
        actions: [action(
          'Your body is betraying you. The infection has spread beyond the wound. You shake uncontrollably. This is what dying feels like.',
          'Sepsis: systemic inflammatory response to uncontrolled infection. Multi-organ dysfunction progressing. Without intervention, mortality exceeds 80%.',
          'extreme',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(_ctx) {
    return [
      {
        id: 'fight',
        label: 'Fight to survive',
        description: 'Everything your body has left. There is nothing to do but endure.',
        style: 'danger' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
          ],
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: -40, source: 'sepsis metabolic crisis' },
          ],
        }),
        narrativeResult: 'You dig deep into something beyond instinct — a raw, animal refusal to stop existing. Your body trembles and burns, but you remain. For now.',
      },
      {
        id: 'lie-down',
        label: 'Lie down and let it pass',
        description: 'Conserve the last of your energy. If your body can win this fight, rest gives it the best chance.',
        style: 'default' as const,
        modifyOutcome: (base, _ctx) => ({
          ...base,
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: -20, source: 'sepsis' },
          ],
        }),
        narrativeResult: 'You lower yourself to the ground and close your eyes. The shaking continues. The fever burns. But you are still here, and sometimes that is enough.',
      },
    ];
  },
};
