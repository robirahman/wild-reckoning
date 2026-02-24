import type { Backstory } from '../../../types/species';

export const AFRICAN_ELEPHANT_BACKSTORIES: Backstory[] = [
  {
    type: 'orphaned-by-poachers',
    label: 'Orphaned by Poachers',
    description:
      'Your mother was killed by poachers when you were barely four years old. A wildlife sanctuary rescued you, hand-rearing you with formula and the company of other orphans. You have been released back into the wild, but the savanna is nothing like the sanctuary.',
    monthsSinceEvent: 24,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'NOV', amount: 15 },
      { stat: 'WIS', amount: -10 },
    ],
  },
  {
    type: 'wild-born',
    label: 'Wild-Born Matriarchal',
    description:
      'You were born into a strong matriarchal herd led by an experienced grandmother. She taught you which waterholes are safe in the dry season, where the best browse grows after the rains, and how to read the intentions of lions at a distance. You carry her wisdom in your bones.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'HEA', amount: 5 },
      { stat: 'TRA', amount: 5 },
    ],
  },
  {
    type: 'translocated',
    label: 'Translocated',
    description:
      'You were captured and relocated from a conflict zone where elephants and farmers clashed daily. The translocation was traumatic \u2014 the helicopter, the sedation, waking in a strange place \u2014 but you are alive. This new range is unfamiliar, and you must learn its rhythms from scratch.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'ADV', amount: 10 },
      { stat: 'TRA', amount: 10 },
      { stat: 'NOV', amount: 10 },
      { stat: 'HEA', amount: -5 },
    ],
  },
];
