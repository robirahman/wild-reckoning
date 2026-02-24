import type { RegionDefinition } from '../../types/world';

export const REGION_DEFINITIONS: Record<string, RegionDefinition> = {
  'northern-minnesota': {
    id: 'northern-minnesota',
    name: 'Northern Minnesota',
    climate: {
      temperatureByMonth: [10, 15, 28, 44, 56, 65, 70, 68, 58, 45, 30, 16],
      precipitationByMonth: [1.0, 0.8, 1.5, 2.2, 3.0, 3.8, 3.5, 3.2, 2.8, 2.0, 1.8, 1.2],
      firstFrostMonth: 8,
      lastFrostMonth: 4,
    },
    flora: [
      { id: 'white-oak-acorn', name: 'White Oak Acorns', availableSeasons: ['summer', 'autumn'], nutritiveValue: 85, abundanceByMonth: [0, 0, 0, 0, 0.3, 0.5, 0.7, 0.8, 1.0, 0.8, 0.2, 0] },
      { id: 'forest-browse', name: 'Forest Browse', availableSeasons: ['spring', 'summer', 'autumn'], nutritiveValue: 40, abundanceByMonth: [0, 0, 0.2, 0.6, 0.8, 0.9, 0.9, 0.8, 0.6, 0.3, 0, 0] },
      { id: 'clover', name: 'Clover', availableSeasons: ['spring', 'summer'], nutritiveValue: 55, abundanceByMonth: [0, 0, 0.1, 0.5, 0.8, 0.9, 0.8, 0.6, 0.3, 0, 0, 0] },
      { id: 'frozen-browse', name: 'Frozen Browse', availableSeasons: ['winter'], nutritiveValue: 15, abundanceByMonth: [0.4, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0.5] },
    ],
    fauna: ['white-tailed-deer', 'gray-wolf', 'turkey', 'grouse', 'moose', 'snowshoe-hare'],
    predators: ['wolf', 'coyote', 'bear', 'hunter', 'bobcat'],
    parasitePrevalence: [
      { parasiteId: 'gi-roundworm', baseChance: 0.03, seasonalModifier: { spring: 1.2, summer: 1.5, autumn: 1.0, winter: 0.5 } },
      { parasiteId: 'lung-fluke', baseChance: 0.02, seasonalModifier: { spring: 1.0, summer: 1.3, autumn: 0.8, winter: 0.4 } },
    ],
  },

  'minnesota-winter-yard': {
    id: 'minnesota-winter-yard',
    name: 'Minnesota Winter Yard',
    climate: {
      temperatureByMonth: [5, 8, 22, 38, 50, 60, 65, 63, 52, 40, 25, 10],
      precipitationByMonth: [1.2, 1.0, 1.6, 2.0, 2.5, 3.0, 3.0, 2.8, 2.5, 2.0, 1.8, 1.4],
      firstFrostMonth: 8,
      lastFrostMonth: 5,
    },
    flora: [
      { id: 'cedar-browse', name: 'Cedar Browse', availableSeasons: ['winter', 'spring'], nutritiveValue: 20, abundanceByMonth: [0.5, 0.4, 0.3, 0.2, 0, 0, 0, 0, 0, 0.1, 0.3, 0.5] },
      { id: 'alder-bark', name: 'Alder Bark', availableSeasons: ['winter'], nutritiveValue: 10, abundanceByMonth: [0.6, 0.5, 0.3, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.6] },
    ],
    fauna: ['white-tailed-deer', 'snowshoe-hare', 'raven'],
    predators: ['wolf', 'coyote'],
    parasitePrevalence: [
      { parasiteId: 'winter-tick', baseChance: 0.04, seasonalModifier: { spring: 1.5, summer: 0.2, autumn: 0.8, winter: 1.3 } },
    ],
  },

  'east-african-savanna': {
    id: 'east-african-savanna',
    name: 'East African Savanna',
    climate: {
      temperatureByMonth: [80, 82, 82, 80, 77, 73, 71, 73, 77, 80, 80, 80],
      precipitationByMonth: [1.5, 1.2, 2.5, 4.0, 4.5, 1.5, 0.5, 0.5, 0.5, 2.0, 4.0, 3.0],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'acacia', name: 'Acacia Leaves', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 50, abundanceByMonth: [0.5, 0.4, 0.6, 0.8, 0.9, 0.5, 0.3, 0.3, 0.3, 0.5, 0.8, 0.6] },
      { id: 'savanna-grass', name: 'Savanna Grass', availableSeasons: ['spring', 'autumn'], nutritiveValue: 35, abundanceByMonth: [0.3, 0.2, 0.5, 0.8, 0.9, 0.4, 0.2, 0.1, 0.2, 0.5, 0.8, 0.5] },
      { id: 'baobab-fruit', name: 'Baobab Fruit', availableSeasons: ['autumn', 'winter'], nutritiveValue: 75, abundanceByMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0.6, 0.8, 0.4] },
      { id: 'marula-fruit', name: 'Marula Fruit', availableSeasons: ['spring', 'summer'], nutritiveValue: 80, abundanceByMonth: [0.2, 0.5, 0.8, 0.6, 0.3, 0, 0, 0, 0, 0, 0, 0] },
    ],
    fauna: ['african-elephant', 'zebra', 'wildebeest', 'giraffe', 'cape-buffalo'],
    predators: ['lion', 'hyena', 'poacher'],
    parasitePrevalence: [
      { parasiteId: 'gi-roundworm', baseChance: 0.04, seasonalModifier: { spring: 1.3, summer: 0.8, autumn: 1.3, winter: 0.6 } },
    ],
  },

  'pacific-northwest-ocean': {
    id: 'pacific-northwest-ocean',
    name: 'Pacific Northwest Ocean',
    climate: {
      temperatureByMonth: [48, 48, 49, 50, 52, 55, 58, 59, 57, 54, 51, 49],
      precipitationByMonth: [5.0, 4.0, 3.5, 2.5, 2.0, 1.5, 0.8, 0.9, 1.5, 3.0, 5.5, 6.0],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [],
    fauna: ['herring', 'anchovy', 'squid', 'krill'],
    predators: ['orca', 'sea-lion', 'shark'],
    parasitePrevalence: [],
  },

  'columbia-river': {
    id: 'columbia-river',
    name: 'Columbia River',
    climate: {
      temperatureByMonth: [36, 42, 48, 54, 60, 68, 76, 75, 66, 54, 42, 36],
      precipitationByMonth: [5.5, 4.0, 3.5, 2.5, 2.0, 1.5, 0.5, 0.5, 1.0, 2.5, 5.0, 6.0],
      firstFrostMonth: 10,
      lastFrostMonth: 2,
    },
    flora: [],
    fauna: ['steelhead', 'lamprey', 'sturgeon'],
    predators: ['bear', 'eagle', 'osprey', 'sea-lion'],
    parasitePrevalence: [],
  },

  'spawning-stream': {
    id: 'spawning-stream',
    name: 'Spawning Stream',
    climate: {
      temperatureByMonth: [30, 34, 40, 48, 55, 62, 68, 67, 58, 48, 38, 32],
      precipitationByMonth: [4.5, 3.5, 3.0, 2.5, 2.0, 1.5, 0.8, 0.8, 1.5, 3.0, 4.5, 5.0],
      firstFrostMonth: 9,
      lastFrostMonth: 3,
    },
    flora: [],
    fauna: ['salmon', 'trout', 'crayfish'],
    predators: ['bear', 'eagle', 'osprey', 'raccoon'],
    parasitePrevalence: [],
  },

  'caribbean-sea': {
    id: 'caribbean-sea',
    name: 'Caribbean Sea',
    climate: {
      temperatureByMonth: [79, 79, 80, 81, 82, 83, 84, 85, 84, 83, 81, 80],
      precipitationByMonth: [2.0, 1.5, 1.5, 2.0, 3.5, 4.5, 4.0, 4.5, 5.0, 5.5, 4.0, 2.5],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'turtle-grass', name: 'Turtle Grass', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 60, abundanceByMonth: [0.7, 0.7, 0.8, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7, 0.7, 0.7, 0.7] },
      { id: 'halimeda-algae', name: 'Halimeda Algae', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 40, abundanceByMonth: [0.6, 0.6, 0.7, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6, 0.6, 0.6, 0.6] },
    ],
    fauna: ['hawksbill-turtle', 'loggerhead-turtle', 'dolphin', 'manatee', 'barracuda'],
    predators: ['tiger-shark', 'bull-shark'],
    parasitePrevalence: [
      { parasiteId: 'fibropapillomatosis', baseChance: 0.03, seasonalModifier: { spring: 1.0, summer: 1.3, autumn: 1.0, winter: 0.8 } },
    ],
  },

  'nesting-beach-caribbean': {
    id: 'nesting-beach-caribbean',
    name: 'Nesting Beach',
    climate: {
      temperatureByMonth: [78, 79, 80, 82, 84, 86, 87, 87, 85, 83, 81, 79],
      precipitationByMonth: [1.5, 1.0, 1.0, 1.5, 3.0, 4.0, 3.5, 4.0, 5.0, 5.0, 3.5, 2.0],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [],
    fauna: ['ghost-crab', 'frigatebird', 'raccoon'],
    predators: ['ghost-crab', 'frigatebird', 'raccoon', 'poacher'],
    parasitePrevalence: [],
  },

  'great-lakes-milkweed': {
    id: 'great-lakes-milkweed',
    name: 'Great Lakes Milkweed Corridor',
    climate: {
      temperatureByMonth: [22, 25, 36, 50, 62, 72, 77, 75, 66, 53, 40, 27],
      precipitationByMonth: [2.0, 1.8, 2.5, 3.2, 3.5, 3.8, 3.5, 3.2, 3.0, 2.5, 2.8, 2.2],
      firstFrostMonth: 9,
      lastFrostMonth: 4,
    },
    flora: [
      { id: 'common-milkweed', name: 'Common Milkweed', availableSeasons: ['spring', 'summer'], nutritiveValue: 70, abundanceByMonth: [0, 0, 0, 0.2, 0.6, 0.9, 1.0, 0.8, 0.5, 0.2, 0, 0] },
      { id: 'goldenrod', name: 'Goldenrod', availableSeasons: ['summer', 'autumn'], nutritiveValue: 55, abundanceByMonth: [0, 0, 0, 0, 0, 0.3, 0.6, 0.9, 1.0, 0.5, 0, 0] },
    ],
    fauna: ['bird', 'spider', 'wasp', 'tachinid-fly'],
    predators: ['bird', 'spider', 'praying-mantis', 'wasp'],
    parasitePrevalence: [
      { parasiteId: 'oe-protozoan', baseChance: 0.05, seasonalModifier: { spring: 0.8, summer: 1.3, autumn: 1.0, winter: 0.3 } },
    ],
  },

  'texas-gulf-coast-stopover': {
    id: 'texas-gulf-coast-stopover',
    name: 'Texas Gulf Coast',
    climate: {
      temperatureByMonth: [52, 56, 63, 70, 78, 84, 87, 87, 82, 73, 62, 54],
      precipitationByMonth: [3.5, 3.0, 3.0, 3.0, 4.5, 5.5, 3.0, 3.5, 5.0, 5.5, 4.0, 3.5],
      firstFrostMonth: 11,
      lastFrostMonth: 1,
    },
    flora: [
      { id: 'aster', name: 'Aster', availableSeasons: ['autumn', 'winter'], nutritiveValue: 45, abundanceByMonth: [0.2, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.8, 0.6, 0.3] },
      { id: 'tropical-milkweed', name: 'Tropical Milkweed', availableSeasons: ['spring', 'summer', 'autumn'], nutritiveValue: 65, abundanceByMonth: [0.3, 0.3, 0.5, 0.7, 0.8, 0.7, 0.6, 0.6, 0.5, 0.4, 0.3, 0.3] },
    ],
    fauna: ['bird', 'spider'],
    predators: ['bird', 'spider'],
    parasitePrevalence: [],
  },

  'oyamel-fir-forest-mexico': {
    id: 'oyamel-fir-forest-mexico',
    name: 'Oyamel Fir Forest, Mexico',
    climate: {
      temperatureByMonth: [45, 48, 52, 55, 55, 54, 52, 52, 52, 50, 47, 45],
      precipitationByMonth: [0.5, 0.3, 0.5, 1.0, 2.5, 5.0, 5.5, 5.0, 4.5, 2.5, 0.8, 0.5],
      firstFrostMonth: 10,
      lastFrostMonth: 2,
    },
    flora: [
      { id: 'oyamel-fir', name: 'Oyamel Fir', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 5, abundanceByMonth: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] },
    ],
    fauna: ['black-backed-oriole', 'grosbeak'],
    predators: ['black-backed-oriole', 'black-headed-grosbeak'],
    parasitePrevalence: [],
  },

  'western-hudson-bay': {
    id: 'western-hudson-bay',
    name: 'Western Hudson Bay',
    climate: {
      temperatureByMonth: [-22, -18, -4, 18, 37, 50, 61, 58, 45, 28, 6, -14],
      precipitationByMonth: [0.8, 0.6, 0.8, 1.0, 1.2, 2.0, 2.5, 2.8, 2.5, 1.8, 1.2, 0.8],
      firstFrostMonth: 8,
      lastFrostMonth: 5,
    },
    flora: [
      { id: 'arctic-willow', name: 'Arctic Willow', availableSeasons: ['summer'], nutritiveValue: 15, abundanceByMonth: [0, 0, 0, 0, 0.2, 0.5, 0.6, 0.5, 0.2, 0, 0, 0] },
      { id: 'kelp', name: 'Kelp', availableSeasons: ['summer', 'autumn'], nutritiveValue: 10, abundanceByMonth: [0, 0, 0, 0, 0.1, 0.3, 0.5, 0.5, 0.4, 0.2, 0, 0] },
    ],
    fauna: ['ringed-seal', 'bearded-seal', 'beluga-whale', 'arctic-fox', 'caribou'],
    predators: ['human'],
    parasitePrevalence: [
      { parasiteId: 'trichinella', baseChance: 0.03, seasonalModifier: { spring: 1.2, summer: 0.5, autumn: 0.5, winter: 1.5 } },
    ],
  },

  'florida-fig-hammock': {
    id: 'florida-fig-hammock',
    name: 'Florida Tropical Hammock',
    climate: {
      temperatureByMonth: [67, 68, 72, 76, 80, 83, 84, 84, 83, 79, 74, 69],
      precipitationByMonth: [2.0, 2.3, 3.0, 3.2, 5.5, 8.5, 6.5, 7.0, 8.0, 6.0, 3.5, 2.0],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'ficus-aurea-fig', name: 'Strangler Fig (Ficus aurea)', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 90, abundanceByMonth: [0.4, 0.5, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.5, 0.4] },
      { id: 'gumbo-limbo', name: 'Gumbo Limbo', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 10, abundanceByMonth: [0.6, 0.6, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.7, 0.6, 0.6] },
    ],
    fauna: ['fig-wasp', 'non-pollinating-wasp', 'ant', 'spider', 'anole-lizard', 'tree-frog'],
    predators: ['spider', 'ant', 'parasitoid-wasp', 'bird'],
    parasitePrevalence: [
      { parasiteId: 'fig-nematode', baseChance: 0.06, seasonalModifier: { spring: 1.0, summer: 1.4, autumn: 1.2, winter: 0.6 } },
      { parasiteId: 'parasitoid-wasp', baseChance: 0.04, seasonalModifier: { spring: 0.8, summer: 1.3, autumn: 1.1, winter: 0.5 } },
    ],
  },
};

export function getRegionDefinition(id: string): RegionDefinition | undefined {
  return REGION_DEFINITIONS[id];
}
