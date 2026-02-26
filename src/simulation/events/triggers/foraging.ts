import type { SimulationTrigger, SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import type { HarmEvent } from '../../harm/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';

// ══════════════════════════════════════════════════
//  SEASONAL BROWSE — passive foraging based on season/terrain
// ══════════════════════════════════════════════════

export const seasonalBrowseTrigger: SimulationTrigger = {
  id: 'sim-seasonal-browse',
  category: 'foraging',
  tags: ['foraging', 'food'],

  isPlausible(ctx) {
    // Foraging always plausible; quality varies by season
    return true;
  },

  computeWeight(ctx) {
    // Very common event — the baseline "what did you eat this turn"
    let base = 0.15;

    // Winter reduces good foraging, increases bad foraging
    if (ctx.time.season === 'winter') base *= 0.7;
    // Spring/summer are peak foraging
    if (ctx.time.season === 'spring' || ctx.time.season === 'summer') base *= 1.3;
    // Forest and plain are better foraging than mountain
    if (ctx.currentNodeType === 'mountain') base *= 0.6;

    return base;
  },

  resolve(ctx) {
    const season = ctx.time.season;
    const terrain = ctx.currentNodeType ?? 'forest';
    const isWinter = season === 'winter';
    const isSpring = season === 'spring';
    const isSummer = season === 'summer';
    const isAutumn = season === 'autumn';

    // Forage quality determines weight gain/loss
    let weightChange: number;
    let homChange: number;
    let narrative: string;

    if (isWinter) {
      // Winter: scarce browse, weight loss
      const severity = terrain === 'mountain' ? 'harsh' : ctx.currentWeather?.type === 'snow' ? 'moderate' : 'mild';

      if (severity === 'harsh') {
        weightChange = -3;
        homChange = 6;
        narrative = 'The browse is gone. Every twig within reach has been stripped, every bark surface gnawed to pale wood. You scrape at frozen lichen with your teeth, but the calories don\'t come close to what your body burns just staying warm. Your ribs are becoming visible beneath your winter coat.';
      } else if (severity === 'moderate') {
        weightChange = -1;
        homChange = 3;
        narrative = 'You paw through the snow to reach the dead grass beneath, nosing aside frozen leaves to find the withered remains of summer browse. It\'s enough to quiet the ache in your gut, but just barely. Each mouthful costs almost as many calories to dig up as it provides.';
      } else {
        weightChange = 0;
        homChange = 2;
        narrative = 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, nutritionally poor, but it fills your rumen and keeps the worst of the hunger at bay.';
      }
    } else if (isSpring) {
      weightChange = 2;
      homChange = -5;
      narrative = 'The forest is waking. New buds swell on every branch, and the first green shoots push through the leaf litter with urgent vitality. You graze on tender spring growth — dandelion, fresh clover, young maple leaves — each mouthful a concentrated burst of the protein and minerals your winter-depleted body craves. You can feel the recovery beginning, weight returning to your frame.';
    } else if (isSummer) {
      weightChange = 2;
      homChange = -4;
      narrative = 'The forest is thick with food. Lush browse fills every layer — wildflowers in the clearings, succulent forbs along the creek, mushrooms pushing up through the damp leaf litter. You eat with the unhurried satisfaction of an animal surrounded by abundance, your rumen working steadily through the rich summer diet.';
    } else {
      // Autumn: mast crop, preparation for winter
      const hasMast = ctx.rng.chance(0.4);
      if (hasMast) {
        weightChange = 4;
        homChange = -6;
        narrative = 'Acorns blanket the forest floor in a dense, copper-brown carpet. The oaks have produced abundantly this year, and you crunch through them with steady, rhythmic feeding. The tannin-rich nuts are building fat reserves along your ribs and haunches — an invisible armor against the approaching winter.';
      } else {
        weightChange = 1;
        homChange = -2;
        narrative = 'The autumn browse is adequate but not abundant. You work through the available forage — dried grasses, fallen fruit, the last of the season\'s forbs — storing what calories you can before winter strips the forest bare.';
      }
    }

    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.HOM, amount: homChange, label: homChange >= 0 ? '+HOM' : '-HOM' },
      ],
      consequences: [
        { type: 'modify_weight', amount: weightChange },
      ],
      narrativeText: narrative,
    };
  },

  getChoices() {
    return []; // Passive foraging has no choices
  },
};

// ══════════════════════════════════════════════════
//  RISKY FORAGING — orchards, crop fields, toxic plants
// ══════════════════════════════════════════════════

export const riskyForagingTrigger: SimulationTrigger = {
  id: 'sim-risky-foraging',
  category: 'foraging',
  tags: ['foraging', 'food', 'danger', 'human'],

  isPlausible(ctx) {
    // Only in summer/autumn when crops are available
    return ctx.time.season === 'summer' || ctx.time.season === 'autumn';
  },

  computeWeight(ctx) {
    let base = 0.04;

    // More likely when hungry (low weight)
    const weightThreshold = ctx.config.weight.vulnerabilityThreshold;
    if (ctx.animal.weight < weightThreshold) {
      base *= 1.5;
    }

    // Plains terrain (near agriculture) increases encounter
    if (ctx.currentNodeType === 'plain') base *= 2;

    return base;
  },

  resolve(ctx) {
    // Pick a scenario: orchard, cornfield, or toxic plant
    const roll = ctx.rng.int(0, 2);

    if (roll === 0) {
      return {
        harmEvents: [],
        statEffects: [],
        consequences: [],
        narrativeText: 'The smell drifts to you on the evening breeze — sweet, fermenting, irresistible. Through the tree line you can see rows of fruit trees heavy with produce, some already fallen and splitting open in the grass. A structure sits at the edge, its windows lit, and a territorial animal chained near the entrance. The food is close, almost within reach. But this is human ground.',
      };
    } else if (roll === 1) {
      return {
        harmEvents: [],
        statEffects: [],
        consequences: [],
        narrativeText: 'The field stretches out under the moonlight like a dark, rustling sea. The stalks are tall enough to hide you completely, and the ears are fat with ripe kernels — a concentration of calories that the forest cannot match. You can hear other deer already inside, the soft tearing of husks and the wet crunch of feeding. But the rich grain in quantity can acidify your gut until it presses against your lungs.',
      };
    } else {
      return {
        harmEvents: [],
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_nutrients', nutrient: 'minerals', amount: 5 },
        ],
        narrativeText: 'A cluster of mushrooms pushes up through the leaf litter at the base of a rotting stump — pale caps glistening with morning dew, their earthy scent cutting through the dampness. You nose at them cautiously. Fungi are a delicacy your body craves, rich in minerals that the browse cannot provide.',
      };
    }
  },

  getChoices(ctx) {
    const roll = ctx.rng.int(0, 2);

    if (roll === 0) {
      // Orchard scenario
      return [
        {
          id: 'raid-crops',
          label: 'Slip in and feed',
          description: 'Rich food, but human ground is dangerous.',
          style: 'danger' as const,
          narrativeResult: 'You pick your way through the rows in silence, ears swiveling, eating as fast as you dare. The fruit is sweet and heavy with juice, each bite flooding your mouth with sugar. You eat until your gut is taut, then melt back into the tree line before anything stirs.',
          modifyOutcome(base, innerCtx) {
            const caught = innerCtx.rng.chance(0.03);
            return {
              ...base,
              statEffects: [
                { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
                { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV' },
              ],
              consequences: [
                { type: 'modify_weight', amount: 3 },
                ...(caught ? [{ type: 'death' as const, cause: 'Shot by farmer while raiding orchard' }] : []),
              ],
            };
          },
        },
        {
          id: 'avoid-crops',
          label: 'Turn back to the forest',
          description: 'Safer. Your stomach aches with missed opportunity.',
          style: 'default' as const,
          narrativeResult: 'You watch for a long moment, the smell pulling at you like a physical force. But something holds you back — an instinct older than hunger. You turn and fade back into the forest, the sweetness lingering in your nostrils like a taunt.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.TRA, amount: -2, label: '-TRA' },
              ],
              consequences: [],
            };
          },
        },
      ];
    } else if (roll === 1) {
      // Cornfield scenario
      return [
        {
          id: 'gorge',
          label: 'Gorge yourself',
          description: 'Extraordinary calories, but the risk of acidosis is real.',
          style: 'danger' as const,
          narrativeResult: 'You eat and eat. The corn is impossibly rich, each kernel a pellet of concentrated energy. Your rumen swells. A dull pressure builds in your abdomen as the acids begin their work.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' },
              ],
              consequences: [
                { type: 'modify_weight', amount: 5 },
              ],
            };
          },
        },
        {
          id: 'graze-cautious',
          label: 'Graze cautiously and leave early',
          description: 'Take what your rumen can handle, then slip away.',
          style: 'default' as const,
          narrativeResult: 'You eat carefully, measured mouthfuls, pausing to let your rumen adjust to the unfamiliar richness. When the first twinge of discomfort signals enough, you stop. Discipline. Survival.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: -3, label: '-HOM' },
              ],
              consequences: [
                { type: 'modify_weight', amount: 2 },
              ],
            };
          },
        },
      ];
    } else {
      // Mushroom scenario
      return [
        {
          id: 'eat-mushrooms',
          label: 'Eat the mushrooms',
          description: 'Rich in minerals your body craves.',
          style: 'default' as const,
          narrativeResult: 'You bite into the first cap and the flavor is clean and loamy, like eating the forest itself. Your body floods with a quiet satisfaction as the minerals it has been missing finally arrive.',
          modifyOutcome(base, innerCtx) {
            const toxic = innerCtx.rng.chance(0.12);
            if (toxic) {
              return {
                ...base,
                statEffects: [
                  { stat: StatId.HOM, amount: 10, duration: 3, label: '+HOM' },
                  { stat: StatId.HEA, amount: -5, label: '-HEA' },
                ],
                consequences: [
                  { type: 'modify_weight', amount: -2 },
                ],
                footnote: '(Poisoned by toxic mushroom)',
              };
            }
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: -4, label: '-HOM' },
                { stat: StatId.IMM, amount: -3, label: '-IMM' },
              ],
              consequences: [
                { type: 'modify_nutrients', nutrient: 'minerals', amount: 8 },
              ],
            };
          },
        },
        {
          id: 'leave-mushrooms',
          label: 'Leave them alone',
          description: 'You can\'t be sure they\'re safe.',
          style: 'default' as const,
          narrativeResult: 'You sniff once more, then turn away. The forest offers other food — slower, less concentrated, but without the uncertainty. Caution has its own kind of nutrition.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [],
              consequences: [],
            };
          },
        },
      ];
    }
  },
};

// ══════════════════════════════════════════════════
//  TOXIC PLANT ENCOUNTER
// ══════════════════════════════════════════════════

export const toxicPlantTrigger: SimulationTrigger = {
  id: 'sim-toxic-plant',
  category: 'foraging',
  tags: ['foraging', 'danger'],

  isPlausible(ctx) {
    // Toxic plants grow near water in spring/summer
    return ctx.time.season === 'spring' || ctx.time.season === 'summer';
  },

  computeWeight(ctx) {
    let base = 0.015;
    // Near water increases exposure to water hemlock etc.
    if (ctx.currentNodeType === 'water') base *= 3;
    // Young deer are more naive
    if (ctx.animal.age < 18) base *= 2;
    return base;
  },

  resolve(ctx) {
    const harmEvent: HarmEvent = {
      id: `poison-${ctx.time.turn}`,
      sourceLabel: 'plant toxin',
      magnitude: ctx.rng.int(20, 50),
      targetZone: 'internal',
      spread: 1.0,
      harmType: 'chemical',
    };

    return {
      harmEvents: [harmEvent],
      statEffects: [
        { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM' },
        { stat: StatId.HEA, amount: -6, label: '-HEA' },
      ],
      consequences: [
        { type: 'modify_weight', amount: -3 },
      ],
      narrativeText: 'The plant looked like everything else — green, leafy, unremarkable. You were already chewing before the taste turned wrong: bitter, astringent, with a chemical bite that made your tongue go numb. You spit it out, but some has already gone down. Within minutes your stomach cramps violently and the world tilts. Something in those leaves is fighting your body from the inside.',
    };
  },

  getChoices() {
    return []; // Poisoning is not a choice event; it happens
  },
};
