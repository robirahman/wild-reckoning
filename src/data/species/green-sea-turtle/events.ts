import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

const turtleEvents: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-seagrass-meadow-feast',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The current slows over a broad seagrass flat. You lower your head and crop the blades with the serrated edge of your beak. Small fish scatter from between the stems. A remora shifts on your shell.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 16,
    cooldown: 3,
    tags: ['foraging', 'food', 'seagrass'],
  },

  {
    id: 'turtle-algae-reef-grazing',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Green and brown algae coat the dead coral heads. You settle against the reef and scrape with your beak, twisting your head to strip each surface. A hawksbill works the same reef nearby, gnawing at a sponge.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 14,
    cooldown: 3,
    tags: ['foraging', 'food', 'algae'],
  },

  {
    id: 'turtle-jellyfish-plastic-confusion',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Something pale and translucent drifts past in the current. It moves like a jellyfish. The shape is right. But the texture, when you turn your head to examine it, registers wrong.',
    statEffects: [],
    choices: [
      {
        id: 'eat-it',
        label: 'Eat it',
        description: 'It looks like food. Your instincts say eat.',
        narrativeResult:
          'You bite down and swallow. The taste is flat, chemical, nothing like the gelatinous burst of prey. It slides into your stomach and sits there, inert.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.IMM, amount: 4, label: '+IMM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'avoid-it',
        label: 'Avoid it',
        description: 'Something seems off. Turn away.',
        narrativeResult:
          'You veer away. The pale shape tumbles past in the current, handles streaming like tentacles.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['foraging', 'food', 'conservation', 'plastic'],
    footnote: 'Plastic bag ingestion is a leading cause of death in sea turtles worldwide. Their resemblance to jellyfish is tragically effective.',
  },

  {
    id: 'turtle-deep-dive-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The shallow beds are cropped to stubble. You angle downward past the reef edge into dimmer water. Pressure builds against your lungs. Cold seeps into your muscles. Algae encrusts a rocky shelf below.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
      { stat: StatId.CLI, amount: 3, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'food', 'deep-dive'],
  },

  {
    id: 'turtle-degraded-seagrass-bed',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The blades here are sparse and coated with brownish slime. Bare sand stretches where meadow should be. The water is cloudy with sediment. You graze what you find, but the taste is poor and grit fills your gut.',
    statEffects: [
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['foraging', 'food', 'conservation', 'degradation'],
    footnote: 'Seagrass meadows are declining worldwide due to coastal development, pollution, and climate change. Green sea turtles depend on healthy seagrass for survival.',
  },

  {
    id: 'turtle-coral-reef-grazing',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Turf algae patches between coral heads. You scrape close to the living polyps without touching them. A wrasse darts in and picks at the barnacles on your shell while you feed.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['foraging', 'food', 'reef'],
  },

  // ══════════════════════════════════════════════
  //  CONSERVATION THREAT EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-plastic-ingestion',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'Tiny fragments ride every mouthful of seagrass. They coat the blades, hang in the water column, settle in the sediment. You cannot taste them or smell them. They accumulate in your gut.',
    statEffects: [
      { stat: StatId.IMM, amount: 3, label: '+IMM' },
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 8,
    cooldown: 24,
    tags: ['conservation', 'plastic', 'health'],
    footnote: 'Studies have found microplastics in 100% of sea turtles examined. The long-term health effects are still being understood.',
  },

  {
    id: 'turtle-fishing-net-entanglement',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'A wall of monofilament appears from the murk. Your momentum carries you into it. The mesh wraps your flippers and neck. Every movement tightens the lines. The surface is close enough to strain toward for air, but you cannot dive or feed.',
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
    ],
    consequences: [
      { type: 'add_injury', injuryId: 'fishing-line-entanglement', severity: 0 },
    ],
    subEvents: [
      {
        eventId: 'turtle-net-drowning',
        chance: 0.08,
        conditions: [],
        narrativeText:
          'The mesh holds you under. You strain upward but each movement pulls tighter. Your lungs burn. The light above dims.',
        footnote: '(Drowned in fishing net)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Drowned in a ghost net. The monofilament held you under until your lungs gave out.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 2,
    cooldown: 60,
    tags: ['conservation', 'fishing', 'injury'],
    footnote: 'Bycatch in fishing gear is one of the greatest threats to sea turtles. Thousands drown in nets every year.',
  },

  {
    id: 'turtle-boat-strike-event',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'You surface to breathe in a channel of heavy traffic. A deep vibration reaches you too late. The hull passes overhead and the propeller catches your shell. The impact reverberates through bone.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    consequences: [
      { type: 'add_injury', injuryId: 'boat-strike', severity: 0 },
    ],
    subEvents: [
      {
        eventId: 'turtle-boat-strike-fatal',
        chance: 0.06,
        conditions: [],
        narrativeText:
          'The propeller strikes across your spine. The shell shatters. You sink through water that reddens around you.',
        footnote: '(Killed by boat strike)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Propeller strike shattered the carapace.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 4,
    cooldown: 12,
    tags: ['conservation', 'boat', 'injury'],
    footnote: 'Boat strikes are a significant source of sea turtle mortality, particularly in shallow coastal waters with heavy boat traffic.',
  },

  {
    id: 'turtle-light-pollution',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The beach glows with artificial light. The brightest horizon is inland now, not seaward. You circle on hot ground, drawn the wrong way, spending energy and exposed.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.WIS, amount: -3, label: '-WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['conservation', 'light-pollution', 'nesting'],
    footnote: 'Artificial lighting on nesting beaches disorients both adult turtles and hatchlings, leading them away from the sea and toward roads, predators, and exhaustion.',
  },

  {
    id: 'turtle-beach-development',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'You haul yourself up the sand, but a hard wall blocks the slope where dunes should be. The beach has narrowed. The sand is compacted, littered with debris. You search for soft ground to dig and find none.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
      { type: 'sex', sex: 'female' },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['conservation', 'development', 'nesting'],
    footnote: 'Coastal development destroys nesting habitat. Seawalls, beach armoring, and sand compaction prevent turtles from nesting successfully.',
  },

  {
    id: 'turtle-oil-spill',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The water has a strange sheen. A sharp chemical smell hits when you surface to breathe. The slick coats your nostrils and eyes. Below the surface, droplets cling to your skin and to the seagrass.',
    statEffects: [
      { stat: StatId.IMM, amount: 10, label: '+IMM' },
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 1,
    cooldown: 120,
    tags: ['conservation', 'pollution', 'health'],
    footnote: 'Oil spills devastate marine ecosystems. Sea turtles are particularly vulnerable because they must surface to breathe, exposing them to surface slicks.',
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-tiger-shark-encounter',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'A shadow passes beneath you. Long, sinuous, deliberate. A blunt head swings side to side, tasting the water. It has seen you. It circles, closing the distance with each pass.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'turtle-tiger-shark-bite',
        chance: 0.25,
        conditions: [],
        narrativeText:
          'Its jaws close on the edge of your shell. The force sends a shockwave through your body. You feel the shell crack and teeth scrape bone. You wrench free and flee, trailing blood.',
        footnote: '(Bitten by tiger shark)',
        statEffects: [
          { stat: StatId.HEA, amount: -10, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'shark-bite', severity: 0 },
        ],
      },
      {
        eventId: 'turtle-tiger-shark-kill',
        chance: 0.04,
        conditions: [],
        narrativeText:
          'It strikes from below. Its jaws close around your midsection and the shell cracks apart.',
        footnote: '(Killed by tiger shark)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by tiger shark.' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 6,
    cooldown: 36,
    tags: ['predator', 'shark'],
  },

  {
    id: 'turtle-bull-shark-encounter',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'The water near the river mouth is murky with sediment. You do not detect the bull shark until it is already close. Stocky and blunt-nosed, it bumps your shell with its snout. The impact jars through you.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'turtle-bull-shark-bite',
        chance: 0.15,
        conditions: [],
        narrativeText:
          'It bites down on your rear flipper. Serrated teeth tear through the tough skin. You kick free and swim hard for the reef.',
        footnote: '(Bitten by bull shark)',
        statEffects: [
          { stat: StatId.HEA, amount: -6, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'shark-bite', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 5,
    cooldown: 36,
    tags: ['predator', 'shark'],
  },

  {
    id: 'turtle-bird-attack-hatchling',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'Dark shapes wheel above the surf line, plunging to snatch hatchlings from the sand. You watch from the shallows as a frigatebird takes one, then another. The scramble from nest to water is short but few survive it.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 6,
    cooldown: 10,
    tags: ['predator', 'memory', 'hatchling'],
  },

  {
    id: 'turtle-ghost-crab-hatchling',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'At dusk, pale crabs emerge and patrol the sand between nest and surf. Hatchlings from a nearby nest pour out. The crabs seize them and drag them sideways into burrows. Some hatchlings reach the water. Many do not.',
    statEffects: [
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['predator', 'nesting', 'hatchling'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION / NESTING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-natal-beach-return',
    type: 'passive',
    category: 'migration',
    narrativeText:
      'A chemical trace in the water, a magnetic bearing that aligns with something deep in your skull. This is the beach where you hatched. The dunes have shifted, the shoreline is different, but the pull is the same.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.NOV, amount: -8, label: '-NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'has_flag', flag: 'nesting-migration-begun' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['migration', 'nesting', 'natal'],
  },

  {
    id: 'turtle-nest-digging',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'In darkness you haul yourself above the tide line. Your flippers, so efficient in water, drag clumsily on sand. You scoop a flask-shaped chamber with your rear flippers. Sand flies bite your exposed skin. The digging takes over an hour.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'sex', sex: 'female' },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
      { type: 'has_flag', flag: 'reached-nesting-beach' },
    ],
    weight: 18,
    cooldown: 4,
    tags: ['nesting', 'reproduction', 'beach'],
  },

  {
    id: 'turtle-egg-laying',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'You settle over the chamber. Soft, leathery eggs drop into the sand in clusters of two and three. Thick mucus streams from your eyes, clearing the grit. Over a hundred eggs fall in twenty minutes. You cover the nest, pack it with your plastron, scatter loose sand over the site, and drag yourself back to the water.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -8 },
      { type: 'set_flag', flag: 'carrying-eggs' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'sex', sex: 'female' },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
      { type: 'has_flag', flag: 'reached-nesting-beach' },
      { type: 'no_flag', flag: 'carrying-eggs' },
      { type: 'age_range', min: 240 },
    ],
    weight: 15,
    cooldown: 4,
    tags: ['nesting', 'reproduction', 'eggs'],
    footnote: 'A female green sea turtle lays 80-120 eggs per clutch and may nest 3-5 times per season, with about two weeks between clutches.',
  },

  {
    id: 'turtle-hatchling-emergence',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'Two months after you left this beach, the sand stirs at night. Tiny flippers break the surface. Hatchlings pour from the nest and orient toward the brightest horizon. Ghost crabs close from the flanks. You are far away, grazing. You will not know how many reached the water.',
    statEffects: [
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'carrying-eggs' },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['nesting', 'reproduction', 'hatchling'],
    footnote: 'Only an estimated 1 in 1,000 sea turtle hatchlings survives to adulthood. The journey from nest to ocean is the most dangerous moment of their lives.',
  },

  // ══════════════════════════════════════════════
  //  FEMALE COMPETITION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-nest-competition',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'Another female is already dug in at the prime nesting band. Her bulk blocks the best stretch of soft, well-drained sand. Below her, the sand is damp and cool, too close to the tide line.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'contest-nest-site',
        label: 'Body-check her away from the prime sand',
        description: 'Better incubation temperature, but she will bite',
        narrativeResult:
          'You shove against her flank. She bites at your front flipper, her serrated beak tearing skin. You push harder, using the slope for leverage. She abandons the site and drags herself down the beach. The prime sand is yours.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'dig-nearby',
        label: 'Dig alongside her in the same zone',
        description: 'Adequate sand, no conflict',
        narrativeResult:
          'You settle a few body-lengths away and dig. The sand is serviceable.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'take-marginal-site',
        label: 'Move down to the tide-line sand',
        description: 'No fight, but eggs risk flooding and poor incubation',
        narrativeResult:
          'You drag yourself to the lower beach. The sand is damp and cool. The chamber fills with seawater before you finish, and you must start again on a narrow strip of marginal ground.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'turtle-nest-flipper-wound-sub',
        chance: 0.18,
        narrativeText:
          'Her beak caught your front flipper during the shoving, tearing a crescent of skin from the leading edge. Blood wells dark against the sand.',
        footnote: '(Flipper wound from nest competition)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'flipper-wound', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'reached-nesting-beach' },
      { type: 'no_flag', flag: 'carrying-eggs' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 14,
    cooldown: 6,
    tags: ['nesting', 'reproduction', 'female-competition'],
    footnote: 'Female sea turtles compete for prime nesting sites. Nest position on the beach significantly affects incubation temperature, which determines hatchling sex ratios and survival rates.',
  },

  // ══════════════════════════════════════════════
  //  HEALTH / PARASITE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-seagrass-fluke-exposure',
    type: 'passive',
    category: 'health',
    narrativeText:
      'Tiny snails cling to the seagrass blades. You swallow several with each mouthful.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    subEvents: [
      {
        eventId: 'turtle-spirorchid-fluke-infection',
        chance: 0.15,
        conditions: [
          { type: 'no_parasite', parasiteId: 'spirorchid-fluke' },
        ],
        narrativeText: 'Free-swimming larvae from the snails have entered your bloodstream. They migrate toward your heart.',
        footnote: '(Infected with spirorchid blood flukes)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'spirorchid-fluke', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['health', 'parasite', 'foraging'],
    footnote: 'Spirorchid blood flukes (family Spirorchiidae) are among the most common parasites of sea turtles worldwide. Their complex life cycle involves marine snails as intermediate hosts.',
  },

  {
    id: 'turtle-contaminated-seagrass-grazing',
    type: 'passive',
    category: 'health',
    narrativeText:
      'A brownish film coats the seagrass. Small crustaceans and worms wriggle among the roots in unusual numbers. The grass tastes adequate, so you continue. Your gut feels unsettled afterward.',
    statEffects: [
      { stat: StatId.HOM, amount: 2, label: '+HOM' },
    ],
    subEvents: [
      {
        eventId: 'turtle-gut-fluke-infection',
        chance: 0.18,
        conditions: [
          { type: 'no_parasite', parasiteId: 'gut-fluke' },
        ],
        narrativeText: 'Encysted larvae from the contaminated vegetation hatch in your gut and attach to the intestinal wall.',
        footnote: '(Infected with intestinal flukes)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'gut-fluke', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['health', 'parasite', 'foraging'],
    footnote: 'Intestinal trematodes are common in green sea turtles, acquired through contaminated seagrass and algae. Heavy burdens can significantly impair nutrient absorption.',
  },

  {
    id: 'turtle-shallow-water-leeches',
    type: 'passive',
    category: 'health',
    narrativeText:
      'You wedge under a coral ledge in a warm, shallow lagoon to rest. As you doze, something attaches to the soft skin behind your rear flippers. Then another. When you swim into clearer water, dark worm-like shapes cling to your skin and pulse.',
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    subEvents: [
      {
        eventId: 'turtle-leech-infestation',
        chance: 0.25,
        conditions: [
          { type: 'no_parasite', parasiteId: 'turtle-leech' },
        ],
        narrativeText: 'Several leeches have embedded in the soft tissue around your neck and cloaca. They feed steadily.',
        footnote: '(Infested with marine turtle leeches)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'turtle-leech', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['health', 'parasite', 'rest'],
    footnote: 'Ozobranchus branchiatus is a marine leech that feeds exclusively on sea turtles. It is strongly suspected as a vector for the fibropapillomatosis virus that devastates green sea turtle populations.',
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-coral-bleaching',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The reef has gone white. The coral has expelled its color, turning to bone. Fish have thinned out. Algae smothers the dead heads. You graze among the bleached skeletons, and the food is poor.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['environmental', 'climate', 'reef'],
    footnote: 'Coral bleaching events have increased fivefold since the 1980s. Reefs support roughly 25% of all marine species despite covering less than 1% of the ocean floor.',
  },

  {
    id: 'turtle-red-tide',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The water has turned a reddish-brown. The seagrass tastes wrong. Within days, your muscles twitch and breathing at the surface takes effort. Other turtles float listlessly nearby.',
    statEffects: [
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.IMM, amount: 6, label: '+IMM' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.WIS, amount: -4, label: '-WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 2,
    cooldown: 48,
    tags: ['environmental', 'health', 'pollution'],
    footnote: 'Red tides (Karenia brevis blooms) produce brevetoxins that cause sea turtle strandings, respiratory distress, and death. Their frequency and severity are increasing due to nutrient pollution.',
  },

  {
    id: 'turtle-hurricane',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The pressure drops. Swells build to heights you have never felt. The ocean churns with debris and suspended sand. You dive deep, but even at depth the surge tumbles you against the reef. When it passes, the seagrass beds are torn up and the bottom is unrecognizable.',
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 3,
    cooldown: 16,
    tags: ['environmental', 'weather', 'storm'],
    footnote: 'Hurricanes destroy nesting beaches, uproot seagrass beds, and displace turtles hundreds of miles from their home ranges. Climate change is intensifying hurricane seasons.',
  },

  {
    id: 'turtle-water-temperature-shift',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The water is warmer than usual. Your metabolism speeds up, burning through reserves faster. The seagrass has not grown to match your hunger.',
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['environmental', 'climate', 'temperature'],
    footnote: 'Sea turtle sex is determined by nest temperature. Warmer temperatures produce more females. Some populations are now over 90% female due to climate change.',
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'turtle-mating-encounter',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'The shallows near the nesting beach are crowded with males. Several approach, curved claws catching the light as they try to mount. Mating will last hours.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'turtle-accept-mate',
        label: 'Accept a mate',
        description: 'Initiate the egg-laying cycle. Gestation is ~4 weeks.',
        narrativeResult: 'A large bull clamps onto your shell. The coupling is rough and prolonged. You carry fertilized eggs now.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'turtle-dive-to-avoid',
        label: 'Dive to avoid the bulls',
        description: 'Stay focused on grazing. Preserves your strength.',
        narrativeResult: 'You dive into the deep grass, leaving the surface behind.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 240 },
      { type: 'no_flag', flag: 'pregnant' },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 15,
    cooldown: 8,
    tags: ['reproduction', 'social'],
  },

  {
    id: 'turtle-mating-aggregation',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The shallows churn with turtles. Males jostle and bite at each other, trying to mount receptive females. A bull clamps onto a female with his curved fore-claws and holds on while she swims, breathes, feeds.',
    statEffects: [
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'age_range', min: 240 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['social', 'reproduction', 'mating'],
  },

  {
    id: 'turtle-nesting-beach-gathering',
    type: 'passive',
    category: 'social',
    narrativeText:
      'Deep paired furrows mark the sand from waterline to dunes and back. Other females haul themselves up around you, each seeking undisturbed ground. The beach smells of salt and musk.',
    statEffects: [
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'region', regionIds: ['nesting-beach-caribbean'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'nesting', 'gathering'],
  },

  {
    id: 'turtle-remora-companions',
    type: 'passive',
    category: 'social',
    narrativeText:
      'Two remoras grip your plastron with their suction discs. They detach to grab scraps stirred up by your grazing, then bump back on. They take nothing from you. Their slight weight and the small tugs when they feed are constant.',
    statEffects: [
      { stat: StatId.NOV, amount: -2, label: '-NOV' },
      { stat: StatId.IMM, amount: -2, label: '-IMM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['social', 'symbiosis', 'passive'],
  },

  {
    id: 'turtle-research-tagging',
    type: 'passive',
    category: 'social',
    narrativeText:
      'Hands grip your shell and hoist you into air. Wind dries your skin. A sharp pinch on your rear flipper, then pressure releases. Water hits your plastron. You dive, heart hammering, and do not surface again for a long time.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.WIS, amount: 1, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 4,
    cooldown: 16,
    tags: ['social', 'research', 'conservation'],
    footnote: 'Flipper tagging and photo-identification are key tools for tracking sea turtle populations, migration routes, and survival rates.',
  },
  {
    id: 'turtle-fibropapilloma-exposure',
    type: 'passive',
    category: 'health',
    narrativeText: 'Another green turtle shares your foraging patch. Its body is covered in lumpy pale masses, some the size of your eye. You graze side by side, breathing the same water.',
    statEffects: [{ stat: StatId.IMM, amount: 2, label: '+IMM' }],
    consequences: [],
    choices: [],
    subEvents: [
      {
        eventId: 'turtle-fp-infection',
        chance: 0.10,
        narrativeText: 'Weeks later, a small, rubbery growth appears on your flipper.',
        statEffects: [],
        consequences: [{ type: 'add_parasite', parasiteId: 'fibropapillomatosis' }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'no_parasite', parasiteId: 'fibropapillomatosis' },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['health'],
  },
  {
    id: 'turtle-fish-seagrass-competition',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'Parrotfish and surgeonfish swarm the seagrass bed, cropping it faster than it grows. Only stubble remains where you have been feeding. You must range farther.',
    statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
    consequences: [{ type: 'modify_weight', amount: -2 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['foraging'],
  },
  {
    id: 'turtle-cold-stun',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The water temperature drops sharply. Your muscles stiffen. Your flippers barely respond. You float at the surface, unable to dive or feed.',
    statEffects: [{ stat: StatId.CLI, amount: 8, label: '+CLI' }],
    consequences: [],
    choices: [
      {
        id: 'turtle-cold-deep-water',
        label: 'Swim for deeper, warmer water',
        description: 'Deeper water holds heat longer. Push through the lethargy.',
        narrativeResult: 'You force your stiffening flippers downward. The water warms slightly with depth. You hang motionless at ten meters, barely functional but no longer freezing.',
        statEffects: [{ stat: StatId.HOM, amount: 5, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -3 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'turtle-cold-float',
        label: 'Conserve energy and float',
        description: 'Stop moving. Minimize energy expenditure and wait for the water to warm.',
        narrativeResult: 'You go limp at the surface. Hours pass. The current carries you to warmer water and sensation returns.',
        statEffects: [{ stat: StatId.ADV, amount: 6, label: '+ADV' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Cold-stunned. Body temperature dropped below function.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.0004 }],
        },
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
      { type: 'weather', weatherTypes: ['frost', 'blizzard'] },
    ],
    weight: 9,
    cooldown: 6,
    tags: ['environmental', 'danger'],
    footnote: 'Cold-stunning events kill thousands of sea turtles annually. In January 2010, over 4,600 green sea turtles were cold-stunned in Florida alone during an unusual cold snap.',
  },
];

export const GREEN_SEA_TURTLE_EVENTS: GameEvent[] = [...turtleEvents];
