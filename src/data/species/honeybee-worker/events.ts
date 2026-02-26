import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const HONEYBEE_WORKER_EVENTS: GameEvent[] = [
  // ════════════════════════════════════════════════
  //  NURSE BEE PHASE (age 0-1)
  // ════════════════════════════════════════════════

  {
    id: 'bee-cell-cleaning',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Your first task as a newly emerged worker: cleaning brood cells. Each cell must be spotless before the queen will lay in it. You inspect a row of empty cells, probing with your antennae for any trace of contamination.',
    statEffects: [],
    choices: [
      {
        id: 'thorough-clean',
        label: 'Clean thoroughly',
        description: 'Spend extra time polishing each cell to perfection.',
        narrativeResult: 'You work methodically through each cell, removing every speck of debris, every trace of old cocoon. The queen\'s attendants inspect your work and find it flawless. She lays an egg in the first cell you cleaned.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.HOM, amount: -3, duration: 2, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'quick-clean',
        label: 'Clean quickly',
        description: 'Move fast — there are thousands of cells to prepare.',
        narrativeResult: 'You rush through the cells, doing a passable job. The queen skips one of your cells — not clean enough. But you move on to the next row. Speed over perfection.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', max: 1 },
    ],
    weight: 20,
    tags: ['foraging'],
  },

  {
    id: 'bee-brood-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The brood cells around you are full of hungry larvae — white, C-shaped grubs demanding food. Your hypopharyngeal glands are producing royal jelly, a nutrient-rich secretion. Each larva needs to be visited over a thousand times during its development.',
    statEffects: [],
    choices: [
      {
        id: 'feed-generously',
        label: 'Feed generously',
        description: 'Give each larva extra royal jelly.',
        narrativeResult: 'You deposit a generous pool of royal jelly in each cell. The larvae grow visibly plumper. Your glands ache from the production, but these will be strong workers — or perhaps one will become a queen.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.0000008 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'feed-standard',
        label: 'Feed standard portions',
        description: 'Conserve your energy — there are many mouths to feed.',
        narrativeResult: 'You give each larva the standard ration. Not generous, but sufficient. You have hundreds more cells to visit today.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', max: 1 },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging'],
  },

  {
    id: 'bee-queen-attendance',
    type: 'passive',
    category: 'social',
    narrativeText: 'You find yourself in the queen\'s retinue — a tight cluster of workers constantly attending Her Majesty. You feed her, groom her, and spread her pheromones through the hive. In her presence, your own ovaries shrink. Her chemical signal says: do not reproduce. You obey. Every worker obeys.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, duration: 3, label: '-HOM' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', max: 2 },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['social'],
    footnote: 'The queen\'s mandibular pheromone (QMP) suppresses ovary development in workers and coordinates colony behavior. When the queen dies or weakens, workers can detect the pheromone decline within hours and begin laying unfertilized (male) eggs.',
  },

  // ════════════════════════════════════════════════
  //  HOUSE BEE / GUARD PHASE (age 1-3)
  // ════════════════════════════════════════════════

  {
    id: 'bee-comb-building',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The colony needs more comb. Your wax glands are active, secreting tiny flakes of beeswax from your abdomen. Other workers are already building — chewing the wax flakes, mixing them with enzymes, and shaping perfect hexagonal cells.',
    statEffects: [],
    choices: [
      {
        id: 'join-builders',
        label: 'Join the building crew',
        description: 'Chew wax and shape cells alongside your sisters.',
        narrativeResult: 'You join the chain of builders, passing wax flakes mouth-to-mouth and shaping them into cells. The hexagonal geometry emerges without a blueprint — each bee builds her section, and the pattern self-organizes into mathematical perfection.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: -3, duration: 2, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'comb-builder' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'focus-other-tasks',
        label: 'Focus on other tasks',
        description: 'The builders have enough help. Go where you\'re needed.',
        narrativeResult: 'You move deeper into the hive to tend brood cells instead. The builders will manage without you.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 1, max: 3 },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['environmental'],
    footnote: 'Beeswax hexagons are the most efficient structure for storing honey — they use the minimum amount of wax to create maximum storage volume. Bees produce about 8 pounds of honey to make 1 pound of wax.',
  },

  {
    id: 'bee-hive-defense',
    type: 'active',
    category: 'predator',
    narrativeText: 'A wasp is probing the hive entrance, trying to slip past the guards to steal honey. The alarm pheromone hits you — a sharp chemical signal that says: threat. Your sisters are buzzing their wings in warning, raising the temperature at the entrance.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-the-wasp',
        label: 'Join the defense mob',
        description: 'Surround the wasp and heat-ball it to death.',
        narrativeResult: 'You and thirty sisters swarm the wasp, wrapping your bodies around it in a tight ball. You vibrate your flight muscles, generating heat. The temperature inside the ball climbs past 45°C — lethal for the wasp but just barely survivable for you. The wasp dies. The colony is safe.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'hive-defender' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'sting-the-wasp',
        label: 'Sting it',
        description: 'Drive your barbed sting into the wasp. Unlike stinging a mammal, stinging another insect won\'t kill you.',
        narrativeResult: 'You drive your sting into the wasp\'s abdomen. Unlike stinging a mammal, your barbed sting pulls free cleanly from the insect\'s exoskeleton. The wasp convulses and falls. You survived the sting — this time.',
        statEffects: [
          { stat: StatId.ADV, amount: -3, duration: 2, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'hive-defender' },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 2, max: 4 },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['danger'],
    footnote: 'Japanese honeybees have evolved a remarkable defense against giant hornets: they form a "hot defensive bee ball" around the invader, raising the temperature to 47°C — above the hornet\'s lethal threshold but below the bees\'.',
  },

  {
    id: 'bee-bear-attack',
    type: 'active',
    category: 'predator',
    narrativeText: 'The hive trembles. Something massive is tearing at the outer structure — a black bear, drawn by the scent of honey. Chunks of comb are falling. Larvae are exposed. The alarm pheromone is overpowering. Every bee in the colony is mobilizing.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
    ],
    choices: [
      {
        id: 'sting-bear',
        label: 'Sting the bear',
        description: 'Fly at its face and drive your sting into its skin. You will die, but the colony needs every stinger.',
        narrativeResult: 'You launch yourself at the bear\'s face, aiming for the sensitive skin around its nose. Your sting drives deep. The barb catches in the thick skin and as you pull away, your venom sac tears free from your abdomen. Venom continues pumping into the wound even as you spiral to the ground. You gave everything. The bear swats at its face and retreats.',
        statEffects: [],
        consequences: [
          { type: 'set_flag', flag: 'sting-defense-triggered' },
          { type: 'set_flag', flag: 'sacrifice-made' },
          { type: 'set_flag', flag: 'worker-final-act' },
          { type: 'add_injury', injuryId: 'sting-apparatus-injury', severity: 2 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.85,
          cause: 'You stung the bear and died for the colony. Your barbed sting tore your abdomen open. This is how it works.',
          statModifiers: [],
        },
      },
      {
        id: 'stay-inside',
        label: 'Stay inside and protect the brood',
        description: 'Shield the larvae with your body. Let the guard bees handle the bear.',
        narrativeResult: 'You position yourself over a section of exposed brood, spreading your wings to shield the larvae from falling debris. The bear eventually leaves, driven off by hundreds of stings from your sisters. The hive is damaged but the brood survived.',
        statEffects: [
          { stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 2 },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['danger'],
  },

  // ════════════════════════════════════════════════
  //  FORAGER PHASE (age 3-5)
  // ════════════════════════════════════════════════

  {
    id: 'bee-first-flight',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'You step onto the landing board for the first time and feel the sun on your wings. The world outside the hive is vast beyond comprehension — an explosion of color, scent, and space. You make your first orientation flight, circling the hive in widening arcs, memorizing landmarks. The hive entrance grows smaller as you climb. You are a forager now.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'first-flight-complete' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 3, max: 4 },
      { type: 'no_flag', flag: 'first-flight-complete' },
    ],
    weight: 30,
    tags: ['environmental'],
  },

  {
    id: 'bee-nectar-foraging',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A field of wildflowers stretches before you — clover, goldenrod, and wild bergamot. Each flower offers a tiny reward of nectar. You must visit hundreds to fill your honey stomach.',
    statEffects: [],
    choices: [
      {
        id: 'forage-clover',
        label: 'Work the clover patch',
        description: 'Reliable nectar in large quantities, but low sugar concentration.',
        narrativeResult: 'You work the clover systematically, probing each tiny floret with your proboscis. Two hundred flowers later, your honey stomach is full. You make the return flight, the weight of nectar dragging at your wings.',
        statEffects: [
          { stat: StatId.HEA, amount: 2, label: '+HEA' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000015 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'forage-wildflowers',
        label: 'Explore the wildflower mix',
        description: 'More variety, potentially higher-quality nectar, but less predictable.',
        narrativeResult: 'You visit a dozen different species, sampling each. The goldenrod has the richest nectar — sweet and thick. You fill up and fly home with a diverse load that will make complex honey.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000020 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'has_flag', flag: 'first-flight-complete' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 20,
    cooldown: 2,
    tags: ['foraging', 'food'],
  },

  {
    id: 'bee-pollen-collection',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'You land on a sunflower head bristling with pollen. Your hairy body picks up grains as you crawl across the stamens. You groom the pollen into your corbicula — the pollen baskets on your hind legs — packing it into bright orange pellets. Each load is a mixture of protein, fat, and vitamins that the colony\'s larvae need to grow.',
    statEffects: [
      { stat: StatId.HEA, amount: 3, label: '+HEA' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
            consequences: [
              { type: 'modify_weight', amount: 0.0000010 },
              { type: 'set_flag', flag: 'pollen-collected' },
            ],    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'has_flag', flag: 'first-flight-complete' },
      { type: 'season', seasons: ['spring', 'summer', 'autumn'] },
    ],
    weight: 16,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'bee-waggle-dance',
    type: 'active',
    category: 'social',
    narrativeText: 'You have found an exceptional food source — a field of blooming linden trees, dripping with nectar. Back in the hive, you must communicate the location to your sisters. You begin the waggle dance.',
    statEffects: [],
    choices: [
      {
        id: 'dance-precisely',
        label: 'Dance with precision',
        description: 'Encode the exact distance and direction in your waggle runs.',
        narrativeResult: 'You waggle-run across the comb face, the angle of your dance encoding the direction relative to the sun. The duration of each waggle run encodes the distance. Your sisters crowd around, their antennae touching your body, reading your message. Within minutes, dozens of foragers are flying the exact heading you danced.',
        statEffects: [
          { stat: StatId.WIS, amount: 6, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'waggle-dance-performed' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'round-dance',
        label: 'Simple round dance',
        description: 'The source is close — just tell them it\'s nearby.',
        narrativeResult: 'You perform a round dance — circling on the comb to indicate a nearby food source. Your sisters fan out in all directions from the hive, searching. Some find the linden trees. Others find nothing.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'has_flag', flag: 'first-flight-complete' },
    ],
    weight: 14,
    cooldown: 5,
    tags: ['social'],
    footnote: 'Karl von Frisch won the Nobel Prize for decoding the honeybee waggle dance. The angle of the dance relative to vertical encodes the direction relative to the sun; the duration encodes distance. Bees can communicate food sources over 10 km away.',
  },

  {
    id: 'bee-pesticide-exposure',
    type: 'active',
    category: 'health',
    narrativeText: 'The field ahead smells sweet — but underneath the floral scent, there is something chemical. The flowers have been recently sprayed. The neonicotinoid residue coats every petal, every grain of pollen.',
    statEffects: [],
    choices: [
      {
        id: 'forage-anyway',
        label: 'Forage anyway',
        description: 'The nectar is there. The colony needs it.',
        narrativeResult: 'You land on the treated flowers and begin collecting nectar. The pesticide enters your system through your proboscis and through your tarsi. Almost immediately, your navigation feels foggy. The landmarks look unfamiliar. You make it home — barely — carrying contaminated nectar.',
        statEffects: [
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
          { stat: StatId.WIS, amount: -5, label: '-WIS' },
          { stat: StatId.NOV, amount: 8, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000010 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'Neonicotinoid poisoning. Your nervous system shut down mid-flight.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.03 }],
        },
      },
      {
        id: 'avoid-field',
        label: 'Find untreated flowers',
        description: 'The chemical smell is a warning. Trust it.',
        narrativeResult: 'You turn away from the treated field and search for cleaner forage. It takes longer to find, but a patch of untreated wildflowers rewards your caution. You return to the hive with clean nectar.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.0000005 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'has_flag', flag: 'first-flight-complete' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['health', 'danger'],
    footnote: 'Neonicotinoid pesticides are a major driver of pollinator decline. Sub-lethal doses impair bee navigation, memory, and foraging efficiency. Bees exposed to neonicotinoids are more likely to get lost and never return to the hive.',
  },

  {
    id: 'bee-bird-predation',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A bee-eater — that cursed bird with the emerald wings — swoops through the air near the hive. You see it snatch a sister mid-flight, beat her against a branch to remove the sting, and swallow her whole. The bird circles back for another pass.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'bee-caught-by-bird',
        chance: 0.08,
        narrativeText: 'The bee-eater catches you in its beak. It beats you against a branch, trying to dislodge your sting. The impact is crushing.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Caught by a bee-eater. Beaten against a branch and swallowed whole.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'has_flag', flag: 'first-flight-complete' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['danger'],
  },

  // ════════════════════════════════════════════════
  //  SCOUT PHASE (age 5+)
  // ════════════════════════════════════════════════

  {
    id: 'bee-scouting-mission',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The colony\'s known foraging areas are depleted. You are old enough now to be a scout — flying farther than any forager, searching for new food sources that no one else has found.',
    statEffects: [],
    choices: [
      {
        id: 'fly-far',
        label: 'Fly beyond the 3-mile range',
        description: 'Push into unknown territory. The colony is depending on you.',
        narrativeResult: 'You fly past the farthest landmarks you know, into unfamiliar terrain. Five miles from the hive, you find an untouched meadow of alfalfa in full bloom. The nectar is rich and abundant. You memorize the route by sun angle and landmarks, and race home to dance.',
        statEffects: [
          { stat: StatId.WIS, amount: 6, label: '+WIS' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'scout-discovery' },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Lost on a scouting flight. Your wings gave out before you could find the hive.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
      {
        id: 'check-nearby',
        label: 'Check closer areas',
        description: 'There may be flowers the foragers missed nearby.',
        narrativeResult: 'You circle the hive at a moderate distance, checking gardens, ditches, and field margins. You find a small patch of late-blooming asters. Not spectacular, but it\'ll do.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 5 },
      { type: 'has_flag', flag: 'first-flight-complete' },
    ],
    weight: 16,
    cooldown: 4,
    tags: ['environmental'],
  },

  {
    id: 'bee-swarm-decision',
    type: 'active',
    category: 'social',
    narrativeText: 'The colony is splitting. The old queen has left with half the workers, forming a swirling cloud of 20,000 bees hanging from a tree branch. Scout bees are searching for a new home — a hollow tree, a gap in a wall, anywhere with enough space. You have found a promising cavity in an old oak tree.',
    statEffects: [],
    choices: [
      {
        id: 'dance-for-oak',
        label: 'Dance for the oak tree cavity',
        description: 'Promote your discovered site with vigorous waggle dances.',
        narrativeResult: 'You return to the swarm cluster and perform an energetic waggle dance, encoding the location and quality of the oak cavity. Other scouts are dancing for different sites. Over hours, through a democratic process of competitive dancing, the swarm will decide. Your site wins — the cavity is perfect. The swarm lifts off and follows you to their new home.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, label: '+WIS' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'swarm-leader' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'follow-others',
        label: 'Follow the majority',
        description: 'Trust the collective wisdom of the swarm.',
        narrativeResult: 'You watch the other scouts dance and evaluate their sites. Eventually the swarm reaches consensus and lifts off as one. You follow. The new home is adequate, chosen by the wisdom of crowds.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 4 },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 8,
    cooldown: 16,
    tags: ['social'],
    footnote: 'Honeybee swarms choose new nest sites through a democratic process. Scout bees evaluate candidate sites and return to the swarm to "advertise" them with waggle dances. Over hours, scouts who visited competing sites are recruited to the best option through dance quality. Thomas Seeley\'s research showed this process consistently selects the optimal site.',
  },

  // ════════════════════════════════════════════════
  //  SEASONAL / COLONY EVENTS
  // ════════════════════════════════════════════════

  {
    id: 'bee-winter-cluster',
    type: 'passive',
    category: 'seasonal',
    narrativeText: 'Winter has locked the hive in cold. No flowers bloom. No foraging is possible. The colony has contracted into a tight cluster around the queen, vibrating flight muscles to generate heat. The bees on the outside rotate inward to warm themselves, and the bees on the inside rotate outward to take their turn in the cold. You are part of this living furnace — 10,000 bees maintaining a core temperature of 35°C while the air outside drops below freezing.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.0000012 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 22,
    cooldown: 3,
    tags: ['seasonal'],
  },

  {
    id: 'bee-robbing-raid',
    type: 'active',
    category: 'predator',
    narrativeText: 'Bees from a neighboring colony are raiding your hive — slipping past the guards and stealing honey from the comb. The robbers are desperate; their colony is starving. Your colony\'s stores are being plundered.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'defend-entrance',
        label: 'Reinforce the entrance guard',
        description: 'Join the defense line and inspect every incoming bee.',
        narrativeResult: 'You take position at the entrance, antennae tasting every bee that approaches. You can distinguish your colony\'s chemical signature from the robbers\'. Three robbers are turned away; one fights back and you grapple with it on the landing board.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.ADV, amount: -3, duration: 2, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'hive-defender' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'fan-alarm',
        label: 'Fan alarm pheromone',
        description: 'Expose your Nasonov gland and fan the alarm scent to mobilize the colony.',
        narrativeResult: 'You expose your Nasonov gland at the entrance and fan your wings, spreading alarm pheromone throughout the hive. Within minutes, the defense force doubles. The robbers, outnumbered, retreat.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 2 },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['danger'],
  },

  {
    id: 'bee-varroa-grooming',
    type: 'active',
    category: 'health',
    narrativeText: 'You detect a Varroa mite on a sister bee — a flat, reddish-brown disc clinging to her thorax. The mite is feeding on her fat body, weakening her and potentially spreading deformed wing virus.',
    statEffects: [],
    choices: [
      {
        id: 'groom-it-off',
        label: 'Groom the mite off',
        description: 'Use your mandibles to pry the mite loose.',
        narrativeResult: 'You grip the mite with your mandibles and pull. It clings stubbornly, its flat body designed to resist exactly this. After several attempts, you pry it free and it falls to the hive floor. Your sister buzzes with relief.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.IMM, amount: -3, duration: 2, label: '-IMM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'ignore-mite',
        label: 'Ignore it',
        description: 'You have other tasks. One mite won\'t kill her.',
        narrativeResult: 'You move on to other duties. The mite continues feeding. It will reproduce in the next brood cycle, and the infestation will grow.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['health'],
    footnote: 'Some honeybee populations have evolved "Varroa-sensitive hygiene" (VSH) — the ability to detect and remove mite-infested pupae from brood cells. This grooming behavior is one of the few natural defenses bees have against Varroa.',
  },

  {
    id: 'bee-aging-forager',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your wings are fraying at the edges — thousands of miles of flight have worn the chitin thin. Your hair is rubbed off from countless flower visits. You are slower, lighter, and less efficient than the young foragers. But you know every flower patch within five miles and every wind pattern across the landscape. What you lack in strength, you make up in wisdom.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 5 },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['health'],
  },

  {
    id: 'bee-death-foraging',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your wings can barely hold you aloft. The last flight out was a struggle — you had to rest on a leaf three times before reaching the clover field. Your sisters in the hive are young and strong. The colony does not need you anymore. You lift off one final time, heading toward the flowers. You will die out here, in the field, far from the hive. Workers do not retire. They simply fly until they can\'t.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Died foraging. Your worn wings finally failed on a return flight.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 6 },
      { type: 'stat_below', stat: StatId.HEA, threshold: 25 },
    ],
    weight: 30,
    tags: ['health'],
  },
];
