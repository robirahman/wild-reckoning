import type { Backstory } from '../../../types/species';

export const POISON_DART_FROG_BACKSTORIES: Backstory[] = [
  {
    type: 'bromeliad-raised',
    label: 'Bromeliad-Raised',
    description: 'You grew up in a healthy bromeliad pool high in the canopy, fed unfertilized eggs by an attentive mother who visited every few days without fail. The pool was clean, the water warm, and no predatory insects shared your tiny world. You metamorphosed strong and well-nourished, dropping to the forest floor with a full belly and healthy skin. You have never known scarcity.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: 8 },
      { stat: 'WIS', amount: 5 },
    ],
  },
  {
    type: 'forest-floor-hatched',
    label: 'Forest Floor Hatched',
    description: 'Your eggs were laid on a leaf on the forest floor. When you hatched, your father carried you on his back up a tree trunk and deposited you in a small bromeliad pool. But the pool was shared with another tadpole, and food was scarce. You survived by being aggressive and adaptable, but you emerged from metamorphosis smaller and hungrier than most.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'ADV', amount: 8 },
      { stat: 'TRA', amount: 6 },
      { stat: 'HEA', amount: -5 },
    ],
  },
  {
    type: 'captive-bred',
    label: 'Captive-Bred',
    description: 'You were raised in a glass vivarium under artificial lights, fed fruit flies dusted with calcium powder. You never tasted the alkaloid-rich ants that wild frogs depend on for their chemical defenses. When you were released into the forest as part of a conservation program, your skin held no poison. You are curious and unafraid of novelty, but the rainforest is nothing like a terrarium, and predators can taste that you are harmless.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'NOV', amount: 10 },
      { stat: 'IMM', amount: -8 },
      { stat: 'WIS', amount: 5 },
    ],
  },
];
