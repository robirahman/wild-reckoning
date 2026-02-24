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
    narrativeText: 'You drift in the plankton, a speck among millions. The Mediterranean current carries you past jellyfish tentacles and through clouds of copepods. Each day you grow a fraction larger, each day you learn what can be eaten and what eats you.',
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
    narrativeText: 'Below you, the reef beckons — rocky crevices, waving seagrass, and the scent of crabs. The current is pulling you past. This may be your only chance to settle.',
    statEffects: [],
    choices: [
      {
        id: 'settle-now',
        label: 'Settle on this reef',
        description: 'Drop out of the current and claim a crevice.',
        narrativeResult: 'You jet downward with everything you have, your tiny siphon pulsing. The current releases you. Your arms touch rock for the first time. You squeeze into a crevice barely wider than your body. Home.',
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
        narrativeResult: 'You let the current carry you onward. The reef recedes below. Somewhere ahead there may be a better place — or there may be nothing but open water.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Lost in open water. The current carried you beyond any reef.',
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
    narrativeText: 'A small shore crab sits in a sandy patch between two rocks. Its claws are up, sensing the water. You have never hunted anything this large before. Your arms twitch with anticipation.',
    statEffects: [],
    choices: [
      {
        id: 'pounce',
        label: 'Pounce',
        description: 'Engulf it with your web and pull it to your beak.',
        narrativeResult: 'You launch from your crevice in a blur of arms. The crab\'s claws snap at you but your arms are already wrapping around it, your web spreading like a parachute. You pull it to your beak and bite through the joint between carapace and abdomen. Venom flows. The crab goes still. Your first real meal.',
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
        narrativeResult: 'You watch the crab from your crevice. It wanders away eventually. Later, you find a small mussel and pry it open with your suckers. It isn\'t much, but it\'s safe.',
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
    narrativeText: 'Half a coconut shell lies on the sandy bottom, discarded by humans. It is concave, rigid, and just large enough to fit over your body. Something about it interests you.',
    statEffects: [],
    choices: [
      {
        id: 'carry-shell',
        label: 'Carry it as portable shelter',
        description: 'Hold it beneath you as you walk. Pull it over yourself when threatened.',
        narrativeResult: 'You wrap two arms around the shell and lift it. Walking on your remaining six arms, you carry it across the sand like an upside-down umbrella. When a shadow passes overhead, you pull the shell over yourself instantly. You have just used a tool — one of the first invertebrates on Earth to do so.',
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
        narrativeResult: 'You jet past the shell without a second glance. The reef provides all the shelter you need.',
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
    footnote: 'Octopuses in Indonesia have been observed carrying coconut shell halves and using them as portable shelters — a clear example of tool use, previously thought to be limited to vertebrates.',
  },

  {
    id: 'octopus-rock-tool',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A large clam is wedged into a rock crevice, its shell tightly closed. You cannot pry it open with your suckers alone. But there are loose rocks scattered nearby.',
    statEffects: [],
    choices: [
      {
        id: 'use-rock',
        label: 'Hammer it with a rock',
        description: 'Grip a stone and strike the clam shell until it cracks.',
        narrativeResult: 'You pick up a flat stone with two arms and bring it down on the clam\'s shell. Once. Twice. On the fifth strike, the shell cracks. You pry it open and feast on the soft meat inside. Problem-solving rewarded.',
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
        narrativeResult: 'You press your beak against the clam and begin the slow work of drilling through the shell with your radula, injecting digestive enzymes through the hole. It takes hours, but eventually you access the meat. Patience rewarded.',
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
    narrativeText: 'You rest on a patch of reef encrusted with coralline algae, barnacles, and sponges. The pattern is complex — dozens of colors and textures in a square meter. Your skin ripples as your chromatophores fire in sequence, each tiny muscle-controlled sac expanding to reveal its pigment.',
    statEffects: [],
    choices: [
      {
        id: 'practice-camouflage',
        label: 'Match the reef perfectly',
        description: 'Spend time honing your color and texture match.',
        narrativeResult: 'You cycle through patterns: mottled brown, stippled white, raised papillae mimicking barnacles. After several minutes of adjustments, you are indistinguishable from the reef beneath you. A fish swims directly over you without flinching. You have become invisible.',
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
        narrativeResult: 'You keep your skin in a bold pattern of dark and light — no point in hiding when you are the predator. You move across the reef with confidence.',
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
    narrativeText: 'You spot a large spider crab picking its way across a rocky outcrop. It is well-armored but slow. Its flesh would sustain you for days.',
    statEffects: [],
    choices: [
      {
        id: 'ambush-from-crevice',
        label: 'Ambush from your crevice',
        description: 'Wait for it to pass, then strike.',
        narrativeResult: 'You wait, perfectly still, your skin matching the rock. As the crab passes within arm\'s reach, you explode outward. Eight arms engulf it before its claws can react. Your beak finds the nerve cluster. The crab goes limp.',
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
        narrativeResult: 'You flow across the reef like liquid, your arms pulling you forward in a rapid crawl. The crab sees you and raises its claws, but you are faster. You engulf it from above, your web smothering its defenses.',
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
    narrativeText: 'You find a bed of mussels clinging to a submerged rock face. You spend the morning prying them open one by one with your suckers, each mussel yielding a tiny morsel of meat. It is tedious work but reliable food.',
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
    narrativeText: 'A small damselfish darts in and out of a coral head, guarding its territory. Fish are harder prey than crabs — faster, more alert. But the protein is worth the risk.',
    statEffects: [],
    choices: [
      {
        id: 'web-trap',
        label: 'Spread your web over the coral',
        description: 'Block the fish\'s escape routes and trap it.',
        narrativeResult: 'You spread your inter-arm web over the coral head like a tent, blocking every exit. The damselfish panics inside, bouncing off your arms. You close the trap and your beak does the rest.',
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
        narrativeResult: 'You turn away from the damselfish and crawl toward a sandy patch where you know crabs hide. Patience over ambition.',
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
    narrativeText: 'You have found a promising crevice in the reef rock, but the entrance is too wide — any predator could reach in and pull you out. Scattered around the entrance are shells, rocks, and broken coral fragments.',
    statEffects: [],
    choices: [
      {
        id: 'build-fortress',
        label: 'Build a fortress',
        description: 'Stack rocks and shells to narrow the entrance and create a defensive wall.',
        narrativeResult: 'Over the course of several hours, you carry rocks, shells, and coral fragments to your den entrance. You arrange them carefully with your arms, testing each piece for stability. When you are finished, only a narrow slit remains — just wide enough for your boneless body to squeeze through. You have built yourself a castle.',
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
        narrativeResult: 'You squeeze into the crevice and make yourself comfortable. It\'s exposed, but you can always jet away if something comes.',
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
    footnote: 'Octopuses are prolific builders. They arrange rocks, shells, and debris around their den entrances, and some species create "octopus gardens" — middens of shells and construction materials that become reef microhabitats.',
  },

  // ════════════════════════════════════════════════
  //  PREDATOR ENCOUNTERS
  // ════════════════════════════════════════════════

  {
    id: 'octopus-moray-encounter',
    type: 'active',
    category: 'predator',
    narrativeText: 'A moray eel slides out of a crack in the reef, its mouth gaping rhythmically as it breathes. Its eyes fix on you. Morays hunt octopuses by scent — they can follow your chemical trail into the tightest crevice.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'ink-and-jet',
        label: 'Ink cloud and jet away',
        description: 'Release a cloud of ink and blast away with your siphon.',
        narrativeResult: 'You fire a dense cloud of melanin-rich ink directly at the moray\'s face. In the same instant, you jet backward with all the force your mantle can generate. The moray lunges into the ink cloud, biting at nothing. By the time it clears, you are thirty meters away, squeezing into an unfamiliar crevice.',
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
        description: 'Become the reef. Don\'t move a muscle.',
        narrativeResult: 'You flatten yourself against the rock and your chromatophores fire in a cascade of color matching. Your skin sprouts papillae mimicking the surrounding algae. The moray slides closer, its tongue tasting the water. It passes within centimeters of your arm. You don\'t breathe. It moves on.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'The moray eel detected you despite your camouflage. Its jaws closed around your mantle.',
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
        narrativeText: 'The moray strikes as you jet away. Its teeth catch one of your trailing arms. You wrench free, leaving the tip behind. The arm tip continues to writhe on the reef floor, distracting the eel as you escape.',
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
    narrativeText: 'Shadows pass overhead — a pod of bottlenose dolphins is hunting the reef. Their echolocation clicks penetrate the water like sonar. They can find you inside your den. They can find you anywhere.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'den-deep',
        label: 'Retreat deep into your den',
        description: 'Squeeze as far back as possible and hope they pass.',
        narrativeResult: 'You compress your body into the deepest recess of your den, your soft body folding into impossible shapes. The dolphin clicks intensify, scanning the reef. One pauses near your den entrance. Then the pod moves on. You wait a long time before emerging.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'A dolphin reached into your den with its rostrum and pulled you out.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.02 }],
        },
      },
      {
        id: 'flee-open-water',
        label: 'Flee into open water',
        description: 'Jet away from the reef at maximum speed.',
        narrativeResult: 'You blast out of your den and jet across the sand flat, trailing a cloud of ink. The dolphins are faster — but they are hunting the reef, not the open sand. You keep jetting until your mantle aches.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.ADV, amount: -5, duration: 2, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'A dolphin spotted your ink trail and chased you across the open sand.',
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
    narrativeText: 'A massive conger eel emerges from the deeper reef at dusk — three meters of sinuous muscle with a gape wide enough to swallow you whole. You see it slide past your den entrance, its pale eyes scanning. You remain perfectly still, your chromatophores matching the interior of your crevice. It does not see you. This time.',
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
    narrativeText: 'A grouper is tracking you across the reef, its large mouth opening and closing in anticipation. It is gaining on you. You have one special trick left.',
    statEffects: [],
    choices: [
      {
        id: 'create-pseudomorph',
        label: 'Create an ink pseudomorph',
        description: 'Release a blob of ink mixed with mucus that holds its shape — a decoy that looks like you.',
        narrativeResult: 'You release a thick blob of ink mixed with mucus. It hangs in the water, roughly your shape and size. Simultaneously, you blanch white and jet sideways. The grouper lunges at the ink decoy, biting through the dark cloud. By the time it realizes the deception, you are gone.',
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
        narrativeResult: 'You aim your siphon and fire a water jet with everything your mantle can produce. The grouper gives chase for twenty meters before losing interest. Your mantle is sore from the effort.',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The grouper was faster than expected. Its cavernous mouth engulfed you mid-jet.',
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
    footnote: 'Octopuses can create "pseudomorphs" — ink decoys that maintain their shape in the water due to a mucus binder. Predators attack the decoy while the octopus escapes, often turning white to maximize the contrast.',
  },

  // ════════════════════════════════════════════════
  //  SOCIAL & TERRITORIAL
  // ════════════════════════════════════════════════

  {
    id: 'octopus-rival-encounter',
    type: 'active',
    category: 'social',
    narrativeText: 'Another octopus has moved into a den thirty meters from yours. You can see it sitting at its entrance, its skin dark with aggression patterns. Two octopuses on the same stretch of reef is one too many.',
    statEffects: [],
    choices: [
      {
        id: 'display-aggression',
        label: 'Display dominance',
        description: 'Raise yourself tall, darken your skin, and spread your arms wide.',
        narrativeResult: 'You rear up on your hind arms, spreading your web to maximum span. Your skin flushes dark red-brown in a dominance display. The rival responds in kind. For several minutes you face each other in a contest of size and color intensity. Eventually the rival pales and retreats into its den. This stretch of reef is yours.',
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
        narrativeResult: 'You go about your business, hunting on your side of the reef. The other octopus does the same. An uneasy coexistence settles in.',
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
    narrativeText: 'Another male has settled at the mouth of a prime den — a deep crevice beneath a flat rock, the kind of shelter a female would choose for egg-laying. He is large, his mantle swollen with muscle, his skin cycling through dark aggressive patterns: bars, stripes, and the deep mahogany flush that means he is ready to fight. He has seen you. His arms are spread wide across the rock face, suckers gripping, claiming every inch. The den behind him is worth fighting for. The female whose chemical trace led you both here is worth more.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
    ],
    choices: [
      {
        id: 'grapple-rival',
        label: 'Flash dark patterns and grapple',
        description: 'Darken your skin, spread your arms, and engage. Arm wrestling between male octopuses is a test of raw strength — intertwine arms, pull, and overpower.',
        narrativeResult: 'You flush dark — the deepest red-brown your chromatophores can produce — and jet forward. Your arms meet his in a tangle of suckers and muscle. The grappling is silent and brutal, an alien calculus of leverage and grip strength played out across eight arms apiece. You twist one of his arms backward, your suckers popping free and reattaching in rapid sequence, seeking purchase, seeking advantage. He pulls back with tremendous force and you feel your own arm stretch to its limit. Minutes pass. The reef around you is forgotten. There is only this: two soft bodies locked in a geometry of force, each trying to peel the other from the rock. At last his grip fails on three arms simultaneously and you wrench him free. He jets backward in a cloud of silt, his skin flashing pale — submission. The den is yours.',
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
        description: 'Release a cloud of ink and jet away. Live to find another den, another day.',
        narrativeResult: 'You contract your mantle and release a burst of ink — a dark, mucus-bound cloud that holds its shape in the water like a phantom octopus. The rival strikes at the decoy while you jet backward, your siphon pulsing, your skin blanching to white for maximum contrast against the dark ink. Within seconds you are twenty meters away, tucked into a crack in the reef, your hearts hammering. The den is lost. But you are whole.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'sneaker-coloring',
        label: 'Hold small — use sneaker coloring',
        description: 'Adopt female coloration and body posture. Flatten your mantle, tuck your arms, display the mottled pattern of a non-threatening female. Slip past the guard and into the den.',
        narrativeResult: 'You suppress every aggressive impulse and reshape yourself. Your skin shifts to the pale, mottled pattern of a female — the spots, the smooth texture, the passive posture. You tuck your hectocotylus out of sight and flatten your mantle. Then you drift forward, unhurried, unthreatening. The rival male glances at you and dismisses you — another female, no concern of his. You slip past him and into the den. By the time he realizes the deception, you are already inside, your suckers gripping the walls, your skin flushing triumphant dark. Intelligence over brute force.',
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
        narrativeText: 'During the grapple, his beak found the base of one of your arms. You felt the chitin slice through muscle — a clean, cold cut that barely registered until you pulled free and saw the arm trailing a ribbon of pale tissue. The wound has already sealed itself, the muscles clamping shut with involuntary precision. But the damage is done. Suckers are missing. Sensation is dulled. The arm will regenerate, given time. Your kind has that grace. But time, for an octopus, is the one thing always in short supply.',
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
    footnote: 'Male common octopuses (Octopus vulgaris) engage in ritualized arm-wrestling contests over dens and mating access. Fights involve intertwining arms and attempting to overpower the opponent through grip strength. Smaller males frequently adopt a "sneaker" strategy, mimicking female coloration to bypass aggressive guarder males — a tactic documented across many cephalopod and fish species.',
  },

  // ════════════════════════════════════════════════
  //  REPRODUCTION & MATING
  // ════════════════════════════════════════════════

  {
    id: 'octopus-mating-display',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'You detect the chemical signature of a receptive female in the water current. She is in a den on the far side of the reef. To reach her, you must cross open ground — and any other males in the area will have detected the same signal.',
    statEffects: [],
    choices: [
      {
        id: 'approach-boldly',
        label: 'Approach boldly',
        description: 'Cross the reef in full display, daring rivals to challenge you.',
        narrativeResult: 'You flow across the reef in a display of bold stripes, your arms spread wide. A smaller male sees you coming and flattens himself against the rock, deferring. You reach the female\'s den and extend your hectocotylus — your modified mating arm. She accepts the spermatophore. The act is brief and businesslike.',
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
          cause: 'A larger rival male attacked you during your approach. His beak found your mantle.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.03 }],
        },
      },
      {
        id: 'sneaker-approach',
        label: 'Sneak as a "female mimic"',
        description: 'Adopt female coloration and patterns to slip past rival males.',
        narrativeResult: 'You change your skin to mimic a female\'s mottled pattern and flatten your body. A large male guarding the approach barely glances at you as you slip past. You reach the female and quickly mate before the guard realizes the deception. Cunning over brawn.',
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
    footnote: 'Male octopuses have been observed mimicking female color patterns to sneak past rival males and mate — a "sneaker male" strategy also seen in fish and insects.',
  },

  {
    id: 'octopus-female-mating',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A male octopus approaches your den, his skin flushed in a bold display. He extends his third right arm — the hectocotylus — toward you. This is the offer. After this, everything changes.',
    statEffects: [],
    choices: [
      {
        id: 'accept-mate',
        label: 'Accept the mating',
        description: 'Allow him to pass the spermatophore. You can store it until you are ready to fertilize.',
        narrativeResult: 'You allow the male to extend his hectocotylus into your mantle cavity. He passes a spermatophore — a packet of sperm you will store in your oviducal gland. The male withdraws and leaves quickly. You will choose when to fertilize your eggs. You have what you need.',
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
        description: 'Drive him away. You can afford to be selective.',
        narrativeResult: 'You flash a dark aggressive pattern and lunge at the male with your arms spread. He jets backward, startled, and retreats across the reef. You will wait for a larger, stronger male.',
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
    id: 'octopus-brooding-den',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'You have found a deep, sheltered crevice — perfect for laying your eggs. The water flow is gentle, the temperature is stable, and the entrance is narrow enough to guard. This is where your story ends and your offspring\'s begins.',
    statEffects: [],
    choices: [
      {
        id: 'lay-eggs',
        label: 'Lay your eggs',
        description: 'Attach strings of eggs to the ceiling of the den. Begin the brooding vigil.',
        narrativeResult: 'Over several days, you lay thousands of eggs in delicate strings, attaching each strand to the ceiling of the den with a secretion. The eggs hang like tiny translucent grapes, each one containing a developing embryo. You seal yourself inside. You will not eat again. For the next four months, you will guard these eggs, aerating them with your siphon, cleaning them with your arms, and slowly dying.',
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
        narrativeResult: 'You leave the crevice and continue searching the reef. The eggs inside you are getting heavier. You need to lay them soon.',
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
    narrativeText: 'You have not eaten in weeks. Your body is consuming itself to fuel the endless work of egg care. Your arms are thinner, your skin is pale and papery, and your chromatophores no longer fire with the same precision. But the eggs are developing well. You can see tiny eyes forming inside the translucent capsules. You are dying so they can live. This is the contract.',
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
    footnote: 'Female octopuses stop eating entirely after laying eggs and brood their clutch for months, aerating and cleaning the eggs until they hatch. The mother dies shortly after — her optic gland triggers a cascade of self-destruction. This is not a choice but a biological program.',
  },

  {
    id: 'octopus-male-senescence',
    type: 'passive',
    category: 'health',
    narrativeText: 'Something is wrong and you know it. Since mating, your body has been changing. Your appetite has vanished. Your skin hangs loose. Your arms move with less coordination. The optic gland behind your eyes has activated a hormonal cascade that is systematically shutting down your body. You are not sick. You are running a program written millions of years ago.',
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
    footnote: 'Male octopuses also die after mating, though less dramatically than females. The optic gland triggers senescence — a programmed deterioration of the body. Researchers who removed the optic gland in lab octopuses found the animals lived significantly longer and resumed eating.',
  },

  {
    id: 'octopus-eggs-hatching',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'The eggs are hatching. Thousands of tiny paralarvae are emerging from their capsules, riding the current you create with your siphon out of the den and into the open water. They are specks — each one carrying the complete blueprint for an animal that can change color, solve puzzles, and squeeze through any gap wider than its beak. You have given them everything. Your arms hang limp. Your skin is translucent. The last paralarvae drift past you and into the Mediterranean night. You have fulfilled the only purpose your biology recognizes.',
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
    narrativeText: 'The den is empty now. The eggs have hatched and your paralarvae are somewhere in the plankton, beginning their own brief stories. Your body has nothing left to give. Your three hearts slow. Your chromatophores fade to a uniform pale white. The reef continues without you — crabs emerge from hiding, fish resume their patrols, and somewhere above, a paralarva that carries your genes is drifting toward a reef it has never seen. You close your eyes.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Post-brooding senescence. You died guarding your eggs — as every octopus mother has for 300 million years.' },
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
    narrativeText: 'You have not eaten in weeks. Your arms barely respond. You drift across the reef like a ghost of yourself, your skin a permanent pale white. A crab walks past you without fear. You settle into a crevice — not your den, just a place — and your hearts slow one by one. First the two branchial hearts. Then, finally, the systemic heart. The current carries your scent away.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Post-mating senescence. The optic gland\'s hormonal cascade completed its work.' },
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
    narrativeText: 'Night falls on the reef. The diurnal fish retreat to their sleeping crevices and the nocturnal hunters emerge. You are one of them. In the darkness, your chemoreceptors are more valuable than eyes. The reef is a different world at night.',
    statEffects: [],
    choices: [
      {
        id: 'hunt-aggressively',
        label: 'Hunt aggressively',
        description: 'Cover maximum ground, raiding every crevice.',
        narrativeResult: 'You flow across the reef in a systematic search pattern, probing every crack and crevice with your arms. Two crabs, a sleeping fish, and a handful of shrimp fall to your beak. It is a productive night.',
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
        narrativeResult: 'You hunt within arm\'s reach of your den, darting out to grab passing prey and retreating immediately. The haul is modest but you stay safe.',
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
    narrativeText: 'A storm passes over the Mediterranean. Waves surge across the reef, tearing loose anything not firmly attached. You grip the inside of your den with every sucker, your arms braced against the walls as the current tries to rip you free. Sand and debris hammer your exposed mantle. When the storm passes, the reef is rearranged — new crevices have opened, old ones have collapsed.',
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
    narrativeText: 'The summer heat has raised the water temperature on the shallow reef. Warmer water holds less oxygen. You find yourself breathing harder, your gills working overtime. The deeper reef offers cooler water, but it is farther from your den and your hunting grounds.',
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
    narrativeText: 'A fishing net descends from above — a wall of nylon mesh sweeping across the reef. Crabs and fish are already tangled in it. The net is moving slowly but inexorably toward you.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'squeeze-through',
        label: 'Squeeze through the mesh',
        description: 'Your boneless body can fit through any gap wider than your beak.',
        narrativeResult: 'You compress your body and slide through a gap in the mesh that no fish could dream of passing through. Your beak — the only hard part of your body — scrapes against the nylon as you push through. You emerge on the other side, free.',
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
        narrativeResult: 'You jet downward along the reef wall, descending into colder, darker water. The net passes above you, dragging its catch toward the surface. You wait in the deep until the danger passes.',
        statEffects: [
          { stat: StatId.CLI, amount: 3, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The net caught you before you could escape to depth. Hauled aboard a fishing boat.',
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
    footnote: 'Octopuses are among the few marine animals that can reliably escape fishing nets by squeezing through the mesh. Their only rigid structure is the beak — everything else is compressible soft tissue.',
  },

  {
    id: 'octopus-exploration',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The reef extends beyond your familiar territory. You can see unfamiliar rock formations, new coral heads, and different prey species in the distance. The unknown calls to you.',
    statEffects: [],
    choices: [
      {
        id: 'explore-new-area',
        label: 'Explore the unknown reef',
        description: 'Leave your territory and investigate.',
        narrativeResult: 'You venture across the boundary of your known territory, arms tasting unfamiliar rock. The new section of reef is rich — more crevices, more crabs, fewer competitors. You memorize the route back.',
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
        description: 'You know where every predator hides here. That counts for something.',
        narrativeResult: 'You return to your den and hunt the familiar grounds. No surprises, but no dangers either.',
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
    narrativeText: 'One of your arms, severed weeks ago by a moray eel, has been regenerating. The new tip is smaller and paler than the original, with fewer suckers, but it is functional. Each sucker contains hundreds of chemoreceptors. You test the new arm against the reef, tasting the rock, the algae, the chemical traces of prey. It works. Your body has rebuilt what was lost.',
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
    footnote: 'Octopus arms can regenerate fully after amputation, though the process takes weeks to months. Each arm contains about two-thirds of the octopus\'s neurons, and each arm can act semi-independently — a severed arm will continue to grasp and explore for hours.',
  },
];
