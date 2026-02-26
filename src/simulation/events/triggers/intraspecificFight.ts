import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';
import { resolveFight } from '../../interactions/fight';

// ══════════════════════════════════════════════════
//  RUT COMBAT (Male deer territorial/mating fight)
// ══════════════════════════════════════════════════

export const rutCombatTrigger: SimulationTrigger = {
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

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV' },
        { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
      ],
      consequences: [],
      narrativeText: `The scraping sound reaches you first — antler against bark, rhythmic and aggressive. Then you see ${rivalName}, raking a sapling with slow, deliberate fury, leaving bright wounds in the wood. Your scent reaches the other buck at the same moment their scent reaches you. The air between you thickens with testosterone and territorial rage. The other buck turns, lowers their rack, and begins to walk toward you with a stiff-legged gait that means one thing.`,
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
