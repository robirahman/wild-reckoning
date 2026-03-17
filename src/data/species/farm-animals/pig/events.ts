import type { GameEvent } from '../../../../types/events';
import { StatId } from '../../../../types/stats';

export const PIG_EVENTS: GameEvent[] = [
  // ── Industrial Feeding Events ──
  {
    id: 'pig-industrial-feeding',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'A clatter from the feeder. The smell of grain hits before you see it. You shove toward the trough and eat until it is empty.',
    statEffects: [
      { stat: StatId.HOM, amount: -2, label: '-HOM' },
    ],
    consequences: [
      { type: 'add_calories', amount: 55, source: 'industrial feed ration' },
    ],
    conditions: [],
    weight: 80,
    tags: ['feeding', 'daily'],
  },
  {
    id: 'pig-feed-competition',
    type: 'passive',
    category: 'social',
    narrativeText: 'A larger pig shoulders you off the trough. You grab mouthfuls between shoves, snout bruised against metal.',
    statEffects: [
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
      { stat: StatId.STR, amount: 2, label: '+STR' },
    ],
    consequences: [
      { type: 'add_calories', amount: 30, source: 'contested feed' },
    ],
    conditions: [],
    weight: 30,
    tags: ['feeding', 'social', 'stress'],
  },
  {
    id: 'pig-growth-promoters',
    type: 'passive',
    category: 'health',
    narrativeText: 'The feed smells wrong today. A sharp chemical note under the grain. Your heart races after eating. Your muscles twitch and ache.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.STR, amount: 3, label: '+STR' },
    ],
    consequences: [
      { type: 'add_calories', amount: 40, source: 'growth-promoted feed' },
    ],
    conditions: [
      { type: 'turn_above', threshold: 30 },
    ],
    cooldown: 10,
    weight: 20,
    tags: ['feeding', 'health', 'chemicals'],
  },
  // ── Stress/Confinement Events ──
  {
    id: 'pig-gestation-crate',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The new pen is too narrow to turn around in. Metal bars press both flanks. Your legs stiffen from standing in one position.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' }
    ],
    conditions: [
      { type: 'has_flag', flag: 'pregnant' },
      { type: 'sex', sex: 'female' }
    ],
    weight: 50,
    tags: ['confinement', 'stress']
  },
  {
    id: 'pig-tail-docking',
    type: 'passive',
    category: 'health',
    narrativeText: 'Hands grip you. A sharp hot pain at the base of your tail, then the pressure is gone. The spot throbs.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
      { stat: StatId.TRA, amount: 15, label: '+TRA' }
    ],
    conditions: [
      { type: 'turn_above', threshold: 4 }
    ],
    cooldown: 9999,
    weight: 40,
    tags: ['pain', 'trauma']
  },
  {
    id: 'pig-bar-biting',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'Your mouth finds the metal bar again. You bite and gnaw. The taste is iron and blood from your own gums. You cannot stop.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
      { stat: StatId.WIS, amount: -5, label: '-WIS' },
      { stat: StatId.TRA, amount: 10, label: '+TRA' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 20,
    tags: ['stress', 'psychological']
  },
  {
    id: 'pig-respiratory-distress',
    type: 'passive',
    category: 'health',
    narrativeText: 'The air burns your nostrils. Ammonia rises through the slats from below. Each breath triggers a hacking cough you cannot clear.',
    statEffects: [
      { stat: StatId.HEA, amount: -4, label: '-HEA' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    cooldown: 20,
    weight: 10,
    tags: ['health', 'environmental']
  },
  {
    id: 'pig-piglet-removal',
    type: 'passive',
    category: 'social',
    narrativeText: 'Hands pull the piglets away. Their squealing gets fainter down the corridor. Their smell fades from the pen.',
    statEffects: [
      { stat: StatId.TRA, amount: 25, label: '+TRA' },
      { stat: StatId.STR, amount: 20, label: '+STR' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' }
    ],
    conditions: [
      { type: 'has_flag', flag: 'weaned' },
      { type: 'sex', sex: 'female' }
    ],
    weight: 1000, // Guaranteed when weaning happens
    tags: ['trauma', 'social', 'stress']
  },
  {
    id: 'pig-frustrated-rooting',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'Your snout pushes at the concrete. You press harder, working side to side, but there is nothing to turn over, nothing to smell under. You scrape until the skin on your nose bleeds.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HEA, amount: -2, label: '-HEA' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 15,
    tags: ['instinct', 'stress']
  },
  {
    id: 'pig-frustrated-nesting',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'The urge to gather and pile bedding is constant. Your front feet scrape at bare metal. There is nothing to gather. You paw at the floor and the air.',
    statEffects: [
      { stat: StatId.STR, amount: 15, label: '+STR' },
      { stat: StatId.TRA, amount: 10, label: '+TRA' }
    ],
    conditions: [
      { type: 'has_flag', flag: 'pregnant' },
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 20,
    tags: ['instinct', 'reproduction', 'stress']
  },

  // ── Slaughter ──
  {
    id: 'pig-market-slaughter',
    type: 'active',
    category: 'health',
    narrativeText: 'A ramp. Unfamiliar pigs pressed against you. Hours of movement with no water. Then a concrete corridor. A heavy gas fills your lungs and burns.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Slaughtered at processing plant after reaching market weight of approximately 280 lbs in 6 months.' },
    ],
    conditions: [
      { type: 'weight_above', threshold: 250 },
      { type: 'turn_above', threshold: 680 },  // ~170 days at 4 turns/day
    ],
    weight: 9999,
    tags: ['slaughter', 'death'],
  },

  // ── Forced breeding (enables gestation crate + nesting frustration events) ──
  {
    id: 'pig-artificial-insemination',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'Hands force you into a narrow chute. Pressure inside your body, sharp and wrong. The smell of the handler stays in your nostrils long after.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.STR, amount: 5, label: '+STR' },
    ],
    consequences: [
      { type: 'start_pregnancy', offspringCount: 10 },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'turn_above', threshold: 800 },
      { type: 'no_flag', flag: 'pregnant' },
    ],
    cooldown: 400,
    weight: 60,
    tags: ['reproduction', 'trauma'],
  },

  // ── Parasites ──
  {
    id: 'pig-roundworm-infection',
    type: 'passive',
    category: 'health',
    narrativeText: 'You nose at the cracks between the slats. Something in the grit you swallow does not sit right. A dull ache settles in your gut over the following days.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.IMM, amount: -2, label: '-IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'swine-roundworm' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'swine-roundworm' },
      { type: 'turn_above', threshold: 40 },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
  {
    id: 'pig-louse-infestation',
    type: 'passive',
    category: 'health',
    narrativeText: 'An itch behind your ears that will not stop. You rub your flank against the bars but the crawling sensation spreads. The skin there is raw now.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'pig-louse' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'pig-louse' },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
];
