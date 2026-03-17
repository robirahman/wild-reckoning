import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const FIG_WASP_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  GALL LARVA PHASE (age 0-1, no emergence flag)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-gall-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Nutritive tissue surrounds you on all sides. The gall wall is warm and close. You feed.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    choices: [
      {
        id: 'feed-aggressively',
        label: 'Feed aggressively',
        description: 'Consume as much gall tissue as possible.',
        narrativeResult: 'You consume fast. Your body swells. The gall walls thin.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.000000008 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'feed-conservatively',
        label: 'Feed conservatively',
        description: 'Eat slowly, preserving the gall structure.',
        narrativeResult: 'You feed steadily. The gall walls stay thick around you.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.000000004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'development'],
    footnote: 'Fig wasp larvae develop inside individual galls — modified fig ovules that the mother wasp induced the fig to grow. Each gall is a single-occupancy nursery, perfectly sized for one developing wasp.',
  },

  {
    id: 'figwasp-neighboring-gall',
    type: 'passive',
    category: 'social',
    narrativeText: 'Vibrations through the gall wall. Other larvae developing in adjacent chambers. The fig is crowded.',
    statEffects: [
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
      { stat: StatId.HOM, amount: -2, label: '-HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['social', 'development'],
  },

  {
    id: 'figwasp-nematode-in-gall',
    type: 'passive',
    category: 'health',
    narrativeText: 'Something moves in the fig tissue near your gall. A microscopic worm is boring through the wall toward you.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'fig-nematode', startStage: 0 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_parasite', parasiteId: 'fig-nematode' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
      { type: 'age_range', max: 2 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['health', 'parasite', 'nematode'],
    footnote: 'Parasitodiplogaster nematodes are phoretic on fig wasps — they ride inside the foundress wasp into the fig, then parasitize her offspring. Some species have co-speciated with their fig wasp hosts for tens of millions of years.',
  },

  {
    id: 'figwasp-gall-development',
    type: 'passive',
    category: 'health',
    narrativeText: 'The gall wall thickens. Your head capsule widens. Mandibles form beneath your larval skin. The fig tissue responds to your chemical output, enriching itself.',
    statEffects: [
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.000000005 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['health', 'development', 'growth'],
  },

  // ══════════════════════════════════════════════
  //  PUPA PHASE (age 1-2, flag: is-pupa)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-pupation-begins',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your body stiffens. The skin splits. Beneath it, new structures take shape in the darkness of the gall. You cannot move.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'age_range', min: 1 },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['health', 'metamorphosis', 'lifecycle'],
    footnote: 'Like all holometabolous insects, fig wasps undergo complete metamorphosis — a radical restructuring of the body inside a pupal case. The larval tissues are broken down by digestive enzymes and rebuilt from clusters of undifferentiated cells called imaginal discs.',
  },

  {
    id: 'figwasp-fig-ripening',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The fig is changing around you. The walls soften. The interior warms. Volatile compounds build in the cavity and seep through your gall wall.',
    statEffects: [
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['environmental', 'lifecycle', 'fig'],
  },

  // ══════════════════════════════════════════════
  //  ADULT INSIDE FIG — MALE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-male-emergence',
    type: 'passive',
    category: 'health',
    narrativeText: 'You chew through the gall wall into the dark interior of the fig. No light. No wings. Your compound eyes register nothing. But your mandibles are massive, and the chemical signals around you are dense with information.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'emerged-from-gall' },
      { type: 'remove_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'age_range', min: 2 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'emergence', 'male'],
    footnote: 'Male fig wasps are among the most morphologically derived insects on Earth. They are wingless, eyeless (or nearly so), and heavily sclerotized with enlarged mandibles. They never leave the fig in which they were born.',
  },

  {
    id: 'figwasp-male-combat',
    type: 'active',
    category: 'social',
    narrativeText: 'Vibrations and aggression chemicals in the darkness. Another male, between you and a gall containing an unemerged female. His mandibles scrape fig tissue. Yours open.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fight-aggressively',
        label: 'Attack with full force',
        description: 'Lock mandibles and fight to the death.',
        narrativeResult: 'Mandibles lock. Hemolymph sprays. One of you will stop moving. The other will reach the gall.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fig-combat-attempted' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.15,
          cause: 'Killed by a rival male inside the fig. Mandibles severed the thorax.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-opening',
        label: 'Wait for weaker opponents',
        description: 'Let others fight first, then claim the exhausted victor\'s prize.',
        narrativeResult: 'You retreat into a fold of fig tissue. The scrape of chitin and wet snap of severed limbs. When silence comes, you creep forward.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fig-combat-attempted' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['social', 'combat', 'male', 'mating'],
    footnote: 'Male fig wasp combat is often lethal. Males of some species have been observed decapitating rivals with their mandibles. The interior of a ripe fig can contain the dismembered bodies of several males — casualties of battles no human ever witnesses.',
  },

  {
    id: 'figwasp-male-mating',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'You locate a gall containing a female. You chew a small hole through the wall and extend your aedeagus through the opening. The act is brief.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'mated-in-fig' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'mated-in-fig' },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['reproduction', 'mating', 'male'],
  },

  {
    id: 'figwasp-male-tunnel-chewing',
    type: 'active',
    category: 'social',
    narrativeText: 'The females cannot escape. The fig is sealed. You begin grinding your mandibles through the thick syconium wall. The tunnel grows slowly. Your mandibles wear down with each pass.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    choices: [
      {
        id: 'wide-tunnel',
        label: 'Chew a wide tunnel',
        description: 'Exhaust yourself creating a generous exit.',
        narrativeResult: 'You chew until light streams in. Warm, blinding. The females move toward it. Your mandibles are stubs. Your body is spent.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tunnel-chewed' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.30,
          cause: 'Exhausted chewing the exit tunnel. Mandibles ground to stubs, body depleted.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'minimal-tunnel',
        label: 'Chew a minimal tunnel',
        description: 'Conserve energy but the tunnel may not fully penetrate.',
        narrativeResult: 'The tunnel reaches the outer layers but does not break through. The females will have to force the rest.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tunnel-chewed' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'mated-in-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['social', 'sacrifice', 'male', 'tunnel'],
    footnote: 'Male fig wasps chew exit tunnels cooperatively — multiple males may work on the same tunnel. The males gain no direct benefit from the tunnel, as they die inside the fig regardless. The tunnel enables the females to escape and disperse.',
  },

  {
    id: 'figwasp-male-death-in-fig',
    type: 'passive',
    category: 'health',
    narrativeText: 'You cannot feed. You cannot fly. You cannot leave. Your body is failing inside the fig that grew you. The females are gone.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Died inside the natal fig. No wings, no eyes, no way out.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'tunnel-chewed' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'death', 'male'],
  },

  // ══════════════════════════════════════════════
  //  ADULT INSIDE FIG — FEMALE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-female-emergence',
    type: 'passive',
    category: 'health',
    narrativeText: 'You chew through the gall wall. Dim light filters through the fig. You have wings, folded tight. You have compound eyes. You have antennae tuned to fig volatiles. Males move through the darkness around you.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'emerged-from-gall' },
      { type: 'remove_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'age_range', min: 2 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'emergence', 'female'],
  },

  {
    id: 'figwasp-female-mated-in-gall',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'A small hole appears in your gall wall. Brief intrusion, then it is over. You carry sperm now, stored in the spermatheca.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'mated-in-fig' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'mated-in-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['reproduction', 'mating', 'female'],
  },

  {
    id: 'figwasp-female-pollen-collection',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Flowers line the fig interior. Your thoracic pollen pockets are empty. This pollen is your cargo for the next fig.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    choices: [
      {
        id: 'collect-thoroughly',
        label: 'Collect pollen thoroughly',
        description: 'Pack your corbiculae full — ensure good pollination at the next fig.',
        narrativeResult: 'You visit every accessible anther, packing the pollen pockets dense. The next fig will be well-pollinated.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollen-collected' },
          { type: 'modify_weight', amount: 0.000000002 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'collect-quickly',
        label: 'Collect quickly and move on',
        description: 'Gather minimal pollen — save energy for the flight ahead.',
        narrativeResult: 'A cursory dusting of pollen. Enough. You turn toward the exit.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollen-collected' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'pollen-collected' },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['foraging', 'pollination', 'female', 'mutualism'],
    footnote: 'Fig wasps are active pollinators — unlike most insect pollinators that transfer pollen passively on their bodies, fig wasps have evolved specialized structures (corbiculae) to deliberately collect and transport pollen. This is thought to be an adaptation driven by the enclosed structure of the fig, where passive pollen transfer is impossible.',
  },

  // ══════════════════════════════════════════════
  //  DISPERSAL FLIGHT (female only, flag: exited-fig)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-exit-through-tunnel',
    type: 'active',
    category: 'migration',
    narrativeText: 'The tunnel is open. Light streams in, warm and blinding. You must squeeze through. Your wings scrape the ragged walls. The passage is barely wide enough.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'exit-quickly',
        label: 'Push through quickly',
        description: 'Speed over caution — get out before the tunnel collapses.',
        narrativeResult: 'You force through at speed. A wing catches and tears slightly. But you are outside. Air moves. Your wings unfold.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'exited-fig' },
          { type: 'add_injury', injuryId: 'wing-loss', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'exit-carefully',
        label: 'Navigate carefully',
        description: 'Take your time — protect your wings.',
        narrativeResult: 'You fold your wings tight and guide yourself with your antennae. The passage is tight, but you emerge intact. Air and light hit you. Wings unfurl, whole.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'exited-fig' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pollen-collected' },
      { type: 'has_flag', flag: 'mated-in-fig' },
      { type: 'no_flag', flag: 'exited-fig' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['migration', 'lifecycle', 'female', 'tunnel'],
  },

  {
    id: 'figwasp-wind-dispersal',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A gust catches you. At two millimeters, you are at the mercy of air currents. The wind carries you away from your natal tree. Where it takes you, you cannot determine.',
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.000000002 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 14,
    cooldown: 2,
    tags: ['environmental', 'wind', 'dispersal'],
  },

  {
    id: 'figwasp-scent-detection',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Your antennae register a chemical trace in the air. Linalool, methyl salicylate. The blend matches your innate template. A receptive fig, somewhere upwind. The signal is faint.',
    statEffects: [],
    choices: [
      {
        id: 'follow-scent',
        label: 'Follow this scent signal',
        description: 'Fly toward the source — it could be the fig you need.',
        narrativeResult: 'You bank into the wind, following the concentration gradient. The chemical signal strengthens with each wingbeat.',
        statEffects: [
          { stat: StatId.NOV, amount: -3, label: '-NOV' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'search-stronger',
        label: 'Search for a stronger signal',
        description: 'This scent is faint — there may be a closer fig.',
        narrativeResult: 'You ignore the faint trace and keep searching. Your adult life is measured in hours. Every minute spent searching is a minute closer to depletion.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000003 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 16,
    cooldown: 3,
    tags: ['foraging', 'navigation', 'scent', 'female'],
    footnote: 'Fig wasps can detect the volatile chemical signals of receptive figs from several kilometers away. The composition of these volatiles is species-specific, ensuring that each fig species attracts only its own pollinator. This chemical specificity is a key mechanism maintaining the one-to-one mutualism.',
  },

  {
    id: 'figwasp-spider-web-flight',
    type: 'active',
    category: 'predator',
    narrativeText: 'Silk strands glisten between branches near a fig tree. A web, enormous relative to your body. At your size, a single sticky strand could hold you.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'veer-away',
        label: 'Veer away',
        description: 'Burn energy to fly around the web.',
        narrativeResult: 'You bank hard. The web passes below. The detour costs energy, but you are not stuck.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000002 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'fly-through-gap',
        label: 'Fly through a gap in the web',
        description: 'You see an opening between the spiral threads.',
        narrativeResult: 'You aim for a gap in the spiral. At your size, the spaces seem navigable. One wrong wingbeat and you are held.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.18,
          cause: 'Caught in an orb-weaver web. The silk held.',
          statModifiers: [{ stat: StatId.WIS, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['predator', 'spider', 'danger', 'flight'],
  },

  {
    id: 'figwasp-bird-predation',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A small bird darts between branches near a fig tree, snatching insects from the air. You are flying through its territory. At two millimeters, you are barely a mouthful.',
    statEffects: [
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'figwasp-bird-predation-strike',
        chance: 0.08,
        narrativeText: 'The bird detects your movement. It strikes.',
        footnote: 'Fig wasps are incidental prey for insectivorous birds. Their small size makes them low-value targets, but birds hunting near fig trees inevitably consume some dispersing wasps.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Taken by a bird mid-flight.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['predator', 'bird', 'flight'],
  },

  {
    id: 'figwasp-ant-gauntlet',
    type: 'active',
    category: 'predator',
    narrativeText: 'You detect a fig tree. Green syconia hang from its branches. But ants patrol the trunk in thousands, streaming up and down the bark.',
    statEffects: [],
    choices: [
      {
        id: 'fly-direct',
        label: 'Fly directly to a fig',
        description: 'Land on the syconium from the air, avoiding the trunk.',
        narrativeResult: 'You approach from below on the wind and land on the smooth surface of a syconium, far from the nearest ant.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Killed by ants while attempting to reach a fig.',
          statModifiers: [{ stat: StatId.WIS, factor: -0.001 }],
        },
      },
      {
        id: 'circle-approach',
        label: 'Circle and approach from downwind',
        description: 'Take a wider path to avoid detection.',
        narrativeResult: 'You circle wide, approaching from the downwind side. The detour burns energy, but you reach the fig without encountering ants.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000001 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['predator', 'ant', 'danger'],
  },

  {
    id: 'figwasp-wrong-fig-species',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The chemical profile is close but wrong. Compounds that do not match your template. This is the wrong species of fig. But your reserves are low.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'enter-wrong-fig',
        label: 'Enter anyway',
        description: 'You are desperate. Maybe it will work.',
        narrativeResult: 'You squeeze through the ostiole. Your wings tear off. Inside, the flower structure is wrong. Your ovipositor cannot reach the ovules. Your eggs will not develop here.',
        statEffects: [
          { stat: StatId.TRA, amount: 15, label: '+TRA' },
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'death', cause: 'Entered the wrong fig species. Eggs failed to develop.' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'keep-searching',
        label: 'Leave and keep searching',
        description: 'Trust your chemical instincts.',
        narrativeResult: 'You pull away. The correct chemical signature is somewhere in the air. Your energy reserves are dwindling.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000003 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 8,
    cooldown: 99,
    tags: ['foraging', 'danger', 'wrong-host'],
    footnote: 'The fig-fig wasp mutualism is highly species-specific: each of the ~750 fig species is typically pollinated by only one or a few wasp species. Wasps that enter the wrong fig species waste their reproductive effort — they cannot successfully oviposit, and their pollination effort is wasted.',
  },

  // ══════════════════════════════════════════════
  //  INSIDE NEW FIG (female only, flag: entered-new-fig)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-ostiole-entry',
    type: 'active',
    category: 'migration',
    narrativeText: 'The chemical signature is unmistakable. A receptive fig. The ostiole is a scale-guarded opening barely wide enough for your body. To enter, you must squeeze through. The passage will tear off your wings.',
    statEffects: [],
    choices: [
      {
        id: 'enter-fig',
        label: 'Enter the fig',
        description: 'Push through the ostiole. There is no going back.',
        narrativeResult: 'You push headfirst in. The scales clamp around you. Your wings catch and tear away. Your antennae snap. But you are inside. Dark, warm, pollen and fig sap.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.HOM, amount: -5, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'entered-new-fig' },
          { type: 'add_injury', injuryId: 'wing-loss', severity: 2 },
          { type: 'add_injury', injuryId: 'antenna-damage', severity: 1 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'search-wider-ostiole',
        label: 'Search for a fig with a wider opening',
        description: 'Risk running out of time for a less damaging entry.',
        narrativeResult: 'You leave and continue searching. Each minute drains your reserves. Every ostiole is calibrated to be barely passable.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['migration', 'lifecycle', 'ostiole', 'female'],
    footnote: 'The ostiole passage is so traumatic that foundress wasps routinely lose their wings, antennae tips, and parts of their legs. The fig has evolved this narrow entrance as a quality filter — only healthy, well-developed wasps can successfully enter. This is a form of natural selection mediated by architecture.',
  },

  {
    id: 'figwasp-pollination',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Wingless, bleeding hemolymph, antennae broken. You crawl through the new fig. Flowers carpet the interior. Short-styled near the center, long-styled near the wall. You unpack your corbiculae.',
    statEffects: [],
    choices: [
      {
        id: 'pollinate-thoroughly',
        label: 'Pollinate thoroughly',
        description: 'Visit every flower. Ensure the fig sets good seed.',
        narrativeResult: 'You crawl from flower to flower, depositing pollen on each stigma.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollinating-fig' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'focus-on-eggs',
        label: 'Focus on egg-laying sites',
        description: 'Skip some flowers to save energy for oviposition.',
        narrativeResult: 'You pollinate hastily and head for the short-styled flowers where you can lay eggs.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollinating-fig' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'entered-new-fig' },
      { type: 'no_flag', flag: 'pollinating-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['foraging', 'pollination', 'mutualism', 'female'],
    footnote: 'The conflict between the fig and its pollinator is a classic example of mutualism with competing interests. The fig "wants" maximum pollination and minimum seed destruction by wasp larvae. The wasp "wants" maximum egg-laying and minimum pollination effort. The fig constrains cheating by having some flowers with styles too long for the wasp\'s ovipositor — these can only be pollinated, never parasitized.',
  },

  {
    id: 'figwasp-egg-laying',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'Your ovipositor probes the short-styled flowers. Each insertion deposits a single egg in a single ovule. Your abdomen contracts rhythmically until you are empty.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'spawn' },
      { type: 'set_flag', flag: 'eggs-laid' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'entered-new-fig' },
      { type: 'has_flag', flag: 'pollinating-fig' },
      { type: 'no_flag', flag: 'eggs-laid' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['reproduction', 'egg-laying', 'female', 'lifecycle'],
  },

  // ══════════════════════════════════════════════
  //  CROSS-PHASE / ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-non-pollinator-rival',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A parasitoid wasp has found the fig from outside. She never enters. Her ovipositor drills through the fig wall, probing blindly for galls. If she finds yours, her larva will consume your offspring.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'has_flag', flag: 'entered-new-fig' },
    ],
    weight: 12,
    cooldown: 99,
    tags: ['predator', 'parasitoid', 'cheater'],
    footnote: 'Non-pollinating fig wasps (NPFWs) are a diverse group of insects that exploit the fig-pollinator mutualism. Some are parasitoids of pollinator larvae; others are gallers that compete for ovules without pollinating. NPFWs can outnumber pollinators in many fig species, and their impact on the mutualism is a major area of ecological research.',
  },

  {
    id: 'figwasp-female-death-in-fig',
    type: 'passive',
    category: 'health',
    narrativeText: 'Wings gone. Antennae broken. Eggs laid. Your body has nothing left. You die inside the fig, and the fruit absorbs your remains.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Died inside the fig after laying eggs. The fruit absorbed the body.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'eggs-laid' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'death', 'female'],
  },

  {
    id: 'figwasp-hurricane-damage',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Wind tears at the fig tree. Ripe figs rip from branches and split on the ground below. The tree groans and sways.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'figwasp-hurricane-death',
        chance: 0.12,
        narrativeText: 'Your fig tears free and falls. The impact splits the syconium.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'The fig tore from the branch and split on impact.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['environmental', 'storm', 'danger'],
  },

  {
    id: 'figwasp-parasitoid-fly',
    type: 'passive',
    category: 'health',
    narrativeText: 'A parasitoid fly crawls over the fig surface, probing through cracks in the wall with its ovipositor, seeking larvae inside.',
    statEffects: [
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'parasitoid-wasp', startStage: 0 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_parasite', parasiteId: 'parasitoid-wasp' },
      { type: 'no_flag', flag: 'exited-fig' },
      { type: 'age_range', max: 2 },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['health', 'parasite', 'parasitoid'],
  },
];
