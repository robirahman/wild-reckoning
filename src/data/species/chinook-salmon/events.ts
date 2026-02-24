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
    narrativeText: "You hit a dense swarm of krill rising from the deep. The water is thick with them — tiny, translucent bodies pulsing in the current. You open your mouth and swim through the cloud, filtering thousands with each pass. For once, the ocean feels generous.",
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
    narrativeText: "A school of herring flickers ahead — silver flashes catching the filtered light. You accelerate, driving into the ball of fish, snapping at the panicked stragglers. A few quick strikes and your stomach is full. The school reforms behind you as if nothing happened.",
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
    narrativeText: "Hunger drives you deeper than usual. The water grows cold and dark, pressing against your body as you descend. Down here, the krill are concentrated in dense layers, but the temperature saps your energy. You feed quickly and rise back toward the light, your body aching from the cold.",
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
    narrativeText: "A bloom of moon jellyfish drifts through your feeding area, their translucent bells pulsing in slow rhythm. Their trailing tentacles sting your flanks as you navigate through them, and the krill you were chasing have scattered. You swim on, irritated and hungry.",
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
    narrativeText: "A harbor seal materializes from below — a dark, torpedo-shaped shadow rising fast. Its black eyes are fixed on you. There is no warning, no sound, just sudden predatory intent closing the distance at terrifying speed.",
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
          probability: 0.08,
          cause: 'Caught and eaten by a harbor seal.',
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
          probability: 0.12,
          cause: 'The seal dove after you and caught you in the darkness.',
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
    narrativeText: "The water trembles with subsonic clicks and whistles. Then you see them — a pod of orcas, their towering dorsal fins cutting the surface like black sails. They are hunting, driving salmon toward the surface in coordinated sweeps. The ocean itself seems to contract with fear.",
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
          probability: 0.05,
          cause: 'An orca picked you out of the school.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'freeze-in-school',
        label: 'Stay tight in the school',
        description: 'Safety in numbers — maybe',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
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
    narrativeText: "A wall of mesh appears from nowhere — a commercial gill net stretching across your path like a curtain of death. Fish around you are already tangled, their silver bodies thrashing uselessly against the monofilament. The net is closing in on you.",
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
          probability: 0.15,
          cause: 'Caught in the net. Hauled aboard. Killed.',
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
          probability: 0.25,
          cause: "You couldn't escape the net. Hauled aboard with the rest.",
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
    narrativeText: "A shadow passes over you — then a violent splash as a seabird drives into the water like a spear. Its beak clamps down on your tail, tearing scales loose before you wrench free and dive. The bird surfaces empty-beaked, but you are bleeding and bruised.",
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
    narrativeText: "The river narrows ahead, and through the churning white water you see it — a massive brown bear standing in the shallows, its paws raised, eyes scanning the water. Salmon carcasses litter the bank behind it. Other fish are stacking up around you, waiting, but the bear shows no sign of leaving.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
    ],
    choices: [
      {
        id: 'dart-past',
        label: 'Dart past the bear at full speed',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: "The bear's paw slammed down on you. It was over in an instant.",
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-opening',
        label: 'Wait for the bear to look away',
        description: 'Patient, but you risk being caught while waiting',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'The bear caught you while you waited in the shallows.',
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
    narrativeText: "Something ancient stirs inside you. The water temperature is dropping, the days are growing shorter, and a pull you cannot name is dragging you toward the coast. You taste the river on the current — faint, impossibly distant, but unmistakable. It is the river where you were born, and it is calling you home to die.",
    statEffects: [],
    choices: [
      {
        id: 'begin-migration',
        label: 'Follow the instinct upstream',
        description: 'Begin the journey home — there is no return from this',
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
        description: 'Ignore the pull — for now',
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
    narrativeText: "The river surges against you with brutal force. White water crashes over submerged boulders, and the current tears at your body with every stroke. Your muscles burn. Your skin is raw from scraping against rocks. But the river only flows one way, and you must go the other.",
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
    narrativeText: "A waterfall blocks your path — six feet of roaring white water pouring over a ledge of basalt. Other salmon are hurling themselves at it, their silver bodies arcing through the spray, most falling back into the pool below. A narrow side channel trickles around the falls, but it barely has enough water to swim in.",
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
        description: 'Slower but safer — costs energy',
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
    narrativeText: "A concrete wall rises from the river — a hydroelectric dam, humming with power, blocking the entire channel. The water pooling below it is deep and still and smells of nothing. You can feel the river above, tantalizingly close, but the dam stands between you and your birthplace. A fish ladder zigzags up one side, its narrow channels churning with artificial current.",
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
    narrativeText: "A bald eagle circles overhead, its white head tilted downward, tracking your shadow through the shallows. The river is too shallow here to dive — you are exposed, vulnerable, a dark shape against pale gravel. The eagle folds its wings and drops.",
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
          probability: 0.05,
          cause: 'The eagle plucked you from the shallows before you could reach deep water.',
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
          probability: 0.08,
          cause: 'The eagle caught you mid-leap between pools.',
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
    narrativeText: "The stream narrows here, running clear and cold over a bed of clean gravel. The current is gentle, the oxygen levels high, and the substrate is loose enough to dig. Something deep in your body recognizes this place — not this exact bend, perhaps, but this type of place. This is where eggs survive. This is where life begins again. You have found your spawning ground.",
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
    narrativeText: "This is the moment your entire life has been building toward. Your body is battered, your skin mottled and torn, your jaw hooked beyond recognition. You have crossed an ocean, climbed a river, fought bears and eagles and the current itself. And now, in this quiet stretch of gravel-bottomed stream, you release everything you have left. Eggs settle into the redd — thousands of them, each one a chance. The water clouds with milt. You sweep gravel over them with the last of your strength. It is done. Your body is failing. But the river will carry your legacy forward, as it always has.",
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
    narrativeText: "The water temperature has spiked. The surface layer feels almost warm — wrong for a salmon, deeply wrong. Your gills work harder to extract oxygen from the heated water, and a sluggish lethargy settles into your muscles. Other fish are sinking to deeper, cooler layers, but even there the relief is marginal.",
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
    narrativeText: "You notice a persistent irritation along your flanks — a crawling, biting sensation that won't go away no matter how fast you swim. Tiny parasitic copepods have latched onto your skin, feeding on your mucus and blood.",
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
        narrativeText: 'The sea lice have established a breeding colony on your body. Their numbers are growing, and the damage to your protective mucus layer is becoming significant.',
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
    narrativeText: "The water changes color ahead — a sickly brown-green discharge spreading from a pipe on the riverbank. The smell is chemical and sharp, burning your gills. Other fish are turning back, but the plume extends across most of the channel. Your body absorbs toxins with every breath.",
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
];
