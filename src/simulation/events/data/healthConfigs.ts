import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ── Config Type ──

export interface HealthTriggerConfig {
  id: string;
  category: 'health';
  tags: string[];
  calibrationCauseId?: string;

  /** Quick plausibility check — if false, the trigger is skipped */
  isPlausible: (ctx: SimulationContext) => boolean;

  /** Compute selection weight from context */
  computeWeight: (ctx: SimulationContext) => number;

  /** Resolve the trigger into a full outcome */
  resolve: (ctx: SimulationContext) => SimulationOutcome;

  /** Player choices (empty array = no choices) */
  getChoices: (ctx: SimulationContext) => SimulationChoice[];
}

// ── Helpers (shared across configs) ──

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

export const WOUND_DETERIORATION_CONFIG: HealthTriggerConfig = {
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
      ? 'The wound edges are swollen. Fluid drains from the edges. Sharp smell. Running water nearby.'
      : 'The wound edges are swollen. Heat radiating from under the skin. Each step sends a deep pulse through the area.';

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
          'Wound edges swollen. Acrid fluid weeping. Heat under the skin.',
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
          ? 'Cool water nearby. Moving will hurt.'
          : 'Moving to water costs energy, but cleans the wound.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
          ? 'You step into the stream. Cold water hits the wound. You flinch but hold. The swelling eases.'
          : 'You find a stream and wade in. Cold current over the wound. Sharp pain, then less. The discharge washes away.',
      },
      {
        id: 'rest',
        label: 'Rest and conserve energy',
        description: 'Lie still. No foraging.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
            { stat: StatId.IMM, amount: -3, duration: 2, label: '-IMM' },
          ],
        }),
        narrativeResult: 'You find a sheltered spot and fold your legs under. Trembling. But still.',
      },
      {
        id: 'push-through',
        label: 'Ignore it and keep moving',
        description: 'The wound will worsen. You keep moving.',
        style: 'danger' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HEA, amount: -4, duration: 3, label: '-HEA' },
            { stat: StatId.ADV, amount: 3, duration: 1, label: '+ADV' },
          ],
        }),
        narrativeResult: 'You push upright and walk. Each step pulses heat through the wound.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  FEVER EVENT — fires when fever level exceeds threshold
// ══════════════════════════════════════════════════

export const FEVER_EVENT_CONFIG: HealthTriggerConfig = {
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
      ? 'Colors too bright. Sounds too sharp. Your legs buckle, do not respond. Heat from inside, not from the sun. You stop mid-stride.'
      : 'Heat inside you that is not the weather. Muscles ache. Every few steps, shivering despite the warmth radiating from your core.';

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
            ? 'Colors wrong. Legs buckling. Heat from inside. Stopped mid-stride.'
            : 'Heat inside. Muscles ache. Shivering despite the warmth.',
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
        description: 'Find shade. Lie down. Let the heat pass.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
          ? 'You press into shade. Flanks heaving. The cool earth against your belly. Eyes close.'
          : 'You stagger toward the tree line. Under the canopy the air is cooler. You collapse.',
      },
      {
        id: 'keep-moving',
        label: 'Push through the fever',
        description: 'Keep walking. No food if you stop.',
        style: 'danger' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          statEffects: [
            ...base.statEffects,
            { stat: StatId.HEA, amount: -5, duration: 3, label: '-HEA' },
          ],
        }),
        narrativeResult: 'You force yourself forward. The ground tilts. Your legs keep moving.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  SEPSIS EVENT — fires when condition reaches septic phase
// ══════════════════════════════════════════════════

export const SEPSIS_EVENT_CONFIG: HealthTriggerConfig = {
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
      narrativeText: 'Uncontrollable shaking. Vision dims, then too bright, then dims again. Your legs buckle. The heat is everywhere now, not just the wound.',
      footnote: '(Systemic infection — sepsis)',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'sepsis',
        entities: [],
        actions: [action(
          'Uncontrollable shaking. Vision flickering. The heat is everywhere. Legs buckling.',
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
        description: 'Everything left. Endure.',
        style: 'danger' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
        narrativeResult: 'Your legs lock. You stay standing. Trembling, burning, but standing.',
      },
      {
        id: 'lie-down',
        label: 'Lie down and let it pass',
        description: 'Conserve energy. Lie down.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
          ...base,
          consequences: [
            ...base.consequences,
            { type: 'add_calories' as const, amount: -20, source: 'sepsis' },
          ],
        }),
        narrativeResult: 'You lower yourself to the ground. Eyes close. The shaking continues. You are still breathing.',
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  PARASITE EXPOSURE (ticks, flukes, brainworm)
// ══════════════════════════════════════════════════

export const PARASITE_EXPOSURE_CONFIG: HealthTriggerConfig = {
  id: 'sim-parasite-exposure',
  category: 'health',
  tags: ['health', 'parasite'],
  calibrationCauseId: 'disease',

  isPlausible(ctx) {
    // Parasites are most active in warm seasons near water/brush
    return ctx.time.season !== 'winter';
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.02;
    let base = getEncounterRate(ctx.calibratedRates, 'disease', ctx.time.season) * 0.5;

    // Near water increases fluke/snail-borne parasites
    if (ctx.currentNodeType === 'water') base *= 2.5;
    // Dense brush means more ticks
    if (ctx.currentNodeType === 'forest') base *= 1.5;
    // Summer is peak tick season
    if (ctx.time.season === 'summer') base *= 1.8;

    return base;
  },

  resolve(ctx) {
    // Pick parasite type based on conditions
    const nearWater = ctx.currentNodeType === 'water';
    const isSummer = ctx.time.season === 'summer';
    const env = buildEnvironment(ctx);

    if (nearWater && ctx.rng.chance(0.4)) {
      // Liver fluke via contaminated water
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.IMM, amount: 6, duration: 4, label: '+IMM' },
          { stat: StatId.HOM, amount: 3, duration: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_parasite', parasiteId: 'liver-fluke' },
        ],
        narrativeText: 'Still pool, algae at the edges. The water is warm, faintly metallic, a sour undertone. You drink anyway. Your thirst is greater than your caution.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-liver-fluke',
          actions: [action(
            'Still pool, warm, metallic taste. You drink anyway.',
            'Liver fluke (Fascioloides magna) exposure via contaminated stagnant water. Metacercariae ingested with water.',
            'low',
          )],
          environment: env,
          emotionalTone: 'calm',
        }),
      };
    } else if (isSummer || ctx.rng.chance(0.5)) {
      // Tick infestation
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.IMM, amount: 4, duration: 3, label: '+IMM' },
          { stat: StatId.HOM, amount: 2, duration: 2, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_parasite', parasiteId: 'winter-tick' },
        ],
        narrativeText: 'Pinpoints of irritation spreading across your neck and shoulders after pushing through the brush. You rub against a tree trunk. Some dislodge. More have already anchored.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-tick',
          actions: [action(
            'Pinpoints of irritation across neck and shoulders. Rubbing against bark dislodges some. More anchored.',
            'Winter tick (Dermacentor albipictus) infestation acquired from brush contact. Multiple attachment sites on neck and shoulders.',
            'medium',
          )],
          environment: env,
          emotionalTone: 'pain',
        }),
      };
    } else {
      // Meningeal worm (brainworm) — from eating contaminated gastropods on vegetation
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.IMM, amount: 8, duration: 6, label: '+IMM' },
          { stat: StatId.NOV, amount: 5, duration: 4, label: '+NOV' },
        ],
        consequences: [
          { type: 'add_parasite', parasiteId: 'meningeal-worm' },
        ],
        narrativeText: 'You graze on low shrubs near the wetland edge. Damp leaves, earthy smell. Nothing tastes wrong.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-meningeal-worm',
          actions: [action(
            'Grazing on low shrubs near the wetland edge. Damp leaves, nothing tastes wrong.',
            'Meningeal worm (Parelaphostrongylus tenuis) exposure. Larval nematode ingested via gastropod intermediate host on wetland vegetation. Neurological symptoms will manifest in weeks.',
            'low',
          )],
          environment: env,
          emotionalTone: 'calm',
        }),
      };
    }
  },

  getChoices(ctx) {
    // For water-based exposure, offer a choice
    if (ctx.currentNodeType === 'water') {
      return [
        {
          id: 'drink-stagnant',
          label: 'Drink from the still water',
          description: 'Thirsty. The water is right here.',
          style: 'default' as const,
          narrativeResult: 'You lower your muzzle and drink. Tepid, algae taste. The thirst eases.',
          modifyOutcome(base: SimulationOutcome) {
            return base; // The parasite exposure proceeds as resolved
          },
        },
        {
          id: 'search-clean',
          label: 'Search for cleaner water',
          description: 'Moving water smells cleaner. You are already parched.',
          style: 'default' as const,
          narrativeResult: 'You turn from the stagnant pool and follow the sound of moving water upstream. The stream is clear and cold. Tastes of stone.',
          modifyOutcome(base: SimulationOutcome) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: 3, duration: 2, label: '+HOM' },
              ],
              consequences: [], // No parasite
            };
          },
        },
      ];
    }
    return [];
  },
};

// ══════════════════════════════════════════════════
//  WOUND INFECTION — existing wounds becoming infected
// ══════════════════════════════════════════════════

export const WOUND_INFECTION_CONFIG: HealthTriggerConfig = {
  id: 'sim-wound-infection',
  category: 'health',
  tags: ['health', 'injury'],

  isPlausible(ctx) {
    // Only fires if the animal has open wounds (injuries or body conditions)
    if (ctx.animal.injuries.length > 0) return true;
    if (ctx.animal.bodyState?.conditions.some((c) => c.type === 'laceration' || c.type === 'puncture')) return true;
    return false;
  },

  computeWeight(ctx) {
    let base = 0.02;

    // More injuries = higher infection risk
    base *= 1 + ctx.animal.injuries.length * 0.3;

    // Warm/wet conditions increase infection risk
    if (ctx.time.season === 'summer' || ctx.time.season === 'spring') base *= 1.5;

    // Near stagnant water is worse
    if (ctx.currentNodeType === 'water') base *= 1.5;

    // Low immune function increases risk
    const imm = computeEffectiveValue(ctx.animal.stats[StatId.IMM]);
    base *= 1 + imm / 100; // Higher IMM stress = more susceptible

    return base;
  },

  resolve(ctx) {
    const harmEvent: HarmEvent = {
      id: `infection-${ctx.time.turn}`,
      sourceLabel: 'wound infection',
      magnitude: ctx.rng.int(10, 25),
      targetZone: 'random',
      spread: 0.3,
      harmType: 'biological',
    };

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [harmEvent],
      statEffects: [
        { stat: StatId.IMM, amount: 8, duration: 4, label: '+IMM' },
        { stat: StatId.HOM, amount: 4, duration: 3, label: '+HOM' },
      ],
      consequences: [],
      narrativeText: 'The wound has changed. Skin around it hot, swollen tight. The discharge cloudy yellow-green now. Foul smell rising from it. Heat spreading through you.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'wound-infection',
        actions: [action(
          'Wound hot and swollen. Cloudy yellow-green discharge. Foul smell. Heat spreading.',
          'Secondary bacterial infection of existing wound. Purulent discharge, localized inflammation, febrile response.',
          'high',
        )],
        environment: env,
        emotionalTone: 'pain',
        sourceHarmEvents: [harmEvent],
      }),
    };
  },

  getChoices() {
    return []; // Infection is not a choice event
  },
};

// ══════════════════════════════════════════════════
//  DISEASE OUTBREAK (EHD, CWD — population-density dependent)
// ══════════════════════════════════════════════════

export const DISEASE_OUTBREAK_CONFIG: HealthTriggerConfig = {
  id: 'sim-disease-outbreak',
  category: 'health',
  tags: ['health', 'disease', 'seasonal'],
  calibrationCauseId: 'disease',

  isPlausible(ctx) {
    // EHD spreads via midges in late summer/early autumn
    // CWD can occur year-round but is more common in dense populations
    return ctx.time.season === 'summer' || ctx.time.season === 'autumn';
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.008;
    let base = getEncounterRate(ctx.calibratedRates, 'disease', ctx.time.season) * 0.3;

    // Late summer is peak EHD season (Culicoides midges)
    if (ctx.time.season === 'summer' && ctx.time.timeOfDay === 'dusk') base *= 2;

    // Near water (where midges breed)
    if (ctx.currentNodeType === 'water') base *= 2;

    return base;
  },

  resolve(ctx) {
    const isEHD = ctx.time.season === 'summer' || (ctx.time.season === 'autumn' && ctx.rng.chance(0.6));
    const env = buildEnvironment(ctx);

    if (isEHD) {
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.IMM, amount: 15, duration: 6, label: '+IMM' },
          { stat: StatId.HOM, amount: 10, duration: 5, label: '+HOM' },
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        narrativeText: 'Faint prickle of bites you barely noticed. Then fever. Your tongue swells. You find yourself standing in the shallows, head hanging, too weak to walk back to cover.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'disease-ehd',
          actions: [action(
            'Fever. Tongue swelling. Standing in shallows, head hanging, too weak to leave the water.',
            'Epizootic hemorrhagic disease (EHD) contracted via Culicoides midge bite. Vascular endothelial destruction causing hemorrhage, fever, oral edema, and acute wasting.',
            'extreme',
          )],
          environment: env,
          emotionalTone: 'pain',
        }),
      };
    } else {
      // Generic disease / CWD-like
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.IMM, amount: 10, duration: 8, label: '+IMM' },
          { stat: StatId.NOV, amount: 8, duration: 6, label: '+NOV' },
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        narrativeText: 'Slight unsteadiness in your gait. You stand and stare at nothing. Weight dropping despite adequate forage. The other deer avoid you.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'disease-cwd',
          actions: [action(
            'Unsteady gait. Staring at nothing. Weight dropping. Other deer avoiding you.',
            'Suspected chronic wasting disease (CWD). Transmissible spongiform encephalopathy causing progressive neurological deterioration, weight loss, behavioral changes.',
            'high',
          )],
          environment: env,
          emotionalTone: 'confusion',
        }),
      };
    }
  },

  getChoices() {
    return []; // Disease is not a choice event
  },
};
