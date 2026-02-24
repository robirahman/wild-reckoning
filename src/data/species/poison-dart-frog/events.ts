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
    narrativeText: 'You float in a tiny pool of water trapped in the cup of a bromeliad leaf, high above the forest floor. The world is a cylinder of green walls and sky. Mosquito larvae wriggle past you. This is your entire universe — a few tablespoons of water in a plant.',
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
    narrativeText: 'A vibration shakes your tiny world — your mother has arrived, climbing the bromeliad with powerful hind legs. She deposits an unfertilized egg into the pool. It is your only food, rich in protein and lipids. Without her visits, you would starve.',
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
    narrativeText: 'Your tail is shrinking. Your legs, once useless buds, have become powerful springs. Lungs are developing inside your chest, replacing the gills that sustained you in the pool. One morning, you haul yourself over the lip of the bromeliad and drop to the forest floor. The world is suddenly infinite.',
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
    narrativeText: 'A column of tiny ants streams across the leaf litter — Oribatid mites and formicine ants, each one a tiny packet of alkaloid compounds. Eating them is how you build your chemical arsenal.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    choices: [
      {
        id: 'gorge-ants',
        label: 'Gorge on the column',
        description: 'Eat as many as you can — maximize toxin accumulation.',
        narrativeResult: 'You methodically pick off ant after ant, your sticky tongue flicking with machine-like precision. The alkaloids accumulate in your skin glands, intensifying your chemical defense. You can feel the toxins building — a tingling warmth across your back.',
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
        description: 'Pick off the choicest mites and move on.',
        narrativeResult: 'You take a few of the largest ants and a handful of mites, then move on. Your toxin stores are maintained but not significantly boosted.',
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
    narrativeText: 'Beneath a rotting log, you find a cluster of oribatid mites — tiny arachnids that are the richest source of pumiliotoxin alkaloids in the forest. Each one is smaller than a grain of sand, but their chemistry is potent.',
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
    narrativeText: 'A fallen fruit on the forest floor is swarming with tiny flies. You position yourself at the fruit\'s edge and pick them off one by one — easy prey, if nutritionally unremarkable. The flies carry no alkaloids, but they fill your stomach.',
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
    narrativeText: 'From a prominent leaf, you inflate your throat and release your call — a rapid, insistent buzz that rings through the understory. The call declares your territory, your fitness, your presence. Other males within earshot must decide: challenge or retreat.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'call-louder',
        label: 'Call aggressively',
        description: 'Maximum volume — assert dominance.',
        narrativeResult: 'Your call rings through the forest with unusual force. A nearby rival falls silent, ceding the area. But the effort has drained your energy, and your vocal sac aches.',
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
        narrativeResult: 'You call at a steady rhythm, sufficient to maintain your claim. The soundscape of the forest floor accepts your contribution without challenge.',
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
    narrativeText: 'A rival male has invaded your calling territory. He is perched on a leaf barely two body-lengths away, calling defiantly. In dart frog society, this means war — a wrestling match that can last for hours.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'wrestle',
        label: 'Pin the rival',
        description: 'Grapple and try to press him flat against the leaf.',
        narrativeResult: 'You leap onto the rival and attempt to pin him belly-down. The struggle is exhausting — two tiny bodies locked in combat on a wet leaf. After many minutes, the rival squirms free and retreats, leaving you victorious but drained.',
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
        description: 'Win the war of attrition through sheer vocal endurance.',
        narrativeResult: 'You sit and call. He calls. You call louder. He matches you. This continues for hours until, at last, his calls grow hoarse and infrequent. He retreats. Victory through stubbornness.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
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
    narrativeText: 'A cat-eyed snake slides through the leaf litter, tongue flicking, testing the air. It is hunting frogs. Your brilliant red skin should warn it off — but not all predators have learned to read the warning.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
    ],
    choices: [
      {
        id: 'sit-still-display',
        label: 'Display your colors',
        description: 'Trust your warning coloration. Hold still and be conspicuous.',
        narrativeResult: 'You sit perfectly still on a bright green leaf, your red body a vivid signal against the green. The snake\'s tongue touches the air near you, tastes the alkaloid compounds rising from your skin, and recoils. It slithers away. Your toxins have spoken for you.',
        statEffects: [
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'This snake had evolved resistance to your toxins. It swallowed you despite the warning colors.',
          statModifiers: [{ stat: StatId.IMM, factor: -0.0003 }],
        },
      },
      {
        id: 'flee-snake',
        label: 'Leap away',
        description: 'Don\'t take chances — flee into the leaf litter.',
        narrativeResult: 'You launch yourself in a desperate leap, landing in the tangle of dead leaves and roots. The snake investigates but cannot find you in the debris. Your heart pounds against your tiny ribs.',
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
    narrativeText: 'A wandering spider — large, fast, and fearless — drops from a leaf above you. Spiders are among the few predators that can overpower a dart frog, and your toxins may not deter an arachnid.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'leap-escape',
        label: 'Leap for your life',
        description: 'Jump as far and fast as possible.',
        narrativeResult: 'You rocket off the leaf, legs fully extended, and land on a branch three feet away. The spider, unable to track your trajectory, hesitates — and you hop again, putting distance between you and those chelicerae.',
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
        description: 'Flood your skin with alkaloid compounds.',
        narrativeResult: 'You pump alkaloids to the surface of your skin, your body beading with toxic mucus. The spider touches you with a cautious palp, recoils, and retreats. The chemical defense holds — this time.',
        statEffects: [
          { stat: StatId.TRA, amount: -8, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'Your toxin reserves were depleted. The spider was not deterred and delivered a fatal bite.',
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
    narrativeText: 'A female approaches your calling perch, drawn by the quality of your voice. She watches you from a nearby leaf, evaluating. This is the moment — your call, your colors, your territory — it all comes down to whether she stays.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'lead-to-site',
        label: 'Lead her to your egg-laying site',
        description: 'Guide her to a moist, shaded spot beneath a leaf.',
        narrativeResult: 'You hop deliberately toward your chosen site, pausing to ensure she follows. She does. At the site, she deposits a clutch of eggs on the wet surface of a leaf, and you fertilize them. The eggs glisten like tiny pearls.',
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
        description: 'This female may not be the only option.',
        narrativeResult: 'You continue your call, hoping to attract a larger or more vigorous female. The current prospect waits, then hops away. You may have missed your chance — or a better one may come.',
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
    narrativeText: 'The eggs have hatched. Tiny tadpoles wriggle on your back, held in place by mucus. You must carry them up into the canopy and deposit each one in a separate bromeliad pool — one tadpole per pool, to prevent cannibalism.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    choices: [
      {
        id: 'nearby-bromeliad',
        label: 'Use the nearest bromeliads',
        description: 'Deposit them quickly in nearby pools — faster but riskier.',
        narrativeResult: 'You climb the nearest tree trunk, depositing a tadpole in each bromeliad you find. Some pools are small and may dry out, but the transport is done quickly, sparing your energy.',
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
        description: 'Climb higher — larger pools with more water.',
        narrativeResult: 'You scale the trunk to the canopy, testing each bromeliad with your hind foot before depositing a tadpole. The climb is exhausting, but the pools you find are deep, shaded, and secure.',
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
    narrativeText: 'You climb to the bromeliad where your tadpole waits, its tiny mouth already gaping in anticipation. You deposit an unfertilized egg into the pool — a nutritional sacrifice that will fuel its growth. This visit is one of dozens you will make before the tadpole metamorphoses.',
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
    narrativeText: 'Rain hammers the canopy, and a thousand tiny waterfalls cascade down leaf surfaces. The humidity soars. Your skin, which depends on moisture for respiration, absorbs water gratefully. Everything is alive with movement — insects fleeing floods, worms emerging from the soil, frogs calling from every direction.',
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
    narrativeText: 'Days without rain have turned the leaf litter crisp and papery. Your skin is drying, and you must seek out the dampest microhabitats — under logs, beside streams, deep in the leaf litter. Dehydration is a death sentence for a frog who breathes through its skin.',
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
    narrativeText: 'A massive tree has dropped a branch, creating a light gap in the canopy. New plants are racing to fill the space, and the increased sunlight has transformed the understory. New bromeliad pools, new insect communities, new territory — if you dare claim it.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'explore-gap',
        label: 'Explore the light gap',
        description: 'Investigate new territory and resources.',
        narrativeResult: 'You hop through the bright gap, cataloguing new calling perches and bromeliad pools. The insect community here is different — more varied, with species you have not tasted before.',
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
        description: 'Your current range is proven. Don\'t risk the unknown.',
        narrativeResult: 'You return to your established territory, where every leaf and log is mapped in your memory. The familiar ground offers safety, if not novelty.',
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
    narrativeText: 'As dusk falls, the forest erupts into sound. Frogs of every species begin their evening chorus — treefrogs, glass frogs, rain frogs, and your own kind. The cacophony is deafening but organized; each species occupies a different frequency band, a different rhythm. Your call finds its place in the acoustic tapestry.',
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
    narrativeText: 'You have survived many wet and dry seasons. Your coloration has deepened with age, a richer red than the young frogs around you. You know every microhabitat within your range — every crevice, every pool, every ant trail. The younger males call louder, but you call smarter.',
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
];
