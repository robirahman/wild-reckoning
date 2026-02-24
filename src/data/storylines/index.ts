import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';

export const STORYLINES: StorylineDefinition[] = [
  // ── Drought Arc (white-tailed deer) ──
  {
    id: 'drought-arc',
    name: 'The Drought',
    speciesIds: ['white-tailed-deer'],
    startConditions: [
      { type: 'season', seasons: ['summer'] },
    ],
    startChance: 0.15,
    tags: ['environmental'],
    steps: [
      {
        id: 'drought-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The creek bed where you usually drink has gone dry. The soil is cracked and dusty. Other deer congregate nervously at the few remaining water sources.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, duration: 4, label: '+TRA (drought stress)' },
        ],
        consequences: [],
        completionFlag: 'storyline-drought-started',
      },
      {
        id: 'drought-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The drought deepens. Vegetation has withered across {{region.name}}. Competition for the remaining forage is fierce. You can feel your ribs showing through your coat.',
        statEffects: [
          { stat: StatId.HEA, amount: -8, duration: 4, label: '-HEA (drought)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -5 },
        ],
        completionFlag: 'storyline-drought-deepened',
      },
      {
        id: 'drought-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'Finally, dark clouds gather on the horizon. The first rain in weeks falls heavily across {{region.name}}. Within days, the forest begins to recover. Green shoots push through the parched earth.',
        statEffects: [
          { stat: StatId.HEA, amount: 10, duration: 4, label: '+HEA (rain relief)' },
          { stat: StatId.TRA, amount: -8, duration: 4, label: '-TRA (relief)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'remove_flag', flag: 'storyline-drought-started' },
          { type: 'remove_flag', flag: 'storyline-drought-deepened' },
        ],
        completionFlag: 'storyline-drought-resolved',
      },
    ],
  },

  // ── Poacher Arc (white-tailed deer) ──
  {
    id: 'poacher-arc',
    name: 'The Poacher',
    speciesIds: ['white-tailed-deer'],
    startConditions: [
      { type: 'age_range', min: 12 },
    ],
    startChance: 0.08,
    tags: ['danger'],
    steps: [
      {
        id: 'poacher-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'You notice strange markings on the trees — blazes cut into bark, not by any animal. The scent of humans lingers, but this is outside hunting season. Something feels wrong.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV (alertness)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'storyline-poacher-alert' },
        ],
        completionFlag: 'storyline-poacher-started',
      },
      {
        id: 'poacher-2',
        delayMin: 2,
        delayMax: 5,
        narrativeText: 'A gunshot echoes through the forest, far closer than any hunting blind. You hear a vehicle engine where no road exists. Another deer in your area has been found dead — cleanly shot, antlers removed.',
        statEffects: [
          { stat: StatId.TRA, amount: 10, duration: 6, label: '+TRA (poacher threat)' },
          { stat: StatId.ADV, amount: 8, duration: 4, label: '+ADV (hypervigilance)' },
        ],
        consequences: [],
        completionFlag: 'storyline-poacher-escalated',
      },
      {
        id: 'poacher-3',
        delayMin: 3,
        delayMax: 7,
        narrativeText: 'Game wardens have been patrolling {{region.name}}. You hear their radios crackling through the trees. The illegal activity seems to have stopped. The forest gradually returns to its normal rhythms.',
        statEffects: [
          { stat: StatId.TRA, amount: -6, duration: 4, label: '-TRA (safety returns)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-poacher-alert' },
        ],
        completionFlag: 'storyline-poacher-resolved',
      },
    ],
  },

  // ── Herd Leadership Arc (african elephant) ──
  {
    id: 'herd-leadership',
    name: 'Herd Leadership',
    speciesIds: ['african-elephant'],
    startConditions: [
      { type: 'age_range', min: 24 },
      { type: 'stat_above', stat: StatId.WIS, threshold: 50 },
    ],
    startChance: 0.1,
    tags: ['social'],
    steps: [
      {
        id: 'leadership-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The older members of your {{species.groupNoun}} have begun deferring to you at water sources. Younger elephants follow your lead when choosing paths through the bush.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, duration: 8, label: '+WIS (emerging leader)' },
        ],
        consequences: [],
        completionFlag: 'storyline-leadership-noticed',
      },
      {
        id: 'leadership-2',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'A crisis faces the herd: the usual watering hole has been claimed by a rival group. The others look to you. Your memory of an alternate route from seasons past guides the {{species.groupNoun}} safely to water.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, duration: 6, label: '+HOM (herd bond)' },
          { stat: StatId.WIS, amount: 5, duration: 6, label: '+WIS (proven leader)' },
        ],
        consequences: [],
        completionFlag: 'storyline-leadership-proven',
      },
    ],
  },

  // ── Upstream Migration Arc (chinook salmon) ──
  {
    id: 'upstream-challenge',
    name: 'The Upstream Challenge',
    speciesIds: ['chinook-salmon'],
    startConditions: [
      { type: 'has_flag', flag: 'freshwater-entered' },
    ],
    startChance: 0.2,
    tags: ['environmental'],
    steps: [
      {
        id: 'upstream-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The river narrows ahead into a series of rapids. The water churns white over jagged rocks. Other salmon leap and struggle against the current around you.',
        statEffects: [
          { stat: StatId.STR, amount: -5, duration: 3, label: '-STR (exhausting rapids)' },
        ],
        consequences: [],
        completionFlag: 'storyline-rapids-entered',
      },
      {
        id: 'upstream-2',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'A concrete dam blocks the river. A fish ladder offers a narrow passage, but the climb is brutal. You throw yourself against the cascading water again and again until you clear the top.',
        statEffects: [
          { stat: StatId.STR, amount: -10, duration: 4, label: '-STR (dam crossing)' },
          { stat: StatId.HEA, amount: -5, duration: 3, label: '-HEA (exhaustion)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        completionFlag: 'storyline-dam-crossed',
      },
    ],
  },
];
