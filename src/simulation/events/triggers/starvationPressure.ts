import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveForage } from '../../interactions/forage';

// ══════════════════════════════════════════════════
//  STARVATION PRESSURE
// ══════════════════════════════════════════════════
//
// Fires when the animal is in poor body condition AND negative energy balance.
// Makes the injury→foraging failure→starvation feedback loop visible to
// the player by presenting a choice: risk exposure for better food, or
// conserve energy in safety.

export const starvationPressureTrigger: SimulationTrigger = {
  id: 'sim-starvation-pressure',
  category: 'environmental',
  tags: ['danger', 'foraging', 'food'],

  isPlausible(ctx) {
    const physio = ctx.animal.physiologyState;
    if (!physio) return false;
    // Fire when BCS ≤ 2 and in sustained negative energy balance
    return physio.bodyConditionScore <= 2 && physio.negativeEnergyBalance;
  },

  computeWeight(ctx) {
    const physio = ctx.animal.physiologyState!;
    let base = 0.12;

    // More urgent at BCS 1
    if (physio.bodyConditionScore <= 1) base *= 2;

    // More urgent with deeply negative caloric balance
    if (physio.avgCaloricBalance < -80) base *= 1.5;

    // Winter compounds the desperation
    if (ctx.time.season === 'winter') base *= 1.5;

    return base;
  },

  resolve(ctx) {
    const physio = ctx.animal.physiologyState!;
    const bcs = physio.bodyConditionScore;

    let narrative: string;
    if (bcs <= 1) {
      narrative = 'Your body is consuming itself. The muscles along your spine have wasted to cables of sinew over bone, and your haunches have hollowed into cavities where fat once lay. Every movement costs more than the last. The hunger is no longer a sensation — it is your entire existence, a void that pulls at you from the inside. You need food. Any food. Now.';
    } else {
      narrative = 'The hunger has been building for days, a persistent gnawing that has shifted from discomfort to urgency. Your ribs are starting to show through your thinning coat, and there is a tremor in your legs that wasn\'t there before. The safe browse in the forest understory is picked over, barely enough to sustain you. But beyond the tree line, you can smell something richer.';
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HOM, amount: bcs <= 1 ? 12 : 6, duration: 2, label: '+HOM' },
      ],
      consequences: [],
      narrativeText: narrative,
    };
  },

  getChoices(ctx) {
    const terrain = ctx.currentNodeType ?? 'forest';
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

    return [
      {
        id: 'risk-open',
        label: 'Risk the open ground for better browse',
        description: `Exposed feeding, but the calories are worth it.${locomotion < 60 ? ' Your legs make fleeing difficult.' : ''}`,
        style: locomotion < 50 ? 'danger' : 'default',
        narrativeResult: 'You push past the tree line into the open, where the grasses are thicker and the browse untouched. Every nerve screams that you are exposed — a silhouette against the sky. But the food is here, and your body demands it.',
        modifyOutcome(base, innerCtx) {
          const forage = resolveForage(innerCtx, {
            foodType: terrain === 'plain' ? 'grass' : 'browse',
            baseCalories: 120,
            toxicityRisk: 0.02,
            predationExposure: 0.08,
            humanProximity: terrain === 'plain' ? 0.04 : 0,
          });

          const consequences: any[] = [];
          if (forage.caloriesGained !== 0) {
            consequences.push({ type: 'add_calories' as const, amount: forage.caloriesGained, source: 'desperate-foraging' });
          }
          if (forage.detectedByPredator) {
            consequences.push({ type: 'set_flag' as const, flag: 'predator-alerted' as any });
          }

          return {
            ...base,
            harmEvents: forage.toxicHarm,
            statEffects: [
              { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
              { stat: StatId.HOM, amount: -5, label: '-HOM' },
            ],
            consequences,
            footnote: forage.detectedByPredator ? '(A predator noticed you)' : '(Fed successfully)',
          };
        },
      },
      {
        id: 'conserve',
        label: 'Stay in cover and conserve energy',
        description: 'Safer, but the deficit grows.',
        style: 'default',
        narrativeResult: 'You stay where you are, tucked into the understory, scraping at bark and dead leaves. The food is poor — barely enough to quiet the ache in your gut, let alone reverse the decline. But at least you are hidden.',
        modifyOutcome(base) {
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: 20, source: 'minimal-foraging' },
            ],
          };
        },
      },
      {
        id: 'strip-bark',
        label: 'Strip bark from the nearest tree',
        description: 'Desperate, low-calorie food. Hard on your teeth.',
        style: 'default',
        narrativeResult: 'You press your incisors against the trunk and pull, peeling long strips of inner bark that taste of turpentine and desperation. Your teeth ache with the effort. The bark provides some carbohydrates — just enough to keep your body from burning its last reserves tonight.',
        modifyOutcome(base) {
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              { stat: StatId.HOM, amount: -2, label: '-HOM' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: 40, source: 'bark-stripping' },
            ],
          };
        },
      },
    ];
  },
};
