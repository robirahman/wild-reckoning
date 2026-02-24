import type { Backstory } from '../../../types/species';

export const ARCTIC_TERN_BACKSTORIES: Backstory[] = [
  {
    type: 'colony-fledged',
    label: 'Colony Fledged',
    description: 'You fledged from a large, healthy colony on the Icelandic coast, raised by attentive parents who took turns guarding the nest and fishing. The colony\'s collective defense against skuas kept you safe during your most vulnerable weeks. You are strong, well-fed, and about to face the first great challenge of your life — the southward migration.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'HEA', amount: 8 },
      { stat: 'WIS', amount: 5 },
    ],
  },
  {
    type: 'first-year-migrant',
    label: 'First-Year Migrant',
    description: 'You survived your first migration south — a harrowing journey of 12,000 miles over open ocean. You arrived at the Antarctic feeding grounds thin and exhausted but alive. The journey taught you to read wind patterns, find fish in the open sea, and endure storms that would kill most birds. You are a year old and have already traveled farther than most animals will in a lifetime.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'TRA', amount: 8 },
      { stat: 'ADV', amount: 6 },
      { stat: 'HEA', amount: -3 },
    ],
  },
  {
    type: 'experienced-flyer',
    label: 'Experienced Flyer',
    description: 'Two years of pole-to-pole migrations have honed your instincts. You know which winds to ride, which currents hold fish, and which coastlines offer safe roosting. Your feathers are sleek, your navigation is precise, and you are ready to claim a nest site and find a mate for the first time.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'CLI', amount: 5 },
      { stat: 'ADV', amount: -3 },
    ],
  },
];
