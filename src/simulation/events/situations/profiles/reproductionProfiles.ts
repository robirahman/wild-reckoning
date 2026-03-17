import type { SimulationContext, SimulationChoice, SimulationOutcome } from '../../types';
import type { Situation } from '../types';
import { StatId } from '../../../../types/stats';
import { resolveChase } from '../../../interactions/chase';
import { resolveFight } from '../../../interactions/fight';
import { buildEnvironment, action, buildNarrativeContext, conspecificEntity, smallPredatorEntity } from '../../../narrative/contextBuilder';
import { rivalBuckEntity } from '../../../narrative/perspective';
import { getEncounterRate } from '../../../calibration/calibrator';
import type { ContextualFragment } from '../../../narrative/templates/shared';

// ══════════════════════════════════════════════════
//  REPRODUCTION PROFILES
// ══════════════════════════════════════════════════

export interface ReproductionProfile {
  id: string;
  tags: string[];

  /** Required sex */
  sex: 'male' | 'female';
  /** Allowed seasons (undefined = all) */
  seasons?: string[];
  /** All must be present */
  requiredFlags?: string[];
  /** Any present blocks */
  blockingFlags?: string[];
  /** Minimum age in months */
  minAge?: number;

  /** Base selection weight */
  baseWeight: number;
  /** Calibration cause ID for calibrated rates */
  calibrationCauseId?: string;
  /** Fraction of calibrated rate */
  rateFraction?: number;

  /** Custom weight computation */
  computeWeight: (ctx: SimulationContext, situations: Situation[], base: number) => number;

  /** Extra plausibility beyond sex/season/flags */
  extraPlausibility?: (ctx: SimulationContext) => boolean;

  /** Narratives pool */
  narratives: ContextualFragment[];
  clinicalDetail: string;
  emotionalTone: string;

  /** Resolve the event */
  resolve: (ctx: SimulationContext, situations: Situation[]) => SimulationOutcome;
  /** Build player choices */
  choices: (ctx: SimulationContext, situations: Situation[]) => SimulationChoice[];
}

// ── Fawn Birth ──

export const FAWN_BIRTH_PROFILE: ReproductionProfile = {
  id: 'fawn-birth',
  tags: ['mating', 'fawn'],
  sex: 'female',
  seasons: ['spring'],
  blockingFlags: ['has-fawns'],
  minAge: 12,

  baseWeight: 0.1,
  clinicalDetail: 'Parturition event',
  emotionalTone: 'relief',

  narratives: [
    { text: 'The contractions begin at dawn, deep and rhythmic, pulling you into a crouch in the densest cover you can find.' },
  ],

  computeWeight(ctx, _situations, base) {
    let w = base;
    if (ctx.animal.flags.has('mated') || ctx.animal.flags.has('mated-this-season')) {
      w = 0.25;
    }
    if (ctx.time.monthIndex >= 4 && ctx.time.monthIndex <= 5) w *= 1.5;
    return w;
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const cover = ctx.currentNodeResources?.cover ?? 50;

    const viableNarrative = bcs >= 3
      ? 'The birth is swift. Two fawns — twins. They come out wet, trembling, spotted coats steaming in the warm air. Within an hour, small mouths find the teat and latch.'
      : bcs >= 2
        ? 'The labor is hard. A single fawn emerges, small but breathing, quick shallow gasps. You lick it clean. It wobbles upright, legs fold, wobbles again.'
        : 'The fawn is born too small. You lick it, nudge it, but its legs fold under every attempt to stand. The spotted coat seems too large for the body beneath it, and its breathing is labored.';

    const coverNarrative = cover >= 50
      ? 'The thicket provides excellent cover — tall ferns and dense undergrowth that will hide the fawn during its first vulnerable days.'
      : 'The cover here is thin. You will need to be vigilant — a hidden fawn is a safe fawn, and there is not enough hiding to go around.';

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
        ...(bcs <= 1 ? [{ type: 'set_flag' as any, flag: 'fawn-fragile' as any }] : []),
      ],
      narrativeText: `The contractions begin at dawn, deep and rhythmic, pulling you into a crouch in the densest cover you can find. ${viableNarrative} ${coverNarrative} You eat the placenta — every calorie matters now, and the scent would draw predators. Then you move away from the birth site, putting distance between yourself and the hidden fawn. You will return to nurse, but for now, absence is the fawn's best defense.`,
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

  choices() {
    return [];
  },
};

// ── Fawn Defense ──

export const FAWN_DEFENSE_PROFILE: ReproductionProfile = {
  id: 'fawn-defense',
  tags: ['predator', 'fawn', 'danger', 'mating'],
  sex: 'female',
  seasons: ['spring', 'summer'],
  requiredFlags: ['has-fawns'],

  baseWeight: 0.04,
  clinicalDetail: 'Maternal defense against fawn predator',
  emotionalTone: 'fear',

  narratives: [
    { text: 'A predator has been drawn to where your fawn lies hidden.' },
  ],

  computeWeight(ctx, situations, base) {
    let w = base;
    if (ctx.currentNodeType === 'plain') w *= 2;
    const cover = ctx.currentNodeResources?.cover ?? 50;
    if (cover < 40) w *= 1.5;
    if (ctx.animal.flags.has('fawn-fragile')) w *= 1.5;
    if (ctx.time.season === 'spring') w *= 1.3;
    // Terrain exposure from situations enhances weight
    if (situations.some(s => s.type === 'terrain-feature' && s.source === 'exposed')) w *= 1.3;
    return w;
  },

  resolve(ctx) {
    const predatorType = ctx.rng.pick(['coyote', 'coyote', 'bobcat', 'eagle']);
    const predatorNarrative: Record<string, string> = {
      coyote: 'The coyote appears at the edge of the clearing, nose down, following the invisible trail of scent that leads to your hidden fawn. It moves with patient, methodical purpose — a specialist in finding what does not want to be found.',
      bobcat: 'The bobcat materializes from nothing — one moment the undergrowth is empty, the next a tawny shape with tufted ears is crouching low, eyes locked on the patch of ferns where your fawn lies hidden.',
      eagle: 'The shadow passes overhead first — a golden eagle, its wingspan enormous, circling lower with each pass. It has spotted something in the grass. Your fawn.',
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

  choices(ctx) {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'charge',
        label: 'Charge the predator',
        description: 'Attack with your hooves. Does are fierce defenders.',
        style: 'danger' as const,
        narrativeResult: 'You charge from cover, front hooves raised. You strike downward at the predator with bone-cracking force, placing yourself between it and the fawn.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
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
        description: 'Broken-wing display. Draw the predator from the fawn.',
        style: 'default' as const,
        narrativeResult: 'You stumble from cover, dragging one leg as if it were broken, bleating in distress. The performance is automatic and convincing. Your body knows how to do this. The predator\'s attention locks onto you, the easier prey, and it follows as you limp away from the fawn, gradually increasing your speed until you are running flat out and the predator realizes it has been duped.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
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
            const caughtByPredator = innerCtx.rng.chance(0.25);
            if (caughtByPredator) {
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

export const RUT_DISPLAY_PROFILE: ReproductionProfile = {
  id: 'rut-display',
  tags: ['mating', 'rut', 'social'],
  sex: 'male',
  seasons: ['autumn'],
  requiredFlags: ['rut-active'],
  minAge: 18,

  baseWeight: 0.06,
  clinicalDetail: 'Rut courtship display',
  emotionalTone: 'tension',

  narratives: [
    { text: 'A doe stands at the far edge of the meadow, her head raised, testing the wind.' },
  ],

  computeWeight(ctx, _situations, base) {
    let w = base;
    w *= 0.3 + ctx.behavior.mating * 0.3;
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    if (bcs >= 3) w *= 1.3;
    return w;
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
        ? 'A doe stands at the far edge of the meadow, her head raised, testing the wind. Your scent reaches her — testosterone, tarsal gland secretions, the chemical resume of your fitness. You approach with the stiff-legged, head-high gait of courtship, your neck swollen, your polished antlers catching the light. You are advertising everything you are: your weight, your health, your genetic quality. She watches, motionless, assessing.'
        : 'You catch the scent of a doe and follow it through the hardwoods, your body rigid with urgency. When you find her, you approach carefully — the display must be convincing despite your condition. You arch your neck, raise your head, and present your antlers. She watches for a long moment, then turns away. You follow, persistent, circling to present yourself again.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'reproduction',
        eventType: 'rut-display',
        entities: [conspecificEntity('doe', 'adult female deer')],
        actions: [action(
          displayQuality === 'impressive'
            ? 'Your scent reaches her. You approach with the courtship gait, neck swollen, antlers catching the light. She watches, motionless, assessing.'
            : 'You catch the scent of a doe. The display must be convincing despite your condition. She watches, then turns away. You follow, persistent.',
          `Rut courtship display. Display quality: ${displayQuality}. Weight: ${weight}kg, BCS: ${bcs}/5. ${displayQuality === 'impressive' ? 'Strong physical condition supporting courtship signals.' : 'Suboptimal condition may reduce mating success.'}`,
          'medium',
        )],
        environment: buildEnvironment(ctx),
        emotionalTone: 'tension',
      }),
    };
  },

  choices(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    return [
      {
        id: 'pursue-doe',
        label: 'Pursue the courtship',
        description: 'Invest energy in the mating chase. Exhausting but biologically imperative.',
        style: 'default' as const,
        narrativeResult: 'You follow her for hours through the forest, matching her pace, never pressing too close. The courtship chase is a test of endurance as much as fitness — she is measuring your stamina, your persistence, your ability to keep up without flagging. When she finally stops and allows you to approach, the relief is as physical as the triumph.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
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
        description: 'This doe isn\'t interested. Save your strength.',
        style: 'default' as const,
        narrativeResult: 'You break off the pursuit, recognizing the signs of rejection in her body language — the pinned ears, the quick glances over her shoulder that say "don\'t follow." There will be other does. The rut is long, and stamina is the currency that matters most.',
        modifyOutcome(base: SimulationOutcome) {
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

// ── Rut Combat ──

export const RUT_COMBAT_PROFILE: ReproductionProfile = {
  id: 'rut-combat',
  tags: ['confrontation', 'territorial', 'mating'],
  sex: 'male',
  seasons: ['autumn'],
  minAge: 18,

  baseWeight: 0.015,
  calibrationCauseId: 'intraspecific',
  clinicalDetail: 'Intraspecific rut combat',
  emotionalTone: 'aggression',

  narratives: [
    { text: 'The scraping sound reaches you first — antler against bark, rhythmic and aggressive.' },
  ],

  computeWeight(ctx, situations, base) {
    if (ctx.calibratedRates) {
      base = getEncounterRate(ctx.calibratedRates, 'intraspecific', ctx.time.season);
    }
    base *= 0.5 + ctx.behavior.belligerence * 0.3;

    const hasRival = ctx.npcs?.some((n) => n.type === 'rival' && n.alive);
    if (hasRival) base *= 2;

    // Conspecific nearby boosts
    if (situations.some(s => s.type === 'conspecific-nearby')) base *= 1.3;

    return base;
  },

  resolve(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'another buck';

    const narrative = `The scraping sound reaches you first — antler against bark, rhythmic and aggressive. Then you see ${rivalName}, raking a sapling with slow, deliberate fury, leaving bright wounds in the wood. Your scent reaches the other buck at the same moment their scent reaches you. The air between you thickens with testosterone and territorial rage. The other buck turns, lowers their rack, and begins to walk toward you with a stiff-legged gait that means one thing.`;

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
        { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: narrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'rut-combat',
        entities: [rivalBuckEntity(rivalName)],
        actions: [action(
          'The other buck turns, lowers their rack, and begins to walk toward you with a stiff-legged gait that means one thing.',
          `Rut combat challenge from ${rivalName}. Intraspecific territorial/mating competition.`,
          'high',
        )],
        environment: buildEnvironment(ctx),
        emotionalTone: 'aggression',
      }),
    };
  },

  choices(ctx) {
    const rivalWeight = ctx.rng.int(100, 180);
    const rivalStrength = 40 + rivalWeight * 0.1 + ctx.rng.int(-5, 5);

    const rutFightParams = {
      opponentStrength: rivalStrength,
      opponentWeight: rivalWeight,
      opponentWeaponType: 'blunt' as const,
      opponentTargetZone: ctx.rng.pick(['head', 'neck', 'front-legs'] as const),
      opponentDamageRange: [35, 65] as [number, number],
      opponentStrikeLabel: 'antler strike',
      engagementType: 'charge' as const,
      canDisengage: false,
      mutual: true,
    };

    return [
      {
        id: 'engage',
        label: 'Lower your antlers and charge',
        description: `Meet the challenge. ${ctx.animal.weight > rivalWeight ? 'You outweigh the rival.' : 'The rival looks formidable.'}`,
        style: (ctx.animal.weight < rivalWeight * 0.8 ? 'danger' : 'default') as 'danger' | 'default',
        narrativeResult: 'You lower your rack and drive forward. The impact is tremendous — a crack like a breaking branch as antler meets antler, tines interlocking, muscles straining. You shove with everything you have, hooves tearing at the ground for purchase, necks twisting as you try to throw the other buck off balance.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const fight = resolveFight(innerCtx, rutFightParams);

          if (fight.won) {
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [
                { stat: StatId.WIS, amount: 3, label: '+WIS' },
                { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
              ],
              consequences: [
                { type: 'set_flag', flag: 'rut-challenge-won' as any },
                ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rut combat' }] : []),
                ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
              ],
              footnote: '(Won the fight)',
            };
          } else {
            return {
              ...base,
              harmEvents: fight.harmToPlayer,
              statEffects: [
                { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
                { stat: StatId.HOM, amount: 10, duration: 3, label: '+HOM' },
              ],
              consequences: [
                ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rut combat' }] : []),
                ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
              ],
              footnote: '(Lost the fight)',
            };
          }
        },
      },
      {
        id: 'posture',
        label: 'Posture and intimidate',
        description: 'Display your size without committing to combat.',
        style: 'default' as const,
        narrativeResult: 'You turn broadside, making yourself as large as possible, neck arched, muscles taut. You rake the ground with a hoof and snort — a challenge that says "look how big I am." The other buck hesitates, measures you, and after a tense moment either accepts the display or presses forward.',
        modifyOutcome(base: SimulationOutcome, innerCtx: SimulationContext) {
          const postureResult = resolveFight(innerCtx, {
            ...rutFightParams,
            engagementType: 'strike',
            opponentDamageRange: [20, 45],
          });

          if (postureResult.won) {
            return {
              ...base,
              harmEvents: [],
              statEffects: [
                { stat: StatId.WIS, amount: 2, label: '+WIS' },
                { stat: StatId.TRA, amount: -3, label: '-TRA' },
              ],
              consequences: [],
              footnote: '(Rival backed down)',
            };
          } else {
            return {
              ...base,
              harmEvents: postureResult.harmToPlayer,
              statEffects: [
                { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' },
              ],
              consequences: postureResult.deathCause
                ? [{ type: 'death', cause: postureResult.deathCause }]
                : [],
              footnote: '(Rival called your bluff)',
            };
          }
        },
      },
      {
        id: 'retreat',
        label: 'Yield and withdraw',
        description: 'Turn away. Discretion over valor.',
        style: 'default' as const,
        narrativeResult: 'You break eye contact first, turning your body away in the universal gesture of submission. The other buck watches you go with a stiff, imperious posture, having won without a blow. Your pride stings, but your body is intact.',
        modifyOutcome(base: SimulationOutcome) {
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
              { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
            ],
            consequences: [],
          };
        },
      },
    ];
  },
};

export const REPRODUCTION_PROFILES: Record<string, ReproductionProfile> = {
  'fawn-birth': FAWN_BIRTH_PROFILE,
  'fawn-defense': FAWN_DEFENSE_PROFILE,
  'rut-display': RUT_DISPLAY_PROFILE,
  'rut-combat': RUT_COMBAT_PROFILE,
};
