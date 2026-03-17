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
        narrativeText: 'A scent you have not smelled in months hits on the wind. The rival is back in {{region.name}}, heavier now. Fresh scrapes and scent marks appear along your boundary.',
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
        narrativeText: 'You meet the rival at a shared resource. Both of you stop. Neither turns away. The space between you closes.',
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
        narrativeText: 'The boundary is fixed now. One of you holds the better ground. Every scent on the wind hits sharper now. Sounds snap your head around before you think.',
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
        narrativeText: 'Rain does not stop. The streams crossing {{region.name}} run brown and fast, water climbing the banks hour by hour. Low ground is already underwater.',
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
        narrativeText: 'The ground smells different. Water covers the trails you used. Animals crowd the remaining high ground. The smell of mud and rot is everywhere. Food is scarce on the shrinking dry patches.',
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
        narrativeText: 'The water pulls back, leaving mud, debris, and fresh channels. Dark silt coats the lowlands. Already new growth pushes through it, pale green against the brown.',
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
        narrativeText: 'Others of your kind are lying still, breathing fast and shallow, too weak to move when you approach. The sick smell wrong. More of them appear each day across {{region.name}}.',
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
        narrativeText: 'The smell hits first, thick and sweet. Then you see them: stiff bodies in the open, bellies swollen. Your own body feels heavy and slow, joints aching, appetite gone.',
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
        narrativeText: 'Fewer sick ones now. Your body feels stronger, appetite returning. The population is thin but the survivors move well. More food, more space.',
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
        narrativeText: 'The air is dry and hot, each breath pulling moisture from your body. Water sources have shrunk to stagnant puddles. The ground is cracked and hard underfoot.',
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
        narrativeText: 'The last water holes stink of concentrated urine and trampled mud. Bodies press close, too many animals at too little water. The larger ones shove the smaller ones back.',
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
        narrativeText: 'The smell of rain reaches you before the first drops fall. Water hits the hot ground, vapor rising off the dirt. Then the sky opens. Within hours, the dry channels are running full again.',
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
        narrativeText: 'The route is wrong. Currents and wind corridors have shifted, pushing you off course. Familiar signals are absent. Others traveling with you are falling behind, dropping away.',
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
        narrativeText: 'The weather shifts. Currents align, winds turn favorable. You recognize the signals ahead. The destination is close. Your body is spent but still moving.',
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
