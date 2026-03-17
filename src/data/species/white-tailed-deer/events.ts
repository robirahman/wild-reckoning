import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';
import { allEvents as sharedEvents } from '../../events/index';

const deerEvents: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-acorn-mast-year',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'The ground smells of tannin and oil. Acorns everywhere underfoot, cracking under your hooves faster than you can eat them. You lower your head and chew, steady and constant, the bitter nutmeat filling your rumen. Your flanks are thickening.',
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 4 },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 14,
    cooldown: 8,
    tags: ['foraging', 'food', 'seasonal'],
  },

  {
    id: 'deer-mushroom-patch',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'Damp earth smell, strong, at the base of a stump. Pale soft things pushing through the leaf litter. You nose at them and bite. The taste is clean, mineral, good. Your body wants more.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' },
    ],
    subEvents: [
      {
        eventId: 'deer-mushroom-toxicity',
        chance: 0.12,
        conditions: [],
        narrativeText:
          'Metallic taste, sudden, at the back of your throat. Your gut clenches. A wave of heat rolls through your belly and your legs go soft. Something wrong in what you ate.',
        footnote: '(Poisoned by toxic mushroom)',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['foraging', 'food', 'fungi'],
  },

  {
    id: 'deer-apple-orchard',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'Sweet rot on the wind, heavy, pulling you forward. Past the last cover you can see fruit on the ground, split open, fermenting. A lit shape nearby with human-scent pouring from it. Chain-clink and dog smell from the same direction. Open ground between you and the food.',
    statEffects: [],
    choices: [
      {
        id: 'raid-orchard',
        label: 'Slip into the orchard and feed',
        description: 'Rich food, but the dog and the human are close',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'raided-orchard' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'A loud crack from the lit shape. Then nothing.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-orchard',
        label: 'Turn back to the forest',
        description: 'Safer, but the hunger stays',
        statEffects: [
          { stat: StatId.TRA, amount: -2, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 9,
    cooldown: 8,
    tags: ['foraging', 'food', 'human', 'danger'],
  },

  {
    id: 'deer-corn-field-raid',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'Tall dry stalks, taller than you, rustling. The pale light overhead makes the open ground glow. You smell starch and sugar, dense, and hear the soft tearing and crunching of other deer already feeding inside. Your gut pulls you forward. But corn swells in the rumen, presses against your lungs if you eat too much.',
    statEffects: [],
    choices: [
      {
        id: 'gorge-corn',
        label: 'Gorge on the corn',
        description: 'Eat until full, but your gut may bloat',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
          { type: 'set_flag', flag: 'corn-gorge' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'graze-cautiously',
        label: 'Graze cautiously and leave early',
        description: 'A few mouthfuls, then back to cover',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 7,
    tags: ['foraging', 'food', 'human', 'nocturnal'],
  },

  {
    id: 'deer-clover-meadow',
    type: 'passive',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'You step past the last cover and into low green growth, thick, buzzing with small flying things. The smell is sweet. You lower your head and graze. Tender, wet, easy to chew. Your gut fills and the tightness in your flanks loosens. You eat steadily, ears turning, jaw working.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'food', 'peaceful'],
  },

  {
    id: 'deer-browse-line',
    type: 'passive',
    category: 'foraging',
    simulated: true,
    narrativeText:
      'Every branch you can reach has been stripped to bare wood. You stretch your neck up, lips working at a twig just past your mouth, and come away with nothing. The smell of other deer is heavy here. You circle wider, testing stems, finding only bark and dry pith.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter', 'spring'] },
    ],
    weight: 11,
    cooldown: 6,
    tags: ['foraging', 'food', 'competition'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-coyote-pack',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText:
      'Yipping. Three directions at once, threading between the trunks. You catch the scent, sharp and musky, from downwind. Small shapes moving fast through the understory, low to the ground, circling. One darts toward the small ones and snaps. The doe nearest you stamps, a hard crack against the frozen ground. The shapes pull back, but they do not leave.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-coyotes',
        label: 'Flee with the herd',
        description: 'Run with the others',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Wire across your chest. Your legs tangle. They close the gap.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'defend-fawns',
        label: 'Stand and defend with hooves',
        description: 'Your hooves are sharp, but there are many of them',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'Too many. They came from behind while you struck at the one in front.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 9,
    cooldown: 7,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-bobcat-stalk',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'Your ears lock forward. Something in the branches, motionless. Cat-smell, faint. You freeze and your nostrils open wide. A spotted shape on a low limb, flat against the bark, its eyes fixed on you. You stomp once. It does not move. You stomp again. Its gaze shifts to something smaller in the brush below, and the pressure in your chest releases. You blow out hard through your nose and back away.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-eagle-fawn-threat',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText:
      'Shadow sweeps the ground. You look up. Wide dark shape circling, low, silent. It tilts and drops lower. Your fawn is in the open, pressed flat, spotted coat against the grass. The shape is descending toward it.',
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'shield-fawn',
        label: 'Stand over the fawn and rear up',
        description: 'Stand over the fawn, rear up, make yourself large',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'flee-with-fawn',
        label: 'Bolt for the tree cover',
        description: 'Run for the cover of branches overhead',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'has-fawns' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 7,
    cooldown: 10,
    tags: ['predator', 'danger', 'fawn'],
  },

  {
    id: 'deer-hunter-season',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText:
      'New smells everywhere. Oil, acrid smoke, chemical urine that smells almost like yours but wrong. Vehicles on the logging roads at dawn. Upright shapes moving slowly between the trunks. A loud crack echoes through the hardwoods. Silence. Another crack. The air tastes of burned powder. Your legs want to run but you do not know which direction is safe.',
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'freeze-hunter',
        label: 'Freeze and hold perfectly still',
        description: 'Hold still. Movement is what draws attention.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'A crack. Impact behind the shoulder. Your legs fold.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'bolt-hunter',
        label: 'Bolt at full speed through the timber',
        description: 'Run, but the crashing gives away where you are',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'Running full out. Then a blow to the ribs that spins you sideways. The ground comes up fast.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['predator', 'danger', 'human', 'seasonal'],
  },

  {
    id: 'deer-feral-dog-pack',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText:
      'Three shapes at a loping run from the edge of the human-scented area. Dog-smell, strong, mixed with garbage and old meat. They move wrong, not like the small yipping ones, not like any predator you know. Erratic, fast, loud. One is large with a heavy jaw. The others spread wide. They have your scent and they are closing.',
    statEffects: [
      { stat: StatId.TRA, amount: 14, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'sprint-dogs',
        label: 'Sprint for the deep woods',
        description: 'You are faster in a straight line, if the ground is clear',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Wire across your path. Your legs tangle. They reach you before you can stand.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'turn-fight-dogs',
        label: 'Turn and fight with your forefeet',
        description: 'Your hooves are sharp but they outnumber you',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'Teeth on your hind leg, then your flank. You go down. They do not stop.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger', 'human'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-bachelor-group',
    type: 'passive',
    category: 'social',
    simulated: true,
    narrativeText:
      'Five other bucks, moving together through the hardwoods. Velvet antlers, no tension in their bodies. You fall in alongside. One bumps his rack against yours, a light push, and you push back. Bone clacks on bone. Neither of you presses. You walk together, ears easy, grazing the same browse line.',
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'no_flag', flag: 'rut-active' },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['social', 'herd', 'seasonal'],
  },

  {
    id: 'deer-doe-hierarchy',
    type: 'active',
    category: 'social',
    simulated: true,
    narrativeText:
      'A doe walks into where you are feeding. Ears flat, front hoof raised. She is heavier than you and her scent has been on this ground longer. She strikes at your shoulder, a hard downward blow. You step back. She follows.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'submit-doe',
        label: 'Lower your head and yield',
        description: 'Give way. Feed and bed after she does.',
        narrativeResult:
          'You drop your ears and turn away. The blow lands across your shoulder and you do not return it. She watches you go. You will eat after she finishes and bed where she does not.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'challenge-doe',
        label: 'Rear up and strike back',
        description: 'Strike back. Take the feeding ground.',
        narrativeResult:
          'You rear up and your forelegs come down on her head. She rears to meet you. Hooves crack against bone and hide, ears flat. You land a blow squarely on her shoulder that staggers her. Another. She breaks off and trots away with her head low.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'challenged-doe-hierarchy' },
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-doe-foreleg-strike-sub',
        chance: 0.15,
        narrativeText:
          'Her foreleg comes down hard on your ribs. A sharp, cracking impact that drives the air from your lungs. You feel something give beneath the blow, cartilage or bone flexing past its limit.',
        footnote: '(Foreleg strike injury)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'doe-foreleg-strike', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 9,
    cooldown: 8,
    tags: ['social', 'herd', 'hierarchy', 'female-competition'],
  },

  {
    id: 'deer-fawn-play',
    type: 'passive',
    category: 'social',
    simulated: true,
    narrativeText:
      'The small ones are running in circles, legs splaying on the turns. One leaps straight up and tumbles into the grass. Another runs into your flank and bounces off, then keeps going. You stand and watch them, ears easy, chewing. Your body is loose.',
    statEffects: [
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'has_flag', flag: 'has-fawns' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'psychological', 'fawn'],
  },

  {
    id: 'deer-territorial-scrape',
    type: 'active',
    category: 'social',
    simulated: true,
    narrativeText:
      'The urge pulls you to a low branch at the edge of a trail. You hook it with your tines and twist until bark peels away. Then your head goes down and your front hooves scrape the earth bare. You urinate over the tarsal glands on your hind legs and into the raw dirt. The oily scent rises, thick, yours. {{npc.rival.name}} will smell it.',
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'territorial-scrape-active' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['social', 'territorial', 'rut'],
  },

  {
    id: 'deer-herd-alarm',
    type: 'passive',
    category: 'social',
    simulated: true,
    narrativeText:
      'A sharp snort from the far edge of the clearing. The doe there has her tail up, white underside flashing. Every head comes up at once. Tails up. You do not know what she smelled or heard. Your tail goes up too and your front hoof stamps the ground once, twice. Then you are all running, white tails bouncing through the fading light.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'herd', 'alarm'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-antler-velvet',
    type: 'passive',
    category: 'seasonal',
    simulated: true,
    narrativeText:
      'The itching at the top of your skull has been building for weeks, deep, in the bone. Warm soft knobs are pushing up where last year\'s antlers broke away. Blood pulses through the velvet skin over them. They ache when you brush a branch. Your ribs feel thin. The new growth is pulling from your own skeleton.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'antlers-growing' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'antlers-growing' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['seasonal', 'health', 'antler'],
  },

  {
    id: 'deer-summer-flies',
    type: 'passive',
    category: 'seasonal',
    simulated: true,
    narrativeText:
      'The biting things come in clouds with the heat. Your skin twitches in rippling waves. You stamp, flick your ears, swing your head to bite at the one on your flank. Another lands on your rump. You can feel them crawling in the thin skin behind your ears and between your legs.',
    statEffects: [
      { stat: StatId.IMM, amount: 5, label: '+IMM' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.CLI, amount: 3, label: '+CLI' },
    ],
    subEvents: [
      {
        eventId: 'deer-tick-infestation',
        chance: 0.20,
        conditions: [
          { type: 'no_parasite', parasiteId: 'deer-tick' },
        ],
        narrativeText:
          'Hard lumps behind your ears, attached, swelling. You cannot scratch them off. The itch deepens into a dull, warm pressure that does not stop.',
        footnote: '(Infested with deer ticks)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'deer-tick', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 14,
    cooldown: 5,
    tags: ['seasonal', 'health', 'parasite'],
  },

  {
    id: 'deer-autumn-rut',
    type: 'active',
    category: 'seasonal',
    simulated: true,
    narrativeText:
      'Your neck is swelling. The velvet on your antlers dries, cracks, peels in strips that you scrub against bark until hard bone shows underneath. You are not eating. You cannot hold still. A smell pulls you, does, and a heat in your muscles drives you toward every other buck you scent. Your body wants to move, to push, to fight.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rut-active' },
      { type: 'remove_flag', flag: 'antlers-growing' },
      { type: 'modify_weight', amount: -4 },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-exhaustion',
        chance: 0.25,
        conditions: [
          { type: 'stat_above', stat: StatId.HOM, threshold: 60 },
        ],
        narrativeText:
          'Three days on your feet. No food. Your ribs show through the swollen neck. Your legs tremble when you stop moving.',
        footnote: '(Rut exhaustion)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'rut-active' },
      { type: 'age_range', min: 18 },
    ],
    weight: 22,
    tags: ['seasonal', 'rut', 'mating'],
  },

  {
    id: 'deer-winter-yard',
    type: 'passive',
    category: 'seasonal',
    simulated: true,
    narrativeText:
      'The snow buries your legs to the chest in open ground. Here, under dense branches, it is packed down by dozens of hooves. Other deer everywhere, their scent thick in the still air. The wind does not reach under the canopy. Packed trails connect the bedding areas to what browse remains. You fold your legs and settle among the others. Warm bodies on either side.',
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'wintering-in-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
      { type: 'no_flag', flag: 'wintering-in-yard' },
    ],
    weight: 18,
    tags: ['seasonal', 'weather', 'herd'],
  },

  // Rut ends: clears rut flags so the cycle resets each year
  {
    id: 'deer-rut-ends',
    type: 'passive',
    category: 'seasonal',
    simulated: true,
    narrativeText:
      'The swelling in your neck is going down. The drive that kept you moving has drained out. You are gaunt, ribs visible, haunches wasted. The does have scattered. Your antlers feel heavy and loose on the pedicles. You eat for the first time in days and your rumen cramps around the food.',
    statEffects: [
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.ADV, amount: -8, label: '-ADV' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'rut-active' },
      { type: 'remove_flag', flag: 'fought-rut-rival' },
      { type: 'remove_flag', flag: 'lost-rut-contest' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['winter'] },
      { type: 'has_flag', flag: 'rut-active' },
    ],
    weight: 25,
    tags: ['seasonal', 'rut'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-forest-fire',
    type: 'active',
    category: 'environmental',
    simulated: true,
    narrativeText:
      'Smoke smell, thickening, before you see anything. It coats the back of your throat and blanks your nose. Then bright flickering on the ground, moving, crackling. Heat pushes against your face. Your nose is useless. You cannot tell what is behind you or ahead. Everything around you is running.',
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
    ],
    choices: [
      {
        id: 'flee-downhill',
        label: 'Flee downhill toward the creek',
        description: 'Water may stop the fire, but the valley could trap smoke',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'Heat above and behind and then in front. Smoke fills your lungs. Your legs stop working.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-crosswind',
        label: 'Run crosswind to flank the fire',
        description: 'A longer escape, but you avoid running into the head of the blaze',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'The heat shifts direction. Bright flickering ahead where there was none. No way through.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 4,
    cooldown: 20,
    tags: ['environmental', 'danger', 'fire'],
  },

  {
    id: 'deer-flooding-creek',
    type: 'active',
    category: 'environmental',
    simulated: true,
    narrativeText:
      'The water that was leg-deep is now brown, fast, churning over its banks. Branches and debris race past. The crossing you used before is gone under the current. You can smell browse on the other side, close, but the water between is deep and loud.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'swim-flood',
        label: 'Swim across',
        description: 'You are a strong swimmer, but the current is powerful and the water is frigid',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.CLI, amount: 5, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The current pushes you sideways into tangled branches under the surface. Your head goes under and stays.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-floodwater',
        label: 'Wait for the water to recede',
        description: 'Patience, but browse is scarce on this bank',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'autumn'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'water', 'danger'],
  },

  {
    id: 'deer-ice-storm',
    type: 'passive',
    category: 'environmental',
    simulated: true,
    narrativeText:
      'Cold rain all night. By morning everything is coated in ice, hard and slick. You scrape at a frozen branch with your lower teeth and get nothing but ice chips. Your hooves slide on the glazed ground with every step. A branch somewhere cracks and crashes down. The browse is locked under a layer your teeth cannot break.',
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 10,
    tags: ['environmental', 'weather', 'seasonal'],
  },

  {
    id: 'deer-fallen-tree-shelter',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'A big fallen trunk across the slope, roots torn up. Dry ground underneath, deep leaves, no wind. You fold your legs and settle in. Your body warms the small space. The air is still here. You bring up your cud and chew.',
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [],
    weight: 9,
    cooldown: 5,
    tags: ['environmental', 'shelter', 'rest'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-scout-winter-yard',
    type: 'active',
    category: 'migration',
    simulated: true,
    narrativeText:
      'The light has changed. Frost on the ground two mornings running, and a pull in your body that says move. The scent-trails of other deer lead in one direction, away. You follow, nose to the wind, toward dense conifer smell and the old packed trails you walked last cold season.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'scouting-winter-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'scouting-winter-yard' },
      { type: 'no_flag', flag: 'wintering-in-yard' },
    ],
    weight: 15,
    cooldown: 12,
    tags: ['migration', 'seasonal'],
  },

  {
    id: 'deer-travel-hazards',
    type: 'active',
    category: 'migration',
    simulated: true,
    narrativeText:
      'Hard flat ground ahead, the chemical strip. You stand at the last cover, ears forward. Bright paired lights sweep past, fast, with a rush of hot wind and noise. The smell is tar and rubber and old blood. Dark stain on the surface. Cover on the other side, close, but the gap between the fast-moving things is narrow.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-road',
        label: 'Cross the road now',
        description: 'Sprint across during a gap in traffic',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'Bright light, filling your eyes. Impact. The ground spins.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'wait-dawn',
        label: 'Wait for dawn when traffic thins',
        description: 'Safer, but you lose time and remain exposed',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Halfway across. Lights from a direction you were not watching. Too fast to clear.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'scouting-winter-yard' },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['migration', 'danger', 'human'],
  },

  {
    id: 'deer-spring-return',
    type: 'passive',
    category: 'migration',
    simulated: true,
    narrativeText:
      'Bare earth showing on the warm-facing slopes. Wet dirt smell, strong, and underneath it the faint green of new growth. The others are leaving the yard in small groups. A pull in your body, uphill, toward open ground. You are thin, ribs under dull coat, but your legs work. You step out from under the dense branches and the warmth hits your back.',
    statEffects: [
      { stat: StatId.CLI, amount: -5, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'wintering-in-yard' },
      { type: 'remove_flag', flag: 'scouting-winter-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring'] },
      { type: 'has_flag', flag: 'wintering-in-yard' },
    ],
    weight: 20,
    tags: ['migration', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  // Rut competition, healthy antlers
  {
    id: 'deer-rut-competition',
    type: 'active',
    category: 'reproduction',
    simulated: true,
    narrativeText:
      'A guttural grunt-wheeze from the timber. Then he steps out. Heavy rack, wide beams, long tines. The smell of tarsal glands and urine rolls off him. He is as large as you, maybe larger. Does on the ridge, watching. {{npc.rival.name}} lowers his head and the antlers come forward.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'fight-rival-buck',
        label: 'Lower your antlers and charge',
        description: 'Lock antlers and push. One of you will break.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'Your antlers lock and will not come apart. You pull, twist, push. Neither of you can separate. Your legs give out first.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'retreat-rival-buck',
        label: 'Turn and retreat',
        description: 'Turn away. Keep your body intact.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'lost-rut-contest' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-antler-injury',
        chance: 0.20,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'A crack at the base of your brow tine. The piece breaks away and falls. A gash above your eye opens and blood runs into the fur of your face.',
        footnote: '(Antler tine broken in rut combat)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'antler-break', severity: 0, bodyPart: 'right antler' },
        ],
      },
      {
        eventId: 'deer-rut-puncture',
        chance: 0.25,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'He is gone. The drive drains out of your muscles and a deep hot pain surfaces in your shoulder. A round hole in the hide, dark with blood, where a tine went through. The edges are already swelling shut around whatever went in with it.',
        footnote: '(Puncture wound from antler tine)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-puncture-wound', severity: 0, bodyPart: 'right shoulder' },
        ],
      },
      {
        eventId: 'deer-rut-eye-gouge',
        chance: 0.08,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
    narrativeText:
          'A tine rakes across your face and catches the edge of your eye. White flash. Blood and fluid close the eye. You stagger sideways, half your field of vision gone. When the swelling eases enough to open it, what comes through is a smeared blur.',
        footnote: '(Eye injured by antler tine, a common rut injury in mature bucks)',
        statEffects: [
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-eye-injury', severity: 0, bodyPart: 'right eye' },
        ],
      },
      {
        eventId: 'deer-rut-laceration',
        chance: 0.15,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'As you pull apart, his tines drag across your flank, peeling back a strip of hide from shoulder to hip. Raw, weeping, but shallow. The air stings on the exposed tissue.',
        footnote: '(Laceration from antler tines)',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-laceration', severity: 0, bodyPart: 'right flank' },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'has_flag', flag: 'rut-active' },
      { type: 'no_injury', injuryId: 'antler-break' },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['mating', 'social', 'danger', 'rut'],
  },

  // Rut competition: fighting with a broken antler (higher risk, worse odds)
  {
    id: 'deer-rut-competition-injured',
    type: 'active',
    category: 'reproduction',
    simulated: true,
    narrativeText:
      'Another buck from the treeline, grunting, raking the ground. {{npc.rival.name}} comes straight at you, head low, full rack forward. He does not slow. Your broken tine catches air where bone should meet bone. The side with the missing tine offers nothing to lock against.',
    statEffects: [
      { stat: StatId.ADV, amount: 14, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'fight-rival-buck-injured',
        label: 'Fight anyway, lopsided rack and all',
        description: 'Your broken side cannot hold against his full rack.',
        statEffects: [
          { stat: StatId.HOM, amount: 15, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'His tines slip past your broken side and into your chest. Deep. Your front legs buckle.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'bluff-rival-buck-injured',
        label: 'Bluff: angle your good side toward him',
        description: 'Show the intact side. He may not see the break.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'retreat-rival-buck-injured',
        label: 'Turn and retreat',
        description: 'Turn and go. Your rack cannot hold.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'lost-rut-contest' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-antler-worsen',
        chance: 0.35,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'The impact drives the crack in your main beam deeper. You feel the antler shift on the pedicle, bone grinding on bone when you move your head.',
        footnote: '(Antler damage worsened in combat)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'antler-break', severity: 1, bodyPart: 'right antler' },
        ],
      },
      {
        eventId: 'deer-rut-injured-puncture',
        chance: 0.35,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'A tine drives into the muscle of your neck from the open side. Full force of his charge behind it. You wrench free. The hole is deep, already hot.',
        footnote: '(Puncture wound: broken antler left an opening)',
        statEffects: [
          { stat: StatId.HEA, amount: -7, label: '-HEA' },
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-puncture-wound', severity: 0, bodyPart: 'neck' },
        ],
      },
      {
        eventId: 'deer-rut-injured-eye-gouge',
        chance: 0.12,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'His tine slips past the broken side and rakes across your eye. White-hot pain, then the vision on that side goes dark. Blood sheets down your face. You stumble sideways, half your world gone.',
        footnote: '(Eye gouged: the broken antler could not protect your face)',
        statEffects: [
          { stat: StatId.HEA, amount: -10, label: '-HEA' },
          { stat: StatId.TRA, amount: 10, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-eye-injury', severity: 0, bodyPart: 'left eye' },
        ],
      },
      {
        eventId: 'deer-rut-injured-laceration',
        chance: 0.20,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'His tines score a long ragged line down your side as you pull away. Deeper than a glancing blow. Your broken rack could not deflect the angle.',
        footnote: '(Laceration from uneven engagement)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-laceration', severity: 0, bodyPart: 'left flank' },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'has_flag', flag: 'rut-active' },
      { type: 'has_injury', injuryId: 'antler-break' },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['mating', 'social', 'danger', 'rut'],
  },

  {
    id: 'deer-fawn-birth',
    type: 'passive',
    category: 'reproduction',
    simulated: true,
    narrativeText:
      'Tall grass, sheltered, wind blocked. You lie down on your side. Contractions come in waves, your abdomen working. Then fluid and pressure and the fawn is out, wet, small, steaming. You lick it with long firm strokes, pulling its scent deep into your nose. Within an hour it stands. It finds the udder and nurses. You will leave it here in the grass and it will lie flat and still until you return.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'has-fawns' },
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'has-fawns' },
      { type: 'age_range', min: 12 },
    ],
    weight: 18,
    cooldown: 12,
    tags: ['mating', 'fawn'],
  },

  {
    id: 'deer-fawn-defense',
    type: 'active',
    category: 'reproduction',
    simulated: true,
    narrativeText:
      'A small predator-shape nosing through the grass, zigzagging, following scent. Your fawn is there, flat against the earth, motionless. The predator has not found it yet but each pass brings it closer. Your fawn does not move. Your body is already running toward them.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'attack-coyote',
        label: 'Charge the coyote with hooves raised',
        description: 'Charge with forelegs raised',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'lure-away',
        label: 'Lure the coyote away from the fawn',
        description: 'Draw the predator away from where the fawn is lying',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'More of them came. They did not follow you. They went for the fawn, and then for you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'has-fawns' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['predator', 'fawn', 'danger', 'mating'],
  },

  // ══════════════════════════════════════════════
  //  NPC ENCOUNTER TRACKING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-rival-returns',
    type: 'active',
    category: 'social',
    simulated: true,
    narrativeText:
      '{{npc.rival.name}} at the far edge of the clearing. You know the scent and the scarred brow tine, the head cocked to one side. He stamps the ground, once, twice. Frozen earth sprays.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'confront-rival',
        label: 'Lower your antlers and advance',
        description: 'Head down, antlers forward',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'yield-rival',
        label: 'Turn and walk away',
        description: 'Turn away',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'confrontation', 'territorial'],
  },

  {
    id: 'deer-predator-stalks-again',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText:
      'That scent again. {{npc.predator.name}}. The same one, the same undertone of old blood and wet fur. You have smelled it on this trail before, at the water, near the bedding site. Closer each time.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-predator-npc',
        label: 'Sprint for dense cover',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: '{{npc.predator.name}} was faster than you in the dense brush.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stand-ground-predator',
        label: 'Stand your ground and stomp',
        description: 'Stomp. Blow. Hold your ground.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: '{{npc.predator.name}} did not back off. It came straight through your stomping.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-ally-warns',
    type: 'passive',
    category: 'social',
    simulated: true,
    narrativeText:
      '{{npc.ally.name}} at the tree line. Ears forward, tail up, flagging. You freeze and scan where she is looking. Movement in the underbrush, low, deliberate. You would not have smelled it from downwind.',
    statEffects: [
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'herd'],
  },
  {
    id: 'deer-ehd-midge-exposure',
    type: 'passive',
    category: 'health',
    simulated: true,
    narrativeText: 'Tiny biting things at the water\'s edge, too small to see. They find the thin skin inside your ears and the welts rise hot and itching.',
    statEffects: [{ stat: StatId.IMM, amount: 2, label: '+IMM' }],
    consequences: [],
    choices: [],
    subEvents: [
      {
        eventId: 'deer-ehd-infection',
        chance: 0.15,
        narrativeText: 'One of the midge bites delivers more than irritation. Within days, a high fever sets in.',
        statEffects: [],
        consequences: [{ type: 'add_parasite', parasiteId: 'epizootic-hemorrhagic-disease' }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
      { type: 'no_parasite', parasiteId: 'epizootic-hemorrhagic-disease' },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['health', 'environmental'],
  },
  {
    id: 'deer-coyote-fawn-threat',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: 'Two small predator-shapes at the meadow edge, pacing, watching. Their yipping carries across the grass. They circle toward where the small ones lie hidden.',
    statEffects: [{ stat: StatId.TRA, amount: 3, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'deer-coyote-charge',
        label: 'Charge the coyotes',
        description: 'Does will aggressively defend fawns, striking with forelegs.',
        narrativeResult: 'You rush the nearest one and strike with your front hooves. It yelps. Both pull back.',
        statEffects: [{ stat: StatId.ADV, amount: 2, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'deer-coyote-hide',
        label: 'Stay still and hidden',
        description: "Freeze and trust the fawns' camouflage.",
        narrativeResult: 'You freeze. They circle closer, sniffing. The small ones lie flat and still in the tall grass. The predators move on.',
        statEffects: [{ stat: StatId.TRA, amount: 2, label: '+TRA' }],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'fawns-dependent' },
      { type: 'population_above', speciesName: 'Coyote', threshold: -1 },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'confrontation'],
  },
  {
    id: 'deer-yearling-restlessness',
    type: 'passive',
    category: 'social',
    simulated: true,
    narrativeText: 'The larger bucks chase you from the feeding areas. Your mother no longer approaches when you are near. A restlessness in your legs will not settle. The scent trails here all belong to others.',
    statEffects: [{ stat: StatId.NOV, amount: 5, label: '+NOV' }, { stat: StatId.ADV, amount: 3, label: '+ADV' }],
    consequences: [{ type: 'set_flag', flag: 'dispersal-pressure' }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'age_range', min: 12, max: 24 },
      { type: 'sex', sex: 'male' },
      { type: 'no_flag', flag: 'dispersal-pressure' },
      { type: 'no_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['social'],
  },
  {
    id: 'deer-dispersal-push',
    type: 'active',
    category: 'social',
    simulated: true,
    narrativeText: 'The large buck lowers his head and charges. Not a bluff. His antlers catch you in the ribs and you stumble sideways. He turns and faces you again, head low.',
    statEffects: [{ stat: StatId.TRA, amount: 4, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'deer-push-leave',
        label: 'Leave the home range',
        description: 'There is no fighting a mature buck. Go.',
        narrativeResult: 'You trot past the creek. The scent-trails on the other side are not yours. Unfamiliar ground, unfamiliar smells.',
        statEffects: [{ stat: StatId.NOV, amount: 8, label: '+NOV' }],
        consequences: [{ type: 'set_flag', flag: 'dispersal-begun' }, { type: 'remove_flag', flag: 'dispersal-pressure' }],
        revocable: false,
        style: 'default',
      },
      {
        id: 'deer-push-resist',
        label: 'Resist',
        description: 'Lower your head and hold your ground.',
        narrativeResult: 'You hold, but he charges again. Antlers score your flank. You are driven from the clearing, bleeding.',
        statEffects: [{ stat: StatId.ADV, amount: 5, label: '+ADV' }],
        consequences: [
          { type: 'set_flag', flag: 'dispersal-begun' },
          { type: 'remove_flag', flag: 'dispersal-pressure' },
          { type: 'add_injury', injuryId: 'antler-wound', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'dispersal-pressure' },
      { type: 'no_flag', flag: 'dispersal-begun' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'confrontation'],
  },
  {
    id: 'deer-dispersal-road-crossing',
    type: 'active',
    category: 'environmental',
    simulated: true,
    narrativeText: 'The chemical strip again, wider this time. Heat rises off the dark surface. The roar of fast-moving things is constant. You can smell water and dense cover on the far side.',
    statEffects: [{ stat: StatId.TRA, amount: 4, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'deer-road-cross',
        label: 'Cross the highway',
        description: 'Wait for a gap and sprint across.',
        narrativeResult: 'You burst from cover and bound across. Screeching behind you. You crash into brush on the far side, legs shaking.',
        statEffects: [{ stat: StatId.ADV, amount: 4, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.07,
          cause: 'Struck by a vehicle while crossing a highway',
          statModifiers: [{ stat: StatId.WIS, factor: -0.0005 }],
        },
      },
      {
        id: 'deer-road-follow',
        label: 'Follow the road looking for a crossing',
        description: 'There may be a culvert or underpass.',
        narrativeResult: 'You follow the edge until you find a low tunnel under the hard surface. Stagnant water smell, but you squeeze through. Cover on the other side.',
        statEffects: [{ stat: StatId.HOM, amount: 2, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['danger', 'exploration'],
  },
  {
    id: 'deer-dispersal-new-range',
    type: 'active',
    category: 'environmental',
    simulated: true,
    narrativeText: 'A creek bottom. Dense cedar cover, warm slope, browse within reach. You circle the area, nose to the ground. No fresh buck-scent on the saplings. No rubs. No scrapes.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'deer-settle-claim',
        label: 'Make this your home range',
        description: 'Begin leaving rub marks and establishing trails.',
        narrativeResult: 'You rub your antlers on the saplings and scrape the ground bare in three places. Over the following days you learn where the food is and where the predator-scent trails run.',
        statEffects: [{ stat: StatId.WIS, amount: 5, label: '+WIS' }, { stat: StatId.NOV, amount: -5, label: '-NOV' }],
        consequences: [
          { type: 'set_flag', flag: 'dispersal-settled' },
          { type: 'remove_flag', flag: 'dispersal-begun' },
          { type: 'modify_territory', qualityChange: 15 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'deer-settle-continue',
        label: 'Keep moving',
        description: 'Search for a larger range with more resources.',
        narrativeResult: 'You pass through without stopping. The scent of other places pulls you forward.',
        statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
      { type: 'age_range', min: 16 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['exploration'],
  },
];

export const WHITE_TAILED_DEER_EVENTS: GameEvent[] = [...sharedEvents, ...deerEvents];
