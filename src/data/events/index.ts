import type { GameEvent } from '../../types/events';
import { StatId } from '../../types/stats';

export const allEvents: GameEvent[] = [
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
    conditions: [],
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
    conditions: [],
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
    conditions: [],
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
        statEffects: [],
        consequences: [
          { type: 'remove_flag', flag: 'will-migrate' },
        ],
        revocable: true,
        style: 'danger',
      },
    ],
    conditions: [
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
    conditions: [],
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
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'fawns-just-independent' },
    ],
    weight: 30,
    cooldown: 4,
    tags: ['mating', 'social'],
  },
];
