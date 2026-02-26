import type { Backstory } from '../../../../types/species';

export const CHICKEN_BACKSTORIES: Backstory[] = [
  {
    type: 'broiler',
    label: 'Industrial Broiler',
    description: 'Bred for maximum meat production, your body grows so fast your bones can barely support your weight.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: -15 },
      { stat: 'IMM', amount: -10 },
    ],
  },
  {
    type: 'layer',
    label: 'Battery Layer',
    description: 'Destined for a life in a cage, provided you were born female.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: -10 },
      { stat: 'TRA', amount: 20 },
    ],
  },
];
