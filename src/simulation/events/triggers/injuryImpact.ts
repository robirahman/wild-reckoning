import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveForage } from '../../interactions/forage';

// ══════════════════════════════════════════════════
//  INJURY IMPACT
// ══════════════════════════════════════════════════
//
// Fires when locomotion or digestion capability is significantly impaired.
// Makes the injury→functional impairment feedback loop visible:
// "your injured leg makes foraging agonizing."
// Presents risk/reward choices modified by the specific impairment.

function getLocomotion(animal: { bodyState?: { capabilities: Record<string, number> } }): number {
  return animal.bodyState?.capabilities['locomotion'] ?? 100;
}

function getDigestion(animal: { bodyState?: { capabilities: Record<string, number> } }): number {
  return animal.bodyState?.capabilities['digestion'] ?? 100;
}

export const injuryImpactTrigger: SimulationTrigger = {
  id: 'sim-injury-impact',
  category: 'environmental',
  tags: ['danger'],

  isPlausible(ctx) {
    const locomotion = getLocomotion(ctx.animal);
    const digestion = getDigestion(ctx.animal);
    // Fire when either capability is significantly impaired
    return locomotion < 80 || digestion < 80;
  },

  computeWeight(ctx) {
    const locomotion = getLocomotion(ctx.animal);
    const digestion = getDigestion(ctx.animal);
    let base = 0.06;

    // More impaired = more likely to fire (the injury is harder to ignore)
    const worstCapability = Math.min(locomotion, digestion);
    if (worstCapability < 60) base *= 1.5;
    if (worstCapability < 40) base *= 2;

    return base;
  },

  resolve(ctx) {
    const locomotion = getLocomotion(ctx.animal);
    const digestion = getDigestion(ctx.animal);

    const locoImpaired = locomotion < 80;
    const digestImpaired = digestion < 80;

    let narrative: string;
    if (locoImpaired && digestImpaired) {
      narrative = 'Your body is failing on multiple fronts. The injured leg forces a limping gait that makes every step a negotiation with pain, while something inside your gut has gone wrong — each mouthful of browse sits heavy and undigested, the nutrition passing through you like water through a sieve. You are burning more energy than you can extract, and the deficit is accelerating.';
    } else if (locoImpaired) {
      const severity = locomotion < 50 ? 'severe' : 'moderate';
      if (severity === 'severe') {
        narrative = 'The leg barely holds you. Each step sends a bolt of pain from hoof to hip that makes your vision blur. You can manage a walk — barely — but running is beyond you. The realization settles with cold clarity: if anything forces you to sprint, you cannot. Your survival now depends entirely on not being tested.';
      } else {
        narrative = 'The injury has settled into a persistent ache that flares with each stride. You can still move, still forage, still run if pressed — but everything takes more effort, costs more energy, produces more pain. You find yourself favoring the good leg, shortening your gait, spending longer at each food source because traveling between them hurts.';
      }
    } else {
      narrative = 'Something is wrong inside. The food goes down but the nutrition doesn\'t seem to arrive — your rumen works sluggishly, distended and gassy, failing to extract what your body needs from the browse. You eat and eat but the hunger doesn\'t recede. The injury to your gut is invisible but its effects are not: you are starving on a full stomach.';
    }

    return {
      harmEvents: [],
      statEffects: [
        ...(locoImpaired ? [{ stat: StatId.TRA, amount: Math.round((80 - locomotion) * 0.15), duration: 2, label: '+TRA' }] : []),
        ...(digestImpaired ? [{ stat: StatId.HOM, amount: Math.round((80 - digestion) * 0.15), duration: 2, label: '+HOM' }] : []),
      ],
      consequences: [],
      narrativeText: narrative,
    };
  },

  getChoices(ctx) {
    const locomotion = getLocomotion(ctx.animal);
    const digestion = getDigestion(ctx.animal);

    if (digestion < 80) {
      // Digestive impairment: choices about what to eat
      return [
        {
          id: 'selective-browse',
          label: 'Eat only the most digestible food',
          description: 'Less calories, but your damaged gut can handle it.',
          style: 'default',
          narrativeResult: 'You become picky — seeking out only the tenderest shoots, the softest buds, food that requires minimal breakdown. Your gut protests less. The calories are fewer, but they actually reach your bloodstream.',
          modifyOutcome(base, innerCtx) {
            const forage = resolveForage(innerCtx, {
              foodType: 'browse',
              baseCalories: 60,
              toxicityRisk: 0.01,
              predationExposure: 0.03,
              humanProximity: 0,
            });
            return {
              ...base,
              harmEvents: forage.toxicHarm,
              statEffects: [
                { stat: StatId.WIS, amount: 2, label: '+WIS' },
                { stat: StatId.HOM, amount: -3, label: '-HOM' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: forage.caloriesGained, source: 'selective-browse' },
              ],
            };
          },
        },
        {
          id: 'force-eat',
          label: 'Force down as much as you can',
          description: 'Quantity over quality. Risky with a damaged gut.',
          style: 'danger',
          narrativeResult: 'You eat everything within reach — bark, dead leaves, half-frozen grass, the bitter twigs you would normally ignore. Your gut distends painfully, working overtime to extract what it can from the bulk. Some of it passes through undigested. But some gets through.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
              ],
              consequences: [
                { type: 'add_calories' as const, amount: 90, source: 'force-feeding' },
              ],
            };
          },
        },
      ];
    }

    // Locomotion impairment: choices about movement risk
    return [
      {
        id: 'rest',
        label: 'Rest and let the leg recover',
        description: 'No foraging, but the injury may improve.',
        style: 'default',
        narrativeResult: 'You find a sheltered spot and fold your legs carefully beneath you, taking the weight off the damaged limb. For a long time you simply lie still, feeling the slow pulse of your own healing. The hunger builds, but the pain ebbs slightly.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.TRA, amount: -3, label: '-TRA' },
              { stat: StatId.HOM, amount: 3, duration: 1, label: '+HOM' },
            ],
            consequences: [],
            footnote: '(Rested)',
          };
        },
      },
      {
        id: 'push-through',
        label: 'Push through the pain to forage',
        description: `Keep feeding despite the injury.${locomotion < 50 ? ' This will be agonizing.' : ''}`,
        style: locomotion < 40 ? 'danger' : 'default',
        narrativeResult: 'You haul yourself up and move, each step a small battle between need and pain. The browse is there, waiting, and your body needs it more than it needs rest. You eat steadily, shifting your weight to spare the injured leg, finding a rhythm between bites that almost lets you forget the damage.',
        modifyOutcome(base, innerCtx) {
          const forage = resolveForage(innerCtx, {
            foodType: 'browse',
            baseCalories: 80,
            toxicityRisk: 0.02,
            predationExposure: 0.05,
            humanProximity: 0,
          });
          return {
            ...base,
            harmEvents: forage.toxicHarm,
            statEffects: [
              { stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' },
              { stat: StatId.HOM, amount: -4, label: '-HOM' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: forage.caloriesGained, source: 'injured-foraging' },
            ],
            footnote: forage.detectedByPredator ? '(A predator noticed your limping gait)' : undefined,
          };
        },
      },
    ];
  },
};
