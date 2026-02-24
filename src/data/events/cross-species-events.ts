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
    narrativeText: 'A herd of white-tailed deer grazes at the meadow\'s edge, ears swiveling, eyes watchful. You know their fear is justified — you are the predator that shapes their every decision. From their perspective, you are the shadow that never stops coming.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, duration: 3, label: '+WIS (prey observation)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['social', 'cross-species'],
    footnote: 'Have you ever wondered what the deer sees when it looks at you?',
  },

  // ── Deer hears wolves howl ──
  {
    id: 'cross-deer-hears-wolves',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A howl rises from the ridge — long, wavering, ancient. Then another answers, and another. The wolves are singing to each other, mapping their world in sound. To you, it is a hymn of fear. Every muscle in your body screams: run. But perhaps, from their side, it is just a conversation.',
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
    footnote: 'In another life, you might have been one of those voices.',
  },

  // ── Salmon sees bears fishing ──
  {
    id: 'cross-salmon-sees-bears',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Massive shapes line the riverbank — grizzly bears, standing in the shallows with paws poised. They swipe at the water with terrifying precision, plucking your kind from the current like picking fruit. From below the surface, their open mouths are caverns of teeth. This is what the world looks like to the food.',
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
    footnote: 'Every salmon run is also a bear feast. Every bear feast was once a salmon journey.',
  },

  // ── Octopus observes sea turtle ──
  {
    id: 'cross-octopus-sees-turtle',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A green sea turtle glides over the reef — ancient, unhurried, its flippers sculling the water in slow arcs. It grazes the seagrass, oblivious to your presence in the rocks below. You change color to match its shadow as it passes. Two alien intelligences, sharing a reef, each invisible to the other.',
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
    footnote: 'The turtle does not know you are watching. Do you know who is watching you?',
  },

  // ── Honeybee encounters bear ──
  {
    id: 'cross-bee-sees-bear',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The alarm pheromone explodes through the hive — a bear has been spotted near the apiary. To the bear, the hive is a treasure box of honey. To you and your ten thousand sisters, it is home. The bear\'s thick fur deflects your stings, but the colony will defend its queen with every last worker.',
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
    footnote: 'The bear just wants honey. You just want to live. Nobody is wrong.',
  },

  // ── Tern flies over whales ──
  {
    id: 'cross-tern-sees-whales',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Far below, dark shapes move through the water — humpback whales, their vast bodies cutting gentle furrows through the ocean. They are migrating too, following the same food, the same currents, the same ancient routes. From up here, they look like slow shadows painted on the sea floor.',
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
    footnote: 'The ocean belongs to everyone who crosses it.',
  },

  // ── Dart frog watches snake eat another frog ──
  {
    id: 'cross-frog-sees-snake-eat',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'From behind a leaf, you watch a cat-eyed snake swallow a small frog — not your species, but a dull-brown tree frog with no toxins. The snake\'s jaws unhinge around the body, and the frog disappears inch by inch. Your skin crawls with alkaloids. Today, your chemistry saved you. That frog had no such luxury.',
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
    footnote: 'Evolution is the difference between being bright and being breakfast.',
  },

  // ── Elephant sees bones ──
  {
    id: 'cross-elephant-sees-bones',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'You come upon a scattering of bones — large, sun-bleached, unmistakably elephant. The herd pauses. You reach out with your trunk and touch the skull, running your sensitive tip over the worn surface. Something stirs in you — not thought exactly, but a weight of recognition that makes you trumpet softly into the still air.',
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
    footnote: 'Elephants are among the few animals known to investigate the bones of their own dead.',
  },

  // ── Polar bear watches walrus ──
  {
    id: 'cross-polar-sees-walrus',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A walrus hauls itself onto the ice — a mountain of blubber and tusks. It is a potential meal, but those tusks can gore a bear, and the blubber armor is thick. You watch from downwind, calculating. The walrus watches back, one suspicious eye half-open. Neither of you blinks.',
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
    footnote: 'The ice is a chessboard, and every meeting is a calculation.',
  },

  // ── Turtle sees reef fish cleaning station ──
  {
    id: 'cross-turtle-cleaning-station',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'You drift to a patch of reef where small wrasse fish hover in a cloud of activity. They approach you, picking parasites from your shell and flippers with delicate precision. The sensation is pleasant — a rare interspecies cooperation. They eat; you are cleaned. The arrangement is ancient.',
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
    footnote: 'Some of the reef\'s oldest relationships are written in grooming, not conflict.',
  },
];
