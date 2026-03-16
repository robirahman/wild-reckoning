import type { SimulationContext, SimulationChoice, SimulationOutcome } from '../types';
import { StatId } from '../../../types/stats';
import { resolveChase } from '../../interactions/chase';
import { resolveFight } from '../../interactions/fight';
import { buildEnvironment, action, buildNarrativeContext, conspecificEntity, smallPredatorEntity } from '../../narrative/contextBuilder';

// ── Config Types ──

/** Plausibility conditions for a reproduction trigger */
export interface ReproductionPlausibility {
  /** Required sex ('male' | 'female') */
  requiredSex: 'male' | 'female';
  /** Required seasons (undefined = all) */
  seasons?: string[];
  /** Required flags (all must be present) */
  requiredFlags?: string[];
  /** Blocking flags (any present blocks the trigger) */
  blockingFlags?: string[];
  /** Minimum age in months */
  minAge?: number;
}

/** Weight computation parameters for a reproduction trigger */
export interface ReproductionWeightParams {
  baseWeight: number;
  /** Custom weight computation (receives context and base weight, returns final weight) */
  computeWeight: (ctx: SimulationContext, base: number) => number;
}

/**
 * Full configuration for a data-driven reproduction trigger.
 *
 * Because reproduction triggers have highly varied resolve/choice logic
 * (fawn birth is choice-less, fawn defense uses chase+fight resolvers,
 * rut display has courtship pursuit), the resolve and getChoices functions
 * are provided directly in the config as callbacks rather than being
 * decomposed into declarative templates.
 */
export interface ReproductionTriggerConfig {
  id: string;
  tags: string[];

  plausibility: ReproductionPlausibility;
  weight: ReproductionWeightParams;

  /** Resolve the trigger into a base outcome */
  resolve: (ctx: SimulationContext) => SimulationOutcome;
  /** Build player choices for this trigger */
  getChoices: (ctx: SimulationContext) => SimulationChoice[];
}

// ══════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════

// ── Fawn Birth ──

export const FAWN_BIRTH_CONFIG: ReproductionTriggerConfig = {
  id: 'sim-fawn-birth',
  tags: ['mating', 'fawn'],

  plausibility: {
    requiredSex: 'female',
    seasons: ['spring'],
    blockingFlags: ['has-fawns'],
    minAge: 12,
  },

  weight: {
    baseWeight: 0.1,
    computeWeight(ctx, base) {
      let w = base;

      // Does that mated last autumn are much more likely to birth
      if (ctx.animal.flags.has('mated') || ctx.animal.flags.has('mated-this-season')) {
        w = 0.25;
      }

      // Late spring = higher urgency (fawns should arrive by June)
      if (ctx.time.monthIndex >= 4 && ctx.time.monthIndex <= 5) w *= 1.5;

      return w;
    },
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const cover = ctx.currentNodeResources?.cover ?? 50;

    // Fawn viability depends on mother's body condition
    const viableNarrative = bcs >= 3
      ? 'The birth is swift. Two fawns, damp and trembling, their spotted coats drying in the warm air. Within an hour they are nursing.'
      : bcs >= 2
        ? 'The labor is hard. Your body strains. A single fawn emerges, small but alive, breathing in quick shallow gasps. You lick it clean.'
        : 'The fawn is born too small. You lick it, nudge it. Its legs fold under every attempt to stand. The spotted coat hangs loose. Its breathing is labored.';

    // Cover quality affects early fawn survival
    const coverNarrative = cover >= 50
      ? 'Tall ferns and dense undergrowth surround the birth site. Good cover.'
      : 'The cover here is thin. The fawn will be visible from a distance.';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HOM, amount: 8, duration: 4, label: '+HOM' },
        { stat: StatId.TRA, amount: -5, label: '-TRA' },
        { stat: StatId.WIS, amount: 5, label: '+WIS' },
      ],
      consequences: [
        { type: 'set_flag', flag: 'has-fawns' as any },
        { type: 'modify_weight', amount: -4 },
        // Low BCS fawn is fragile (potential future event triggers on this)
        ...(bcs <= 1 ? [{ type: 'set_flag' as any, flag: 'fawn-fragile' as any }] : []),
      ],
      narrativeText: `The contractions start at dawn, deep and rhythmic. You crouch in the densest cover you can find. ${viableNarrative} ${coverNarrative} You eat the afterbirth. The smell would draw predators. Then you move away from the birth site. You will return to nurse.`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'reproduction',
        eventType: 'fawn-birth',
        entities: [conspecificEntity(
          bcs >= 3 ? 'two damp, trembling fawns with spotted coats' : 'a single small fawn struggling to stand',
          bcs >= 3 ? 'viable twin fawns' : bcs >= 2 ? 'single viable fawn' : 'single fragile fawn (low viability)',
        )],
        actions: [action(
          `${viableNarrative} ${coverNarrative}`,
          `Parturition. BCS: ${bcs}/5. ${bcs >= 3 ? 'Twins born, viable.' : bcs >= 2 ? 'Single fawn, viable.' : 'Single fawn, underweight, fragile.'} Cover quality: ${cover >= 50 ? 'adequate' : 'poor'}.`,
          bcs <= 1 ? 'high' : 'medium',
        )],
        environment: buildEnvironment(ctx),
        emotionalTone: bcs <= 1 ? 'tension' : 'relief',
      }),
    };
  },

  getChoices() {
    return []; // Birth is not a choice event
  },
};

// ── Fawn Defense ──

export const FAWN_DEFENSE_CONFIG: ReproductionTriggerConfig = {
  id: 'sim-fawn-defense',
  tags: ['predator', 'fawn', 'danger', 'mating'],

  plausibility: {
    requiredSex: 'female',
    seasons: ['spring', 'summer'],
    requiredFlags: ['has-fawns'],
  },

  weight: {
    baseWeight: 0.04,
    computeWeight(ctx, base) {
      let w = base;

      // Open terrain = higher predation risk to fawns
      if (ctx.currentNodeType === 'plain') w *= 2;
      // Low cover = fawn more exposed
      const cover = ctx.currentNodeResources?.cover ?? 50;
      if (cover < 40) w *= 1.5;

      // Fragile fawns are more vulnerable
      if (ctx.animal.flags.has('fawn-fragile')) w *= 1.5;

      // Spring fawns are more vulnerable (younger)
      if (ctx.time.season === 'spring') w *= 1.3;

      return w;
    },
  },

  resolve(ctx) {
    // Predator type varies by terrain and season
    const predatorType = ctx.rng.pick(['coyote', 'coyote', 'bobcat', 'eagle']);
    const predatorNarrative: Record<string, string> = {
      coyote: 'A coyote appears at the clearing edge, nose down, following a scent trail toward where the fawn lies hidden. It moves with slow, patient steps.',
      bobcat: 'A tawny shape with tufted ears crouches low in the undergrowth. Its eyes are locked on the patch of ferns where your fawn lies.',
      eagle: 'A shadow passes overhead. A golden eagle circles lower with each pass. It has seen something in the grass. Your fawn.',
    };

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: 12, duration: 3, label: '+TRA' },
        { stat: StatId.ADV, amount: 8, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: predatorNarrative[predatorType],
      footnote: `Threat: ${predatorType}`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'predator',
        eventType: 'fawn-defense',
        entities: [smallPredatorEntity(predatorType as 'coyote' | 'bobcat' | 'eagle')],
        actions: [action(
          predatorNarrative[predatorType],
          `${predatorType.charAt(0).toUpperCase() + predatorType.slice(1)} targeting fawn. Maternal defense required.`,
          'high',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'charge',
        label: 'Charge the predator',
        description: 'Strike with your front hooves.',
        style: 'danger' as const,
        narrativeResult: 'You burst from cover, front hooves raised. You strike downward hard. The predator flinches.',
        modifyOutcome(base, innerCtx) {
          const fight = resolveFight(innerCtx, {
            opponentStrength: 25,
            opponentWeight: 35,
            opponentWeaponType: 'sharp',
            opponentTargetZone: innerCtx.rng.pick(['front-legs', 'torso', 'head']),
            opponentDamageRange: [15, 40],
            opponentStrikeLabel: 'predator bite',
            engagementType: 'strike',
            canDisengage: true,
            mutual: true,
          });

          if (fight.won) {
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [
                { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
                { stat: StatId.WIS, amount: 5, label: '+WIS' },
              ],
              consequences: [
                ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'fawn defense' }] : []),
              ],
              footnote: '(Predator driven off)',
            };
          } else {
            // Failed to drive off — fawn may be taken
            const fawnLost = innerCtx.rng.chance(0.3);
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [
                { stat: StatId.TRA, amount: 15, duration: 4, label: '+TRA' },
                { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM' },
              ],
              consequences: [
                ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'fawn defense' }] : []),
                ...(fawnLost ? [{ type: 'remove_flag' as const, flag: 'has-fawns' as any }] : []),
              ],
              footnote: fawnLost ? '(Fawn lost to predator)' : '(Predator retreated, fawn survives)',
            };
          }
        },
      },
      {
        id: 'distract',
        label: 'Feign injury to lure predator away',
        description: 'Drag a leg. Bleat. Draw the predator away from the fawn.',
        style: 'default' as const,
        narrativeResult: 'You stumble from cover, dragging one leg, bleating. The predator locks onto you instead. You limp away from the fawn, then run.',
        modifyOutcome(base, innerCtx) {
          // Distraction success depends on locomotion (need to outrun after luring)
          const successChance = 0.5 + (locomotion - 50) * 0.005;

          if (innerCtx.rng.chance(successChance)) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.TRA, amount: 5, duration: 2, label: '+TRA' },
                { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
                { stat: StatId.WIS, amount: 3, label: '+WIS' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: -120, source: 'luring predator' },
              ],
              footnote: '(Distraction succeeded)',
            };
          } else {
            // Failed distraction — predator catches up or returns to fawn
            const caughtByPredator = innerCtx.rng.chance(0.25);
            if (caughtByPredator) {
              // Predator catches the doe
              const chase = resolveChase(innerCtx, {
                predatorSpeed: 60,
                predatorEndurance: 50,
                packBonus: 0,
                strikeHarmType: 'sharp',
                strikeTargetZone: innerCtx.rng.pick(['hind-legs', 'torso']),
                strikeMagnitudeRange: [20, 45],
                strikeLabel: 'predator bite',
              });
              return {
                ...base,
                harmEvents: chase.harmEvents,
                statEffects: [
                  { stat: StatId.TRA, amount: 10, duration: 3, label: '+TRA' },
                ],
                consequences: [
                  ...(chase.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -chase.caloriesCost, source: 'predator pursuit' }] : []),
                ],
                footnote: '(Predator caught up)',
              };
            } else {
              // Predator returns to fawn
              const fawnLost = innerCtx.rng.chance(0.5);
              return {
                ...base,
                statEffects: [
                  { stat: StatId.TRA, amount: 12, duration: 4, label: '+TRA' },
                  { stat: StatId.HOM, amount: 10, duration: 4, label: '+HOM' },
                ],
                consequences: [
                  ...(fawnLost ? [{ type: 'remove_flag' as const, flag: 'has-fawns' as any }] : []),
                ],
                footnote: fawnLost ? '(Fawn lost to predator)' : '(Fawn stayed hidden)',
              };
            }
          }
        },
      },
    ];
  },
};

// ── Rut Display ──

export const RUT_DISPLAY_CONFIG: ReproductionTriggerConfig = {
  id: 'sim-rut-display',
  tags: ['mating', 'rut', 'social'],

  plausibility: {
    requiredSex: 'male',
    seasons: ['autumn'],
    requiredFlags: ['rut-active'],
    minAge: 18,
  },

  weight: {
    baseWeight: 0.06,
    computeWeight(ctx, base) {
      let w = base;

      // Mating behavior increases weight
      w *= 0.3 + ctx.behavior.mating * 0.3;

      // Higher body condition = more confident displays
      const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
      if (bcs >= 3) w *= 1.3;

      return w;
    },
  },

  resolve(ctx) {
    const weight = ctx.animal.weight;
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    const displayQuality = weight > 140 && bcs >= 3 ? 'impressive' : 'adequate';

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
        { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
      ],
      consequences: [],
      narrativeText: displayQuality === 'impressive'
        ? 'A doe stands at the meadow edge, head raised, testing the wind. Your neck is swollen. You hold your head high, antlers tilted forward. The tarsal gland smell pours off you. She watches, motionless.'
        : 'You catch a doe\'s scent through the hardwoods and follow it. When you find her, you arch your neck and present your antlers. She watches, then turns away. You circle and present again.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'reproduction',
        eventType: 'rut-display',
        entities: [conspecificEntity('doe', 'adult female deer')],
        actions: [action(
          displayQuality === 'impressive'
            ? 'Your scent reaches her. You approach stiff-legged, neck swollen. She watches, motionless.'
            : 'You catch the scent of a doe. You arch your neck and present your antlers. She turns away. You follow.',
          `Rut courtship display. Display quality: ${displayQuality}. Weight: ${weight}kg, BCS: ${bcs}/5. ${displayQuality === 'impressive' ? 'Strong physical condition supporting courtship signals.' : 'Suboptimal condition may reduce mating success.'}`,
          'medium',
        )],
        environment: buildEnvironment(ctx),
        emotionalTone: 'tension',
      }),
    };
  },

  getChoices(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    return [
      {
        id: 'pursue-doe',
        label: 'Pursue the courtship',
        description: 'Follow her. The chase will cost you.',
        style: 'default' as const,
        narrativeResult: 'You follow her for hours through the forest, matching her pace, never pressing too close. When she finally stops and holds still, you approach.',
        modifyOutcome(base, innerCtx) {
          // Mating chase costs significant calories
          const caloriesCost = 300 + (bcs < 3 ? 100 : 0);
          const mated = innerCtx.rng.chance(bcs >= 3 ? 0.6 : 0.3);

          return {
            ...base,
            statEffects: mated
              ? [
                  { stat: StatId.HOM, amount: -5, label: '-HOM' },
                  { stat: StatId.WIS, amount: 3, label: '+WIS' },
                ]
              : [
                  { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' },
                  { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
                ],
            consequences: [
              { type: 'add_calories' as const, amount: -caloriesCost, source: 'mating chase' },
              ...(mated ? [{ type: 'set_flag' as any, flag: 'mated-this-season' as any }] : []),
            ],
            footnote: mated ? '(Mating successful)' : '(Doe rejected pursuit)',
          };
        },
      },
      {
        id: 'conserve',
        label: 'Conserve energy for the next encounter',
        description: 'She is not interested. Walk away.',
        style: 'default' as const,
        narrativeResult: 'She pins her ears and glances over her shoulder. You break off. Her scent fades as the distance opens.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.HOM, amount: 3, duration: 2, label: '+HOM' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -50, source: 'brief courtship' },
            ],
          };
        },
      },
    ];
  },
};
