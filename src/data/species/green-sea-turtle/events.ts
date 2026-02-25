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
      'You glide over a vast meadow of turtle grass, the blades swaying in the gentle current like a green prairie beneath the sea. You lower your head and crop the grass with the serrated edge of your beak, tearing off mouthfuls of the tender blades. The seagrass is rich with the nutrients your body craves — you have been grazing here for hours, and the meadow seems inexhaustible. Small fish dart between the blades, startled by your passage, and a remora clings to your shell, riding along for free.',
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
      'A patch of reef is thick with green and brown algae — the kind that coats dead coral heads in a velvet carpet. You settle against the reef and begin scraping the algae from the rock with your beak, twisting your head methodically to strip each surface clean. The algae is less nutritious than seagrass, but it is plentiful here, and the reef provides shelter from the open-water currents. A hawksbill turtle works the same reef nearby, focused on a sponge you would never touch.',
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
      'Something pale and translucent drifts past you in the current. It looks like a jellyfish — a rare protein-rich treat that supplements your herbivorous diet. You approach it, turning your head to examine it with one eye. The shape is right, the movement is right, but something about the texture is wrong.',
    statEffects: [],
    choices: [
      {
        id: 'eat-it',
        label: 'Eat it',
        description: 'It looks like food. Your instincts say eat.',
        narrativeResult:
          'You bite down and swallow. The taste is wrong — flat, chemical, nothing like the gelatinous burst of a real jellyfish. A plastic bag slides down your throat and into your stomach, where it will sit for months, blocking nutrient absorption and slowly poisoning you. Millions of years of evolution gave you no defense against this.',
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
          'You veer away at the last moment. The pale shape tumbles past in the current — a plastic shopping bag, its handles streaming like tentacles. It looked so much like a jellyfish. This time, your caution saved you. Next time, you may not be so discerning.',
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
      'The shallow seagrass beds have been heavily grazed, so you dive deeper than usual, pushing down past the reef edge into the dimmer waters where algae grows on rocky outcrops. The pressure builds against your lungs as you descend, and the light fades from turquoise to deep blue. You find a rocky shelf encrusted with red and green algae and begin feeding, your beak scraping against stone. You can hold your breath for hours, but this deep, the cold seeps into your muscles and slows your movements.',
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
      'You arrive at a seagrass meadow you have visited before, but something is wrong. The blades are sparse and coated with a brownish slime — epiphytic algae smothering the grass. Large patches of bare sand stretch where dense meadows once grew. The water is cloudier than it should be, thick with sediment from coastal development upstream. You graze what you can find, but the nutritive value is poor and your stomach feels heavy with sediment.',
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
      'You navigate through a healthy coral reef, its surfaces alive with color. Turf algae grows in patches between the coral heads — a secondary food source, less preferred than seagrass but available year-round. You graze carefully, your beak scraping close to the coral without damaging the living polyps. A cleaning station nearby attracts a queue of fish, and a bold wrasse darts in to pick at the barnacles on your shell as you feed. For a moment, the reef feels like a city, and you are simply one of its residents.',
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
      'You have been swallowing small fragments of microplastic with every mouthful of seagrass for weeks. The particles are invisible — embedded in the sediment, coating the blades, suspended in the water column. They accumulate in your gut, leaching chemicals into your tissue. You cannot taste them, smell them, or avoid them. They are simply part of the ocean now.',
    statEffects: [
      { stat: StatId.IMM, amount: 3, label: '+IMM' },
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['conservation', 'plastic', 'health'],
    footnote: 'Studies have found microplastics in 100% of sea turtles examined. The long-term health effects are still being understood.',
  },

  {
    id: 'turtle-fishing-net-entanglement',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'A wall of invisible netting materializes from the murky water. You swim directly into it before you can react — the monofilament wraps around your flippers and neck as your momentum carries you deeper into the mesh. You thrash instinctively, but every movement tightens the lines. The net holds you just below the surface, close enough to breathe if you stretch your neck, but unable to dive or feed. Hours pass. Then days.',
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
          'The net holds you under. You strain toward the surface, but the mesh tightens with every movement. Your lungs burn. The light above grows dimmer. After hours of struggle, your body goes still.',
        footnote: '(Drowned in fishing net)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Drowned in fishing net' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['conservation', 'fishing', 'injury'],
    footnote: 'Bycatch in fishing gear is one of the greatest threats to sea turtles. Thousands drown in nets every year.',
  },

  {
    id: 'turtle-boat-strike-event',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'You surface to breathe in a busy shipping channel. The sound reaches you too late — a deep, vibrating hum that suddenly becomes a roar. A boat hull passes over you at speed, and the propeller catches you before you can dive. The impact is a white-hot shock that reverberates through your shell and into your bones.',
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
          'The propeller strikes you squarely across the spine. The force is overwhelming — your shell shatters and the world goes dark before you can even register pain. You sink slowly through water that turns red around you.',
        footnote: '(Killed by boat strike)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by boat strike' },
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
      'The nesting beach glows with artificial light from the resort development behind the dunes. The lights are disorienting — your ancient instinct to follow the brightest horizon toward the sea is confused by the glare of hotels, streetlights, and parking lots. You wander inland instead of toward the water, circling on hot asphalt. The confusion costs you energy and exposes you to terrestrial predators and vehicle traffic.',
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
      'You haul yourself up the beach to nest, but the familiar stretch of sand has changed. A seawall blocks your path where dunes once sloped gently to the tree line. Construction equipment sits idle on the sand, and the beach has narrowed to a thin strip at high tide. You search for a suitable nesting site, but the sand is compacted and littered with debris. The beach that your mother nested on, and her mother before her, is being erased.',
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
      'The water has a strange sheen. A slick of oil spreads across the surface in iridescent swirls, and the smell is sharp and chemical. When you surface to breathe, the oil coats your nostrils and eyes. Below the surface, dispersed droplets cling to your skin and to the seagrass you eat. Your body has no mechanism to process petroleum hydrocarbons — they simply accumulate, poisoning you slowly from the inside.',
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
    weight: 3,
    cooldown: 16,
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
      'A shadow passes beneath you — long, sinuous, and deliberate. A tiger shark, its blunt head swinging slowly side to side as it tastes the water. It is enormous, easily twice your length, and it has seen you. Tiger sharks are one of the few predators that can bite through a sea turtle\'s shell. It circles once, twice, closing the distance with each pass. Your only advantage is maneuverability — you are more agile than you look.',
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
          'The shark strikes. Its jaws close on the edge of your shell with a force that sends a shockwave through your body. You feel the shell crack and the teeth scrape against bone. You wrench yourself free and flee, trailing blood, while the shark circles back for another pass that never comes — it has bitten off a piece of your shell and seems satisfied for now.',
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
          'The shark strikes from below with explosive force, its jaws closing around your midsection. The shell cracks like pottery. There is no escape from a predator that has hunted your kind since before the continents took their current shape.',
        footnote: '(Killed by tiger shark)',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed by tiger shark' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['green-sea-turtle'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['predator', 'shark'],
  },

  {
    id: 'turtle-bull-shark-encounter',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'The water near the river mouth is murky with sediment, and you do not see the bull shark until it is already close. Bull sharks thrive in these brackish waters where rivers meet the sea — the same shallow, warm areas where you feed. This one is stocky and aggressive, bumping you with its snout to test whether you are worth the effort. Your shell holds, but the impact is jarring.',
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
          'The shark bites down on your rear flipper, its serrated teeth tearing through the tough skin. You kick free, leaving a piece of yourself behind, and swim hard for the open reef where you can find cover.',
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
    cooldown: 8,
    tags: ['predator', 'shark'],
  },

  {
    id: 'turtle-bird-attack-hatchling',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'You remember the beach. You remember the frantic scramble from sand to surf, your tiny flippers churning against the sand that seemed to stretch forever. The frigatebirds were waiting — dark shapes wheeling overhead, plunging down to snatch your siblings one by one. You made it to the water by luck, by timing, by being one step faster than the hatchling next to you. The memory surfaces unbidden, a primal terror that never fully fades.',
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
      'On the nesting beach, the ghost crabs emerge at dusk — pale, skittering shapes that patrol the sand between the nest and the sea. They are hatchling predators, fast and efficient, and they have learned to wait near the nests for the emergence. You watch from the shallows as newly hatched turtles from another nest run the gauntlet. Some make it. Many do not. The crabs drag their catches sideways into their burrows without ceremony.',
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
      'After weeks of swimming, you recognize something in the water — a chemical signature, a magnetic bearing, something older than thought. This is your natal beach. You were born here decades ago, and you have crossed hundreds of miles of open ocean to return. The sand looks different — the dunes have shifted, a new hotel stands where sea grape trees once grew — but the magnetic imprint in your brain says this is home. The pull is irresistible.',
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
      'Under cover of darkness, you haul yourself up the beach. Your flippers, so graceful in the water, are clumsy instruments on land. You drag your heavy body above the high-tide line and begin to dig, using your rear flippers like cupped hands to scoop out a flask-shaped chamber in the damp sand. It takes over an hour, and you are exhausted by the effort. Sand flies bite at your exposed skin. The hole must be exactly right — deep enough to protect the eggs from the sun, shallow enough for the hatchlings to dig out.',
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
      'You settle over the nest chamber, and the eggs begin to fall — soft, white, leathery spheres the size of ping-pong balls, dropping into the sand cavity in clusters of two and three. Your eyes stream with thick, mucous tears that protect them from the sand and remove excess salt. To a human observer, you would appear to be weeping. You lay over a hundred eggs in twenty minutes, each one a repository of 110 million years of unbroken genetic memory. When the last egg falls, you cover the nest with sand, pack it down with your plastron, and scatter loose sand to disguise the site. Then you turn and drag yourself back to the sea. You will never see these eggs again.',
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
      'Two months after you laid your eggs and left, the sand stirs. Tiny flippers break the surface in the cool of the night, and a stream of hatchlings pours from the nest like dark water flowing uphill. Each one is no larger than the palm of a human hand, yet each carries the magnetic map of this beach encoded in its brain. They orient toward the brightest horizon — the moonlit sea — and begin their desperate sprint across the sand. Ghost crabs close in from the sides. Frigatebirds will be waiting at dawn. Of the hundred that emerge, perhaps one will survive to adulthood. You are already far away, grazing in waters you will not leave again for years. You will never know how many survived.',
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
      'You haul yourself up the beach toward the prime nesting zone — the band of soft, well-drained sand above the high-tide line where the temperature is ideal for incubation. But another female is already there, her massive body settled into the sand, her rear flippers scooping methodically at a nest chamber. The prime zone is narrow tonight, and her bulk blocks the best stretch. Below her, closer to the tide line, the sand is wetter and cooler — eggs laid there risk flooding at high tide and temperature-skewed sex ratios. You could challenge her for the spot, digging alongside her and body-checking her away from the prime sand. Or you could accept the marginal site and lay your eggs where the ocean may reclaim them.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'contest-nest-site',
        label: 'Body-check her away from the prime sand',
        description: 'Better incubation temperature, but she will bite',
        narrativeResult:
          'You drag yourself alongside her and shove — two hundred kilograms of shell and muscle pressing against her flank. She turns her head and bites at your front flipper, her serrated beak tearing through the tough skin. You shove again, harder, using the slope of the beach for leverage. She resists for long minutes, but you are fresher, more determined, and finally she abandons the site and drags herself further down the beach. The prime sand is yours. Your eggs will incubate at the perfect temperature.',
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
          'You settle a few body-lengths away and begin to dig. The sand here is acceptable — not the best, but serviceable. Your nests will be close enough that hatchlings from both may emerge on the same night, confusing predators with sheer numbers.',
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
          'You turn and drag yourself toward the lower beach, where the sand is damp and cool beneath your plastron. You dig here, but the chamber fills with seawater before you finish, and you must start again higher up on a narrow strip of marginal sand. Your eggs will be cooler, wetter, and closer to the waves than they should be. Some will not survive.',
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
          'Her beak caught your front flipper during the shoving match, tearing a crescent of tough skin away from the leading edge. Blood wells dark against the sand. The wound will heal slowly in the salt water.',
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
      'As you graze on a dense seagrass bed, tiny snails cling to the blades — barely visible, no larger than grains of rice. You swallow several with each mouthful. Unbeknownst to you, these snails are shedding microscopic cercariae into the water around them, and the free-swimming larvae are penetrating your skin even as you feed.',
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
        narrativeText: 'The cercariae have entered your bloodstream and are migrating toward your heart and brain. Spirorchid blood flukes — they will colonize your blood vessels and begin laying eggs in your vascular walls.',
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
      'The seagrass bed you are grazing has a slimy, unhealthy look. A brownish film coats the blades, and small invertebrates are unusually abundant — tiny crustaceans and worms wriggling among the roots. The grass still tastes adequate, so you continue to feed, but your gut feels unsettled afterward.',
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
        narrativeText: 'Among the contaminated vegetation, you ingested encysted metacercariae of intestinal flukes. Within days, they hatch in your gut and begin attaching to the intestinal wall, feeding on your blood and tissue.',
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
      'You settle into a warm, shallow lagoon to rest — the kind of sheltered water where you often sleep, wedged beneath a coral ledge with your head tucked against the rock. As you doze, something attaches to the soft skin behind your rear flippers. Then another, and another. When you rouse and swim into clearer water, you can see them — small, dark, worm-like creatures clinging to your skin and pulsing as they feed.',
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
        narrativeText: 'Several marine leeches have embedded themselves firmly in the soft tissue around your neck and cloaca. They are Ozobranchus — turtle-specialist leeches that will cling to you for weeks, feeding on your blood and potentially transmitting disease.',
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
      'The reef is dying. The water temperature has risen just two degrees above normal, but it is enough. The coral is expelling its symbiotic algae, turning from vibrant color to bone-white in a process called bleaching. Without the algae, the coral will starve. Without the coral, the reef ecosystem collapses — the fish leave, the algae overgrows, the seagrass beds silt up. You graze among the bleached skeletons of what was once a thriving reef, and the food is poor.',
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
      'The water has turned a sickly reddish-brown. A harmful algal bloom — a red tide — has erupted, fed by nutrient runoff from agricultural land. The toxic algae produces brevetoxins that accumulate in the seagrass you eat. Within days, you feel sluggish and disoriented. Your muscles twitch involuntarily, and breathing becomes labored when you surface. Other turtles in the area are similarly affected, floating listlessly at the surface.',
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
    weight: 4,
    cooldown: 12,
    tags: ['environmental', 'health', 'pollution'],
    footnote: 'Red tides (Karenia brevis blooms) produce brevetoxins that cause sea turtle strandings, respiratory distress, and death. Their frequency and severity are increasing due to nutrient pollution.',
  },

  {
    id: 'turtle-hurricane',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The barometric pressure drops and the swells build to heights you have never experienced. A hurricane is passing over the Caribbean, and the ocean has become a churning chaos of currents, debris, and sand. You dive deep to escape the worst of it, but even at depth the surge reaches you, tumbling you against the reef and filling the water with suspended sediment. When the storm passes days later, the seagrass beds are torn up, the reef is scarred by wave action, and the coastline has been reshaped. Navigation by landmarks is temporarily impossible.',
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
      'The water temperature has shifted — warmer than usual for this time of year. As an ectotherm, your body temperature matches the water around you. The warmth accelerates your metabolism, making you hungrier, but the seagrass has not increased its growth to match. You burn through energy reserves faster than you can replenish them. On the nesting beaches, warmer sand temperatures are skewing the sex ratio of hatchlings — more females, fewer males — a slow-motion crisis that no individual turtle can perceive.',
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
    id: 'turtle-mating-aggregation',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The shallow waters near the nesting beach are crowded with turtles. Males and females have gathered from across the Caribbean for the annual mating aggregation. Males jostle for position, biting at each other\'s flippers and attempting to mount receptive females. The water churns with their activity. Mating is rough and prolonged — a male clamps onto a female\'s shell with the curved claws on his front flippers and holds on for hours while she continues to swim, breathe, and feed. It is not elegant, but it has worked for 110 million years.',
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
      'The beach is marked with the tracks of dozens of turtles — deep, paired furrows in the sand leading up from the waterline to the dunes and back again. You are not the only one nesting here tonight. Other females haul themselves up the sand around you, each seeking her own patch of undisturbed beach. There is no cooperation, no communication — just a shared instinct that has drawn you all to the same stretch of coast at the same time. The beach smells of salt, sand, and the musky scent of nesting turtles.',
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
      'A pair of remoras have attached themselves to your plastron — their oval suction discs gripping the smooth surface of your underside. They have been riding with you for weeks now, detaching only to grab scraps of food stirred up by your grazing, then reattaching with a gentle bump. They are not parasites — they take nothing from you and may even help by eating dead skin and small external parasites. Their presence is a minor comfort, a reminder that even a solitary ocean wanderer attracts companions.',
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
      'Hands grip your shell and lift you, briefly, out of the water. The sensation is alien and terrifying — you have not been out of the water involuntarily since the day you hatched. Researchers measure your carapace length, photograph your facial scales for identification, and clip a small metal tag onto your right rear flipper. The tag pinches but does not truly hurt. They lower you back into the water and you dive immediately, your heart hammering. The tag will last for years, a tiny piece of metal that connects you to a database, a research paper, a conservation effort you will never understand.',
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
    narrativeText: 'You share a foraging patch with another green turtle whose body is covered in pale, cauliflower-like tumors. Fibropapillomatosis — a herpesvirus that has become epidemic in green sea turtle populations worldwide. The degraded coastal waters here seem to accelerate its spread. You graze side by side, breathing the same water.',
    statEffects: [{ stat: StatId.IMM, amount: 2, label: '+IMM' }],
    consequences: [],
    choices: [],
    subEvents: [
      {
        eventId: 'turtle-fp-infection',
        chance: 0.10,
        narrativeText: 'Weeks later, a small, rubbery growth appears on your flipper. The virus has taken hold.',
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
    narrativeText: 'The seagrass meadow that has been your primary foraging ground is under siege. Large schools of herbivorous parrotfish and surgeonfish have moved in, cropping the grass faster than it can grow. Where once you grazed on lush blades, now only stubble remains. You must range farther to find enough food, burning more energy with each trip.',
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
    narrativeText: 'The water temperature has dropped sharply. Your body, calibrated for tropical warmth, is shutting down. Your muscles stiffen, your flippers barely move. Cold-stunning is one of the greatest killers of sea turtles — when water temperatures drop below 10°C, you become immobilized and float helplessly at the surface, unable to dive, feed, or flee.',
    statEffects: [{ stat: StatId.CLI, amount: 8, label: '+CLI' }],
    consequences: [],
    choices: [
      {
        id: 'turtle-cold-deep-water',
        label: 'Swim for deeper, warmer water',
        description: 'Deeper water holds heat longer. Push through the lethargy.',
        narrativeResult: 'With agonizing effort, you push your stiffening flippers and angle downward. The water warms slightly with depth. You hang motionless at ten meters, barely alive but no longer freezing. When the surface warms, you can ascend.',
        statEffects: [{ stat: StatId.HOM, amount: 5, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -3 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'turtle-cold-float',
        label: 'Conserve energy and float',
        description: 'Stop moving. Minimize energy expenditure and wait for the water to warm.',
        narrativeResult: 'You go limp and float at the surface, a helpless target for boats, predators, and the cold itself. Hours pass. Eventually the current carries you to warmer water and sensation returns to your flippers.',
        statEffects: [{ stat: StatId.ADV, amount: 6, label: '+ADV' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Cold-stunned and unable to recover',
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
