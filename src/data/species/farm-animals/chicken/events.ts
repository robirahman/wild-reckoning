import type { GameEvent } from '../../../../types/events';
import { StatId } from '../../../../types/stats';

export const CHICKEN_EVENTS: GameEvent[] = [
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
];
