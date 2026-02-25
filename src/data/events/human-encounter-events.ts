import type { GameEvent } from '../../types/events';
import { StatId } from '../../types/stats';

/** Phase 7: Human encounter events — shared across multiple species. */
export const HUMAN_ENCOUNTER_EVENTS: GameEvent[] = [
  // ── Road Crossing (terrestrial) ──
  {
    id: 'human-road-crossing',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A strip of asphalt cuts through the landscape — hot, black, and smelling of tar. Machines roar past at terrifying speed, their lights sweeping the darkness. The far side holds better habitat, but the crossing is deadly.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'cross-road',
        label: 'Cross now',
        description: 'Sprint across during a gap in traffic.',
        narrativeResult: 'You dash across the road, the heat of the asphalt burning your feet. A vehicle passes seconds after you reach the far side, its horn blaring into the night.',
        statEffects: [
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'You misjudged the speed of an oncoming vehicle. The impact was instantaneous.',
          statModifiers: [{ stat: StatId.WIS, factor: -0.001 }],
        },
      },
      {
        id: 'wait-road',
        label: 'Wait for a safer moment',
        description: 'Find a culvert or wait for darkness.',
        narrativeResult: 'You follow the roadside ditch until you find a drainage culvert. The dark tunnel smells of rust and stale water, but it passes beneath the road safely.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['human', 'environmental', 'danger'],
  },

  // ── Habitat Fragmentation ──
  {
    id: 'human-habitat-fragmentation',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Where forest once stood, a raw wound of cleared earth stretches to the horizon. Machines have stripped the land bare, leaving stumps and rutted mud. The home range you knew is shrinking, squeezed between development on every side.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, duration: 4, label: '+HOM (habitat loss)' },
      { stat: StatId.TRA, amount: 8, duration: 4, label: '+TRA (displacement)' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['human', 'environmental'],
  },

  // ── Conservation Ranger ──
  {
    id: 'human-conservation-ranger',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A human approaches slowly, speaking softly, carrying strange equipment — a long tube with a feathered dart. You sense no immediate threat, but the scent of human is always unsettling.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-ranger',
        label: 'Flee immediately',
        description: 'Run — humans are never safe.',
        narrativeResult: 'You bolt for cover, vanishing into the underbrush. The dart thuds into the ground where you stood. Whatever the human intended, it will not happen today.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'hold-still',
        label: 'Freeze and observe',
        description: 'Stay still — maybe it will pass.',
        narrativeResult: 'A sting in your flank, then drowsiness. You wake with a strange band around your leg and a sore spot where the dart struck. The humans are gone. You feel... the same, mostly. Perhaps slightly better — the dull ache from an old infection seems to have faded.',
        statEffects: [
          { stat: StatId.HEA, amount: 5, duration: 6, label: '+HEA (medical treatment)' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tagged-by-researchers' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
      { type: 'age_range', min: 6 },
    ],
    weight: 4,
    cooldown: 20,
    tags: ['human', 'environmental'],
  },

  // ── Camera Trap ──
  {
    id: 'human-camera-trap',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A small box strapped to a tree blinks with a red light as you pass. A faint click sounds — the box has taken your picture. You sniff it cautiously. It smells of metal, plastic, and faintly of human hands, but it poses no threat. Your image will join a research database you will never know exists.',
    statEffects: [
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['human', 'environmental'],
  },

  // ── Pesticide Drift ──
  {
    id: 'human-pesticide-drift',
    type: 'passive',
    category: 'health',
    narrativeText: 'A bitter chemical tang drifts on the wind from nearby farmland. The vegetation at the edge of your range is wilting, and the insects that feed on it are dying or gone. The poison is invisible, but your body knows something is wrong — a creeping nausea, a dullness behind the eyes.',
    statEffects: [
      { stat: StatId.HEA, amount: -8, duration: 4, label: '-HEA (pesticide exposure)' },
      { stat: StatId.IMM, amount: 8, duration: 4, label: '+IMM (toxin stress)' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant', 'monarch-butterfly', 'honeybee-worker'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['human', 'health', 'pollution'],
  },

  // ── Fence Entanglement ──
  {
    id: 'human-fence-encounter',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A wire fence blocks your path — barbed at the top, its metal strands humming faintly in the wind. Beyond it, the habitat continues unbroken. The fence is a human boundary that means nothing to you, except as an obstacle.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'go-under',
        label: 'Crawl under',
        description: 'Find a gap beneath the lowest wire.',
        narrativeResult: 'You press yourself flat and wriggle beneath the bottom wire. A barb catches your hide, leaving a thin scratch, but you pull free.',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'find-another-way',
        label: 'Look for an opening',
        description: 'Follow the fence until you find a gap or gate.',
        narrativeResult: 'You walk along the fence line until you find a section where the wire is broken and bent. You pass through easily, though the detour cost you time.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['human', 'environmental'],
  },

  // ── Noise Pollution ──
  {
    id: 'human-noise-pollution',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A low, persistent rumble penetrates the air — construction, traffic, or machinery beyond the tree line. The sound never stops. Your ability to hear predators, calls, and the subtle sounds of the environment is degraded. You feel exposed in a way you cannot identify.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, duration: 3, label: '+ADV (noise stress)' },
      { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA (anxiety)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 5,
    cooldown: 8,
    tags: ['human', 'environmental'],
  },

  // ── Light Pollution (nocturnal/marine/insects) ──
  {
    id: 'human-light-pollution',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'An orange glow stains the horizon — not sunrise, but the accumulated light of a distant city. The stars are dim, and the darkness that you depend on for navigation, hunting, or hiding is diluted. The night no longer belongs entirely to the wild.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, duration: 3, label: '+NOV (disorientation)' },
      { stat: StatId.WIS, amount: -3, duration: 3, label: '-WIS (navigation confused)' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant', 'monarch-butterfly', 'honeybee-worker'] },
    ],
    weight: 4,
    cooldown: 10,
    tags: ['human', 'environmental'],
  },

  // ── Fishing Boat (aquatic) ──
  {
    id: 'human-fishing-boat',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A human vessel passes through the water above — or beside — you, trailing nets, lines, and the acrid taste of engine exhaust. The disturbance scatters prey and fills the water with alien noise.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'dive-deep-boat',
        label: 'Dive to avoid it',
        description: 'Go deep and wait for the disturbance to pass.',
        narrativeResult: 'You descend into the dim water, letting the noise and turbulence pass above you. When you surface, the boat is gone, trailing a plume of disturbed sediment.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stay-course-boat',
        label: 'Hold your position',
        description: 'Let the boat pass — it may not notice you.',
        narrativeResult: 'The vessel churns past, its wake rocking you. A net trails dangerously close, but you are small enough — or lucky enough — to escape entanglement.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The fishing net caught you. Tangled in monofilament, you drowned before the crew even noticed.',
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['chinook-salmon', 'green-sea-turtle', 'common-octopus'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['human', 'environmental', 'aquatic'],
  },

  // ── Power Line (birds) ──
  {
    id: 'human-power-line',
    type: 'active',
    category: 'environmental',
    narrativeText: 'Cables stretch across your flight path, nearly invisible against the sky. Other birds perch on them harmlessly, but in poor visibility or during migration, these wires are silent killers.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fly-over-lines',
        label: 'Gain altitude',
        description: 'Climb above the power lines.',
        narrativeResult: 'You beat upward, clearing the cables by a comfortable margin. The effort costs you energy, but your feathers remain intact.',
        statEffects: [
          { stat: StatId.STR, amount: -2, label: '-STR' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'fly-between-lines',
        label: 'Thread through the gap',
        description: 'Pass between the wires — risky in low light.',
        narrativeResult: 'You angle your wings and shoot between the cables. A wire brushes your tail feathers — close, too close.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'You struck the power line at speed. The impact broke your wing, and you fell to the ground below the cables.',
          statModifiers: [{ stat: StatId.WIS, factor: -0.001 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['arctic-tern', 'monarch-butterfly'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['human', 'environmental'],
  },

  // ── Plastic Debris (marine) ──
  {
    id: 'human-plastic-debris',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Fragments of plastic drift past — bottle caps, shredded bags, tangles of fishing line. Some are encrusted with algae, mimicking food. The ocean is laced with human refuse, and the smaller pieces are indistinguishable from the plankton and prey you depend on.',
    statEffects: [
      { stat: StatId.HEA, amount: -4, duration: 3, label: '-HEA (microplastic ingestion)' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['chinook-salmon', 'green-sea-turtle', 'common-octopus', 'arctic-tern'] },
    ],
    weight: 5,
    cooldown: 8,
    tags: ['human', 'environmental', 'pollution'],
  },
];
