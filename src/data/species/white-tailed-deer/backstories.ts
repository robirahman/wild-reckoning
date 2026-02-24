import type { Backstory } from '../../../types/species';

export const WHITE_TAILED_DEER_BACKSTORIES: Backstory[] = [
  {
    type: 'rehabilitation',
    label: 'Rehabilitated & Released',
    description: 'You were found injured as a fawn and nursed back to health at a wildlife rehabilitation center before being released into the wild.',
    monthsSinceEvent: 11,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'NOV', amount: 15 },
      { stat: 'WIS', amount: -10 },
      { stat: 'ADV', amount: -5 },
    ],
  },
  {
    type: 'wild-born',
    label: 'Wild Born',
    description: 'You were born in the forest and raised by your mother until she was taken by predators. You have survived on your own since.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'TRA', amount: 5 },
      { stat: 'ADV', amount: 10 },
    ],
  },
  {
    type: 'orphaned',
    label: 'Orphaned Young',
    description: 'Your mother was killed by hunters when you were only a few months old. You barely survived your first winter alone.',
    monthsSinceEvent: 8,
    statAdjustments: [
      { stat: 'TRA', amount: 20 },
      { stat: 'ADV', amount: 15 },
      { stat: 'WIS', amount: 5 },
      { stat: 'HEA', amount: -10 },
    ],
  },
];
