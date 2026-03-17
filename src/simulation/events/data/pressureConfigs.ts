import type { SimulationContext, SimulationChoice } from '../types';
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
      narrative = 'The muscles along your spine are wasted, skin loose over bone. Your haunches are hollow. Each step costs more than the last. The hunger is constant, a clench in your gut that never stops.';
    } else {
      narrative = 'Your ribs show through the thinning coat. A tremor has settled into your legs. The understory browse is picked over, barely worth chewing. Beyond the tree line, you smell richer forage on the wind.';
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
        description: `Open ground, but the forage is better.${locomotion < 60 ? ' Your legs make fleeing difficult.' : ''}`,
        style: locomotion < 50 ? 'danger' : 'default',
        narrativeResult: 'You step past the tree line. The grass is thick here, the browse untouched. Wind hits you from every direction. You are a silhouette against the sky. You eat anyway.',
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
        narrativeResult: 'You stay in the understory, scraping at bark and dead leaves. The food is poor. It does not quiet the ache in your gut. But nothing can see you here.',
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
        narrativeResult: 'You press your incisors against the trunk and pull. The inner bark tastes of turpentine. Your teeth ache. It is barely food, but it keeps your body from consuming its last reserves tonight.',
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
      narrative = 'Shivering through your whole body, convulsions you cannot stop. Your legs buckle. Everything is slow. You need shelter or you will not get up again.';
    } else {
      narrative = 'The chill will not leave. Hours of shivering and you are still cold. Your ears, muzzle, and hoof-tips have gone numb. The wind finds every gap in your fur where the coat has thinned. You are losing heat faster than you can make it.';
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
        description: hasShelter ? 'Dense trees ahead. The wind might drop there.' : 'The ground here is open. Little cover.',
        style: hasShelter ? 'default' : 'danger',
        narrativeResult: hasShelter
          ? 'You push into the trees until the wind drops. Between two fallen trunks, under hemlock boughs, the air is still. You fold your legs under you and press your belly to the ground. The shivering eases.'
          : 'You stumble across the open ground, searching for a depression, a rock, anything. The wind strips heat from you with every step.',
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
        narrativeResult: 'You fold your legs under you and tuck your nose against your flank. Your breathing slows. Snow accumulates on your back, trapping a thin layer of warmth against your fur. You wait.',
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
        narrativeResult: 'You force yourself to walk. Steady, rhythmic steps push blood through your chilled muscles. Your legs ache but your core warms. The movement burns calories you cannot spare, but you are warmer.',
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
      narrative = 'The wound throbs with constant heat. The parasites pull at you from inside. A bone-deep exhaustion has settled in, heavier than sleep. Your eyes are dull. Your coat is rough. Even breathing takes effort.';
    } else if (hasInfection) {
      narrative = 'The wound is hot and swollen, weeping thin fluid that smells wrong. Fever has taken hold. You shiver and burn at the same time. The infection is spreading.';
    } else if (parasiteCount > 0) {
      narrative = 'Your coat has thinned in patches. You eat but stay hungry. The itch never stops.';
    } else {
      narrative = 'Everything heals slowly now. Small scratches stay red and swollen. Your coat is dull, your eyes sunken. You are tired in a way that sleep does not fix.';
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
        description: 'Lie still. Let the fever do its work.',
        style: 'default',
        narrativeResult: 'You find a depression beneath a hemlock and lie still. The smell of resin fills your nose. You do not eat. Your body is hot and working hard at something you cannot see.',
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
        description: `You need fuel to keep going.${bcs <= 1 ? ' You can barely stand.' : ''}`,
        style: bcs <= 1 ? 'danger' : 'default',
        narrativeResult: 'You drag yourself up and move. Each step hurts. The foraging is slow. But you chew and swallow whatever you find.',
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
        description: 'You smell water. Your mouth is dry.',
        style: 'default',
        narrativeResult: 'You follow the smell of water to a stream. The water is cold and runs over smooth stones. You drink for a long time. The fever does not break, but your mouth is no longer cracked.',
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
      narrative = 'The injured leg drags. Each mouthful of browse sits heavy and undigested in your gut. You eat and eat but stay hungry. You limp and limp but cover no ground.';
    } else if (locoImpaired) {
      const severity = locomotion < 50 ? 'severe' : 'moderate';
      if (severity === 'severe') {
        narrative = 'The leg barely holds weight. Each step sends pain from hoof to hip. You can walk, barely. Running is not possible. If anything chases you, you cannot flee.';
      } else {
        narrative = 'The ache flares with each stride. You favor the good leg, shortening your gait. You spend longer at each food source because walking between them hurts.';
      }
    } else {
      narrative = 'Something is wrong inside. Your rumen is distended and gassy, working sluggishly. The food goes down but the hunger does not recede. You eat and eat and stay empty.';
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
          narrativeResult: 'You seek the tenderest shoots, the softest buds. Your gut handles them. Less food, but it stays down.',
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
          narrativeResult: 'You eat everything within reach. Bark, dead leaves, half-frozen grass, bitter twigs. Your gut distends painfully. Some of it passes through undigested. Some gets through.',
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
        narrativeResult: 'You find a sheltered spot and fold your legs carefully, taking the weight off the damaged limb. You lie still. The hunger builds, but the pain ebbs slightly.',
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
        narrativeResult: 'You haul yourself up and move. Each step hurts. You eat steadily, shifting weight off the bad leg, chewing between steps.',
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

    const narrative = `You hear scraping. Antler on bark, rhythmic. Then you see ${rivalName} raking a sapling, leaving bright wounds in the wood. Your scent reaches the other buck. Their scent reaches you. The other buck turns, lowers their rack, and walks toward you stiff-legged.`;

    return {
      narrative,
      statEffects: [
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
        { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      entity: rivalBuckEntity(rivalName),
      actionDetail: 'The other buck turns, lowers their rack, and walks toward you stiff-legged.',
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
        description: `Meet the challenge head-on. ${ctx.animal.weight > rivalWeight ? 'You outweigh the rival.' : 'The rival is big.'}`,
        style: ctx.animal.weight < rivalWeight * 0.8 ? 'danger' : 'default',
        narrativeResult: 'You lower your rack and drive forward. The crack of antler on antler is loud. Tines interlock. You shove, hooves tearing ground, neck twisting, trying to throw the other buck off balance.',
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
        narrativeResult: 'You turn broadside. Neck arched, muscles taut. You rake the ground with a hoof and snort. The other buck hesitates, measuring you.',
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
        description: 'Turn away. Keep your body intact.',
        style: 'default',
        narrativeResult: 'You break eye contact and turn your body away. The other buck watches you go, standing tall. You walk until the smell of him fades. Your body is intact.',
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
