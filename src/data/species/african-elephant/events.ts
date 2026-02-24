import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const AFRICAN_ELEPHANT_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-acacia-browsing',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'You reach up with your trunk and strip a branch from a tall acacia. The leaves are rich and nutritious, but the thorns rake across the sensitive tip of your trunk, leaving shallow scratches. You chew slowly, savoring the bitter, resinous flavor that means sustenance in the dry months.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [],
    weight: 15,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'elephant-bark-stripping',
    type: 'active',
    category: 'foraging',
    narrativeText:
      "You wrap your trunk around a section of baobab bark and peel it away in a long, fibrous strip. The inner bark is moist and pulpy, rich in moisture and minerals. The baobab's ancient trunk bears the scars of generations of elephants who have done the same. It will survive your visit \u2014 baobabs always do.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
    ],
    conditions: [],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'food'],
  },

  {
    id: 'elephant-crop-raiding',
    type: 'active',
    category: 'foraging',
    narrativeText:
      "The smell hits you from half a mile away \u2014 ripe maize, dense and sweet, nothing like the sparse browse of the savanna. Through the darkness you can see the neat rows of a farmer's cornfield, the stalks heavy with cobs. Your stomach aches with hunger. But there are lights in the farmhouse, and you can hear dogs barking.",
    statEffects: [],
    choices: [
      {
        id: 'raid-crops',
        label: 'Raid the crops',
        description: 'Rich food, but farmers defend their livelihood with lethal force',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 4 },
          { type: 'set_flag', flag: 'raided-crops' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Shot by farmer defending crops',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stay-away',
        label: 'Stay away from the field',
        statEffects: [
          { stat: StatId.TRA, amount: -2, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 8,
    cooldown: 10,
    tags: ['foraging', 'food', 'danger', 'human'],
  },

  {
    id: 'elephant-digging-water',
    type: 'active',
    category: 'foraging',
    narrativeText:
      "The riverbed is cracked and dry, but you can smell moisture beneath the sand. You kneel and begin to dig with your forefeet and trunk, scooping out sandy earth until muddy water seeps into the depression. Other animals will drink from this hole after you leave \u2014 you are the savanna's well-digger.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    subEvents: [
      {
        eventId: 'digging-mud-parasites',
        chance: 0.15,
        conditions: [
          { type: 'no_parasite', parasiteId: 'elephant-roundworm' },
        ],
        narrativeText:
          'As you drink the muddy water, you ingest Murshidia larvae lurking in the saturated soil. They will make their home in your gut.',
        footnote: '(Parasitized by elephant roundworms)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'elephant-roundworm', startStage: 0 },
        ],
      },
    ],
    conditions: [],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'water'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-lion-ambush',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The herd stiffens simultaneously \u2014 a ripple of alarm that runs through every body like an electric current. Lions. A pride of them, crouched in the tall grass downwind, their tawny shapes barely visible. They are watching the calves. The matriarch trumpets a warning that shakes the air.",
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'charge-lions',
        label: 'Charge the lions',
        description: 'Drive them off with a direct charge \u2014 risky but decisive',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Killed by lion pride',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'circle-calves',
        label: 'Circle the calves and hold formation',
        description: 'Protect the young but risk the lions finding a gap',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'Lions found a vulnerable angle',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },

  {
    id: 'elephant-poacher-encounter',
    type: 'active',
    category: 'predator',
    narrativeText:
      "You smell it before anything else \u2014 smoke, and beneath it, the sharp chemical tang of humans. Not the farmers you sometimes encounter at the field edges, but something else. Something that makes your skin crawl and your pulse hammer. The matriarch's ears go flat against her skull. She remembers this smell. It means death.",
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 15, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-poachers',
        label: 'Flee as fast as you can',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Shot by poachers',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'hide-from-poachers',
        label: 'Hide in the thick bush',
        description: 'Freeze and hope they pass \u2014 dangerous if they have trackers',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.15,
          cause: 'Poachers found you. They took your tusks.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'danger', 'human'],
  },

  {
    id: 'elephant-human-conflict',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The farmer is waiting for you this time. He stands at the edge of his ruined cornfield with a rifle, his face set in grim resolve. You destroyed his harvest \u2014 his family's food for the year. He has every reason to shoot, and he knows exactly where you will come.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'retreat-farmer',
        label: 'Retreat immediately',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stand-ground-farmer',
        label: 'Stand your ground',
        description: 'Intimidate the farmer \u2014 but he has a rifle',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'Shot by farmer',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'raided-crops' },
    ],
    weight: 6,
    cooldown: 10,
    tags: ['predator', 'danger', 'human'],
  },

  {
    id: 'elephant-crocodile-waterhole',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The waterhole is murky and still. You wade in cautiously, trunk extended to drink, when you notice the telltale ridges of a crocodile's eyes and nostrils breaking the surface barely ten feet away. It is watching you with the ancient, patient malice of a reptile that has been ambushing animals at this waterhole for decades.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'croc-attack',
        chance: 0.1,
        narrativeText:
          'The crocodile lunges with explosive speed, jaws clamping onto your leg. You tear free with a bellow of pain, but the damage is done.',
        footnote: '(Leg injured by crocodile)',
        statEffects: [],
        consequences: [
          { type: 'add_injury', injuryId: 'leg-fracture', severity: 1, bodyPart: 'hind left tibia' },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'water'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-dry-season',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      "The rains have not come. The grass has turned to straw, the waterholes are shrinking to muddy puddles, and the air shimmers with heat. The herd walks farther each day in search of food and water, their ribs beginning to show beneath their grey hides. The dry season has begun, and with it, the long test of endurance.",
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -5 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
      { type: 'no_flag', flag: 'dry-season-seen' },
    ],
    weight: 25,
    tags: ['seasonal', 'weather'],
  },

  {
    id: 'elephant-wet-season',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      "The first drops are fat and warm, exploding in the dust like small grenades. Then the sky opens. Rain pours down in sheets, turning the cracked earth to mud within minutes. The herd lifts their trunks, mouths open, drinking the rain from the sky itself. The savanna will be green within a week. You have survived another dry season.",
    statEffects: [
      { stat: StatId.CLI, amount: -10, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'wet-season-seen' },
    ],
    weight: 25,
    tags: ['seasonal', 'weather'],
  },

  {
    id: 'elephant-musth-onset',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      "A chemical fire is building inside you. Thick, oily secretions stream from your temporal glands, staining the sides of your face dark. Your testosterone levels are surging to sixty times their normal level. You are entering musth \u2014 a state of aggressive sexual readiness that will make you dangerous, unpredictable, and irresistible to cows. Other bulls give you a wide berth. Even the matriarch watches you warily.",
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.STR, amount: -5, label: '-STR' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rut-seen' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 144 },
      { type: 'no_flag', flag: 'rut-seen' },
    ],
    weight: 20,
    cooldown: 20,
    tags: ['seasonal', 'social', 'mating'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-matriarch-guidance',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The matriarch leads the herd along a route you have never taken before, winding through kopjes and dry gullies as though reading a map written in the dust. She stops at a waterhole you did not know existed \u2014 hidden beneath an overhang of rock, still cool and clear even at the height of the dry season. She has been here before, perhaps decades ago. You make a note of the path.",
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.WIS, amount: 8, label: '+WIS' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [],
    weight: 10,
    cooldown: 6,
    tags: ['social', 'herd'],
  },

  {
    id: 'elephant-herd-mourning',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The herd has found the bones of one of their own \u2014 scattered and sun-bleached in the grass. The matriarch approaches slowly, reaching out with her trunk to touch the skull, tracing the contours of the eye socket with a gentleness that makes your chest ache. Others follow. They stand in silence, swaying slightly, touching the bones again and again. You do not understand death, but you understand this: something is missing, and it will not come back.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 6,
    cooldown: 12,
    tags: ['social', 'psychological'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-mating-acceptance',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      "A bull in full musth has found your herd. His temporal glands are streaming, his eyes are wild, and he moves with the swaggering confidence of an animal whose body is flooded with testosterone. He approaches you directly, rumbling low \u2014 a sound you feel more than hear, vibrating through the ground and into your feet. The other cows watch. The choice is yours.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'accept-bull',
        label: 'Accept the bull',
        description: 'Mate and conceive \u2014 pregnancy lasts nearly 22 months',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'evade-bull',
        label: 'Evade the bull',
        description: 'Flee \u2014 costs energy but avoids a grueling pregnancy',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 144 },
      { type: 'has_flag', flag: 'rut-seen' },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 18,
    cooldown: 20,
    tags: ['mating', 'social'],
  },

  {
    id: 'elephant-musth-competition',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      "Another bull stands before you, his ears flared wide, his head held high. He is in musth too \u2014 you can smell the thick, acrid secretion from his temporal glands. He rocks forward on his front feet, a gesture that says: I am not backing down. The cows are watching from the tree line. One of you will breed. The other will walk away broken, or not at all.",
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'fight-rival',
        label: 'Lock tusks and fight',
        description: 'Risk injury and defeat, but victory means mating rights',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'attempted-musth-challenge' },
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'retreat-rival',
        label: 'Lower your head and retreat',
        description: 'Survive to fight another day, but no mating this season',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 144 },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 15,
    cooldown: 8,
    tags: ['mating', 'social', 'danger'],
  },

  {
    id: 'elephant-calf-independence',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      "Your calves are growing into their own. They wander farther from your side each day, testing the world with their trunks, play-fighting with other juveniles, even mock-charging birds. Today they barely looked back when you moved to a new feeding area. The bond is loosening \u2014 not breaking, never breaking, but stretching into something new. They will always know your rumble among a thousand others. But they do not need you the way they once did.",
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'calves-just-independent' },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'calves-just-independent' },
    ],
    weight: 30,
    cooldown: 4,
    tags: ['mating', 'social'],
  },

  // ══════════════════════════════════════════════
  //  HEALTH / ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-thorn-foot',
    type: 'active',
    category: 'health',
    narrativeText:
      "A sharp, lancing pain shoots through your right front foot. You lift it instinctively and find a long acacia thorn embedded deep in the soft pad. Every step sends a bolt of agony up your leg. You try to pull it out with your trunk, but it snaps off, leaving the tip buried in the flesh.",
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'thorn-infection',
        chance: 0.2,
        narrativeText:
          'The wound begins to swell and redden. Infection has set in around the embedded thorn tip.',
        footnote: '(Foot wound from thorn)',
        statEffects: [],
        consequences: [
          { type: 'add_injury', injuryId: 'thorn-wound', severity: 0, bodyPart: 'right front foot' },
        ],
      },
    ],
    conditions: [],
    weight: 10,
    cooldown: 6,
    tags: ['health'],
  },

  {
    id: 'elephant-muddy-waterhole',
    type: 'active',
    category: 'health',
    narrativeText:
      "The waterhole has been reduced to a churned expanse of thick, grey mud. Dozens of animals have been here before you \u2014 buffalo, zebra, warthogs \u2014 and the mud is alive with parasites. You wade in anyway. The cool mud feels wonderful on your sun-baked skin, and you spray yourself liberally, coating your hide in a protective layer. But something is crawling on your legs.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    subEvents: [
      {
        eventId: 'tick-pickup',
        chance: 0.25,
        conditions: [
          { type: 'no_parasite', parasiteId: 'elephant-tick' },
        ],
        narrativeText:
          'Several Amblyomma ticks have embedded themselves in the thin skin behind your ears and between your legs. You can feel them swelling as they feed.',
        footnote: '(Infested with elephant ticks)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'elephant-tick', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['health', 'water'],
  },
];
