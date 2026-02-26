import type { SimulationTrigger } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';
import { getEncounterRate } from '../../calibration/calibrator';

// ══════════════════════════════════════════════════
//  RUT COMBAT (Male deer territorial/mating fight)
// ══════════════════════════════════════════════════

export const rutCombatTrigger: SimulationTrigger = {
  id: 'sim-rut-combat',
  category: 'social',
  tags: ['confrontation', 'territorial', 'mating'],
  calibrationCauseId: 'intraspecific',

  isPlausible(ctx) {
    // Rut combat only for male deer during autumn (rut season)
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn') return false;
    if (ctx.animal.age < 18) return false; // too young to spar
    return true;
  },

  computeWeight(ctx) {
    if (!ctx.calibratedRates) return 0.015;
    let base = getEncounterRate(ctx.calibratedRates, 'intraspecific', ctx.time.season);

    // Higher belligerence increases encounter rate
    base *= 0.5 + ctx.behavior.belligerence * 0.3;

    // Having a rival NPC increases chances
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
    const hea = computeEffectiveValue(ctx.animal.stats[StatId.HEA]);

    // Antler strike targeting head/neck/front-legs
    const antlerStrike: HarmEvent = {
      id: `antler-strike-${ctx.time.turn}`,
      sourceLabel: 'antler strike',
      magnitude: ctx.rng.int(35, 65),
      targetZone: ctx.rng.pick(['head', 'neck', 'front-legs']),
      spread: 0.2,
      harmType: 'blunt',
    };

    // Win probability based on health, weight, existing damage
    const winChance = Math.min(0.6, Math.max(0.1,
      0.25 + (hea - 50) * 0.003 + (ctx.animal.weight - 120) * 0.001 - ctx.animal.injuries.length * 0.05
    ));

    return [
      {
        id: 'engage',
        label: 'Lower your antlers and charge',
        description: `Meet the challenge. ${winChance > 0.35 ? 'You feel strong.' : 'You are not at your best.'}`,
        style: winChance < 0.2 ? 'danger' : 'default',
        narrativeResult: 'You lower your rack and drive forward. The impact is tremendous — a crack like a breaking branch as antler meets antler, tines interlocking, muscles straining. You shove with everything you have, hooves tearing at the ground for purchase, necks twisting as you try to throw the other buck off balance.',
        modifyOutcome(base, innerCtx) {
          const won = innerCtx.rng.chance(winChance);
          if (won) {
            return {
              ...base,
              harmEvents: innerCtx.rng.chance(0.3) ? [antlerStrike] : [],
              statEffects: [
                { stat: StatId.WIS, amount: 3, label: '+WIS' },
                { stat: StatId.HOM, amount: 6, duration: 2, label: '+HOM' },
              ],
              consequences: [
                { type: 'set_flag', flag: 'rut-challenge-won' as any },
              ],
              footnote: '(Won the fight)',
            };
          } else {
            return {
              ...base,
              harmEvents: [antlerStrike],
              statEffects: [
                { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
                { stat: StatId.HOM, amount: 10, duration: 3, label: '+HOM' },
              ],
              consequences: innerCtx.rng.chance(0.02)
                ? [{ type: 'death', cause: 'Killed in rut combat — antlers locked, unable to break free' }]
                : [],
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
          const backsDown = innerCtx.rng.chance(0.4 + (ctx.animal.weight - 100) * 0.003);
          if (backsDown) {
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
            // They didn't buy it — you take a hit as they charge
            return {
              ...base,
              harmEvents: [antlerStrike],
              statEffects: [
                { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' },
              ],
              consequences: [],
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
