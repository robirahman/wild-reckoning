import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

const wolfEvents: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  HUNTING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-deer-chase',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'A white-tailed doe bursts from the undergrowth. The scent of autumn fat hits your nose. She is running uphill through deep snow. Your muscles lock.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    choices: [
      {
        id: 'pursue-deer',
        label: 'Pursue at full speed',
        description: 'Commit everything to the chase',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stalk-deer',
        label: 'Stalk and wait for a better angle',
        description: 'Circle downwind and cut her off at the creek crossing',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'abandon-deer',
        label: 'Abandon the chase',
        description: 'Save your energy. Failed chases in winter can be fatal.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['foraging', 'hunting', 'prey'],
  },

  {
    id: 'wolf-moose-confrontation',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The bull moose stands in the shallows. The smell hits you first: wet hide, rut musk, fermenting browse. His rack is wide. He turns to face you and lowers his head. A moose can kill with a single kick.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'attack-moose',
        label: 'Attack. Go for the hamstrings.',
        description: 'If you cripple him, the pack eats for weeks.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 8 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'Front hoof to the skull. Killed instantly.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'test-moose',
        label: 'Test him. Feint and gauge his strength.',
        description: 'Circle and probe for weakness. If he stands firm, back off.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The moose charged without warning. Too close to dodge.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'retreat-moose',
        label: 'Retreat. This one is too strong.',
        description: 'A healthy moose is not worth the risk.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['foraging', 'hunting', 'danger'],
  },

  {
    id: 'wolf-elk-ambush',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The elk herd is bedded down in the meadow. Steam rises from their bodies. You smell the cow with the limp, the calf drifting to the edge, the bull facing the wrong direction. Wind in your favor. Snow firm.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 6 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['foraging', 'hunting', 'prey'],
    footnote: '(Wolves target weak, young, or injured individuals, culling the least fit from the herd.)',
  },

  {
    id: 'wolf-scavenge-kill',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Ravens circling above the pines. Below, a deer carcass half-buried in snow. Ribs still red, meat frozen. No other predator scent on it yet.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['foraging', 'scavenging', 'food'],
  },

  {
    id: 'wolf-failed-hunt-snow',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'The snow crust supports the deer but not you. Every stride punches through, the sharp edges cutting your legs. The deer floats across the surface ahead of you. After two hundred yards your lungs burn. The deer is gone. You stop, panting, legs bleeding. You burned more than you will replace today.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'hunting', 'seasonal', 'winter'],
  },

  {
    id: 'wolf-pack-takedown',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'Two wolves drive the deer toward the frozen lake edge. A third cuts the escape route. You and the alpha close from behind. The deer stumbles on the ice. The pack converges. You eat in order of rank, tearing into the hot viscera.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 6 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 11,
    cooldown: 5,
    tags: ['foraging', 'hunting', 'pack', 'social'],
  },

  {
    id: 'wolf-surplus-kill',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Two deer down. Deep snow trapped them. Your belly is full and distended. The second carcass is barely touched. More meat than you can eat.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    choices: [
      {
        id: 'cache-kill',
        label: 'Cache the remains under snow',
        description: 'Bury the carcass for later',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'cached-food' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'gorge-kill',
        label: 'Gorge on everything you can hold',
        description: 'A wolf can consume twenty pounds in one sitting',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 6 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['foraging', 'hunting', 'food'],
  },

  {
    id: 'wolf-rabbit-hunt',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'A snowshoe hare explodes from under a spruce bough. You lunge and catch it mid-leap. A quick crunch of bone. Barely two pounds. You swallow it in three bites, bones and all, and lick blood from your muzzle.',
    statEffects: [
      { stat: StatId.HOM, amount: -2, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 14,
    cooldown: 3,
    tags: ['foraging', 'hunting', 'food'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL / PACK EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-hierarchy-challenge',
    type: 'active',
    category: 'social',
    narrativeText:
      'The alpha stands over the kill, lips curled, canines exposed, a growl vibrating in his chest. The pack waits in a semicircle, ears back, tails low. You are hungrier than you have ever been. Your hackles rise.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'challenge-alpha',
        label: 'Challenge the alpha',
        description: 'Rise to full height, lock eyes, and advance.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'attempted-alpha-challenge' },
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The alpha\'s jaws closed on your throat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'submit-alpha',
        label: 'Submit. Roll onto your back.',
        description: 'Expose your belly and throat. Accept your place.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 9,
    cooldown: 10,
    tags: ['social', 'pack', 'hierarchy', 'danger'],
  },

  {
    id: 'wolf-dominance-challenge',
    type: 'active',
    category: 'social',
    narrativeText:
      'The beta approaches you stiff-legged, hackles raised from skull to tail, ears pinned forward. He stops three body-lengths away and stands rigid. Every tooth visible. The pack has gone silent.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'assert-dominance',
        label: 'Assert dominance. Pin them.',
        description: 'Stiff-legged advance, direct stare, and if needed, teeth.',
        narrativeResult: 'You advance. He does not back down. You collide. Muzzle bites, shoulder slams. His jaws clamp on your foreleg. You twist, driving your weight onto his shoulders. He goes limp. He rolls. Throat exposed. You stand over him, blood on your muzzle.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pack-dominant' },
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'His jaws found your throat and crushed the trachea.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'submit-expose-throat',
        label: 'Submit. Roll over and expose throat.',
        description: 'Accept subordinate status. You will eat last and not breed this season.',
        narrativeResult: 'You break eye contact. Ears flatten, tail tucks. You roll, offering throat and belly. He stands over you, breath hot on your neck. Then steps back. You are subordinate now.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pack-subordinate' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'dominance-bite-sub',
        chance: 0.20,
        conditions: [],
        narrativeText: 'Jaws found flesh in the fight. A bite that splits skin and grinds against bone. The wound throbs, hot and wet beneath your fur.',
        footnote: 'Dominance fights in wolf packs are usually ritualized and resolved through posturing, but approximately 10-20% escalate to physical contact resulting in bite wounds, most commonly to the muzzle, throat, and forelegs.',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'dominance-bite', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 24 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'pack', 'hierarchy', 'danger', 'rival'],
    footnote: 'Wolf pack dominance hierarchies are maintained through ritualized challenges — stiff-legged approaches, direct stares, standing over, and pinning. Most challenges are resolved without serious injury, but escalation to biting (especially throat holds) occurs in roughly one in five encounters and can occasionally prove fatal.',
  },

  {
    id: 'wolf-pack-howl',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The alpha begins. A single low note from his chest rising into the cold air. The others join: the alpha female a third higher, the yearlings adding wavering harmonics. You add your voice. The vibration fills your ribs, your teeth, your bones. The sound carries for miles.',
    statEffects: [
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 13,
    cooldown: 4,
    tags: ['social', 'pack', 'psychological'],
  },

  {
    id: 'wolf-pup-teaching',
    type: 'passive',
    category: 'social',
    narrativeText:
      'You drop a half-eaten rabbit at the rendezvous site. The pups tear into it, growling, tumbling over each other. One tries to carry the whole carcass and falls sideways. They are learning rank, competition, and the taste of meat.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['social', 'pack', 'pup'],
  },

  {
    id: 'wolf-territory-patrol',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The pack moves single file along the territory boundary, each wolf stepping in the tracks ahead. You pause at a scent post, a spruce stump saturated with years of urine marks, and add your own. You mark seven more posts along fifteen miles of boundary.',
    statEffects: [
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'territory-patrolled' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 11,
    cooldown: 5,
    tags: ['social', 'territory', 'pack'],
  },

  {
    id: 'wolf-stranger-encounter',
    type: 'active',
    category: 'social',
    narrativeText:
      'A lone wolf at the edge of your territory. Head low, tail tucked, coat ragged. The smell is unfamiliar: different prey, different soil, no pack-scent. A disperser. Ribs showing through the fur.',
    statEffects: [
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-stranger',
        label: 'Attack the intruder',
        description: 'Defend your territory',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rival-bite', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'The stranger was more dangerous than it appeared.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-stranger',
        label: 'Retreat and avoid confrontation',
        description: 'Back away slowly',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'posture-stranger',
        label: 'Posture and assert dominance',
        description: 'Stand tall, hackles raised, teeth bared.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.NOV, amount: -3, label: '-NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'asserted-territory' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['social', 'territory', 'danger'],
  },

  {
    id: 'wolf-pack-reunion',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The pack converges at dusk. One by one they appear from the timber. Tails wagging, muzzles pushed together, high-pitched whines. You press your face against the alpha\'s neck. Everyone is accounted for.',
    statEffects: [
      { stat: StatId.TRA, amount: -8, label: '-TRA' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'pack', 'psychological'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR THREAT EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-bear-encounter',
    type: 'active',
    category: 'predator',
    narrativeText:
      'A black bear rises from the berry thicket beside your kill. The sour, musky reek hits your nose before you see it. Twice your weight. It wants the deer. The growl from its chest is not a warning.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'defend-kill',
        label: 'Defend the kill',
        description: 'Stand your ground, snarl, and bluff. Bears sometimes back down.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'A single swipe of the bear\'s paw broke your spine.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'abandon-kill',
        label: 'Abandon the kill',
        description: 'Yield the carcass. You can hunt again.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['spring', 'summer', 'autumn'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['predator', 'danger', 'food'],
  },

  {
    id: 'wolf-human-trapper',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The scent is wrong. Metal, rubber, and something chemical that burns the inside of your nose. Half-buried in the trail: steel jaws, spread wide, under a thin layer of leaves. The trap is set exactly where your front paw would land.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'avoid-trap',
        label: 'Circle wide around the trap',
        description: 'Leave the trail and push through deep brush',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'risk-trail',
        label: 'Try to step over the trap and continue',
        description: 'The trail is the only efficient path',
        statEffects: [
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'The trap snapped shut on your leg. The trapper returned at dawn.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-trap-injury',
        chance: 0.15,
        conditions: [
          { type: 'has_flag', flag: 'risk-trail-taken' },
        ],
        narrativeText:
          'The trap closed on your paw. You wrenched free after hours of biting at the steel, but the damage is done.',
        footnote: '(Caught in leg-hold trap)',
        statEffects: [
          { stat: StatId.TRA, amount: 12, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'trap-wound', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['predator', 'danger', 'human', 'trap'],
  },

  {
    id: 'wolf-livestock-raid',
    type: 'active',
    category: 'predator',
    narrativeText:
      'Cattle scent on the night wind. Warm, bovine. They stand behind a wire fence, eyes blank. A calf stands apart from the herd, bawling. The farmhouse lights are on.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'raid-livestock',
        label: 'Raid the pasture',
        description: 'Easy food, but the consequences could be fatal for the entire pack',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
          { type: 'set_flag', flag: 'livestock-raider' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'Tracked by GPS collar data. Shot from a helicopter.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-livestock',
        label: 'Turn away and hunt wild prey',
        description: 'Stay wild.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'danger', 'human', 'food'],
    footnote: '(Livestock depredation is the leading cause of wolf mortality in recovery zones.)',
  },

  {
    id: 'wolf-rival-pack-fight',
    type: 'active',
    category: 'predator',
    narrativeText:
      'Six wolves on the ridge at first light. Tight formation. Their scent is wrong: different territory, different prey. Hackles raised. The two packs face each other across the frozen meadow, thirty yards apart. Every wolf snarling.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-rival-pack',
        label: 'Charge with your pack',
        description: 'Meet them head-on.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rival-bite', severity: 0 },
          { type: 'set_flag', flag: 'fought-rival-pack' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'The rival pack overwhelmed you. Multiple wolves pinned you and the alpha tore your throat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'retreat-rival-pack',
        label: 'Retreat and cede the ground',
        description: 'Fall back. Losing ground is better than losing lives.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'territory-lost' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['predator', 'danger', 'pack', 'territory'],
    footnote: '(Inter-pack aggression is the leading natural cause of wolf mortality.)',
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-spring-denning',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The alpha female has chosen the den site: a hillside burrow beneath old-growth white pine roots, entrance facing south. She has been digging for days, claws black with packed earth. The pack circles in a protective perimeter.',
    statEffects: [
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 14,
    cooldown: 12,
    tags: ['seasonal', 'reproduction', 'den'],
  },

  {
    id: 'wolf-summer-pup-rearing',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The rendezvous site smells of pups: milk, urine, the warm musk of fur. They tumble over each other chasing grasshoppers. You regurgitate a meal of half-digested deer meat. They mob you with whining and tail-wagging.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'has_flag', flag: 'pups-dependent' },
    ],
    weight: 14,
    cooldown: 6,
    tags: ['seasonal', 'pup', 'pack'],
  },

  {
    id: 'wolf-autumn-dispersal',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The yearlings linger at the territory boundaries, staring into unfamiliar forest beyond the scent posts. One of them, a large male, has been sleeping apart from the pack for a week. Eating last. Avoiding the alpha\'s gaze.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['seasonal', 'dispersal', 'social'],
  },

  {
    id: 'wolf-winter-starvation',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'Three weeks without a kill. Ribs showing through dull coats. You chew on a frozen moose bone, cracking it for the marrow. Snow four feet deep and still falling. The deer have yarded up in dense spruce where you cannot maneuver. Your body is consuming itself.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'weight_below', threshold: 65 },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['seasonal', 'starvation', 'winter'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-forest-fire',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'Smoke. You smell it before you see it: charcoal, resin, scorched earth. The air thickens. An orange glow advances through the jack pines. Every animal in the forest is running east. The pack must move.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
    ],
    choices: [
      {
        id: 'flee-fire-river',
        label: 'Flee toward the river',
        description: 'Water is the only firebreak. Two miles east.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The fire crowned and cut off the escape route to the river.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-fire-road',
        label: 'Follow the logging road north',
        description: 'The cleared road may act as a firebreak, but leads into unknown territory',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The fire jumped the road. Smoke and heat overwhelmed you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 4,
    cooldown: 20,
    tags: ['environmental', 'danger', 'fire'],
  },

  {
    id: 'wolf-deep-snow',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'Three feet of fresh powder overnight. Trails gone. Scent posts buried. You push through with your chest, plowing a trench the pack follows in single file. The alpha breaks trail, then rotates to the back when spent. Your paws are balled with ice between the toes. Every step sinks to the belly.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['environmental', 'weather', 'winter'],
  },

  {
    id: 'wolf-frozen-lake',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'The lake stretches ahead. Ice and snow. It would cut three miles off the route to the deer yard. The ice groaned and cracked through the night. Dark pressure cracks radiate from the center. From the shore, there is no way to judge thickness.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'cross-lake',
        label: 'Cross the lake',
        description: 'Direct and fast, but the ice is uncertain',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The ice gave way a hundred yards from shore.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'detour-lake',
        label: 'Take the long way around the shore',
        description: 'Slower and more tiring, but solid ground',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['environmental', 'danger', 'winter'],
  },

  {
    id: 'wolf-highway-crossing',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'Four lanes of asphalt cut through the forest. The smell is acrid: rubber, exhaust, heated metal. Headlights sweep past. You stand in the ditch at the tree line. The deer are on the far side. A dead wolf lies frozen on the shoulder a quarter mile north.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-highway',
        label: 'Sprint across during a gap',
        description: 'Wait for the longest gap and run.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.07,
          cause: 'A truck crested the hill. You never saw the headlights.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'find-underpass',
        label: 'Search for a culvert or underpass',
        description: 'Wolves have learned to use drainage culverts.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'danger', 'human'],
    footnote: '(Vehicle collisions are a significant cause of wolf mortality in Minnesota.)',
  },

  // ══════════════════════════════════════════════
  //  FEMALE COMPETITION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-breeding-suppression',
    type: 'active',
    category: 'social',
    narrativeText:
      'The alpha female stands over you, lips curled, body rigid. She has been pinning you, snarling when you show any sign of hormonal readiness. In this pack, only the alpha female breeds.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    choices: [
      {
        id: 'challenge-alpha-female',
        label: 'Challenge the alpha female',
        description: 'Win breeding rights and the best den site',
        narrativeResult:
          'You stare into her eyes. She lunges. You meet her, jaws snapping, bodies twisting. You pin her, jaws locked around her muzzle, body pressing hers into the snow. She goes still. You are the breeding female now.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -8, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'submit-to-alpha',
        label: 'Submit and accept suppression',
        description: 'Stay in the pack but accept subordinate breeding status',
        narrativeResult:
          'You roll onto your back. She stands over you, teeth bared, breath hot on your neck. Your hormones will dampen. If you breed at all, your pups will be raised in the worst den site.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
          { type: 'set_flag', flag: 'pack-subordinate' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-breeding-suppression-bite-sub',
        chance: 0.15,
        narrativeText:
          'The alpha female\'s jaws clamp on your muzzle. Deep punctures across the bridge of your nose. Blood runs into your mouth.',
        footnote: '(Dominance bite from alpha challenge)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'dominance-bite', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'female' },
      { type: 'season', seasons: ['winter', 'spring'] },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['social', 'hierarchy', 'female-competition'],
    footnote: 'In wolf packs, the alpha female actively suppresses reproduction in subordinate females through hormonal stress and physical intimidation. Only 20-40% of subordinate females successfully breed in any given year.',
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-mating-encounter',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'The alpha male approaches at dusk, tail high, ears forward. The winter air carries his hormone scent. The pack watches from the clearing edges.',
    statEffects: [
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'wolf-accept-mate',
        label: 'Accept the alpha male',
        description: 'Mate and prepare for spring denning. Gestation is approximately nine weeks.',
        narrativeResult: 'The pack will now prioritize your protection and nutrition. In two months, the den will be your world.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wolf-reject-mate',
        label: 'Submit but avoid mating',
        description: 'Preserves your strength but limits your legacy.',
        narrativeResult: 'You roll onto your back, offering submission but avoiding the act. The alpha male lingers, then turns away.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 22 },
      { type: 'no_flag', flag: 'pregnant' },
      { type: 'no_flag', flag: 'mated-this-season' },
      { type: 'no_flag', flag: 'pups-dependent' },
    ],
    weight: 15,
    cooldown: 12,
    tags: ['reproduction', 'social'],
  },

  {
    id: 'wolf-courtship-howl',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The alpha pair separates from the pack at dusk. They stand together on the ridge, flanks pressed, and howl in unison. Not the full territorial chorus. Something quieter. Two voices interweaving, carrying across the frozen lake.',
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'age_range', min: 22 },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['mating', 'social', 'pack'],
  },

  {
    id: 'wolf-denning-prep',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'You dig. Claws scraping through frozen soil and tangled roots. Mouthfuls of earth hauled from the narrowing tunnel. The chamber at the end must be large enough to turn around in, deep enough to hold warmth. You line it with fur pulled from your own winter coat.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'den-prepared' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pregnant' },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 18,
    cooldown: 12,
    tags: ['mating', 'reproduction', 'den'],
  },

  {
    id: 'wolf-pup-survival',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'The smallest pup is not thriving. Thin, quiet, eyes dull. Last to nurse, always pushed aside when food arrives. The others are growing fat.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    choices: [
      {
        id: 'feed-runt',
        label: 'Give the runt extra food',
        description: 'Regurgitate a private meal for the weakest pup',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'focus-strong',
        label: 'Focus resources on the healthy pups',
        description: 'The strong survive.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 10,
    cooldown: 10,
    tags: ['reproduction', 'pup', 'pack'],
  },

  {
    id: 'wolf-pup-independence',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The pups are rangy, long-legged yearlings with adult teeth. They join the hunts now, running at the edges of the formation, learning the chase. One brought down a snowshoe hare on its own last week. The pack greeted it the same as any returning hunter.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'pups-just-independent' },
      { type: 'remove_flag', flag: 'pups-dependent' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 16,
    cooldown: 12,
    tags: ['reproduction', 'pup', 'pack', 'dispersal'],
  },

  // ══════════════════════════════════════════════
  //  COOPERATIVE HUNTING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-coordinated-elk-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Elk herd grazing in the valley below. The scent of them fills the air. {{npc.ally.name}} is with you. Together you can drive and ambush.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'wolf-elk-ambush',
        label: 'Drive to ambush',
        description: 'Drive the elk toward {{npc.ally.name}}\'s ambush point.',
        narrativeResult: 'You burst from cover. The elk scatter. A cow stumbles on the icy slope and {{npc.ally.name}} hits her from behind. You feed together.',
        statEffects: [{ stat: StatId.ADV, amount: 3, label: '+ADV' }],
        consequences: [{ type: 'modify_weight', amount: 8 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'wolf-elk-chase-weakest',
        label: 'Pursue the weakest',
        description: 'Target a calf or injured animal. Safer, less food.',
        narrativeResult: 'You and {{npc.ally.name}} single out a lagging calf and run it down through deep snow. A smaller meal, but a certain one.',
        statEffects: [],
        consequences: [{ type: 'modify_weight', amount: 5 }],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wolf-elk-abort',
        label: 'Call off the hunt',
        description: 'The elk are too alert. Save your energy.',
        narrativeResult: 'You and {{npc.ally.name}} slink back into the timber.',
        statEffects: [{ stat: StatId.HOM, amount: 2, label: '+HOM' }],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-elk-kick',
        chance: 0.15,
        conditions: [],
        narrativeText: 'The elk cow kicks as you close in. A hoof catches your ribs.',
        statEffects: [{ stat: StatId.HEA, amount: -6, label: '-HEA' }],
        consequences: [{ type: 'add_injury', injuryId: 'elk-kick', severity: 0 }],
      },
      {
        eventId: 'wolf-ally-wounded',
        chance: 0.10,
        conditions: [],
        narrativeText: '{{npc.ally.name}} takes a glancing hoof-blow. They limp but continue.',
        statEffects: [{ stat: StatId.TRA, amount: 3, label: '+TRA' }],
        consequences: [],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_npc', npcType: 'ally' },
      { type: 'season', seasons: ['winter', 'autumn'] },
    ],
    weight: 9,
    cooldown: 6,
    tags: ['foraging', 'social'],
  },
  {
    id: 'wolf-coordinated-moose-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A bull moose in a frozen streambed. The smell of it is overwhelming: rut, browse, wet hide. You and {{npc.ally.name}} are starving. A moose can kill a wolf with a single kick. But the reward is weeks of food.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'wolf-moose-attack',
        label: 'Attack together',
        description: 'One distracts, one hamstrings.',
        narrativeResult: 'The fight lasts twenty minutes. The moose kicks, stomps, and swings its antlers. You and {{npc.ally.name}} alternate attacks. The moose stumbles. You bring it down. Weeks of food.',
        statEffects: [{ stat: StatId.ADV, amount: 5, label: '+ADV' }],
        consequences: [{ type: 'modify_weight', amount: 15 }],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Killed by a moose during a pack hunt',
          statModifiers: [{ stat: StatId.HEA, factor: -0.0005 }],
        },
      },
      {
        id: 'wolf-moose-retreat',
        label: 'It is too dangerous',
        description: 'A moose this size could kill you both.',
        narrativeResult: 'You back away. The moose snorts and holds its ground. Hunger remains.',
        statEffects: [{ stat: StatId.HOM, amount: 4, label: '+HOM' }],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-moose-stomp',
        chance: 0.20,
        conditions: [],
        narrativeText: 'The moose rears and brings both front hooves down. You dodge, but not far enough.',
        statEffects: [{ stat: StatId.HEA, amount: -10, label: '-HEA' }],
        consequences: [{ type: 'add_injury', injuryId: 'elk-kick', severity: 1 }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_npc', npcType: 'ally' },
      { type: 'season', seasons: ['winter'] },
      { type: 'weight_below', threshold: 60 },
    ],
    weight: 7,
    cooldown: 10,
    tags: ['foraging', 'danger'],
  },
  {
    id: 'wolf-lone-hunt-penalty',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'Hunting alone. No packmates to drive prey or take turns at the chase. You catch a snowshoe hare. A few mouthfuls for an animal that needs elk.',
    statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
    consequences: [{ type: 'modify_weight', amount: -1 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'no_npc', npcType: 'ally' },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['foraging'],
  },

  // ══════════════════════════════════════════════
  //  INFANTICIDE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-new-alpha-pup-threat',
    type: 'active',
    category: 'social',
    narrativeText: 'A rival wolf stands over the den entrance, lips curled. It has been challenging the hierarchy for weeks. The rival\'s scent is thick with aggression hormones. The pups are inside.',
    statEffects: [{ stat: StatId.TRA, amount: 6, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'wolf-pup-defend',
        label: 'Defend the pups',
        description: 'Fight the rival to protect your offspring.',
        narrativeResult: 'You throw yourself at the rival. Teeth flash. Blood sprays across the snow. The rival backs down. For now.',
        statEffects: [{ stat: StatId.ADV, amount: 5, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'wolf-pup-submit',
        label: 'Submit to the rival',
        description: 'Accept the new hierarchy. The pups may not survive.',
        narrativeResult: 'You roll onto your back, exposing your throat. The rival sniffs you and turns toward the den. The pups\' cries change pitch. When the rival emerges, its muzzle is dark.',
        statEffects: [{ stat: StatId.TRA, amount: 10, label: '+TRA' }],
        consequences: [{ type: 'set_flag', flag: 'infanticide-occurred' }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'wolf-pup-flee',
        label: 'Flee with the pups',
        description: 'Grab a pup and run. You cannot save them all.',
        narrativeResult: 'You snatch the nearest pup by the scruff and bolt into the forest. The rival does not follow. You have one pup. The others are lost.',
        statEffects: [{ stat: StatId.TRA, amount: 8, label: '+TRA' }],
        consequences: [{ type: 'modify_territory', qualityChange: -15 }],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-pup-defend-injury',
        chance: 0.20,
        conditions: [],
        narrativeText: 'Deep bite wounds on your shoulder and neck from the fight.',
        statEffects: [{ stat: StatId.HEA, amount: -8, label: '-HEA' }],
        consequences: [{ type: 'add_injury', injuryId: 'dominance-bite', severity: 1 }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
    ],
    weight: 4,
    cooldown: 12,
    tags: ['social', 'confrontation'],
    footnote: 'Infanticide by rival wolves has been documented in wild populations. When pack leadership changes, the new dominant pair may kill the previous alpha\'s offspring — a behavior shared with many social mammals including lions and langur monkeys.',
  },
  {
    id: 'wolf-dispersal-pressure',
    type: 'passive',
    category: 'social',
    narrativeText: 'The alpha pair tolerates you less. A hard stare when you approach the kill. A growl when you sleep too close. You find yourself sleeping at the pack\'s edge, pacing the territory boundary before dawn.',
    statEffects: [{ stat: StatId.NOV, amount: 5, label: '+NOV' }, { stat: StatId.TRA, amount: 3, label: '+TRA' }],
    consequences: [{ type: 'set_flag', flag: 'dispersal-pressure' }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'age_range', min: 18, max: 36 },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'dispersal-pressure' },
      { type: 'no_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['social'],
  },
  {
    id: 'wolf-dispersal-decision',
    type: 'active',
    category: 'social',
    narrativeText: 'You stand at the boundary of your natal territory at dawn. Unfamiliar ridges ahead. The pack\'s scent behind you. The alpha female snapped at you yesterday when you approached the pups.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'wolf-disperse-leave',
        label: 'Leave the pack',
        description: 'Step across the scent line.',
        narrativeResult: 'You cross without looking back. The familiar howls fade. You enter territory that belongs to no one, or to someone who will try to kill you.',
        statEffects: [{ stat: StatId.NOV, amount: 8, label: '+NOV' }, { stat: StatId.TRA, amount: 5, label: '+TRA' }],
        consequences: [{ type: 'set_flag', flag: 'dispersal-begun' }, { type: 'remove_flag', flag: 'dispersal-pressure' }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'wolf-disperse-stay',
        label: 'Stay with the pack',
        description: 'Accept subordination.',
        narrativeResult: 'You turn back. The pack accepts your return with indifference. You eat last and sleep alone.',
        statEffects: [{ stat: StatId.TRA, amount: 3, label: '+TRA' }],
        consequences: [{ type: 'remove_flag', flag: 'dispersal-pressure' }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'dispersal-pressure' },
      { type: 'no_flag', flag: 'dispersal-begun' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social'],
  },
  {
    id: 'wolf-dispersal-journey-danger',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A road cuts through the forest. The smell of asphalt and exhaust. Vehicles roar past. You must cross to continue.',
    statEffects: [{ stat: StatId.TRA, amount: 4, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'wolf-road-dash',
        label: 'Dash across',
        description: 'Sprint across during a gap in traffic.',
        narrativeResult: 'You bolt across four lanes. Claws scrabbling on asphalt. A horn blares. Wind from a passing truck buffets you. Then you are across.',
        statEffects: [{ stat: StatId.ADV, amount: 5, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Struck by a vehicle while crossing a highway',
          statModifiers: [{ stat: StatId.WIS, factor: -0.0004 }],
        },
      },
      {
        id: 'wolf-road-wait',
        label: 'Wait for nightfall',
        description: 'Traffic thins after dark. Safer, but costs time.',
        narrativeResult: 'You lie in the ditch until deep night. You cross in darkness, guided by smell and hearing.',
        statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['danger', 'exploration'],
  },
  {
    id: 'wolf-dispersal-rival-territory',
    type: 'active',
    category: 'social',
    narrativeText: 'Fresh urine and scratches on every prominent tree. Another pack\'s territory. In the distance, howling: a territorial call. They know you are here.',
    statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'wolf-rival-sneak',
        label: 'Move through quietly',
        description: 'Travel at night, avoid the pack\'s core area.',
        narrativeResult: 'You travel through the darkest hours, hugging ravines and streambeds to mask your scent. By dawn, you have crossed the territory.',
        statEffects: [{ stat: StatId.NOV, amount: 4, label: '+NOV' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wolf-rival-fight',
        label: 'Stand your ground',
        description: 'If they find you, fight.',
        narrativeResult: 'A patrol wolf finds you at dusk. You fight in the snow, snapping and circling, until you pin it by the throat. It submits. You release it and move on.',
        statEffects: [{ stat: StatId.ADV, amount: 5, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-rival-pack-attack',
        chance: 0.12,
        conditions: [],
        narrativeText: 'The patrol was not alone. Two more wolves emerge from the trees. The fight becomes a retreat.',
        statEffects: [{ stat: StatId.HEA, amount: -8, label: '-HEA' }],
        consequences: [{ type: 'add_injury', injuryId: 'dominance-bite', severity: 1 }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'confrontation'],
  },
  {
    id: 'wolf-dispersal-settlement',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A valley with no fresh wolf scent. Elk sign everywhere. Clean water. Ridges that funnel prey and provide denning sites.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'wolf-settle-claim',
        label: 'Claim this territory',
        description: 'Begin scent-marking and establish your claim.',
        narrativeResult: 'You spend days urinating on every prominent feature, scratching trees, howling from the ridgeline. The territory is yours. Now you need a mate.',
        statEffects: [{ stat: StatId.NOV, amount: -5, label: '-NOV' }, { stat: StatId.WIS, amount: 5, label: '+WIS' }],
        consequences: [
          { type: 'set_flag', flag: 'dispersal-settled' },
          { type: 'remove_flag', flag: 'dispersal-begun' },
          { type: 'modify_territory', qualityChange: 20 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wolf-settle-continue',
        label: 'Keep searching',
        description: 'This valley is good, but there might be better.',
        narrativeResult: 'You move on. Winter approaches and you are still alone.',
        statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
      { type: 'age_range', min: 24 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['exploration'],
  },
  {
    id: 'wolf-deep-freeze',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Three-day blizzard. Minus forty. You and the pack huddle behind a fallen spruce, noses tucked under tails, fur thick with rime ice. Hunting is impossible until the storm breaks.',
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    consequences: [{ type: 'modify_weight', amount: -2 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'weather', weatherTypes: ['blizzard'] },
    ],
    weight: 9,
    cooldown: 4,
    tags: ['environmental'],
  },
];

export const GRAY_WOLF_EVENTS: GameEvent[] = [
  ...wolfEvents,
];
