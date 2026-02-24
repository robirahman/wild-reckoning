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
        narrativeText: 'Strange sounds carry on the wind — the growl of engines and the crack of falling trees. On the horizon, a yellow machine crawls across the earth, scraping the ground bare. Humans are building something at the edge of {{region.name}}.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA (construction noise)' },
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
        narrativeText: 'The construction has transformed the landscape. Where meadow and forest once stood, there are now rectangular structures, paved surfaces, and fences. The usable habitat has shrunk noticeably. Other animals crowd into the remaining space, increasing competition for food and shelter.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, duration: 6, label: '+HOM (habitat loss)' },
          { stat: StatId.TRA, amount: 6, duration: 4, label: '+TRA (crowding)' },
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
        narrativeText: 'Months have passed, and the new development has become part of the landscape. You have adjusted your routes, found new food sources in the edge habitat between wild and developed land, and learned which human areas to avoid. Life continues, diminished but adapted.',
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
        narrativeText: 'Humans have been appearing in {{region.name}} — not hunters, but quiet figures who move slowly, carry strange devices, and leave without taking anything. They set up small boxes on trees and drop objects that smell faintly of metal. Their presence is unsettling but not dangerous.',
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
        narrativeText: 'The humans have been busy. New water sources have appeared — clean pools that did not exist before. Certain pathways between fragmented habitat are suddenly easier to traverse. It is as if someone is redesigning the landscape with your needs in mind. The food web is responding; prey is more abundant near these interventions.',
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
        narrativeText: 'Something is wrong with the water. It carries an acrid chemical taste and a thin oily sheen. Fish float belly-up near the banks. Birds that drank here are stumbling, disoriented. A spill — from a truck, a pipeline, a factory — has poisoned a section of {{region.name}}.',
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
        narrativeText: 'Humans in white suits have arrived — containment booms across the water, absorbent pads on the banks. The worst of the contamination is being cleaned up, but the damage to the ecosystem will linger. Some species have fled; others were not so lucky.',
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
        narrativeText: 'The visible contamination is gone, but the soil and water carry traces that will persist for years. The ecosystem is recovering — slowly, incompletely, but recovering. New growth pushes through where the worst damage occurred, and wildlife is cautiously returning.',
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
