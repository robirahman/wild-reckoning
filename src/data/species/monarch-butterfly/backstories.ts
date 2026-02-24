import type { Backstory } from '../../../types/species';

export const MONARCH_BUTTERFLY_BACKSTORIES: Backstory[] = [
  {
    type: 'wild-hatched',
    label: 'Wild-Hatched',
    description: 'Your mother laid you as a single pale egg on the underside of a milkweed leaf in a Michigan meadow. You hatched into a world of green — a tiny caterpillar no bigger than a grain of rice, alone on your leaf. The milkweed is your entire universe: food, shelter, and the poison that will one day protect you.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 5 },
      { stat: 'HEA', amount: 5 },
    ],
  },
  {
    type: 'lab-hatched',
    label: 'Raised in a Butterfly House',
    description: 'You were born in a climate-controlled rearing chamber at a university research station, fed fresh milkweed cuttings by gloved hands. When you emerged from your chrysalis, they tagged your wing with a tiny sticker and released you into a garden. The world outside the lab is vast, unpredictable, and nothing like the gentle warmth you knew.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'NOV', amount: 20 },
      { stat: 'TRA', amount: 8 },
      { stat: 'WIS', amount: -8 },
      { stat: 'IMM', amount: -8 },
    ],
  },
  {
    type: 'generation-4',
    label: 'The Migratory Generation',
    description: 'You are the fourth generation born this year — the special one. Your parents, grandparents, and great-grandparents each lived only weeks, breeding and dying in the meadows where they hatched. But something is different about you. The shortening days triggered a change: your reproductive organs remain dormant, your body stores fat instead of making eggs, and deep in your cells, an ancient compass is switching on. You will live eight months instead of four weeks. You will fly to a place you have never been. You carry the memory of a forest in Mexico that no living monarch has ever seen.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'HEA', amount: 8 },
      { stat: 'ADV', amount: 5 },
    ],
  },
];
