import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';

/** Phase 13: Species-specific story arcs for new species. */
export const SPECIES_STORYLINES: StorylineDefinition[] = [
  // ── The Ink Cloud (common octopus) ──
  {
    id: 'ink-cloud-arc',
    name: 'The Ink Cloud',
    speciesIds: ['common-octopus'],
    startConditions: [
      { type: 'age_range', min: 4 },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    startChance: 0.10,
    tags: ['predator', 'danger'],
    steps: [
      {
        id: 'ink-cloud-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'A green head protrudes from a crevice near your den, jaws open, tasting the current. A moray eel. It does not leave. Its patrol loop passes your entrance.',
        statEffects: [
          { stat: StatId.ADV, amount: 10, duration: 4, label: '+ADV (moray nearby)' },
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA (predator threat)' },
        ],
        consequences: [],
        completionFlag: 'storyline-ink-cloud-moray-noticed',
      },
      {
        id: 'ink-cloud-2',
        delayMin: 3,
        delayMax: 5,
        narrativeText: 'The moray lunges as you return from a hunt. You jet backward and release ink. The dark cloud hangs where your body was a moment before. The moray bites into it. You are already gone.',
        statEffects: [
          { stat: StatId.TRA, amount: 12, duration: 3, label: '+TRA (near death)' },
          { stat: StatId.WIS, amount: 5, duration: 4, label: '+WIS (escape learned)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        completionFlag: 'storyline-ink-cloud-escape',
      },
      {
        id: 'ink-cloud-3',
        delayMin: 4,
        delayMax: 7,
        narrativeText: 'You know the moray\'s schedule now. When it hunts, where it rests, which crevices it uses. You forage when it is still. You have packed shells and stones around your den entrance.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, duration: 6, label: '+WIS (predator knowledge)' },
          { stat: StatId.ADV, amount: -6, duration: 4, label: '-ADV (adapted)' },
        ],
        consequences: [],
        completionFlag: 'storyline-ink-cloud-adapted',
      },
    ],
  },

  // ── Colony Under Siege (honeybee worker) ──
  {
    id: 'colony-under-siege',
    name: 'Colony Under Siege',
    speciesIds: ['honeybee-worker'],
    startConditions: [
      { type: 'age_range', min: 2 },
    ],
    startChance: 0.10,
    tags: ['environmental', 'danger'],
    steps: [
      {
        id: 'colony-siege-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Wasps probe the entrance, darting in and pulling back. Foraging flights take longer, returning with less. The colony\'s hum has shifted pitch, lower and uneven.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA (colony stressed)' },
          { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM (hive anxiety)' },
        ],
        consequences: [],
        completionFlag: 'storyline-colony-siege-noticed',
      },
      {
        id: 'colony-siege-2',
        delayMin: 2,
        delayMax: 5,
        narrativeText: 'Foreign bees force through the entrance. Alarm pheromone floods the hive, sharp and acrid. The sound inside is deafening. Workers ball the intruders, generating killing heat. Bodies pile at the entrance.',
        statEffects: [
          { stat: StatId.HEA, amount: -10, duration: 3, label: '-HEA (combat casualties)' },
          { stat: StatId.TRA, amount: 12, duration: 3, label: '+TRA (hive under attack)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000002 },
        ],
        completionFlag: 'storyline-colony-siege-raid',
      },
      {
        id: 'colony-siege-3',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The raiders are gone. Survivors seal the entrance with propolis, narrowing it to a single-body gap. Stores are depleted and workers are few, but the queen is alive. New brood cells are capped and warming.',
        statEffects: [
          { stat: StatId.HOM, amount: -8, duration: 4, label: '-HOM (colony recovering)' },
          { stat: StatId.WIS, amount: 6, duration: 4, label: '+WIS (siege survived)' },
        ],
        consequences: [],
        completionFlag: 'storyline-colony-siege-resolved',
      },
    ],
  },

  // ── The Crosswind (arctic tern) ──
  {
    id: 'crosswind-arc',
    name: 'The Crosswind',
    speciesIds: ['arctic-tern'],
    startConditions: [
      { type: 'has_flag', flag: 'will-migrate' },
    ],
    startChance: 0.10,
    tags: ['migration', 'environmental'],
    steps: [
      {
        id: 'crosswind-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Wind hits from the side, steady and strong. Your body says south but the air pushes east. Every correction costs energy. The route stretches longer with each gust.',
        statEffects: [
          { stat: StatId.CLI, amount: 10, duration: 3, label: '+CLI (crosswind)' },
          { stat: StatId.STR, amount: -5, duration: 3, label: '-STR (fighting wind)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.008 },
        ],
        completionFlag: 'storyline-crosswind-started',
      },
      {
        id: 'crosswind-2',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'The wind shifts behind you. Speed comes without effort now, the air carrying you forward. The water below changes color, darker to lighter. The route is right again.',
        statEffects: [
          { stat: StatId.STR, amount: 5, duration: 3, label: '+STR (tailwind recovery)' },
          { stat: StatId.WIS, amount: 6, duration: 4, label: '+WIS (weather reading)' },
          { stat: StatId.CLI, amount: -8, duration: 3, label: '-CLI (favorable wind)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.005 },
        ],
        completionFlag: 'storyline-crosswind-resolved',
      },
    ],
  },

  // ── The Golden Frog (poison dart frog) ──
  {
    id: 'golden-frog-arc',
    name: 'The Golden Frog',
    speciesIds: ['poison-dart-frog'],
    startConditions: [
      { type: 'age_range', min: 8 },
    ],
    startChance: 0.08,
    tags: ['social', 'environmental'],
    steps: [
      {
        id: 'golden-frog-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'In the leaf litter, a frog you have never encountered. Not your color. Gold, bright against the dark soil. It smells like your species but different. Its call is slightly off.',
        statEffects: [
          { stat: StatId.NOV, amount: 10, duration: 3, label: '+NOV (new morph)' },
          { stat: StatId.WIS, amount: 5, duration: 3, label: '+WIS (species diversity)' },
        ],
        consequences: [],
        completionFlag: 'storyline-golden-frog-encounter',
      },
      {
        id: 'golden-frog-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'More gold morphs now, their higher-pitched calls cutting through yours. The good perches and pools are contested. You watch them forage different patches, feeding on prey you overlooked.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, duration: 6, label: '+WIS (learning from others)' },
          { stat: StatId.ADV, amount: 5, duration: 3, label: '+ADV (competition)' },
        ],
        consequences: [],
        completionFlag: 'storyline-golden-frog-coexistence',
      },
    ],
  },
];
