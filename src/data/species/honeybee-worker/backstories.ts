import type { Backstory } from '../../../types/species';

export const HONEYBEE_WORKER_BACKSTORIES: Backstory[] = [
  {
    type: 'spring-brood',
    label: 'Spring Brood',
    description: 'You emerged from your cell in April, when the colony is expanding rapidly. The queen is laying 2,000 eggs a day and every worker is needed. Nectar is flowing, pollen is abundant, and the hive hums with optimism. You are one of thousands born this week.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: 5 },
      { stat: 'WIS', amount: 3 },
    ],
  },
  {
    type: 'summer-brood',
    label: 'Summer Brood',
    description: 'You emerged in the peak of summer when the colony is at maximum strength — 60,000 workers. But summer broods live hard and die fast. The foragers before you wore their wings to translucent stubs in three weeks. The flowers are abundant but so are the pesticides, the predators, and the heat.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HOM', amount: 8 },
      { stat: 'ADV', amount: 5 },
      { stat: 'HEA', amount: -3 },
    ],
  },
  {
    type: 'winter-brood',
    label: 'Winter Brood',
    description: 'You are a winter bee — born in October when the colony is preparing for the cold months. Unlike your summer sisters who live six weeks, you may survive five months. Your body is packed with fat reserves and vitellogenin. The colony needs you to form the winter cluster, vibrating your flight muscles to keep the queen warm through the frozen months ahead.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'CLI', amount: 10 },
      { stat: 'HEA', amount: 5 },
      { stat: 'ADV', amount: -3 },
    ],
  },
];
