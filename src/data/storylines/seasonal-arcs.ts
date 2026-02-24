import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';

/** Phase 13: Seasonal story arcs — multi-species narrative sequences. */
export const SEASONAL_STORYLINES: StorylineDefinition[] = [
  // ── Returning Rival (wolf/deer) ──
  {
    id: 'returning-rival',
    name: 'The Returning Rival',
    speciesIds: ['gray-wolf', 'white-tailed-deer'],
    startConditions: [
      { type: 'age_range', min: 18 },
      { type: 'season', seasons: ['autumn'] },
    ],
    startChance: 0.08,
    tags: ['social', 'rival'],
    steps: [
      {
        id: 'rival-return-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'A familiar scent on the wind — one you have not encountered in many months. Your old rival has returned to {{region.name}}, larger and stronger than before. Scrapes and scent markings appear at the borders of your range, unmistakable territorial claims.',
        statEffects: [
          { stat: StatId.ADV, amount: 10, duration: 4, label: '+ADV (rival returns)' },
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA (territory threat)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'storyline-rival-returned' },
        ],
        completionFlag: 'storyline-rival-returned',
      },
      {
        id: 'rival-return-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The confrontation is unavoidable. You encounter your rival at a contested resource — a feeding ground, a water source, the border between your territories. Neither of you will back down. The outcome will determine who dominates this range.',
        statEffects: [
          { stat: StatId.ADV, amount: 12, duration: 3, label: '+ADV (confrontation)' },
          { stat: StatId.STR, amount: -5, duration: 3, label: '-STR (combat)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        completionFlag: 'storyline-rival-confrontation',
      },
      {
        id: 'rival-return-3',
        delayMin: 2,
        delayMax: 5,
        narrativeText: 'The territory dispute has settled into an uneasy equilibrium. One of you controls the better ground; the other has been pushed to the margins. But the competition has sharpened your instincts and tested your resolve. You are harder now, more wary, more capable.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, duration: 6, label: '+WIS (hard-won wisdom)' },
          { stat: StatId.TRA, amount: -6, duration: 4, label: '-TRA (settled borders)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-rival-returned' },
        ],
        completionFlag: 'storyline-rival-resolved',
      },
    ],
  },

  // ── The Flood (riparian species) ──
  {
    id: 'the-flood',
    name: 'The Flood',
    speciesIds: ['white-tailed-deer', 'poison-dart-frog'],
    startConditions: [
      { type: 'season', seasons: ['spring'] },
    ],
    startChance: 0.07,
    tags: ['environmental', 'seasonal'],
    steps: [
      {
        id: 'flood-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Rain falls without ceasing. The streams that cross {{region.name}} are swelling, brown water creeping higher up the banks with each passing hour. Low-lying ground is already submerged.',
        statEffects: [
          { stat: StatId.CLI, amount: 8, duration: 3, label: '+CLI (rising water)' },
          { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA (flood threat)' },
        ],
        consequences: [],
        completionFlag: 'storyline-flood-rising',
      },
      {
        id: 'flood-2',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'The flood has transformed {{region.name}}. Familiar paths are underwater. Trees stand in lakes that did not exist a week ago. Animals crowd onto high ground — predator and prey alike, too exhausted and desperate to fight. Food is scarce on the islands of dry land.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, duration: 4, label: '+HOM (displaced)' },
          { stat: StatId.HEA, amount: -8, duration: 3, label: '-HEA (exposure)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        completionFlag: 'storyline-flood-peak',
      },
      {
        id: 'flood-3',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The waters are receding at last, leaving behind a landscape of mud, debris, and new channels. But the flood has deposited rich silt across the lowlands, and within weeks the land will explode with new growth. Destruction and renewal are two faces of the same process.',
        statEffects: [
          { stat: StatId.HOM, amount: -10, duration: 4, label: '-HOM (waters recede)' },
          { stat: StatId.HEA, amount: 8, duration: 4, label: '+HEA (abundance coming)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
        ],
        completionFlag: 'storyline-flood-receded',
      },
    ],
  },

  // ── Disease Outbreak (all species) ──
  {
    id: 'disease-outbreak',
    name: 'The Sickness',
    speciesIds: [],
    startConditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    startChance: 0.05,
    tags: ['health', 'environmental'],
    steps: [
      {
        id: 'outbreak-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Others of your kind are falling ill. You encounter one lying still, breathing shallowly, too weak to flee at your approach. The sickness is spreading through {{region.name}} — a disease you cannot see, carried in water, soil, or the bodies of the dead.',
        statEffects: [
          { stat: StatId.TRA, amount: 10, duration: 4, label: '+TRA (epidemic fear)' },
          { stat: StatId.IMM, amount: 8, duration: 4, label: '+IMM (immune activation)' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'storyline-outbreak-active' },
        ],
        completionFlag: 'storyline-outbreak-started',
      },
      {
        id: 'outbreak-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The disease has peaked. Bodies litter the landscape — others of your species who were not strong enough, not lucky enough. The population has been culled by invisible teeth. You have survived so far, but your immune system is strained and your body is weakened.',
        statEffects: [
          { stat: StatId.HEA, amount: -10, duration: 4, label: '-HEA (disease peak)' },
          { stat: StatId.HOM, amount: 8, duration: 4, label: '+HOM (population crash)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-outbreak-peaked',
      },
      {
        id: 'outbreak-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'The outbreak is fading. Those who survived have some degree of resistance, and the pathogen is running out of susceptible hosts. The population is diminished but the survivors are strong. Competition for resources has eased, and there is room to grow.',
        statEffects: [
          { stat: StatId.IMM, amount: -10, duration: 6, label: '-IMM (immunity gained)' },
          { stat: StatId.HEA, amount: 8, duration: 4, label: '+HEA (recovery)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-outbreak-active' },
          { type: 'modify_weight', amount: 2 },
        ],
        completionFlag: 'storyline-outbreak-resolved',
      },
    ],
  },

  // ── The Great Dry (tropical species) ──
  {
    id: 'the-great-dry',
    name: 'The Great Dry',
    speciesIds: ['african-elephant', 'poison-dart-frog'],
    startConditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    startChance: 0.07,
    tags: ['environmental', 'seasonal'],
    steps: [
      {
        id: 'great-dry-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The dry season has arrived with unusual ferocity. Humidity plummets, water sources shrink to stagnant pools, and the earth cracks open in zigzag patterns. The air itself feels thin and hostile.',
        statEffects: [
          { stat: StatId.CLI, amount: 10, duration: 4, label: '+CLI (extreme drought)' },
          { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA (water stress)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        completionFlag: 'storyline-great-dry-started',
      },
      {
        id: 'great-dry-2',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The drought deepens into crisis. The last watering holes are ringed with desperate animals. Territorial boundaries dissolve as survival overrides hierarchy. The strongest push the weakest away from water, and the weakest die.',
        statEffects: [
          { stat: StatId.HEA, amount: -10, duration: 4, label: '-HEA (dehydration)' },
          { stat: StatId.ADV, amount: 10, duration: 3, label: '+ADV (water competition)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        completionFlag: 'storyline-great-dry-crisis',
      },
      {
        id: 'great-dry-3',
        delayMin: 4,
        delayMax: 8,
        narrativeText: 'Dark clouds build on the horizon. The first drops of rain hit the parched earth and evaporate in tiny puffs of steam. Then the sky opens. Rain hammers down in sheets, filling every crack and hollow. Within hours, the dry watercourses are rivers again. The world is reborn.',
        statEffects: [
          { stat: StatId.HEA, amount: 12, duration: 4, label: '+HEA (rain at last)' },
          { stat: StatId.TRA, amount: -10, duration: 4, label: '-TRA (relief)' },
          { stat: StatId.CLI, amount: -10, duration: 4, label: '-CLI (rain)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 4 },
        ],
        completionFlag: 'storyline-great-dry-resolved',
      },
    ],
  },

  // ── Migration Catastrophe (migratory species) ──
  {
    id: 'migration-catastrophe',
    name: 'The Disastrous Crossing',
    speciesIds: ['arctic-tern', 'monarch-butterfly', 'green-sea-turtle'],
    startConditions: [
      { type: 'season', seasons: ['autumn', 'spring'] },
    ],
    startChance: 0.06,
    tags: ['migration', 'environmental', 'danger'],
    steps: [
      {
        id: 'migration-catastrophe-1',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The migration route this season is cursed. Unusual weather patterns have disrupted the normal currents and wind corridors. Landmarks that should guide you are obscured. The journey has already claimed many of your companions.',
        statEffects: [
          { stat: StatId.TRA, amount: 12, duration: 4, label: '+TRA (navigation crisis)' },
          { stat: StatId.CLI, amount: 8, duration: 3, label: '+CLI (weather disruption)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'storyline-migration-disaster' },
        ],
        completionFlag: 'storyline-migration-disaster-started',
      },
      {
        id: 'migration-catastrophe-2',
        delayMin: 2,
        delayMax: 5,
        narrativeText: 'Against all odds, the weather breaks. The route clears, the winds shift to favorable, and you recognize the landscape ahead. You have survived one of the worst crossings in memory. The destination is close. Every mile you cover now is a mile earned through will alone.',
        statEffects: [
          { stat: StatId.WIS, amount: 10, duration: 6, label: '+WIS (survival wisdom)' },
          { stat: StatId.TRA, amount: -8, duration: 4, label: '-TRA (route clearing)' },
          { stat: StatId.CLI, amount: -5, duration: 3, label: '-CLI (weather improving)' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'storyline-migration-disaster' },
        ],
        completionFlag: 'storyline-migration-disaster-resolved',
      },
    ],
  },
];
