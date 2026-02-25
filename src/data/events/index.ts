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
    narrativeText: "You come across a blueberry shrub! They're slightly overripe at this time of year, but you still find them a delightful treat compared to the usual leaves and lichen.",
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
    narrativeText: "The oaks have dropped their acorns in abundance this year. You spend the better part of the day nosing through the leaf litter, cracking open the hard shells to get at the rich, fatty nutmeat inside. It's the most satisfying meal you've had in weeks.",
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
    narrativeText: "You find a stand of young maple saplings at the forest edge. Their tender bark and buds provide decent nutrition, though stripping the bark leaves your teeth aching. The saplings won't survive your visit, but that's not your concern.",
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
    narrativeText: "Food is desperately scarce. You scrape at the frozen lichen on the rocks, but it's barely enough to slow the gnawing emptiness in your stomach. Your body is burning through its fat reserves just to keep warm.",
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
    narrativeText: "You discover a farmer's soybean field at the edge of your range. The plants are lush and nutritious — far richer than anything the forest offers. But you can smell something metallic and sharp in the air. A fence. And beyond it, lights.",
    statEffects: [
      { stat: StatId.HOM, amount: -10, label: '-HOM' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'eat-crops',
        label: 'Feed on the crops',
        narrativeResult: 'You gorge yourself on the soybeans, gaining valuable weight. The risk gnaws at you — but the food is too good to pass up.',
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
        narrativeResult: 'You turn away from the field and melt back into the trees. Safer, but hungrier.',
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
    narrativeText: "Browsing through unfamiliar undergrowth, you munch on a patch of plants you don't recognize. The leaves taste slightly bitter — and within minutes, your stomach cramps violently. You've eaten water hemlock.",
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
    narrativeText: "You catch the scent before you see them — the unmistakable musk of wolves, carried on the wind from the northwest. Through the trees, you glimpse gray shapes moving in coordinated silence. They haven't spotted you yet, but they're heading your way.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-wolves',
        label: 'Run immediately',
        narrativeResult: 'You explode into motion, crashing through the underbrush. Branches whip your face as you run. The sounds of pursuit fade behind you — you outran them, but the sprint cost you dearly.',
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
          cause: 'Killed by wolves — they ran you down.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'freeze-wolves',
        label: 'Freeze and hope they pass',
        description: 'Risky if they catch your scent',
        narrativeResult: 'You lock every muscle in your body and stop breathing. The wolves pass within yards of you, their noses working the air. After what feels like an eternity, they move on. Your heart hammers so loudly you wonder how they missed it.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.25,
          cause: 'Killed by wolves — you froze, and they found you.',
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
    narrativeText: "A lone coyote has been shadowing you for the past hour, keeping its distance but never quite leaving. It's too small to threaten a deer your size head-on, but you've seen what they do to the sick and the injured — they wait.",
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
    narrativeText: "The crack of a rifle echoes through the forest. Then another. The air fills with the acrid smell of gunpowder. Somewhere nearby, a deer screams — a sound you didn't know a deer could make. Hunting season has begun.",
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
    narrativeText: "A twig snaps behind you. You spin — and there it is. A cougar, crouched in the underbrush less than thirty feet away, its amber eyes locked onto you with the flat, patient focus of a predator that has already decided you are food. Time stops.",
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 15, label: '+ADV' },
    ],
    choices: [
      {
        id: 'bolt-cougar',
        label: 'Bolt — run as fast as you can',
        narrativeResult: 'You launch yourself away in a burst of speed, zigzagging through the trees. You hear it give chase — but cougars are sprinters, not distance runners. After a terrifying minute, you realize you\'ve lost it.',
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
          cause: 'Killed by a cougar — it caught you mid-flight.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stand-ground-cougar',
        label: 'Stand tall and stomp',
        description: 'Intimidation display — may or may not work',
        narrativeResult: 'You rear up, making yourself as large as possible, and bring your hooves crashing down. The cougar flinches — and after a long, tense standoff, it slinks away into the underbrush. You learned something about yourself today.',
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
    narrativeText: "The air's been getting colder and colder lately. You don't know why, or what that implies, but an itch in your mind tells you that you might soon want to follow other deer to someplace warmer. At the same time, though, your leg needs rest. While no migration has started yet, you think about what you'll do when one does.",
    statEffects: [],
    choices: [
      {
        id: 'follow-migration',
        label: 'Follow migrating deer',
        narrativeResult: 'You decide you\'ll join the migration when it begins. When the herd moves south toward the winter yards, you\'ll go with them.',
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
        narrativeResult: 'You decide to stay put and tough out the winter in familiar territory. Riskier, but you know these woods.',
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
    narrativeText: "You wake to a world transformed. Every blade of grass is sheathed in white crystal, and your breath hangs in the air like smoke. The first hard frost has arrived. The last of the summer insects are gone, and the forest has fallen into an eerie silence.",
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
      narrativeText: 'On the bright side, the frost has killed off many of the biting insects and ticks that have plagued you.',
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
    narrativeText: "Something has changed in the forest. The bucks are acting strangely — rubbing their antlers against trees, scraping the ground, filling the air with a sharp, musky odor. The rut is beginning. Even as a doe, you feel the electric tension that has settled over everything.",
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
    narrativeText: "Thirst drives you to a stagnant pool at the edge of a wetland. The water is warm, brown, and smells of decay. Tiny wriggling things are visible just below the surface. But you're so thirsty.",
    statEffects: [],
    choices: [
      {
        id: 'drink-stagnant',
        label: 'Drink anyway',
        narrativeResult: 'You drink deeply, your body grateful for the moisture despite the foul taste. Your thirst is quenched — but at what cost?',
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
        narrativeText: 'Unbeknownst to you, the aquatic vegetation you brushed against harbored Fascioloides magna metacercariae — liver fluke larvae that are now burrowing through your intestinal wall toward your liver.',
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
    narrativeText: "Pushing through a dense thicket of tall grass and low shrubs, you feel the familiar tiny prickling of legs crawling up your body. Ticks — dozens of them, questing from the vegetation onto your warm hide.",
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
    narrativeText: "You remember outrunning that wolf pack last week, but it just keeps on replaying in the back of your mind. A single whiff of their stench is enough to bring waves of black terror crashing down on you, and your nightly visions haven't been about anything else since. Every night, you relive every second of the chase, drowning in a primal state of panic as the wolves try to... they try to... no, no, no, no, no, no, no. You don't know why this keeps happening to you.",
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
    narrativeText: "For the first time in a while, the world feels quiet. You graze in a sunlit meadow, the warm air thick with the hum of insects and the sweet smell of clover. No predators. No pain. Just the simple act of eating, breathing, existing. Your muscles unclench, one by one.",
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
    narrativeText: "You come across a small group of does grazing together. They regard you cautiously at first — ears swiveling, noses twitching — but after a few minutes of mutual sniffing and circling, they accept your presence. You graze alongside them for the rest of the day. There is a deep, wordless comfort in not being alone.",
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
    narrativeText: "The temperature plummets overnight. By morning, the world is a brittle, hostile place — the kind of cold that makes the trees crack and pop like gunshots. Your winter coat isn't enough. You shiver violently, burning precious calories just to maintain body temperature. This is the killing cold.",
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
    narrativeText: "The snow is melting. Rivulets of water trickle everywhere, and the first green shoots are pushing through the wet, dark earth. The air smells different — alive, fertile, rich with possibility. After months of cold and hunger, something inside you unclenches. You survived.",
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
    narrativeText: "A fire is building inside you. Your neck has swollen thick with muscle, your antlers are hard and polished, and a rage you can barely contain surges through your body. The does are close — you can smell them, their scent on the wind like a drug. Other bucks are moving through the woods, rubbing trees, pawing the ground. Something ancient and violent is about to begin.",
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
    narrativeText: "A large buck has been following you for hours, his neck swollen, his eyes dark and intent. He stamps the ground and grunts — a low, guttural sound that vibrates in your chest. He is the dominant buck in this part of the range, and he has chosen you. You feel the pull of instinct, overwhelming and ancient, but you also know that pregnancy will drain your body through the hardest months of winter.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'accept-mating',
        label: 'Accept the buck',
        description: 'Mate and conceive offspring — pregnancy lasts ~7 months',
        narrativeResult: 'You stand still and let him approach. The mating is brief and rough. Afterward, he wanders off without a backward glance. You are now carrying new life — and the long burden of winter pregnancy has begun.',
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
        description: 'Flee — costs energy but preserves your body for winter',
        narrativeResult: 'You dodge his advances and sprint away through the trees. He pursues briefly but gives up — there are other does. You\'ll enter winter without the burden of pregnancy.',
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
    weight: 18,
    cooldown: 20,
    tags: ['mating', 'social'],
  },

  {
    id: 'reproduction-buck-competition',
    type: 'active',
    category: 'reproduction',
    narrativeText: "A rival buck stands in your path, his antlers lowered, his breath steaming in the cold air. A doe watches from the tree line. This is the moment you've been building toward all autumn — the swollen neck, the sharpened antlers, the blind rage. He's bigger than you expected. His tines are long and sharp and his eyes are empty of everything except the intent to kill or be killed.",
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'challenge-buck',
        label: 'Lock antlers and fight',
        description: 'Risk injury and defeat, but victory means mating rights',
        narrativeResult: 'You lower your head and charge. Antlers crash together with a sound like breaking branches. The fight is brutal and exhausting — a test of everything you are.',
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
        narrativeResult: 'You turn away, the taste of defeat bitter in your mouth. He snorts triumphantly. The doe is his. Perhaps next year, you\'ll be stronger.',
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
    narrativeText: "Your belly is growing heavier by the week. You can feel them moving inside you — tiny kicks and shifts that wake you at night. Your body aches. You eat constantly, but nothing is ever enough. The fat reserves you built in autumn are melting away, and winter still has months left to go. You rest more than you used to, choosing sheltered spots out of the wind, and you find yourself avoiding the open meadows where predators might spot your slow, lumbering gait.",
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
    narrativeText: "Your fawns are growing fast. Their spots have faded, their legs are long and strong, and they no longer freeze at every sound. Today, for the first time, they didn't follow when you walked away. You watched them from a distance — grazing on their own, lifting their heads to test the wind — and you felt something you don't have a word for. Relief, maybe. Or loss. They don't need you anymore. The forest will decide their fate now.",
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
    narrativeText: "The cedar canopy closes overhead like a dark cathedral, blocking the worst of the wind but also the light. You nose through the trampled snow alongside dozens of other deer, all of you searching the same exhausted ground for anything edible. The bark has been stripped from every reachable branch, and what browse remains is thin, fibrous, bitter — food only in the loosest sense of the word.",
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
    narrativeText: "A doe near the center of the yard is coughing — a wet, rattling sound that carries through the still air. Her ribs show through her dull coat, and a thick mucus drips from her nose. Several other deer are keeping their distance, but in quarters this close, distance is an illusion. You can smell the sickness on her breath.",
    statEffects: [
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    choices: [
      {
        id: 'stay-close-herd',
        label: 'Stay close to the herd center',
        description: 'Warmth and safety in numbers, but disease exposure',
        narrativeResult: 'You push deeper into the herd, sheltering from the wind among dozens of warm bodies. The sick doe coughs nearby. You try not to breathe too deeply.',
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
        narrativeResult: 'You drift to the outer edge of the yard, away from the sick animals. The wind cuts harder here, and you can feel the cold draining your reserves. But at least the air is clean.',
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
        narrativeText: 'The close quarters have done their work. Within days, you develop a persistent cough and a heaviness in your abdomen — liver flukes, passed through contaminated browse.',
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
    narrativeText: "Wolves. You can hear them before you see them — low howls drifting through the frozen twilight, coordinating their approach. They circle the edges of the winter yard like shadows, testing, probing, looking for the weak link. The herd presses tighter together, a hundred heartbeats quickening as one. There is safety in the center, but the browse there is already gone.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'stay-center',
        label: 'Stay in the center of the group',
        description: 'Safe from wolves, but no food',
        narrativeResult: 'You huddle in the center of the herd, your stomach empty but your body safe. The wolves circle and probe, but the wall of antlers and hooves holds them at bay.',
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
    narrativeText: "Something shifts in the air — a softness, a wetness, a promise. The snow in the winter yard is thinning, and one morning you simply begin to walk. North. Toward the place you came from, following trails carved by a thousand generations of deer before you. The journey back is easier than the journey out; your body is thinner, weaker, but the lengthening days fill you with a strange, wordless hope.",
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
    narrativeText: "The world is enormous and incomprehensible. You stumble over roots that seem as tall as fallen trees, your thin legs folding beneath you on the uneven ground. Everything is new — the taste of clover, the sound of wind through birch leaves, the terrifying vastness of a sky you cannot yet understand. You fall, and you rise, and you fall again, and each time the rising comes a little easier.",
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
    narrativeText: "Your mother freezes mid-step, one foreleg suspended in the air, her ears locked forward like twin radar dishes. You freeze too — not because you understand the danger, but because her stillness is a language older than thought. For a long, breathless minute, nothing moves. Then she relaxes, lowers her head, and resumes grazing. You have just learned something you will carry for the rest of your life: when the world goes quiet, you go quieter.",
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
    narrativeText: "Something is happening on your skull. Two hard, hot knobs of bone are pushing through the skin above your eyes, sheathed in velvet that itches maddeningly. You rub them against every tree you pass, leaving smears of blood and fuzz on the bark. They are small — barely more than spikes — but they are yours, and when you lower your head and catch your reflection in a still pool, you see someone different staring back. Someone dangerous.",
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
    narrativeText: "You used to clear that fallen oak in a single bound. Today, you walk around it. Your joints grind like stones in a dry riverbed, and the cold settles into your bones with a permanence that no amount of sun can cure. The younger deer flow past you like water around a rock — effortless, thoughtless, alive in a way you recognize as something you once were. But your eyes are sharper than theirs. You see things they cannot. You know which shadows hold wolves.",
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
    narrativeText: "The memory of those soybeans has been gnawing at you for days — the sweetness, the easy abundance, the way your stomach felt full for once. Your hooves carry you back to the field's edge almost without your consent. But something is different tonight. A small blinking light sits mounted on a post near the fence line, its red eye winking in the darkness. The crops are still there. So is the trap.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'raid-again',
        label: 'Raid the field again',
        description: 'The farmer may be watching now',
        narrativeResult: 'You slip past the blinking camera and into the rows. The soybeans are as good as you remember. But as you eat, you feel eyes on you — and the click of something mechanical.',
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
          cause: 'Shot by a farmer defending his crops. The trail camera told him you were coming.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'resist-temptation',
        label: 'Resist and walk away',
        narrativeResult: 'You stare at the field for a long moment, then turn and disappear into the trees. The memory of easy food fades, replaced by a hard-won caution.',
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
    narrativeText: "Your flight from the hunters carried you deeper into the forest than you've ever been — past the old-growth hemlocks, past the mossy boulders where the light turns green and strange, into a hollow you didn't know existed. A spring bubbles up from between two rocks, clear and cold, and around it grows a carpet of wild mushrooms and fiddlehead ferns. It is a hidden larder, untouched by any other browser. For a moment, the terror of the hunt fades, replaced by something close to wonder.",
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
    narrativeText: "You pause at a spruce trunk and inhale — and there it is, the acrid reek of wolf urine, sharp as a knife against the cold air. Once, this smell would have paralyzed you. But something has changed. You have survived them before, and the surviving has left marks deeper than scars. Now you read the scent like a map: how old, how many, which direction they were traveling. You turn calmly and choose a different path. Fear has become knowledge.",
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
    narrativeText: "You barely notice the limp anymore. What was once a searing lance of pain with every step has become a dull, familiar ache — part of you now, like your heartbeat or the rhythm of your breathing. Your body has quietly reorganized itself around the damage, shifting weight to your stronger legs, compensating with a grace born of necessity. You are not the deer you were before the injury. You are something harder, something more careful, something that has learned the cost of each step and spends them wisely.",
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
    narrativeText: "The forest ends abruptly at a strip of black asphalt. A two-lane road cuts through your range like a wound, reeking of tar and exhaust. You can see the trees continuing on the other side — your destination, your food, your safety — but between here and there is a gauntlet of hurtling metal and blinding light. You watch a car pass, then another. The gap between them feels both infinite and impossibly short.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-road',
        label: 'Cross quickly',
        description: 'Sprint across during a gap in traffic',
        narrativeResult: 'You wait for a gap and bolt across the asphalt, hooves clattering on the hard surface. Headlights swing around a curve behind you as you plunge back into the safety of the trees.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Struck by a car while crossing the road. The driver never even slowed down.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'go-around-road',
        label: 'Find a way around',
        description: 'Follow the tree line — longer, but safer',
        narrativeResult: 'You turn and follow the tree line, searching for a safer way across. Eventually you find a culvert under the road — dark and cramped, but no cars.',
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
    narrativeText: "The sky turns the color of a bruise. The wind shifts, and suddenly the trees are bending sideways, their leaves flashing silver undersides in a desperate semaphore. Then the rain hits — not drops but sheets, a wall of water that blinds and deafens. Lightning splits a birch tree two hundred yards away with a crack so loud it registers in your chest, not your ears. You press yourself against the lee of a boulder and wait, trembling, for the world to stop trying to tear itself apart.",
    statEffects: [
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
      { stat: StatId.ADV, amount: 7, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    subEvents: [
      {
        eventId: 'lightning-near-miss',
        chance: 0.08,
        narrativeText: 'A bolt of lightning strikes a tree so close that you feel the heat on your flank and the static lifts the hair along your spine. The crack of splitting wood is indistinguishable from the thunder. You are alive only because you chose this boulder and not that tree.',
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
    narrativeText: "Another deer is already at the best browse patch — the one with the tender young growth and the sheltering overhang. It sees you approach and lowers its head, ears flattened back, one forehoof stamping the ground in unmistakable warning. This food source isn't large enough for both of you, and the other deer has no intention of sharing. The air between you crackles with a tension that is older than language.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'stand-ground-dispute',
        label: 'Stand your ground',
        description: 'Fight for access to the food',
        narrativeResult: 'You meet the challenge head-on. After a tense confrontation of stamping hooves and lowered heads, the other deer gives way. The food is yours — but the encounter leaves your nerves frayed.',
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
        description: 'Avoid conflict — find food elsewhere',
        narrativeResult: 'You turn away, choosing peace over food. There are other patches, other places. The wisdom of knowing when not to fight is its own kind of strength.',
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
    narrativeText: "A cluster of mushrooms erupts from the base of a rotting stump — pale caps fanning out in overlapping shelves, their undersides lined with delicate gills. The smell is earthy, rich, intoxicating. Some mushrooms are nourishing, dense with minerals your body craves. Others will shut down your liver in forty-eight hours. You have no way to tell them apart except instinct, and instinct is a coin flip in a game with mortal stakes.",
    statEffects: [],
    choices: [
      {
        id: 'eat-mushrooms',
        label: 'Eat the mushrooms',
        description: 'Could be nourishing — or fatal',
        narrativeResult: 'You bite into the pale flesh. The taste is nutty, rich, and satisfying. Only time will tell if that satisfaction was worth the gamble.',
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
        narrativeResult: 'You sniff once more and move on. Better hungry than dead. The forest will provide — it always does, eventually.',
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
        narrativeText: 'Within hours, your stomach clenches into a fist of pain. The mushrooms were toxic — not enough to kill you outright, but enough to leave you shaking and weak for days, your liver struggling to process the poison.',
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
