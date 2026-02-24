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

  // ── Winter Survival Arc (white-tailed deer) ──
  {
    id: 'winter-survival',
    name: 'The Hard Winter',
    speciesIds: ['white-tailed-deer'],
    startConditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    startChance: 0.12,
    tags: ['environmental', 'seasonal'],
    steps: [
      {
        id: 'winter-survival-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'An early freeze descends upon {{region.name}}, glazing the snow with a brittle crust of ice. Beneath it, the browse you depend on lies buried and unreachable. The {{species.groupNoun}} paws at the frozen ground in vain.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA (early freeze)' },
          { stat: StatId.CLI, amount: 6, duration: 4, label: '+CLI (bitter cold)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-winter-started',
      },
      {
        id: 'winter-survival-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'Deep winter tightens its grip. Starvation pressure builds as the {{species.groupNoun}} crowds into yarding areas, stripping bark from every reachable sapling. The weakest among you have stopped rising at dawn.',
        statEffects: [
          { stat: StatId.HEA, amount: -10, duration: 4, label: '-HEA (starvation)' },
          { stat: StatId.HOM, amount: 10, duration: 4, label: '+HOM (yarding bond)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -5 },
        ],
        completionFlag: 'storyline-winter-deepened',
      },
      {
        id: 'winter-survival-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'A warm front rolls across {{region.name}} at last, and the ice retreats in rivulets of meltwater. The first green shoots push through the softening earth. The {{species.groupNoun}} emerges from the yarding grounds gaunt and hollowed, but alive.',
        statEffects: [
          { stat: StatId.HEA, amount: 12, duration: 4, label: '+HEA (spring recovery)' },
          { stat: StatId.TRA, amount: -10, duration: 4, label: '-TRA (thaw relief)' },
          { stat: StatId.CLI, amount: -8, duration: 4, label: '-CLI (warming)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 4 },
          { type: 'remove_flag', flag: 'storyline-winter-started' },
          { type: 'remove_flag', flag: 'storyline-winter-deepened' },
        ],
        completionFlag: 'storyline-winter-resolved',
      },
    ],
  },

  // ── Fire Season Arc (white-tailed deer) ──
  {
    id: 'fire-season',
    name: 'Fire Season',
    speciesIds: ['white-tailed-deer'],
    startConditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    startChance: 0.08,
    tags: ['environmental', 'danger'],
    steps: [
      {
        id: 'fire-season-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'A pale haze settles over {{region.name}}, and the air carries the acrid tang of distant smoke. Birds wheel overhead in confused spirals. Other animals — raccoons, rabbits, a lone coyote — stream past you, fleeing something you cannot yet see.',
        statEffects: [
          { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV (smoke alert)' },
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA (flight instinct)' },
        ],
        consequences: [],
        completionFlag: 'storyline-fire-detected',
      },
      {
        id: 'fire-season-2',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'The fire reaches {{region.name}} in a roaring wall of orange and black. Embers rain from a darkened sky. You run blindly through choking smoke, leaping fallen timber, driven from every familiar trail and bedding ground.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM (displacement)' },
          { stat: StatId.CLI, amount: 8, duration: 4, label: '+CLI (scorched land)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'displaced-by-fire' },
        ],
        completionFlag: 'storyline-fire-displaced',
      },
      {
        id: 'fire-season-3',
        delayMin: 5,
        delayMax: 10,
        narrativeText: 'Weeks of wandering bring you to unfamiliar territory — unburned forest with strange contours and new scent trails. The land is lush but alien. Slowly, you learn its rhythms, mapping new water sources and bedding sites.',
        statEffects: [
          { stat: StatId.NOV, amount: 6, duration: 4, label: '+NOV (new territory)' },
          { stat: StatId.TRA, amount: -6, duration: 4, label: '-TRA (settling in)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'displaced-by-fire' },
        ],
        completionFlag: 'storyline-fire-resolved',
      },
    ],
  },

  // ── Elephant Drought Arc (african elephant) ──
  {
    id: 'elephant-drought',
    name: 'The Long Dry',
    speciesIds: ['african-elephant'],
    startConditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    startChance: 0.12,
    tags: ['environmental'],
    steps: [
      {
        id: 'elephant-drought-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The watering holes of {{region.name}} are shrinking day by day, their muddy rims cracked into mosaics. Dust devils twist across the parched floodplain. The {{species.groupNoun}} gathers at the diminishing pools, uneasy and restless.',
        statEffects: [
          { stat: StatId.CLI, amount: 8, duration: 4, label: '+CLI (drought heat)' },
          { stat: StatId.HOM, amount: 6, duration: 4, label: '+HOM (water anxiety)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-elephant-drought-started',
      },
      {
        id: 'elephant-drought-2',
        delayMin: 3,
        delayMax: 7,
        narrativeText: 'The matriarch raises her trunk, testing a wind that carries no promise of rain. She turns and leads the {{species.groupNoun}} on a desperate march across the parched savanna, following a memory older than any living elephant — a route her grandmother once walked.',
        statEffects: [
          { stat: StatId.HEA, amount: -8, duration: 4, label: '-HEA (exhausting march)' },
          { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM (far from home)' },
          { stat: StatId.ADV, amount: 8, duration: 4, label: '+ADV (unknown terrain)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -6 },
        ],
        completionFlag: 'storyline-elephant-drought-march',
      },
      {
        id: 'elephant-drought-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'Deep in a rocky gorge that no map records, the matriarch finds what she was seeking: a hidden spring seeping from ancient stone, its water cool and sweet. The {{species.groupNoun}} drinks deeply, and for the first time in weeks, calves play at the water\'s edge.',
        statEffects: [
          { stat: StatId.HOM, amount: -15, duration: 4, label: '-HOM (sanctuary found)' },
          { stat: StatId.TRA, amount: -8, duration: 4, label: '-TRA (peace restored)' },
          { stat: StatId.WIS, amount: 8, duration: 6, label: '+WIS (ancestral knowledge)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 4 },
        ],
        completionFlag: 'storyline-elephant-drought-resolved',
      },
    ],
  },

  // ── Poaching Threat Arc (african elephant) ──
  {
    id: 'elephant-poaching-threat',
    name: 'The Poachers',
    speciesIds: ['african-elephant'],
    startConditions: [
      { type: 'age_range', min: 60 },
    ],
    startChance: 0.07,
    tags: ['danger'],
    steps: [
      {
        id: 'elephant-poaching-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Fresh boot prints scar the red earth near the river crossing, and the glint of spent shell casings catches the light. The {{species.groupNoun}} grows silent and wary, trunks raised to sample a breeze that reeks of diesel and gun oil.',
        statEffects: [
          { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV (human threat)' },
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA (poacher scent)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'poachers-nearby' },
        ],
        completionFlag: 'storyline-elephant-poaching-started',
      },
      {
        id: 'elephant-poaching-2',
        delayMin: 2,
        delayMax: 5,
        narrativeText: 'A crack splits the dawn — not thunder, but a rifle shot. One of the older bulls in the region falls, and the air fills with the anguished trumpeting of elephants who understand exactly what has happened. The {{species.groupNoun}} flees in a tight, terrified cluster.',
        statEffects: [
          { stat: StatId.TRA, amount: 15, duration: 6, label: '+TRA (herd member killed)' },
          { stat: StatId.ADV, amount: 12, duration: 4, label: '+ADV (mortal danger)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-elephant-poaching-escalated',
      },
      {
        id: 'elephant-poaching-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'The rhythmic drone of a patrol aircraft breaks the silence over {{region.name}}. Rangers in olive drab move through the bush, their radios crackling. Within days, the human threat dissolves. The {{species.groupNoun}} slowly unclenches, and calves begin to wander from their mothers\' sides again.',
        statEffects: [
          { stat: StatId.TRA, amount: -10, duration: 4, label: '-TRA (rangers present)' },
          { stat: StatId.ADV, amount: -8, duration: 4, label: '-ADV (threat removed)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'poachers-nearby' },
        ],
        completionFlag: 'storyline-elephant-poaching-resolved',
      },
    ],
  },

  // ── Ocean Predator Arc (chinook salmon) ──
  {
    id: 'ocean-predator-arc',
    name: 'The Hunting Pod',
    speciesIds: ['chinook-salmon'],
    startConditions: [],
    startChance: 0.10,
    tags: ['danger'],
    steps: [
      {
        id: 'ocean-predator-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'A shadow passes overhead — vast, black and white, moving with terrible purpose. The orca pod has found your school. The water erupts into chaos as salmon scatter in every direction, silver bodies flashing in panicked bursts of speed.',
        statEffects: [
          { stat: StatId.TRA, amount: 12, duration: 3, label: '+TRA (predator attack)' },
          { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV (orca presence)' },
        ],
        consequences: [],
        completionFlag: 'storyline-orca-attack',
      },
      {
        id: 'ocean-predator-2',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'The hunting pod moves on, following warmer currents to the north. The survivors drift back together in the cold green water, fewer now but still a school. The deep ocean resumes its uneasy quiet.',
        statEffects: [
          { stat: StatId.TRA, amount: -8, duration: 3, label: '-TRA (predators gone)' },
          { stat: StatId.ADV, amount: -6, duration: 3, label: '-ADV (danger passed)' },
        ],
        consequences: [],
        completionFlag: 'storyline-orca-resolved',
      },
    ],
  },

  // ── Spawning Grounds Arc (chinook salmon) ──
  {
    id: 'spawning-grounds-arc',
    name: 'The Final Journey',
    speciesIds: ['chinook-salmon'],
    startConditions: [
      { type: 'has_flag', flag: 'reached-spawning-grounds' },
    ],
    startChance: 0.25,
    tags: ['reproduction'],
    steps: [
      {
        id: 'spawning-grounds-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The gravel beds of the natal stream are crowded with salmon, their scarlet bodies jostling for position. You must claim the best nest site — clean gravel with steady current — and defend it against every rival who surges upstream.',
        statEffects: [
          { stat: StatId.ADV, amount: 8, duration: 3, label: '+ADV (nest competition)' },
          { stat: StatId.HOM, amount: 10, duration: 3, label: '+HOM (spawning drive)' },
        ],
        consequences: [],
        completionFlag: 'storyline-spawning-competition',
      },
      {
        id: 'spawning-grounds-2',
        delayMin: 1,
        delayMax: 3,
        narrativeText: 'The redd is yours. With powerful sweeps of your tail, you hollow out the gravel and deposit your eggs in the cool, oxygen-rich current. The ancient purpose that drove you thousands of miles is fulfilled at last.',
        statEffects: [
          { stat: StatId.WIS, amount: 10, duration: 4, label: '+WIS (purpose fulfilled)' },
          { stat: StatId.TRA, amount: -5, duration: 3, label: '-TRA (journey complete)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'spawning-arc-complete' },
        ],
        completionFlag: 'storyline-spawning-complete',
      },
    ],
  },
];
