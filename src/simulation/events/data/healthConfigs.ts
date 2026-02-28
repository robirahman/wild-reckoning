import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import type { StatEffect, Consequence } from '../../../types/events';
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
          ? 'You lower yourself into the stream. The cold water lances through the wound like fire, but you hold steady. When you emerge, the swelling already feels less angry.'
          : 'You find a stream and wade in, letting the cold current wash over the wound. The pain is sharp but brief. The water carries away the worst of the corruption.',
      },
      {
        id: 'rest',
        label: 'Rest and conserve energy',
        description: 'Give your immune system the best chance by resting. But you won\'t be foraging.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
          ? 'You press yourself into the deepest shade you can find, flanks heaving. The coolness of the earth seeps into your overheated body. You close your eyes and let the fever do its work.'
          : 'You stagger toward the tree line, seeking any relief from the heat radiating from your own body. Under the canopy, the air is cooler. You collapse and wait.',
      },
      {
        id: 'keep-moving',
        label: 'Push through the fever',
        description: 'Dangerous, but staying still means no food.',
        style: 'danger' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
        narrativeResult: 'You dig deep into something beyond instinct — a raw, animal refusal to stop existing. Your body trembles and burns, but you remain. For now.',
      },
      {
        id: 'lie-down',
        label: 'Lie down and let it pass',
        description: 'Conserve the last of your energy. If your body can win this fight, rest gives it the best chance.',
        style: 'default' as const,
        modifyOutcome: (base: SimulationOutcome, _ctx: SimulationContext) => ({
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
        narrativeText: 'You drink from a still pool edged with algae, the water warm and faintly metallic. It tastes wrong — a sour undertone beneath the mineral flatness — but your thirst is greater than your caution. Somewhere in that murky water, invisible to any sense you possess, something is waiting to find a home inside you.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-liver-fluke',
          actions: [action(
            'You drink from a still pool. The water tastes wrong but your thirst is greater than your caution.',
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
        narrativeText: 'The brush you pushed through was thick with waiting passengers. You feel them now — tiny pinpoints of irritation spreading across your neck and shoulders, each one a minuscule mouth burrowing into your skin. You rub against a tree trunk, scraping desperately, but for every one you dislodge, three more have already anchored themselves.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-tick',
          actions: [action(
            'Tiny pinpoints of irritation spreading across your neck and shoulders, each one burrowing into your skin.',
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
        narrativeText: 'You graze on the low shrubs near the wetland edge, oblivious to the tiny snails clinging to the undersides of the leaves. Each one carries a passenger — a larval worm evolved to travel from snail to deer to brain, a journey it has been making for millions of years. You won\'t feel it for weeks. By then, it will be too late to undo.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'parasite-meningeal-worm',
          actions: [action(
            'You graze on low shrubs near the wetland edge, oblivious to the tiny snails clinging to the undersides of the leaves.',
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
          description: 'You\'re thirsty. The water is right here.',
          style: 'default' as const,
          narrativeResult: 'You lower your muzzle and drink deeply. The water is tepid and tastes of algae, but it quenches the burning thirst. Whatever else it carried, you won\'t know for days.',
          modifyOutcome(base: SimulationOutcome) {
            return base; // The parasite exposure proceeds as resolved
          },
        },
        {
          id: 'search-clean',
          label: 'Search for cleaner water',
          description: 'Moving water is safer, but you\'re already parched.',
          style: 'default' as const,
          narrativeResult: 'You turn away from the stagnant pool and push upstream, following the faint sound of moving water. It takes longer, and your muscles ache with dehydration, but the stream you find is clear and cold and tastes of stone.',
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
      narrativeText: 'The wound that had seemed to be healing has changed. The skin around it is hot to the touch, swollen tight, and the discharge has turned from clear to cloudy yellow-green. A foul smell rises from it — the smell of flesh losing its battle against invasion. Your body responds with fever, burning calories to fight an enemy it cannot see or flee from.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'health',
        eventType: 'wound-infection',
        actions: [action(
          'The wound is hot and swollen, discharging cloudy yellow-green fluid. A foul smell rises from it. Your body responds with fever.',
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
        narrativeText: 'The tiny flies are invisible — you feel only the faint prickle of their bites, no different from a thousand other summer annoyances. But within days, something is terribly wrong. A fever builds until your body radiates heat. Your tongue swells and turns blue. You are drawn irresistibly toward water, standing in the shallows with your head hanging, too weak to walk back to cover. The disease — epizootic hemorrhagic disease, though you have no name for it — is destroying the lining of your blood vessels from the inside.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'disease-ehd',
          actions: [action(
            'A fever builds until your body radiates heat. Your tongue swells and turns blue. You are drawn irresistibly toward water.',
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
        narrativeText: 'It begins subtly — a slight unsteadiness in your gait, a tendency to stand and stare at nothing. You are losing weight despite adequate forage, and the other deer have begun to avoid you. Something is wrong inside your head, behind your eyes, in the parts of your brain that govern balance and recognition. You cannot name it. You cannot fight it. You can only feel the slow erosion of yourself.',
        narrativeContext: buildNarrativeContext({
          eventCategory: 'health',
          eventType: 'disease-cwd',
          actions: [action(
            'A slight unsteadiness in your gait. Weight loss despite adequate forage. The other deer avoid you. Something is wrong inside your head.',
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
