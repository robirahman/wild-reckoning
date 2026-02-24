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
    narrativeText: "You find a dense stand of common milkweed in full bloom — thick stems crowned with clusters of pink flowers, their heavy sweetness filling the air. For a caterpillar, this is paradise. For an adult, the nectar is rich and the leaves will sustain the next generation. The milkweed's cardiac glycosides seep into your tissues, making you poisonous to most predators.",
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
    footnote: 'Monarchs are obligate milkweed specialists as larvae. The cardiac glycosides (cardenolides) they sequester from milkweed make them unpalatable to most bird predators — a defense that persists through metamorphosis into adulthood.',
  },

  {
    id: 'monarch-nectar-meadow',
    type: 'active',
    category: 'foraging',
    narrativeText: "A wildflower meadow stretches before you — coneflowers, black-eyed Susans, and blazing star in riotous bloom. You uncoil your proboscis and probe flower after flower, drawing up nectar rich in sugars and amino acids. The sun warms your wings as you feed. For a few hours, the world is nothing but sweetness and light.",
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
    narrativeText: "You find milkweed growing along the edge of a soybean field. The leaves look healthy, but something is wrong — a faint chemical smell clings to the plant. The field was sprayed recently, and pesticide drift has coated the milkweed. You are hungry.",
    statEffects: [],
    choices: [
      {
        id: 'eat-contaminated',
        label: 'Feed on the milkweed',
        description: 'You are too hungry to be cautious.',
        narrativeResult: 'You feed on the contaminated leaves. Within hours, your muscles begin to spasm. The neonicotinoid disrupts your nervous system — your flight becomes erratic, your orientation fails. The poison may not kill you outright, but it has stolen something from you.',
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
          cause: 'Neonicotinoid poisoning from contaminated milkweed',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-contaminated',
        label: 'Move on hungry',
        description: 'Trust the wrongness you sense.',
        narrativeResult: 'You leave the contaminated milkweed behind. Your hunger deepens, but your body remains your own. Somewhere ahead, there may be clean plants — if the spraying has not reached them too.',
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
    narrativeText: "You search for milkweed across mile after mile of monoculture cropland. The fields stretch to every horizon — soybeans, corn, soybeans, corn — and not a single milkweed plant breaks the monotony. Herbicide-tolerant crops have been engineered to survive chemicals that kill everything else. The milkweed that once grew between the rows is gone. You burn precious energy searching for food that does not exist.",
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
    footnote: 'Herbicide-resistant crops and the widespread use of glyphosate have eliminated an estimated 1.3 billion milkweed stems from the US Midwest since 1999 — roughly a 58% decline in the monarch\'s primary larval food source.',
  },

  {
    id: 'monarch-goldenrod-fuel',
    type: 'active',
    category: 'foraging',
    narrativeText: "Goldenrod. Fields of it, blazing yellow against the September sky. This is migration fuel — the last great nectar source before the long flight south. You feed urgently, storing lipids in your abdomen. Every milligram of fat you add now is distance you can fly later. The goldenrod hums with other pollinators, but there is enough for all.",
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
    narrativeText: "A black-backed oriole swoops toward you — one of the few bird species that has learned to eat monarchs despite their toxins. It knows how to gut you, eating the muscle tissue while avoiding the most poisonous parts. Your warning coloration means nothing to this predator.",
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
    ],
    choices: [
      {
        id: 'rely-on-toxicity',
        label: 'Hold still and rely on your toxicity',
        description: 'Most birds spit out monarchs after the first bite.',
        narrativeResult: 'The oriole strikes. Its beak closes around your abdomen — and then it pauses, tasting the cardenolides flooding its mouth. With a violent shake of its head, it spits you out. You tumble through the air, bruised and leaking hemolymph, but alive. Your poison saved you.',
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
          cause: 'Eaten by a bird that tolerated cardenolide toxins',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'erratic-flight',
        label: 'Attempt erratic evasive flight',
        description: 'Try to outmaneuver the bird.',
        narrativeResult: 'You throw yourself into a desperate series of dives and spirals, your bright wings flashing. The oriole follows for a few wingbeats, then breaks off — perhaps the effort is not worth the toxic meal. You escape unharmed but exhausted.',
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
    narrativeText: "A golden orb-weaver's web stretches across your flight path — nearly invisible silk strands glinting in the morning light. You see it almost too late. The web is enormous, engineered to catch exactly something your size.",
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'power-through',
        label: 'Power through the web',
        description: 'Use your momentum to break the silk.',
        narrativeResult: 'You hit the web at full speed. The silk stretches, clings to your wings, but your momentum tears through the outer strands. You pull free trailing sticky threads, your wings fouled but functional. The spider rushes to the breach, too late.',
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
        narrativeResult: 'You bank hard, your wing tips brushing the outermost anchor thread. The web quivers but holds. You pass safely — but the detour costs you time and energy, and the next web may be harder to see.',
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
    narrativeText: "You land on a flower to feed and something seizes you — a praying mantis, perfectly camouflaged among the petals. Its raptorial forelegs clamp down on your thorax with crushing force. Unlike birds, the mantis is unaffected by your toxins. It begins to eat you alive, starting with your head. There is no escape from this grip.",
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
    weight: 8,
    cooldown: 4,
    tags: ['predator', 'mantis'],
    footnote: 'Praying mantises are ambush predators that are immune to monarch cardenolides. They are a significant predator of adult monarchs, especially in gardens and meadows.',
    subEvents: [
      {
        eventId: 'monarch-mantis-kill',
        chance: 0.20,
        narrativeText: 'The mantis has you. Its serrated forelegs hold you immobile as it methodically consumes your thorax. Your wings beat uselessly. This is how it ends — not in flight, but in the jaws of something that was waiting in the flowers.',
        footnote: 'Mantises consume monarchs headfirst, a process that can take over an hour.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed and consumed by a praying mantis' },
        ],
      },
    ],
  },

  {
    id: 'monarch-wasp-encounter',
    type: 'passive',
    category: 'predator',
    narrativeText: "A paper wasp lands on the milkweed stem where you are feeding as a caterpillar. It walks toward you with the methodical precision of a hunter, antennae twitching. Wasps are major predators of monarch caterpillars — they chew the larvae into pulp to feed their own young.",
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
        narrativeText: 'The wasp seizes you in its mandibles. You thrash, releasing milkweed sap, but the wasp is undeterred. It chews through your soft body, sectioning you into pieces to carry back to its nest. Your brief life as a caterpillar ends here.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by a paper wasp as a caterpillar' },
        ],
      },
    ],
    footnote: 'Paper wasps (Polistes spp.) are among the most significant predators of monarch caterpillars. A single wasp colony can consume dozens of caterpillars in a season.',
  },

  {
    id: 'monarch-tachinid-fly',
    type: 'passive',
    category: 'predator',
    narrativeText: "A large gray fly hovers near you, then lands on your back. It moves quickly, purposefully — this is no casual visitor. The tachinid fly deposits a tiny white egg on your skin before buzzing away. You cannot remove it. The egg will hatch, and the larva will burrow inside you.",
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
    narrativeText: "The time has come. Your caterpillar body has grown as large as it will ever be. You climb away from the milkweed, searching for a place to attach your chrysalis — the structure that will house the most radical transformation in nature. Your entire body will dissolve into a biological soup and reassemble as something completely different.",
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
    ],
    choices: [
      {
        id: 'sheltered-spot',
        label: 'Choose a sheltered location under a leaf',
        description: 'Hidden from predators but at risk of mold in wet weather.',
        narrativeResult: 'You attach your silk pad to the underside of a broad leaf, hang in a J-shape, and begin to shed your skin one final time. The chrysalis forms around you — jade green with a ring of gold dots. Hidden here, you begin the impossible process of becoming something else entirely.',
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
        narrativeResult: 'You attach to a bare twig in open air. The breeze will keep moisture from building up, and the sun will warm you through the long transformation. But you are visible — a jade pendant hanging in plain sight. You can only hope nothing finds you before you emerge.',
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
    narrativeText: "A cold front moves through while you hang helpless in your chrysalis. The temperature drops below the threshold for normal development. Inside your jade case, the chemical reactions of metamorphosis slow to a crawl. If the cold persists, the transformation may stall entirely — or produce a deformed adult.",
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
    narrativeText: "A tiny chalcid wasp — no bigger than a pinhead — lands on your chrysalis and drills through the hardened shell with her needle-like ovipositor. She lays her eggs inside you. Dozens of wasp larvae will develop within your chrysalis, consuming the tissue that was meant to become a butterfly. When the chrysalis opens, wasps will emerge instead of wings.",
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
        narrativeText: 'The wasp larvae have consumed you entirely. When the chrysalis case splits open, a cloud of tiny wasps emerges into the sunlight. There is no butterfly. There was never going to be.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Consumed by parasitoid wasps inside the chrysalis' },
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
    narrativeText: "Something ancient stirs in you as the days shorten. Deep in your antennae, cryptochrome proteins are responding to the Earth's magnetic field, building an internal compass that points toward a place you have never been. Combined with the sun compass in your compound eyes, you can sense a direction — south-southwest — that feels more right than anything you have ever known. You have no memory of Mexico. But your genes remember.",
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
    narrativeText: "A cold front sweeps through from the northwest, and with it comes a gift — strong tailwinds pushing south. You rise on a thermal, spread your wings wide, and glide. For miles you barely need to flap, riding the air currents like a leaf in a river. On days like this, you can cover eighty miles with minimal energy expenditure. The wind is carrying you toward a place you have never seen but somehow know.",
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
    narrativeText: "You cross into Texas, funneling through the Gulf Coast corridor with millions of other monarchs. The air is thick with wings — an endless river of orange flowing south through the live oaks and mesquite. Asters and tropical milkweed line the roadsides, and you stop to refuel. Citizen scientists along the route count you, tag you, photograph you. You are part of something that astonishes even the species that is destroying it.",
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
    narrativeText: "After two months and two thousand miles, you see them — the oyamel fir forests of the Transvolcanic Belt, draped in monarchs. Millions upon millions of butterflies coat every surface, their wings folded, clustering together for warmth at 10,000 feet. The trees sag under their weight. You have never been here before, but your great-great-grandparents left from these exact trees last spring. You find your place among the millions and fold your wings. The journey is complete.",
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
    narrativeText: "An unseasonable frost descends overnight. Your body temperature drops with the air — you are ectothermic, a creature of the sun, and cold robs you of everything. Your muscles stiffen. Your wings cannot open. You cling to whatever surface you last landed on, paralyzed, waiting for warmth that may or may not come before a predator finds you immobile and helpless.",
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
        narrativeText: 'The cold does not release you. Your hemolymph crystallizes. By morning, you are a frozen shell clinging to a dead stem — one of millions lost to a single night of frost.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by unseasonable frost' },
        ],
      },
    ],
  },

  {
    id: 'monarch-pesticide-drift',
    type: 'passive',
    category: 'environmental',
    narrativeText: "A crop duster passes overhead, trailing a white mist that settles across the meadow. The insecticide was meant for aphids in the adjacent field, but the wind carried it here — across the milkweed, across the flowers, across you. The organophosphate disrupts your acetylcholinesterase. Your muscles begin to twitch involuntarily.",
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
        narrativeText: 'The dose was too high. Your nervous system collapses — muscles locked in spasm, wings rigid. You fall from the milkweed stem and lie twitching in the grass. The crop duster is already out of sight.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by pesticide drift from agricultural spraying' },
        ],
      },
    ],
    footnote: 'Pesticide drift is a major and largely unregulated threat to monarchs. Studies have shown that even sublethal exposure to common agricultural insecticides reduces monarch survival, flight ability, and reproductive success.',
  },

  {
    id: 'monarch-habitat-destruction',
    type: 'passive',
    category: 'environmental',
    narrativeText: "The meadow where you have been feeding is being developed. Bulldozers are scraping the topsoil, uprooting milkweed, wildflowers, and everything else that grew here. Within hours, a place that sustained caterpillars and butterflies for decades is raw earth. You circle the destruction, searching for flowers that no longer exist, before the hunger drives you elsewhere.",
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
    narrativeText: "The sound of chainsaws echoes through the mountain forest. Illegal loggers are cutting oyamel firs at the edge of the overwintering colony. Each tree that falls takes thousands of monarchs with it, and the gap in the canopy exposes the remaining clusters to wind and freezing rain. The forest that has sheltered your lineage for millennia is being dismantled, tree by tree.",
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
    narrativeText: "A human approaches slowly through the meadow, carrying a fine mesh net. With practiced care, they catch you, hold you gently by the thorax, and affix a tiny adhesive tag to your hindwing — a code that connects you to a vast database of monarch sightings. They record your sex, your wing condition, your location, and release you. For a moment, you were held in a hand that was trying to save your species. Then you are flying again, carrying a human story on your wing.",
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
    footnote: 'Monarch Watch, based at the University of Kansas, has tagged over 1.8 million monarchs since 1992. Tag recoveries at the Mexican overwintering sites provide crucial data on migration routes, timing, and survival rates.',
  },

  {
    id: 'monarch-mating-encounter',
    type: 'active',
    category: 'reproduction',
    narrativeText: "Another monarch crosses your path — spiraling upward in the distinctive courtship flight of your species. The male pursues the female in an aerial chase, bumping her, releasing pheromones, until she lands and allows mating. The coupling lasts for hours, the pair hanging from a branch, connected at the abdomen. This is the entire purpose of the non-migratory generations: to breed, lay eggs, and die within weeks.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'mate',
        label: 'Mate',
        description: 'Continue the lineage.',
        narrativeResult: 'The mating is successful. If you are female, you now carry fertilized eggs — up to four hundred of them — ready to be deposited one at a time on milkweed leaves. Each egg is a chance. Each egg is a lottery ticket against impossible odds.',
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
        narrativeResult: 'You fly away from the encounter. There will be other opportunities — if you live long enough. For now, nectar and survival take priority.',
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
    narrativeText: "You are one among millions. The oyamel fir trees are so thick with monarchs that the branches bend under their collective weight. When the sun breaks through the clouds, thousands take flight at once, filling the air with a sound like soft rain — the whisper of a hundred million wings. Then the cloud returns, and they settle again, folding their wings, becoming bark. You are pressed against others on all sides, sharing body heat in the thin mountain air. You are a single cell in an organism the size of a forest.",
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
    narrativeText: "You are a female monarch with a full complement of fertilized eggs. Now you must find milkweed — the only plant your caterpillars can eat. You fly low over fields and roadsides, tasting leaves with your feet, searching for the specific chemical signature of Asclepias. Each egg must be placed alone on a separate plant, giving each larva the best chance of survival.",
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'lay-eggs-here',
        label: 'Lay eggs on this milkweed patch',
        description: 'The milkweed is healthy and abundant.',
        narrativeResult: 'You curl your abdomen beneath a milkweed leaf and deposit a single pale egg, no bigger than a pinhead. Then you move to the next plant, and the next, spacing your eggs to give each caterpillar its own food supply. Over the coming days, you will lay hundreds. Most will never become butterflies. But some will.',
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
        narrativeResult: 'You continue searching. The eggs inside you are a ticking clock — you must lay them before you die. But placing them on poor milkweed means certain death for your offspring. You fly on, burning precious energy, hoping the next field will be better.',
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
