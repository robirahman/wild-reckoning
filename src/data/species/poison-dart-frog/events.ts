import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const POISON_DART_FROG_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  TADPOLE / METAMORPH PHASE (age 0-6)
  // ══════════════════════════════════════════════

  {
    id: 'frog-bromeliad-pool-life',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Warm water surrounds you. Green walls curve up to a circle of white sky. Something wriggles past your tail.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    conditions: [
      { type: 'age_range', max: 3 },
    ],
    weight: 20,
    cooldown: 2,
    tags: ['environmental', 'juvenile'],
  },

  {
    id: 'frog-mother-feeds-egg',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'The water shudders. Heavy vibrations travel up the plant wall. A shape appears at the rim and something round and soft drops into the pool beside you. Food.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.0000005 },
    ],
    conditions: [
      { type: 'age_range', max: 3 },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'juvenile'],
  },

  {
    id: 'frog-metamorphosis',
    type: 'passive',
    category: 'seasonal',
    narrativeText: 'Your tail is shorter each day. New legs grip the plant wall. Air enters through a passage that was not there before. You climb over the rim and drop. Wet ground, open space, no walls.',
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'metamorphosis-complete' },
    ],
    conditions: [
      { type: 'age_range', min: 3, max: 6 },
      { type: 'no_flag', flag: 'metamorphosis-complete' },
    ],
    weight: 30,
    tags: ['milestone', 'juvenile'],
  },

  // ══════════════════════════════════════════════
  //  FORAGING / TOXIN BUILDING
  // ══════════════════════════════════════════════

  {
    id: 'frog-ant-foraging',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A line of ants crosses the leaf litter. You detect their chemical traces through the pads of your feet. Each one carries compounds your skin needs.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    choices: [
      {
        id: 'gorge-ants',
        label: 'Gorge on the column',
        description: 'Eat as many as you can.',
        narrativeResult: 'Your tongue flicks and flicks. Ant after ant. A tingling heat spreads across the skin of your back as the compounds accumulate.',
        statEffects: [
          { stat: StatId.IMM, amount: -5, label: '-IMM (toxin boost)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000008 },
          { type: 'set_flag', flag: 'toxin-level-high' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'selective-feeding',
        label: 'Feed selectively',
        description: 'Take a few and move on.',
        narrativeResult: 'You pick off a few of the largest ones and hop away. The tingling in your skin holds steady.',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: 0.0000004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 16,
    cooldown: 2,
    tags: ['foraging', 'food'],
  },

  {
    id: 'frog-mite-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Under a rotting log, mites cluster in the damp. Your tongue finds them one by one. Their chemical taste is strong.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.0000006 },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'frog-fruit-fly-feast',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'A fallen fruit crawls with tiny flies. You sit at its edge and pick them off. They carry no useful compounds, but they fill the gut.',
    statEffects: [
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.0000004 },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  // ══════════════════════════════════════════════
  //  TERRITORY / CALLING
  // ══════════════════════════════════════════════

  {
    id: 'frog-territory-calling',
    type: 'active',
    category: 'social',
    narrativeText: 'You inflate your throat on a high leaf and call. The buzz vibrates through the substrate. Another male\'s call answers from two body-lengths away.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'call-louder',
        label: 'Call aggressively',
        description: 'Maximum volume.',
        narrativeResult: 'You call until your vocal sac aches. The rival\'s sound stops. The leaf beneath you is quiet again.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'call-standard',
        label: 'Standard call rate',
        description: 'Maintain your territory without overexerting.',
        narrativeResult: 'You call at a steady rhythm. No rival answers. The territory holds.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 6 },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['social', 'territory'],
  },

  {
    id: 'frog-wrestling-match',
    type: 'active',
    category: 'social',
    narrativeText: 'Another male sits on the leaf beside yours, calling. Two body-lengths away. His vibrations run through the branch into your feet.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'wrestle',
        label: 'Pin the rival',
        description: 'Grapple and try to pin him flat.',
        narrativeResult: 'You leap onto him and press down. Belly to leaf. He writhes under you on the wet surface. After long minutes he squirms free and hops away. Your limbs shake.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
          { stat: StatId.ADV, amount: -8, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.0000003 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'out-call',
        label: 'Out-call him',
        description: 'Keep calling until he stops.',
        narrativeResult: 'You call. He calls. You call louder. He matches. Hours pass. His calls thin out and slow. He hops away.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'wrestling-exhaustion',
        chance: 0.20,
        conditions: [],
        narrativeText: 'You sit on the leaf afterward, sides heaving. Your limbs will not stop trembling. The energy from days of foraging is gone.',
        footnote: 'Dart frog wrestling bouts can last 10-30 minutes and are among the most energetically costly behaviors in their repertoire. Males may lose significant body mass from a single prolonged contest.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.STR, amount: -5, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.0000005 },
        ],
      },
      {
        eventId: 'vocal-sac-strain-sub',
        chance: 0.10,
        conditions: [],
        narrativeText: 'Your throat is swollen and hot. When you try to call, the sound comes out thin and reedy. The membrane pulses with each heartbeat.',
        footnote: 'Prolonged aggressive calling can damage the delicate vocal sac membrane in dart frogs, temporarily reducing call quality and volume, directly impacting both territorial defense and mate attraction.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'vocal-sac-strain', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 6 },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'rival'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR ENCOUNTERS
  // ══════════════════════════════════════════════

  {
    id: 'frog-snake-encounter',
    type: 'active',
    category: 'predator',
    narrativeText: 'Vibration through the leaf litter. A snake slides past, tongue testing the air. Its head turns toward you.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
    ],
    choices: [
      {
        id: 'sit-still-display',
        label: 'Display your colors',
        description: 'Hold still on the leaf.',
        narrativeResult: 'You hold still. The snake\'s tongue flicks the air near your skin, recoils. It turns and slides away.',
        statEffects: [
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The snake was resistant to your skin compounds. It swallowed you.',
          statModifiers: [{ stat: StatId.IMM, factor: -0.0003 }],
        },
      },
      {
        id: 'flee-snake',
        label: 'Leap away',
        description: 'Leap into the leaf litter.',
        narrativeResult: 'You leap. Dead leaves and roots close around you. The snake probes the litter but does not find you.',
        statEffects: [
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['predator'],
  },

  {
    id: 'frog-spider-attack',
    type: 'active',
    category: 'predator',
    narrativeText: 'Something heavy drops from the leaf above. A spider, larger than you, lands close. Its legs tap the surface, reading vibrations.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'leap-escape',
        label: 'Leap for your life',
        description: 'Jump.',
        narrativeResult: 'Legs extend fully. You land on a branch three body-lengths away. The spider hesitates. You hop again.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'toxic-defense',
        label: 'Secrete toxins',
        description: 'Push toxins to the skin surface.',
        narrativeResult: 'Your skin beads with mucus. The spider touches you with one palp, pulls back, and retreats.',
        statEffects: [
          { stat: StatId.TRA, amount: -8, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'Toxin reserves depleted. The spider bit and did not let go.',
          statModifiers: [{ stat: StatId.IMM, factor: -0.0005 }],
        },
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION / PARENTAL CARE
  // ══════════════════════════════════════════════

  {
    id: 'frog-courtship-display',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A female sits on the next leaf, oriented toward you. She has been there since your last call. She has not moved away.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'lead-to-site',
        label: 'Lead her to your egg-laying site',
        description: 'Hop toward a damp, shaded leaf.',
        narrativeResult: 'You hop toward the damp leaf, pausing. She follows. She deposits eggs on the wet surface. You fertilize them.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'continue-calling',
        label: 'Keep calling to attract more females',
        description: 'Keep calling.',
        narrativeResult: 'You keep calling. The female waits, then hops away. The leaf is empty again.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 8 },
      { type: 'no_flag', flag: 'mating-complete' },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['reproduction', 'mate'],
  },

  {
    id: 'frog-tadpole-transport',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'Tadpoles wriggle on your back, stuck in mucus. The pull to climb is strong. Each one needs its own pool.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    choices: [
      {
        id: 'nearby-bromeliad',
        label: 'Use the nearest bromeliads',
        description: 'Use the closest pools.',
        narrativeResult: 'You climb the nearest trunk and deposit a tadpole in each bromeliad you find. Some pools are shallow. The climb is short.',
        statEffects: [
          { stat: StatId.STR, amount: -2, label: '-STR' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'carrying-tadpoles' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'search-best-pools',
        label: 'Search for the best pools',
        description: 'Climb higher for deeper pools.',
        narrativeResult: 'You climb until the ground disappears below. Each bromeliad you test with a hind foot before depositing. The pools up here hold more water.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'carrying-tadpoles' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'carrying-eggs' },
    ],
    weight: 18,
    cooldown: 6,
    tags: ['reproduction'],
  },

  {
    id: 'frog-egg-feeding',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'You climb to the bromeliad. The tadpole stirs when your weight shifts the plant. You deposit an unfertilized egg into the pool and climb back down.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.STR, amount: -2, label: '-STR' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.0000003 },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'chicks-dependent' },
    ],
    weight: 14,
    cooldown: 2,
    tags: ['reproduction'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL
  // ══════════════════════════════════════════════

  {
    id: 'frog-rain-event',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Rain hits the leaves above and water runs down every surface. Your skin drinks it in. The ground vibrates with calling from all directions.',
    statEffects: [
      { stat: StatId.HEA, amount: 5, duration: 2, label: '+HEA (hydration)' },
      { stat: StatId.CLI, amount: -5, duration: 2, label: '-CLI (comfortable humidity)' },
    ],
    conditions: [
      { type: 'weather', weatherTypes: ['rain', 'storm'] },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['environmental', 'weather'],
  },

  {
    id: 'frog-dry-spell',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The leaf litter crackles dry underfoot. Your skin tightens. You press yourself under a log where the ground is still damp.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, duration: 3, label: '-HEA (dehydration)' },
      { stat: StatId.CLI, amount: 8, duration: 3, label: '+CLI (dry conditions)' },
    ],
    conditions: [
      { type: 'weather', weatherTypes: ['clear'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['environmental', 'weather'],
  },

  {
    id: 'frog-canopy-exploration',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A branch has fallen. Light pours through the gap above. New growth, new smells, unfamiliar insects moving through the litter.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'explore-gap',
        label: 'Explore the light gap',
        description: 'Hop into the light gap.',
        narrativeResult: 'You move through the bright gap. New perches, new bromeliad pools. Insects here taste different.',
        statEffects: [
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000003 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stay-known',
        label: 'Stay in familiar territory',
        description: 'Stay where you know the ground.',
        narrativeResult: 'You turn back to known ground. Every log and leaf here is familiar under your feet.',
        statEffects: [
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 6 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['environmental'],
  },

  {
    id: 'frog-nightfall-chorus',
    type: 'passive',
    category: 'social',
    narrativeText: 'The light dims. Calls start from every direction, layered at different pitches. The ground buzzes with the sound. You add your own frequency to it.',
    statEffects: [
      { stat: StatId.HOM, amount: 3, duration: 2, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, duration: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'age_range', min: 6 },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['social', 'environmental'],
  },

  // ══════════════════════════════════════════════
  //  AGING / LATE GAME
  // ══════════════════════════════════════════════

  {
    id: 'frog-aging-wisdom',
    type: 'passive',
    category: 'health',
    narrativeText: 'Many wet seasons and dry seasons. You know every crevice, every pool, every ant trail in your range. Your skin color has deepened.',
    statEffects: [
      { stat: StatId.WIS, amount: 8, label: '+WIS' },
      { stat: StatId.STR, amount: -3, label: '-STR' },
    ],
    conditions: [
      { type: 'age_range', min: 60 },
      { type: 'no_flag', flag: 'aging-wisdom-noted' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'aging-wisdom-noted' },
    ],
    weight: 20,
    tags: ['health', 'milestone'],
  },

  // ── Parasite Events ──
  {
    id: 'frog-chytrid-exposure',
    type: 'passive',
    category: 'health',
    narrativeText: 'The still water you crossed carried something. Your skin itches and thickens where the water touched it. Breathing through it is harder now.',
    statEffects: [
      { stat: StatId.HEA, amount: -4, label: '-HEA' },
      { stat: StatId.IMM, amount: -5, label: '-IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'chytrid-fungus' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'chytrid-fungus' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
  {
    id: 'frog-nematode-prey',
    type: 'passive',
    category: 'health',
    narrativeText: 'Something is wrong in your gut. The last ant tasted normal, but now there is a dull pressure inside that was not there before. It grows.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'frog-nematode' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'frog-nematode' },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite', 'foraging'],
  },
];
