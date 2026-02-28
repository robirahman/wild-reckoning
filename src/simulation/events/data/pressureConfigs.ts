import type { SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { StatEffect, EventCategory } from '../../../types/events';
import type { NarrativeEntity } from '../../narrative/types';
import { StatId } from '../../../types/stats';
import { resolveExposure } from '../../interactions/exposure';
import { resolveForage } from '../../interactions/forage';
import { resolveFight } from '../../interactions/fight';
import { getEncounterRate } from '../../calibration/calibrator';
import { rivalBuckEntity } from '../../narrative/perspective';

// ── Config Type ──

export interface PressureConfig {
  id: string;
  category: EventCategory;
  tags: string[];
  calibrationCauseId?: string;

  /** Quick plausibility gate */
  isPlausible: (ctx: SimulationContext) => boolean;

  /** Selection weight computation */
  computeWeight: (ctx: SimulationContext) => number;

  /** Build the base outcome (narrative, stat effects, etc.) */
  resolve: (ctx: SimulationContext) => {
    narrative: string;
    statEffects: StatEffect[];
    consequences: any[];
    entity?: NarrativeEntity;
    actionDetail: string;
    clinicalDetail: string;
    intensity: 'low' | 'medium' | 'high' | 'extreme';
    emotionalTone: string;
  };

  /** Build player choices */
  getChoices: (ctx: SimulationContext) => SimulationChoice[];
}

// ── Helper Functions ──

function getLocomotion(animal: { bodyState?: { capabilities: Record<string, number> } }): number {
  return animal.bodyState?.capabilities['locomotion'] ?? 100;
}

function getDigestion(animal: { bodyState?: { capabilities: Record<string, number> } }): number {
  return animal.bodyState?.capabilities['digestion'] ?? 100;
}

// ── Configs ──

export const STARVATION_PRESSURE_CONFIG: PressureConfig = {
  id: 'sim-starvation-pressure',
  category: 'environmental',
  tags: ['danger', 'foraging', 'food'],

  isPlausible(ctx) {
    const physio = ctx.animal.physiologyState;
    if (!physio) return false;
    // Fire when BCS <= 2 and in sustained negative energy balance
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
      narrative,
      statEffects: [
        { stat: StatId.HOM, amount: bcs <= 1 ? 12 : 6, duration: 2, label: '+HOM' },
      ],
      consequences: [],
      actionDetail: narrative,
      clinicalDetail: `Starvation pressure. Body condition score: ${bcs}/5. Negative energy balance sustained. ${bcs <= 1 ? 'Critical muscle wasting.' : 'Early weight loss visible.'}`,
      intensity: bcs <= 1 ? 'extreme' : 'high',
      emotionalTone: 'tension',
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

export const HYPOTHERMIA_PRESSURE_CONFIG: PressureConfig = {
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

    return {
      narrative,
      statEffects: [
        { stat: StatId.CLI, amount: severity > 5 ? 15 : 8, duration: 2, label: '+CLI' },
      ],
      consequences: [],
      actionDetail: narrative,
      clinicalDetail: `Hypothermia developing. Core temperature deviation: ${physio.coreTemperatureDeviation.toFixed(1)}°C. ${severity > 5 ? 'Severe shivering, cognitive impairment.' : 'Persistent cold, extremity numbness.'}`,
      intensity: severity > 5 ? 'extreme' : 'high',
      emotionalTone: 'cold',
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

export const IMMUNE_PRESSURE_CONFIG: PressureConfig = {
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

    const immuneDesc = hasInfection && parasiteCount > 0
      ? 'Concurrent infection and parasitic load'
      : hasInfection ? 'Wound infection' : parasiteCount > 0 ? 'Parasitic overload' : 'Immune exhaustion';

    return {
      narrative,
      statEffects: [
        { stat: StatId.IMM, amount: 8, duration: 2, label: '+IMM' },
        { stat: StatId.HEA, amount: -4, label: '-HEA' },
      ],
      consequences: [],
      actionDetail: narrative,
      clinicalDetail: `Immunocompromised state. ${immuneDesc}. Immune load exceeds capacity. Caloric deficit from febrile response.`,
      intensity: hasInfection && parasiteCount > 0 ? 'extreme' : 'high',
      emotionalTone: 'pain',
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

export const INJURY_IMPACT_CONFIG: PressureConfig = {
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

    const impairmentDesc = locoImpaired && digestImpaired
      ? `Locomotion: ${locomotion}%, Digestion: ${digestion}%`
      : locoImpaired ? `Locomotion: ${locomotion}%` : `Digestion: ${digestion}%`;

    return {
      narrative,
      statEffects: [
        ...(locoImpaired ? [{ stat: StatId.TRA, amount: Math.round((80 - locomotion) * 0.15), duration: 2, label: '+TRA' }] : []),
        ...(digestImpaired ? [{ stat: StatId.HOM, amount: Math.round((80 - digestion) * 0.15), duration: 2, label: '+HOM' }] : []),
      ],
      consequences: [],
      actionDetail: narrative,
      clinicalDetail: `Functional impairment from prior injuries. ${impairmentDesc}. ${locoImpaired ? 'Gait compromised, foraging range reduced.' : ''} ${digestImpaired ? 'Nutrient extraction impaired, negative energy balance.' : ''}`.trim(),
      intensity: locomotion < 50 || digestion < 50 ? 'high' : 'medium',
      emotionalTone: 'pain',
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

export const RUT_COMBAT_CONFIG: PressureConfig = {
  id: 'sim-rut-combat',
  category: 'social',
  tags: ['confrontation', 'territorial', 'mating'],
  calibrationCauseId: 'intraspecific',

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn') return false;
    if (ctx.animal.age < 18) return false;
    return true;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.015;
    let base = getEncounterRate(ctx.calibratedRates, 'intraspecific', ctx.time.season);

    base *= 0.5 + ctx.behavior.belligerence * 0.3;

    const hasRival = ctx.npcs?.some((n) => n.type === 'rival' && n.alive);
    if (hasRival) base *= 2;

    return base;
  },

  resolve(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'another buck';

    const narrative = `The scraping sound reaches you first — antler against bark, rhythmic and aggressive. Then you see ${rivalName}, raking a sapling with slow, deliberate fury, leaving bright wounds in the wood. Your scent reaches the other buck at the same moment their scent reaches you. The air between you thickens with testosterone and territorial rage. The other buck turns, lowers their rack, and begins to walk toward you with a stiff-legged gait that means one thing.`;

    return {
      narrative,
      statEffects: [
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
        { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      entity: rivalBuckEntity(rivalName),
      actionDetail: 'The other buck turns, lowers their rack, and begins to walk toward you with a stiff-legged gait that means one thing.',
      clinicalDetail: `Rut combat challenge from ${rivalName}. Intraspecific territorial/mating competition.`,
      intensity: 'high',
      emotionalTone: 'aggression',
    };
  },

  getChoices(ctx) {
    // Rival buck parameters: estimated from deer population averages
    const rivalWeight = ctx.rng.int(100, 180);
    const rivalStrength = 40 + rivalWeight * 0.1 + ctx.rng.int(-5, 5);

    // Rut combat fight parameters: antler vs antler, charge engagement
    const rutFightParams = {
      opponentStrength: rivalStrength,
      opponentWeight: rivalWeight,
      opponentWeaponType: 'blunt' as const,
      opponentTargetZone: ctx.rng.pick(['head', 'neck', 'front-legs'] as const),
      opponentDamageRange: [35, 65] as [number, number],
      opponentStrikeLabel: 'antler strike',
      engagementType: 'charge' as const,
      canDisengage: false,
      mutual: true,  // both use antlers
    };

    return [
      {
        id: 'engage',
        label: 'Lower your antlers and charge',
        description: `Meet the challenge. ${ctx.animal.weight > rivalWeight ? 'You outweigh the rival.' : 'The rival looks formidable.'}`,
        style: ctx.animal.weight < rivalWeight * 0.8 ? 'danger' : 'default',
        narrativeResult: 'You lower your rack and drive forward. The impact is tremendous — a crack like a breaking branch as antler meets antler, tines interlocking, muscles straining. You shove with everything you have, hooves tearing at the ground for purchase, necks twisting as you try to throw the other buck off balance.',
        modifyOutcome(base, innerCtx) {
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
        style: 'default',
        narrativeResult: 'You turn broadside, making yourself as large as possible, neck arched, muscles taut. You rake the ground with a hoof and snort — a challenge that says "look how big I am." The other buck hesitates, measures you, and after a tense moment either accepts the display or presses forward.',
        modifyOutcome(base, innerCtx) {
          // Intimidation: fight resolver with lower intensity
          const postureResult = resolveFight(innerCtx, {
            ...rutFightParams,
            engagementType: 'strike',
            // Posturing is less intense — damage is lower if rival presses
            opponentDamageRange: [20, 45],
          });

          if (postureResult.won) {
            // Rival backed down
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
            // Rival didn't buy it — takes a swing
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
        style: 'default',
        narrativeResult: 'You break eye contact first, turning your body away in the universal gesture of submission. The other buck watches you go with a stiff, imperious posture, having won without a blow. Your pride stings, but your body is intact.',
        modifyOutcome(base) {
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
