import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const FIG_WASP_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  GALL LARVA PHASE (age 0-1, no emergence flag)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-gall-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Inside your gall, you are surrounded by nutritive tissue — the fig\'s gift to its mutualist. The endosperm is rich, sweet, and entirely yours. You can feed aggressively, growing faster but stressing the gall walls, or conservatively, ensuring the gall remains intact around you.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    choices: [
      {
        id: 'feed-aggressively',
        label: 'Feed aggressively',
        description: 'Consume as much gall tissue as possible.',
        narrativeResult: 'You gorge on the nutritive tissue, your body swelling inside the gall. The walls thin around you. You are growing fast — perhaps too fast for the chamber that contains you.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.000000008 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'feed-conservatively',
        label: 'Feed conservatively',
        description: 'Eat slowly, preserving the gall structure.',
        narrativeResult: 'You feed steadily, leaving the gall walls thick and protective around you. Growth is slower, but you are safe inside your chamber.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.000000004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'development'],
    footnote: 'Fig wasp larvae develop inside individual galls — modified fig ovules that the mother wasp induced the fig to grow. Each gall is a single-occupancy nursery, perfectly sized for one developing wasp.',
  },

  {
    id: 'figwasp-neighboring-gall',
    type: 'passive',
    category: 'social',
    narrativeText: 'Through the thin walls of your gall, you sense vibrations — other larvae developing in adjacent chambers. The fig is full of your siblings, each sealed in their own pocket of nutritive tissue. In this dark, warm interior, you are alone and yet surrounded. The crowding means competition for the fig\'s limited resources, but also the assurance that when the time comes, there will be males to chew the exit tunnels.',
    statEffects: [
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
      { stat: StatId.HOM, amount: -2, label: '-HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['social', 'development'],
  },

  {
    id: 'figwasp-nematode-in-gall',
    type: 'passive',
    category: 'health',
    narrativeText: 'Something is moving inside the fig tissue near your gall. A microscopic nematode — Parasitodiplogaster — has located your chamber and is boring through the wall. These roundworms are ancient parasites of fig wasps, evolving alongside the mutualism for millions of years. They feed on the hemolymph of developing larvae.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'fig-nematode', startStage: 0 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_parasite', parasiteId: 'fig-nematode' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
      { type: 'age_range', max: 2 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['health', 'parasite', 'nematode'],
    footnote: 'Parasitodiplogaster nematodes are phoretic on fig wasps — they ride inside the foundress wasp into the fig, then parasitize her offspring. Some species have co-speciated with their fig wasp hosts for tens of millions of years.',
  },

  {
    id: 'figwasp-gall-development',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your body is growing steadily inside its chamber. The fig tissue responds to your chemical signals, thickening the gall walls and enriching the endosperm. You are changing — head capsule widening, mandibles forming, the first faint outlines of what you will become visible beneath your larval skin. The fig is building you as much as you are building yourself.',
    statEffects: [
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.000000005 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['health', 'development', 'growth'],
  },

  // ══════════════════════════════════════════════
  //  PUPA PHASE (age 1-2, flag: is-pupa)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-pupation-begins',
    type: 'passive',
    category: 'health',
    narrativeText: 'The change begins. Your larval body stiffens, your skin splits along invisible seams, and beneath it, something entirely new is taking shape. Inside the sealed chamber of your gall, protected by the fig that has fed you since birth, you undergo the ancient transformation. Your larval organs dissolve into a biological soup from which adult structures crystallize — compound eyes, wings (if you are female), massive mandibles (if you are male), an ovipositor or aedeagus. You are helpless, formless, and utterly vulnerable.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'age_range', min: 1 },
      { type: 'no_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['health', 'metamorphosis', 'lifecycle'],
    footnote: 'Like all holometabolous insects, fig wasps undergo complete metamorphosis — a radical restructuring of the body inside a pupal case. The larval tissues are broken down by digestive enzymes and rebuilt from clusters of undifferentiated cells called imaginal discs.',
  },

  {
    id: 'figwasp-fig-ripening',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The fig around you is changing. The syconium walls are softening, the interior temperature is rising, and volatile compounds are building in the cavity. The fig is ripening — a process timed by millions of years of co-evolution to synchronize with your emergence. The chemical signals seeping through your gall walls are the countdown to adulthood.',
    statEffects: [
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'no_flag', flag: 'emerged-from-gall' },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['environmental', 'lifecycle', 'fig'],
  },

  // ══════════════════════════════════════════════
  //  ADULT INSIDE FIG — MALE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-male-emergence',
    type: 'passive',
    category: 'health',
    narrativeText: 'You chew through the wall of your gall and emerge into the dark interior of the fig. You are blind — your compound eyes are vestigial, useless in this lightless world. You are wingless — you will never fly, never see the sky, never leave this fruit. But your mandibles are enormous, disproportionate weapons forged for a single purpose: to fight other males and chew through the fig wall. You are a soldier born inside a fortress.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'emerged-from-gall' },
      { type: 'remove_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'age_range', min: 2 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'emergence', 'male'],
    footnote: 'Male fig wasps are among the most morphologically derived insects on Earth. They are wingless, eyeless (or nearly so), and heavily sclerotized with enlarged mandibles. They never leave the fig in which they were born.',
  },

  {
    id: 'figwasp-male-combat',
    type: 'active',
    category: 'social',
    narrativeText: 'In the pitch-dark interior of the fig, you encounter another male. You sense him by vibration and chemical cues — the clash of mandibles against fig tissue, the bitter pheromones of aggression. He is between you and a gall containing an unemerged female. In fig wasp society, there is no negotiation. There is only combat.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fight-aggressively',
        label: 'Attack with full force',
        description: 'Lock mandibles and fight to the death.',
        narrativeResult: 'You charge forward, mandibles spread wide. The collision is savage — you lock jaws with the rival, each trying to sever the other\'s body. Hemolymph sprays in the darkness. One of you will walk away. The other will die in the fruit that birthed him.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fig-combat-attempted' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.15,
          cause: 'Killed by a rival male during combat inside the fig',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'wait-for-opening',
        label: 'Wait for weaker opponents',
        description: 'Let others fight first, then claim the exhausted victor\'s prize.',
        narrativeResult: 'You retreat into a fold of fig tissue and wait. You hear the sounds of combat — the scrape of chitin, the wet snap of severed limbs. When silence falls, you creep forward. The victor is wounded, and there are other galls nearby.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'fig-combat-attempted' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['social', 'combat', 'male', 'mating'],
    footnote: 'Male fig wasp combat is often lethal. Males of some species have been observed decapitating rivals with their mandibles. The interior of a ripe fig can contain the dismembered bodies of several males — casualties of battles no human ever witnesses.',
  },

  {
    id: 'figwasp-male-mating',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'You locate a gall containing an unemerged female. With delicate precision — a strange contrast to the violence of combat — you chew a small hole into the gall wall. Through this opening, you extend your telescoping aedeagus and mate with the female before she has even fully emerged from pupation. She will carry your sperm to a fig you will never see, to pollinate flowers you will never know exist.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'mated-in-fig' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'mated-in-fig' },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['reproduction', 'mating', 'male'],
  },

  {
    id: 'figwasp-male-tunnel-chewing',
    type: 'active',
    category: 'social',
    narrativeText: 'Your final act. The females are ready to leave, but they cannot escape on their own — the fig is sealed. You begin chewing through the thick wall of the syconium, grinding your mandibles through layer after layer of dense fig tissue. The tunnel grows slowly. Your mandibles are wearing down, your body is exhausting its last reserves. If you succeed, the females will fly to freedom through the passage you created. You will never use it yourself.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    choices: [
      {
        id: 'wide-tunnel',
        label: 'Chew a wide tunnel',
        description: 'Exhaust yourself creating a generous exit.',
        narrativeResult: 'You chew with everything you have, widening the tunnel until sunlight streams in — blinding, warm, alien. The females begin to move toward the light. You have given them the world. You retreat into the darkness of the fig, mandibles worn to stubs, body spent.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tunnel-chewed' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.30,
          cause: 'Exhaustion from chewing exit tunnel through fig wall',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'minimal-tunnel',
        label: 'Chew a minimal tunnel',
        description: 'Conserve energy but the tunnel may not fully penetrate.',
        narrativeResult: 'You chew carefully, conserving your strength. The tunnel reaches the outer layers of the fig but does not fully break through. The females will have to force their way out — but at least you have weakened the wall for them.',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'tunnel-chewed' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'mated-in-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['social', 'sacrifice', 'male', 'tunnel'],
    footnote: 'Male fig wasps chew exit tunnels cooperatively — multiple males may work on the same tunnel. This is one of the clearest examples of altruism in insects: the males gain no direct benefit from the tunnel, as they die inside the fig regardless. Their sacrifice enables the females to escape and continue the species.',
  },

  {
    id: 'figwasp-male-death-in-fig',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your purpose is fulfilled. You mated. You chewed the tunnel. Now your body is failing — you have no way to feed as an adult, no wings to fly, no eyes to see beyond this dark chamber. You will die inside this fig, and your body will be absorbed by the fruit that gave you life. The females are gone, carrying your genes to figs you will never see. In the economy of evolution, this is success.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Died inside natal fig after fulfilling reproductive purpose' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'male' },
      { type: 'has_flag', flag: 'tunnel-chewed' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'death', 'male'],
  },

  // ══════════════════════════════════════════════
  //  ADULT INSIDE FIG — FEMALE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-female-emergence',
    type: 'passive',
    category: 'health',
    narrativeText: 'You chew through the wall of your gall and emerge into the dim interior of the fig. Unlike the males, you have wings — four delicate membranes folded tight against your body. You have compound eyes that detect the faint light filtering through the fig wall. And you have antennae, tuned to the volatile compounds of receptive figs. The males are already moving through the darkness around you, fighting, mating, beginning to chew. Your time inside this fig is short.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'emerged-from-gall' },
      { type: 'remove_flag', flag: 'is-pupa' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'is-pupa' },
      { type: 'age_range', min: 2 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'emergence', 'female'],
  },

  {
    id: 'figwasp-female-mated-in-gall',
    type: 'passive',
    category: 'reproduction',
    narrativeText: 'A male has chewed into your gall and mated with you before you fully emerged. You felt the intrusion — a small hole in the gall wall, then the brief, mechanical act of insemination. You carry his sperm now, stored in your spermatheca, ready to fertilize the eggs you will lay in a fig you have not yet found. He will die here. You will carry his lineage forward.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'mated-in-fig' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'mated-in-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['reproduction', 'mating', 'female'],
  },

  {
    id: 'figwasp-female-pollen-collection',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Inside the fig, you move methodically among the flowers, collecting pollen in specialized thoracic pockets — corbiculae evolved over millions of years for exactly this purpose. This pollen is your cargo, the currency of the mutualism. The fig fed you as a larva; now you will carry its pollen to a new fig and pollinate its flowers. But you must also reserve ovules for your own eggs. The balance between pollination and parasitism is the razor\'s edge on which 80 million years of co-evolution rests.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    choices: [
      {
        id: 'collect-thoroughly',
        label: 'Collect pollen thoroughly',
        description: 'Pack your corbiculae full — ensure good pollination at the next fig.',
        narrativeResult: 'You visit every accessible anther, loading your pollen pockets until they are densely packed. The next fig you enter will be well-pollinated — its seeds will be viable, its offspring strong. And strong figs make strong galls for your larvae.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollen-collected' },
          { type: 'modify_weight', amount: 0.000000002 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'collect-quickly',
        label: 'Collect quickly and move on',
        description: 'Gather minimal pollen — save energy for the flight ahead.',
        narrativeResult: 'You grab a cursory dusting of pollen and turn your attention to the exit. The mutualism can survive a little less pollination. What matters now is getting out alive.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollen-collected' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'emerged-from-gall' },
      { type: 'no_flag', flag: 'pollen-collected' },
    ],
    weight: 20,
    cooldown: 99,
    tags: ['foraging', 'pollination', 'female', 'mutualism'],
    footnote: 'Fig wasps are active pollinators — unlike most insect pollinators that transfer pollen passively on their bodies, fig wasps have evolved specialized structures (corbiculae) to deliberately collect and transport pollen. This is thought to be an adaptation driven by the enclosed structure of the fig, where passive pollen transfer is impossible.',
  },

  // ══════════════════════════════════════════════
  //  DISPERSAL FLIGHT (female only, flag: exited-fig)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-exit-through-tunnel',
    type: 'active',
    category: 'migration',
    narrativeText: 'The tunnel is open — a rough passage chewed through the fig wall by the males who will die behind you. Light streams in, warm and blinding after weeks of darkness. You must squeeze through. Your wings scrape against the ragged walls of fig tissue. Your antennae bend. The passage is barely wide enough for your body. On the other side: open air, sunlight, the vast and terrifying world outside the fig. You have never been outside.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'exit-quickly',
        label: 'Push through quickly',
        description: 'Speed over caution — get out before the tunnel collapses.',
        narrativeResult: 'You force yourself through the tunnel at full speed. A wing catches on a ridge of fig tissue and tears slightly. But you are through — you are outside — and the air hits you like a revelation. Warm. Moving. Infinite. Your wings unfold and you are flying for the first time in your life.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'exited-fig' },
          { type: 'add_injury', injuryId: 'wing-loss', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'exit-carefully',
        label: 'Navigate carefully',
        description: 'Take your time — protect your wings.',
        narrativeResult: 'You move slowly through the tunnel, folding your wings tight against your body, guiding yourself with your antennae. The passage is tight, but you emerge intact. The world explodes into light and air and scent. You unfurl your wings, perfect and whole, and take flight.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'exited-fig' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pollen-collected' },
      { type: 'has_flag', flag: 'mated-in-fig' },
      { type: 'no_flag', flag: 'exited-fig' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['migration', 'lifecycle', 'female', 'tunnel'],
  },

  {
    id: 'figwasp-wind-dispersal',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A gust of subtropical wind catches you. At two millimeters long, you are utterly at the mercy of air currents — a leaf in a hurricane, a mote of dust in a breeze. The wind carries you away from your natal tree. It could be carrying you toward a distant fig, or it could be carrying you over open water, asphalt, or treeless fields where no fig grows. You have no way to know.',
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -0.000000002 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 14,
    cooldown: 2,
    tags: ['environmental', 'wind', 'dispersal'],
  },

  {
    id: 'figwasp-scent-detection',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Your antennae — each one a forest of chemosensory hairs — detect something in the air. Volatile organic compounds: linalool, methyl salicylate, the specific blend that only a receptive Ficus aurea syconium produces. The fig is calling to you across the tropical canopy, a chemical siren song that your species has been answering for 80 million years. The scent is faint, carried on shifting winds.',
    statEffects: [],
    choices: [
      {
        id: 'follow-scent',
        label: 'Follow this scent signal',
        description: 'Fly toward the source — it could be the fig you need.',
        narrativeResult: 'You bank into the wind, following the concentration gradient of fig volatiles. The scent grows stronger with each wingbeat. Somewhere ahead, a fig is waiting — its flowers open, its ostiole receptive, its future dependent on your arrival.',
        statEffects: [
          { stat: StatId.NOV, amount: -3, label: '-NOV' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'search-stronger',
        label: 'Search for a stronger signal',
        description: 'This scent is faint — there may be a closer fig.',
        narrativeResult: 'You ignore the faint signal and continue searching, burning precious energy and time. Your adult life can be measured in hours, not days. Every minute spent searching is a minute closer to dying without laying eggs.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000003 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 16,
    cooldown: 3,
    tags: ['foraging', 'navigation', 'scent', 'female'],
    footnote: 'Fig wasps can detect the volatile chemical signals of receptive figs from several kilometers away. The composition of these volatiles is species-specific, ensuring that each fig species attracts only its own pollinator. This chemical specificity is a key mechanism maintaining the one-to-one mutualism.',
  },

  {
    id: 'figwasp-spider-web-flight',
    type: 'active',
    category: 'predator',
    narrativeText: 'A golden silk orb-weaver has strung its web between branches near a fig tree. The web is enormous relative to your body — a translucent death trap woven from silk stronger than steel. The sticky spiral threads glisten in the filtered light. You see it just in time. At your size, even a single strand could hold you.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'veer-away',
        label: 'Veer away',
        description: 'Burn energy to fly around the web.',
        narrativeResult: 'You bank hard, your tiny wings buzzing at maximum frequency. The web passes below you — a glistening plane of death that you barely avoided. The detour costs you precious energy and time, but you are alive.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000002 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'fly-through-gap',
        label: 'Fly through a gap in the web',
        description: 'You see an opening between the spiral threads.',
        narrativeResult: 'You aim for what looks like a gap in the web\'s sticky spiral. You are so small that the spaces between threads seem navigable — but one wrong wingbeat and you are trapped.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.18,
          cause: 'Caught in a golden silk orb-weaver web during dispersal flight',
          statModifiers: [{ stat: StatId.WIS, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['predator', 'spider', 'danger', 'flight'],
  },

  {
    id: 'figwasp-bird-predation',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A white-eyed vireo is hunting insects in the canopy near a fig tree. It darts between branches, snatching gnats and small flies from the air with practiced precision. You are flying through its hunting territory. At two millimeters, you are barely a mouthful — but to a vireo, every calorie counts.',
    statEffects: [
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'figwasp-bird-predation-strike',
        chance: 0.08,
        narrativeText: 'The vireo spots you — a flicker of movement against the green canopy. It strikes.',
        footnote: 'Fig wasps are incidental prey for insectivorous birds. Their small size makes them low-value targets, but birds hunting near fig trees inevitably consume some dispersing wasps.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Eaten by an insectivorous bird during dispersal flight' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['predator', 'bird', 'flight'],
  },

  {
    id: 'figwasp-ant-gauntlet',
    type: 'active',
    category: 'predator',
    narrativeText: 'You have found a fig tree — you can see the green syconia hanging from its branches. But the trunk is patrolled by a column of fire ants, thousands of them streaming up and down the bark. They will kill anything that lands on their territory. To reach the figs, you must fly past them.',
    statEffects: [],
    choices: [
      {
        id: 'fly-direct',
        label: 'Fly directly to a fig',
        description: 'Land on the syconium from the air, avoiding the trunk.',
        narrativeResult: 'You aim for a hanging fig, approaching from below on the wind. Your tiny body slips past the ant patrol routes. You land on the smooth surface of a syconium, far from the nearest ant. Safe — for now.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'Killed by fire ants while attempting to reach a fig',
          statModifiers: [{ stat: StatId.WIS, factor: -0.001 }],
        },
      },
      {
        id: 'circle-approach',
        label: 'Circle and approach from downwind',
        description: 'Take a wider path to avoid detection.',
        narrativeResult: 'You make a wide circuit around the tree, approaching from the downwind side where the ant scent trails are weakest. The detour burns energy, but you reach the fig unmolested.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000001 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['predator', 'ant', 'danger'],
  },

  {
    id: 'figwasp-wrong-fig-species',
    type: 'active',
    category: 'foraging',
    narrativeText: 'You approach what your antennae tell you is a receptive fig — but something is wrong. The chemical profile is subtly off. The volatile blend contains compounds that don\'t match your innate template. This is Ficus citrifolia, not Ficus aurea. The figs look similar, but the interior is incompatible — if you enter, your ovipositor cannot reach the ovules, and your eggs will not develop. But you are exhausting your reserves. You are running out of time.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'enter-wrong-fig',
        label: 'Enter anyway',
        description: 'You are desperate. Maybe it will work.',
        narrativeResult: 'You squeeze through the ostiole, tearing your wings off in the process. Inside, the flowers are wrong — the styles are too long, the structure unfamiliar. Your ovipositor cannot reach the ovules. You pollinate uselessly, lay eggs that will never develop, and die inside a fig that was never meant for you. A dead end in an 80-million-year lineage.',
        statEffects: [
          { stat: StatId.TRA, amount: 15, label: '+TRA' },
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'death', cause: 'Entered incompatible fig species — eggs failed to develop' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'keep-searching',
        label: 'Leave and keep searching',
        description: 'Trust your chemical instincts.',
        narrativeResult: 'You pull away from the wrong fig, your antennae still searching the wind. The correct chemical signature is out there somewhere. But your energy reserves are dwindling, and every wingbeat brings you closer to the end of your brief adult life.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000003 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 8,
    cooldown: 99,
    tags: ['foraging', 'danger', 'wrong-host'],
    footnote: 'The fig-fig wasp mutualism is highly species-specific: each of the ~750 fig species is typically pollinated by only one or a few wasp species. Wasps that enter the wrong fig species waste their reproductive effort — they cannot successfully oviposit, and their pollination effort is wasted.',
  },

  // ══════════════════════════════════════════════
  //  INSIDE NEW FIG (female only, flag: entered-new-fig)
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-ostiole-entry',
    type: 'active',
    category: 'migration',
    narrativeText: 'You have found it — a receptive Ficus aurea syconium, its chemical signature unmistakable. The ostiole is a tiny, scale-guarded opening at the base of the fig. It is barely wide enough for your body. To enter, you must squeeze through it — and the passage will tear off your wings and may break your antennae. You will enter this fig and never leave. Everything you are, everything your species has been for 80 million years, leads to this moment.',
    statEffects: [],
    choices: [
      {
        id: 'enter-fig',
        label: 'Enter the fig',
        description: 'Push through the ostiole. There is no going back.',
        narrativeResult: 'You push headfirst into the ostiole. The scales clamp around your body like teeth. Your wings — the wings that carried you through open air for the first and last time — catch on the edges and tear away. Your antennae snap. But you are inside. The interior is dark, warm, and smells of pollen and fig sap. You have arrived. The cycle continues.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.HOM, amount: -5, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'entered-new-fig' },
          { type: 'add_injury', injuryId: 'wing-loss', severity: 2 },
          { type: 'add_injury', injuryId: 'antenna-damage', severity: 1 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'search-wider-ostiole',
        label: 'Search for a fig with a wider opening',
        description: 'Risk running out of time for a less damaging entry.',
        narrativeResult: 'You leave the fig and continue searching. Each minute in the open air drains your reserves. You are gambling that there is an easier entry somewhere — but every fig\'s ostiole is calibrated to be just barely passable. This is the price of the mutualism.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.000000004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'exited-fig' },
      { type: 'no_flag', flag: 'entered-new-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['migration', 'lifecycle', 'ostiole', 'female'],
    footnote: 'The ostiole passage is so traumatic that foundress wasps routinely lose their wings, antennae tips, and parts of their legs. The fig has evolved this narrow entrance as a quality filter — only healthy, well-developed wasps can successfully enter. This is a form of natural selection mediated by architecture.',
  },

  {
    id: 'figwasp-pollination',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Wingless, antenna-stumped, bleeding hemolymph from a dozen small wounds, you crawl through the interior of the new fig. The flowers are arranged in a dense carpet — short-styled flowers near the center where your ovipositor can reach, long-styled flowers near the wall where only pollen can go. You unpack your corbiculae and begin the ancient work. Pollination first — then eggs.',
    statEffects: [],
    choices: [
      {
        id: 'pollinate-thoroughly',
        label: 'Pollinate thoroughly',
        description: 'Visit every flower. Ensure the fig sets good seed.',
        narrativeResult: 'You crawl methodically from flower to flower, depositing pollen on each stigma. The fig will produce healthy seeds — and healthy seeds mean a healthy fig, which means your galls will be well-nourished. The mutualism depends on this reciprocity. You honor it.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollinating-fig' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'focus-on-eggs',
        label: 'Focus on egg-laying sites',
        description: 'Skip some flowers to save energy for oviposition.',
        narrativeResult: 'You pollinate hastily, skipping the long-styled flowers near the wall and heading straight for the short-styled ones where you can lay eggs. It is a selfish strategy — fewer seeds for the fig, more galls for your offspring. Evolution constrains cheaters, but it also rewards them when they are not caught.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pollinating-fig' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'entered-new-fig' },
      { type: 'no_flag', flag: 'pollinating-fig' },
    ],
    weight: 22,
    cooldown: 99,
    tags: ['foraging', 'pollination', 'mutualism', 'female'],
    footnote: 'The conflict between the fig and its pollinator is a classic example of mutualism with competing interests. The fig "wants" maximum pollination and minimum seed destruction by wasp larvae. The wasp "wants" maximum egg-laying and minimum pollination effort. The fig constrains cheating by having some flowers with styles too long for the wasp\'s ovipositor — these can only be pollinated, never parasitized.',
  },

  {
    id: 'figwasp-egg-laying',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'With your ovipositor — a needle-fine tube evolved over 80 million years — you probe the short-styled flowers of the fig. Each insertion deposits a single egg in a single ovule. Each egg will induce the fig to grow a gall around it — a nursery chamber of nutritive tissue. You lay until your body is spent, your abdomen contracting rhythmically as egg after egg passes down the ovipositor. When you are empty, you will die here, inside this fig, and the fig will absorb your body. Your children will never know you. But they will carry you forward.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    consequences: [
      { type: 'spawn' },
      { type: 'set_flag', flag: 'eggs-laid' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'entered-new-fig' },
      { type: 'has_flag', flag: 'pollinating-fig' },
      { type: 'no_flag', flag: 'eggs-laid' },
    ],
    weight: 25,
    cooldown: 99,
    tags: ['reproduction', 'egg-laying', 'female', 'lifecycle'],
  },

  // ══════════════════════════════════════════════
  //  CROSS-PHASE / ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'figwasp-non-pollinator-rival',
    type: 'passive',
    category: 'predator',
    narrativeText: 'A non-pollinating fig wasp — a parasitoid from the genus Idarnes — has found the fig. She never enters; she does not pollinate. Instead, she drills through the fig wall with her extraordinarily long ovipositor, probing blindly for the galls inside. If she finds one of yours, her egg will hatch into a larva that consumes your offspring. She is a cheat in the mutualism — a free-rider who benefits from the fig without contributing. And there is nothing you can do to stop her.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'has_flag', flag: 'entered-new-fig' },
    ],
    weight: 12,
    cooldown: 99,
    tags: ['predator', 'parasitoid', 'cheater'],
    footnote: 'Non-pollinating fig wasps (NPFWs) are a diverse group of insects that exploit the fig-pollinator mutualism. Some are parasitoids of pollinator larvae; others are gallers that compete for ovules without pollinating. NPFWs can outnumber pollinators in many fig species, and their impact on the mutualism is a major area of ecological research.',
  },

  {
    id: 'figwasp-female-death-in-fig',
    type: 'passive',
    category: 'health',
    narrativeText: 'Your wings are gone. Your antennae are broken stubs. You have pollinated the flowers and laid your eggs and your body has nothing left to give. You die inside the fig, and the fruit absorbs your corpse — nitrogen, phosphorus, the minerals of your tiny life feeding the tissue that will nourish your children. The males who chewed your escape tunnel are dead beside you. The cycle is complete. In six weeks, your offspring will emerge from their galls, and the daughters among them will fly out into the same sunlight you saw for one brief, burning day.',
    statEffects: [],
    consequences: [
      { type: 'death', cause: 'Died inside the fig after completing pollination and oviposition — the cycle continues' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'eggs-laid' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    cooldown: 99,
    tags: ['lifecycle', 'death', 'female'],
  },

  {
    id: 'figwasp-hurricane-damage',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'A tropical storm sweeps through the hammock. The strangler fig sways violently, its aerial roots groaning. Ripe figs are torn from branches and dashed on the limestone ground below. If you are still inside your natal fig, the impact could crush you. If you are flying, the wind is far too powerful for a two-millimeter insect to resist.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    subEvents: [
      {
        eventId: 'figwasp-hurricane-death',
        chance: 0.12,
        narrativeText: 'The fig tears free from the branch and falls. The impact splits the syconium open.',
        statEffects: [],
        consequences: [
          { type: 'death', cause: 'Killed when natal fig was torn from the tree by a tropical storm' },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['environmental', 'storm', 'danger'],
  },

  {
    id: 'figwasp-parasitoid-fly',
    type: 'passive',
    category: 'health',
    narrativeText: 'A tiny parasitoid fly — Dirhinus giffardii — has located the fig. It crawls over the surface, probing with its ovipositor through natural cracks in the fig wall, seeking wasp larvae inside. Its eggs, if they reach you, will hatch into larvae that consume you from within.',
    statEffects: [
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'parasitoid-wasp', startStage: 0 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['fig-wasp'] },
      { type: 'no_parasite', parasiteId: 'parasitoid-wasp' },
      { type: 'no_flag', flag: 'exited-fig' },
      { type: 'age_range', max: 2 },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['health', 'parasite', 'parasitoid'],
  },
];
