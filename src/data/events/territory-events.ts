/** Phase 6: Territory/Home Range shared events */

import type { GameEvent } from '../../types/events';
import { StatId } from '../../types/stats';

export const TERRITORY_EVENTS: GameEvent[] = [
  {
    id: 'territory-marking',
    type: 'active',
    category: 'social',
    narrativeText: 'You patrol the boundaries of your range, leaving scent marks and signs of your presence. The familiar landmarks reassure you — this ground is yours.',
    statEffects: [
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
      { stat: StatId.TRA, amount: -2, label: '-TRA' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'territory-marked' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'territory-established' },
    ],
    weight: 6,
    cooldown: 3,
    tags: ['territory', 'social'],
    footnote: 'Most territorial animals must regularly renew scent marks and other boundary signals. Unmarked territory is quickly claimed by neighbors.',
  },

  {
    id: 'territory-intruder',
    type: 'active',
    category: 'social',
    narrativeText: 'Fresh signs of another {{species}} appear within your territory. The scent is unfamiliar — an outsider testing your boundaries.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'confront',
        label: 'Confront the intruder',
        description: 'Drive them out with a display of dominance',
        narrativeResult: 'You track down the intruder and assert your dominance through aggressive display. They retreat, but may return.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'territory-intruder' },
        ],
        revocable: false,
        style: 'default',
        deathChance: { probability: 0.02, cause: 'Killed defending territory from an intruder.' },
      },
      {
        id: 'avoid',
        label: 'Avoid confrontation',
        description: 'Let them pass — fighting is risky',
        narrativeResult: 'You keep your distance. The intruder wanders through and eventually moves on, but your territory feels less secure.',
        statEffects: [
          { stat: StatId.HOM, amount: -4, label: '-HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'territory-established' },
    ],
    weight: 4,
    cooldown: 5,
    tags: ['territory', 'social', 'rival'],
    footnote: 'Territorial disputes are among the most common causes of injury in wildlife. Many animals have ritualized contests to reduce the risk of lethal combat.',
  },

  {
    id: 'territory-expansion',
    type: 'active',
    category: 'social',
    narrativeText: 'The area beyond your current range looks promising — good foraging grounds and sheltered resting spots. You could expand your territory.',
    statEffects: [],
    choices: [
      {
        id: 'expand',
        label: 'Expand your range',
        description: 'Claim new ground, but stretching your boundaries thin',
        narrativeResult: 'You push outward, marking new boundaries. The expanded range offers more resources but is harder to defend.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'territory-expanded' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'consolidate',
        label: 'Consolidate current territory',
        description: 'Focus on defending what you have',
        narrativeResult: 'You double down on marking and patrolling your existing range. It feels secure and well-defended.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'territory-established' },
      { type: 'no_flag', flag: 'territory-expanded' },
      { type: 'age_range', min: 12 },
    ],
    weight: 3,
    cooldown: 15,
    tags: ['territory', 'social'],
  },

  {
    id: 'territory-boundary-dispute',
    type: 'active',
    category: 'social',
    narrativeText: 'A neighbor has been encroaching on the edge of your territory. Their marks overlap with yours in a contested strip of ground.',
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight',
        label: 'Fight for the boundary',
        description: 'Assert your claim through combat',
        narrativeResult: 'The confrontation is intense but brief. You drive them back past the original boundary.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: { probability: 0.03, cause: 'Killed in a territorial boundary dispute.' },
      },
      {
        id: 'yield',
        label: 'Yield the strip',
        description: 'Give up the contested area to avoid injury',
        narrativeResult: 'You retreat from the contested ground. Your range shrinks slightly, but you avoid a dangerous fight.',
        statEffects: [
          { stat: StatId.HOM, amount: -5, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'territory-established' },
    ],
    weight: 3,
    cooldown: 8,
    tags: ['territory', 'social', 'rival'],
  },

  {
    id: 'territory-establish',
    type: 'active',
    category: 'social',
    narrativeText: 'You have been ranging through this area long enough to know its contours — the good foraging patches, the safe resting spots, the water sources. It feels like home. Perhaps it is time to claim it.',
    statEffects: [],
    choices: [
      {
        id: 'establish',
        label: 'Establish a territory',
        description: 'Claim this range as your own',
        narrativeResult: 'You begin the work of marking boundaries — scent, sound, presence. This ground is yours now.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'territory-established' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wander',
        label: 'Keep wandering',
        description: 'Stay a nomad for now',
        narrativeResult: 'The open range calls. You move on, unbound by borders.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'no_flag', flag: 'territory-established' },
      { type: 'age_range', min: 6 },
    ],
    weight: 4,
    cooldown: 10,
    tags: ['territory', 'social'],
    footnote: 'Establishing a territory is a major life decision for many animals. A good territory provides reliable food, shelter, and mating opportunities — but must be constantly defended.',
  },

  {
    id: 'territory-den-defense',
    type: 'active',
    category: 'predator',
    narrativeText: 'A predator has ventured deep into your territory, approaching the core area where you rest and shelter. This is a direct threat.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'defend',
        label: 'Defend your den',
        description: 'Fight to protect your core territory',
        narrativeResult: 'You launch a desperate defense. The predator, surprised by your ferocity in familiar ground, eventually withdraws.',
        statEffects: [
          { stat: StatId.STR, amount: -4, label: '-STR' },
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Killed defending your den from a predator.',
          statModifiers: [{ stat: StatId.HOM, factor: -0.3 }],
        },
      },
      {
        id: 'flee',
        label: 'Abandon and flee',
        description: 'Survival over territory',
        narrativeResult: 'You flee into unfamiliar ground. Your territory is lost, but you are alive.',
        statEffects: [
          { stat: StatId.HOM, amount: -12, label: '-HOM' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'territory-established' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'territory-established' },
    ],
    weight: 2,
    cooldown: 12,
    tags: ['territory', 'predator'],
    footnote: 'Animals fighting on their home ground — the "resident advantage" — tend to win territorial contests more often than intruders, even against larger opponents.',
  },
];
