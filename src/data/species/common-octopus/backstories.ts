import type { Backstory } from '../../../types/species';

export const COMMON_OCTOPUS_BACKSTORIES: Backstory[] = [
  {
    type: 'reef-hatched',
    label: 'Reef-Hatched',
    description: 'You hatched from one of 200,000 eggs in a rocky den off the Mediterranean coast. Your mother guarded the clutch for four months without eating, gently aerating the eggs with her siphon until they hatched. She died the day you emerged. You spent your first weeks drifting as a paralarva in the plankton before settling on a rocky reef. You are healthy, curious, and entirely on your own.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: 8 },
      { stat: 'WIS', amount: 5 },
    ],
  },
  {
    type: 'tide-pool-survivor',
    label: 'Tide Pool Survivor',
    description: 'A storm surge swept you into a tide pool when you were barely a month old. For three days you survived in the shrinking water, hunting tiny shrimp and hiding from gulls under a rock ledge. When the next high tide reconnected you to the sea, you had already learned that survival means adapting to what the world gives you.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'ADV', amount: 8 },
      { stat: 'HEA', amount: -3 },
    ],
  },
  {
    type: 'lab-escaped',
    label: 'Lab Escapee',
    description: 'You were captured young and kept in a research aquarium for behavioral studies. You learned to open jars, navigate mazes, and recognize individual human faces. One night you pushed the lid off your tank, crawled across the lab floor, and squeezed through a drain pipe to the sea. You are more experienced with novelty than any wild octopus, but the open ocean is nothing like a tank.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'NOV', amount: 12 },
      { stat: 'WIS', amount: -5 },
      { stat: 'ADV', amount: 5 },
    ],
  },
];
