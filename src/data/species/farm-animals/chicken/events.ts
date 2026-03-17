import type { GameEvent } from '../../../../types/events';
import { StatId } from '../../../../types/stats';

export const CHICKEN_EVENTS: GameEvent[] = [
  // ── Industrial Feeding Events ──
  {
    id: 'chicken-industrial-feeding',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'Pellets rattle into the trough. The light never changes. You eat, because eating is the only thing to do here.',
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
    narrativeText: 'Standing is harder each day. Your breast pulls you forward. You pant in the warm air. Your legs tremble under the new weight.',
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
    narrativeText: 'Hands lift you from the sorting belt. Bright light, loud noise, a rush of air.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Culled at hatchery, day two.' }
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
    narrativeText: 'The air stings your eyes. Each breath burns in your throat. The smell from the litter below is sharp and constant.',
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
    narrativeText: 'Hands hold your head still. Heat on your beak, then searing pain. The tip is gone. The raw end throbs.',
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
    narrativeText: 'Your legs bend wrong under the weight of your body. Each step sends pain up through the joints. You sit more than you stand now.',
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
    narrativeText: 'Sharp pecks at your back and flanks. Other birds pull at your feathers. Raw patches sting where the skin is exposed.',
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
    narrativeText: 'The light dims slightly. Your feet grip and release the wire, grip and release. There is nothing higher to stand on. You crouch on the wire. Your eyes do not close.',
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
    narrativeText: 'Your skin crawls. You crouch and work your wings against the wire floor, going through the motions. No dust rises. The itch does not stop.',
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
    narrativeText: 'Hands grab your legs in the dark. You are upside down, then inside a crate. Hours of noise and motion. Then bright light, cold metal on your feet, and water that jolts through your whole body.',
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
    narrativeText: 'In the dim hours, pinprick bites along your skin. By morning your comb is pale. Something feeds on you in the dark and is gone when the lights return.',
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
    narrativeText: 'Your leg scales lift and crust over with white residue. The itch is constant. Walking sends sharp pain up through both feet.',
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
