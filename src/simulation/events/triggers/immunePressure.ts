import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';

// ══════════════════════════════════════════════════
//  IMMUNE CRISIS
// ══════════════════════════════════════════════════
//
// Fires when the animal is immunocompromised (immune load > capacity).
// Makes the immune feedback loop visible: malnutrition → immune compromise →
// infections worsen → more immune load → more calorie drain → more malnutrition.

export const immunePressureTrigger: SimulationTrigger = {
  id: 'sim-immune-pressure',
  category: 'environmental',
  tags: ['danger'],

  isPlausible(ctx) {
    const physio = ctx.animal.physiologyState;
    if (!physio) return false;
    return physio.immunocompromised;
  },

  computeWeight(ctx) {
    const physio = ctx.animal.physiologyState!;
    let base = 0.08;

    // Heavier immune overload = more likely to manifest as an event
    const overloadRatio = physio.immuneLoad / Math.max(10, physio.immuneCapacity);
    if (overloadRatio > 1.5) base *= 1.5;
    if (overloadRatio > 2.0) base *= 2;

    // Compounded by poor body condition
    if (physio.bodyConditionScore <= 2) base *= 1.3;

    return base;
  },

  resolve(ctx) {
    const conditions = ctx.animal.bodyState?.conditions ?? [];
    const hasInfection = conditions.some(c => c.infectionLevel > 0);
    const parasiteCount = ctx.animal.parasites.length;

    let narrative: string;
    if (hasInfection && parasiteCount > 0) {
      narrative = 'Your body is fighting a war on multiple fronts, and losing. The infected wound throbs with dull, constant heat, while the parasites drain resources your immune system desperately needs. A lethargy has settled over you like a heavy blanket — not the comfortable drowsiness of rest, but the bone-deep exhaustion of a body spending everything it has on staying alive and falling short. Your eyes are dull. Your coat is rough. Even breathing feels like work.';
    } else if (hasInfection) {
      narrative = 'The wound that should have closed days ago is getting worse. The flesh around it is hot and swollen, weeping a thin, foul-smelling fluid. A fever has taken hold — your body throwing everything it has at the invasion, burning through calories it cannot spare. You feel simultaneously burning and freezing, your body\'s thermostat broken by the immune response. The infection is winning.';
    } else if (parasiteCount > 0) {
      narrative = 'The parasites are taking their toll. You can feel them — not as individual creatures, but as a pervasive drain, a constant tax on every system. Your coat has thinned in patches. Your appetite is ravenous but your body can\'t seem to keep up. The immune response that should be controlling them has been overwhelmed by malnutrition and stress, and now they multiply unchecked.';
    } else {
      narrative = 'A profound fatigue has settled into your body. Your immune system, depleted by the cumulative stress of survival, has reached its breaking point. Wounds heal slowly. Scratches that should be trivial fester and redden. Your body no longer has the reserves to fight on every front, and the vulnerability shows in your dull coat, your sunken eyes, your labored breathing.';
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.IMM, amount: 8, duration: 2, label: '+IMM' },
        { stat: StatId.HEA, amount: -4, label: '-HEA' },
      ],
      consequences: [],
      narrativeText: narrative,
    };
  },

  getChoices(ctx) {
    const bcs = ctx.animal.physiologyState?.bodyConditionScore ?? 3;

    return [
      {
        id: 'rest-recover',
        label: 'Find a quiet place and rest',
        description: 'Let your body redirect energy to immune function.',
        style: 'default',
        narrativeResult: 'You find a sheltered depression beneath the low branches of a hemlock, its needles forming a fragrant canopy overhead. You lie still for a long time, your body doing its invisible work — white blood cells marshaling, fever burning off invaders, damaged tissue slowly knitting. The hunger is a price you pay for healing.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.IMM, amount: -5, duration: 2, label: '-IMM' },
              { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
              { stat: StatId.TRA, amount: -2, label: '-TRA' },
            ],
            consequences: [
              // Resting means no foraging
              { type: 'add_calories' as const, amount: -30, source: 'immune-rest' },
            ],
          };
        },
      },
      {
        id: 'forage-anyway',
        label: 'Push through and keep foraging',
        description: `Your body needs fuel to fight infection.${bcs <= 1 ? ' But you barely have the energy to stand.' : ''}`,
        style: bcs <= 1 ? 'danger' : 'default',
        narrativeResult: 'You drag yourself to your feet and force your body to do what it least wants to do: move. The foraging is slow and painful, every step a negotiation between the demands of hunger and the demands of healing. But your body needs fuel — without calories, even your immune system shuts down.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.IMM, amount: 3, duration: 2, label: '+IMM' },
              { stat: StatId.HOM, amount: -3, label: '-HOM' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: 50, source: 'sick-foraging' },
            ],
          };
        },
      },
      {
        id: 'water-seek',
        label: 'Seek out water',
        description: 'Hydration helps your body fight the infection.',
        style: 'default',
        narrativeResult: 'Instinct drives you toward water. You find a stream — cold, clear, running over smooth stones — and drink deeply, your parched tissues soaking up the moisture like dry earth after rain. The water won\'t cure you, but it gives your body one less deficit to manage, freeing resources for the immune battle within.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.IMM, amount: -3, duration: 2, label: '-IMM' },
              { stat: StatId.HOM, amount: -2, label: '-HOM' },
            ],
            consequences: [],
          };
        },
      },
    ];
  },
};
