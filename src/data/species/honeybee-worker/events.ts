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
    narrativeText: 'Empty brood cells line the comb. Your antennae probe each one, detecting traces of old cocoon and debris. They must be clean before the queen will lay in them.',
    statEffects: [],
    choices: [
      {
        id: 'thorough-clean',
        label: 'Clean thoroughly',
        description: 'Spend extra time polishing each cell to perfection.',
        narrativeResult: 'You strip every speck of debris from each cell. The queen\'s attendants inspect your work. She lays an egg in the first cell you cleaned.',
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
        description: 'Move fast. There are thousands of cells to prepare.',
        narrativeResult: 'You move through the cells fast. The queen skips one. Not clean enough. You move on to the next row.',
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
    narrativeText: 'White, C-shaped larvae fill the brood cells around you. Your hypopharyngeal glands are producing royal jelly. Each larva needs to be visited over a thousand times.',
    statEffects: [],
    choices: [
      {
        id: 'feed-generously',
        label: 'Feed generously',
        description: 'Give each larva extra royal jelly.',
        narrativeResult: 'You deposit generous pools of jelly in each cell. The larvae swell visibly. Your glands ache from the output.',
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
        description: 'Conserve your energy. There are many mouths to feed.',
        narrativeResult: 'Standard rations in each cell. Sufficient. Hundreds more cells to visit today.',
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
    narrativeText: 'You are pressed into the queen\'s retinue. Her mandibular pheromone saturates the air around her, thick and heavy. Your ovaries shrink. You feed her, groom her, and pass her chemical signal outward through the hive.',
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
    narrativeText: 'Wax flakes secrete from glands on your abdomen. Other workers are already building, chewing the flakes and shaping hexagonal cells along the comb face.',
    statEffects: [],
    choices: [
      {
        id: 'join-builders',
        label: 'Join the building crew',
        description: 'Chew wax and shape cells alongside your sisters.',
        narrativeResult: 'You join the chain, passing wax flakes mouth-to-mouth, shaping cells. The hexagonal pattern self-organizes as each worker builds her section.',
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
        narrativeResult: 'You move deeper into the hive to tend brood instead.',
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
    footnote: 'Beeswax hexagons are the most efficient structure for storing honey: they use the minimum amount of wax to create maximum storage volume. Bees produce about 8 pounds of honey to make 1 pound of wax.',
  },

  {
    id: 'bee-hive-defense',
    type: 'active',
    category: 'predator',
    narrativeText: 'A wasp probes the hive entrance. Alarm pheromone hits you, sharp and immediate. Your sisters buzz their wings in warning, raising the temperature at the opening.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-the-wasp',
        label: 'Join the defense mob',
        description: 'Surround the wasp and heat-ball it to death.',
        narrativeResult: 'You and thirty sisters swarm it, wrapping your bodies tight. You vibrate your flight muscles. The heat inside the ball builds until your own body is near its limit. The wasp stops moving.',
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
        narrativeResult: 'You drive your sting into the wasp\'s abdomen. The barb pulls free cleanly from the exoskeleton. The wasp convulses and falls.',
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
    footnote: 'Japanese honeybees have evolved a remarkable defense against giant hornets: they form a "hot defensive bee ball" around the invader, raising the temperature to 47°C, above the hornet\'s lethal threshold but below the bees\'.',
  },

  {
    id: 'bee-bear-attack',
    type: 'active',
    category: 'predator',
    narrativeText: 'The hive shakes. Something massive tears at the outer structure. Comb falls. Larvae are exposed. Alarm pheromone saturates the air. Every bee mobilizes.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
    ],
    choices: [
      {
        id: 'sting-bear',
        label: 'Sting the bear',
        description: 'Fly at its face and drive your sting into its skin.',
        narrativeResult: 'You launch at the bear\'s face. Your sting drives into the skin around its nose. The barb catches in flesh. You pull away. Your venom sac tears free from your abdomen, trailing viscera. Venom pumps into the wound. You spiral to the ground. The bear swats at its face and retreats.',
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
          cause: 'Sting barb tore the abdomen open. The venom sac kept pumping after you fell.',
          statModifiers: [],
        },
      },
      {
        id: 'stay-inside',
        label: 'Stay inside and protect the brood',
        description: 'Shield the larvae with your body. Let the guard bees handle the bear.',
        narrativeResult: 'You spread your wings over exposed brood, shielding larvae from falling debris. The bear leaves, driven off by hundreds of stings. The hive is damaged but the brood survived.',
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
    narrativeText: 'You step onto the landing board. Sunlight heats your wings. The air outside is open in every direction. You circle the hive in widening arcs, fixing landmarks by their position against the sun.',
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
    narrativeText: 'Clover, goldenrod, wild bergamot. Each flower offers a trace of nectar. You must visit hundreds to fill your honey stomach.',
    statEffects: [],
    choices: [
      {
        id: 'forage-clover',
        label: 'Work the clover patch',
        description: 'Reliable nectar in large quantities, but low sugar concentration.',
        narrativeResult: 'You probe each tiny floret systematically. Two hundred flowers later, your honey stomach is full. The weight of nectar drags at your wings on the return flight.',
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
        narrativeResult: 'You sample a dozen species. The goldenrod nectar is the sweetest and thickest. You fill up and fly home.',
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
    narrativeText: 'You land on a sunflower head thick with pollen. Grains stick to the hairs on your body as you crawl across the stamens. You groom them into your corbicula, packing bright orange pellets onto your hind legs.',
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
    narrativeText: 'You have found rich nectar. Back on the comb, you must transmit the location. You begin the waggle run.',
    statEffects: [],
    choices: [
      {
        id: 'dance-precisely',
        label: 'Dance with precision',
        description: 'Encode the exact distance and direction in your waggle runs.',
        narrativeResult: 'You waggle-run across the comb face. The angle encodes direction relative to the sun. The duration encodes distance. Your sisters crowd around, antennae touching your body, reading the signal. Within minutes, dozens of foragers fly the heading you danced.',
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
        description: 'The source is close. Just tell them it\'s nearby.',
        narrativeResult: 'You circle on the comb. Your sisters fan out in all directions from the hive. Some find the source. Others do not.',
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
    narrativeText: 'The flowers ahead smell sweet, but underneath the floral scent, something chemical. The petals are coated. The pollen is coated.',
    statEffects: [],
    choices: [
      {
        id: 'forage-anyway',
        label: 'Forage anyway',
        description: 'The nectar is there. The colony needs it.',
        narrativeResult: 'You land on the treated flowers. The chemical enters through your proboscis and your tarsi. Your navigation goes foggy. The landmarks look wrong. You make it home, barely, carrying contaminated nectar.',
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
          cause: 'Neonicotinoid poisoning. Nervous system shut down mid-flight.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.03 }],
        },
      },
      {
        id: 'avoid-field',
        label: 'Find untreated flowers',
        description: 'The chemical smell is a warning. Trust it.',
        narrativeResult: 'You turn away and search for cleaner forage. It takes longer, but you find untreated flowers and return with clean nectar.',
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
    narrativeText: 'A bird with bright plumage swoops through the air near the hive. You see it snatch a sister mid-flight, beat her against a branch, and swallow her. It circles back.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'bee-caught-by-bird',
        chance: 0.08,
        narrativeText: 'It catches you in its beak. The impact against the branch is crushing.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Caught by a bee-eater. Beaten against a branch and swallowed.' },
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
    narrativeText: 'The known foraging areas are depleted. You fly farther than the regular foragers, past the last landmarks you recognize.',
    statEffects: [],
    choices: [
      {
        id: 'fly-far',
        label: 'Fly beyond the 3-mile range',
        description: 'Push into unknown territory. The colony is depending on you.',
        narrativeResult: 'Five miles out, you find an untouched meadow in full bloom. Rich nectar. You fix the route by sun angle and landmarks, and race home to dance.',
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
          cause: 'Lost on a scouting flight. Wings gave out before reaching the hive.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
      {
        id: 'check-nearby',
        label: 'Check closer areas',
        description: 'There may be flowers the foragers missed nearby.',
        narrativeResult: 'You circle at moderate distance. A small patch of late-blooming asters in a field margin. Not much, but something.',
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
    narrativeText: 'The colony is splitting. The old queen has left with half the workers, forming a cluster of 20,000 bees on a tree branch. Scouts are searching for a new cavity. You have found a hollow in an old oak.',
    statEffects: [],
    choices: [
      {
        id: 'dance-for-oak',
        label: 'Dance for the oak tree cavity',
        description: 'Promote your discovered site with vigorous waggle dances.',
        narrativeResult: 'You waggle-dance the location and quality of the oak cavity. Other scouts dance for different sites. Over hours, through competitive dancing, your site wins. The swarm lifts off and follows you.',
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
        narrativeResult: 'You watch the other scouts dance. The swarm reaches consensus and lifts off as one. You follow.',
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
    narrativeText: 'No flowers bloom. The colony has contracted into a tight cluster around the queen, vibrating flight muscles to generate heat. The bees on the outside rotate inward to warm. The bees on the inside rotate out. You are part of this rotation, maintaining core temperature while the air outside drops below freezing.',
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
    narrativeText: 'Foreign bees are slipping past the guards and stealing honey from the comb. Their chemical signature is wrong. The colony\'s stores are being drained.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'defend-entrance',
        label: 'Reinforce the entrance guard',
        description: 'Join the defense line and inspect every incoming bee.',
        narrativeResult: 'You take position at the entrance, antennae tasting every bee that approaches. You can distinguish your colony\'s chemical signature from the robbers\'. Three are turned away. One fights back and you grapple with it on the landing board.',
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
        narrativeResult: 'You expose the gland at the entrance and fan your wings. Alarm pheromone spreads through the hive. The defense force doubles. The robbers retreat.',
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
    narrativeText: 'Your antennae detect something on a sister. A flat, reddish-brown disc clinging to her thorax. A mite, feeding on her fat body.',
    statEffects: [],
    choices: [
      {
        id: 'groom-it-off',
        label: 'Groom the mite off',
        description: 'Use your mandibles to pry the mite loose.',
        narrativeResult: 'You grip the mite with your mandibles and pull. It clings. After several attempts, you pry it free and it falls to the hive floor.',
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
        narrativeResult: 'You move on. The mite continues feeding. It will reproduce in the next brood cycle.',
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
    footnote: 'Some honeybee populations have evolved "Varroa-sensitive hygiene" (VSH), the ability to detect and remove mite-infested pupae from brood cells. This grooming behavior is one of the few natural defenses bees have against Varroa.',
  },

  {
    id: 'bee-aging-forager',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your wing edges are fraying. Your body hairs are rubbed away from thousands of flower visits. You are slower than the young foragers. But you know every flower patch and wind pattern within range.',
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
    narrativeText: 'Your wings barely hold you aloft. You had to rest on a leaf three times before reaching the clover. You lift off one last time, heading for the flowers.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Worn wings failed on a return flight. Died foraging.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['honeybee-worker'] },
      { type: 'age_range', min: 6 },
      { type: 'stat_below', stat: StatId.HEA, threshold: 25 },
    ],
    weight: 30,
    tags: ['health'],
  },

  // ── Parasite Events ──
  {
    id: 'bee-varroa-mite',
    type: 'passive',
    category: 'health',
    narrativeText: 'A reddish-brown disc clings to the soft membrane between your thorax segments. It feeds on your fat body tissue. You cannot reach it.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.IMM, amount: -5, label: '-IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'varroa-mite' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'varroa-mite' },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
  {
    id: 'bee-nosema-infection',
    type: 'passive',
    category: 'health',
    narrativeText: 'The honey stores taste slightly sour. Spores have contaminated the comb. The parasite colonizes your gut lining, destroying the cells that absorb nutrients. You eat but gain nothing.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'nosema-ceranae' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'nosema-ceranae' },
      { type: 'season', seasons: ['winter', 'spring'] },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
];
