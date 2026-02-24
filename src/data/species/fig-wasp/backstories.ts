import type { Backstory } from '../../../types/species';

export const FIG_WASP_BACKSTORIES: Backstory[] = [
  {
    type: 'healthy-fig',
    label: 'Healthy Natal Fig',
    description: 'Your mother entered a large, healthy Ficus aurea syconium at the peak of the fruiting season. The fig was well-pollinated, nutrient-rich, and free of parasitoids. Your gall developed perfectly — a pocket of fig tissue calibrated to sustain you through metamorphosis. You are one of the lucky ones.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: 8 },
      { stat: 'WIS', amount: 5 },
    ],
  },
  {
    type: 'stressed-fig',
    label: 'Drought-Stressed Natal Fig',
    description: 'The strangler fig that houses you is stressed — a dry winter reduced its water supply, and the syconium you developed in is smaller and less nutritious than it should be. Your gall received fewer nutrients. You are smaller, but you are alive, and the coming rains may bring better figs.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HOM', amount: 10 },
      { stat: 'ADV', amount: 8 },
      { stat: 'HEA', amount: -5 },
    ],
  },
  {
    type: 'crowded-gall',
    label: 'Crowded Syconium',
    description: 'Two foundress females entered your natal fig — twice the normal number. The result is a crowded syconium with too many larvae competing for too few ovules. Your gall is smaller than average, pressed against your siblings\' galls. Resources are thin. But the crowding also means more males, more tunnels, and a better chance that at least some females will escape.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'ADV', amount: 12 },
      { stat: 'TRA', amount: 5 },
      { stat: 'HEA', amount: -3 },
      { stat: 'WIS', amount: 3 },
    ],
  },
];
