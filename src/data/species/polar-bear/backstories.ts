import type { Backstory } from '../../../types/species';

export const POLAR_BEAR_BACKSTORIES: Backstory[] = [
  {
    type: 'wild-born',
    label: 'Wild-Born Sub-Adult',
    description:
      'Your mother taught you everything: how to wait motionless at a breathing hole for hours, how to read the wind for seal scent, how to test ice with a careful forepaw before committing your weight. Six months ago she drove you away with snarls and cuffs, ready to mate again. You are alone now on the ice of Hudson Bay, and every skill she gave you will be tested.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'WIS', amount: 5 },
      { stat: 'NOV', amount: -5 },
    ],
  },
  {
    type: 'orphaned-cub',
    label: 'Orphaned Cub',
    description:
      'Your mother broke through thinning ice while crossing a lead between floes. You watched her struggle, her claws scraping uselessly on the crumbling edge, until the dark water took her. You were barely two years old. Since then you have survived on scraps \u2014 a frozen fish carcass, kelp torn from the shoreline, garbage from a distant camp. The trauma is etched into your bones, but it has made you relentless.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'TRA', amount: 12 },
      { stat: 'NOV', amount: 15 },
      { stat: 'WIS', amount: -8 },
    ],
  },
  {
    type: 'satellite-tagged',
    label: 'Satellite-Tagged',
    description:
      'You woke from a drugged haze with a strange weight around your neck \u2014 a GPS collar fitted by researchers who tracked you from a helicopter. The chemical immobilization left you groggy for days, and the collar chafes when the wind is sharp. But you are four years old and strong, and the ice is forming. Somewhere, scientists are watching a dot on a screen that is you.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'ADV', amount: 5 },
      { stat: 'HOM', amount: 5 },
    ],
  },
];
