import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const MONARCH_BUTTERFLY_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-milkweed-patch',
    type: 'active',
    category: 'foraging',
    narrativeText: "A thick stand of milkweed. The chemical signature registers through your tarsi the moment you land. The cardiac glycosides seep into your tissues with each feeding.",
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.00008 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'milkweed'],
    footnote: 'Monarchs are obligate milkweed specialists as larvae. The cardiac glycosides (cardenolides) they sequester from milkweed make them unpalatable to most bird predators, a defense that persists through metamorphosis into adulthood.',
  },

  {
    id: 'monarch-nectar-meadow',
    type: 'active',
    category: 'foraging',
    narrativeText: "Coneflowers, black-eyed Susans, blazing star. You uncoil your proboscis and probe flower after flower. The sun heats your wings as you feed.",
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.00005 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['foraging', 'food', 'nectar'],
  },

  {
    id: 'monarch-pesticide-milkweed',
    type: 'active',
    category: 'foraging',
    narrativeText: "Milkweed grows along the edge of a crop field. The leaves look healthy, but a faint chemical trace clings to the plant surface.",
    statEffects: [],
    choices: [
      {
        id: 'eat-contaminated',
        label: 'Feed on the milkweed',
        description: 'You are too hungry to be cautious.',
        narrativeResult: 'You feed. Within hours, your muscles begin to spasm. Your flight goes erratic. Your orientation fails.',
        statEffects: [
          { stat: StatId.HOM, amount: 15, label: '+HOM' },
          { stat: StatId.HEA, amount: -12, label: '-HEA' },
          { stat: StatId.WIS, amount: -5, label: '-WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.00004 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.15,
          cause: 'Neonicotinoid poisoning from contaminated milkweed.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-contaminated',
        label: 'Move on hungry',
        description: 'Trust the wrongness you sense.',
        narrativeResult: 'You leave the contaminated plants. Your hunger deepens, but your muscles still respond.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'food', 'pesticide', 'danger'],
    footnote: 'Neonicotinoid pesticides are a leading cause of monarch decline. Even sublethal doses impair navigation, reduce flight ability, and lower reproductive success. Milkweed growing near agricultural fields is frequently contaminated through spray drift.',
  },

  {
    id: 'monarch-degraded-habitat',
    type: 'passive',
    category: 'foraging',
    narrativeText: "The same plant in every direction, row after row. No milkweed scent. You fly on, burning reserves, searching for a chemical signature that does not come.",
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.00003 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['foraging', 'habitat-loss'],
    footnote: 'Herbicide-resistant crops and the widespread use of glyphosate have eliminated an estimated 1.3 billion milkweed stems from the US Midwest since 1999, roughly a 58% decline in the monarch\'s primary larval food source.',
  },

  {
    id: 'monarch-goldenrod-fuel',
    type: 'active',
    category: 'foraging',
    narrativeText: "Goldenrod fields, dense and yellow. You feed urgently, storing lipids in your abdomen. Every milligram of fat is distance you can fly later.",
    statEffects: [
      { stat: StatId.HOM, amount: -10, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.00010 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
    ],
    weight: 16,
    cooldown: 2,
    tags: ['foraging', 'food', 'migration-fuel'],
    footnote: 'Goldenrod is critical migration fuel for monarchs. They must accumulate enough lipid reserves to fly up to 3,000 miles to Mexico. A well-fed monarch can store enough fat to sustain flight for over 1,000 miles without feeding.',
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-bird-attack',
    type: 'active',
    category: 'predator',
    narrativeText: "A bird swoops toward you. It has learned to gut monarchs, eating the muscle while avoiding the most toxic tissue. Your coloration means nothing to this one.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
    ],
    choices: [
      {
        id: 'rely-on-toxicity',
        label: 'Hold still and rely on your toxicity',
        description: 'Most birds spit out monarchs after the first bite.',
        narrativeResult: 'Its beak closes on your abdomen, then pauses. It tastes the cardenolides and spits you out. You tumble through the air, leaking hemolymph, but airborne.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'bird-attack-damage', severity: 0, bodyPart: 'abdomen' },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.12,
          cause: 'Eaten by a bird that tolerated cardenolide toxins.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'erratic-flight',
        label: 'Attempt erratic evasive flight',
        description: 'Try to outmaneuver the bird.',
        narrativeResult: 'You throw yourself into dives and spirals. The bird follows for a few wingbeats, then breaks off. You escape but have burned reserves.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.00002 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['predator', 'bird'],
    footnote: 'Black-backed orioles and black-headed grosbeaks at the Mexican overwintering sites have learned to eat monarchs by discarding the most toxic parts. They can kill up to 60% of a colony in a season.',
  },

  {
    id: 'monarch-spider-web',
    type: 'active',
    category: 'predator',
    narrativeText: "Silk strands glint across your flight path. An orb-weaver's web, nearly invisible. You see it almost too late.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'power-through',
        label: 'Power through the web',
        description: 'Use your momentum to break the silk.',
        narrativeResult: 'You hit the web at speed. The silk stretches, clings to your wings, but your momentum tears through the outer strands. You pull free trailing sticky threads. The spider rushes to the breach, too late.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.00001 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'veer-away',
        label: 'Veer sharply to avoid it',
        description: 'Change course at the last moment.',
        narrativeResult: 'You bank hard. Your wing tips brush the outermost strand. The web quivers but holds. You pass.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['predator', 'spider'],
  },

  {
    id: 'monarch-praying-mantis',
    type: 'passive',
    category: 'predator',
    narrativeText: "You land on a flower to feed. Something seizes you. Raptorial forelegs clamp your thorax. A mantis, perfectly camouflaged among the petals. Your toxins do not affect it.",
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 5,
    cooldown: 6,
    tags: ['predator', 'mantis'],
    footnote: 'Praying mantises are ambush predators that are immune to monarch cardenolides. They are a significant predator of adult monarchs, especially in gardens and meadows.',
    subEvents: [
      {
        eventId: 'monarch-mantis-kill',
        chance: 0.15,
        narrativeText: 'Its serrated forelegs hold you immobile. It begins feeding on your thorax. Your wings beat but you cannot break the grip.',
        footnote: 'Mantises consume monarchs headfirst, a process that can take over an hour.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Seized and consumed by a praying mantis.' },
        ],
      },
    ],
  },

  {
    id: 'monarch-wasp-encounter',
    type: 'passive',
    category: 'predator',
    narrativeText: "A paper wasp walks down the milkweed stem toward you. Its antennae twitch. Its movement is steady and directed.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-caterpillar' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 9,
    cooldown: 3,
    tags: ['predator', 'wasp', 'caterpillar'],
    subEvents: [
      {
        eventId: 'monarch-wasp-kill',
        chance: 0.18,
        narrativeText: 'The wasp seizes you in its mandibles. You thrash, releasing milkweed sap, but the wasp chews through your body and carries the pieces away.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by a paper wasp as a caterpillar.' },
        ],
      },
    ],
    footnote: 'Paper wasps (Polistes spp.) are among the most significant predators of monarch caterpillars. A single wasp colony can consume dozens of caterpillars in a season.',
  },

  {
    id: 'monarch-mouse-attack',
    type: 'passive',
    category: 'predator',
    narrativeText: 'At the overwintering site, a black-eared mouse climbs the fir trunk and works through the cluster of dormant butterflies, biting off wings and abdomens.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'reached-overwintering-site' },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 3,
    tags: ['predator', 'mouse', 'overwintering'],
    subEvents: [
      {
        eventId: 'monarch-mouse-kill',
        chance: 0.12,
        narrativeText: 'The mouse found you in the cluster. Its teeth closed on your thorax before you could open your wings.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Eaten by a black-eared mouse at the overwintering colony.' },
        ],
      },
    ],
    footnote: 'Black-eared mice (Peromyscus melanotis) are significant predators at Mexican overwintering sites, consuming thousands of torpid monarchs per night.',
  },

  {
    id: 'monarch-robber-fly',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A large gray fly intercepts you in flight. It strikes from below, its spiny legs locking around your body. A proboscis stabs through your exoskeleton.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HEA, amount: -6, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 7,
    cooldown: 4,
    tags: ['predator', 'fly'],
    subEvents: [
      {
        eventId: 'monarch-robber-fly-kill',
        chance: 0.15,
        narrativeText: 'The robber fly injected digestive enzymes and drained your body fluids in flight. Your empty exoskeleton tumbled to the ground.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by a robber fly. Seized mid-flight and drained.' },
        ],
      },
    ],
    footnote: 'Robber flies (Asilidae) are aggressive aerial predators capable of taking insects their own size or larger. They are immune to monarch toxins.',
  },

  {
    id: 'monarch-ant-attack-caterpillar',
    type: 'passive',
    category: 'predator',
    narrativeText: 'Fire ants swarm up the milkweed stem. Dozens reach your body simultaneously. Their mandibles cut into your soft skin and their stingers inject venom.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-caterpillar' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['predator', 'ant', 'caterpillar'],
    subEvents: [
      {
        eventId: 'monarch-ant-kill',
        chance: 0.18,
        narrativeText: 'The ants overwhelmed you. They dismembered your body and carried the pieces back to the colony.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by fire ants as a caterpillar.' },
        ],
      },
    ],
    footnote: 'Invasive fire ants (Solenopsis invicta) are a major predator of monarch caterpillars in the southern US, capable of stripping a milkweed plant of all larvae in minutes.',
  },

  {
    id: 'monarch-dragonfly-pursuit',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A green darner dragonfly tracks you across the meadow. It matches every turn, closing the gap with each wingbeat. Its compound eyes lock onto you.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HEA, amount: -4, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 6,
    cooldown: 4,
    tags: ['predator', 'dragonfly'],
    subEvents: [
      {
        eventId: 'monarch-dragonfly-kill',
        chance: 0.10,
        narrativeText: 'The dragonfly caught you from behind. Its basket-legs trapped your wings and its mandibles crushed your head.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Caught and killed by a green darner dragonfly.' },
        ],
      },
    ],
    footnote: 'Large dragonflies like green darners are effective aerial predators of butterflies. They are unaffected by monarch cardenolides.',
  },

  {
    id: 'monarch-tachinid-fly',
    type: 'passive',
    category: 'predator',
    narrativeText: "A large gray fly lands on your back. It moves fast and deposits a tiny white egg on your skin before buzzing away. You cannot remove it.",
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.IMM, amount: 3, label: '+IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'tachinid-parasitoid', startStage: 0 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-caterpillar' },
      { type: 'no_parasite', parasiteId: 'tachinid-parasitoid' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'parasitoid', 'caterpillar'],
    footnote: 'Lespesia archippivora is a specialist parasitoid of monarch caterpillars. Parasitoid rates can exceed 30% in some populations, making it one of the leading causes of monarch larval mortality.',
  },

  // ══════════════════════════════════════════════
  //  METAMORPHOSIS EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-chrysalis-attachment',
    type: 'active',
    category: 'health',
    narrativeText: "You have grown as large as you will. You climb away from the milkweed, searching for a place to attach.",
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
    ],
    choices: [
      {
        id: 'sheltered-spot',
        label: 'Choose a sheltered location under a leaf',
        description: 'Hidden from predators but at risk of mold in wet weather.',
        narrativeResult: 'You attach your silk pad to the underside of a broad leaf, hang in a J-shape, and shed your skin one final time. The chrysalis forms, jade green with gold dots.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
          { stat: StatId.IMM, amount: 3, label: '+IMM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'is-chrysalis' },
          { type: 'remove_flag', flag: 'is-caterpillar' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'exposed-spot',
        label: 'Choose an exposed branch with good airflow',
        description: 'Better ventilation but more visible to predators.',
        narrativeResult: 'You attach to a bare twig in open air. The breeze will keep moisture from building. But you hang in plain sight.',
        statEffects: [
          { stat: StatId.CLI, amount: -3, label: '-CLI' },
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'is-chrysalis' },
          { type: 'remove_flag', flag: 'is-caterpillar' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-caterpillar' },
      { type: 'age_range', min: 1 },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['metamorphosis', 'chrysalis', 'lifecycle'],
    footnote: 'Monarch metamorphosis takes approximately 10-14 days. Inside the chrysalis, most of the caterpillar\'s cells undergo programmed cell death. The adult butterfly is built from clusters of undifferentiated cells called imaginal discs that were dormant throughout the larval stage.',
  },

  {
    id: 'monarch-chrysalis-cold',
    type: 'passive',
    category: 'seasonal',
    narrativeText: "The temperature drops while you hang in the chrysalis. The chemical reactions inside slow. If it stays cold, the transformation may stall or produce a malformed body.",
    statEffects: [
      { stat: StatId.CLI, amount: 12, label: '+CLI' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-chrysalis' },
      { type: 'season', seasons: ['autumn', 'spring'] },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['metamorphosis', 'cold', 'chrysalis'],
    footnote: 'Monarch chrysalis development requires temperatures above approximately 50F (10C). Prolonged cold exposure during pupation can cause developmental abnormalities and reduced adult fitness.',
  },

  {
    id: 'monarch-chrysalis-parasitoid',
    type: 'passive',
    category: 'health',
    narrativeText: "A wasp no bigger than a pinhead lands on your chrysalis and drills through the hardened shell with its ovipositor. Dozens of wasp larvae will develop inside, consuming the tissue that was forming a butterfly.",
    statEffects: [
      { stat: StatId.IMM, amount: 12, label: '+IMM' },
      { stat: StatId.HEA, amount: -10, label: '-HEA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'is-chrysalis' },
    ],
    weight: 7,
    cooldown: 99,
    tags: ['metamorphosis', 'parasitoid', 'chrysalis'],
    subEvents: [
      {
        eventId: 'monarch-chrysalis-parasitoid-death',
        chance: 0.30,
        narrativeText: 'The wasp larvae have consumed you. When the chrysalis splits, tiny wasps emerge. No butterfly.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Consumed by parasitoid wasps inside the chrysalis.' },
        ],
      },
    ],
    footnote: 'Pteromalid and chalcid wasps are common parasitoids of monarch chrysalises. Parasitoid rates of 5-15% have been documented in wild populations.',
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-magnetic-navigation',
    type: 'passive',
    category: 'migration',
    narrativeText: "The days shorten. Something in your antennae responds to the magnetic field, building an internal bearing. Combined with the sun compass in your compound eyes, a direction registers: south-southwest. Your body turns toward it.",
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.NOV, amount: -8, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'southward-migration-begun' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'southward-migration-begun' },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['migration', 'navigation'],
    footnote: 'Monarchs navigate using a time-compensated sun compass in their antennae and a magnetic compass that likely uses cryptochrome proteins sensitive to Earth\'s magnetic field. This system allows them to maintain a consistent southwest bearing even on overcast days.',
  },

  {
    id: 'monarch-tailwind-bonus',
    type: 'passive',
    category: 'migration',
    narrativeText: "A cold front from the northwest pushes tailwinds south. You rise on a thermal, spread your wings, and glide. For miles you barely flap. The air current carries you.",
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'southward-migration-begun' },
      { type: 'no_flag', flag: 'reached-overwintering-site' },
    ],
    weight: 12,
    cooldown: 2,
    tags: ['migration', 'weather', 'tailwind'],
    footnote: 'Monarchs can travel 50-100 miles per day during migration, but favorable tailwinds can dramatically increase this distance. They use thermals to gain altitude (up to 10,000 feet) and then glide for miles on prevailing winds.',
  },

  {
    id: 'monarch-gulf-states-crossing',
    type: 'passive',
    category: 'migration',
    narrativeText: "The air is thick with other monarchs, all flowing the same direction through live oaks and mesquite. Asters and tropical milkweed line the roadsides. You stop to refuel.",
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
      { stat: StatId.ADV, amount: -2, label: '-ADV' },
    ],
    consequences: [
      { type: 'change_region', regionId: 'texas-gulf-coast-stopover' },
      { type: 'modify_weight', amount: 0.00004 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'southward-migration-begun' },
      { type: 'no_flag', flag: 'reached-overwintering-site' },
      { type: 'region', regionIds: ['great-lakes-milkweed'] },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['migration', 'stopover'],
    footnote: 'Central Texas is the primary funnel point for the eastern monarch migration. Nearly all monarchs from east of the Rockies pass through this corridor, creating one of the most spectacular insect migrations on Earth.',
  },

  {
    id: 'monarch-oyamel-arrival',
    type: 'passive',
    category: 'migration',
    narrativeText: "Fir trees, high on a mountain, draped in butterflies. Millions coat every surface, wings folded, clustering. The branches sag under the weight. You find a place among them and fold your wings.",
    statEffects: [
      { stat: StatId.WIS, amount: 8, label: '+WIS' },
      { stat: StatId.ADV, amount: -10, label: '-ADV' },
      { stat: StatId.NOV, amount: -10, label: '-NOV' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'reached-overwintering-site' },
      { type: 'change_region', regionId: 'oyamel-fir-forest-mexico' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'southward-migration-begun' },
      { type: 'no_flag', flag: 'reached-overwintering-site' },
      { type: 'region', regionIds: ['texas-gulf-coast-stopover'] },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['migration', 'arrival', 'overwintering'],
    footnote: 'The monarch overwintering colonies in Mexico\'s oyamel fir forests were not discovered by scientists until 1975. An estimated 200-500 million monarchs congregate in just 12-15 mountaintop sites, each covering only a few hectares.',
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-cold-snap',
    type: 'passive',
    category: 'seasonal',
    narrativeText: "Frost. Your body temperature drops with the air. Your muscles stiffen. Your wings will not open. You cling to whatever surface you last landed on, immobile.",
    statEffects: [
      { stat: StatId.CLI, amount: 15, label: '+CLI' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['spring', 'autumn'] },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['environmental', 'cold', 'weather'],
    subEvents: [
      {
        eventId: 'monarch-cold-death',
        chance: 0.08,
        conditions: [{ type: 'stat_below', stat: StatId.HEA, threshold: 30 }],
        narrativeText: 'The cold does not release you. Your hemolymph crystallizes. By morning you are a frozen shell on a dead stem.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by frost. Hemolymph crystallized overnight.' },
        ],
      },
    ],
  },

  {
    id: 'monarch-pesticide-drift',
    type: 'passive',
    category: 'environmental',
    narrativeText: "A white mist settles across the meadow from the adjacent field. It coats the milkweed, the flowers, your body. Your muscles begin to twitch.",
    statEffects: [
      { stat: StatId.HOM, amount: 12, label: '+HOM' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.IMM, amount: 5, label: '+IMM' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'region', regionIds: ['great-lakes-milkweed'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['environmental', 'pesticide'],
    subEvents: [
      {
        eventId: 'monarch-pesticide-death',
        chance: 0.12,
        narrativeText: 'Your muscles lock in spasm. Wings rigid. You fall from the milkweed stem and lie twitching in the grass.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by pesticide drift. Nervous system collapse.' },
        ],
      },
    ],
    footnote: 'Pesticide drift is a major and largely unregulated threat to monarchs. Studies have shown that even sublethal exposure to common agricultural insecticides reduces monarch survival, flight ability, and reproductive success.',
  },

  {
    id: 'monarch-habitat-destruction',
    type: 'passive',
    category: 'environmental',
    narrativeText: "The meadow where you have been feeding is scraped bare. Raw earth where flowers grew. You circle the site, searching for food that is no longer there, then fly on.",
    statEffects: [
      { stat: StatId.NOV, amount: 12, label: '+NOV' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.00005 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'region', regionIds: ['great-lakes-milkweed'] },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['environmental', 'habitat-loss'],
    footnote: 'Habitat loss is the single greatest threat to monarch butterflies. An estimated 165 million acres of monarch habitat has been lost to development and agriculture in the United States since the 1990s.',
  },

  {
    id: 'monarch-logging-overwintering',
    type: 'passive',
    category: 'environmental',
    narrativeText: "Trees are falling at the edge of the colony. Each one takes thousands of butterflies with it. The gap in the canopy exposes the remaining clusters to wind and freezing rain.",
    statEffects: [
      { stat: StatId.CLI, amount: 12, label: '+CLI' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'reached-overwintering-site' },
      { type: 'region', regionIds: ['oyamel-fir-forest-mexico'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['environmental', 'logging', 'overwintering'],
    footnote: 'Despite legal protections, illegal logging continues to degrade the oyamel fir forests critical to monarch overwintering. The loss of even a small number of trees can fatally expose butterfly clusters to lethal winter storms.',
  },

  // ══════════════════════════════════════════════
  //  SOCIAL / OTHER EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'monarch-citizen-scientist',
    type: 'passive',
    category: 'social',
    narrativeText: "Something catches you mid-flight and pins your thorax. A small disc presses onto your hindwing. You are released. One wing pulls heavier than the other now.",
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'citizen-science-tagged' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'citizen-science-tagged' },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
    ],
    weight: 6,
    cooldown: 99,
    tags: ['social', 'citizen-science', 'human'],
    footnote: 'Tagging programs have marked over 1.8 million monarchs since 1992. Recovered tags at the Mexican overwintering sites provide data on migration routes, timing, and survival rates.',
  },

  {
    id: 'monarch-mating-encounter',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Another monarch spirals upward in a courtship flight. Pheromones in the air. The pair would hang from a branch, connected, for hours.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'mate',
        label: 'Mate',
        description: 'Continue the lineage.',
        narrativeResult: 'The coupling is successful. You carry fertilized eggs now, ready to be deposited one at a time on milkweed leaves.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'reject-mate',
        label: 'Reject and continue feeding',
        description: 'You are not ready, or the conditions are not right.',
        narrativeResult: 'You fly away from the encounter.',
        statEffects: [
          { stat: StatId.ADV, amount: 2, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
      { type: 'no_flag', flag: 'mated' },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'age_range', min: 2 },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['reproduction', 'mating'],
  },

  {
    id: 'monarch-overwintering-cluster',
    type: 'passive',
    category: 'social',
    narrativeText: "Millions of butterflies coat the fir branches. When the sun breaks through, thousands lift off at once, filling the air with a sound like soft rain. Then cloud returns and they settle, folding their wings, becoming bark. You are pressed against others on all sides, sharing warmth in the thin mountain air.",
    statEffects: [
      { stat: StatId.CLI, amount: -5, label: '-CLI' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'has_flag', flag: 'reached-overwintering-site' },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['social', 'overwintering', 'cluster'],
    footnote: 'Overwintering clusters can contain 10,000-50,000 monarchs per tree branch. The butterflies enter a state of reproductive diapause, conserving energy by remaining largely inactive for four to five months. Colony density is measured in hectares; a healthy season sees 6+ hectares of occupied forest.',
  },

  {
    id: 'monarch-milkweed-search',
    type: 'active',
    category: 'foraging',
    narrativeText: "You carry fertilized eggs. You fly low over fields and roadsides, tasting leaves with your feet, searching for the chemical signature of Asclepias.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'lay-eggs-here',
        label: 'Lay eggs on this milkweed patch',
        description: 'The milkweed is healthy and abundant.',
        narrativeResult: 'You curl your abdomen beneath a milkweed leaf and deposit a single pale egg. Then the next plant, and the next, spacing each egg to give each caterpillar its own food.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'milkweed-found' },
          { type: 'set_flag', flag: 'eggs-laid' },
          { type: 'spawn' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'keep-searching',
        label: 'Keep searching for better milkweed',
        description: 'This patch may be too small or too exposed.',
        narrativeResult: 'You continue searching. The eggs inside you are a biological clock. You fly on, burning reserves.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.00003 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['monarch-butterfly'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'mated' },
      { type: 'no_flag', flag: 'eggs-laid' },
      { type: 'no_flag', flag: 'is-caterpillar' },
      { type: 'no_flag', flag: 'is-chrysalis' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['reproduction', 'milkweed', 'egg-laying'],
    footnote: 'Female monarchs taste milkweed with chemoreceptors on their feet to assess plant quality before ovipositing. They lay an average of 300-500 eggs over their lifetime, typically one per milkweed plant. Only about 2-5% of eggs survive to adulthood in the wild.',
  },
];
