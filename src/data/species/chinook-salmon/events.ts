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

  // ══════════════════════════════════════════════
  //  OCEAN / FORAGING EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'salmon-squid-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: "Night in the open ocean. Far below, bioluminescent squid pulse with cold blue light, their tentacles trailing like lanterns in the abyss. The glow draws you downward — each flash a signal, each signal a meal. The question is how deep you are willing to go.",
    statEffects: [],
    choices: [
      {
        id: 'chase-deep',
        label: 'Chase into the deep water',
        description: 'Richer hunting, but the cold is punishing',
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
    narrativeText: "The sea has turned to soup. A massive plankton bloom has erupted across the surface, and every creature in the water column is gorging — herring, anchovies, jellyfish, you. The abundance is staggering, almost violent in its profusion. You eat until your belly aches, carried along in a frenzy that has no leader and no end.",
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
    narrativeText: "You find the edge of a great ocean current — a river within the sea, flowing steady and strong in the direction you need to go. You ease into it and let it carry you, your muscles unwinding for the first time in days. Small prey tumbles past in the flow, and you snap at it lazily, barely needing to move. The ocean, for once, is doing the work.",
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
    narrativeText: "A California sea lion explodes out of the kelp — sleek, enormous, far faster than anything that size should be. It twists through the amber fronds with terrifying agility, its whiskered snout locked on you. The kelp forest is a maze of stalks and shadows, but open water lies just beyond.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'weave-kelp',
        label: 'Weave through the kelp',
        description: 'Use the forest to lose the predator',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The sea lion cornered you in the kelp. There was nowhere left to turn.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'burst-open-water',
        label: 'Burst into open water',
        description: 'Outrun it — or die trying',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
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
    narrativeText: "A sharp whistle of wind is the only warning. An osprey plunges from the sky feet-first, talons spread wide, punching through the surface in an explosion of spray. The impact sends a shockwave through the shallows. You feel the rake of claws across your flank as you twist away, your heart hammering against your ribs.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'osprey-talon-wound',
        chance: 0.15,
        conditions: [],
        narrativeText: 'The osprey\'s talons have left shallow furrows along your side. Scales are torn loose, and thin threads of blood trail behind you in the current.',
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
    narrativeText: "Something latches onto your side with a wet, sucking grip. You feel the rasp of keratin teeth grinding through your scales, boring toward the flesh beneath. A Pacific lamprey — eyeless, jawless, ancient — has chosen you as its host. Its eel-like body trails behind you like a grotesque pennant.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'thrash-rocks',
        label: 'Thrash against the rocks to scrape it off',
        description: 'Violent, but it should work',
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
        description: 'Let it feed — conserve your energy',
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
    narrativeText: "A side tributary spills into the river, and the water coming from it is warm — bathwater warm, dangerously warm. The plume spreads across the main channel like a fever, and you can feel your gills laboring in the oxygen-depleted flow. Upstream, through the heat shimmer, the water looks clearer. But there is a cool pocket in the rocks to your left where a spring seeps in.",
    statEffects: [],
    choices: [
      {
        id: 'push-through-warm',
        label: 'Push through the warm zone',
        description: 'Faster, but the heat could kill you',
        statEffects: [
          { stat: StatId.CLI, amount: 8, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The warm water overwhelmed your body. Your heart stopped in the heat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'rest-cool-pocket',
        label: 'Rest in the cool pocket and wait',
        description: 'Safe, but you burn precious reserves',
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
    narrativeText: "The river braids and spreads across a wide gravel bar, and suddenly the water is ankle-deep — too shallow to swim, barely deep enough to cover your dorsal fin. You are stranded, flopping on your side, gasping as the current trickles past. The deeper channel is ten body-lengths away. Above you, the sky is open and enormous, and somewhere an eagle is circling.",
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'thrash-to-channel',
        label: 'Thrash toward the deeper channel',
        description: 'Desperate, exhausting, but your only real option',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'You could not reach deep water. The sun and the air took you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-water',
        label: 'Wait for the water level to rise',
        description: 'Patience — but you are exposed to everything',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.ADV, amount: 6, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'An eagle took you from the gravel bar while you waited.',
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
    narrativeText: "The river is choked. A massive tangle of fallen timber spans the channel — logs stacked and interlocked, bark stripped white by the current, branches reaching into the water like skeletal fingers. The river pours through gaps in the debris, but the openings are narrow and dark, barely wider than your body. You can hear the water thundering on the other side.",
    statEffects: [],
    choices: [
      {
        id: 'push-through-gaps',
        label: 'Push through the gaps',
        description: 'Tight, rough, and your scales will pay the price',
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
        description: 'Safe, but exhausting and slow',
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
    narrativeText: "The stench reaches you before the sight does. Along both banks, the bodies of salmon lie in various states of decay — white fungus blooming on their flanks, jaws still hooked open in death, eye sockets hollow. These are the ones who came before you, who made this same journey weeks ago and finished what they were built to finish. The river runs thick with the smell of spent flesh. You swim through their legacy, through the nutrients they have become, and something ancient in you understands that this is not tragedy. This is the plan.",
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
    narrativeText: "Your body is betraying its origins. The dark parr marks along your flanks — the camouflage of a river fish — are fading, replaced by a bright silver sheen that catches the light like hammered metal. Inside, deeper changes are underway: your kidneys are rewriting themselves, learning to filter salt instead of freshwater. The river that raised you is becoming chemically hostile. You belong to the ocean now, whether you are ready or not.",
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
    narrativeText: "The open ocean is generous, and your body is taking full advantage. You can feel yourself growing — not just heavier, but longer, stronger, faster. Your muscles thicken along your spine. Your jaws widen. Every meal translates directly into mass, and there are so many meals out here that the growing never stops. You are becoming something formidable, a silver missile built for speed and endurance.",
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
    narrativeText: "Something is happening to your body that you cannot stop. Your jaw is elongating, curving into a vicious hook. Your skin is thickening, darkening from silver to a deep, bruised crimson. Teeth are growing where there were none. You are being unmade and remade — not into something stronger, but into something singular, something designed for one final act. The ocean no longer feels like home. A river is calling, and your body is already answering.",
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
    narrativeText: "The water tastes wrong — metallic, synthetic, laced with compounds your gills were never meant to process. Upstream, a fish hatchery is discharging chemical runoff into the current: antibiotics, hormones, disinfectants. The water looks clear but it burns faintly, a slow corrosion working at your mucus membranes. You swim through it because there is no other way, your immune system straining against an enemy it cannot see.",
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
    narrativeText: "You feel it before you see it — a seam of cold, clean water threading into the river from a hidden spring. The temperature drops several degrees in the space of a body-length, and your gills open wide with relief. Other salmon are gathered here too, holding in the current, their bodies visibly calmer. For a few precious hours, the river is kind. The cool water washes the stress from your cells like rain after drought.",
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
    narrativeText: "The monofilament scars from the fishing net have not healed cleanly. The raised welts of damaged tissue stand out against your scales like pale roads on a dark map, and the parasites have noticed. Sea lice cluster along the wound margins where your protective mucus is thinnest, finding easy purchase on the roughened flesh. What the net started, the ocean is finishing.",
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
        narrativeText: 'The damaged tissue along your net scars has become a breeding ground. Sea lice have colonized the wound margins, their tiny bodies clustered in the grooves where your scales once lay smooth.',
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
    narrativeText: "You have not eaten since you entered the river. Your body is consuming itself — burning through fat reserves, then glycogen, then muscle. Your flanks are concave where they were once rounded. Every stroke costs more than the last, and the current never relents. The river is stripping you down to bone and will, and you can feel the margin between survival and collapse growing thinner with each mile.",
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
    narrativeText: "The gravel bed spreads before you in a mosaic of possibility. Your body reads each patch like a text \u2014 the size of the stones, the speed of the current threading between them, the oxygen content of the water welling up from below. Two sites hold your attention. The first is prime territory: clean, loose gravel in the main current where the water runs fastest and coldest, but another hen is already circling it, her tail working the substrate in slow, proprietary sweeps. The second is tucked against a fallen hemlock, sheltered from the worst of the flow, its gravel finer and less exposed. No one has claimed it. The eggs you carry are the sum of everything you have survived. Where you place them will decide whether that survival meant anything at all.",
    statEffects: [],
    choices: [
      {
        id: 'prime-spot',
        label: 'Contest the prime gravel bed',
        description: 'Better oxygenation, but you will have to fight for it',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'sheltered-spot',
        label: 'Take the sheltered site by the hemlock',
        description: 'Quieter, safer \u2014 good enough for a careful mother',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['mating', 'migration'],
  },

  {
    id: 'salmon-rival-redd-confrontation',
    type: 'active',
    category: 'reproduction',
    narrativeText: "A shadow slides into the edge of your vision \u2014 another male, his jaw hooked into a grotesque curve, his flanks mottled crimson and black with spawning pigment. He is hovering over your redd, his body angled toward the hen, his intent unmistakable. {{npc.rival.name}} has been circling since dawn, darting in whenever you turn to chase off the jacks. Now he holds his ground, his pectoral fins flared wide, his body trembling with aggression. Every cell in your ruined body screams for rest, but the eggs in that gravel carry your bloodline, and this interloper means to replace it with his own.",
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-rival-redd',
        label: 'Attack the rival',
        description: 'Ram him, bite him, drive him off \u2014 but your body is failing',
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
        description: 'Conserve what little strength remains \u2014 find another redd',
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
        narrativeText: 'His hooked jaw rakes across your flank, tearing a ragged gash through already-weakened skin. Blood clouds the water between you.',
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
    narrativeText: "The moment arrives without ceremony. Your body arches, your tail fans the gravel one final time, and then the eggs come \u2014 a pale, translucent stream of them, each one a sphere of amber light settling into the spaces between the stones. Thousands of them. The current swirls them gently into the redd, and you feel the weight leave your body like a breath held for years finally released. The male drifts in from downstream, his milt clouding the water in a white veil that settles over the eggs like snow. You sweep gravel across them with movements that are no longer desperate but deliberate, almost tender. Something has been completed. The river accepted what you carried, and now the stones will keep it safe. Your body is hollowed, your strength nearly gone, but there is a stillness inside you that feels nothing like defeat.",
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
  //  RIVER HAZARD EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'salmon-waterfall-cascade',
    type: 'active',
    category: 'migration',
    narrativeText: "The river drops away in a staircase of stone \u2014 not one waterfall but three, stacked in a cascading series of ledges, each pouring into a boiling plunge pool before spilling over the next. The spray is so thick it obscures the top, and the roar is a physical weight pressing against your lateral line. Other salmon are gathered in the lowest pool, finning against the current, mustering the explosive energy each leap demands. You can see the broken bodies of those who misjudged the jump lodged in the crevices between the falls. There is no way around. There is only up.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'power-through-cascade',
        label: 'Power through all three falls at once',
        description: 'Spend everything \u2014 every reserve, every muscle fiber',
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
        description: 'Slower and you burn precious fat, but your body survives',
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
    narrativeText: "The channel betrays you. One moment you are swimming in thigh-deep current; the next, the bottom rises sharply and your belly scrapes gravel. The water thins to a sheet barely an inch deep, running fast but flat over an exposed bar of sun-baked stones. You are stranded \u2014 your dorsal fin breaking the surface, your gills laboring in the insufficient flow, the air pressing down on you like a foreign element. A heron stalks the far edge of the bar, its yellow eye locked on you with predatory patience.",
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
          cause: 'You could not reach the channel. The sun and the heron finished what the river started.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-surge',
        label: 'Wait for a surge in the current',
        description: 'Patience \u2014 the river sometimes gives back what it takes',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'The surge never came. You dried out on the gravel bar under a merciless sky.',
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
    narrativeText: "The water changes without warning. A tributary feeds in from the south, carrying snowmelt or spring water several degrees colder than the main channel, and the thermal boundary hits your body like a wall. Your muscles seize. Your gills flare and stutter, struggling to recalibrate to the shifted oxygen levels. For a terrible, suspended moment your heart seems to hesitate, unsure of its own rhythm. Then the shock passes, leaving you shaken and gasping, your lateral line tingling with a phantom electricity. The river does not care what your body was built to tolerate. It changes, and you either adapt or you do not.",
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
    narrativeText: "The ocean has become a cathedral of translucent bells. A jellyfish bloom of staggering density fills the water column from surface to thermocline \u2014 millions of them, their bodies pulsing in slow, hypnotic rhythm, trailing curtains of stinging tentacles through the green water. Your feeding grounds are buried behind this living wall. The krill and herring you depend on have scattered or been consumed, and every attempt to push through earns you another line of welts across your flanks. You circle the bloom's edge, hungry and frustrated, searching for a gap that does not exist.",
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
    narrativeText: "Below you, far below, the sonar-scatter layer is rising with the dusk \u2014 a vast, living carpet of krill, copepods, and lanternfish ascending from the abyss to feed in the fading light. The concentration of food down there is extraordinary, a density the surface waters cannot match. But the dive means cold \u2014 bone-numbing, muscle-slowing cold \u2014 and the pressure increases with every body-length of descent. Your swim bladder aches as you descend, and the light fades from green to indigo to black.",
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
      '{{npc.rival.name}} is here — hovering over the best gravel bed in the pool, his hooked jaw open in a silent threat. You have seen this fish before, fought him before, and the scars on your flank are his signature. He is larger now, his crimson flanks darker, his kype more pronounced. The female is watching from the shallows, waiting to see which of you will claim the redd.',
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
];
