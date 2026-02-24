import type { Backstory } from '../../../types/species';

export const GRAY_WOLF_BACKSTORIES: Backstory[] = [
  {
    type: 'pack-raised',
    label: 'Pack-Raised',
    description: 'Born into a stable pack, now a young adult preparing to find your place in the hierarchy. You have watched the alpha pair hunt, discipline, and lead, and carry their lessons in your bones.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'WIS', amount: 5 },
      { stat: 'TRA', amount: -5 },
    ],
  },
  {
    type: 'lone-wolf',
    label: 'Lone Wolf',
    description: 'Dispersed from your natal pack a year ago. Surviving alone, searching for territory and a mate. Every hunt is a gamble without packmates, every night a vigil without sentries.',
    monthsSinceEvent: 12,
    statAdjustments: [
      { stat: 'ADV', amount: 10 },
      { stat: 'NOV', amount: 10 },
      { stat: 'WIS', amount: -5 },
    ],
  },
  {
    type: 'rescued-pup',
    label: 'Rescued Pup',
    description: 'Raised by wildlife rehabilitators after your pack was destroyed by a livestock depredation order. Released into unfamiliar territory with no pack, no territory, and no instinct sharpened by a mother\'s teaching.',
    monthsSinceEvent: 2,
    statAdjustments: [
      { stat: 'NOV', amount: 15 },
      { stat: 'TRA', amount: 10 },
      { stat: 'WIS', amount: -10 },
      { stat: 'IMM', amount: -5 },
    ],
  },
];
