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
      'Your trunk curls around an acacia branch and strips it. Thorns rake the sensitive tip, leaving shallow scratches. The leaves taste bitter and resinous as you chew.',
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
      "You wrap your trunk around a section of baobab bark and peel it away in a long strip. The inner bark is moist and pulpy. The tree trunk is scarred smooth where other trunks have gripped before yours.",
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
      "The smell of ripe maize reaches your trunk from far off. Dense and sweet. Through the darkness, rows of tall stalks heavy with cobs. Your gut is empty. But lights flicker near the field, and dogs are barking.",
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
      "The riverbed is cracked and dry, but your trunk detects moisture below the sand. You kneel and dig with your forefeet and trunk, scooping earth until muddy water seeps into the hole.",
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
          'The muddy water carries Murshidia larvae from the saturated soil. They pass into your gut.',
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
      "Every body in the herd goes rigid at once. The scent reaches you through the grass. Lions. A pride of them, crouched downwind, watching the calves. The matriarch trumpets. The ground vibrates under your feet.",
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
      "Smoke smell first. Then beneath it, a sharp chemical tang. Not the field-edge humans. Something else. Your skin tightens. Pulse hammers. The matriarch's ears flatten against her skull. She has smelled this before.",
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
          probability: 0.12,
          cause: 'Shot by poachers while fleeing. They tracked you by blood trail.',
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
          probability: 0.25,
          cause: 'Poachers found you. They took your tusks.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 14,
    cooldown: 8,
    tags: ['predator', 'danger', 'human', 'poaching'],
  },

  {
    id: 'elephant-human-conflict',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The human scent is strong at the field edge. A figure stands beside the ruined stalks, holding something long and metallic. It is not moving. It is waiting.",
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
    weight: 10,
    cooldown: 6,
    tags: ['predator', 'danger', 'human'],
  },

  {
    id: 'elephant-crocodile-waterhole',
    type: 'active',
    category: 'predator',
    narrativeText:
      "The waterhole is murky and still. You wade in, trunk extended, when you notice ridged eyes and nostrils breaking the surface three trunk-lengths away. Motionless. Watching.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'croc-attack',
        chance: 0.1,
        narrativeText:
          'The crocodile lunges. Jaws clamp onto your leg. You bellow and wrench free, but the bite has torn deep.',
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
      "No rain. The grass is straw. Waterholes shrink to muddy puddles. Heat shimmers off the ground. The herd walks farther each day. Ribs beginning to show through grey hide.",
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
      "Fat warm drops hit the dust. Then the sky opens. Rain sheets down, turning cracked earth to mud. You lift your trunk, mouth open, tasting the wet air. The herd stands in the downpour.",
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
      "Thick, oily secretion streams from your temporal glands, staining the sides of your face. Your body runs hot. Other bulls give you wide berth. You swing your head and the smell of your own musth is overwhelming.",
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
      "The matriarch turns down a route you have never walked. Through kopjes and dry gullies. She stops at a waterhole hidden beneath rock, still cool and clear. You drink. Your feet press the path into the ground.",
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
      "Bones in the grass. Sun-bleached, scattered. The matriarch approaches and extends her trunk to the skull, tracing the eye socket. Others follow. They touch the bones, trunk tip to smooth surface, standing and swaying.",
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
      "A bull approaches, temporal glands streaming, the acrid musth smell reaching you from upwind. He rumbles low. You feel it through the ground before you hear it, vibrating up through your feet and into your chest.",
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
      "Another bull, ears flared wide, head high. The thick, acrid smell of his temporal glands reaches your trunk. He rocks forward on his front feet. You smell cows downwind at the tree line.",
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
          'His tusk finds the gap between your shoulder and neck. The point drives in. You feel it slide through hide and into muscle. Hot, wrong. You wrench sideways. The tusk pulls free. Blood runs down your flank.',
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
          'Your tusks lock. You twist against each other, thousands of pounds of torque on the ivory. A percussive crack travels through your skull. Your tusk has fractured. The broken end drops into the churned earth. The exposed nerve screams.',
        footnote: '(Tusk breakage, tusks do not regrow)',
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
          'His trunk coils around the edge of your ear and rips sideways. The cartilage tears. A wet sound, then hot pain across the side of your head. Blood pours from the ragged edge.',
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
      "Your calves wander farther from your side each day. They trunk-test everything, spar with other juveniles, mock-charge birds. Today they did not look back when you moved to a new feeding area.",
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
      "Sharp pain in your right front foot. You lift it. A long acacia thorn embedded deep in the soft pad. Your trunk tip finds it but it snaps off, leaving the point buried in the flesh.",
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'thorn-infection',
        chance: 0.2,
        narrativeText:
          'The wound swells and heats. The flesh around the embedded thorn tip is inflamed.',
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
      "The waterhole is churned to thick grey mud, trampled by many animals. You wade in. The cool mud presses against your sun-hot skin. You spray it over your back with your trunk. Something crawls on your legs.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    subEvents: [
      {
        eventId: 'tick-pickup',
        chance: 0.15,
        conditions: [
          { type: 'no_parasite', parasiteId: 'elephant-tick' },
        ],
        narrativeText:
          'Ticks have embedded in the thin skin behind your ears and between your legs. You feel them swelling as they feed.',
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
      "Sweet, cloying smell reaches your trunk before you see the tree. Marula fruit, overripe, branches sagging. Split yellow globes fermenting on the ground beneath. The juice runs sticky down your trunk as you gather them.",
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
          'Your legs tangle. You lurch sideways into a termite mound, scraping your flank raw against the hardened earth.',
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
      "Inside a cave in the hillside, your trunk tip finds salt deposits on the rock face. You scrape at the wall with your tusks, prying loose chunks that dissolve on your tongue with a sharp mineral tang. The walls are worn smooth by tusks that came before yours.",
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
      "Blackened earth radiates warmth through your foot pads. Smoke smell lingers. Green shoots are already pushing through the ash. You pull them with your trunk. Tender, mineral-rich. The herd fans out across the burn scar, feeding.",
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
      "You drive your tusks into a termite mound and crack it open. The soil inside is packed with kaolin and calcium. You scoop the pale, chalky earth into your mouth with your trunk. Grit coats your teeth. Termites swarm the wreckage but cannot penetrate your hide.",
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
      "Hyenas circling since dawn. Eight or nine, whooping. They watch a cow at the back of the herd, her gait slow, ribs showing. Every few minutes one darts in, snapping at her heels.",
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
      "Cold pressure bites into your ankle and holds. A loop of braided wire, cinched tight around your leg, anchored to a buried log. The wire digs deeper with every step. Blood runs warm over your foot.",
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
      "A low, rolling vibration comes up through the soles of your feet. Infrasound, traveling through the earth. A call from a family group far off. You stand motionless, one foot lifted slightly, feeling the signal through your bones.",
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
      "The calves have found a mud slide on the riverbank. Young elephants slide down the slick clay on their bellies, trumpeting. You spray arcs of muddy water with your trunk and shoulder into the shallows until mud coats you head to tail.",
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
      "A calf stands alone beside a still body. Trunk hanging limp. Thin, dehydrated, skin loose. When you approach, it presses against your leg, trembling. The herd parts to let you bring it in.",
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
      "A bull approaches from the east. You spread your ears and face him. You have sparred before. Now you meet trunk-to-mouth, each tasting the other's breath, reading where he has been, what he has eaten, whether he is in musth.",
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
      "A depression of fine, powdery earth. You scoop trunkfuls over your back and flanks, working the dust into every fold and crease. The coating settles over your skin. Biting flies lose their grip. The heat eases.",
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
      "The river runs fast and brown, swollen with rain. Debris in the current. The matriarch faces the far bank. The water is deep, the current strong. The youngest calves are too small to keep their trunks above the surface.",
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
      "The sky darkens. Lightning splits the horizon. Thunder rolls through the ground and into your feet, up through your ribs. Rain lashes sideways. The herd presses together, calves against their mothers' flanks, trunks curled inward.",
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'lightning-strike-nearby',
        chance: 0.08,
        narrativeText:
          'Lightning strikes a tree nearby. The trunk explodes. Ozone and burning sap fill the air. The shock pulses through the ground and up through your feet.',
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
      "Your trunk does not do what you want. You try to pick up a seed pod and fling it over your shoulder. You try to drink and spray water into your own eye. Today, for the first time, you manage to pluck a single blade of grass and bring it to your mouth.",
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
      "You mock-charge a warthog. It squeals into its burrow. You shove a young acacia until it bends. You spar with another adolescent, half-grown tusks clashing with a sound like stones striking. The older bulls ignore you.",
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
      "Third month of drought. Ribs showing. Calves stumbling. But you walked this way before, long ago, following the old matriarch. A spring in a rocky gorge. You turn east. The herd follows.",
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
      "A vine brushes your ankle. You explode sideways, trunk raised. Nothing there. But your body flinches at every rope-like shape, every dangling tendril. The leg wound has healed. The flinch has not.",
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
      "The orphan walks beside you now. It has learned your routes, your rumbles, the way you strip bark. When the herd moves, it stays close to your flank, its small trunk reaching up to touch your cheek.",
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
      "Cracked riverbed, dry since before dawn. The herd walks with trunks low, testing for moisture. The matriarch stops where the sand is darker than the surrounding ground.",
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
      "The pan is a warm lake of grey mud. Calves belly-flop into the shallows. Cows roll onto their sides, coating every fold in thick mud. You wade in chest-deep, the mud sucking at your legs, and spray arcs of it over your back. Wet earth smell fills your trunk.",
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
      "Dense, syrupy sweetness reaches your trunk. Wild figs, ripe. The herd breaks into a trot through the grass. Trees heavy with fruit, branches bowed. You stuff handfuls of soft, seedy pulp into your mouth with your trunk. Juice runs down your chin.",
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
      "Orange light on the horizon. The wind shifts and smoke hits your trunk, thick and acrid. Fire moving fast through the dry grass. Ash falls on your back. The herd mills with trunks raised, testing the wind. A gap where the fire has already passed, ground still glowing.",
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
          cause: 'The fire rekindled in the wind and closed around you.',
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
      "The matriarch turns east. The herd walks single file across sun-bleached scrub for days. Dust coats your skin. Feet ache on baked ground. Calves stumble and are steadied by trunks against their rumps. On the fourth morning, the faint smell of water reaches you. The herd quickens.",
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
      "Enormous fresh dung piles mark a line across the trail. Then infrasound reaches you through the ground, a deep territorial rumble vibrating in your chest. Another herd, visible through the thorn trees, ears flared, bodies angled toward you.",
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
      "You know this place. The smell of water is in your memory, strong enough to taste. But the hole is cracked bone-white clay, etched with old footprints. A dead catfish curled in the center. The herd stands, trunks testing the dry air. The matriarch turns away. You follow.",
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
      "The old cow lies on her side in the grey dawn light. Ribs still. Trunk outstretched. The herd gathers in a half-circle. One by one, they approach and touch her with their trunks. Her face. Her ears. The hollow behind her jaw. Nobody feeds. Nobody leaves.",
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
      "Calves crowd around you in the mixed scrub, small trunks reaching for everything. You rumble them away from the Euphorbia. You show them the wild sage, stripping leaves with slow movements. One calf reaches for a sausage tree pod and you nudge it away with your foot.",
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
      "The waterhole is occupied. Another family group, eight or nine, wet hides gleaming. Their matriarch watches your approach. Ears relaxed but positioned between you and her young. The air carries breath, temporal gland secretion, unfamiliar musk.",
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
      '{{npc.rival.name}} is back. You smell the thick musth before you see him. He emerges from the tree line, ears flared, head high. The acrid secretion pours off his temporal glands.',
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
          cause: '{{npc.rival.name}} drove a tusk through your skull.',
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
          '{{npc.rival.name}} drops his head and charges. His tusk catches you below the ear and drives inward through hide and muscle. The point grates against bone before you twist free. Blood sheets down your side.',
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
          'Your tusks slam together. Neither yields. The angle shifts and force concentrates along a fault line in the ivory. A crack. Half your tusk shears away and drops to the ground, trailing blood from the exposed pulp cavity.',
        footnote: '(Tusk breakage, tusks do not regrow)',
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
          '{{npc.rival.name}} snakes his trunk around your ear and yanks. The thin cartilage splits with a wet tearing sound. A flap of ear hangs loose, streaming blood.',
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
      'The lion scent again. {{npc.predator.name}} and the rest of the pride, moving through the grass. They have been watching the herd for days. Each encounter they probe closer, test more boldly.',
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
        description: 'Keep the calves in the center. Deny them an opening',
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
    narrativeText: 'Lion eyes in the darkness at the tree line. They are watching the calves. {{npc.ally.name}} moves to stand beside you. The two of you face the tree line together.',
    statEffects: [{ stat: StatId.TRA, amount: 3, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'elephant-lion-charge',
        label: 'Charge the lions together',
        description: 'A coordinated charge will scatter them.',
        narrativeResult: 'You and {{npc.ally.name}} trumpet and charge. The lions scatter. The calves are behind you, safe.',
        statEffects: [{ stat: StatId.ADV, amount: 2, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'elephant-lion-wall',
        label: 'Hold the defensive line',
        description: 'Stand together. Do not let them through.',
        narrativeResult: 'You stand shoulder to shoulder through the night, rumbling low. The lions probe but do not commit. By dawn they are gone. The calves are alive.',
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
    narrativeText: 'A bull in musth, temporal glands streaming, has been following the herd for days. Today he charges a calf, swinging his tusks. Your calf screams.',
    statEffects: [{ stat: StatId.TRA, amount: 6, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'elephant-musth-herd-defense',
        label: 'Rally the herd',
        description: 'Trumpet for help. Several females can drive off even a musth bull.',
        narrativeResult: 'Your distress call brings {{npc.ally.name}} and two other cows. You form a line, tusks forward. The musth bull backs away, rumbling. The calf trembles behind you, alive.',
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
        narrativeResult: 'You push the calf ahead of you and run. The bull gives chase, then stops. You are separated from the herd, alone with the calf.',
        statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'elephant-musth-stand-alone',
        label: 'Stand alone against the bull',
        description: 'You are half his size, but your calf is behind you.',
        narrativeResult: 'You lower your head and charge. His tusk catches your shoulder, opening a deep gash. But your countercharge drives him back. He circles, then moves off.',
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

  // ══════════════════════════════════════════════
  //  DROUGHT EVENT (missing real-world cause: ~15-20% of deaths)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-drought',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The waterhole is a cracked basin of gray mud. You dig with your forefeet, trunk scooping earth. Water seeps in, brown and warm. Barely enough to wet your mouth. The herd stands in the open sun, waiting.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
    ],
    choices: [
      {
        id: 'dig-deeper',
        label: 'Dig deeper into the dry riverbed',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: -40 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Collapsed from dehydration while digging for water.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'march-to-river',
        label: 'March toward the distant river',
        description: 'Two days of walking through open savanna',
        statEffects: [
          { stat: StatId.TRA, amount: 10, label: '+TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -60 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The river was dry. You walked until your legs would not carry you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['environmental', 'danger', 'drought'],
    footnote: 'Drought is one of the leading natural causes of elephant mortality, particularly for calves and elderly animals. Extended dry seasons force herds to travel long distances between water sources.',
  },

  // ══════════════════════════════════════════════
  //  POACHING PATROL (increased frequency - real: ~15-25% of deaths)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-poacher-ambush',
    type: 'active',
    category: 'predator',
    narrativeText: 'A sharp crack echoes across the plain. Not thunder. The herd freezes. Another crack. A matriarch staggers. The smell of cordite drifts downwind.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-with-herd',
        label: 'Run with the herd',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.10,
          cause: 'A bullet found you as the herd scattered.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'charge-threat',
        label: 'Charge toward the noise',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.20,
          cause: 'You charged. They were waiting. A heavy-caliber round stopped you mid-stride.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 12,
    cooldown: 8,
    tags: ['predator', 'danger', 'human', 'poaching'],
    footnote: 'Poaching remains one of the greatest threats to African elephants. An estimated 20,000-30,000 elephants are killed annually for the ivory trade.',
  },

  // ══════════════════════════════════════════════
  //  MATRIARCH POACHING (unique devastating event)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-matriarch-killed',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'A sound splits the air — not thunder, sharper, flatter. The matriarch stumbles. She falls to her knees, trunk reaching for the ground. ' +
      'The herd circles her, touching her with their trunks, pushing at her flanks with their foreheads. She does not rise. ' +
      'Hours pass. The herd will not leave. Then the humans come with saws and axes. They take her face. They leave the rest. ' +
      'The herd stands over what remains, swaying, rumbling at frequencies too low for the killers to hear. ' +
      'She knew where the water was. She knew the safe paths. She knew which seasons brought the rains. That knowledge is gone.',
    statEffects: [
      { stat: StatId.TRA, amount: 25, label: '+TRA (grief)' },
      { stat: StatId.HOM, amount: 20, label: '+HOM (disruption)' },
      { stat: StatId.WIS, amount: -15, label: '-WIS (lost knowledge)' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'matriarch-killed' },
    ],
    conditions: [
      { type: 'no_flag', flag: 'matriarch-killed' },
      { type: 'age_range', min: 60 },
    ],
    weight: 3,
    cooldown: 9999,
    tags: ['predator', 'danger', 'human', 'poaching'],
    footnote: 'When poachers kill a matriarch for ivory, the herd loses decades of accumulated knowledge about water sources, safe migration routes, and predator avoidance. Orphaned herds have significantly higher mortality, especially during drought years.',
  },

  // ══════════════════════════════════════════════
  //  NEW MATRIARCH EMERGES (recovery after loss)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-new-matriarch',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The oldest cow has been walking at the front for months now. When the herd hesitates at a fork in the trail, she does not. ' +
      'She tests the wind, turns, and walks. The others follow. She is not the one who was lost — she is smaller, her tusks shorter, her memory shallower. ' +
      'But she remembers some things. A waterhole from three dry seasons ago. A path that avoids the place where the guns were. ' +
      'It is not enough. It will have to be enough.',
    statEffects: [
      { stat: StatId.TRA, amount: -8, label: '-TRA (stability)' },
      { stat: StatId.WIS, amount: 5, label: '+WIS (new leadership)' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'new-matriarch-emerged' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'matriarch-killed' },
      { type: 'no_flag', flag: 'new-matriarch-emerged' },
      { type: 'age_range', min: 120 },
    ],
    weight: 0.8,
    cooldown: 9999,
    tags: ['social', 'milestone'],
    footnote: 'After a matriarch is killed, the next-oldest female gradually assumes leadership. She has less experience — fewer drought memories, fewer safe-route memories — but can slowly rebuild the herd\'s knowledge base over years of exploration.',
  },

  // ══════════════════════════════════════════════
  //  DROUGHT CRISIS (severe drought starvation event)
  // ══════════════════════════════════════════════

  {
    id: 'elephant-drought-crisis',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The dry season stretches past all memory. The waterhole is a cracked basin. The herd stands in the sun, ribs showing through dust-coated skin. Calves stumble and do not rise.',
    statEffects: [
      { stat: StatId.HOM, amount: 15, label: '+HOM' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.HEA, amount: -10, label: '-HEA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -80 },
    ],
    choices: [
      {
        id: 'trek-to-distant-water',
        label: 'Trek to a distant water source',
        description: 'Days of walking across parched land.',
        narrativeResult: 'The herd walks for three days. Two calves fall behind and do not follow. You reach a muddy seep. Barely enough.',
        statEffects: [
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -40 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Collapsed during drought migration. The herd walked on without you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'wait-for-rain',
        label: 'Dig for water and wait',
        description: 'Use your tusks to dig wells in the dry riverbed.',
        narrativeResult: 'You dig. Brown water seeps in, barely enough to drink. The herd waits. Days pass. Vultures circle.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -60 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'Starvation during prolonged drought. Your body gave out at the dry riverbed.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['african-elephant'] },
      { type: 'season', seasons: ['winter', 'autumn'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['environmental', 'drought', 'danger'],
    footnote: 'Drought is a major cause of elephant mortality. During severe droughts in Kenya and Tanzania, elephant mortality rates can spike to 10-20% in a single season.',
  },
];
