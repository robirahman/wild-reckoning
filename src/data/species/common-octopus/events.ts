import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const COMMON_OCTOPUS_EVENTS: GameEvent[] = [
  // ════════════════════════════════════════════════
  //  HATCHLING / JUVENILE PHASE (age 0-8)
  // ════════════════════════════════════════════════

  {
    id: 'octopus-planktonic-drift',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The current pushes you through clouds of copepods. Your arms taste salt and chitin. Shadows pass above and below, each one many times your size.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'age_range', max: 2 },
      { type: 'no_flag', flag: 'settled-on-reef' },
    ],
    weight: 15,
    tags: ['environmental'],
  },

  {
    id: 'octopus-reef-settlement',
    type: 'active',
    category: 'environmental',
    narrativeText: 'Below, your suckers taste crab-scent rising from rock crevices. The current is pulling you past. The reef is dropping away.',
    statEffects: [],
    choices: [
      {
        id: 'settle-now',
        label: 'Settle on this reef',
        description: 'Jet downward and squeeze into a crevice.',
        narrativeResult: 'Your siphon pulses. The current releases you. Your arms grip rock for the first time, suckers tasting algae and shell. You compress into a gap barely wider than your mantle.',
        statEffects: [
          { stat: StatId.HOM, amount: -5, duration: 4, label: '-HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'settled-on-reef' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'keep-drifting',
        label: 'Keep drifting',
        description: 'The current may carry you to a better reef.',
        narrativeResult: 'The reef drops away below. The water column opens around you, featureless and cold.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Carried past the last reef. Open water, no bottom.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'age_range', min: 1, max: 4 },
      { type: 'no_flag', flag: 'settled-on-reef' },
    ],
    weight: 25,
    tags: ['environmental'],
  },

  {
    id: 'octopus-first-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A shore crab sits on sand between two rocks. Your suckers taste its chemical trail. Your arms twitch.',
    statEffects: [],
    choices: [
      {
        id: 'pounce',
        label: 'Pounce',
        description: 'Engulf it with your web and pull it to your beak.',
        narrativeResult: 'Your arms wrap the crab before its claws close. Your beak finds the joint between carapace and abdomen. Venom flows. The crab goes still.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HEA, amount: 3, label: '+HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'first-hunt-success' },
          { type: 'modify_weight', amount: 0.1 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'wait',
        label: 'Wait for easier prey',
        description: 'A crab\'s claws can injure a young octopus.',
        narrativeResult: 'The crab wanders off. Later, you find a mussel and pry it open with your suckers. Not much meat.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.03 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
      { type: 'no_flag', flag: 'first-hunt-success' },
    ],
    weight: 30,
    tags: ['foraging', 'food'],
  },

  // ════════════════════════════════════════════════
  //  TOOL USE & INTELLIGENCE
  // ════════════════════════════════════════════════

  {
    id: 'octopus-coconut-shell',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A hard, concave object sits on the sand. Your suckers taste it: not rock, not shell. It is rigid, hollow, large enough to fit over your body.',
    statEffects: [],
    choices: [
      {
        id: 'carry-shell',
        label: 'Carry it as portable shelter',
        description: 'Hold it beneath you as you walk. Pull it over yourself when threatened.',
        narrativeResult: 'Two arms grip the shell. Six arms walk. When a shadow passes overhead, you pull the shell over yourself. The shadow moves on.',
        statEffects: [
          { stat: StatId.WIS, amount: 8, label: '+WIS' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tool-use-discovered' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'ignore-shell',
        label: 'Ignore it',
        description: 'You have your crevice. This is just debris.',
        narrativeResult: 'You jet past. The object stays on the sand.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
      { type: 'no_flag', flag: 'tool-use-discovered' },
    ],
    weight: 18,
    cooldown: 8,
    tags: ['environmental'],
    footnote: 'Octopuses in Indonesia have been observed carrying coconut shell halves and using them as portable shelters, a clear example of tool use, previously thought to be limited to vertebrates.',
  },

  {
    id: 'octopus-rock-tool',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A large clam is wedged into a crevice, shell sealed tight. Your suckers cannot pry it open. Loose rocks lie nearby.',
    statEffects: [],
    choices: [
      {
        id: 'use-rock',
        label: 'Hammer it with a rock',
        description: 'Grip a stone and strike the clam shell until it cracks.',
        narrativeResult: 'Two arms grip a flat stone. Five strikes. The shell cracks. You pry it open and taste the soft meat inside.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HEA, amount: 2, label: '+HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tool-use-discovered' },
          { type: 'modify_weight', amount: 0.15 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'drill-with-beak',
        label: 'Drill through the shell',
        description: 'Use your radula and salivary papilla to bore a hole.',
        narrativeResult: 'You press your beak against the shell and begin the slow work of drilling, injecting digestive enzymes through the hole. Hours pass. You reach the meat.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
      { type: 'age_range', min: 4 },
    ],
    weight: 14,
    cooldown: 6,
    tags: ['foraging', 'food'],
  },

  // ════════════════════════════════════════════════
  //  CAMOUFLAGE
  // ════════════════════════════════════════════════

  {
    id: 'octopus-chromatophore-mastery',
    type: 'active',
    category: 'environmental',
    narrativeText: 'You rest on coralline algae, barnacles, and sponges. Your chromatophores fire in sequence, each pigment sac expanding, testing against the substrate.',
    statEffects: [],
    choices: [
      {
        id: 'practice-camouflage',
        label: 'Match the reef perfectly',
        description: 'Spend time honing your color and texture match.',
        narrativeResult: 'Mottled brown. Stippled white. Papillae raised to mimic barnacles. A fish passes directly over you without changing course.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.ADV, amount: -5, duration: 4, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'camouflage-active' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stay-bold',
        label: 'Stay bold-patterned',
        description: 'You are hunting, not hiding.',
        narrativeResult: 'You hold a high-contrast pattern of dark and light. You move across the reef.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'remove_flag', flag: 'camouflage-active' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['environmental'],
    footnote: 'Octopuses have three layers of color-changing cells: chromatophores (pigment), iridophores (reflective), and leucophores (white). They can change color and texture in under a second, despite being colorblind.',
  },

  // ════════════════════════════════════════════════
  //  HUNTING & FORAGING
  // ════════════════════════════════════════════════

  {
    id: 'octopus-crab-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A large spider crab crosses a rocky outcrop. Slow, well-armored. Your suckers taste its chemical trail on the rock.',
    statEffects: [],
    choices: [
      {
        id: 'ambush-from-crevice',
        label: 'Ambush from your crevice',
        description: 'Wait for it to pass, then strike.',
        narrativeResult: 'You hold still, skin matching rock. The crab passes within arm-reach. Eight arms engulf it. Your beak finds the nerve cluster. The crab goes limp.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.2 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stalk-and-pounce',
        label: 'Stalk across the open',
        description: 'Cross exposed reef to close the distance.',
        narrativeResult: 'You flow across the reef, arms pulling you forward. The crab raises its claws. You engulf it from above, web smothering its defenses.',
        statEffects: [
          { stat: StatId.HEA, amount: 2, label: '+HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.25 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'Caught in the open by a predator while stalking prey.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.01 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
    ],
    weight: 18,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'octopus-mussel-feast',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'A bed of mussels clings to submerged rock. You pry them open one by one, suckers gripping each shell, tasting the meat inside. Tedious. Reliable.',
    statEffects: [
      { stat: StatId.HEA, amount: 2, label: '+HEA' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 14,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'octopus-fish-ambush',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A damselfish darts in and out of a coral head. Faster than crabs, more alert. Your suckers taste its trail in the water.',
    statEffects: [],
    choices: [
      {
        id: 'web-trap',
        label: 'Spread your web over the coral',
        description: 'Block the fish\'s escape routes and trap it.',
        narrativeResult: 'Your inter-arm web spreads over the coral head, sealing every exit. The fish panics inside, bouncing off your arms. You close the web. Your beak does the rest.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.15 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'let-it-go',
        label: 'Find easier prey',
        description: 'Fish are fast and the coral is sharp.',
        narrativeResult: 'You turn toward a sandy patch where your suckers taste crab-sign. Crabs are slower.',
        statEffects: [
          { stat: StatId.ADV, amount: -2, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.05 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
      { type: 'age_range', min: 5 },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'food'],
  },

  // ════════════════════════════════════════════════
  //  DEN BUILDING
  // ════════════════════════════════════════════════

  {
    id: 'octopus-den-construction',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A crevice in the reef rock. The entrance is too wide. Your suckers taste the edges. Shells, rocks, and broken coral fragments lie scattered around the opening.',
    statEffects: [],
    choices: [
      {
        id: 'build-fortress',
        label: 'Build a fortress',
        description: 'Stack rocks and shells to narrow the entrance and create a defensive wall.',
        narrativeResult: 'You carry rocks and shells to the entrance, testing each piece with your suckers for fit. When you finish, only a narrow slit remains. Your boneless body squeezes through. Nothing else will.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HOM, amount: -5, duration: 6, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'den-built' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'use-as-is',
        label: 'Use the crevice as-is',
        description: 'Good enough. You don\'t need a palace.',
        narrativeResult: 'You squeeze inside. The opening is wide, but you can jet away if something comes.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
      { type: 'no_flag', flag: 'den-built' },
      { type: 'age_range', min: 3 },
    ],
    weight: 20,
    tags: ['environmental'],
    footnote: 'Octopuses are prolific builders. They arrange rocks, shells, and debris around their den entrances, and some species create "octopus gardens," middens of shells and construction materials that become reef microhabitats.',
  },

  // ════════════════════════════════════════════════
  //  PREDATOR ENCOUNTERS
  // ════════════════════════════════════════════════

  {
    id: 'octopus-moray-encounter',
    type: 'active',
    category: 'predator',
    narrativeText: 'A moray eel slides from a crack in the reef. Its mouth gapes rhythmically. Your suckers taste its chemical signature in the water. Morays hunt octopuses by scent and can follow a trail into any crevice.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'ink-and-jet',
        label: 'Ink cloud and jet away',
        description: 'Release a cloud of ink and blast away with your siphon.',
        narrativeResult: 'You fire a dense cloud of ink at the moray. Your siphon fires in the same instant, driving you backward. The moray lunges into the ink, biting at nothing. You squeeze into an unfamiliar crevice thirty meters away.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
          { stat: StatId.ADV, amount: -3, duration: 2, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'camouflage-freeze',
        label: 'Freeze and camouflage',
        description: 'Match the reef. Don\'t move.',
        narrativeResult: 'You flatten against rock. Chromatophores fire in a cascade. Papillae sprout to mimic algae. The moray slides within centimeters of your arm, tongue tasting the water. It moves on.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'The moray detected you through the camouflage. Its jaws closed on your mantle.',
          statModifiers: [
            { stat: StatId.WIS, factor: -0.03 },
            { stat: StatId.HEA, factor: -0.02 },
          ],
        },
      },
    ],
    subEvents: [
      {
        eventId: 'octopus-moray-arm-bite',
        chance: 0.15,
        narrativeText: 'The moray strikes as you jet. Teeth catch a trailing arm. You wrench free, leaving the tip behind. The severed tip writhes on the reef, drawing the eel away.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'arm-loss', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['danger'],
  },

  {
    id: 'octopus-dolphin-hunt',
    type: 'active',
    category: 'predator',
    narrativeText: 'Shadows above. Echolocation clicks penetrate the water, pulsing through your mantle. Dolphins. Their sonar can find you inside your den.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'den-deep',
        label: 'Retreat deep into your den',
        description: 'Compress yourself into the deepest recess.',
        narrativeResult: 'You fold your body into the deepest part of the crevice. The clicks intensify, scanning the rock. One pauses near the entrance. Then the pod moves on. You do not move for a long time.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'A dolphin reached into the den with its rostrum and pulled you out.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
      {
        id: 'flee-open-water',
        label: 'Flee into open water',
        description: 'Jet away from the reef at maximum speed.',
        narrativeResult: 'You blast out and jet across the sand flat, trailing ink. The dolphins are hunting the reef, not the open sand. You keep jetting until your mantle aches.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.ADV, amount: -5, duration: 2, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'A dolphin followed your ink trail across the open sand.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.03 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
      { type: 'age_range', min: 3 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['danger'],
  },

  {
    id: 'octopus-conger-eel',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A conger eel emerges from the deeper reef at dusk. Three meters of muscle with a gape wide enough to take you whole. It slides past your den entrance. Your chromatophores match the crevice interior. It does not see you.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['danger'],
  },

  // ════════════════════════════════════════════════
  //  INK DEFENSE & ESCAPE
  // ════════════════════════════════════════════════

  {
    id: 'octopus-ink-pseudomorph',
    type: 'active',
    category: 'predator',
    narrativeText: 'A grouper is tracking you across the reef, mouth opening and closing. It is gaining.',
    statEffects: [],
    choices: [
      {
        id: 'create-pseudomorph',
        label: 'Create an ink pseudomorph',
        description: 'Release a blob of ink mixed with mucus that holds its shape as a decoy.',
        narrativeResult: 'You release a thick blob of ink bound with mucus. It hangs in the water, roughly your shape. You blanch white and jet sideways. The grouper lunges at the ink decoy. By the time it bites through, you are gone.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'jet-straight',
        label: 'Just jet away',
        description: 'Raw speed. No tricks.',
        narrativeResult: 'Your siphon fires with everything your mantle can produce. The grouper chases for twenty meters, then stops. Your mantle is sore.',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The grouper was faster. Its mouth engulfed you mid-jet.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
    ],
    weight: 11,
    cooldown: 5,
    tags: ['danger'],
    footnote: 'Octopuses can create "pseudomorphs," ink decoys that maintain their shape in the water due to a mucus binder. Predators attack the decoy while the octopus escapes, often turning white to maximize the contrast.',
  },

  // ════════════════════════════════════════════════
  //  SOCIAL & TERRITORIAL
  // ════════════════════════════════════════════════

  {
    id: 'octopus-rival-encounter',
    type: 'active',
    category: 'social',
    narrativeText: 'Another octopus has occupied a den thirty meters away. Its skin is dark with aggression patterns. Your suckers taste its chemical trace on the reef between you.',
    statEffects: [],
    choices: [
      {
        id: 'display-aggression',
        label: 'Display dominance',
        description: 'Raise yourself tall, darken your skin, and spread your arms wide.',
        narrativeResult: 'You rear up on your hind arms, web at full span. Your skin flushes deep red-brown. The rival responds in kind. Minutes pass. The rival pales and retreats into its den.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: -4, duration: 3, label: '-HOM' },
        ],
        consequences: [
          { type: 'introduce_npc', npcType: 'rival' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'ignore-rival',
        label: 'Ignore it',
        description: 'The reef is big enough for two.',
        narrativeResult: 'You hunt on your side of the reef. The other octopus hunts on its side.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
      { type: 'age_range', min: 5 },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['social'],
  },

  {
    id: 'octopus-male-contest',
    type: 'active',
    category: 'social',
    narrativeText: 'A male is spread across the mouth of a prime den, suckers gripping rock, skin cycling through dark bars and mahogany flush. Your suckers taste a female\'s chemical trace in the water. He has tasted it too.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    choices: [
      {
        id: 'grapple-rival',
        label: 'Flash dark patterns and grapple',
        description: 'Intertwine arms, pull, and overpower.',
        narrativeResult: 'You flush dark and jet forward. Arms tangle. Suckers grip and release in rapid sequence. You twist one of his arms backward. Minutes pass. His grip fails on three arms simultaneously. You wrench him free. He jets away, skin flashing pale.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'ink-retreat',
        label: 'Jet ink and retreat',
        description: 'Release ink and flee. Find another den.',
        narrativeResult: 'You release a mucus-bound ink cloud. The rival strikes the decoy. You jet backward, skin blanching white. Twenty meters away, you squeeze into a crack. The den is lost. You are whole.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'sneaker-coloring',
        label: 'Hold small. Use sneaker coloring.',
        description: 'Adopt female coloration and body posture. Slip past the guard and into the den.',
        narrativeResult: 'Your skin shifts to the pale, mottled pattern of a female. You tuck your hectocotylus out of sight. You flatten your mantle and drift forward. The rival glances at you and dismisses you. You slip past him and into the den. Your skin flushes dark once you grip the walls inside.',
        statEffects: [
          { stat: StatId.WIS, amount: 6, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'arm-damage-sub',
        chance: 0.15,
        conditions: [],
        narrativeText: 'His beak found the base of one of your arms during the grapple. A clean cut through muscle. Suckers missing. Sensation dulled. The arm will regenerate, given time.',
        footnote: 'Male octopuses frequently sustain arm damage during territorial grappling. Unlike most animals, octopuses can regenerate lost arm tissue, though the process takes weeks to months and the regenerated tissue may be less sensitive than the original.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'arm-damage', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'age_range', min: 8 },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['social', 'rival', 'territory'],
    footnote: 'Male common octopuses (Octopus vulgaris) engage in ritualized arm-wrestling contests over dens and mating access. Fights involve intertwining arms and attempting to overpower the opponent through grip strength. Smaller males frequently adopt a "sneaker" strategy, mimicking female coloration to bypass aggressive guarder males, a tactic documented across many cephalopod and fish species.',
  },

  // ════════════════════════════════════════════════
  //  REPRODUCTION & MATING
  // ════════════════════════════════════════════════

  {
    id: 'octopus-mating-display',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'Your suckers taste a receptive female\'s chemical signature in the current. She is in a den on the far side of the reef. Open ground between you.',
    statEffects: [],
    choices: [
      {
        id: 'approach-boldly',
        label: 'Approach boldly',
        description: 'Cross the reef in full display, daring rivals to challenge you.',
        narrativeResult: 'You flow across the reef in bold stripes, arms spread wide. A smaller male flattens against rock as you pass. You reach the female\'s den and extend your hectocotylus. She accepts the spermatophore.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mating-complete' },
          { type: 'spawn' },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'A larger rival attacked during the approach. His beak found your mantle.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.03 }],
        },
      },
      {
        id: 'sneaker-approach',
        label: 'Sneak as a "female mimic"',
        description: 'Adopt female coloration and patterns to slip past rival males.',
        narrativeResult: 'You shift to a female\'s mottled pattern, body flattened. A large guarding male barely glances at you. You reach the female and mate before the guard registers the deception.',
        statEffects: [
          { stat: StatId.WIS, amount: 6, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mating-complete' },
          { type: 'spawn' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 8 },
      { type: 'no_flag', flag: 'mating-complete' },
    ],
    weight: 22,
    tags: ['social', 'reproduction'],
    footnote: 'Male octopuses have been observed mimicking female color patterns to sneak past rival males and mate, a "sneaker male" strategy also seen in fish and insects.',
  },

  {
    id: 'octopus-female-mating',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A male approaches your den, skin flushed in display. He extends his third right arm toward you.',
    statEffects: [],
    choices: [
      {
        id: 'accept-mate',
        label: 'Accept the mating',
        description: 'Allow him to pass the spermatophore. You can store it until you are ready to fertilize.',
        narrativeResult: 'He extends his hectocotylus into your mantle cavity. A spermatophore passes. The male withdraws and leaves.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mating-complete' },
          { type: 'set_flag', flag: 'den-search-begun' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'reject-mate',
        label: 'Reject this male',
        description: 'Drive him away.',
        narrativeResult: 'You flash dark and lunge with arms spread. He jets backward across the reef.',
        statEffects: [
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 8 },
      { type: 'no_flag', flag: 'mating-complete' },
    ],
    weight: 22,
    tags: ['social', 'reproduction'],
  },

  {
    id: 'octopus-den-competition',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A deep crevice with steady current flowing through a crack behind it. Another female is wedged inside, chromatophores flashing dark red and white. She has not laid eggs yet either. The exposed crevice thirty meters away has sluggish flow.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'arm-wrestle-den',
        label: 'Arm-wrestle her out of the crevice',
        description: 'Better oxygen flow means more eggs hatch, but she will fight',
        narrativeResult: 'You drive arms into the crevice mouth. Suckers grip and rip free and re-attach. She is strong. You are relentless. You drag her out inch by inch. She jets away in ink. The den is yours.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'take-exposed-crevice',
        label: 'Take the exposed crevice',
        description: 'Poor water flow means fewer eggs survive, but no fight',
        narrativeResult: 'You wedge into the exposed crevice. The water barely moves here. You will have to aerate the eggs constantly with your siphon.',
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
        eventId: 'octopus-den-arm-damage-sub',
        chance: 0.15,
        narrativeText: 'She locked suckers around one of your arms and twisted with her full body weight. Muscle torn. The arm still functions but moves sluggishly.',
        footnote: '(Arm damage from den fight)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'arm-damage', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'mating-complete' },
      { type: 'no_flag', flag: 'eggs-laid' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 16,
    cooldown: 8,
    tags: ['reproduction', 'female-competition'],
    footnote: 'Female octopuses compete for optimal brooding dens. Water flow through the den is critical: it delivers oxygen to the developing eggs and prevents fungal growth. Poorly ventilated dens can lose 50% or more of eggs to suffocation.',
  },

  {
    id: 'octopus-brooding-den',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A deep, sheltered crevice. Gentle current. Stable temperature. The entrance is narrow enough to guard.',
    statEffects: [],
    choices: [
      {
        id: 'lay-eggs',
        label: 'Lay your eggs',
        description: 'Attach strings of eggs to the ceiling of the den. Begin the brooding vigil.',
        narrativeResult: 'You lay thousands of eggs in strings, attaching each strand to the ceiling with a secretion. They hang translucent, each capsule containing a developing embryo. You seal yourself inside. You will not eat again.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'eggs-laid' },
          { type: 'set_flag', flag: 'brooding' },
          { type: 'spawn' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'keep-searching',
        label: 'Keep searching for a better den',
        description: 'This one isn\'t perfect. Keep looking.',
        narrativeResult: 'You leave the crevice. The eggs inside you are heavy.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'mating-complete' },
      { type: 'has_flag', flag: 'den-search-begun' },
      { type: 'no_flag', flag: 'eggs-laid' },
    ],
    weight: 30,
    tags: ['reproduction'],
  },

  // ════════════════════════════════════════════════
  //  SENESCENCE
  // ════════════════════════════════════════════════

  {
    id: 'octopus-female-brooding-vigil',
    type: 'passive',
    category: 'health',
    narrativeText: 'Weeks without food. Your body is consuming itself. Arms thinner. Skin pale and papery. Chromatophores slow to respond. But the eggs are developing. You can see tiny eyes forming inside the capsules. You aerate them with your siphon and clean them with your arms.',
    statEffects: [
      { stat: StatId.HEA, amount: -8, label: '-HEA' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.5 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'brooding' },
    ],
    weight: 25,
    cooldown: 2,
    tags: ['health'],
    footnote: 'Female octopuses stop eating entirely after laying eggs and brood their clutch for months, aerating and cleaning the eggs until they hatch. The mother dies shortly after. Her optic gland triggers a cascade of self-destruction. This is not a choice but a biological program.',
  },

  {
    id: 'octopus-male-senescence',
    type: 'passive',
    category: 'health',
    narrativeText: 'Since mating, your appetite has vanished. Your skin hangs loose. Your arms move with less coordination. Something behind your eyes has activated a process that is shutting your body down, system by system.',
    statEffects: [
      { stat: StatId.HEA, amount: -10, label: '-HEA' },
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.WIS, amount: -5, label: '-WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'mating-complete' },
      { type: 'age_range', min: 10 },
    ],
    weight: 22,
    cooldown: 2,
    tags: ['health'],
    footnote: 'Male octopuses also die after mating, though less dramatically than females. The optic gland triggers senescence, a programmed deterioration of the body. Researchers who removed the optic gland in lab octopuses found the animals lived significantly longer and resumed eating.',
  },

  {
    id: 'octopus-eggs-hatching',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'The eggs are hatching. Thousands of paralarvae emerge from their capsules, riding the current you create with your siphon. They drift past you and out of the den. Your arms hang limp. Your skin is translucent. The last paralarvae drift into the dark water.',
    statEffects: [
      { stat: StatId.HOM, amount: 15, label: '+HOM' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'eggs-hatched' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'brooding' },
      { type: 'age_range', min: 14 },
    ],
    weight: 30,
    tags: ['reproduction'],
  },

  {
    id: 'octopus-female-death',
    type: 'passive',
    category: 'health',
    narrativeText: 'The den is empty. Your three hearts slow. Your chromatophores fade to uniform pale white. Crabs emerge from hiding around you. The current carries your scent away.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Post-brooding senescence. Body shut down after eggs hatched.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'eggs-hatched' },
    ],
    weight: 50,
    tags: ['health'],
  },

  {
    id: 'octopus-male-death',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your arms barely respond. Your skin is permanent pale white. A crab walks past you without reacting. You settle into a crevice. Your branchial hearts stop first. Then the systemic heart.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Post-mating senescence. The optic gland\'s hormonal cascade completed.' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'mating-complete' },
      { type: 'age_range', min: 14 },
    ],
    weight: 40,
    tags: ['health'],
  },

  // ════════════════════════════════════════════════
  //  ENVIRONMENTAL / SEASONAL
  // ════════════════════════════════════════════════

  {
    id: 'octopus-night-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The light fades. Your chemoreceptors sharpen in the dark water. The reef smells different at night: sleeping fish, active crabs, different chemical signatures.',
    statEffects: [],
    choices: [
      {
        id: 'hunt-aggressively',
        label: 'Hunt aggressively',
        description: 'Cover maximum ground, raiding every crevice.',
        narrativeResult: 'You flow across the reef, probing every crack with your arms. Two crabs, a sleeping fish, a handful of shrimp. Your suckers taste their chemical signatures before your eyes find them.',
        statEffects: [
          { stat: StatId.HEA, amount: 3, label: '+HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.3 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'A nocturnal predator found you in the open.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.01 }],
        },
      },
      {
        id: 'hunt-cautiously',
        label: 'Stay close to your den',
        description: 'Hunt only in familiar territory.',
        narrativeResult: 'You hunt within arm-reach of your den, grabbing passing prey and retreating. Modest haul. Close to shelter.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  {
    id: 'octopus-storm-surge',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The current surges hard. Sand and debris hammer your mantle. You grip the inside of your den with every sucker, arms braced against the walls. When the surge stops, the reef is rearranged.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    consequences: [],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
      { type: 'weather', weatherTypes: ['heavy_rain', 'blizzard'] },
    ],
    weight: 12,
    tags: ['environmental', 'seasonal'],
  },

  {
    id: 'octopus-warm-water',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The water is warm. Your gills work harder. Less oxygen per breath. The deeper reef is cooler but farther from your den.',
    statEffects: [
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['environmental', 'seasonal'],
  },

  {
    id: 'octopus-fishing-net',
    type: 'active',
    category: 'predator',
    narrativeText: 'A wall of mesh sweeps across the reef. Fish and crabs are already tangled. The net is moving toward you.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'squeeze-through',
        label: 'Squeeze through the mesh',
        description: 'Your boneless body can fit through any gap wider than your beak.',
        narrativeResult: 'You compress and slide through a gap in the mesh. Your beak scrapes nylon as you push through. You emerge on the other side.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'flee-deep',
        label: 'Jet toward deep water',
        description: 'Outrun the net by going deeper than it reaches.',
        narrativeResult: 'You jet downward along the reef wall into colder, darker water. The net passes above. You wait in the deep.',
        statEffects: [
          { stat: StatId.CLI, amount: 3, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The net caught you before you reached depth.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['danger'],
    footnote: 'Octopuses are among the few marine animals that can reliably escape fishing nets by squeezing through the mesh. Their only rigid structure is the beak. Everything else is compressible soft tissue.',
  },

  {
    id: 'octopus-exploration',
    type: 'active',
    category: 'environmental',
    narrativeText: 'Beyond your territory, unfamiliar rock formations. Your suckers taste chemical traces of prey species you do not recognize.',
    statEffects: [],
    choices: [
      {
        id: 'explore-new-area',
        label: 'Explore the unknown reef',
        description: 'Leave your territory and investigate.',
        narrativeResult: 'You cross the boundary of known ground. Arms taste unfamiliar rock. More crevices here, more crabs, fewer chemical traces of other octopuses.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.15 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stay-home',
        label: 'Stay in familiar territory',
        description: 'You know where every predator hides here.',
        narrativeResult: 'You return to your den and hunt the familiar grounds.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, duration: 2, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.05 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'first-hunt-success' },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['environmental'],
  },

  {
    id: 'octopus-arm-autonomy',
    type: 'passive',
    category: 'health',
    narrativeText: 'The arm tip severed weeks ago has been regenerating. The new growth is smaller and paler, fewer suckers. You test it against the reef. The chemoreceptors register rock, algae, the trace of a crab that passed here recently. The arm works.',
    statEffects: [
      { stat: StatId.HEA, amount: 5, label: '+HEA' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_injury' },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['health'],
    footnote: 'Octopus arms can regenerate fully after amputation, though the process takes weeks to months. Each arm contains about two-thirds of the octopus\'s neurons, and each arm can act semi-independently. A severed arm will continue to grasp and explore for hours.',
  },
  {
    id: 'octopus-vibrio-exposure',
    type: 'passive',
    category: 'health',
    narrativeText: 'The shallow water is warm. Your suckers taste a different chemistry on a small cut on one arm. A pale discoloration is spreading from the wound.',
    statEffects: [{ stat: StatId.IMM, amount: 2, label: '+IMM' }],
    consequences: [],
    choices: [],
    subEvents: [
      {
        eventId: 'octopus-vibrio-infection',
        chance: 0.14,
        narrativeText: 'The wound festers. The tissue around it is changing color and texture.',
        statEffects: [],
        consequences: [{ type: 'add_parasite', parasiteId: 'vibrio-infection' }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'no_parasite', parasiteId: 'vibrio-infection' },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['health', 'environmental'],
  },
  {
    id: 'octopus-moray-den-contest',
    type: 'active',
    category: 'environmental',
    narrativeText: 'You return to your den after a night hunt. A moray eel\'s head protrudes from the entrance, jaws working, watching you. Morays can follow an octopus into its den and are immune to most of your defenses.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'octopus-moray-ink-flush',
        label: 'Blast the den with ink',
        description: 'Jet a cloud of ink into the den opening. The irritant may drive the eel out.',
        narrativeResult: 'You jet ink directly into the den. The moray thrashes and retreats backward through a crack in the rock. Your den smells of ink, but it is yours again.',
        statEffects: [{ stat: StatId.ADV, amount: 3, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'octopus-moray-find-new',
        label: 'Find a new den',
        description: 'Abandon this one. You are vulnerable while searching.',
        narrativeResult: 'You search the reef for hours, arms probing crevices. You find one. Smaller and more exposed.',
        statEffects: [{ stat: StatId.ADV, amount: 2, label: '+ADV' }],
        consequences: [{ type: 'modify_territory', qualityChange: -10 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'octopus-moray-bite',
        chance: 0.15,
        conditions: [],
        narrativeText: 'The moray strikes as you approach. Needle teeth sink into one of your arms.',
        statEffects: [{ stat: StatId.HEA, amount: -5, label: '-HEA' }],
        consequences: [{ type: 'add_injury', injuryId: 'arm-damage', severity: 0 }],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'has_flag', flag: 'settled-on-reef' },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['confrontation', 'environmental'],
  },
  {
    id: 'octopus-warm-water-bloom',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The water has turned green. Visibility near zero. Your gills labor to extract oxygen. Your three hearts pump harder against the depleted water.',
    statEffects: [
      { stat: StatId.IMM, amount: 4, label: '+IMM' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    consequences: [{ type: 'modify_weight', amount: -1 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['common-octopus'] },
      { type: 'weather', weatherTypes: ['heat_wave'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['environmental', 'health'],
  },
];
