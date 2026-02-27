import type { SimulationTrigger } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ══════════════════════════════════════════════════
//  PARASITE EXPOSURE (ticks, flukes, brainworm)
// ══════════════════════════════════════════════════

export const parasiteExposureTrigger: SimulationTrigger = {
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
          modifyOutcome(base) {
            return base; // The parasite exposure proceeds as resolved
          },
        },
        {
          id: 'search-clean',
          label: 'Search for cleaner water',
          description: 'Moving water is safer, but you\'re already parched.',
          style: 'default' as const,
          narrativeResult: 'You turn away from the stagnant pool and push upstream, following the faint sound of moving water. It takes longer, and your muscles ache with dehydration, but the stream you find is clear and cold and tastes of stone.',
          modifyOutcome(base) {
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

export const woundInfectionTrigger: SimulationTrigger = {
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

export const diseaseOutbreakTrigger: SimulationTrigger = {
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
