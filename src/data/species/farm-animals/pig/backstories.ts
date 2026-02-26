import type { Backstory } from '../../../../types/species';

export const PIG_BACKSTORIES: Backstory[] = [
  {
    type: 'industrial-sow',
    label: 'Industrial Sow',
    description: 'You are kept in the breeding cycle. Your life is an endless series of pregnancies and weaning, mostly confined to crates.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: -20 },
      { stat: 'TRA', amount: 30 },
      { stat: 'IMM', amount: -10 },
    ],
  },
  {
    type: 'grower-pig',
    label: 'Grower Pig',
    description: 'Bred for rapid weight gain, your destiny is the slaughterhouse in just a few months.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: -10 },
      { stat: 'NOV', amount: -10 },
      { stat: 'HEA', amount: -5 },
    ],
  },
];
