import type { GameEvent } from '../../../../types/events';
import { StatId } from '../../../../types/stats';

export const PIG_EVENTS: GameEvent[] = [
  // ── Industrial Feeding Events ──
  {
    id: 'pig-industrial-feeding',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'The automated feeder clatters to life, dumping a measured ration of corn-and-soy pellets into the trough. You and the others surge forward, shoving and biting for position. The feed is engineered for maximum weight gain — high energy, growth hormones, antibiotics mixed into the grain. You eat until the trough is empty and your stomach aches. There is nothing else to do until the next feeding.',
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
    narrativeText: 'A larger pig shoulders you away from the feeder. In the overcrowded pen, dominance at the trough determines who eats first and who gets the scraps. You manage to grab mouthfuls between shoves, but the stress of the competition burns nearly as many calories as you consume.',
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
    narrativeText: 'The feed today has a chemical undertone — ractopamine, a growth promoter that redirects your metabolism toward muscle instead of fat. Your heart races. Your muscles twitch and ache as they grow faster than your tendons can adapt. The industry calls this "feed efficiency." Your body calls it something else.',
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
    narrativeText: 'Now that you are pregnant, you have been moved to a gestation crate. It is so narrow you cannot turn around or even lie down comfortably. Your muscles begin to atrophy.',
    statEffects: [
      { stat: StatId.HEA, amount: -10, label: '-HEA' },
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: -10, label: '-ADV' }
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
    narrativeText: 'To prevent tail-biting caused by the stress of overcrowding, the farmer clips your tail off. No pain relief is used.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
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
    narrativeText: 'Driven mad by the lack of stimulation and confinement, you find yourself compulsively biting at the metal bars of your crate until your gums bleed.',
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
    narrativeText: 'Dust and high levels of ammonia from the manure pits below the slats irritate your respiratory tract. You have developed a persistent, hacking cough.',
    statEffects: [
      { stat: StatId.HEA, amount: -12, label: '-HEA' },
      { stat: StatId.IMM, amount: -10, label: '-IMM' }
    ],
    conditions: [
      { type: 'region', regionIds: ['farmstead'] }
    ],
    weight: 15,
    tags: ['health', 'environmental']
  },
  {
    id: 'pig-piglet-removal',
    type: 'passive',
    category: 'social',
    narrativeText: 'Your piglets are only three weeks old, but the cycle of production moves on. Farm employees roughly separate you from your litter. You hear their high-pitched squeals as they are hauled away to another building. You will never see them again.',
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
    narrativeText: 'An overwhelming urge to root in the earth overcomes you, but there is only hard, slatted concrete beneath your feet. You scrape your snout against the floor until it bleeds, unable to satisfy the natural instinct to explore.',
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
    narrativeText: 'As your farrowing date approaches, you feel a desperate need to gather straw and build a nest for your young. But there is no bedding here—only cold metal bars. You paw fruitlessly at the air and floor, trapped in a state of high anxiety.',
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
];
