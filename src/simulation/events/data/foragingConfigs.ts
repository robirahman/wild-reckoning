import type { SimulationContext, SimulationChoice } from '../types';
import type { HarmType } from '../../harm/types';
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
      narrative: 'Every twig stripped, bark gnawed to pale wood. You scrape at frozen lichen. Ribs showing through your winter coat.',
      clinicalDetail: 'Severe winter browse depletion on mountain terrain. -80 bonus kcal.',
    },
    // Winter — moderate (snow)
    {
      season: 'winter',
      weather: 'snow',
      bonusCalories: -30,
      homChange: 3,
      narrative: 'You paw through snow to reach dead grass. Nosing aside frozen leaves. Enough to quiet the gut-ache, barely.',
      clinicalDetail: 'Winter foraging under snow. -30 bonus kcal.',
    },
    // Winter — mild (default winter)
    {
      season: 'winter',
      bonusCalories: 0,
      homChange: 2,
      narrative: 'Cedar and hemlock still have needles. You strip the lower branches. Resinous, bitter. It fills the rumen.',
      clinicalDetail: 'Baseline winter browse on conifers. 0 bonus kcal.',
    },
    // Spring
    {
      season: 'spring',
      bonusCalories: 50,
      homChange: -5,
      narrative: 'New buds on every branch. Green shoots pushing through leaf litter. You graze on dandelion, fresh clover, young maple leaves. The taste is sharp and wet after months of bark.',
      clinicalDetail: 'Spring green-up foraging. +50 bonus kcal.',
    },
    // Summer
    {
      season: 'summer',
      bonusCalories: 40,
      homChange: -4,
      narrative: 'Wildflowers in the clearings, forbs along the creek, mushrooms in the damp leaf litter. You eat without hurrying. The rumen works steadily.',
      clinicalDetail: 'Peak summer browse abundance. +40 bonus kcal.',
    },
    // Autumn — mast year (40% chance)
    {
      season: 'autumn',
      chance: 0.4,
      bonusCalories: 100,
      homChange: -6,
      narrative: 'Acorns everywhere on the forest floor. You crunch through them steadily. The bitter tannin taste, then the dense fat of the nut. Your ribs are padding over.',
      clinicalDetail: 'Mast year acorn crop. +100 bonus kcal.',
    },
    // Autumn — normal
    {
      season: 'autumn',
      bonusCalories: 20,
      homChange: -2,
      narrative: 'Dried grasses, fallen fruit, the last forbs. You work through what is available.',
      clinicalDetail: 'Normal autumn foraging. +20 bonus kcal.',
    },
  ],

  fallback: {
    season: 'any',
    bonusCalories: 0,
    homChange: 0,
    narrative: 'You browse on what the forest offers. The rumen fills.',
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
    (_ctx) => ({
      id: 'orchard',
      narrativeText: 'Sweet ferment on the evening breeze. Through the tree line, rows of fruit trees, fallen fruit splitting in the grass. A structure at the edge, lit windows. A chained animal near the entrance.',
      clinicalDetail: 'Deer near human orchard. High-calorie food source with risk of human contact.',
      statEffects: [],
      consequences: [],
      emotionalTone: 'tension',
      choices: [
        {
          id: 'raid-crops',
          label: 'Slip in and feed',
          description: 'Rich food. The chained animal and lit structure.',
          style: 'danger',
          narrativeResult: 'You pick through the rows in silence, ears swiveling. The fruit is sweet, heavy with juice. You eat until your gut is taut, then slip back into the tree line.',
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
                ...(caught ? [{ type: 'death' as const, cause: 'Loud crack from the structure. Impact. Legs fold.' }] : []),
              ],
            };
          },
        },
        {
          id: 'avoid-crops',
          label: 'Turn back to the forest',
          description: 'The smell pulls at you. You turn away.',
          style: 'default',
          narrativeResult: 'You stand at the tree line, nostrils full of sweetness. Something holds you still. You turn back into the forest.',
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
    (_ctx) => ({
      id: 'cornfield',
      narrativeText: 'Rustling stalks in moonlight, tall enough to hide you. Ears fat with ripe kernels. You hear other deer inside already, the soft tearing of husks, the wet crunch of feeding.',
      clinicalDetail: 'Deer near agricultural cornfield. Risk of ruminal acidosis from high-starch diet.',
      statEffects: [],
      consequences: [],
      emotionalTone: 'tension',
      choices: [
        {
          id: 'gorge',
          label: 'Gorge yourself',
          description: 'Rich grain. Your gut may not handle the quantity.',
          style: 'danger',
          narrativeResult: 'You eat and eat. Each kernel dense and rich. Your rumen swells. Dull pressure building in your abdomen.',
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
          description: 'Eat carefully. Leave before the pressure builds.',
          style: 'default',
          narrativeResult: 'You eat in measured mouthfuls. When the first twinge of discomfort comes, you stop and leave.',
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
    (_ctx) => ({
      id: 'mushroom',
      narrativeText: 'Earthy scent at the base of a rotting stump. Pale caps pushing through leaf litter, glistening with dew. You nose at them.',
      clinicalDetail: 'Wild mushroom foraging. Potential mycotoxin risk (12% chance of toxic species).',
      statEffects: [{ stat: StatId.HOM, amount: -3, label: '-HOM' }],
      consequences: [{ type: 'modify_nutrients', nutrient: 'minerals', amount: 5 }],
      emotionalTone: 'calm',
      choices: [
        {
          id: 'eat-mushrooms',
          label: 'Eat the mushrooms',
          description: 'The earthy smell draws you.',
          style: 'default',
          narrativeResult: 'You bite into the first cap. Clean, loamy flavor. You eat the rest.',
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
          description: 'The smell is unfamiliar.',
          style: 'default',
          narrativeResult: 'You sniff once more, then turn away. Other browse nearby.',
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

  narrativeText: 'You were already chewing before the taste turned wrong. Bitter, astringent, a chemical bite numbing your tongue. You spit. Some already swallowed. Your stomach cramps.',
  clinicalDetail: 'Ingestion of toxic plant (likely water hemlock or similar). Chemical poisoning causing gastrointestinal distress and metabolic disruption.',
  emotionalTone: 'pain',
};
