import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const CHINOOK_SALMON_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  OCEAN / FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-krill-feast',
    type: 'active',
    category: 'foraging',
    narrativeText: "A dense swarm of krill rises from below. The water thickens with their bodies. You open your mouth and swim through, filtering thousands with each pass.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [],
    weight: 15,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'salmon-baitfish-school',
    type: 'active',
    category: 'foraging',
    narrativeText: "Silver flashes ahead. A school of herring. You accelerate into the ball of fish, snapping at stragglers. The school reforms behind you.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [],
    weight: 12,
    cooldown: 2,
    tags: ['foraging', 'food'],
  },

  {
    id: 'salmon-deep-dive',
    type: 'active',
    category: 'foraging',
    narrativeText: "The water grows cold and dark as you descend. Pressure builds against your body. The krill are concentrated in dense layers down here, but the cold saps your muscles.",
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    conditions: [],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'exploration'],
  },

  {
    id: 'salmon-jellyfish-encounter',
    type: 'active',
    category: 'foraging',
    narrativeText: "Moon jellyfish drift through your feeding area, their trailing tentacles stinging your flanks. The krill you were chasing have scattered.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 5,
    tags: ['foraging', 'environmental'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-seal-attack',
    type: 'active',
    category: 'predator',
    narrativeText: "A dark shape rising fast from below. Harbor seal. Its pressure wave hits your lateral line before you see it. Closing fast.",
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'burst-away',
        label: 'Burst away at full speed',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Caught by a harbor seal.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'dive-deep',
        label: 'Dive deep',
        description: 'Try to escape into the dark water below',
        statEffects: [
          { stat: StatId.CLI, amount: 5, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'The seal followed you into the darkness.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'danger'],
  },

  {
    id: 'salmon-orca-pod',
    type: 'active',
    category: 'predator',
    narrativeText: "Subsonic clicks and whistles vibrate through your lateral line. Towering dorsal fins cut the surface. Orcas, driving salmon toward the surface in coordinated sweeps.",
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 15, label: '+ADV' },
    ],
    choices: [
      {
        id: 'scatter',
        label: 'Break from the school and scatter',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'An orca picked you out of the scattering school.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'freeze-in-school',
        label: 'Stay tight in the school',
        description: 'Hold position in the mass of bodies',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The orca drove through the school and took you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 4,
    cooldown: 12,
    tags: ['predator', 'danger'],
  },

  {
    id: 'salmon-fishing-net',
    type: 'active',
    category: 'predator',
    narrativeText: "A wall of mesh across the current. Fish around you are tangled, their bodies thrashing against monofilament. The net is closing.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
    ],
    choices: [
      {
        id: 'thrash-free',
        label: 'Thrash and fight through the net',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Tangled in the net. Hauled aboard.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'go-limp',
        label: 'Go limp and wait for a gap',
        description: 'Conserve energy and look for an opening',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: "Could not escape the net. Hauled aboard with the rest.",
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 6,
    cooldown: 10,
    tags: ['predator', 'danger', 'human'],
  },

  {
    id: 'salmon-seabird-attack',
    type: 'active',
    category: 'predator',
    narrativeText: "A pressure wave from above, then violent impact. A beak clamps on your tail, tearing scales loose. You wrench free and dive. The bird surfaces empty.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [],
    weight: 10,
    cooldown: 3,
    tags: ['predator'],
  },

  {
    id: 'salmon-bear-shallows',
    type: 'active',
    category: 'predator',
    narrativeText: "The river narrows. Through the churning white water, a pressure disturbance: something massive standing in the current. Other fish are stacking up around you, holding position.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
    ],
    choices: [
      {
        id: 'dart-past',
        label: 'Dart past at full speed',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: "A paw slammed down. Over in an instant.",
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-opening',
        label: 'Wait for the disturbance to shift',
        description: 'Hold in the pool. Patient, but exposed.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Caught while holding in the shallows.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['predator', 'danger'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-migration-trigger',
    type: 'active',
    category: 'migration',
    narrativeText: "The water temperature is dropping. Something pulls you toward the coast. You taste the faintest trace of river chemistry on the current. The chemical signature of the water where you hatched.",
    statEffects: [],
    choices: [
      {
        id: 'begin-migration',
        label: 'Follow the chemical trace upstream',
        description: 'Begin the journey. There is no return from this.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'spawning-migration-begun' },
          { type: 'change_region', regionId: 'columbia-river' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'stay-in-ocean',
        label: 'Stay in the ocean',
        description: 'Ignore the pull. For now.',
        statEffects: [
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
      { type: 'age_range', min: 36 },
      { type: 'no_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 30,
    tags: ['migration', 'seasonal'],
  },

  {
    id: 'salmon-upstream-rapids',
    type: 'active',
    category: 'migration',
    narrativeText: "The river pushes against you. White water crashes over boulders. The current tears at your body with every stroke. Your muscles burn. Your skin scrapes against rock.",
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'salmon-waterfall-leap',
    type: 'active',
    category: 'migration',
    narrativeText: "A ledge of basalt. Six feet of falling water. Other salmon hurl themselves at it, most falling back. A narrow side channel trickles around the falls with barely enough water to swim in.",
    statEffects: [],
    choices: [
      {
        id: 'attempt-jump',
        label: 'Leap the falls',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
          { stat: StatId.STR, amount: -5, label: '-STR' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Dashed against the rocks at the base of the falls.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'side-channel',
        label: 'Take the side channel',
        description: 'Slower but safer',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'salmon-dam-obstruction',
    type: 'active',
    category: 'migration',
    narrativeText: "A wall across the river. The water pooling below it is deep and still and has no chemical signature. You can feel the river above, close. A fish ladder zigzags up one side, its channels churning.",
    statEffects: [
      { stat: StatId.HOM, amount: 15, label: '+HOM' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
    ],
    choices: [
      {
        id: 'use-fish-ladder',
        label: 'Use the fish ladder',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'find-way-around',
        label: 'Search for another way around',
        description: 'Exhausting and uncertain',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['migration', 'environmental', 'human'],
  },

  {
    id: 'salmon-eagle-attack',
    type: 'active',
    category: 'predator',
    narrativeText: "The water is too shallow to dive. You are a dark shape against pale gravel. A pressure wave from above. Talons descending.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'dive-deep-eagle',
        label: 'Dive to the deepest part of the channel',
        statEffects: [
          { stat: StatId.CLI, amount: 5, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'Plucked from the shallows before reaching deep water.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'burst-forward-eagle',
        label: 'Burst forward through the rapids',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Caught mid-leap between pools.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['predator', 'danger', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  SPAWNING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-finding-redd',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Clear, cold water over clean gravel. The current is gentle. Oxygen levels high. The substrate is loose enough to dig. The chemical signature of this place matches something in your body.",
    statEffects: [
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'reached-spawning-grounds' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
      { type: 'no_flag', flag: 'reached-spawning-grounds' },
      { type: 'age_range', min: 36 },
    ],
    weight: 25,
    tags: ['mating'],
  },

  {
    id: 'salmon-spawning-event',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Your body is battered, skin mottled, jaw hooked. You release eggs into the redd. The water clouds with milt. You sweep gravel over them with the last of your strength.",
    statEffects: [],
    consequences: [
      { type: 'spawn' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'no_flag', flag: 'spawning-complete' },
    ],
    weight: 30,
    tags: ['mating'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL / HEALTH EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-water-temperature',
    type: 'active',
    category: 'health',
    narrativeText: "The water is warm. Wrong. Your gills work harder to extract oxygen. A sluggish heaviness settles into your muscles.",
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['environmental', 'health'],
  },

  {
    id: 'salmon-sea-lice',
    type: 'active',
    category: 'health',
    narrativeText: "A crawling, biting sensation along your flanks. Parasitic copepods have latched onto your skin, feeding on your mucus and blood.",
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'sea-lice-infection',
        chance: 0.25,
        conditions: [
          { type: 'no_parasite', parasiteId: 'sea-lice' },
        ],
        narrativeText: 'The sea lice have established a breeding colony on your body. The damage to your mucus layer is growing.',
        footnote: '(Infested with sea lice)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'sea-lice', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['health'],
  },

  {
    id: 'salmon-pollution-plume',
    type: 'active',
    category: 'environmental',
    narrativeText: "The water chemistry changes ahead. A sharp, unfamiliar burn in your gills. Other fish are turning back. The plume extends across most of the channel.",
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [],
    weight: 6,
    cooldown: 8,
    tags: ['environmental', 'health', 'human'],
  },

  // ══════════════════════════════════════════════
  //  OCEAN / FORAGING EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-squid-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: "Far below, bioluminescent flashes pulse in the dark water. Each flash is something living, something edible. The cold deepens with every body-length of descent.",
    statEffects: [],
    choices: [
      {
        id: 'chase-deep',
        label: 'Chase into the deep water',
        description: 'Richer feeding, but the cold is punishing',
        statEffects: [
          { stat: StatId.CLI, amount: 6, label: '+CLI' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'stay-shallow',
        label: 'Stay in the shallows',
        description: 'Less reward, but no risk',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: 1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'food'],
  },

  {
    id: 'salmon-plankton-bloom',
    type: 'passive',
    category: 'foraging',
    narrativeText: "The water is thick with plankton. Everything in the water column is feeding. Herring, anchovies, jellyfish. You eat until your body aches.",
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['foraging', 'food', 'seasonal'],
  },

  {
    id: 'salmon-current-ride',
    type: 'passive',
    category: 'foraging',
    narrativeText: "You find the edge of an ocean current. Strong, steady, flowing the direction you need. You ease into it. Your muscles unwind. Small prey tumbles past in the flow and you snap at it without effort.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [],
    weight: 8,
    cooldown: 5,
    tags: ['foraging', 'environmental'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-sea-lion-chase',
    type: 'active',
    category: 'predator',
    narrativeText: "A massive shape explodes out of the kelp. The pressure wave hits your lateral line first. A sea lion, twisting through the fronds, locked on you.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'weave-kelp',
        label: 'Weave through the kelp',
        description: 'Use the forest of stalks to lose the predator',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'Cornered in the kelp. Nowhere left to turn.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'burst-open-water',
        label: 'Burst into open water',
        description: 'Outrun it or die',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'In open water, the sea lion was faster. It caught you from below.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 6,
    tags: ['predator', 'danger'],
  },

  {
    id: 'salmon-osprey-strike',
    type: 'passive',
    category: 'predator',
    narrativeText: "A whistle of wind, then impact. Something punches through the surface feet-first. A shockwave through the shallows. Claws rake your flank as you twist away.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'osprey-talon-wound',
        chance: 0.15,
        conditions: [],
        narrativeText: 'Shallow furrows along your side. Scales torn loose. Blood trailing in the current.',
        footnote: '(Raked by osprey talons)',
        statEffects: [],
        consequences: [
          { type: 'add_injury', injuryId: 'scale-damage', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['predator', 'danger', 'migration'],
  },

  {
    id: 'salmon-lamprey-attach',
    type: 'active',
    category: 'predator',
    narrativeText: "Something latches onto your side with a wet, grinding grip. Keratin teeth rasping through scales, boring toward flesh. A lamprey. Its body trails behind you.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'thrash-rocks',
        label: 'Thrash against the rocks to scrape it off',
        description: 'Violent, but should work',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'scale-damage', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'endure-lamprey',
        label: 'Endure it',
        description: 'Let it feed. Conserve your energy.',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'health'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-warm-tributary',
    type: 'active',
    category: 'migration',
    narrativeText: "Warm water spreads across the channel from a side tributary. Your gills labor in the oxygen-depleted flow. A cool seep from a spring feeds into the rocks to your left.",
    statEffects: [],
    choices: [
      {
        id: 'push-through-warm',
        label: 'Push through the warm zone',
        description: 'Faster, but the heat is dangerous',
        statEffects: [
          { stat: StatId.CLI, amount: 8, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The warm water overwhelmed your body. Heart stopped.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'rest-cool-pocket',
        label: 'Rest in the cool pocket and wait',
        description: 'Safe, but burns reserves',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'salmon-shallow-gravel-bar',
    type: 'active',
    category: 'migration',
    narrativeText: "The river braids and spreads across gravel. The water drops to barely covering your dorsal fin. You are on your side, gills working. The deeper channel is ten body-lengths away.",
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'thrash-to-channel',
        label: 'Thrash toward the deeper channel',
        description: 'Desperate, exhausting, but the only option',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'Could not reach deep water. Dried out on the gravel.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-water',
        label: 'Wait for the water level to rise',
        description: 'Patient, but fully exposed',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.ADV, amount: 6, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'Taken from the gravel bar by a raptor while waiting.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['migration', 'environmental', 'danger'],
  },

  {
    id: 'salmon-log-jam',
    type: 'active',
    category: 'migration',
    narrativeText: "Fallen timber chokes the channel. The river forces through narrow gaps between logs. The openings are barely wider than your body. The current thunders on the other side.",
    statEffects: [],
    choices: [
      {
        id: 'push-through-gaps',
        label: 'Push through the gaps',
        description: 'Tight, rough. Your scales will pay.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'scale-damage', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'go-around',
        label: 'Go around the long way',
        description: 'Safe, but exhausting',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'salmon-other-salmon-dying',
    type: 'passive',
    category: 'migration',
    narrativeText: "The chemical signature of decay reaches you before you see them. Along both banks, salmon bodies in various states of decomposition. White fungus blooming on flanks, jaws still hooked open. You swim through the nutrients their bodies have become.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['migration', 'psychological'],
  },

  // ══════════════════════════════════════════════
  //  AGE-GATED EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-smolt-transformation',
    type: 'passive',
    category: 'health',
    narrativeText: "Your parr marks are fading. Your flanks turn silver. Inside, your kidneys are shifting from freshwater filtration to salt processing. The river water that raised you is becoming chemically wrong.",
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'smolt-transformed' },
    ],
    conditions: [
      { type: 'age_range', max: 12 },
      { type: 'no_flag', flag: 'smolt-transformed' },
    ],
    weight: 20,
    tags: ['health', 'environmental'],
  },

  {
    id: 'salmon-ocean-growth-spurt',
    type: 'passive',
    category: 'health',
    narrativeText: "Your muscles thicken along your spine. Your jaws widen. Every meal translates directly into mass. You are growing longer, stronger, faster.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.HEA, amount: 5, label: '+HEA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 3 },
    ],
    conditions: [
      { type: 'age_range', min: 12, max: 36 },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['health', 'foraging'],
  },

  {
    id: 'salmon-spawning-readiness',
    type: 'passive',
    category: 'health',
    narrativeText: "Your jaw is elongating, curving into a hook. Your skin thickens, darkening from silver to deep crimson. Teeth are growing where there were none. The ocean no longer tastes right. A river\'s chemical trace pulls at you.",
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
      { stat: StatId.HEA, amount: -6, label: '-HEA' },
    ],
    conditions: [
      { type: 'age_range', min: 36 },
      { type: 'no_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 15,
    cooldown: 8,
    tags: ['health', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL / HEALTH EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-hatchery-runoff',
    type: 'passive',
    category: 'environmental',
    narrativeText: "The water tastes wrong. Metallic, synthetic. Your gills burn faintly. The compounds are unfamiliar: not organic, not natural chemistry. You swim through it because there is no other route.",
    statEffects: [
      { stat: StatId.IMM, amount: 6, label: '+IMM' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'health', 'human'],
  },

  {
    id: 'salmon-thermal-refuge',
    type: 'passive',
    category: 'environmental',
    narrativeText: "Your lateral line detects a seam of cold water threading into the river from a hidden spring. The temperature drops several degrees in a body-length. Your gills open wide. Other salmon are gathered here, holding in the current.",
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['environmental', 'health', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  EVENT CHAINING
  // ══════════════════════════════════════════════

  {
    id: 'salmon-net-scar',
    type: 'passive',
    category: 'health',
    narrativeText: "The monofilament scars have not healed cleanly. Raised welts of damaged tissue. Parasites cluster along the wound margins where your mucus layer is thinnest.",
    statEffects: [
      { stat: StatId.IMM, amount: 6, label: '+IMM' },
    ],
    subEvents: [
      {
        eventId: 'net-scar-lice',
        chance: 0.3,
        conditions: [
          { type: 'no_parasite', parasiteId: 'sea-lice' },
        ],
        narrativeText: 'Sea lice have colonized the wound margins, clustered in the grooves where scales once lay.',
        footnote: '(Sea lice attracted to net scars)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'sea-lice', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'has_injury' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['health', 'environmental'],
  },

  {
    id: 'salmon-migration-exhaustion',
    type: 'passive',
    category: 'migration',
    narrativeText: "You have not eaten since entering the river. Your body is burning through fat, then glycogen, then muscle. Your flanks are concave. Every stroke costs more than the last.",
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
      { type: 'weight_below', threshold: 20 },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['migration', 'health'],
  },

  // ══════════════════════════════════════════════
  //  SPAWNING EVENTS (extended)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-nest-site-selection',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Two sites. The first: clean, loose gravel in fast, cold, oxygen-rich current. Another hen is already circling it, her tail working the substrate. She is large. The second: tucked against a fallen hemlock, sheltered. Slower water, warmer, less oxygen.",
    statEffects: [],
    choices: [
      {
        id: 'prime-spot',
        label: 'Contest the prime gravel bed',
        description: 'Better oxygenation means more fry survive, but you must fight the other hen',
        narrativeResult: 'You slam into her flank-first. She bites, jaw raking across your side. You hold your ground. Minutes of thrashing, biting, body-checking. She peels away downstream. The prime redd is yours.',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'sheltered-spot',
        label: 'Take the sheltered site by the hemlock',
        description: 'Less oxygen, fewer surviving fry, but no fight',
        narrativeResult: 'You drift to the quieter water and begin to dig. The current here is sluggish. Some eggs will suffocate before they hatch. But your body is intact.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'salmon-nest-fight-laceration',
        chance: 0.20,
        narrativeText: 'The other hen\'s jaw caught you across the flank. A ragged line through deteriorating skin. The water clouds pink.',
        footnote: '(Flank laceration from nest fight)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'spawning-flank-laceration', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 14,
    cooldown: 8,
    tags: ['mating', 'migration', 'female-competition'],
  },

  {
    id: 'salmon-rival-redd-confrontation',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Another male hovering over your redd, flanks mottled crimson and black. {{npc.rival.name}} has been circling since dawn. His pectoral fins are flared wide, body trembling.",
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-rival-redd',
        label: 'Attack the rival',
        description: 'Ram him, bite him, drive him off',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'yield-position',
        label: 'Yield your position',
        description: 'Conserve what little strength remains',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'redd-fight-injury',
        chance: 0.2,
        narrativeText: 'His hooked jaw rakes your flank. A ragged gash through weakened skin. Blood clouds the water.',
        footnote: '(Wounded in spawning fight)',
        statEffects: [],
        consequences: [
          { type: 'add_injury', injuryId: 'scale-damage', severity: 1 },
        ],
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'sex', sex: 'male' },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['mating', 'social', 'danger'],
  },

  {
    id: 'salmon-egg-laying',
    type: 'passive',
    category: 'reproduction',
    narrativeText: "Your body arches. Your tail fans the gravel. The eggs come: a pale stream settling into the spaces between stones. Thousands. The male drifts in from downstream, milt clouding the water. You sweep gravel across them. The weight leaves your body.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'sex', sex: 'female' },
    ],
    weight: 15,
    cooldown: 10,
    tags: ['mating', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  MALE SPAWNING COMBAT EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-redd-fight',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Another male holds position beside the hen. His hooked kype opens and closes. His body blocks the current lane to the redd. Your own jaw aches with the spawning transformation that warped it into this shape. Your skin is sloughing. Your organs are consuming themselves for energy. He is dying. You are dying. But the eggs in that gravel will outlive you both.",
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    choices: [
      {
        id: 'charge-and-jawlock',
        label: 'Charge and jaw-lock',
        description: 'Drive into him, lock kypes, wrench him off the redd',
        narrativeResult: "You drive your hooked jaw into his flank. Kypes lock with a grinding crack. Two bodies jaw-to-jaw in the shallows, thrashing in silt and blood. You twist, levering him sideways. His grip slips. You wrench him off balance. He peels away downstream, jaw trailing blood.",
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
          { stat: StatId.ADV, amount: 4, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
          { type: 'set_flag', flag: 'fought-for-redd' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The jaw-lock lasted too long. Heart gave out in the shallows.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'display-and-posture',
        label: 'Display and posture',
        description: 'Flare fins, arch your body, show maximum size',
        narrativeResult: "You swing broadside to the current, flaring every fin, arching your body, kype gaping, gill plates flared. The rival reads your display with his lateral line. He backs downstream, yielding without contact.",
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'jack-strategy',
        label: 'Use the jack strategy. Wait and dart in.',
        description: 'Let them fight. When the winner is spent, dart in and release milt over the eggs.',
        narrativeResult: "You drift back into the shadow of a submerged root wad. The larger males crash together over the redd, jaw-locked, thrashing. When the victor breaks free, gasping and spent, and the hen begins to deposit eggs, you move. A single dart from the shadows. Your milt clouds the water over the freshly laid eggs. The exhausted champion turns too late.",
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fought-for-redd' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'redd-fight-jaw-wound',
        chance: 0.30,
        conditions: [
          { type: 'has_flag', flag: 'fought-for-redd' },
        ],
        narrativeText: 'Your kype is cracked along its leading edge. Cartilage splintered. Each time you open your mouth to breathe, a grinding pain radiates through your skull.',
        footnote: '(Jaw wounded in spawning combat)',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'spawning-jaw-wound', severity: 0 },
        ],
      },
      {
        eventId: 'redd-fight-fin-tear',
        chance: 0.25,
        conditions: [
          { type: 'has_flag', flag: 'fought-for-redd' },
        ],
        narrativeText: 'Your dorsal fin is torn along its base. The membrane hangs in strips, creating drag with every stroke.',
        footnote: '(Fin torn in spawning combat)',
        statEffects: [
          { stat: StatId.HOM, amount: 2, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'spawning-fin-tear', severity: 0 },
        ],
      },
      {
        eventId: 'redd-fight-flank-laceration',
        chance: 0.20,
        conditions: [
          { type: 'has_flag', flag: 'fought-for-redd' },
        ],
        narrativeText: 'His teeth raked your flank. A long furrow through darkening skin and pale muscle. The exposed flesh is whitening where fungal spores are taking hold.',
        footnote: '(Flank lacerated in spawning combat)',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'spawning-flank-laceration', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'sex', sex: 'male' },
    ],
    weight: 14,
    cooldown: 2,
    tags: ['mating', 'social', 'danger', 'combat'],
  },

  {
    id: 'salmon-redd-defense',
    type: 'passive',
    category: 'reproduction',
    narrativeText: "You hold the redd. The hen sweeps gravel below you. You hover with fins splayed and kype open, scanning every shadow. A dark shape materializes upstream, fins quivering. Another challenger testing your perimeter. Your body is consuming its own organs for fuel. Your skin is fungus and open sores. But the eggs are not yet laid.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
      { type: 'set_flag', flag: 'fought-for-redd' },
    ],
    subEvents: [
      {
        eventId: 'redd-defense-flank-hit',
        chance: 0.15,
        narrativeText: 'The challenger comes in fast and low, driving his shoulder into your flank. Scales shear away. You drive him off with a snap of your kype, but the wound is open.',
        footnote: '(Wounded defending redd)',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'spawning-flank-laceration', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'has_flag', flag: 'fought-for-redd' },
      { type: 'sex', sex: 'male' },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['mating', 'social', 'danger', 'combat'],
  },

  // ══════════════════════════════════════════════
  //  RIVER HAZARD EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-waterfall-cascade',
    type: 'active',
    category: 'migration',
    narrativeText: "Not one waterfall but three, stacked in cascading ledges. The spray is thick. The roar presses against your lateral line. Other salmon gather in the lowest pool, mustering energy. Broken bodies lodge in the crevices between falls. There is no way around. Only up.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'power-through-cascade',
        label: 'Power through all three falls at once',
        description: 'Spend everything. Every reserve, every muscle fiber.',
        statEffects: [
          { stat: StatId.STR, amount: -8, label: '-STR' },
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'rest-between-falls',
        label: 'Rest in each pool between leaps',
        description: 'Slower. Burns fat. But your body survives.',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 9,
    cooldown: 6,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'salmon-gravel-bar-stranding',
    type: 'active',
    category: 'migration',
    narrativeText: "The bottom rises without warning. Your belly scrapes gravel. The water thins to an inch, running fast but flat. Your dorsal fin breaks the surface. Your gills labor. A heron stalks the far edge of the bar.",
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'thrash-to-safety-gravel',
        label: 'Thrash violently toward deeper water',
        description: 'Burn energy, tear scales, but reach the channel',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Could not reach the channel. Dried out on the gravel bar.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-surge',
        label: 'Wait for a surge in the current',
        description: 'The river sometimes gives back what it takes',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'The surge never came. Dried out on the gravel bar.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['migration', 'environmental', 'danger'],
  },

  {
    id: 'salmon-temperature-shock',
    type: 'passive',
    category: 'health',
    narrativeText: "A tributary feeds in, several degrees colder than the main channel. The thermal boundary hits your body. Your muscles seize. Your gills stutter, recalibrating to the shifted oxygen levels. Your lateral line tingles with phantom signals.",
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['health', 'environmental', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  OCEAN EVENTS (extended)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-jellyfish-bloom',
    type: 'passive',
    category: 'environmental',
    narrativeText: "Jellyfish fill the water column from surface to thermocline. Millions of them, trailing stinging tentacles. Your feeding grounds are behind this mass. The krill and herring have scattered. Every attempt to push through leaves welts on your flanks.",
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    conditions: [],
    weight: 7,
    cooldown: 6,
    tags: ['environmental', 'foraging'],
  },

  {
    id: 'salmon-deep-dive-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: "Below you, a dense layer of krill and lanternfish is rising with the dusk. The concentration of food down there is far greater than the surface. But the cold deepens with every body-length, and your swim bladder aches with the pressure.",
    statEffects: [],
    choices: [
      {
        id: 'go-deeper',
        label: 'Dive to the deep scatter layer',
        description: 'Rich feeding, but the cold will cost you',
        statEffects: [
          { stat: StatId.CLI, amount: 6, label: '+CLI' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'stay-shallow-hunt',
        label: 'Stay in the shallows and pick off stragglers',
        description: 'Less food, but no risk from the cold',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: 1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 9,
    cooldown: 4,
    tags: ['foraging', 'food', 'exploration'],
  },

  // ══════════════════════════════════════════════
  //  NPC ENCOUNTER TRACKING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-rival-spawning-site',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      '{{npc.rival.name}} is here, hovering over the best gravel bed. Hooked jaw open. The scars on your flank are from the last time you fought this fish. He is larger now, flanks darker.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fight-rival-salmon',
        label: 'Charge and bite',
        description: 'Drive him off the redd with force',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'sneak-spawn',
        label: 'Wait for an opening to sneak-spawn',
        description: 'Let him guard the redd, then dart in',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
      { type: 'sex', sex: 'male' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['mating', 'confrontation'],
  },
  {
    id: 'salmon-bear-gauntlet',
    type: 'active',
    category: 'predator',
    narrativeText: 'The river narrows at a cascade. A massive pressure disturbance in the current: something standing in the water, jaws snapping at fish as they leap. The only passage upstream. You must time your leap.',
    statEffects: [{ stat: StatId.TRA, amount: 4, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'salmon-bear-rush',
        label: 'Leap immediately',
        description: 'Go now while the disturbance shifts to another fish.',
        narrativeResult: "You surge forward and launch from the water. Jaws snap shut inches from your tail. You clear the cascade.",
        statEffects: [{ stat: StatId.ADV, amount: 3, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Caught while leaping the cascade',
          statModifiers: [{ stat: StatId.HEA, factor: -0.0005 }],
        },
      },
      {
        id: 'salmon-bear-wait',
        label: 'Wait for the threat to move',
        description: 'Hold in the pool below and wait.',
        narrativeResult: 'You hold in the deep pool, finning against the current. The pressure disturbance shifts. You slip through the cascade during the gap.',
        statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['chinook-salmon'] },
      { type: 'has_flag', flag: 'spawning-migration-begun' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'danger'],
  },
  {
    id: 'salmon-warm-water-stress',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The river water is warm. Dissolved oxygen drops as temperature rises. Your gills work harder. Other salmon around you are lethargic, some floating belly-up in the shallows.',
    statEffects: [
      { stat: StatId.IMM, amount: 5, label: '+IMM' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    consequences: [{ type: 'modify_weight', amount: -1 }],
    choices: [],
    subEvents: [
      {
        eventId: 'salmon-thermal-death',
        chance: 0.04,
        conditions: [],
        narrativeText: 'Your body cannot sustain the oxygen levels needed. Everything slows.',
        statEffects: [],
        consequences: [{ type: 'death', cause: 'Thermal stress in overheated river water' }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['chinook-salmon'] },
      { type: 'weather', weatherTypes: ['heat_wave'] },
    ],
    weight: 9,
    cooldown: 4,
    tags: ['environmental', 'health'],
    footnote: 'Water temperatures above 21°C (70°F) are stressful for Chinook salmon, and sustained temperatures above 25°C (77°F) are often lethal. Climate change is making warm-water die-offs increasingly common in Pacific Northwest rivers.',
  },
  {
    id: 'salmon-tern-threat-estuary',
    type: 'active',
    category: 'predator',
    narrativeText: "Shallow, clear water at the river mouth. Sharp cries above. Pressure waves from repeated plunging impacts. Birds driving into the water around you. To reach the open sea, you must pass through.",
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'stay-deep-estuary',
        label: 'Stay in the deepest channels',
        description: 'Harder for the birds to reach you, but more crowded.',
        narrativeResult: 'You hug the murky bottom of the main channel. Fish around you are snatched away, but you stay below reach until the tide carries you past the river mouth.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'bolt-for-sea',
        label: 'Bolt for the open water',
        description: 'Get through the danger as fast as possible.',
        narrativeResult: 'You put on a burst of speed through the shallows. An impact strikes the water inches behind you. You reach the deeper shelf.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'Snatched from the water during the sprint.',
        },
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['pacific-northwest-river'] },
      { type: 'population_above', speciesName: 'Arctic Tern', threshold: 0 },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },
];
