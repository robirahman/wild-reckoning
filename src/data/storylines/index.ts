import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';
import { HUMAN_STORYLINES } from './human-storylines';
import { SEASONAL_STORYLINES } from './seasonal-arcs';
import { SPECIES_STORYLINES } from './species-arcs';
import { DECISION_ARC_STORYLINES } from './decision-arcs';

export const STORYLINES: StorylineDefinition[] = [
  ...HUMAN_STORYLINES,
  ...SEASONAL_STORYLINES,
  ...SPECIES_STORYLINES,
  ...DECISION_ARC_STORYLINES,
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
        narrativeText: 'The creek bed is dry, soil cracked and powdery underfoot. The remaining water sources smell of concentrated mud and crowded bodies.',
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
        narrativeText: 'Vegetation across {{region.name}} is brown and brittle. Your sides feel hollow, ribs prominent. Every feeding spot has others already there.',
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
        narrativeText: 'The smell of rain arrives before the drops. Water falls heavy across {{region.name}}, soaking the cracked ground. Within days, green shoots push through the wet soil.',
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
        narrativeText: 'Fresh cuts in the bark of trees, straight and deliberate. Not from any animal. The scent of humans is recent but the timing is wrong.',
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
        narrativeText: 'A sharp crack echoes through the trees, close. An engine growls where no road runs. Another of your kind lies dead nearby, body still warm, part of it cut away.',
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
        narrativeText: 'Different humans move through {{region.name}} now, their crackling devices audible from a distance. The engine sounds and sharp cracks have stopped. Normal sounds return.',
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
        narrativeText: 'At water sources, others in your {{species.groupNoun}} wait for you to drink first. When you move, the younger ones follow your path.',
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
        narrativeText: 'The usual watering hole is occupied by a rival group. The {{species.groupNoun}} clusters behind you. You turn toward a route you remember from a previous dry season, and they follow.',
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
        narrativeText: 'The current strengthens. Water churns white over rocks, slamming your body sideways. Others around you leap and fall back, leap and fall back.',
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
        narrativeText: 'A wall of hard gray material blocks the river. A narrow channel of cascading water offers the only way up. You throw your body against the flow, fall back, throw again.',
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
        narrativeText: 'Ice crusts over the snow across {{region.name}}. The food beneath it is unreachable. You scrape at the frozen surface and find nothing.',
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
        narrativeText: 'The {{species.groupNoun}} packs into sheltered ground, stripping bark from every reachable stem. Your body burns its own reserves. Some of the group no longer stand in the morning.',
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
        narrativeText: 'Warm air moves across {{region.name}}. Meltwater runs in channels through the softening ground. Green shoots push through. The {{species.groupNoun}} moves out from the sheltered ground, thin but standing.',
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
        narrativeText: 'Smoke hangs in the air over {{region.name}}, acrid and thickening. Other animals move past you in the same direction, away from something. The air burns in your nostrils.',
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
        narrativeText: 'Heat and noise hit at once. The fire is a wall of orange across {{region.name}}. Embers fall from a dark sky. You run through choking smoke, every familiar path blocked or burning.',
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
        narrativeText: 'Unfamiliar ground. The scent trails here belong to others. Water sources and resting sites are in new places. You circle, sample the air, begin to learn the layout.',
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
        narrativeText: 'The watering holes of {{region.name}} are shrinking, muddy rims cracking in the heat. Dust blows across the dry floodplain. The {{species.groupNoun}} clusters at the diminishing pools, bodies tense.',
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
        narrativeText: 'The oldest female raises her trunk, sampling the dry wind. She turns and walks. The {{species.groupNoun}} follows, moving across parched ground on a route none of you have traveled before.',
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
        narrativeText: 'In a rocky gorge, water seeps from the stone, cool and clean. The {{species.groupNoun}} drinks. The youngest ones splash and wade for the first time in weeks.',
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
        narrativeText: 'Boot prints press into the red earth near the river crossing. Small metal cylinders glint in the dirt. The air carries diesel and a sharp chemical smell. The {{species.groupNoun}} goes quiet, trunks raised.',
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
        narrativeText: 'A sharp crack at dawn. One of the older bulls drops. The {{species.groupNoun}} trumpets, high and loud, then runs in a tight cluster, bodies pressing together.',
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
        narrativeText: 'A low droning sound overhead, steady and repeating. Different humans move through the bush, radios crackling. The dangerous scent fades over days. The {{species.groupNoun}} spreads out again, the youngest ones ranging farther from the adults.',
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
        narrativeText: 'A massive shadow passes above. Black and white, fast. The school explodes outward, bodies scattering in every direction, water churning with the force of it.',
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
        narrativeText: 'The large shapes move off, following warmer currents. Survivors drift back together in the cold green water, fewer now. The pressure in the water column returns to normal.',
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
        narrativeText: 'The gravel bed is packed with bodies, red and battered, pushing for position. You need clean gravel with steady current. Others keep shoving into the same spot.',
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
        narrativeText: 'The redd is yours. Your tail sweeps gravel aside, hollowing a depression in the streambed. Eggs release into the cool, oxygen-rich current. Your body is spent.',
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
