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
    subEvents: [
      {
        eventId: 'elephant-musth-tusk-gore-sub',
        chance: 0.25,
        narrativeText:
          'In the grinding collision of skulls and ivory, his tusk finds the gap between your shoulder and your neck. The point drives in with the momentum of his full charge behind it — six tons of bone, muscle, and hormonal fury compressed into a single ivory tip. You feel the tusk slide through your hide and into the meat beneath, and the pain is vast and hot and wrong. You wrench yourself sideways and the tusk pulls free with a wet, sucking sound. Blood sheets down your flank.',
        footnote: '(Tusk gore wound)',
        statEffects: [
          { stat: StatId.HEA, amount: -6, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'tusk-gore-wound', severity: 0 },
        ],
      },
      {
        eventId: 'elephant-musth-tusk-break-sub',
        chance: 0.10,
        narrativeText:
          'Your tusks lock together and you both twist with all your strength, each trying to wrench the other off balance. The pressure is immense — thousands of pounds of torque concentrated along the grain of the ivory. Then the sound comes: a sharp, percussive crack that travels through your skull and into your spine. Your tusk has fractured. The broken end drops into the churned earth and you stagger backward, the exposed nerve shrieking.',
        footnote: '(Tusk breakage — tusks do not regrow)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'tusk-break', severity: 0 },
        ],
      },
      {
        eventId: 'elephant-musth-torn-ear-sub',
        chance: 0.15,
        narrativeText:
          'He reaches past your tusks with his trunk, coils it around the edge of your ear, and rips sideways. The cartilage tears like wet paper — a sound you hear more than feel, at first, before the pain blooms hot and electric across the side of your head. Blood pours from the ragged edge in a thin curtain. It is not a mortal wound, but it is a humiliation written permanently into your silhouette.',
        footnote: '(Torn ear)',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'torn-ear', severity: 0 },
        ],
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

  // ══════════════════════════════════════════════
  //  FORAGING EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-marula-fruit',
    type: 'active',
    category: 'foraging',
    narrativeText:
      "The smell reaches you before the sight \u2014 sweet, cloying, almost alcoholic. A marula tree stands heavy with overripe fruit, its branches sagging, the ground beneath it littered with split yellow globes fermenting in the heat. The juice runs sticky down your trunk as you gather them, and the taste is intoxicating in every sense of the word. The world softens at the edges.",
    statEffects: [
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    choices: [
      {
        id: 'gorge-marula',
        label: 'Gorge on the fermented fruit',
        description: 'Eat until you are swaying \u2014 rich calories, but you may stumble',
        statEffects: [
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'eat-moderately',
        label: 'Eat moderately and move on',
        description: 'Take what you need and keep your wits about you',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'drunk-stumble',
        chance: 0.2,
        narrativeText:
          'Your legs tangle beneath you as the fermented juice takes hold. You lurch sideways into a termite mound, scraping your flank raw against the hardened earth.',
        footnote: '(Minor injury from drunken stumble)',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'scrape-wound', severity: 0, bodyPart: 'right flank' },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['foraging', 'food'],
  },

  {
    id: 'elephant-salt-lick',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      "Deep inside a cave eroded into the hillside, your trunk finds what your body has been craving \u2014 mineral-rich salt deposits streaking the rock face like pale veins. You scrape at the wall with your tusks, prying loose chunks of sodium and calcium that dissolve on your tongue with a sharp, electric tang. Generations of elephants have carved these walls smooth. You will remember this place for the rest of your life.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.CLI, amount: -3, label: '-CLI' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 8,
    tags: ['foraging', 'food', 'mineral'],
  },

  {
    id: 'elephant-grass-fire-aftermath',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      "The blackened earth still radiates warmth beneath your feet, and the air carries the acrid ghost of smoke. But already, impossibly, the first green shoots are pushing through the ash \u2014 tender, mineral-rich blades that taste of renewal. The herd fans out across the burn scar, feeding with quiet urgency on the freshest grass the savanna has offered in months.",
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 3 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter', 'spring'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['foraging', 'food', 'fire'],
  },

  {
    id: 'elephant-termite-mound',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      "You drive your tusks into the cathedral spire of a termite mound, cracking it open like an egg. Inside, the soil is packed with kaolin and calcium \u2014 minerals your gut has been demanding for weeks. You scoop the pale, chalky earth into your mouth with your trunk, chewing slowly as the grit coats your teeth. The termites boil furiously across the wreckage, but they cannot sting through your hide. This is geophagy, older than memory \u2014 the earth itself as medicine.",
    statEffects: [
      { stat: StatId.IMM, amount: -4, label: '-IMM' },
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    conditions: [],
    weight: 9,
    cooldown: 6,
    tags: ['foraging', 'food', 'mineral'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-hyena-pack',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The hyenas have been circling since dawn \u2014 a pack of eight or nine, their whooping calls weaving through the herd like a taunt. They are not interested in you. They are watching a cow at the back of the group, her gait slow and labored, her ribs showing through her skin. Every few minutes one darts in, snapping at her heels, testing her resolve. The matriarch watches. The herd watches. You watch.",
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'intervene-hyenas',
        label: 'Charge the hyenas and drive them off',
        description: 'Expend precious energy to protect a weakened herd member',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'let-nature-decide',
        label: 'Let nature take its course',
        description: 'Conserve your strength \u2014 the herd must survive',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },

  {
    id: 'elephant-snare-trap',
    type: 'active',
    category: 'predator',
    narrativeText:
      "Something bites into your ankle with cold, unrelenting pressure. You look down and see a loop of braided wire cinched tight around your leg, the other end anchored to a heavy log half-buried in the earth. This is not a predator \u2014 it is a human thing, deliberate and cruel. The wire digs deeper with every step, and already you can feel blood running warm over your foot.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'pull-free-snare',
        label: 'Wrench your leg free with brute force',
        description: 'The wire will tear flesh, but you will be free',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'snare-laceration', severity: 0, bodyPart: 'left front ankle' },
          { type: 'set_flag', flag: 'snare-survivor' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'wait-snare-weaken',
        label: 'Wait and work the wire loose slowly',
        description: 'Less injury, but you cannot feed or move while trapped',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'snare-survivor' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'danger', 'human'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS (continued)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-infrasound-call',
    type: 'passive',
    category: 'social',
    narrativeText:
      "It comes not through your ears but through the soles of your feet \u2014 a low, rolling vibration that travels through the earth itself. An infrasound call from a family group miles away, carrying information older than language: water to the east, danger to the north, a greeting from kin you have not seen in months. You stand motionless, one foot lifted slightly, listening with your whole body.",
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    conditions: [],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'herd', 'communication'],
  },

  {
    id: 'elephant-play-behavior',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The calves have found a mud slide on the riverbank, and the whole herd has descended into joyful chaos. Young elephants toboggan down the slick clay on their bellies, trumpeting with something that can only be called delight. You join in, spraying great arcs of muddy water with your trunk, shouldering into the shallows until you are coated head to tail. For a few hours, there is no drought, no predator, no hunger \u2014 only play.",
    statEffects: [
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    conditions: [
      { type: 'no_flag', flag: 'dry-season-seen' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'psychological'],
  },

  {
    id: 'elephant-orphan-adoption',
    type: 'passive',
    category: 'social',
    narrativeText:
      "You find the calf standing alone beside the carcass of its mother, trunk hanging limp, eyes glazed with a grief it cannot name. It is thin and dehydrated, its skin loose and papery. When you approach, it presses against your leg with a desperate, trembling urgency, and something shifts inside your chest \u2014 a recognition, a decision that is not really a decision at all. The herd parts to let you bring it in.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'adopted-orphan' },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
    ],
    weight: 5,
    cooldown: 20,
    tags: ['social', 'herd'],
  },

  {
    id: 'elephant-bull-greeting',
    type: 'passive',
    category: 'social',
    narrativeText:
      "Another bull approaches from the east, and you turn to face him with your ears spread wide. He is known to you \u2014 you have sparred before, years ago, when you were both young and reckless. Now you meet trunk-to-mouth, each tasting the other's breath, reading a chemical autobiography of where he has been, what he has eaten, whether he is in musth. The greeting is brief and formal, two old warriors acknowledging each other's continued existence.",
    statEffects: [
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 120 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'herd'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-dust-bath',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      "You find a depression of fine, powdery earth \u2014 sifted by wind and sun into a consistency like flour. You scoop trunkfuls over your back and flanks, working the dust into every fold and crease of your skin until you are coated in a pale, ghostly layer. The dust will block the sun's worst heat and suffocate the ticks and biting flies that torment you. For a moment you stand in your own cloud, eyes half-closed, utterly content.",
    statEffects: [
      { stat: StatId.CLI, amount: -4, label: '-CLI' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' },
    ],
    conditions: [],
    weight: 12,
    cooldown: 4,
    tags: ['environmental', 'health'],
  },

  {
    id: 'elephant-river-crossing',
    type: 'active',
    category: 'environmental',
    narrativeText:
      "The river is swollen and brown, running fast with the season's rains, carrying uprooted trees and debris in its churning current. The herd needs to cross \u2014 the best grazing lies on the far bank, and the matriarch's memory says this is the way. But the water is deep, the current is strong, and the youngest calves can barely keep their trunks above the surface.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'swim-across',
        label: 'Enter the river and swim across',
        description: 'The current is treacherous, but waiting means hunger',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'Swept away by the river current and drowned',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-water-drop',
        label: 'Wait for the water level to drop',
        description: 'Safer, but food is scarce on this bank',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'water', 'danger'],
  },

  {
    id: 'elephant-thunderstorm',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      "The sky turns the color of a bruise \u2014 purple-black and swollen, pressing down on the savanna like a lid. Then the storm breaks. Lightning splits the horizon in jagged white forks, and thunder rolls across the plain with a force you feel in your ribs. Rain lashes sideways, stinging your eyes. The herd huddles together, calves pressed against their mothers' flanks, trunks curled inward against the wind.",
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'lightning-strike-nearby',
        chance: 0.08,
        narrativeText:
          'A bolt of lightning strikes a fever tree not thirty yards from where you stand. The trunk explodes in a shower of white splinters and the air fills with the smell of ozone and burning sap. The shock reverberates through the ground and into your bones.',
        footnote: '(Lightning struck nearby)',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.NOV, amount: 6, label: '+NOV' },
        ],
        consequences: [],
      },
    ],
    conditions: [],
    weight: 10,
    cooldown: 6,
    tags: ['environmental', 'weather'],
  },

  // ══════════════════════════════════════════════
  //  AGE-GATED EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-calf-learning',
    type: 'passive',
    category: 'social',
    narrativeText:
      "Your trunk is a magnificent, bewildering appendage \u2014 forty thousand muscles and not one of them doing what you want. You try to pick up a seed pod and fling it over your shoulder instead. You attempt to drink from the river and spray water directly into your own eye. The older elephants watch with what you suspect is amusement. But each fumble teaches you something, and today, for the first time, you manage to pluck a single blade of grass and bring it to your mouth.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'age_range', max: 60 },
    ],
    weight: 15,
    cooldown: 4,
    tags: ['social', 'learning'],
  },

  {
    id: 'elephant-adolescent-test',
    type: 'passive',
    category: 'social',
    narrativeText:
      "Something restless and electric is building inside you. You mock-charge a warthog and send it squealing into its burrow. You shove a young acacia until it bends double. You spar with another adolescent, clashing your half-grown tusks together with a sound like stones striking. The older bulls tolerate your posturing with weary indifference \u2014 they have all been where you are, testing the boundaries of a body that is growing faster than your judgment.",
    statEffects: [
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.STR, amount: -3, label: '-STR' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'age_range', min: 60, max: 180 },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['social', 'learning'],
  },

  {
    id: 'elephant-elder-memory',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The drought is in its third month and the herd is desperate, ribs showing, calves stumbling. But you remember. Decades ago, when you were barely more than a calf yourself, the old matriarch led your family on a forced march across the plateau to a spring hidden in a rocky gorge \u2014 a place no living elephant but you has ever seen. You turn east, and the herd follows without question, trusting the map etched into your ancient, extraordinary mind.",
    statEffects: [
      { stat: StatId.WIS, amount: 10, label: '+WIS' },
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
    ],
    conditions: [
      { type: 'age_range', min: 420 },
    ],
    weight: 12,
    cooldown: 10,
    tags: ['social', 'herd', 'wisdom'],
  },

  // ══════════════════════════════════════════════
  //  EVENT CHAINING
  // ══════════════════════════════════════════════

  {
    id: 'elephant-snare-trauma',
    type: 'passive',
    category: 'psychological',
    narrativeText:
      "A hanging vine brushes your ankle and you explode sideways, heart hammering, trunk raised in alarm. It was nothing \u2014 just a vine. But your body remembers the wire, the cold bite of the snare, the hours of pain and terror. Every rope-like shape, every dangling tendril, sends a jolt of adrenaline through your veins. The wound on your leg has healed, but the wound in your mind is still raw and open.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'snare-survivor' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'snare-survivor' },
    ],
    weight: 25,
    cooldown: 8,
    tags: ['psychological', 'trauma'],
  },

  {
    id: 'elephant-orphan-bond',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The orphan walks beside you now with the quiet confidence of a calf who knows it belongs. It has learned your routes, your rumbles, the particular way you strip bark from a baobab. When the herd moves, it stays close to your flank, its small trunk sometimes reaching up to touch your cheek in a gesture that needs no translation. You did not birth this calf, but it is yours in every way that matters.",
    statEffects: [
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'adopted-orphan' },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'adopted-orphan' },
    ],
    weight: 25,
    cooldown: 8,
    tags: ['social', 'herd'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS (extended)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-dry-water-search',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      "The riverbed is a pale scar across the landscape, cracked into tessellated plates that curl at their edges like dead leaves. The herd has been walking since before dawn, trunks swinging low, testing the air for the faintest ghost of moisture. The matriarch pauses at a bend where the sand looks darker than the rest \u2014 a subtle difference that only decades of memory could detect. You could dig here, trust her reading of the earth, or press on toward the old route where water has always waited before.",
    statEffects: [],
    choices: [
      {
        id: 'dig-new-well',
        label: 'Dig a new well here',
        description: 'Trust the matriarch\u2019s instinct \u2014 exhausting work, but wisdom earned',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'follow-old-route',
        label: 'Follow the old route to the known waterhole',
        description: 'A longer march, but the path is certain',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['seasonal', 'water'],
  },

  {
    id: 'elephant-wet-mud-bath',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      "The rains have transformed the pan into a vast, warm lake of grey mud, and the herd has abandoned all dignity. Calves belly-flop into the shallows, sending up curtains of slurry. Cows roll onto their sides, coating every fold and crease in a thick, cooling plaster that will armor them against sun and insects for days. You wade in until the mud reaches your chest, feeling it suck at your legs with a gentle, insistent grip, and spray great arcs of it over your back with your trunk. The world smells of wet earth and contentment, and for a long, unhurried afternoon, nothing else matters.",
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['seasonal', 'water', 'social'],
  },

  {
    id: 'elephant-seasonal-fruit',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      "The wild figs are ripe. You smell them from a quarter mile away \u2014 a dense, syrupy sweetness that draws the whole herd at a lumbering trot through the golden grass. The trees are heavy with fruit, their branches bowed nearly to the ground, and the earth beneath them is carpeted in split, fermenting globes alive with wasps and beetles. You gorge without restraint, your trunk working in a blur, stuffing handfuls of soft, seedy pulp into your mouth as fast as you can chew. Juice runs down your chin and pools in the creases of your skin. The abundance is almost obscene after months of dry browse.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 4 },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['seasonal', 'foraging', 'food'],
  },

  {
    id: 'elephant-brush-fire',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      "A line of orange light appears on the horizon, shimmering in the heat haze, and then the wind shifts and the smell hits you \u2014 smoke, thick and acrid, laced with the crackle of burning thorn scrub. The fire is moving fast, driven by dry-season gusts, consuming the tall grass in roaring curtains of flame. Ash falls like grey snow on your back. The herd mills in confusion, trunks raised, testing the wind for a path through. You can see a gap where the fire has already passed, the ground still glowing with embers, or you can swing wide around the flank \u2014 a longer route, but away from the flames.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'charge-through-flames',
        label: 'Charge through the burned gap',
        description: 'The embers are still hot, but the path is short',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'The fire rekindled in the wind. The flames closed around you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'detour-around-fire',
        label: 'Detour around the fire\u2019s flank',
        description: 'Longer and exhausting, but safer ground',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 6,
    cooldown: 10,
    tags: ['environmental', 'danger', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-long-march',
    type: 'active',
    category: 'migration',
    narrativeText:
      "The matriarch has turned east, and you know what that means: the long march. For three days the herd walks in single file across a featureless expanse of sun-bleached scrub, following a route that exists only in the matriarch\u2019s memory. Dust coats your skin until you are the color of the earth itself. Your feet ache on the baked ground. The calves stumble and are steadied by trunks pressed gently against their rumps. At night you walk by starlight, guided by a map no human has ever seen, trusting the ancient, infallible compass of an elephant\u2019s mind. On the fourth morning, the smell of water reaches you \u2014 faint, impossibly sweet \u2014 and the herd quickens its pace.",
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -5 },
    ],
    conditions: [],
    weight: 7,
    cooldown: 10,
    tags: ['migration', 'environmental'],
  },

  {
    id: 'elephant-territory-boundary',
    type: 'active',
    category: 'migration',
    narrativeText:
      "The dung piles appear first \u2014 enormous, still-fresh mounds marking a line across the trail as deliberate as any fence. Then the infrasound reaches you through the ground: a deep, territorial rumble that vibrates in your chest. Another herd claims this corridor, and their matriarch is not inclined to share. Her family is visible through the thorn trees, ears flared wide, bodies angled toward you in unmistakable warning. The water you need lies beyond them.",
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'press-through-territory',
        label: 'Press through their territory',
        description: 'Assert your right of passage \u2014 confrontation likely',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'go-around-territory',
        label: 'Go around their range',
        description: 'A longer detour, but you avoid a fight',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['migration', 'social'],
  },

  {
    id: 'elephant-lost-watering-hole',
    type: 'passive',
    category: 'migration',
    narrativeText:
      "You remember this place. The acacia that leaned over the bank, the flat rock where you used to rest your trunk while drinking, the particular way the light fell across the water in the late afternoon. But the water is gone. The hole is a shallow depression of cracked, bone-white clay, its surface etched with the footprints of animals who came here expecting life and found only dust. A dead catfish lies curled in the center like a question mark. The memory of water is so strong you can almost taste it, but memory cannot slake thirst. The herd stands in bewildered silence, and then the matriarch turns away, and you follow, carrying one more loss in a mind that forgets nothing.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['migration', 'environmental', 'psychological'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS (extended)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-mourning-fallen',
    type: 'passive',
    category: 'social',
    narrativeText:
      "She went down during the night \u2014 the old cow who always walked at the back of the herd, her gait stiff with arthritis, her tusks worn to blunt stumps. You find her lying on her side in the grey dawn light, her ribs still, her trunk outstretched as though reaching for something. The herd gathers slowly, forming a half-circle around her body. One by one, they approach and touch her with their trunks \u2014 her face, her ears, the hollow behind her jaw where the pulse once beat. A young bull drapes his trunk across her flank and stands there, swaying. Nobody feeds. Nobody moves to leave. The grief is silent and enormous, filling the space between you like floodwater, and you understand with a certainty beyond language that this is not just loss. It is love, expressed in the only way left to express it.",
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
    ],
    conditions: [],
    weight: 5,
    cooldown: 15,
    tags: ['social', 'psychological'],
  },

  {
    id: 'elephant-teaching-young',
    type: 'passive',
    category: 'social',
    narrativeText:
      "The calves crowd around you as you move through a stand of mixed scrub, their small trunks reaching eagerly for everything they see. You steer them away from the Euphorbia with a low rumble \u2014 its milky sap will blister their mouths and blind their eyes. You guide them instead toward the wild sage, demonstrating with slow, deliberate movements how to strip the leaves without taking the woody stem. One calf tries to eat a seed pod from a sausage tree and you nudge it away with your foot, a correction so gentle it could be mistaken for affection. It is affection. Every lesson you teach is a life you may be saving, passed down through a chain of mothers that stretches back further than memory, further than bone.",
    statEffects: [
      { stat: StatId.WIS, amount: 8, label: '+WIS' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 180 },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['social', 'herd', 'learning'],
  },

  {
    id: 'elephant-greeting-herd',
    type: 'active',
    category: 'social',
    narrativeText:
      "The waterhole is occupied. Another family group is already there \u2014 eight or nine elephants, their wet hides gleaming in the midday heat, calves splashing in the shallows. Their matriarch raises her head and watches your approach with calm, appraising eyes. Her ears are relaxed, not flared, but she has positioned herself between you and her young. The air is thick with chemical signals \u2014 breath, temporal gland secretion, the particular musk of unfamiliar elephants. You could approach openly, trunk extended in greeting, or hold back and wait your turn at the water\u2019s edge.",
    statEffects: [],
    choices: [
      {
        id: 'approach-peacefully',
        label: 'Approach with trunk extended',
        description: 'A greeting ritual \u2014 exchange breath and establish trust',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'maintain-distance',
        label: 'Maintain a respectful distance',
        description: 'Wait on the periphery \u2014 cautious, but you miss the exchange',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'herd'],
  },

  // ══════════════════════════════════════════════
  //  NPC ENCOUNTER TRACKING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-rival-musth-challenge',
    type: 'active',
    category: 'social',
    narrativeText:
      '{{npc.rival.name}} is back. You smell him before you see him — the thick, acrid musk of musth pouring off his temporal glands like a chemical declaration of war. He emerges from the tree line with his ears flared and his head held high, the same swagger you have seen before. But this time there is something different in his eyes — a deeper fury, a more desperate need. He has been losing, and losing makes bulls dangerous.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fight-rival-npc',
        label: 'Lock tusks and fight',
        description: 'End this rivalry once and for all',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.STR, amount: -5, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: '{{npc.rival.name}} drove a tusk through your skull in the heat of combat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'back-down-rival-npc',
        label: 'Lower your head and retreat',
        description: 'Live to fight another day',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'elephant-rival-tusk-gore-sub',
        chance: 0.25,
        narrativeText:
          '{{npc.rival.name}} drops his head and charges with a guttural scream that shakes the air. His tusk catches you below the ear and plunges inward, parting hide and muscle with the obscene ease of sharpened ivory driven by twelve thousand pounds of enraged bull. You feel the point grate against bone before you manage to twist free. Blood runs in a thick sheet down your side, soaking the dust beneath your feet into dark mud.',
        footnote: '(Tusk gore wound)',
        statEffects: [
          { stat: StatId.HEA, amount: -6, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'tusk-gore-wound', severity: 1 },
        ],
      },
      {
        eventId: 'elephant-rival-tusk-break-sub',
        chance: 0.10,
        narrativeText:
          'Your tusks slam together with a sound like a gunshot. You push and he pushes and neither of you yields. Then the angle shifts and the force concentrates along a fault line in the ivory — a hairline imperfection that has been waiting your whole life for this exact moment of pressure. The crack propagates in a millisecond. Half your tusk shears away and tumbles to the ground, trailing a thread of blood from the exposed pulp cavity. The pain is blinding and absolute.',
        footnote: '(Tusk breakage — tusks do not regrow)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'tusk-break', severity: 1 },
        ],
      },
      {
        eventId: 'elephant-rival-torn-ear-sub',
        chance: 0.15,
        narrativeText:
          'In the chaos of the clinch, {{npc.rival.name}} snakes his trunk around your ear and yanks with vicious force. The thin cartilage splits with a wet tearing sound, and a flap of ear hangs loose, streaming blood. You flap the damaged ear reflexively, spraying red across both of you. The wound is not life-threatening, but the torn edge will never mend smooth — a permanent testament to this day.',
        footnote: '(Torn ear)',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'torn-ear', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 144 },
    ],
    weight: 7,
    cooldown: 10,
    tags: ['social', 'confrontation', 'mating'],
  },

  {
    id: 'elephant-predator-pride-learning',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The lions are back — {{npc.predator.name}} and the rest of the pride, padding through the grass with the quiet confidence of hunters who know their territory. They have been watching your herd for days, learning the patterns: when the calves stray, when the matriarch sleeps, which approaches offer cover. Each encounter they probe a little further, test a little more boldly. They are not hunting yet. They are studying.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'charge-pride',
        label: 'Charge the pride to scatter them',
        description: 'Break their confidence before they strike',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'tighten-formation',
        label: 'Tighten the herd formation',
        description: 'Keep the calves in the center — deny them an opening',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [],
    weight: 6,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },

  // ══════════════════════════════════════════════
  //  COOPERATIVE DEFENSE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-cooperative-lion-defense',
    type: 'active',
    category: 'predator',
    narrativeText: 'Lions have been shadowing the herd since dusk — you can see their amber eyes in the darkness at the tree line. They are targeting the calves. {{npc.ally.name}} moves to stand beside you, and the two of you form a wall between the lions and the young. Elephants working together can face down any predator. Alone, even an elephant is vulnerable to a coordinated lion pride.',
    statEffects: [{ stat: StatId.TRA, amount: 3, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'elephant-lion-charge',
        label: 'Charge the lions together',
        description: 'A coordinated charge will scatter them.',
        narrativeResult: 'You and {{npc.ally.name}} trumpet and charge. The lions scatter — even a pride of six cannot face two enraged elephants. The calves are safe tonight.',
        statEffects: [{ stat: StatId.ADV, amount: 2, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'elephant-lion-wall',
        label: 'Hold the defensive line',
        description: 'Stand together. Do not let them through.',
        narrativeResult: 'You stand shoulder to shoulder through the long night, rumbling warnings. The lions probe but never commit. By dawn, they slink away. The vigil cost you sleep and energy, but the calves survived.',
        statEffects: [{ stat: StatId.HOM, amount: 4, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -1 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['african-elephant'] },
      { type: 'has_npc', npcType: 'ally' },
      { type: 'has_flag', flag: 'calves-dependent' },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'social'],
  },

  // ══════════════════════════════════════════════
  //  INFANTICIDE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'elephant-musth-male-calf-threat',
    type: 'active',
    category: 'predator',
    narrativeText: 'A bull elephant in musth — temporal glands streaming, eyes wild with hormonal rage — has been following the herd for days. Today he charges a calf, swinging his tusks. Bulls in musth are unpredictable and extremely dangerous. Even other elephants avoid them. Your calf screams as the bull approaches.',
    statEffects: [{ stat: StatId.TRA, amount: 6, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'elephant-musth-herd-defense',
        label: 'Rally the herd',
        description: 'Trumpet for help. Several females can drive off even a musth bull.',
        narrativeResult: 'Your distress call brings {{npc.ally.name}} and two other cows running. Together, you form a wall of ivory and fury. The musth bull, outnumbered, backs away with a rumbling threat. The calf is safe — trembling, but alive.',
        statEffects: [{ stat: StatId.ADV, amount: 3, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: undefined,
      },
      {
        id: 'elephant-musth-flee',
        label: 'Flee with the calf',
        description: 'Run. A musth bull is too dangerous to confront alone.',
        narrativeResult: 'You push the calf ahead of you and run. The bull gives chase briefly, then turns back to the herd. You are separated from the group and must find your way back — a dangerous journey for a cow and calf alone.',
        statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'elephant-musth-stand-alone',
        label: 'Stand alone against the bull',
        description: 'You are half his size, but your calf is behind you.',
        narrativeResult: 'You lower your head and charge. The bull\'s tusk catches your shoulder, opening a deep gash, but your countercharge surprises him. He circles, considering, then moves off to find easier targets.',
        statEffects: [{ stat: StatId.ADV, amount: 6, label: '+ADV' }],
        consequences: [{ type: 'add_injury', injuryId: 'tusk-wound', severity: 1 }],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['african-elephant'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'calves-dependent' },
    ],
    weight: 4,
    cooldown: 12,
    tags: ['predator', 'social'],
    footnote: 'Musth bulls have been observed killing calves, though this is relatively rare in wild populations. The behavior is more common in areas where bull age structure is disrupted by poaching, leaving younger, less socially experienced bulls to enter musth without the moderating presence of older males.',
  },
];
