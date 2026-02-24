import type { Backstory } from '../../../types/species';

export const CHINOOK_SALMON_BACKSTORIES: Backstory[] = [
  {
    type: 'hatchery-raised',
    label: 'Hatchery-Raised',
    description: 'You were spawned in a concrete raceway at a federal fish hatchery, fed pellets on a timer, and released into the river with thousands of your siblings. The ocean was a shock — vast, cold, and nothing like the tank you knew. You still carry the clipped adipose fin that marks you as hatchery stock.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'NOV', amount: 15 },
      { stat: 'WIS', amount: -10 },
      { stat: 'HEA', amount: 5 },
    ],
  },
  {
    type: 'wild-spawned',
    label: 'Wild-Spawned',
    description: 'You hatched in the gravel of a cold mountain stream, one of thousands of eggs your mother buried before she died. You survived the alevin stage, emerged as a fry, and fought your way downstream to the ocean. Everything you know, you learned the hard way.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'ADV', amount: 10 },
    ],
  },
  {
    type: 'transplanted-stock',
    label: 'Transplanted Stock',
    description: 'You were captured as a smolt and trucked to a new watershed as part of a restoration program. The water here tastes different — wrong, somehow — and you have no ancestral memory of these rivers. But you are alive, and the ocean does not care where you came from.',
    monthsSinceEvent: 3,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'NOV', amount: 10 },
      { stat: 'HEA', amount: -5 },
    ],
  },
];
