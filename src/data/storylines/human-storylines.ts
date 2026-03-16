import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';

/** Phase 7: Human encounter story arcs. */
export const HUMAN_STORYLINES: StorylineDefinition[] = [
  // ── Habitat Development Arc ──
  {
    id: 'habitat-development',
    name: 'The Encroachment',
    speciesIds: [],
    startConditions: [],
    startChance: 0.06,
    tags: ['human', 'environmental'],
    steps: [
      {
        id: 'development-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'A low grinding sound carries from the edge of {{region.name}}. Trees crack and fall. A large yellow shape moves across the ground, scraping soil bare. The smell is diesel and raw earth.',
        statEffects: [
          { stat: StatId.NOV, amount: 8, duration: 4, label: '+NOV (unfamiliar machinery)' },
          { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV (new threat)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'storyline-development-started' },
        ],
        completionFlag: 'storyline-development-started',
      },
      {
        id: 'development-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'Where open ground and trees stood, hard flat surfaces and straight barriers now block your path. The usable range has shrunk. Other animals press into what remains, and food is harder to find.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, duration: 6, label: '+HOM (habitat loss)' },
          { stat: StatId.ADV, amount: 6, duration: 4, label: '+ADV (overcrowding)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-development-disrupted',
      },
      {
        id: 'development-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'Your routes have shifted around the hard surfaces. New food grows along the edges where cleared ground meets cover. You know which areas carry human scent and avoid them.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, duration: 4, label: '+WIS (adaptation)' },
          { stat: StatId.HOM, amount: -8, duration: 4, label: '-HOM (new normal)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-development-started' },
        ],
        completionFlag: 'storyline-development-adapted',
      },
    ],
  },

  // ── Conservation Intervention Arc ──
  {
    id: 'conservation-intervention',
    name: 'The Researchers',
    speciesIds: [],
    startConditions: [
      { type: 'age_range', min: 12 },
    ],
    startChance: 0.05,
    tags: ['human'],
    steps: [
      {
        id: 'conservation-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Humans appear in {{region.name}}, moving slowly, carrying objects that click and hum. They attach small boxes to trees and leave without chasing anything. They smell of metal and plastic.',
        statEffects: [
          { stat: StatId.ADV, amount: 6, duration: 3, label: '+ADV (human presence)' },
          { stat: StatId.NOV, amount: 5, duration: 3, label: '+NOV (new activity)' },
        ],
        consequences: [],
        completionFlag: 'storyline-conservation-noticed',
      },
      {
        id: 'conservation-2',
        delayMin: 3,
        delayMax: 7,
        narrativeText: 'New water pools have appeared, clean and full. Gaps between patches of cover are easier to cross now. Prey and forage are more abundant near these changes.',
        statEffects: [
          { stat: StatId.HEA, amount: 5, duration: 6, label: '+HEA (improved habitat)' },
          { stat: StatId.HOM, amount: -5, duration: 4, label: '-HOM (better connectivity)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        completionFlag: 'storyline-conservation-improved',
      },
    ],
  },

  // ── Pollution Event Arc ──
  {
    id: 'pollution-event',
    name: 'The Spill',
    speciesIds: [],
    startConditions: [],
    startChance: 0.04,
    tags: ['human', 'environmental', 'danger'],
    steps: [
      {
        id: 'pollution-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The water tastes wrong, sharp and chemical. An oily film sits on the surface. Dead fish float belly-up near the bank. Other animals that drank here stagger and fall.',
        statEffects: [
          { stat: StatId.HEA, amount: -10, duration: 4, label: '-HEA (contamination)' },
          { stat: StatId.TRA, amount: 10, duration: 4, label: '+TRA (poisoned habitat)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
          { type: 'set_flag', flag: 'storyline-pollution-active' },
        ],
        completionFlag: 'storyline-pollution-started',
      },
      {
        id: 'pollution-2',
        delayMin: 3,
        delayMax: 7,
        narrativeText: 'Humans in white coverings place barriers across the water and press absorbent material into the banks. The chemical smell weakens. Some animals have left the area. Others lie still.',
        statEffects: [
          { stat: StatId.HEA, amount: 5, duration: 4, label: '+HEA (cleanup beginning)' },
          { stat: StatId.TRA, amount: -6, duration: 4, label: '-TRA (humans helping)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 1 },
        ],
        completionFlag: 'storyline-pollution-cleanup',
      },
      {
        id: 'pollution-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'The chemical taste in the water is faint now. New growth pushes through the damaged ground. Other animals are returning, cautious, testing the water before drinking.',
        statEffects: [
          { stat: StatId.HEA, amount: 5, duration: 4, label: '+HEA (recovery)' },
          { stat: StatId.TRA, amount: -5, duration: 4, label: '-TRA (healing land)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-pollution-active' },
        ],
        completionFlag: 'storyline-pollution-resolved',
      },
    ],
  },
];
