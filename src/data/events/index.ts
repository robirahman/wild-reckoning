import type { GameEvent } from '../../types/events';
import { StatId } from '../../types/stats';
import { HUMAN_ENCOUNTER_EVENTS } from './human-encounter-events';
import { CROSS_SPECIES_EVENTS } from './cross-species-events';
import { TERRITORY_EVENTS } from './territory-events';

export const allEvents: GameEvent[] = [
  ...HUMAN_ENCOUNTER_EVENTS,
  ...CROSS_SPECIES_EVENTS,
  ...TERRITORY_EVENTS,
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'foraging-blueberry-shrub',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "You smell the blueberries before you see them. The shrub is heavy with fruit, slightly overripe, the skins splitting and sweet. You strip the branches with your lips, juice staining your muzzle.",
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    subEvents: [
      {
        eventId: 'parasite-meningeal-worm-slug',
        chance: 0.15,
        conditions: [
          { type: 'season', seasons: ['summer', 'autumn'] },
          { type: 'no_parasite', parasiteId: 'meningeal-worm' },
        ],
        narrativeText: 'As you fill up on berries, you accidentally bite a slug in two, ingesting Parelaphostrongylus tenuis larvae which quickly embed themselves in your meninges.',
        footnote: '(Parasitized by meningeal worms)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'meningeal-worm', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['foraging', 'food', 'berry'],
  },

  {
    id: 'foraging-acorn-mast',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "The oaks have dropped their acorns in abundance this year. You nose through the leaf litter, cracking open the hard shells to get at the rich, fatty nutmeat inside. Your gut fills steadily for the first time in weeks.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 15,
    cooldown: 4,
    tags: ['foraging', 'food'],
  },

  {
    id: 'foraging-browse-saplings',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "You find a stand of young maple saplings at the forest edge. Their tender bark and buds provide decent nutrition, though stripping the bark leaves your teeth aching.",
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 20,
    cooldown: 2,
    tags: ['foraging', 'food'],
  },

  {
    id: 'foraging-frozen-lichen',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "You scrape at frozen lichen on the rocks. It flakes off in thin, tasteless strips. Your stomach stays hollow. The cold pulls heat from your body faster than the food replaces it.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'winter'],
  },

  {
    id: 'foraging-crop-field',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "You discover rows of tall green plants at the edge of your range. The smell is rich and heavy with nutrition. But there is something metallic and sharp in the air. A fence. And beyond it, lights.",
    statEffects: [
      { stat: StatId.HOM, amount: -10, label: '-HOM' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'eat-crops',
        label: 'Feed on the crops',
        narrativeResult: 'You gorge on the plants, gaining weight fast. Your ears stay pinned back the whole time, swiveling toward the lights.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 4 },
          { type: 'set_flag', flag: 'visited-crop-field' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'avoid-crops',
        label: 'Stay in the forest',
        narrativeResult: 'You turn away from the field and move back into the trees. Your stomach is empty, but the metallic smell fades behind you.',
        statEffects: [
          { stat: StatId.TRA, amount: -2, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['foraging', 'food', 'danger', 'human'],
  },

  {
    id: 'foraging-toxic-plant',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "Browsing through unfamiliar undergrowth, you munch on a patch of plants you don't recognize. The leaves taste slightly bitter, and within minutes, your stomach cramps violently. You've eaten water hemlock.",
    statEffects: [
      { stat: StatId.HOM, amount: 15, label: '+HOM' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'stat_below', stat: StatId.WIS, threshold: 40 },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['foraging', 'food', 'danger'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'predator-wolf-pack',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: "You catch the scent before you see them. Wolf musk, carried on the wind from the northwest. Through the trees, gray shapes move together without sound. They have not spotted you yet, but they are heading your way.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-wolves',
        label: 'Run immediately',
        narrativeResult: 'You bolt through the underbrush. Branches whip your face. The sounds of pursuit fade behind you. The sprint leaves you winded and lighter.',
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
          cause: 'Killed by wolves. They ran you down.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'freeze-wolves',
        label: 'Freeze and hope they pass',
        description: 'Risky if they catch your scent',
        narrativeResult: 'You lock every muscle and stop breathing. The wolves pass within yards of you, their noses working the air. They move on. Your heart hammers in your skull long after they are gone.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.25,
          cause: 'Killed by wolves. You froze, and they found you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['northern-minnesota'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'danger', 'wolf'],
  },

  {
    id: 'predator-coyote-stalk',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: "A lone coyote has been following you for the past hour, keeping its distance but never leaving. Too small to charge you directly. It circles when you stop, watches when you move, and does not go away.",
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['predator', 'danger'],
  },

  {
    id: 'predator-hunting-season',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: "A sharp crack echoes through the trees. Then another. The air fills with an acrid, burning smell. Somewhere nearby, a deer screams. The sound carries and does not stop.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'flee-deep-forest',
        label: 'Flee deeper into the forest',
        narrativeResult: 'You bolt into the dense timber, putting as much distance as you can between yourself and the gunfire. The shots grow fainter. You find a thicket of cedar and collapse, sides heaving.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'deep-forest-refuge' },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'Shot by a hunter while fleeing.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'hunker-down',
        label: 'Hide where you are',
        narrativeResult: 'You press yourself flat against the ground behind a fallen log, every sense straining. Boots crunch through leaves nearby. You do not breathe. Eventually, the sounds move on.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'Shot by a hunter. You never heard the bullet.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['predator', 'danger', 'human'],
  },

  {
    id: 'predator-cougar-ambush',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: "A twig snaps behind you. You spin. A cougar crouches in the underbrush less than thirty feet away, its amber eyes fixed on you, body low and still. Every muscle in your body locks at once.",
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 15, label: '+ADV' },
    ],
    choices: [
      {
        id: 'bolt-cougar',
        label: 'Bolt: run as fast as you can',
        narrativeResult: 'You launch yourself away in a burst of speed, zigzagging through the trees. You hear it give chase, but it falls behind. After a minute of flat-out running, the sounds stop. Your legs tremble.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.07,
          cause: 'Killed by a cougar. It caught you mid-stride.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stand-ground-cougar',
        label: 'Stand tall and stomp',
        description: 'Intimidation display, may or may not work',
        narrativeResult: 'You rear up, making yourself as large as possible, and bring your front legs crashing down. The cougar flinches, holds still, then slinks away into the underbrush.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.18,
          cause: 'Killed by a cougar. Your intimidation display failed.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['predator', 'danger'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'seasonal-migration-decision',
    type: 'active',
    category: 'migration',
    narrativeText: "The air stings your nostrils with cold. Other deer move past, heading in the same direction, their breath steaming. Something in your body pulls you to follow. But your leg aches, and you know this ground.",
    statEffects: [],
    choices: [
      {
        id: 'follow-migration',
        label: 'Follow migrating deer',
        narrativeResult: 'When the herd moves south, you follow. Their scent trail pulls you along the same paths.',
        statEffects: [],
        consequences: [
          { type: 'set_flag', flag: 'will-migrate' },
        ],
        revocable: true,
        style: 'default',
      },
      {
        id: 'stay-put',
        label: "Don't follow",
        narrativeResult: 'You stay. The other deer move on without you. The smells here are ones you know.',
        statEffects: [],
        consequences: [
          { type: 'remove_flag', flag: 'will-migrate' },
        ],
        revocable: true,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'migration-decided' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['seasonal', 'migration'],
  },

  {
    id: 'seasonal-first-frost',
    type: 'active',
    category: 'seasonal',
    narrativeText: "You wake and the ground crunches underfoot. Every blade of grass is sheathed in white crystal and your breath steams. The first hard frost. The insects are gone. The air is sharp and still.",
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'first-frost-seen' },
    ],
    weight: 25,
    tags: ['seasonal', 'weather'],
    footnote: undefined,
    subEvents: [{
      eventId: 'frost-tick-die-off',
      chance: 0.6,
      narrativeText: 'The biting insects and ticks that clung to your hide are gone. The cold killed them.',
      statEffects: [],
      consequences: [
        { type: 'set_flag', flag: 'first-frost-seen' },
      ],
    }],
  },

  {
    id: 'seasonal-rut-onset',
    type: 'active',
    category: 'seasonal',
    narrativeText: "The forest smells different. Bucks are rubbing their antlers against trees, scraping the ground, filling the air with a sharp, musky odor. The smell is everywhere. Your body tenses and your ears stay forward.",
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rut-seen' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 16 },
      { type: 'no_flag', flag: 'rut-seen' },
    ],
    weight: 20,
    cooldown: 20,
    tags: ['seasonal', 'social', 'mating'],
  },

  // ══════════════════════════════════════════════
  //  HEALTH EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'health-stagnant-water',
    type: 'active',
    category: 'health',
    simulated: true,
    narrativeText: "Thirst drives you to a stagnant pool at the edge of a wetland. The water is warm, brown, and smells of decay. Tiny wriggling things are visible just below the surface. But you're so thirsty.",
    statEffects: [],
    choices: [
      {
        id: 'drink-stagnant',
        label: 'Drink anyway',
        narrativeResult: 'You drink deeply. The water tastes of rot but the dryness in your throat eases. The foul taste stays in your mouth.',
        statEffects: [
          { stat: StatId.HOM, amount: -5, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'search-clean-water',
        label: 'Search for cleaner water',
        narrativeResult: 'You leave the stagnant pool behind and search for a flowing stream. You find one eventually, but the extra travel leaves you a little leaner.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'liver-fluke-infection',
        chance: 0.2,
        conditions: [
          { type: 'no_parasite', parasiteId: 'liver-fluke' },
        ],
        narrativeText: 'The aquatic vegetation you brushed against carried Fascioloides magna metacercariae. Liver fluke larvae are now burrowing through your intestinal wall toward your liver.',
        footnote: '(Infected with liver flukes)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'liver-fluke', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['health', 'foraging', 'water'],
  },

  {
    id: 'health-tick-brush',
    type: 'active',
    category: 'health',
    simulated: true,
    narrativeText: "Pushing through a dense thicket of tall grass and low shrubs, you feel the familiar tiny prickling of legs crawling up your body. Ticks. Dozens of them, questing from the vegetation onto your warm hide.",
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'tick-infestation',
        chance: 0.3,
        conditions: [
          { type: 'no_parasite', parasiteId: 'lone-star-tick' },
        ],
        narrativeText: 'Several Lone Star ticks have embedded themselves deeply. You can feel them swelling as they feed.',
        footnote: '(Infested with Lone Star ticks)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'lone-star-tick', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['health', 'exploration'],
  },

  {
    id: 'health-wound-infection-risk',
    type: 'active',
    category: 'health',
    simulated: true,
    narrativeText: "Your injured leg is throbbing more than usual today. The area around the wound feels hot and swollen. A fly keeps landing on it, no matter how many times you twitch it away.",
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    conditions: [
      { type: 'has_injury' },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['health'],
  },

  // ══════════════════════════════════════════════
  //  PSYCHOLOGICAL / PASSIVE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'passive-ptsd-wolf-chase',
    type: 'passive',
    category: 'psychological',
    narrativeText: "A gust of wind carries wolf-musk and your body seizes before you can think. Your legs lock, your nostrils flare, your heart slams in your chest. The scent fades but the panic stays. You cannot settle. Every smell on the wind snaps your head up.",
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'stat_above', stat: StatId.TRA, threshold: 50 },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['psychological', 'trauma'],
  },

  {
    id: 'passive-startle-response',
    type: 'passive',
    category: 'psychological',
    narrativeText: "A branch snaps somewhere behind you and your whole body seizes. Your heart hammers so hard you can feel it in your skull. You sprint fifty yards before you stop, legs trembling, and look back. Nothing. Just the wind. But you can't stop shaking for the next hour.",
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [
      { type: 'stat_above', stat: StatId.TRA, threshold: 40 },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['psychological', 'trauma'],
  },

  {
    id: 'passive-peaceful-grazing',
    type: 'passive',
    category: 'psychological',
    narrativeText: "Warm air, thick with the hum of insects and the sweet smell of clover. You graze in a sunlit meadow. No scent of predators, no pain. Your muscles unclench, one by one.",
    statEffects: [
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    conditions: [
      { type: 'diet', diets: ['herbivore', 'omnivore'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'stat_below', stat: StatId.TRA, threshold: 60 },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['psychological', 'peaceful'],
  },

  {
    id: 'passive-herd-encounter',
    type: 'passive',
    category: 'social',
    narrativeText: "You come across a small group of does grazing together. They regard you cautiously at first, ears swiveling, noses twitching, but after a few minutes of mutual sniffing and circling, they accept your presence. You graze alongside them for the rest of the day. Your breathing slows. The alertness loosens in your muscles.",
    statEffects: [
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'herd'],
  },

  {
    id: 'passive-winter-cold-snap',
    type: 'passive',
    category: 'environmental',
    simulated: true,
    narrativeText: "The temperature plummets overnight. By morning the trees crack and pop in the cold. Your winter coat is not enough. You shiver violently, burning calories just to hold your body temperature.",
    statEffects: [
      { stat: StatId.CLI, amount: 12, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['environmental', 'weather', 'winter'],
  },

  {
    id: 'passive-spring-thaw',
    type: 'passive',
    category: 'environmental',
    narrativeText: "The snow is melting. Rivulets of water trickle everywhere, and the first green shoots push through the wet, dark earth. The air smells different. Wet soil, new growth, running water. Your muscles loosen after months of constant tension.",
    statEffects: [
      { stat: StatId.CLI, amount: -10, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'spring-thaw-seen' },
    ],
    weight: 25,
    tags: ['environmental', 'weather', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'seasonal-rut-onset-male',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Your neck has swollen thick with muscle and your antlers are hard and polished. The does are close. You smell them on the wind and your whole body tightens. Other bucks are rubbing trees, pawing the ground. You cannot hold still.",
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.STR, amount: -5, label: '-STR' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rut-seen' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 16 },
      { type: 'no_flag', flag: 'rut-seen' },
    ],
    weight: 20,
    cooldown: 20,
    tags: ['seasonal', 'social', 'mating'],
  },

  {
    id: 'reproduction-doe-mating',
    type: 'active',
    category: 'reproduction',
    narrativeText: "A large buck has been following you for hours, his neck swollen, his eyes dark. He stamps the ground and grunts, a low sound you feel in your chest. He is the largest buck in this area. Your body tenses. You smell him on every breath.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'accept-mating',
        label: 'Accept the buck',
        description: 'Mate and conceive offspring, pregnancy lasts ~7 months',
        narrativeResult: 'You stand still and let him approach. The mating is brief and rough. Afterward, he wanders off. Something has changed in your belly, a heaviness that was not there before.',
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
        id: 'evade-mating',
        label: 'Evade the buck',
        description: 'Flee, costs energy but preserves your body for winter',
        narrativeResult: 'You dodge and sprint through the trees. He pursues briefly but gives up. His scent fades behind you.',
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
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 18 },
      { type: 'has_flag', flag: 'rut-seen' },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 25,
    cooldown: 20,
    tags: ['mating', 'social'],
  },

  {
    id: 'reproduction-buck-competition',
    type: 'active',
    category: 'reproduction',
    simulated: true,
    narrativeText: "A rival buck stands in your path, antlers lowered, breath steaming. A doe watches from the tree line. He is bigger than you expected. His tines are long and sharp and his body is rigid with aggression.",
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'challenge-buck',
        label: 'Lock antlers and fight',
        description: 'Risk injury and defeat, but victory means mating rights',
        narrativeResult: 'You lower your head and charge. Antlers crash together with a sound like breaking branches. The fight is brutal and exhausting.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'attempted-buck-challenge' },
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'retreat-buck',
        label: 'Lower your antlers and retreat',
        description: 'Survive to fight another day, but no mating this season',
        narrativeResult: 'You turn away. He snorts and stamps. The doe stays near him. You walk until the smell of his musk fades.',
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
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 18 },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 15,
    cooldown: 8,
    tags: ['mating', 'social', 'danger'],
  },

  {
    id: 'reproduction-pregnancy-midpoint',
    type: 'passive',
    category: 'reproduction',
    narrativeText: "Your belly is heavier. You feel movement inside you, small kicks and shifts. You eat and eat but your stomach never stops asking for more. You rest in sheltered spots out of the wind and stay off the open ground.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pregnant' },
    ],
    weight: 15,
    cooldown: 6,
    tags: ['mating', 'health'],
  },

  {
    id: 'reproduction-fawn-independence',
    type: 'passive',
    category: 'reproduction',
    narrativeText: "Your fawns are growing fast. Their spots have faded, their legs are long and strong. Today they did not follow when you walked away. You watched them from a distance, grazing on their own, lifting their heads to test the wind.",
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'fawns-just-independent' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'fawns-just-independent' },
    ],
    weight: 30,
    cooldown: 4,
    tags: ['mating', 'social'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION / WINTER YARD EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'migration-winter-yard-browse',
    type: 'passive',
    category: 'foraging',
    simulated: true,
    narrativeText: "The cedar canopy closes overhead, dense enough to block the wind but also the light. You nose through the trampled snow alongside dozens of other deer. The bark has been stripped from every reachable branch. What browse remains is thin, fibrous, and bitter.",
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
      { stat: StatId.CLI, amount: -4, label: '-CLI' },
    ],
    conditions: [
      { type: 'region', regionIds: ['minnesota-winter-yard'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 18,
    cooldown: 3,
    tags: ['foraging', 'food', 'winter', 'migration'],
  },

  {
    id: 'migration-winter-yard-disease',
    type: 'active',
    category: 'health',
    simulated: true,
    narrativeText: "A doe near the center of the yard is coughing, a wet, rattling sound that carries through the still air. Her ribs show through her dull coat and thick mucus drips from her nose. Other deer stand apart from her, but the yard is small. You smell the sickness on her breath from where you stand.",
    statEffects: [
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    choices: [
      {
        id: 'stay-close-herd',
        label: 'Stay close to the herd center',
        description: 'Warmth and safety in numbers, but disease exposure',
        narrativeResult: 'You push deeper into the herd, sheltering from the wind among dozens of warm bodies. The sick doe coughs nearby. The smell of her sickness is thick in the still air.',
        statEffects: [
          { stat: StatId.CLI, amount: -3, label: '-CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'move-periphery',
        label: 'Move to the yard periphery',
        description: 'Less disease risk, but more exposed to cold and predators',
        narrativeResult: 'You drift to the outer edge of the yard, away from the sick animals. The wind cuts harder here and the cold settles into your muscles. The air smells of snow and pine, nothing else.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.CLI, amount: 4, label: '+CLI' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'winter-yard-liver-fluke',
        chance: 0.18,
        conditions: [
          { type: 'no_parasite', parasiteId: 'liver-fluke' },
        ],
        narrativeText: 'The close quarters have done their work. Within days, you develop a persistent cough and a heaviness in your abdomen. Liver flukes, passed through contaminated browse.',
        footnote: '(Infected with liver flukes)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_parasite', parasiteId: 'liver-fluke', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'region', regionIds: ['minnesota-winter-yard'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['health', 'social', 'winter', 'migration'],
  },

  {
    id: 'migration-winter-yard-predator',
    type: 'active',
    category: 'predator',
    simulated: true,
    narrativeText: "Wolves. You hear them before you see them. Low howls drifting through the frozen air. They circle the edges of the winter yard. The herd presses tighter together, bodies warm and trembling. The center is packed with other deer, the browse there already stripped bare.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'stay-center',
        label: 'Stay in the center of the group',
        description: 'Safe from wolves, but no food',
        narrativeResult: 'You press into the center of the herd, your stomach empty. The wolves circle and probe but do not come closer. Too many bodies packed together, too many sharp edges.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'venture-edge-browse',
        label: 'Venture to the edge for better browse',
        description: 'Food, but exposed to the wolves',
        narrativeResult: 'You slip toward the edge of the yard, finding scraps of browse the others missed. You eat quickly, one eye on the gray shapes pacing in the tree line.',
        statEffects: [
          { stat: StatId.HOM, amount: -4, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 1 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Killed by wolves at the edge of the winter yard.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['minnesota-winter-yard'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['predator', 'danger', 'wolf', 'winter', 'migration'],
  },

  {
    id: 'migration-spring-return',
    type: 'passive',
    category: 'migration',
    narrativeText: "The air smells wet and warm. The snow in the yard is thinning. One morning you begin to walk north, following trails packed hard into the ground. Your body is thinner, weaker, but the longer light keeps you moving.",
    statEffects: [
      { stat: StatId.CLI, amount: -8, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
      { type: 'remove_flag', flag: 'returned-from-migration' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'returned-from-migration' },
    ],
    weight: 25,
    cooldown: 20,
    tags: ['migration', 'seasonal', 'spring'],
  },

  // ══════════════════════════════════════════════
  //  AGE-GATED EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'age-fawn-first-steps',
    type: 'passive',
    category: 'environmental',
    narrativeText: "You stumble over roots, your thin legs folding beneath you on the uneven ground. Everything is new. The taste of clover, the sound of wind through birch leaves, the bright open space overhead. You fall and get up. You fall again and get up faster.",
    statEffects: [
      { stat: StatId.WIS, amount: -3, label: '-WIS' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    conditions: [
      { type: 'age_range', max: 6 },
    ],
    weight: 15,
    cooldown: 4,
    tags: ['age', 'fawn', 'learning'],
  },

  {
    id: 'age-fawn-mother-lesson',
    type: 'passive',
    category: 'social',
    narrativeText: "Your mother freezes mid-step, one foreleg suspended, ears locked forward. You freeze too. For a long minute, nothing moves. Then she relaxes, lowers her head, and resumes grazing. When she goes still, you go still. Your muscles learn it before you do.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'age_range', max: 12 },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['age', 'fawn', 'learning', 'social'],
  },

  {
    id: 'age-yearling-first-antlers',
    type: 'passive',
    category: 'health',
    narrativeText: "Two hard, hot knobs of bone are pushing through the skin above your eyes, sheathed in velvet that itches. You rub them against every tree you pass, leaving smears of blood and fuzz on the bark. They are small, barely more than spikes, but the pressure and heat of their growth is constant.",
    statEffects: [
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.STR, amount: -3, label: '-STR' },
    ],
    conditions: [
      { type: 'age_range', min: 12, max: 24 },
      { type: 'sex', sex: 'male' },
    ],
    weight: 15,
    cooldown: 12,
    tags: ['age', 'yearling', 'antlers', 'growth'],
  },

  {
    id: 'age-elderly-slowing-down',
    type: 'passive',
    category: 'health',
    narrativeText: "You walk around the fallen oak you once cleared in a single bound. Your joints grind and the cold settles into your bones. Younger deer pass you easily, their strides long and careless. But your ears catch sounds theirs miss, and you know which thickets smell of wolves.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    conditions: [
      { type: 'age_range', min: 96 },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['age', 'elderly', 'health'],
  },

  // ══════════════════════════════════════════════
  //  EVENT CHAINING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'chain-crop-field-return',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "The smell of those plants pulls you back to the field's edge. Something is different tonight. A small blinking light sits on a post near the fence line, a red point flashing on and off. The plants are still there. The light was not here before.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'raid-again',
        label: 'Raid the field again',
        description: 'The farmer may be watching now',
        narrativeResult: 'You slip past the blinking light and into the rows. The plants are as good as you remember. As you eat, you hear a click from the direction of the light.',
        statEffects: [
          { stat: StatId.HOM, amount: -8, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'crop-field-targeted' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Shot near the field. The blinking light saw you first.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'resist-temptation',
        label: 'Resist and walk away',
        narrativeResult: 'You stare at the field, then turn and walk into the trees. The smell of the plants fades behind you.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.TRA, amount: -2, label: '-TRA' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'visited-crop-field' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'visited-crop-field' },
    ],
    weight: 14,
    cooldown: 8,
    tags: ['foraging', 'food', 'danger', 'human', 'chain'],
  },

  {
    id: 'chain-deep-forest-discovery',
    type: 'passive',
    category: 'foraging',
    simulated: true,
    narrativeText: "Your sprint carried you deeper into the forest than you have ever been, past old hemlocks, past mossy boulders, into a hollow. A spring bubbles up between two rocks, clear and cold. Wild mushrooms and fiddlehead ferns grow thick around it. The smell of cold water and green growth fills your nostrils.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -6, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 3 },
      { type: 'remove_flag', flag: 'deep-forest-refuge' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'deep-forest-refuge' },
    ],
    weight: 16,
    cooldown: 10,
    tags: ['foraging', 'food', 'exploration', 'chain'],
  },

  {
    id: 'chain-wolf-territory-marked',
    type: 'passive',
    category: 'psychological',
    narrativeText: "You pause at a spruce trunk and inhale. Wolf urine, acrid and sharp in the cold air. The smell still makes your muscles clench, but you do not bolt. You read it: old scent, several animals, heading east. You turn and choose a different path.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
    ],
    conditions: [
      { type: 'stat_above', stat: StatId.TRA, threshold: 60 },
      { type: 'stat_above', stat: StatId.WIS, threshold: 30 },
    ],
    weight: 10,
    cooldown: 10,
    tags: ['psychological', 'wolf', 'learning', 'chain'],
  },

  {
    id: 'chain-injury-adaptation',
    type: 'passive',
    category: 'health',
    narrativeText: "You barely notice the limp anymore. The sharp pain has dulled to a familiar ache. Your body has shifted weight to the stronger legs, compensating without your attention. You move differently now, placing each step with care.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
    ],
    conditions: [
      { type: 'has_injury' },
      { type: 'stat_above', stat: StatId.WIS, threshold: 40 },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['health', 'learning', 'chain'],
  },

  // ══════════════════════════════════════════════
  //  GENERAL NEW EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'environmental-road-crossing',
    type: 'active',
    category: 'environmental',
    simulated: true,
    narrativeText: "The forest ends abruptly at a strip of black hardness that reeks of tar and exhaust. Trees continue on the other side, but between here and there, metal shapes hurtle past with a roar of displaced air. You watch one pass, then another. The gap between them is brief.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-road',
        label: 'Cross quickly',
        description: 'Sprint across during a gap in traffic',
        narrativeResult: 'You wait for a gap and bolt across the hard surface. Your feet slip on the smooth ground. Headlights swing around a curve behind you as you reach the trees on the other side.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Struck by a vehicle while crossing the hard surface.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'go-around-road',
        label: 'Find a way around',
        description: 'Follow the tree line, longer but safer',
        narrativeResult: 'You turn and follow the tree line, searching for a safer way across. Eventually you find a culvert beneath the hard surface. Dark and cramped, but no machines.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['environmental', 'danger', 'human'],
  },

  {
    id: 'seasonal-summer-storm',
    type: 'passive',
    category: 'seasonal',
    narrativeText: "The sky darkens. The wind shifts and the trees bend sideways, their leaves flashing silver undersides. Then the rain hits in sheets, blinding and deafening. Lightning splits a birch tree nearby with a crack you feel in your chest. You press yourself against a boulder and wait, trembling.",
    statEffects: [
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
      { stat: StatId.ADV, amount: 7, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    subEvents: [
      {
        eventId: 'lightning-near-miss',
        chance: 0.08,
        narrativeText: 'Lightning strikes a tree so close that you feel the heat on your flank and the static lifts the hair along your spine. The crack of splitting wood and the thunder are a single sound. The tree smolders where you were standing moments ago.',
        statEffects: [
          { stat: StatId.TRA, amount: 12, label: '+TRA' },
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['seasonal', 'weather', 'environmental'],
  },

  {
    id: 'social-territorial-dispute',
    type: 'active',
    category: 'social',
    narrativeText: "Another deer is already at the browse patch, the one with tender young growth and the sheltering overhang. It sees you and lowers its head, ears flattened, one forehoof stamping. The muscles in its neck bunch tight.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'stand-ground-dispute',
        label: 'Stand your ground',
        description: 'Fight for access to the food',
        narrativeResult: 'You stamp and lower your head. The other deer stamps back. After a tense exchange of snorts and stiff posturing, the other deer moves off. The food is yours.',
        statEffects: [
          { stat: StatId.ADV, amount: 4, label: '+ADV' },
          { stat: StatId.STR, amount: -2, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'yield-dispute',
        label: 'Yield and move on',
        description: 'Avoid conflict, find food elsewhere',
        narrativeResult: 'You turn and walk away. There are other patches further on.',
        statEffects: [
          { stat: StatId.ADV, amount: -4, label: '-ADV' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'foraging'],
  },

  {
    id: 'foraging-mushroom-patch',
    type: 'active',
    category: 'foraging',
    simulated: true,
    narrativeText: "A cluster of mushrooms pushes from the base of a rotting stump, pale caps fanning out in overlapping shelves. The smell is earthy and rich. You nose at them. Some fungi nourish. Others poison. The scent alone does not tell you which.",
    statEffects: [],
    choices: [
      {
        id: 'eat-mushrooms',
        label: 'Eat the mushrooms',
        description: 'Could be nourishing or fatal',
        narrativeResult: 'You bite into the pale flesh. The taste is nutty, rich, and satisfying. Your stomach settles around the food.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'pass-mushrooms',
        label: 'Leave them alone',
        narrativeResult: 'You sniff once more and move on. Your stomach is empty, but the smell was not right.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'mushroom-toxicity',
        chance: 0.25,
        narrativeText: 'Within hours, your stomach cramps hard. You cannot eat. You lie on your side, shaking, too weak to stand. The sickness lasts for days.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
        ],
        consequences: [],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['white-tailed-deer'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['foraging', 'food', 'danger'],
  },
];
