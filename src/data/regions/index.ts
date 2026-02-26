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

  'midwest-prairie-apiary': {
    id: 'midwest-prairie-apiary',
    name: 'Midwest Prairie',
    climate: {
      temperatureByMonth: [22, 27, 38, 52, 63, 73, 78, 76, 67, 54, 39, 25],
      precipitationByMonth: [1.0, 1.1, 2.2, 3.5, 4.2, 4.5, 3.8, 3.6, 3.2, 2.8, 2.0, 1.2],
      firstFrostMonth: 9,
      lastFrostMonth: 4,
    },
    flora: [
      { id: 'white-clover', name: 'White Clover', availableSeasons: ['spring', 'summer', 'autumn'], nutritiveValue: 70, abundanceByMonth: [0, 0, 0.2, 0.5, 0.8, 1.0, 0.9, 0.7, 0.5, 0.2, 0, 0] },
      { id: 'goldenrod', name: 'Goldenrod', availableSeasons: ['summer', 'autumn'], nutritiveValue: 80, abundanceByMonth: [0, 0, 0, 0, 0, 0.3, 0.6, 0.9, 1.0, 0.5, 0, 0] },
      { id: 'alfalfa', name: 'Alfalfa', availableSeasons: ['spring', 'summer'], nutritiveValue: 75, abundanceByMonth: [0, 0, 0.1, 0.4, 0.8, 1.0, 1.0, 0.8, 0.5, 0.2, 0, 0] },
    ],
    fauna: ['honeybee', 'bumblebee', 'monarch-butterfly', 'meadowlark', 'grasshopper'],
    predators: ['bee-eater', 'spider', 'dragonfly', 'robber-fly'],
    parasitePrevalence: [
      { parasiteId: 'varroa-mite', baseChance: 0.10, seasonalModifier: { spring: 0.8, summer: 1.5, autumn: 1.3, winter: 0.4 } },
      { parasiteId: 'nosema-ceranae', baseChance: 0.06, seasonalModifier: { spring: 1.3, summer: 0.8, autumn: 0.9, winter: 1.5 } },
    ],
  },

  'mediterranean-reef': {
    id: 'mediterranean-reef',
    name: 'Mediterranean Reef',
    climate: {
      temperatureByMonth: [55, 55, 57, 60, 66, 73, 79, 80, 76, 69, 62, 57],
      precipitationByMonth: [2.5, 2.0, 1.8, 1.2, 0.8, 0.3, 0.1, 0.2, 0.8, 2.0, 3.0, 2.8],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'posidonia-seagrass', name: 'Posidonia Seagrass', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 15, abundanceByMonth: [0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.8, 0.8, 0.7, 0.6, 0.5, 0.4] },
      { id: 'coralline-algae', name: 'Coralline Algae', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 10, abundanceByMonth: [0.5, 0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 0.9, 0.8, 0.7, 0.6, 0.5] },
    ],
    fauna: ['shore-crab', 'spider-crab', 'damselfish', 'grouper', 'mussel', 'sea-urchin'],
    predators: ['moray-eel', 'conger-eel', 'grouper', 'bottlenose-dolphin'],
    parasitePrevalence: [
      { parasiteId: 'aggregata-coccidian', baseChance: 0.08, seasonalModifier: { spring: 1.0, summer: 1.4, autumn: 1.2, winter: 0.7 } },
      { parasiteId: 'dicyemid-parasite', baseChance: 0.05, seasonalModifier: { spring: 1.0, summer: 1.2, autumn: 1.0, winter: 0.8 } },
    ],
  },
  'arctic-breeding-colony': {
    id: 'arctic-breeding-colony',
    name: 'Arctic Breeding Colony',
    climate: {
      temperatureByMonth: [-5, -2, 10, 25, 38, 48, 52, 50, 40, 28, 12, 0],
      precipitationByMonth: [0.5, 0.4, 0.6, 0.8, 1.2, 1.5, 1.8, 2.0, 1.5, 1.0, 0.7, 0.5],
      firstFrostMonth: 8,
      lastFrostMonth: 5,
    },
    flora: [
      { id: 'tundra-moss', name: 'Tundra Moss', availableSeasons: ['summer'], nutritiveValue: 5, abundanceByMonth: [0, 0, 0, 0, 0.2, 0.6, 0.8, 0.7, 0.3, 0, 0, 0] },
      { id: 'arctic-lichen', name: 'Arctic Lichen', availableSeasons: ['summer', 'autumn'], nutritiveValue: 5, abundanceByMonth: [0, 0, 0, 0, 0.3, 0.5, 0.6, 0.6, 0.4, 0.2, 0, 0] },
    ],
    fauna: ['sand-eel', 'arctic-char', 'lemming', 'arctic-fox', 'snowy-owl'],
    predators: ['great-skua', 'herring-gull', 'arctic-fox', 'peregrine-falcon'],
    parasitePrevalence: [
      { parasiteId: 'feather-lice', baseChance: 0.08, seasonalModifier: { spring: 0.8, summer: 1.5, autumn: 1.0, winter: 0.5 } },
      { parasiteId: 'cestode-tapeworm', baseChance: 0.05, seasonalModifier: { spring: 1.0, summer: 1.3, autumn: 1.0, winter: 0.8 } },
    ],
  },

  'atlantic-flyway': {
    id: 'atlantic-flyway',
    name: 'Atlantic Flyway',
    climate: {
      temperatureByMonth: [45, 46, 50, 55, 62, 68, 72, 71, 66, 58, 50, 45],
      precipitationByMonth: [3.0, 2.8, 3.2, 3.5, 3.8, 3.5, 3.0, 3.2, 3.5, 3.2, 3.0, 3.0],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'sargassum', name: 'Sargassum Seaweed', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 10, abundanceByMonth: [0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 0.7, 0.5, 0.4, 0.4] },
    ],
    fauna: ['flying-fish', 'sand-eel', 'herring', 'squid', 'jellyfish'],
    predators: ['peregrine-falcon', 'great-skua', 'herring-gull'],
    parasitePrevalence: [
      { parasiteId: 'avian-malaria', baseChance: 0.04, seasonalModifier: { spring: 1.0, summer: 1.5, autumn: 1.2, winter: 0.5 } },
    ],
  },

  'antarctic-pack-ice-edge': {
    id: 'antarctic-pack-ice-edge',
    name: 'Antarctic Pack Ice Edge',
    climate: {
      temperatureByMonth: [30, 28, 22, 15, 8, 2, 0, 2, 10, 18, 24, 28],
      precipitationByMonth: [1.0, 0.8, 0.8, 0.6, 0.5, 0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 1.0],
      firstFrostMonth: 3,
      lastFrostMonth: 9,
    },
    flora: [
      { id: 'ice-algae', name: 'Ice Algae', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 5, abundanceByMonth: [0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] },
    ],
    fauna: ['antarctic-krill', 'silverfish', 'squid', 'petrel', 'penguin'],
    predators: ['leopard-seal', 'south-polar-skua'],
    parasitePrevalence: [
      { parasiteId: 'feather-lice', baseChance: 0.06, seasonalModifier: { spring: 1.0, summer: 1.2, autumn: 1.0, winter: 0.6 } },
    ],
  },

  'costa-rican-rainforest': {
    id: 'costa-rican-rainforest',
    name: 'Costa Rican Rainforest',
    climate: {
      temperatureByMonth: [75, 76, 78, 79, 79, 78, 77, 77, 77, 76, 75, 75],
      precipitationByMonth: [0.5, 0.3, 0.5, 2.5, 8.5, 10.0, 7.5, 8.0, 10.5, 11.0, 6.5, 1.5],
      firstFrostMonth: -1,
      lastFrostMonth: -1,
    },
    flora: [
      { id: 'bromeliad', name: 'Bromeliad', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 5, abundanceByMonth: [0.8, 0.8, 0.8, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.8] },
      { id: 'heliconia', name: 'Heliconia', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 10, abundanceByMonth: [0.6, 0.6, 0.7, 0.8, 0.9, 0.9, 0.8, 0.8, 0.9, 0.9, 0.8, 0.7] },
    ],
    fauna: ['oribatid-mite', 'formicine-ant', 'fruit-fly', 'tree-frog', 'anole'],
    predators: ['cat-eyed-snake', 'wandering-spider', 'centipede', 'bird'],
    parasitePrevalence: [
      { parasiteId: 'chytrid-fungus', baseChance: 0.06, seasonalModifier: { spring: 1.0, summer: 1.3, autumn: 1.2, winter: 0.8 } },
      { parasiteId: 'frog-nematode', baseChance: 0.05, seasonalModifier: { spring: 1.0, summer: 1.4, autumn: 1.1, winter: 0.7 } },
    ],
  },

  'farmstead': {
    id: 'farmstead',
    name: 'The Old Farmstead',
    climate: {
      temperatureByMonth: [25, 30, 42, 55, 65, 75, 80, 78, 68, 55, 42, 30],
      precipitationByMonth: [1.5, 1.2, 2.5, 3.5, 4.0, 4.2, 3.5, 3.2, 3.0, 2.5, 2.0, 1.5],
      firstFrostMonth: 9,
      lastFrostMonth: 4,
    },
    flora: [
      { id: 'corn-spillage', name: 'Spilled Corn', availableSeasons: ['autumn', 'winter'], nutritiveValue: 90, abundanceByMonth: [0, 0, 0, 0, 0, 0, 0, 0.2, 0.8, 1.0, 0.8, 0.5] },
      { id: 'pasture-grass', name: 'Pasture Grass', availableSeasons: ['spring', 'summer', 'autumn'], nutritiveValue: 50, abundanceByMonth: [0, 0, 0.2, 0.6, 0.8, 1.0, 0.9, 0.8, 0.6, 0.3, 0, 0] },
      { id: 'kitchen-scraps', name: 'Kitchen Scraps', availableSeasons: ['spring', 'summer', 'autumn', 'winter'], nutritiveValue: 70, abundanceByMonth: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] },
    ],
    fauna: ['chicken', 'pig', 'barn-cat', 'rat'],
    predators: ['fox', 'coyote', 'hawk', 'raccoon'],
    parasitePrevalence: [
      { parasiteId: 'gi-roundworm', baseChance: 0.05, seasonalModifier: { spring: 1.2, summer: 1.5, autumn: 1.0, winter: 0.5 } },
    ],
  },
};

export function getRegionDefinition(id: string): RegionDefinition | undefined {
  return REGION_DEFINITIONS[id];
}
