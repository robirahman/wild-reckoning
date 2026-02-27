import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveChase } from '../../interactions/chase';
import { resolveFight } from '../../interactions/fight';
import { buildEnvironment, action, buildNarrativeContext, conspecificEntity, smallPredatorEntity } from '../../narrative/contextBuilder';
// resolveSocial reserved for future mating social dynamics

// ══════════════════════════════════════════════════
//  FAWN BIRTH — spring birthing event
// ══════════════════════════════════════════════════

export const fawnBirthTrigger: SimulationTrigger = {
  id: 'sim-fawn-birth',
  category: 'reproduction',
  tags: ['mating', 'fawn'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'female') return false;
    if (ctx.time.season !== 'spring') return false;
    if (ctx.animal.flags.has('has-fawns')) return false;
    if (ctx.animal.age < 12) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.1;

    // Does that mated last autumn are much more likely to birth
    if (ctx.animal.flags.has('mated') || ctx.animal.flags.has('mated-this-season')) {
      base = 0.25;
    }

    // Late spring = higher urgency (fawns should arrive by June)
    if (ctx.time.monthIndex >= 4 && ctx.time.monthIndex <= 5) base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    const cover = ctx.currentNodeResources?.cover ?? 50;

    // Fawn viability depends on mother's body condition
    const viableNarrative = bcs >= 3
      ? 'The birth is swift. Two fawns — twins, as is common for a well-nourished doe. They are perfect: damp, trembling, their spotted coats already drying in the warm air. Within an hour, they are nursing, their tiny mouths finding the teat with an instinct older than consciousness.'
      : bcs >= 2
        ? 'The labor is hard — harder than it should be. Your depleted body struggles to complete what it started months ago. A single fawn emerges, small but alive, its breath coming in quick, shallow gasps. You lick it clean with desperate urgency, willing it to stand.'
        : 'The fawn is born too small. You lick it, nudge it, but its legs fold under every attempt to stand. The spotted coat seems too large for the body beneath it, and its breathing is labored. Your body had too little to give.';

    // Cover quality affects early fawn survival
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
        // Low BCS fawn is fragile (potential future event triggers on this)
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

  getChoices() {
    return []; // Birth is not a choice event
  },
};

// ══════════════════════════════════════════════════
//  FAWN DEFENSE — doe protecting fawn from predator
// ══════════════════════════════════════════════════

export const fawnDefenseTrigger: SimulationTrigger = {
  id: 'sim-fawn-defense',
  category: 'reproduction',
  tags: ['predator', 'fawn', 'danger', 'mating'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'female') return false;
    if (!ctx.animal.flags.has('has-fawns')) return false;
    // Fawn predation risk is highest spring-summer
    if (ctx.time.season !== 'spring' && ctx.time.season !== 'summer') return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.04;

    // Open terrain = higher predation risk to fawns
    if (ctx.currentNodeType === 'plain') base *= 2;
    // Low cover = fawn more exposed
    const cover = ctx.currentNodeResources?.cover ?? 50;
    if (cover < 40) base *= 1.5;

    // Fragile fawns are more vulnerable
    if (ctx.animal.flags.has('fawn-fragile')) base *= 1.5;

    // Spring fawns are more vulnerable (younger)
    if (ctx.time.season === 'spring') base *= 1.3;

    return base;
  },

  resolve(ctx) {
    // Predator type varies by terrain and season
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

  getChoices(ctx) {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'charge',
        label: 'Charge the predator',
        description: 'Attack with your hooves. Does are fierce defenders.',
        style: 'danger' as const,
        narrativeResult: 'You explode from cover, front hooves raised like hammers. The maternal fury that drives you is absolute — every fiber of your being is focused on destroying the threat to your fawn. You strike downward with bone-cracking force.',
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
        description: 'Broken-wing display. Draw the predator from the fawn.',
        style: 'default' as const,
        narrativeResult: 'You stumble from cover, dragging one leg as if it were broken, bleating in distress. The performance is ancient and convincing — every doe knows this dance. The predator\'s attention locks onto you, the easier prey, and it follows as you limp away from the fawn, gradually increasing your speed until you are running flat out and the predator realizes it has been duped.',
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

// ══════════════════════════════════════════════════
//  RUT DISPLAY — mating approach and courtship
// ══════════════════════════════════════════════════

export const rutDisplayTrigger: SimulationTrigger = {
  id: 'sim-rut-display',
  category: 'reproduction',
  tags: ['mating', 'rut', 'social'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn') return false;
    if (!ctx.animal.flags.has('rut-active')) return false;
    if (ctx.animal.age < 18) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.06;

    // Mating behavior increases weight
    base *= 0.3 + ctx.behavior.mating * 0.3;

    // Higher body condition = more confident displays
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
    if (bcs >= 3) base *= 1.3;

    return base;
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

  getChoices(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    return [
      {
        id: 'pursue-doe',
        label: 'Pursue the courtship',
        description: 'Invest energy in the mating chase. Exhausting but biologically imperative.',
        style: 'default' as const,
        narrativeResult: 'You follow her for hours through the forest, matching her pace, never pressing too close. The courtship chase is a test of endurance as much as fitness — she is measuring your stamina, your persistence, your ability to keep up without flagging. When she finally stops and allows you to approach, the relief is as physical as the triumph.',
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
        description: 'This doe isn\'t interested. Save your strength.',
        style: 'default' as const,
        narrativeResult: 'You break off the pursuit, recognizing the signs of rejection in her body language — the pinned ears, the quick glances over her shoulder that say "don\'t follow." There will be other does. The rut is long, and stamina is the currency that matters most.',
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
