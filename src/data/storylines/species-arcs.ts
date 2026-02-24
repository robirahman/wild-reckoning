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
        narrativeText: 'A moray eel has taken up residence in a crevice near your den. You have seen its green head protruding from the rock, testing the current with its open mouth. It is a patient hunter, and your den is within its patrol range. The reef feels less safe now.',
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
        narrativeText: 'The moray strikes. It lunges from its crevice as you return from a hunt, its elongated body uncoiling like a spring. You jet backward, firing a cloud of ink — a dark, spreading phantom that hangs in the water where you were a moment before. The moray bites the ink cloud. You escape, but barely.',
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
        narrativeText: 'You have learned the moray\'s patterns — when it hunts, where it patrols, which crevices it uses. Armed with this knowledge, you time your foraging to avoid its active hours and have reinforced your den entrance with shells and stones. The reef has a predator, but so do you have a strategy.',
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
        narrativeText: 'The hive is under threat. A persistent wasp species has been probing the entrance, testing the guards. Workers return from foraging reporting fewer flowers and longer flights. The queen\'s laying rate has slowed. Something is straining the colony.',
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
        narrativeText: 'A full-scale robbing raid. Foreign bees — from a stronger colony — have breached the entrance. The air inside the hive is chaos: the smell of alarm pheromone, the buzz of combat, the desperate heat of balling attackers. Workers are dying by the dozen defending the honey stores.',
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
        narrativeText: 'The raid is over. The survivors seal the entrance with propolis, reducing it to a single-bee-width gap that is easier to defend. The colony has lost workers and stores, but the queen lives, and the survivors work with renewed purpose. Within weeks, new brood will emerge and the colony will rebuild.',
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
        narrativeText: 'A massive weather system has stalled over the Atlantic, generating persistent crosswinds that push you off course. Your internal compass says south, but the wind pushes east. Every mile is a battle of navigation against raw atmospheric force.',
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
        narrativeText: 'The wind shifts at last. A break in the weather system opens a corridor of following wind, and you ride it like a river of air, making up lost miles with effortless speed. The ocean below changes color — warmer water ahead. You are back on course.',
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
        narrativeText: 'Deep in the forest, you encounter a frog you have never seen before — not red like you, but brilliant gold, its skin shimmering like a bead of amber in the leaf litter. It is a different color morph of your own species, carrying different toxin profiles built from a different diet of ants.',
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
        narrativeText: 'The golden morph population is growing in your territory. Their calls are subtly different from yours — a higher pitch, a faster trill. Competition for calling perches and bromeliad pools has intensified, but you are also learning new feeding strategies by observing their different foraging patterns.',
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
