import type { GameState } from '../store/gameStore';
import { computeEffectiveValue, StatId } from '../types/stats';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  /** Check at end of turn or on death */
  checkOn: 'turn' | 'death' | 'both';
  /** If set, only check/show for these species IDs */
  species?: string | string[];
  check: (state: GameState) => boolean;
  /** Returns partial progress for display. Undefined = binary unlock. */
  progress?: (state: any) => { current: number; target: number } | null;
}

const WEIGHT_THRESHOLDS: Record<string, { heavy: number; nearStarvation: number; unit: string }> = {
  'white-tailed-deer': { heavy: 200, nearStarvation: 80, unit: 'lbs' },
  'gray-wolf': { heavy: 120, nearStarvation: 40, unit: 'lbs' },
  'african-elephant': { heavy: 14000, nearStarvation: 4000, unit: 'lbs' },
  'polar-bear': { heavy: 1200, nearStarvation: 400, unit: 'lbs' },
  'chinook-salmon': { heavy: 80, nearStarvation: 15, unit: 'lbs' },
  'green-sea-turtle': { heavy: 500, nearStarvation: 100, unit: 'lbs' },
  'common-octopus': { heavy: 100, nearStarvation: 20, unit: 'lbs' },
  'poison-dart-frog': { heavy: 0.06, nearStarvation: 0.01, unit: 'lbs' },
  'monarch-butterfly': { heavy: 0.001, nearStarvation: 0.0002, unit: 'lbs' },
  'honeybee-worker': { heavy: 0.0003, nearStarvation: 0.00005, unit: 'lbs' },
  'fig-wasp': { heavy: 0.00001, nearStarvation: 0.000002, unit: 'lbs' },
  'arctic-tern': { heavy: 0.3, nearStarvation: 0.15, unit: 'lbs' },
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // --- Universal Survival milestones ---
  {
    id: 'survivor-10',
    name: 'First Steps',
    description: 'Survive 10 turns.',
    checkOn: 'both',
    check: (s) => s.time.turn >= 10,
    progress: (s) => ({ current: Math.min(s.time.turn, 10), target: 10 }),
  },
  {
    id: 'survivor-50',
    name: 'Seasoned Survivor',
    description: 'Survive 50 turns.',
    checkOn: 'both',
    check: (s) => s.time.turn >= 50,
    progress: (s) => ({ current: Math.min(s.time.turn, 50), target: 50 }),
  },
  {
    id: 'survive-winter',
    name: 'Winter Survivor',
    description: 'Survive until Spring.',
    checkOn: 'turn',
    check: (s) => s.time.season === 'spring' && s.time.turn > 0,
  },

  // --- Universal Fitness/Health ---
  {
    id: 'first-offspring',
    name: 'New Life',
    description: 'Produce your first offspring.',
    checkOn: 'turn',
    check: (s) =>
      (s.reproduction.type === 'iteroparous' && s.reproduction.offspring.length > 0) ||
      (s.reproduction.type === 'semelparous' && s.reproduction.spawned),
  },
  {
    id: 'peak-health',
    name: 'Peak Condition',
    description: 'Reach 90+ Health.',
    checkOn: 'turn',
    check: (s) => computeEffectiveValue(s.animal.stats[StatId.HEA]) >= 90,
  },

  // --- Species-Specific: White-Tailed Deer ---
  {
    id: 'deer-migrated',
    name: 'The Yard',
    description: 'Complete your first winter migration.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) => s.animal.flags.has('has-migrated'),
  },
  {
    id: 'deer-raised-twins',
    name: 'Double Blessing',
    description: 'Successfully raise twin fawns to independence.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.filter((o) => o.matured).length >= 2,
  },
  {
    id: 'deer-heavy',
    name: 'Heavy Rack',
    description: 'Reach 200+ lbs body weight as a deer.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) => s.animal.weight >= 200,
  },

  // --- Species-Specific: Gray Wolf ---
  {
    id: 'wolf-alpha',
    name: 'Alpha',
    description: 'Win a hierarchy challenge.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.flags.has('alpha-status'),
  },
  {
    id: 'wolf-pack-hunt',
    name: 'Pack Hunter',
    description: 'Complete a successful cooperative hunt.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.flags.has('pack-hunt-success'),
  },
  {
    id: 'wolf-heavy',
    name: 'Dire Strength',
    description: 'Reach 120+ lbs body weight as a wolf.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.weight >= 120,
  },

  // --- Species-Specific: African Elephant ---
  {
    id: 'elephant-musth',
    name: 'State of Musth',
    description: 'Enter musth as a bull elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.animal.sex === 'male' && s.animal.flags.has('in-musth'),
  },
  {
    id: 'elephant-titan',
    name: 'Titan',
    description: 'Reach 14,000+ lbs as an elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.animal.weight >= 14000,
  },

  // --- Species-Specific: Polar Bear ---
  {
    id: 'pb-ice-free-survivor',
    name: 'The Long Fast',
    description: 'Survive an entire ice-free summer season.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) => s.animal.flags.has('survived-ice-free'),
  },
  {
    id: 'pb-heavy',
    name: 'Arctic Colossus',
    description: 'Reach 1,200+ lbs as a polar bear.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) => s.animal.weight >= 1200,
  },

  // --- Species-Specific: Chinook Salmon ---
  {
    id: 'salmon-spawn',
    name: 'Circle of Life',
    description: 'Successfully spawn in your natal stream.',
    checkOn: 'both',
    species: 'chinook-salmon',
    check: (s) => s.reproduction.type === 'semelparous' && s.reproduction.spawned,
  },
  {
    id: 'salmon-upstream',
    name: 'Against the Current',
    description: 'Reach the spawning grounds.',
    checkOn: 'turn',
    species: 'chinook-salmon',
    check: (s) => s.animal.flags.has('reached-spawning-grounds'),
  },

  // --- Species-Specific: Green Sea Turtle ---
  {
    id: 'turtle-nesting',
    name: 'Nesting Mother',
    description: 'Successfully nest and lay eggs.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.length > 0,
  },
  {
    id: 'turtle-natal-beach',
    name: 'Homecoming',
    description: 'Return to your natal beach.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) => s.animal.flags.has('returned-natal-beach'),
  },

  // --- Species-Specific: Common Octopus ---
  {
    id: 'octopus-full-cycle',
    name: 'Eight Arms, One Purpose',
    description: 'Complete the full octopus lifecycle: mate and lay eggs.',
    checkOn: 'both',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('eggs-laid'),
  },
  {
    id: 'octopus-tool-use',
    name: 'The Inventor',
    description: 'Discover tool use as an octopus.',
    checkOn: 'turn',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('tool-use-discovered'),
  },

  // --- Species-Specific: Poison Dart Frog ---
  {
    id: 'frog-metamorphosis',
    name: 'From Water to Land',
    description: 'Complete metamorphosis from tadpole to frog.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) => s.animal.flags.has('metamorphosis-complete'),
  },
  {
    id: 'frog-raise-tadpoles',
    name: 'Devoted Parent',
    description: 'Successfully raise tadpoles to independence.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },

  // --- Species-Specific: Monarch Butterfly ---
  {
    id: 'monarch-reach-mexico',
    name: 'The Journey South',
    description: 'Reach the overwintering grounds in Mexico.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.animal.region === 'oyamel-fir-forest-mexico',
  },
  {
    id: 'monarch-metamorphosis',
    name: 'Transformation',
    description: 'Complete metamorphosis to butterfly.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.animal.flags.has('metamorphosis-complete'),
  },

  // --- Species-Specific: Arctic Tern ---
  {
    id: 'tern-first-migration',
    name: 'Pole to Pole',
    description: 'Complete your first southward migration.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) => s.animal.flags.has('arrived-antarctic'),
  },
  {
    id: 'tern-raise-chicks',
    name: 'Colony Parent',
    description: 'Raise chicks to fledging age.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },

  // --- Species-Specific: Honeybee Worker ---
  {
    id: 'bee-waggle-dancer',
    name: 'The Language of Dance',
    description: 'Perform a waggle dance.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.flags.has('waggle-dance-performed'),
  },
  {
    id: 'bee-winter-survivor',
    name: 'The Long Cold',
    description: 'Survive an entire winter as a honeybee.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.age >= 5 && s.time.season === 'spring',
  },

  // --- Species-Specific: Fig Wasp ---
  {
    id: 'figwasp-full-cycle',
    name: 'The Mutualism',
    description: 'Lay eggs in a new fig to complete the cycle.',
    checkOn: 'both',
    species: 'fig-wasp',
    check: (s) => s.animal.flags.has('eggs-laid'),
  },

  // --- Generic Weight achievements (Species-Relative) ---
  {
    id: 'heavy-weight-relative',
    name: 'Prime Specimen',
    description: 'Reach a body weight significantly above your species average.',
    checkOn: 'turn',
    check: (s) => {
      const thresholds = WEIGHT_THRESHOLDS[s.animal.speciesId];
      return thresholds ? s.animal.weight >= thresholds.heavy : false;
    },
  },
  {
    id: 'near-starvation-relative',
    name: 'Survivor of Famine',
    description: 'Survive a turn at a dangerously low body weight.',
    checkOn: 'turn',
    check: (s) => {
      const thresholds = WEIGHT_THRESHOLDS[s.animal.speciesId];
      return thresholds ? (s.animal.weight < thresholds.nearStarvation && s.animal.alive) : false;
    },
  },

  // --- Meta achievements ---
  {
    id: 'play-all-species',
    name: 'Biodiversity',
    description: 'Start a game with every available species.',
    checkOn: 'turn',
    check: () => false, // Handled in AchievementChecker
  },
];
