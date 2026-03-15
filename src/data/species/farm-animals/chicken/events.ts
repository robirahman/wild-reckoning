import type { GameEvent } from '../../../../types/events';
import { StatId } from '../../../../types/stats';

export const CHICKEN_EVENTS: GameEvent[] = [
  // ── Industrial Feeding Events ──
  {
    id: 'chicken-industrial-feeding',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'Feed flows continuously from overhead hoppers into long metal troughs. The pellets are formulated for maximum growth — corn, soybean meal, animal fat, antibiotics, coccidiostats. You eat because there is nothing else to do. The lights are kept on 23 hours a day to encourage constant feeding. Your body converts feed to flesh at a rate that would have been biologically impossible fifty years ago.',
    statEffects: [
      { stat: StatId.HOM, amount: -1, label: '-HOM' },
    ],
    consequences: [
      { type: 'add_calories', amount: 4, source: 'growth-optimized feed' },
    ],
    conditions: [],
    weight: 80,
    tags: ['feeding', 'daily'],
  },
  {
    id: 'chicken-rapid-growth-strain',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your body is gaining weight so fast that your heart and lungs cannot keep pace. You pant in the heated shed, your breast muscles so heavy that standing is an effort. Modern broilers have been bred to reach slaughter weight in six weeks — a growth rate that would be lethal if it continued. Your skeleton, your cardiovascular system, your organs are all running behind your muscles in a race none of them can win.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.STR, amount: 4, label: '+STR' },
    ],
    consequences: [
      { type: 'add_calories', amount: 3, source: 'forced growth' },
    ],
    conditions: [
      { type: 'weight_above', threshold: 2.0 },
    ],
    cooldown: 5,
    weight: 25,
    tags: ['health', 'growth', 'feeding'],
  },
  // ── Culling and Stress Events ──
  {
    id: 'chicken-male-culling',
    type: 'active',
    category: 'health',
    narrativeText: 'You were born male in a facility that only has use for hens. As you reach your second day of life, you are scooped up with the other cockerels and tossed into a high-speed grinder.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Culled as a male chick' }
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'turn_above', threshold: 4 } // Day 2
    ],
    weight: 9999, // Absolute priority
    tags: ['culling', 'death']
  },
  {
    id: 'chicken-ammonia-burn',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The air in the shed is thick with the stench of ammonia from the accumulated waste of thousands of birds. It burns your eyes and lungs.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.IMM, amount: -2, label: '-IMM' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 20,
    tags: ['health', 'stress']
  },
  {
    id: 'chicken-beak-trimming',
    type: 'passive',
    category: 'health',
    narrativeText: 'To prevent you from pecking at others in the crowded shed, your sensitive beak is seared off with a hot blade. No anesthesia is provided.',
    statEffects: [
      { stat: StatId.TRA, amount: 20, label: '+TRA' },
      { stat: StatId.HEA, amount: -10, label: '-HEA' }
    ],
    conditions: [
      { type: 'turn_above', threshold: 2 }
    ],
    cooldown: 9999, // Once per lifetime
    weight: 30,
    tags: ['trauma', 'pain']
  },
  {
    id: 'chicken-lameness',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your breast muscle has grown so rapidly that your immature leg bones are buckling under the weight. Each step is an agonizing struggle.',
    statEffects: [
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.ADV, amount: -10, label: '-ADV' }
    ],
    conditions: [
      { type: 'weight_above', threshold: 5 }
    ],
    weight: 15,
    tags: ['health', 'growth']
  },
  {
    id: 'chicken-feather-pecking',
    type: 'passive',
    category: 'social',
    narrativeText: 'Driven by stress and the inability to forage, your shed-mates have begun to peck at your feathers, leaving raw, bleeding patches on your skin.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 10,
    tags: ['social', 'stress']
  },
  {
    id: 'chicken-frustrated-perching',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'As dusk falls, your instinct to seek a high perch for safety is overwhelming. But there are no branches or roosts here, only the wire floor or the crowded ground. You spend the night in a state of hyper-vigilance, unable to rest properly.',
    statEffects: [
      { stat: StatId.STR, amount: 8, label: '+STR' },
      { stat: StatId.HEA, amount: -2, label: '-HEA' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 15,
    tags: ['instinct', 'stress']
  },
  {
    id: 'chicken-frustrated-dustbathing',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'Your skin is itchy and your feathers are oily, but there is no dirt to perform a dust bath. You perform the motions of bathing against the wire cage, fruitlessly scraping at the metal while the irritation only grows.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.STR, amount: 5, label: '+STR' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 15,
    tags: ['instinct', 'stress']
  },

  // ── Slaughter ──
  {
    id: 'chicken-broiler-slaughter',
    type: 'active',
    category: 'health',
    narrativeText: 'You have reached market weight. Workers move through the shed in the dark, grabbing birds by the legs — four or five in each hand — and stuffing them into plastic transport crates. The ride to the processing plant takes hours. You arrive terrified, dehydrated, and covered in the feces of the birds stacked above you. At the plant, you are shackled upside down on a moving line and dragged through an electrified water bath meant to stun you. Then a mechanical blade cuts your throat.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Slaughtered at processing plant after reaching market weight of approximately 6 lbs in 42 days.' },
    ],
    conditions: [
      { type: 'weight_above', threshold: 5.5 },
      { type: 'turn_above', threshold: 140 },
    ],
    weight: 9999,
    tags: ['slaughter', 'death'],
  },

  // ── Parasites ──
  {
    id: 'chicken-mite-infestation',
    type: 'passive',
    category: 'health',
    narrativeText: 'At night, the red mites emerge from cracks in the housing infrastructure — tiny vampires that feed on your blood while you sleep. By morning your comb is pale and you feel weak. The mites retreat into the woodwork before the lights come on, invisible to the workers who never look closely enough.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'chicken-mite' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'chicken-mite' },
      { type: 'turn_above', threshold: 20 },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
  {
    id: 'chicken-scaly-leg',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your legs itch constantly. The scales are lifting, thickening, crusting over with a chalky white residue. Burrowing mites have colonized the skin beneath your leg scales, tunneling through the tissue and leaving behind debris that deforms the keratin above. Walking becomes painful.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'scaly-leg-mite' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'scaly-leg-mite' },
      { type: 'turn_above', threshold: 60 },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
];
