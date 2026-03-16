import type { GameEvent } from '../../types/events';
import { StatId } from '../../types/stats';

/** Phase 15: Cross-species easter egg events.
 *  These fire when the player is playing one species and encounters another species they may have
 *  played before, creating a moment of recognition. Enhanced narrative if the player has played both. */
export const CROSS_SPECIES_EVENTS: GameEvent[] = [
  // ── Wolf encounters deer herd ──
  {
    id: 'cross-wolf-sees-deer',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A herd of white-tailed deer grazes at the meadow edge, ears swiveling. Their scent is strong on the wind. One lifts its head, sees you, and its whole body goes rigid.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, duration: 3, label: '+WIS (prey observation)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['social', 'cross-species'],
    footnote: undefined,
  },

  // ── Deer hears wolves howl ──
  {
    id: 'cross-deer-hears-wolves',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A howl rises from the ridge, long and wavering. Then another answers, and another. Every muscle in your body locks. Your hind legs coil. The sound vibrates in your chest and your nostrils flare wide, searching the wind.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, duration: 2, label: '+TRA (wolf howl)' },
      { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV (alertness)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['predator', 'cross-species'],
    footnote: undefined,
  },

  // ── Salmon sees bears fishing ──
  {
    id: 'cross-salmon-sees-bears',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Massive shapes line the riverbank, standing in the shallows with paws poised. They swipe at the water, plucking fish from the current. From below the surface you see their open mouths, rows of teeth, the shadow of each paw before it strikes.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, duration: 2, label: '+TRA (bears fishing)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['chinook-salmon'] },
      { type: 'has_flag', flag: 'freshwater-entered' },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['predator', 'cross-species'],
    footnote: undefined,
  },

  // ── Octopus observes sea turtle ──
  {
    id: 'cross-octopus-sees-turtle',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A green sea turtle glides over the reef, its flippers pulling the water in slow arcs. It grazes the seagrass. You change color to match its shadow as it passes overhead.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, duration: 2, label: '+WIS (observation)' },
      { stat: StatId.NOV, amount: 3, duration: 2, label: '+NOV (wonder)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['social', 'cross-species'],
    footnote: undefined,
  },

  // ── Honeybee encounters bear ──
  {
    id: 'cross-bee-sees-bear',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The alarm pheromone floods the hive. A bear is near, its heavy scent filling the air. The colony vibrates with a rising pitch. The bear\'s thick fur deflects stings, but the hive surges outward in defense.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, duration: 2, label: '+TRA (bear threat)' },
      { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM (defend home)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'cross-species'],
    footnote: undefined,
  },

  // ── Tern flies over whales ──
  {
    id: 'cross-tern-sees-whales',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Far below, dark shapes move through the water. Vast bodies cutting furrows through the ocean surface. From up here they are slow dark forms against the pale sea floor, their spouts visible as brief white bursts.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, duration: 3, label: '+WIS (shared journey)' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['arctic-tern'] },
      { type: 'has_flag', flag: 'will-migrate' },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['social', 'cross-species', 'migration'],
    footnote: undefined,
  },

  // ── Dart frog watches snake eat another frog ──
  {
    id: 'cross-frog-sees-snake-eat',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'From behind a leaf, you watch a cat-eyed snake swallow a small frog, a dull-brown tree frog. The snake\'s jaws unhinge around the body and the frog disappears inch by inch. Your bright skin tingles. The snake has passed you twice already without striking.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, duration: 2, label: '+TRA (predation witnessed)' },
      { stat: StatId.WIS, amount: 3, duration: 2, label: '+WIS (survival lesson)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['poison-dart-frog'] },
      { type: 'age_range', min: 6 },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['predator', 'cross-species'],
    footnote: undefined,
  },

  // ── Elephant sees bones ──
  {
    id: 'cross-elephant-sees-bones',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'You come upon a scattering of bones, large and sun-bleached. The herd pauses. You reach out with your trunk and touch the skull, running the tip over the worn surface.',
    statEffects: [
      { stat: StatId.WIS, amount: 8, duration: 4, label: '+WIS (ancestral recognition)' },
      { stat: StatId.HOM, amount: 5, duration: 3, label: '+HOM (mortality)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['african-elephant'] },
      { type: 'age_range', min: 24 },
    ],
    weight: 5,
    cooldown: 16,
    tags: ['social', 'cross-species'],
    footnote: undefined,
  },

  // ── Polar bear watches walrus ──
  {
    id: 'cross-polar-sees-walrus',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A walrus hauls itself onto the ice, a mass of blubber and tusks. The tusks can gore a bear, and the blubber is thick. You watch from downwind. The walrus watches back, one suspicious eye half-open.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, duration: 2, label: '+WIS (calculation)' },
      { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV (sizing up)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['social', 'cross-species'],
    footnote: undefined,
  },

  // ── Turtle sees reef fish cleaning station ──
  {
    id: 'cross-turtle-cleaning-station',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'You drift to a patch of reef where small wrasse fish hover in a cloud of activity. They pick at your shell and flippers, removing parasites with small, precise bites. The sensation is light and persistent.',
    statEffects: [
      { stat: StatId.HEA, amount: 3, duration: 2, label: '+HEA (cleaning)' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 6,
    cooldown: 10,
    tags: ['social', 'cross-species'],
    footnote: undefined,
  },
];
