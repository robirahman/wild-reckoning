import type { SimulationContext, SimulationChoice } from '../types';
import type { HarmEvent, HarmType } from '../../harm/types';
import type { StatEffect } from '../../../types/events';
import type { BodyZone } from '../../anatomy/types';
import { StatId } from '../../../types/stats';

// Caloric density: kcal-units per lb of body weight (from DEER_METABOLISM)
export const KCAL_PER_LB = 35;

// ── Seasonal Browse Config ──

export interface SeasonalBrowseEntry {
  /** Matching conditions */
  season: string;
  /** Terrain filter (undefined = any) */
  terrain?: string;
  /** Weather filter (undefined = any) */
  weather?: string;
  /** Additional random check: probability this entry is used vs fallback (1.0 = always) */
  chance?: number;

  /** Bonus/penalty calories on top of baseline */
  bonusCalories: number;
  /** HOM stat change */
  homChange: number;
  /** Animal-perspective narrative */
  narrative: string;
  /** Clinical detail for debriefing */
  clinicalDetail: string;
}

export interface SeasonalBrowseConfig {
  id: string;
  category: string;
  tags: string[];

  baseWeight: number;
  seasonWeightMultipliers: Record<string, number>;
  terrainWeightMultipliers: Record<string, number>;
  /** Factor applied to weight based on foraging pressure in world memory */
  foragingPressureThreshold: number;
  foragingPressureFactor: number;

  /** Ordered list of seasonal browse entries; first match wins */
  entries: SeasonalBrowseEntry[];
  /** Fallback entry when no specific entry matches */
  fallback: SeasonalBrowseEntry;
}

// ── Risky Foraging Config ──

export interface ForagingScenario {
  id: string;
  /** Animal-perspective text for the encounter setup */
  narrativeText: string;
  /** Clinical description */
  clinicalDetail: string;
  /** Base stat effects on resolve (before choice) */
  statEffects: StatEffect[];
  /** Base consequences on resolve (before choice) */
  consequences: any[];
  emotionalTone: string;
  /** Choices available */
  choices: SimulationChoice[];
}

export interface RiskyForagingConfig {
  id: string;
  category: string;
  tags: string[];

  plausibleSeasons: string[];
  baseWeight: number;
  /** Multiplier when animal weight is below vulnerability threshold */
  hungerMultiplier: number;
  terrainWeightMultipliers: Record<string, number>;

  /** Scenario builders (take context, return scenario) */
  scenarios: ((ctx: SimulationContext) => ForagingScenario)[];
}

// ── Toxic Plant Config ──

export interface ToxicPlantConfig {
  id: string;
  category: string;
  tags: string[];

  plausibleSeasons: string[];
  baseWeight: number;
  terrainWeightMultipliers: Record<string, number>;
  /** Multiplier for young animals */
  youngAgeCutoff: number;
  youngAgeMultiplier: number;

  harmType: HarmType;
  magnitudeRange: [number, number];
  targetZone: BodyZone | 'random' | 'internal';
  spread: number;
  sourceLabel: string;

  statEffects: StatEffect[];
  caloryCost: number;

  narrativeText: string;
  clinicalDetail: string;
  emotionalTone: string;
}

// ══════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════

export const SEASONAL_BROWSE_CONFIG: SeasonalBrowseConfig = {
  id: 'sim-seasonal-browse',
  category: 'foraging',
  tags: ['foraging', 'food'],

  baseWeight: 0.15,
  seasonWeightMultipliers: { winter: 0.7, spring: 1.3, summer: 1.3 },
  terrainWeightMultipliers: { mountain: 0.6 },
  foragingPressureThreshold: 15,
  foragingPressureFactor: 0.02,

  entries: [
    // Winter — harsh (mountain)
    {
      season: 'winter',
      terrain: 'mountain',
      bonusCalories: -80,
      homChange: 6,
      narrative: 'The browse is gone. Every twig within reach has been stripped, every bark surface gnawed to pale wood. You scrape at frozen lichen with your teeth, but the calories don\'t come close to what your body burns just staying warm. Your ribs are becoming visible beneath your winter coat.',
      clinicalDetail: 'Severe winter browse depletion on mountain terrain. -80 bonus kcal.',
    },
    // Winter — moderate (snow)
    {
      season: 'winter',
      weather: 'snow',
      bonusCalories: -30,
      homChange: 3,
      narrative: 'You paw through the snow to reach the dead grass beneath, nosing aside frozen leaves to find the withered remains of summer browse. It\'s enough to quiet the ache in your gut, but just barely. Each mouthful costs almost as many calories to dig up as it provides.',
      clinicalDetail: 'Winter foraging under snow. -30 bonus kcal.',
    },
    // Winter — mild (default winter)
    {
      season: 'winter',
      bonusCalories: 0,
      homChange: 2,
      narrative: 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, nutritionally poor, but it fills your rumen and keeps the worst of the hunger at bay.',
      clinicalDetail: 'Baseline winter browse on conifers. 0 bonus kcal.',
    },
    // Spring
    {
      season: 'spring',
      bonusCalories: 50,
      homChange: -5,
      narrative: 'The forest is waking. New buds swell on every branch, and the first green shoots push through the leaf litter with urgent vitality. You graze on tender spring growth — dandelion, fresh clover, young maple leaves — each mouthful a concentrated burst of the protein and minerals your winter-depleted body craves. You can feel the recovery beginning, weight returning to your frame.',
      clinicalDetail: 'Spring green-up foraging. +50 bonus kcal.',
    },
    // Summer
    {
      season: 'summer',
      bonusCalories: 40,
      homChange: -4,
      narrative: 'The forest is thick with food. Lush browse fills every layer — wildflowers in the clearings, succulent forbs along the creek, mushrooms pushing up through the damp leaf litter. You eat with the unhurried satisfaction of an animal surrounded by abundance, your rumen working steadily through the rich summer diet.',
      clinicalDetail: 'Peak summer browse abundance. +40 bonus kcal.',
    },
    // Autumn — mast year (40% chance)
    {
      season: 'autumn',
      chance: 0.4,
      bonusCalories: 100,
      homChange: -6,
      narrative: 'Acorns blanket the forest floor in a dense, copper-brown carpet. The oaks have produced abundantly this year, and you crunch through them with steady, rhythmic feeding. The tannin-rich nuts are building fat reserves along your ribs and haunches — an invisible armor against the approaching winter.',
      clinicalDetail: 'Mast year acorn crop. +100 bonus kcal.',
    },
    // Autumn — normal
    {
      season: 'autumn',
      bonusCalories: 20,
      homChange: -2,
      narrative: 'The autumn browse is adequate but not abundant. You work through the available forage — dried grasses, fallen fruit, the last of the season\'s forbs — storing what calories you can before winter strips the forest bare.',
      clinicalDetail: 'Normal autumn foraging. +20 bonus kcal.',
    },
  ],

  fallback: {
    season: 'any',
    bonusCalories: 0,
    homChange: 0,
    narrative: 'You browse on whatever the forest offers, filling your rumen with methodical efficiency.',
    clinicalDetail: 'Baseline foraging. 0 bonus kcal.',
  },
};

export const RISKY_FORAGING_CONFIG: RiskyForagingConfig = {
  id: 'sim-risky-foraging',
  category: 'foraging',
  tags: ['foraging', 'food', 'danger', 'human'],

  plausibleSeasons: ['summer', 'autumn'],
  baseWeight: 0.04,
  hungerMultiplier: 1.5,
  terrainWeightMultipliers: { plain: 2 },

  scenarios: [
    // Orchard
    (ctx) => ({
      id: 'orchard',
      narrativeText: 'The smell drifts to you on the evening breeze — sweet, fermenting, irresistible. Through the tree line you can see rows of fruit trees heavy with produce, some already fallen and splitting open in the grass. A structure sits at the edge, its windows lit, and a territorial animal chained near the entrance. The food is close, almost within reach. But this is human ground.',
      clinicalDetail: 'Deer near human orchard. High-calorie food source with risk of human contact.',
      statEffects: [],
      consequences: [],
      emotionalTone: 'tension',
      choices: [
        {
          id: 'raid-crops',
          label: 'Slip in and feed',
          description: 'Rich food, but human ground is dangerous.',
          style: 'danger',
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
                { type: 'add_calories' as const, amount: 3 * KCAL_PER_LB, source: 'orchard-raid' },
                ...(caught ? [{ type: 'death' as const, cause: 'Shot by farmer while raiding orchard' }] : []),
              ],
            };
          },
        },
        {
          id: 'avoid-crops',
          label: 'Turn back to the forest',
          description: 'Safer. Your stomach aches with missed opportunity.',
          style: 'default',
          narrativeResult: 'You watch for a long moment, the smell pulling at you like a physical force. But something holds you back — an instinct older than hunger. You turn and fade back into the forest, the sweetness lingering in your nostrils like a taunt.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [{ stat: StatId.TRA, amount: -2, label: '-TRA' }],
              consequences: [],
            };
          },
        },
      ],
    }),

    // Cornfield
    (ctx) => ({
      id: 'cornfield',
      narrativeText: 'The field stretches out under the moonlight like a dark, rustling sea. The stalks are tall enough to hide you completely, and the ears are fat with ripe kernels — a concentration of calories that the forest cannot match. You can hear other deer already inside, the soft tearing of husks and the wet crunch of feeding. But the rich grain in quantity can acidify your gut until it presses against your lungs.',
      clinicalDetail: 'Deer near agricultural cornfield. Risk of ruminal acidosis from high-starch diet.',
      statEffects: [],
      consequences: [],
      emotionalTone: 'tension',
      choices: [
        {
          id: 'gorge',
          label: 'Gorge yourself',
          description: 'Extraordinary calories, but the risk of acidosis is real.',
          style: 'danger',
          narrativeResult: 'You eat and eat. The corn is impossibly rich, each kernel a pellet of concentrated energy. Your rumen swells. A dull pressure builds in your abdomen as the acids begin their work.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [{ stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' }],
              consequences: [{ type: 'add_calories' as const, amount: 5 * KCAL_PER_LB, source: 'cornfield-gorge' }],
            };
          },
        },
        {
          id: 'graze-cautious',
          label: 'Graze cautiously and leave early',
          description: 'Take what your rumen can handle, then slip away.',
          style: 'default',
          narrativeResult: 'You eat carefully, measured mouthfuls, pausing to let your rumen adjust to the unfamiliar richness. When the first twinge of discomfort signals enough, you stop. Discipline. Survival.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [{ stat: StatId.HOM, amount: -3, label: '-HOM' }],
              consequences: [{ type: 'add_calories' as const, amount: 2 * KCAL_PER_LB, source: 'cornfield-cautious' }],
            };
          },
        },
      ],
    }),

    // Mushrooms
    (ctx) => ({
      id: 'mushroom',
      narrativeText: 'A cluster of mushrooms pushes up through the leaf litter at the base of a rotting stump — pale caps glistening with morning dew, their earthy scent cutting through the dampness. You nose at them cautiously. Fungi are a delicacy your body craves, rich in minerals that the browse cannot provide.',
      clinicalDetail: 'Wild mushroom foraging. Potential mycotoxin risk (12% chance of toxic species).',
      statEffects: [{ stat: StatId.HOM, amount: -3, label: '-HOM' }],
      consequences: [{ type: 'modify_nutrients', nutrient: 'minerals', amount: 5 }],
      emotionalTone: 'calm',
      choices: [
        {
          id: 'eat-mushrooms',
          label: 'Eat the mushrooms',
          description: 'Rich in minerals your body craves.',
          style: 'default',
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
                consequences: [{ type: 'add_calories' as const, amount: -2 * KCAL_PER_LB, source: 'toxic-mushroom' }],
                footnote: '(Poisoned by toxic mushroom)',
              };
            }
            return {
              ...base,
              statEffects: [
                { stat: StatId.HOM, amount: -4, label: '-HOM' },
                { stat: StatId.IMM, amount: -3, label: '-IMM' },
              ],
              consequences: [{ type: 'modify_nutrients', nutrient: 'minerals', amount: 8 }],
            };
          },
        },
        {
          id: 'leave-mushrooms',
          label: 'Leave them alone',
          description: 'You can\'t be sure they\'re safe.',
          style: 'default',
          narrativeResult: 'You sniff once more, then turn away. The forest offers other food — slower, less concentrated, but without the uncertainty. Caution has its own kind of nutrition.',
          modifyOutcome(base) {
            return { ...base, statEffects: [], consequences: [] };
          },
        },
      ],
    }),
  ],
};

export const TOXIC_PLANT_CONFIG: ToxicPlantConfig = {
  id: 'sim-toxic-plant',
  category: 'foraging',
  tags: ['foraging', 'danger'],

  plausibleSeasons: ['spring', 'summer'],
  baseWeight: 0.015,
  terrainWeightMultipliers: { water: 3 },
  youngAgeCutoff: 18,
  youngAgeMultiplier: 2,

  harmType: 'chemical',
  magnitudeRange: [20, 50],
  targetZone: 'internal',
  spread: 1.0,
  sourceLabel: 'plant toxin',

  statEffects: [
    { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM' },
    { stat: StatId.HEA, amount: -6, label: '-HEA' },
  ],
  caloryCost: 3 * KCAL_PER_LB,

  narrativeText: 'The plant looked like everything else — green, leafy, unremarkable. You were already chewing before the taste turned wrong: bitter, astringent, with a chemical bite that made your tongue go numb. You spit it out, but some has already gone down. Within minutes your stomach cramps violently and the world tilts. Something in those leaves is fighting your body from the inside.',
  clinicalDetail: 'Ingestion of toxic plant (likely water hemlock or similar). Chemical poisoning causing gastrointestinal distress and metabolic disruption.',
  emotionalTone: 'pain',
};
