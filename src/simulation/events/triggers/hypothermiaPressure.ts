import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

// ══════════════════════════════════════════════════
//  HYPOTHERMIA PRESSURE
// ══════════════════════════════════════════════════
//
// Fires when core temperature deviation is dangerously low.
// Makes the thermoregulation feedback loop visible to the player:
// skin damage → insulation loss → hypothermia → calorie burn → weight loss.

export const hypothermiaPressureTrigger: SimulationTrigger = {
  id: 'sim-hypothermia-pressure',
  category: 'environmental',
  tags: ['danger', 'seasonal'],

  isPlausible(ctx) {
    const physio = ctx.animal.physiologyState;
    if (!physio) return false;
    // Fire when core temp is drifting toward hypothermia
    return physio.coreTemperatureDeviation < -2;
  },

  computeWeight(ctx) {
    const physio = ctx.animal.physiologyState!;
    let base = 0.10;

    // More urgent with deeper hypothermia
    const severity = Math.abs(physio.coreTemperatureDeviation);
    if (severity > 4) base *= 1.5;
    if (severity > 6) base *= 2;

    // Blizzard compounds the urgency
    if (ctx.currentWeather?.type === 'blizzard') base *= 1.5;

    // Low body condition means less thermal reserve
    if (physio.bodyConditionScore <= 2) base *= 1.3;

    return base;
  },

  resolve(ctx) {
    const physio = ctx.animal.physiologyState!;
    const severity = Math.abs(physio.coreTemperatureDeviation);

    let narrative: string;
    if (severity > 5) {
      narrative = 'The cold has moved past your skin and muscles and settled into your core. Your shivering has become violent, uncontrollable — your whole body convulsing in a desperate bid to generate heat. Your thoughts are slowing, turning thick and confused. Some part of your brain, the old part, knows that you are dying. You need shelter, warmth, anything — or this cold will finish what it started.';
    } else {
      narrative = 'The chill won\'t leave. It has been building for hours, creeping deeper despite the constant shivering that burns through your calories like kindling. Your extremities feel numb and distant — ears, muzzle, the tips of your hooves. The wind finds every gap in your fur where injuries have thinned the insulating layer. Your body is losing more heat than it can produce.';
    }

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.CLI, amount: severity > 5 ? 15 : 8, duration: 2, label: '+CLI' },
      ],
      consequences: [],
      narrativeText: narrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'environmental',
        eventType: 'hypothermia-pressure',
        actions: [action(
          narrative,
          `Hypothermia developing. Core temperature deviation: ${physio.coreTemperatureDeviation.toFixed(1)}°C. ${severity > 5 ? 'Severe shivering, cognitive impairment.' : 'Persistent cold, extremity numbness.'}`,
          severity > 5 ? 'extreme' : 'high',
        )],
        environment: env,
        emotionalTone: 'cold',
      }),
    };
  },

  getChoices(ctx) {
    const cover = ctx.currentNodeResources?.cover ?? 30;
    const hasShelter = ctx.currentNodeType === 'forest' || cover > 50;

    return [
      {
        id: 'seek-shelter',
        label: 'Search for better shelter',
        description: hasShelter ? 'Dense forest or a windbreak could save you.' : 'The terrain offers little cover.',
        style: hasShelter ? 'default' : 'danger',
        narrativeResult: hasShelter
          ? 'You push deeper into the forest, forcing your stiff legs to carry you until the wind drops and the canopy thickens overhead. Between two fallen trunks, sheltered by dense hemlock boughs, you find a pocket of still air. You fold your legs beneath you and press your belly to the ground. The shivering gradually eases as your body heat collects in the small space.'
          : 'You stumble through the open ground, searching for anything — a depression, a rock outcrop, a drift of snow deep enough to burrow into. The wind follows you, relentless, stripping heat faster than your legs can carry you to safety.',
        modifyOutcome(base, innerCtx) {
          const exposure = resolveExposure(innerCtx, {
            type: 'cold',
            intensity: hasShelter ? 0.4 : 0.7,
            shelterAvailable: hasShelter,
            shelterQuality: cover / 100,
          });

          return {
            ...base,
            harmEvents: exposure.harmEvents,
            statEffects: [
              { stat: StatId.CLI, amount: exposure.shelterFound ? -5 : 8, duration: 2, label: exposure.shelterFound ? '-CLI' : '+CLI' },
              { stat: StatId.WIS, amount: exposure.shelterFound ? 3 : 0, label: '+WIS' },
            ],
            consequences: [
              ...(exposure.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -exposure.caloriesCost, source: 'shelter-seeking' }] : []),
            ],
            footnote: exposure.shelterFound ? '(Found shelter)' : '(No shelter found)',
          };
        },
      },
      {
        id: 'huddle',
        label: 'Curl up tight where you are',
        description: 'Minimize surface area. Endure.',
        style: 'default',
        narrativeResult: 'You fold your legs beneath you and tuck your nose against your flank, making yourself as small as possible. Your breathing slows. The snow begins to accumulate on your back — an ironic blanket, insulating even as the source of your misery. You wait.',
        modifyOutcome(base, innerCtx) {
          const exposure = resolveExposure(innerCtx, {
            type: 'cold',
            intensity: 0.5,
            shelterAvailable: false,
            shelterQuality: 0,
          });

          return {
            ...base,
            harmEvents: exposure.harmEvents,
            statEffects: [
              { stat: StatId.CLI, amount: 5, duration: 2, label: '+CLI' },
              { stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' },
            ],
            consequences: [
              ...(exposure.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -exposure.caloriesCost, source: 'cold-endurance' }] : []),
            ],
          };
        },
      },
      {
        id: 'keep-moving',
        label: 'Keep moving to generate heat',
        description: 'Burns calories but maintains core temperature.',
        style: 'default',
        narrativeResult: 'You force yourself to walk — steady, rhythmic movement that pushes blood through your chilled muscles and generates the frictional warmth of exertion. Your legs protest but your core warms. The movement costs energy you can barely afford, but freezing to death costs more.',
        modifyOutcome(base) {
          return {
            ...base,
            harmEvents: [],
            statEffects: [
              { stat: StatId.CLI, amount: -3, duration: 1, label: '-CLI' },
              { stat: StatId.HOM, amount: 4, duration: 2, label: '+HOM' },
            ],
            consequences: [
              { type: 'add_calories' as const, amount: -35, source: 'movement-thermoregulation' },
            ],
          };
        },
      },
    ];
  },
};
