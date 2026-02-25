import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';
import { allEvents as sharedEvents } from '../../events/index';

const deerEvents: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-acorn-mast-year',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The oaks have outdone themselves this autumn. Acorns blanket the forest floor in a dense, copper-brown carpet that crunches beneath your hooves with every step. You have never seen so many — the trees have synchronized their production in a mast year, overwhelming every squirrel, jay, and weevil that might consume them. You lower your head and eat with a steady, rhythmic crunching, the tannin-rich meat filling your gut with a warmth that will carry you deep into winter. Fat is building along your ribs and haunches, an invisible armor against the cold months ahead.',
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 4 },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 14,
    cooldown: 8,
    tags: ['foraging', 'food', 'seasonal'],
  },

  {
    id: 'deer-mushroom-patch',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'A cluster of mushrooms pushes up through the leaf litter at the base of a rotting stump — pale caps glistening with morning dew, their earthy scent cutting through the dampness of the forest floor. You nose at them cautiously. Fungi are a delicacy your body craves, rich in phosphorus and trace minerals that the browse cannot provide. You bite into the first cap and the flavor is clean and loamy, like eating the forest itself.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
      { stat: StatId.IMM, amount: -3, label: '-IMM' },
    ],
    subEvents: [
      {
        eventId: 'deer-mushroom-toxicity',
        chance: 0.12,
        conditions: [],
        narrativeText:
          'A sharp, metallic taste hits the back of your throat too late. Your stomach clenches and a wave of nausea rolls through you. The mushrooms were not what they appeared — a toxic species mimicking the edible ones with cruel precision. Your liver begins to process what your instincts failed to catch.',
        footnote: '(Poisoned by toxic mushroom)',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['foraging', 'food', 'fungi'],
  },

  {
    id: 'deer-apple-orchard',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The smell drifts to you on the evening breeze — sweet, fermenting, irresistible. Through the tree line you can see them: rows of apple trees heavy with fruit, some already fallen and splitting open in the grass. A farmhouse sits at the edge of the orchard, its windows lit with amber light, a dog chained near the porch. The apples are close, almost within reach. But this is human ground, and humans are unpredictable in their cruelty.',
    statEffects: [],
    choices: [
      {
        id: 'raid-orchard',
        label: 'Slip into the orchard and feed',
        description: 'Rich food, but the dog may bark and the farmer may come',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'raided-orchard' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'The farmer was waiting with a rifle.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-orchard',
        label: 'Turn back to the forest',
        description: 'Safer, but your stomach aches with missed opportunity',
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
    weight: 9,
    cooldown: 8,
    tags: ['foraging', 'food', 'human', 'danger'],
  },

  {
    id: 'deer-corn-field-raid',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The cornfield stretches out under the moonlight like a dark, rustling sea. The stalks are tall enough to hide you completely, and the ears are fat with ripe kernels — a concentration of calories that the forest cannot match. You can hear other deer already inside, the soft tearing of husks and the wet crunch of feeding. But corn in quantity can acidify your rumen and bloat your gut until it presses against your lungs.',
    statEffects: [],
    choices: [
      {
        id: 'gorge-corn',
        label: 'Gorge on the corn',
        description: 'Eat your fill — the calories are extraordinary, but the risk of acidosis is real',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
          { type: 'set_flag', flag: 'corn-gorge' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'graze-cautiously',
        label: 'Graze cautiously and leave early',
        description: 'Take what your rumen can handle, then slip away before dawn',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 10,
    cooldown: 7,
    tags: ['foraging', 'food', 'human', 'nocturnal'],
  },

  {
    id: 'deer-clover-meadow',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'You step out of the tree line and into a meadow thick with white clover. The blossoms nod in the breeze like a thousand small bells, and the air hums with the industry of bees. You lower your head into the fragrant carpet and begin to graze. The clover is tender and sweet, each mouthful a small perfection — protein-rich, easily digestible, the ideal food for a ruminant in {{time.season}}. The tension in your flanks softens as your gut fills with something genuinely nourishing. For a while there is nothing in the world but sunlight and clover and the deep satisfaction of a body being fed exactly what it needs.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 2 },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'food', 'peaceful'],
  },

  {
    id: 'deer-browse-line',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'The forest tells a story of too many mouths. Every sapling within reach has been stripped of its leaves, every low-hanging branch gnawed to a pale, barkless nub. A sharp horizontal line divides the canopy — green abundance above, bare wood below — as precise as if drawn with a ruler. This is the browse line, and it marks the exact height a hungry deer can reach. You stretch your neck upward, lips working at a twig just beyond your reach, and come away with nothing. The easy food is gone. Competition is etched into the architecture of this forest.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter', 'spring'] },
    ],
    weight: 11,
    cooldown: 6,
    tags: ['foraging', 'food', 'competition'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-coyote-pack',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The yipping starts at dusk — a ragged chorus threading through the trees from three directions at once. Coyotes. A pack of them, working in relay, their golden eyes catching the last light as they ghost through the understory. They are not after you. They are after the fawns, testing the edges of the group, probing for the young, the slow, the separated. One darts in and snaps at a fawn before melting back into the shadows. The doe beside you stamps her front hoof, a sharp crack of warning against the frozen ground.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-coyotes',
        label: 'Flee with the herd',
        description: 'Run and hope the pack tires before you do',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The coyote pack ran you into a fence line and brought you down.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'defend-fawns',
        label: 'Stand and defend with hooves',
        description: 'A deer can kill a coyote with a well-placed kick, but there are many of them',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The pack overwhelmed you while you stood your ground.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 9,
    cooldown: 7,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-bobcat-stalk',
    type: 'passive',
    category: 'predator',
    narrativeText:
      'A prickling sensation runs down your spine — the ancient, wordless alarm that means you are being watched. You freeze, ears swiveling, nostrils flared. Nothing moves. Then you see it: a bobcat, motionless on a low oak limb not twenty yards away, its tufted ears flattened against its skull, its amber eyes locked onto you with the focused intensity of a coiled spring. It is too small to take a healthy adult deer, and it seems to know it. For a long, electric moment you stare at each other across the killing distance. Then the cat shifts its gaze to something smaller in the undergrowth, and you exhale a breath you did not know you were holding.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-eagle-fawn-threat',
    type: 'active',
    category: 'predator',
    narrativeText:
      'A shadow slides across the clearing — vast, silent, and purposeful. You look up and your blood goes cold. A golden eagle is circling low, its wingspan wider than you are long, its talons the size of a grown man\'s hand. It is not looking at you. It is looking at your fawn, small and spotted and utterly exposed in the open grass. The eagle tilts, adjusts, begins its descent. You have seconds.',
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'shield-fawn',
        label: 'Stand over the fawn and rear up',
        description: 'Make yourself as large as possible — eagles avoid large targets',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'flee-with-fawn',
        label: 'Bolt for the tree cover',
        description: 'Run and hope the fawn follows — the canopy will protect you',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'has-fawns' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 7,
    cooldown: 10,
    tags: ['predator', 'danger', 'fawn'],
  },

  {
    id: 'deer-hunter-season',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The forest has changed. Vehicles line the logging roads at dawn. Strange, acrid smells drift on the wind — gun oil, tobacco, synthetic urine meant to smell like yours. Blaze orange moves between the trees like slow fire. It is hunting season, and every instinct in your body is screaming. You hear a sharp crack echo through the hardwoods — a rifle shot, perhaps a half mile away. Then silence. Then another. The woods are a killing ground now, and you are the quarry.',
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'freeze-hunter',
        label: 'Freeze and hold perfectly still',
        description: 'Your camouflage is your best weapon — movement draws the eye',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.08,
          cause: 'The hunter spotted you through the scope. A single shot, behind the shoulder.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'bolt-hunter',
        label: 'Bolt at full speed through the timber',
        description: 'A running deer is hard to hit, but the noise gives away your position',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'The hunter led you perfectly. You never heard the shot.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['predator', 'danger', 'human', 'seasonal'],
  },

  {
    id: 'deer-feral-dog-pack',
    type: 'active',
    category: 'predator',
    narrativeText:
      'They come out of the suburban fringe at a loping run — three feral dogs, lean and scarred, their domesticated heritage twisted into something lawless. They do not hunt with the calculated patience of coyotes or the ambush precision of a cat. They hunt with the chaotic enthusiasm of animals that kill for sport as much as hunger. One is a German shepherd mix, heavy-jawed and fast. The others flank wide, tongues lolling, eyes bright with predatory joy. They have your scent and they are closing.',
    statEffects: [
      { stat: StatId.TRA, amount: 14, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'sprint-dogs',
        label: 'Sprint for the deep woods',
        description: 'You are faster than any dog in a straight line — but the terrain must cooperate',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The dogs ran you into a wire fence. You could not clear it in time.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'turn-fight-dogs',
        label: 'Turn and fight with your forefeet',
        description: 'A desperate gamble — your hooves are sharp but they outnumber you',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'The dogs pulled you down. They did not kill cleanly.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger', 'human'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-bachelor-group',
    type: 'passive',
    category: 'social',
    narrativeText:
      'You fall in with a loose band of bucks moving through the summer hardwoods — five of them, antlers still sheathed in velvet, their movements languid and companionable. There is no aggression here, not yet. The rut is months away and testosterone levels are low, so the hierarchy is casual, maintained by nothing more than body language and the memory of last autumn. You spar lightly with a young fork-horn, antlers clacking with the hollow sound of bone on bone, neither of you pressing the advantage. This is practice, not war. The brotherhood will shatter when the does come into estrus, but for now it holds, warm and uncomplicated.',
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'no_flag', flag: 'rut-active' },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['social', 'herd', 'seasonal'],
  },

  {
    id: 'deer-doe-hierarchy',
    type: 'active',
    category: 'social',
    narrativeText:
      'The doe steps into your feeding area with deliberate confidence, her ears pinned flat, her front hoof raised in the universal gesture of dominance among your kind. She is older than you, heavier, and she has wintered here longer. The hierarchy among does is matrilineal and absolute — your mother\'s rank determines your starting position, and everything after that must be earned with confrontation. She strikes at you with her foreleg, a sharp, downward blow aimed at your shoulder. The stakes are higher than food: dominant does claim the densest thickets for fawning — the cover that hides newborns from coyotes and bobcats. Subordinate does are pushed to open fields and forest edges where fawns are found and killed within days.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'submit-doe',
        label: 'Lower your head and yield',
        description: 'Accept subordinate status — marginal fawning cover, lower fawn survival',
        narrativeResult:
          'You drop your ears and turn away, accepting the blow across your shoulder without retaliation. She watches you go with flat, dominant eyes. You will eat after she finishes, bed where she does not want to bed, and when spring comes, your fawns will be born in the open margins where predators patrol. The best cover belongs to her and her daughters.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'challenge-doe',
        label: 'Rear up and strike back',
        description: 'Win dominant status — best fawning thickets, higher fawn survival',
        narrativeResult:
          'You rear onto your hind legs and strike back, your forelegs hammering down at her head and shoulders. She rears to meet you and you clash — hooves cracking against bone and hide, ears flat, teeth bared. The fight is brutal and graceless, two does battering each other with foreleg strikes and body slams. You land a blow squarely on her shoulder that staggers her, and press the advantage with another, and another, until she breaks and trots away with her head low. The hierarchy has shifted. The best fawning cover is yours.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'challenged-doe-hierarchy' },
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-doe-foreleg-strike-sub',
        chance: 0.15,
        narrativeText:
          'Her foreleg comes down hard on your ribs — a sharp, cracking impact that drives the air from your lungs. You feel something give beneath the blow, cartilage or bone flexing past its limit.',
        footnote: '(Foreleg strike injury)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'doe-foreleg-strike', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 9,
    cooldown: 8,
    tags: ['social', 'herd', 'hierarchy', 'female-competition'],
  },

  {
    id: 'deer-fawn-play',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The fawns are playing. They sprint in wide, ecstatic circles through the meadow, their spotted coats flashing in the dappled light, legs splaying at improbable angles on every turn. One leaps straight into the air for no reason at all — a vertical explosion of joy that sends it tumbling into the tall grass. Another chases a butterfly with such single-minded intensity that it runs directly into your flank and bounces off, startled, before resuming the chase without pause. You watch them with something that is not quite thought but feels like recognition. The world is briefly, entirely good.',
    statEffects: [
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
      { type: 'has_flag', flag: 'has-fawns' },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'psychological', 'fawn'],
  },

  {
    id: 'deer-territorial-scrape',
    type: 'active',
    category: 'social',
    narrativeText:
      'The urge is chemical and irresistible. You find a low-hanging branch at the edge of a trail and hook it with your antler tines, twisting until the bark peels away and the raw wood beneath is exposed. Then you lower your head and paw at the earth, scraping the leaves down to bare soil in a rough oval. You urinate into the scrape, letting the liquid run over the tarsal glands on your hind legs — dark, oily glands that broadcast your identity, your fitness, your intent — into the damp earth. This is your signature, written in chemistry. Every deer that passes will read it. {{npc.rival.name}} will know you were here.',
    statEffects: [
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'territorial-scrape-active' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['social', 'territorial', 'rut'],
  },

  {
    id: 'deer-herd-alarm',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The snort cuts through the evening stillness like a blade — a single, explosive exhalation from a doe at the far edge of the clearing. Her tail snaps upright, the white underside flashing like a semaphore flag, and instantly every deer in the group mirrors the signal. Tails up. Heads high. Bodies rigid with attention. You do not know what she detected — a scent, a sound, a shadow that moved wrong — but her alarm is your alarm now, passed through the herd at the speed of instinct. You stamp your front hoof once, twice, adding your voice to the warning, and then the group bolts as a single organism, white tails bouncing through the twilight like a string of lanterns retreating into the dark.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'herd', 'alarm'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-antler-velvet',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The itching began weeks ago — a maddening, bone-deep sensation at the tops of your pedicles where last year\'s antlers fell away. Now the new growth is unmistakable. Soft, warm knobs of tissue are pushing upward, sheathed in velvet skin laced with blood vessels that pulse visibly beneath the surface. The antlers will grow faster than any other mammalian bone — up to half an inch per day, fueled by a torrent of calcium and phosphorus stripped from your own skeleton. Your ribs will weaken to build your crown. By autumn, these nubs will be hardened weapons capable of puncturing hide and snapping bone. But for now they are tender, fragile, and exquisitely sensitive to every bump and branch.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'antlers-growing' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'antlers-growing' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['seasonal', 'health', 'antler'],
  },

  {
    id: 'deer-summer-flies',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The heat brings them in clouds — deer flies, horse flies, bot flies, and the ever-present ticks that crawl up through the grass and latch onto the thin skin behind your ears and between your legs. You twitch your skin in rippling waves, stamp your hooves, flick your ears in a ceaseless, futile battle against the swarm. A deer fly opens a neat incision on your flank and drinks from the welling blood. You swing your head to bite at it and another lands on your rump. They are relentless, mindless, and they will not stop until the first frost kills them.',
    statEffects: [
      { stat: StatId.IMM, amount: 5, label: '+IMM' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.CLI, amount: 3, label: '+CLI' },
    ],
    subEvents: [
      {
        eventId: 'deer-tick-infestation',
        chance: 0.20,
        conditions: [
          { type: 'no_parasite', parasiteId: 'deer-tick' },
        ],
        narrativeText:
          'Several black-legged ticks have burrowed into the soft skin behind your ears, their mouthparts cemented in place with a biological adhesive. They will feed for days, swelling to the size of grapes, and what they carry in their gut — Borrelia, Anaplasma, Babesia — is far more dangerous than the feeding itself.',
        footnote: '(Infested with deer ticks)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'deer-tick', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 14,
    cooldown: 5,
    tags: ['seasonal', 'health', 'parasite'],
  },

  {
    id: 'deer-autumn-rut',
    type: 'active',
    category: 'seasonal',
    narrativeText:
      'It begins in the shortening days, a hormonal wildfire that burns through every cell. Your neck swells until it is nearly as thick as your barrel. The velvet on your antlers dries, cracks, and peels away in bloody ribbons that you scrub against tree trunks until the bone beneath gleams white and hard. You stop eating. Sleep becomes an afterthought. Every waking moment is consumed by a single, overwhelming imperative: find does, fight rivals, breed. The rut has seized you, and you are no longer entirely yourself. You are something older, fiercer, and far more reckless.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rut-active' },
      { type: 'remove_flag', flag: 'antlers-growing' },
      { type: 'modify_weight', amount: -4 },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-exhaustion',
        chance: 0.25,
        conditions: [
          { type: 'stat_above', stat: StatId.HOM, threshold: 60 },
        ],
        narrativeText:
          'You have been on your feet for three days without eating or resting. Your ribs are beginning to show through your swollen neck. The rut is burning through your fat reserves at a ruinous rate, and winter is coming.',
        footnote: '(Rut exhaustion)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'rut-active' },
      { type: 'age_range', min: 18 },
    ],
    weight: 22,
    tags: ['seasonal', 'rut', 'mating'],
  },

  {
    id: 'deer-winter-yard',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The snow is hip-deep now and still falling. Travel through open ground has become impossible — each step plunges you to your chest, burning calories you cannot afford to spend. But here, beneath the dense canopy of a hemlock and cedar stand, the snow is shallow, packed down by the hooves of dozens of deer who have gathered in this traditional wintering area. A deer yard. The trees block the wind and hold the snow on their branches, creating a sheltered maze of packed trails that connect feeding areas to bedding sites. You are not alone — the yard is crowded with does, fawns, and young bucks, all sharing body heat and the diminished browse. It is not comfort, exactly. But it is survival.',
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'wintering-in-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
      { type: 'no_flag', flag: 'wintering-in-yard' },
    ],
    weight: 18,
    tags: ['seasonal', 'weather', 'herd'],
  },

  // Rut ends — clears rut flags so the cycle resets each year
  {
    id: 'deer-rut-ends',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The frenzy is over. The swelling in your neck is subsiding, the obsessive energy draining away like water from a cracked vessel. You are gaunt — ribs visible beneath loose hide, haunches wasted from weeks of fighting and pacing and refusing to eat. The does have scattered back to their matrilineal groups, carrying whatever will come of this season inside them. Your antlers feel heavy and purposeless now, the bone already beginning the slow chemical dissolution that will drop them into the snow by February. The rut took everything you had. Now winter will decide if it was enough.',
    statEffects: [
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.ADV, amount: -8, label: '-ADV' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'rut-active' },
      { type: 'remove_flag', flag: 'fought-rut-rival' },
      { type: 'remove_flag', flag: 'lost-rut-contest' },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['winter'] },
      { type: 'has_flag', flag: 'rut-active' },
    ],
    weight: 25,
    tags: ['seasonal', 'rut'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-forest-fire',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'You smell it before the sky turns — smoke, acrid and thickening, rolling through the understory in low, grey waves that sting your eyes and coat the back of your throat. Then you see the glow. A line of orange fire is moving through the forest floor, consuming the leaf litter and dried brush with a sound like tearing fabric. Embers spiral upward on thermal drafts, seeding new fires in the canopy ahead. The heat is building fast, pressing against your face like an open furnace. Every animal in the forest is running. You must choose your direction.',
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
    ],
    choices: [
      {
        id: 'flee-downhill',
        label: 'Flee downhill toward the creek',
        description: 'Water may stop the fire, but the valley could trap smoke',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The fire crowned and jumped the creek. The smoke was inescapable.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-crosswind',
        label: 'Run crosswind to flank the fire',
        description: 'A longer escape, but you avoid running into the head of the blaze',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'A wind shift pushed the fire line across your escape route.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 4,
    cooldown: 20,
    tags: ['environmental', 'danger', 'fire'],
  },

  {
    id: 'deer-flooding-creek',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'The creek that you crossed yesterday at ankle depth is unrecognizable. Three days of rain have turned it into a churning, brown torrent that has swallowed its banks and is clawing at the bases of the sycamores. Debris races past — branches, fence posts, a child\'s plastic bucket spinning in the foam. Your usual crossing is gone, submerged beneath four feet of fast water. The best browse is on the other side, and you can see the tips of the dogwood shoots swaying in the wind over there, tantalizingly close.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'swim-flood',
        label: 'Swim across',
        description: 'You are a strong swimmer, but the current is powerful and the water is frigid',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.CLI, amount: 5, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The current swept you into a submerged deadfall. You could not surface.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-floodwater',
        label: 'Wait for the water to recede',
        description: 'Patience, but browse is scarce on this bank',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'autumn'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'water', 'danger'],
  },

  {
    id: 'deer-ice-storm',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The freezing rain begins at nightfall and does not stop. By morning, every branch, twig, and blade of grass is sheathed in a crystal armor of ice that catches the pale winter light and throws it back in blinding fractals. The forest is beautiful and utterly inhospitable. The browse you depend on is locked beneath a glaze harder than your teeth can crack. You scrape at a frozen dogwood branch with your lower incisors and come away with nothing but chipped enamel and a mouthful of ice. Your hooves slip on the glazed ground with every step. Somewhere in the distance, a tree limb snaps under the weight of the ice and crashes to the forest floor with a sound like breaking glass.',
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 10,
    tags: ['environmental', 'weather', 'seasonal'],
  },

  {
    id: 'deer-fallen-tree-shelter',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'A massive oak has fallen across the hillside, its root plate torn from the earth in some long-ago storm, creating a sheltered hollow beneath the trunk where the wind cannot reach. The ground is dry here, insulated by a thick mattress of accumulated leaves, and the trunk above blocks the rain and snow like a natural roof. You fold your legs beneath you and settle into the hollow, your body heat slowly warming the enclosed space. The forest creaks and groans around you, but in this small refuge the air is still. You chew your cud with the meditative slowness of an animal that has, for the moment, found something close to safety.',
    statEffects: [
      { stat: StatId.CLI, amount: -6, label: '-CLI' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [],
    weight: 9,
    cooldown: 5,
    tags: ['environmental', 'shelter', 'rest'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-scout-winter-yard',
    type: 'active',
    category: 'migration',
    narrativeText:
      'The first hard frost has come and gone, and something in the air — the angle of the light, the smell of dead leaves, a barometric pressure your body reads but your mind cannot name — tells you it is time to move. The summer range is emptying. You need to find the wintering area, the dense conifer stand where generations of deer have weathered the deep snow. You set off alone, nose to the wind, following a trail of memory and scent that your mother walked before you, and her mother before her.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'scouting-winter-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'scouting-winter-yard' },
      { type: 'no_flag', flag: 'wintering-in-yard' },
    ],
    weight: 15,
    cooldown: 12,
    tags: ['migration', 'seasonal'],
  },

  {
    id: 'deer-travel-hazards',
    type: 'active',
    category: 'migration',
    narrativeText:
      'The migration route crosses a two-lane highway at the bottom of a valley. You stand at the tree line, ears forward, watching the headlights sweep past in pairs. The road smells of tar and diesel and death — you can see the dark stain on the asphalt where another deer did not make it across. The gap between cars is narrow and unpredictable. The forest on the other side is dark and welcoming, barely fifty yards away. It might as well be fifty miles.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-road',
        label: 'Cross the road now',
        description: 'Sprint across during a gap in traffic',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'A vehicle struck you at highway speed. The driver never saw you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'wait-dawn',
        label: 'Wait for dawn when traffic thins',
        description: 'Safer, but you lose time and remain exposed',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'An early commuter caught you mid-crossing at dawn.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'scouting-winter-yard' },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['migration', 'danger', 'human'],
  },

  {
    id: 'deer-spring-return',
    type: 'passive',
    category: 'migration',
    narrativeText:
      'The snow is retreating. Patches of bare earth appear on south-facing slopes, dark and wet and fragrant with the promise of new growth. The deer yard that sheltered you through the worst of winter is thinning out — does are leaving in small groups, drawn back toward their summer ranges by the same invisible compass that brought them here. You feel it too, the pull northward, uphill, toward the open meadows where the first green shoots are already pushing through the snowmelt. You are thinner than you were in autumn, your ribs visible beneath your dull winter coat, but you are alive. The worst is over. You step out of the conifer canopy and into the strengthening sun, and the warmth on your back feels like forgiveness.',
    statEffects: [
      { stat: StatId.CLI, amount: -5, label: '-CLI' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'wintering-in-yard' },
      { type: 'remove_flag', flag: 'scouting-winter-yard' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring'] },
      { type: 'has_flag', flag: 'wintering-in-yard' },
    ],
    weight: 20,
    tags: ['migration', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  // Rut competition — healthy antlers
  {
    id: 'deer-rut-competition',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'You hear him before you see him — the guttural grunt-wheeze of a rival buck, a sound that is part challenge, part threat, part involuntary expression of hormonal fury. He steps out of the timber and you see his rack: wide, heavy-beamed, with long tines that catch the autumn light like polished bone. He is as large as you, perhaps larger, and he is not going to back down. The does are watching from the ridge above, their dark eyes tracking both of you with the calm appraisal of animals who will mate with whichever one is left standing. {{npc.rival.name}} lowers his head and the antlers come forward like a crown of spears.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'fight-rival-buck',
        label: 'Lower your antlers and charge',
        description: 'Lock antlers and fight for breeding rights — the loser may not walk away',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'Your antlers locked with his and neither of you could disengage. You both died slowly.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'retreat-rival-buck',
        label: 'Turn and retreat',
        description: 'Yield the does — survive to breed another year',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'lost-rut-contest' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-antler-injury',
        chance: 0.20,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'The impact snapped one of your brow tines clean off, and a gash above your eye is bleeding freely into the matted fur of your face. The fight was won, but the cost is written in bone and blood.',
        footnote: '(Antler tine broken in rut combat)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'antler-break', severity: 0, bodyPart: 'right antler' },
        ],
      },
      {
        eventId: 'deer-rut-puncture',
        chance: 0.25,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'You did not feel it during the fight — adrenaline is a powerful anesthetic — but now, as the rival retreats and the fury drains away, you become aware of a deep, hot pain in your shoulder. Looking down, you see a neat round hole in the hide, dark with blood, where one of his tines punched clean through. The wound is narrow but deep, and already the edges are swelling shut, sealing whatever was carried in on the antler tip — dirt, bark, bacteria — inside the muscle.',
        footnote: '(Puncture wound from antler tine)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-puncture-wound', severity: 0, bodyPart: 'right shoulder' },
        ],
      },
      {
        eventId: 'deer-rut-eye-gouge',
        chance: 0.08,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'In the final, twisting disengage, a brow tine raked across your face and caught the edge of your eye. The pain is immediate and blinding — a white flash followed by a flood of blood and tears that closes the eye completely. You stagger sideways, disoriented, the world suddenly halved. The rival is gone but the damage is done. When the swelling subsides enough to try opening the eye, what you see through it is a smeared, reddish blur where there used to be the sharp autumn forest.',
        footnote: '(Eye injured by antler tine — a common rut injury in mature bucks)',
        statEffects: [
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-eye-injury', severity: 0, bodyPart: 'right eye' },
        ],
      },
      {
        eventId: 'deer-rut-laceration',
        chance: 0.15,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'As you broke apart, his tines dragged across your flank like a rake through soft earth, peeling back a long strip of hide. The wound is ugly — a raw, weeping furrow that runs from shoulder to hip — but shallow. It will stiffen and scab within a day, though you will carry the scar through winter as a record of what the rut cost you.',
        footnote: '(Laceration from antler tines)',
        statEffects: [
          { stat: StatId.HEA, amount: -2, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-laceration', severity: 0, bodyPart: 'right flank' },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'has_flag', flag: 'rut-active' },
      { type: 'no_injury', injuryId: 'antler-break' },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['mating', 'social', 'danger', 'rut'],
  },

  // Rut competition — fighting with a broken antler (higher risk, worse odds)
  {
    id: 'deer-rut-competition-injured',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'Another buck emerges from the treeline, grunting and raking the ground with his hooves. {{npc.rival.name}} sees your damaged rack immediately — the broken tine, the asymmetry — and reads it for what it is: weakness. He advances without hesitation, head low, presenting a full spread of intact antlers against your compromised ones. The does watch from the ridge. You know what they see. You know the arithmetic of bone and leverage is no longer in your favor.',
    statEffects: [
      { stat: StatId.ADV, amount: 14, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'fight-rival-buck-injured',
        label: 'Fight anyway — lopsided rack and all',
        description: 'Your broken antler gives him the leverage advantage. Much higher risk of a locked-antler death.',
        statEffects: [
          { stat: StatId.HOM, amount: 15, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'Your broken antler could not hold against his full rack. The tines slipped past your guard and punctured your chest.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'bluff-rival-buck-injured',
        label: 'Bluff — angle your good side toward him',
        description: 'Present your intact antler and posture aggressively. He might not notice the damage.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fought-rut-rival' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'retreat-rival-buck-injured',
        label: 'Turn and retreat',
        description: 'You are outgunned and you know it. Live to grow a better rack next year.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'lost-rut-contest' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'deer-rut-antler-worsen',
        chance: 0.35,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'The collision drove the crack in your main beam deeper. You can feel the antler shifting on the pedicle, grinding bone against bone with every step. What was a broken tine is now a structural failure.',
        footnote: '(Antler damage worsened in combat)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'antler-break', severity: 1, bodyPart: 'right antler' },
        ],
      },
      {
        eventId: 'deer-rut-injured-puncture',
        chance: 0.35,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'Your compromised guard left your off-side wide open, and he knew it. A tine drove into the muscle of your neck with the full force of his charge behind it. You wrenched free, but the hole is deep and already hot with the first signs of infection. Fighting with a broken rack means absorbing hits you should have been able to deflect.',
        footnote: '(Puncture wound — broken antler left an opening)',
        statEffects: [
          { stat: StatId.HEA, amount: -7, label: '-HEA' },
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-puncture-wound', severity: 0, bodyPart: 'neck' },
        ],
      },
      {
        eventId: 'deer-rut-injured-eye-gouge',
        chance: 0.12,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'Without a full rack to catch and redirect his tines, one slipped past and raked directly across your eye. The pain is instant and total — a white-hot line drawn across your vision that dissolves into darkness on that side. You stumble away, half-blind, blood sheeting down your face. The asymmetry of your broken antler gave him an angle of attack that a healthy rack would never have allowed.',
        footnote: '(Eye gouged — the broken antler could not protect your face)',
        statEffects: [
          { stat: StatId.HEA, amount: -10, label: '-HEA' },
          { stat: StatId.TRA, amount: 10, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-eye-injury', severity: 0, bodyPart: 'left eye' },
        ],
      },
      {
        eventId: 'deer-rut-injured-laceration',
        chance: 0.20,
        conditions: [
          { type: 'has_flag', flag: 'fought-rut-rival' },
        ],
        narrativeText:
          'His tines scored a long, ragged line down your side as you tried to disengage. The gash is deeper than a normal sparring wound — he had the leverage to press the attack, and your broken rack could not push him off-line.',
        footnote: '(Laceration from uneven engagement)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rut-laceration', severity: 0, bodyPart: 'left flank' },
        ],
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'has_flag', flag: 'rut-active' },
      { type: 'has_injury', injuryId: 'antler-break' },
    ],
    weight: 15,
    cooldown: 2,
    tags: ['mating', 'social', 'danger', 'rut'],
  },

  {
    id: 'deer-fawn-birth',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'You have chosen your place with care — a thicket of tall fescue on a gentle south-facing slope, hidden from the wind, screened from above by the low branches of a crabapple tree. The contractions come in waves, each one deeper and more insistent than the last. You lie on your side, breathing in shallow, rapid bursts, the muscles of your abdomen working with an intelligence that requires nothing from your conscious mind. Then, in a rush of fluid and effort, the fawn arrives — slick, steaming, impossibly small, its legs folded beneath it like wet origami. You lick it clean with long, firm strokes, memorizing its scent, imprinting it into the deepest architecture of your brain. Within an hour it is standing. Within two, it is nursing. Within a day, you will hide it in the grass and leave to feed, trusting its spotted coat and absolute stillness to keep it safe from the world that wants to eat it.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'has-fawns' },
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'season', seasons: ['spring'] },
      { type: 'no_flag', flag: 'has-fawns' },
      { type: 'age_range', min: 12 },
    ],
    weight: 18,
    cooldown: 12,
    tags: ['mating', 'fawn'],
  },

  {
    id: 'deer-fawn-defense',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'The coyote has found your fawn. You can see it nosing through the grass not ten yards from where the spotted body lies motionless, pressed flat against the earth in the instinctive freeze that has saved a million fawns before this one. The coyote has not seen it yet — it is following the scent, zigzagging closer with each pass. Your fawn\'s eyes are open, glassy with terror, but it does not move. It will not break its freeze unless the teeth are already closing. Everything in your body is screaming. You are fifty yards away and closing fast.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'attack-coyote',
        label: 'Charge the coyote with hooves raised',
        description: 'A doe defending her fawn is one of the most dangerous things in the forest',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'lure-away',
        label: 'Lure the coyote away from the fawn',
        description: 'Feign injury to draw it off — risky, but the fawn stays hidden',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The coyote called its packmates. They did not fall for the decoy.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'has-fawns' },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['predator', 'fawn', 'danger', 'mating'],
  },

  // ══════════════════════════════════════════════
  //  NPC ENCOUNTER TRACKING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'deer-rival-returns',
    type: 'active',
    category: 'social',
    narrativeText:
      '{{npc.rival.name}} stands at the far edge of the clearing, his rack silhouetted against the grey sky. You have crossed paths before — you recognize the scarred brow tine, the way he holds his head slightly cocked to one side. He stamps the ground once, twice, sending a spray of frozen earth into the air. This is no chance encounter. He has been looking for you.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'confront-rival',
        label: 'Lower your antlers and advance',
        description: 'Show him you remember too',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'yield-rival',
        label: 'Turn and walk away',
        description: 'Not today — conserve your strength',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'confrontation', 'territorial'],
  },

  {
    id: 'deer-predator-stalks-again',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The scent hits you like a cold hand on the back of your neck — {{npc.predator.name}}. The same predator that has been shadowing your herd for weeks. You have smelled this particular hunter before, recognized the undertone of old blood and wet fur. It is learning your patterns, your trails, the times you come to water. Each encounter it gets a little bolder, a little closer.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
    ],
    choices: [
      {
        id: 'flee-predator-npc',
        label: 'Sprint for dense cover',
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
          cause: '{{npc.predator.name}} finally caught you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stand-ground-predator',
        label: 'Stand your ground and stomp',
        description: 'Make yourself large — show you are not easy prey',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'Standing your ground against {{npc.predator.name}} was a fatal miscalculation.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [],
    weight: 7,
    cooldown: 8,
    tags: ['predator', 'danger'],
  },

  {
    id: 'deer-ally-warns',
    type: 'passive',
    category: 'social',
    narrativeText:
      '{{npc.ally.name}} appears at the tree line, her ears swiveling like radar dishes, her tail flagging in the sharp, rhythmic pattern that means danger. You have learned to trust her vigilance — she has warned you before, and every time she has been right. You freeze, scanning the shadows where she is staring, and there it is: movement, low and deliberate, through the underbrush. Without her, you would have walked straight into it.',
    statEffects: [
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'herd'],
  },
];

export const WHITE_TAILED_DEER_EVENTS: GameEvent[] = [...sharedEvents, ...deerEvents];
