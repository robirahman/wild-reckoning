import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';
import { allEvents as sharedEvents } from '../../events/index';

const wolfEvents: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  HUNTING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-deer-chase',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'A white-tailed deer bursts from the undergrowth ahead — a doe, heavy with autumn fat, her white flag flashing as she bounds through the aspens. Your muscles lock, your ears flatten, and the ancient calculus begins: distance, terrain, snow depth, her speed versus yours. She is fast, but she is running uphill, and the snow is deep enough to slow her more than it slows you. The chase will cost energy you may not have to spare.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: 3, label: '+ADV' },
    ],
    choices: [
      {
        id: 'pursue-deer',
        label: 'Pursue at full speed',
        description: 'Commit everything to the chase — if you catch her, you eat for days',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stalk-deer',
        label: 'Stalk and wait for a better angle',
        description: 'Circle downwind and try to cut her off at the creek crossing',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'abandon-deer',
        label: 'Abandon the chase',
        description: 'Save your energy — failed chases in winter can be fatal',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['foraging', 'hunting', 'prey'],
  },

  {
    id: 'wolf-moose-confrontation',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The bull moose stands in the shallows of the beaver pond, water streaming from his beard, his rack wide enough to shelter a grown man beneath it. He is old, massive — over a thousand pounds of bone and muscle and fury. He has seen wolves before and he is not afraid. He turns to face you, lowering that enormous head, and the antler tines swing toward you like a forest of spears. A moose can kill a wolf with a single kick. But a moose can also feed a pack for two weeks.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'attack-moose',
        label: 'Attack — go for the hamstrings',
        description: 'If you can cripple him, the pack eats for weeks. If you misjudge, you die.',
        statEffects: [
          { stat: StatId.HOM, amount: 12, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 8 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.10,
          cause: 'The moose caught you with a front hoof. The blow crushed your skull instantly.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'test-moose',
        label: 'Test him — feint and gauge his strength',
        description: 'Circle and probe for weakness. If he stands firm, back off.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The moose charged without warning. You were too close to dodge.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'retreat-moose',
        label: 'Retreat — this one is too strong',
        description: 'A wise wolf knows when prey is too dangerous',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['foraging', 'hunting', 'danger'],
  },

  {
    id: 'wolf-elk-ambush',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The elk herd is bedded down in the meadow at dawn, steam rising from their warm bodies into the cold air. You have been watching from the tree line for an hour, reading the herd — the cow with the limp on the left side, the calf that keeps drifting to the edge of the group, the bull that is facing the wrong direction. The wind is in your favor. The snow is firm enough to run on. This is the moment your ancestors perfected over a hundred thousand years: the ambush, the burst, the chase, the takedown.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 6 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['foraging', 'hunting', 'prey'],
    footnote: '(Wolves target weak, young, or injured individuals, culling the least fit from the herd.)',
  },

  {
    id: 'wolf-scavenge-kill',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The ravens led you here — a dozen of them circling above the pines in the lazy, deliberate spirals that mean only one thing. Below, half-buried in snow, lies the carcass of a deer that died in the night. The ribs are still red, the meat still frozen. No other predator has claimed it yet. The ravens drop down and begin tearing at the eyes and tongue, impatient for you to open the hide they cannot breach themselves. This is the ancient partnership: they find, you open, both eat.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['foraging', 'scavenging', 'food'],
  },

  {
    id: 'wolf-failed-hunt-snow',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'The snow is waist-deep and crusted just enough to support the deer but not you. Every stride punches through the crust, the sharp edges cutting your legs, while the deer floats across the surface like a ghost. You chase for two hundred yards before your lungs are burning and your legs are bleeding and the deer is a white tail vanishing into the birch stand. You stop, panting, steam pouring from your open mouth, and the cold truth settles: you have burned more calories than you will replace today. The hunt has failed, and winter does not forgive failed hunts.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['foraging', 'hunting', 'seasonal', 'winter'],
  },

  {
    id: 'wolf-pack-takedown',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'The pack works as a single mind. Two wolves drive the deer toward the frozen lake edge. A third cuts off the escape route through the willows. You and the alpha close from behind, matching the deer\'s panicked zigzags with the calm, metronomic efficiency of predators who have done this a thousand times. The deer stumbles on the ice, its hooves sliding, and in that instant the pack converges. It is over in seconds. You eat in order of rank — alpha pair first, then the betas, then you — tearing into the hot viscera with a hunger that is beyond thought, beyond pleasure, beyond anything but the pure, ancient relief of a successful hunt.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 6 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 11,
    cooldown: 5,
    tags: ['foraging', 'hunting', 'pack', 'social'],
  },

  {
    id: 'wolf-surplus-kill',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'The hunt has gone better than expected. Two deer are down — the pack caught them in deep snow where the crust gave way beneath their hooves and they could not run. The first was killed quickly. The second is still warm, barely touched. Your belly is full, distended, the meat sitting heavy and satisfying in your gut. But there is more here than you can eat. The question is what to do with the surplus.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
    ],
    choices: [
      {
        id: 'cache-kill',
        label: 'Cache the remains under snow',
        description: 'Bury the carcass for later — a survival strategy for lean times ahead',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'cached-food' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'gorge-kill',
        label: 'Gorge on everything you can hold',
        description: 'Eat until you cannot eat more — a wolf can consume 20 pounds in one sitting',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 6 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['foraging', 'hunting', 'food'],
  },

  {
    id: 'wolf-rabbit-hunt',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'A snowshoe hare explodes from beneath a spruce bough in a white blur of fur and panic. You lunge, jaws snapping, and catch it mid-leap — a quick crunch of bone, a brief kick, and then stillness. It is not much — barely two pounds of meat and fur — but in the dead of winter, every calorie is a small victory against the cold. You swallow it in three bites, bones and all, and lick the blood from your muzzle. The hare was easy. The deer are not.',
    statEffects: [
      { stat: StatId.HOM, amount: -2, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 14,
    cooldown: 3,
    tags: ['foraging', 'hunting', 'food'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL / PACK EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-hierarchy-challenge',
    type: 'active',
    category: 'social',
    narrativeText:
      'The alpha stands over the kill, lips curled back to expose the long canines, a low growl vibrating in his chest like distant thunder. He is eating first, as he always does, and the rest of the pack waits in a tense semicircle, ears back, tails low. You are hungry — hungrier than you have ever been — and something in you, something reckless and ancient, does not want to wait any longer. You feel your own hackles rise, your own lips pull back. The pack is watching. Everything could change in the next thirty seconds.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'challenge-alpha',
        label: 'Challenge the alpha',
        description: 'Rise to full height, lock eyes, and advance. Win or lose, there is no going back.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'attempted-alpha-challenge' },
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The alpha\'s jaws closed on your throat. The pack watched in silence.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'submit-alpha',
        label: 'Submit — roll onto your back',
        description: 'Expose your belly and throat. Accept your place. Live to eat after the alpha finishes.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 9,
    cooldown: 10,
    tags: ['social', 'pack', 'hierarchy', 'danger'],
  },

  {
    id: 'wolf-dominance-challenge',
    type: 'active',
    category: 'social',
    narrativeText:
      'The tension has been building for weeks — in the way the beta holds your gaze a beat too long at the kill site, in the stiffness of his legs when you pass, in the low rumble that lives permanently in his chest now like a second heartbeat. Today he does not look away. He approaches you stiff-legged across the clearing, his hackles raised in a dark ridge from skull to tail, his ears pinned forward, his amber eyes locked on yours with an intensity that admits no ambiguity. He stops three body-lengths away and stands tall, every muscle rigid, every tooth visible behind curled lips. The rest of the pack has gone silent. They form a loose circle, ears pricked, tails tucked, watching the geometry of power rearrange itself. This is not about food. This is about who leads, who breeds, who eats first for the rest of your lives. The next move belongs to you.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'assert-dominance',
        label: 'Assert dominance — pin them',
        description: 'Meet the challenge head-on. Stiff-legged advance, direct stare, and if it comes to it, teeth. Win this and you eat first, breed first, lead the pack.',
        narrativeResult: 'You rise to your full height and advance, every step deliberate, every muscle telegraphing controlled violence. He does not back down. The two of you collide in a blur of fur and teeth — muzzle bites, shoulder slams, a desperate scramble for the throat grip that will end it. You feel his jaws clamp on your foreleg and you twist, driving your weight onto his shoulders, forcing him down. For a terrible, straining moment he resists, his body rigid beneath yours, and then something breaks in him — not bone, but will. He goes limp. He rolls. His throat is exposed, his belly offered to the sky. You stand over him, breathing hard, blood on your muzzle, and the pack watches you with new eyes.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pack-dominant' },
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'His jaws found your throat and did not let go. The grip crushed your trachea. You drowned in your own blood while the pack watched in silence.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'submit-expose-throat',
        label: 'Submit — roll over and expose throat',
        description: 'Drop your gaze, lower your body, roll onto your back. Accept subordinate status. You will eat last and will not breed this season — but you will live.',
        narrativeResult: 'You break eye contact first. Your ears flatten, your tail tucks, and you lower your body until your belly nearly touches the ground. Then you roll, offering your throat and your belly to the sky — the most vulnerable parts of you, presented without defense. The challenger stands over you, his breath hot on your exposed neck, and for one long moment the decision is his. Then he steps back. The ritual is complete. You are subordinate now. Last to eat, last to drink, no breeding rights. But the pack still needs you, and you are still alive.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'pack-subordinate' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'dominance-bite-sub',
        chance: 0.20,
        conditions: [],
        narrativeText: 'In the chaos of the fight, jaws found flesh. A bite landed hard — the kind that splits skin and grinds against bone. You feel the wound throbbing now, hot and wet beneath your fur, a souvenir of the challenge that will take days to close.',
        footnote: 'Dominance fights in wolf packs are usually ritualized and resolved through posturing, but approximately 10-20% escalate to physical contact resulting in bite wounds, most commonly to the muzzle, throat, and forelegs.',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'dominance-bite', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'male' },
      { type: 'age_range', min: 24 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['social', 'pack', 'hierarchy', 'danger', 'rival'],
    footnote: 'Wolf pack dominance hierarchies are maintained through ritualized challenges — stiff-legged approaches, direct stares, standing over, and pinning. Most challenges are resolved without serious injury, but escalation to biting (especially throat holds) occurs in roughly one in five encounters and can occasionally prove fatal.',
  },

  {
    id: 'wolf-pack-howl',
    type: 'passive',
    category: 'social',
    narrativeText:
      'It begins with the alpha — a single, low note that rises from the depths of his chest and spirals upward into the night sky like smoke from a fire. One by one, the others join: the alpha female a third higher, the yearlings adding their wavering harmonics, until the entire pack is singing in a chord that no human instrument has ever replicated. You add your voice to the chorus, feeling the vibration in your ribs, in your teeth, in the marrow of your bones. The howl carries for miles through the cold air, crossing ridgelines and frozen lakes, telling every living thing within earshot: we are here, we are together, this land is ours.',
    statEffects: [
      { stat: StatId.WIS, amount: 4, label: '+WIS' },
      { stat: StatId.TRA, amount: -6, label: '-TRA' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 13,
    cooldown: 4,
    tags: ['social', 'pack', 'psychological'],
  },

  {
    id: 'wolf-pup-teaching',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The pups are old enough to learn. You bring back a half-eaten rabbit and drop it at the rendezvous site, then step back and watch as they tear into it with clumsy enthusiasm — growling, tugging, tumbling over each other in a chaos of oversized paws and milk teeth. One pup tries to carry the entire carcass away and falls over sideways. Another buries its face in the ribcage and emerges with a bewildered expression and a mouthful of fur. You watch them with the patient, alert attention of a teacher. They are learning hierarchy, competition, and the taste of meat. Everything a wolf needs to know begins here.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 12,
    cooldown: 5,
    tags: ['social', 'pack', 'pup'],
  },

  {
    id: 'wolf-territory-patrol',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The pack moves in single file along the territory boundary, each wolf stepping precisely in the tracks of the one ahead — an energy-saving trick perfected over millennia. You pause at a scent post, a spruce stump blackened with years of urine marks, and add your own. The scent is a chemical fence, a declaration of ownership written in hormones and metabolites that any wolf can read: this territory is occupied, the pack is strong, trespassers will be met with teeth. You mark seven more posts before the patrol is done, your bladder emptied in precisely rationed installments along fifteen miles of boundary.',
    statEffects: [
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
      { stat: StatId.NOV, amount: -3, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'territory-patrolled' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 11,
    cooldown: 5,
    tags: ['social', 'territory', 'pack'],
  },

  {
    id: 'wolf-stranger-encounter',
    type: 'active',
    category: 'social',
    narrativeText:
      'A lone wolf stands at the edge of your territory, head low, tail tucked, its coat ragged and thin. It is a disperser — a young wolf that left or was driven from its natal pack and is now wandering the spaces between territories, looking for a place to belong. It sees you and freezes. You see the desperation in its posture, the hunger in its ribs. Lone wolves are killed by resident packs more often than they are accepted. The stranger knows this. So do you.',
    statEffects: [
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-stranger',
        label: 'Attack the intruder',
        description: 'Defend your territory with violence — the ancient law of wolves',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rival-bite', severity: 0 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'The stranger was more desperate — and more dangerous — than it appeared.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-stranger',
        label: 'Retreat and avoid confrontation',
        description: 'Back away slowly — not worth the risk of injury',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'posture-stranger',
        label: 'Posture and assert dominance',
        description: 'Stand tall, hackles raised, teeth bared. Make it clear who owns this land.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.NOV, amount: -3, label: '-NOV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'asserted-territory' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['social', 'territory', 'danger'],
  },

  {
    id: 'wolf-pack-reunion',
    type: 'passive',
    category: 'social',
    narrativeText:
      'The hunt scattered the pack across three miles of forest, but now, as dusk settles over the ridge, the howls begin to converge. One by one they appear from the timber — the alpha pair first, then the yearlings, then the omega, limping slightly but alive. The greeting is ecstatic: tails wagging, muzzles pushed together, high-pitched whines of relief and recognition. The pack circles, sniffs, licks each other\'s faces in the ancient ritual of reunion. Everyone is accounted for. Everyone survived. The pack is whole, and in the arithmetic of wolf survival, wholeness is everything.',
    statEffects: [
      { stat: StatId.TRA, amount: -8, label: '-TRA' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['social', 'pack', 'psychological'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR THREAT EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-bear-encounter',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The black bear appeared from nowhere — a dark, massive shape rising from the berry thicket beside your kill, jaws stained purple, small eyes fixing on the carcass with the flat, calculating stare of an animal that takes what it wants. It is twice your weight and equipped with claws that can peel bark from a living tree. It wants your deer. The growl that comes from its chest is not a warning — it is a statement of intent. You can smell the sour, musky reek of it on the wind.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'defend-kill',
        label: 'Defend the kill',
        description: 'Stand your ground, snarl, and bluff. Bears sometimes back down from determined wolves.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.04,
          cause: 'The bear did not bluff. A single swipe of its paw broke your spine.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'abandon-kill',
        label: 'Abandon the kill',
        description: 'Yield the carcass. You can hunt again; you cannot survive a bear.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['spring', 'summer', 'autumn'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['predator', 'danger', 'food'],
  },

  {
    id: 'wolf-human-trapper',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The scent is wrong. Metal and rubber and something chemical that burns the inside of your nose. You find it half-buried in the trail: a steel leg-hold trap, its jaws spread wide, concealed under a thin layer of leaves and sprinkled with coyote urine. The trapper set it on the game trail you use every night, exactly where your front paw would land. The chain leads to a drag anchor hidden in the brush. Everything about this place screams danger, but the trail is the fastest route to the hunting grounds.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
    ],
    choices: [
      {
        id: 'avoid-trap',
        label: 'Circle wide around the trap',
        description: 'Leave the trail and push through deep brush — slower but safe',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'risk-trail',
        label: 'Try to step over the trap and continue',
        description: 'You can see it — you think you can avoid it. The trail is the only efficient path.',
        statEffects: [
          { stat: StatId.NOV, amount: 3, label: '+NOV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'The trap snapped shut on your leg. The trapper returned at dawn and did not release you.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-trap-injury',
        chance: 0.15,
        conditions: [
          { type: 'has_flag', flag: 'risk-trail-taken' },
        ],
        narrativeText:
          'The trap closed on your paw. You fought it for hours, twisting and biting at the steel, before wrenching free — but the damage is done.',
        footnote: '(Caught in leg-hold trap)',
        statEffects: [
          { stat: StatId.TRA, amount: 12, label: '+TRA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'trap-wound', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['predator', 'danger', 'human', 'trap'],
  },

  {
    id: 'wolf-livestock-raid',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The cattle are close. You can smell them on the night wind — warm, bovine, helpless. They stand in the pasture behind a wire fence that would not slow you for a second, their eyes blank, their instincts dulled by generations of domestication. A calf stands apart from the herd, bawling for its mother. It would be the easiest kill you have ever made. But the farmhouse lights are on, and the last pack that raided this ranch was tracked down and shot by federal wildlife agents within a week.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'raid-livestock',
        label: 'Raid the pasture',
        description: 'Easy food, but the consequences could be fatal for the entire pack',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 5 },
          { type: 'set_flag', flag: 'livestock-raider' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'Wildlife Services tracked you with GPS collar data. A helicopter crew shot you from the air.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'avoid-livestock',
        label: 'Turn away and hunt wild prey',
        description: 'Stay wild. The risk is not worth the easy meal.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'danger', 'human', 'food'],
    footnote: '(Livestock depredation is the leading cause of wolf mortality in recovery zones.)',
  },

  {
    id: 'wolf-rival-pack-fight',
    type: 'active',
    category: 'predator',
    narrativeText:
      'The rival pack appeared on the ridge at first light — six wolves in a tight formation, the alpha at the front, their hackles raised in a bristling line of aggression. They have been encroaching on your territory for weeks, and now they have come to take it. The two packs face each other across the frozen meadow, thirty yards apart, every wolf stiff-legged and snarling. The air vibrates with overlapping growls. One side will charge. The other will either hold or break. There is no negotiation between wolf packs. There is only war.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-rival-pack',
        label: 'Charge with your pack',
        description: 'Meet them head-on. Territory is worth dying for.',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'rival-bite', severity: 0 },
          { type: 'set_flag', flag: 'fought-rival-pack' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'The rival pack overwhelmed you. Multiple wolves pinned you down and the alpha tore your throat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'retreat-rival-pack',
        label: 'Retreat and cede the ground',
        description: 'Fall back to the core territory. Losing ground is better than losing lives.',
        statEffects: [
          { stat: StatId.TRA, amount: 8, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'territory-lost' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['predator', 'danger', 'pack', 'territory'],
    footnote: '(Inter-pack aggression is the leading natural cause of wolf mortality.)',
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-spring-denning',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The alpha female has chosen the den site — a hillside burrow beneath the roots of an old-growth white pine, the entrance facing south to catch the spring sun, the chamber deep enough to stay above freezing even on the coldest nights. She has been excavating for days, her claws black with packed earth, the tunnel now extending six feet into the hillside. The pack gathers around the den in a protective perimeter. Hunting will intensify now — the pregnant female needs more food, not less, and when the pups arrive, the entire pack will shift to the work of feeding them.',
    statEffects: [
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 14,
    cooldown: 12,
    tags: ['seasonal', 'reproduction', 'den'],
  },

  {
    id: 'wolf-summer-pup-rearing',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The rendezvous site is alive with pups. They tumble over each other in the tall grass, chasing grasshoppers, ambushing each other from behind logs, play-fighting with the ferocious intensity of animals rehearsing for a life of real violence. The babysitter — a yearling wolf pressed into service while the hunters are away — watches with exhausted vigilance, intercepting the pup that tries to wander toward the road and retrieving the one that falls into the creek. You regurgitate a meal of half-digested deer meat for them, and they mob you with frantic tail-wagging and high-pitched begging cries. This is the most demanding season of the year.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'has_flag', flag: 'pups-dependent' },
    ],
    weight: 14,
    cooldown: 6,
    tags: ['seasonal', 'pup', 'pack'],
  },

  {
    id: 'wolf-autumn-dispersal',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The yearlings are restless. You can see it in the way they linger at the territory boundaries, staring into the unknown forest beyond the scent posts with a hunger that has nothing to do with food. One of them — a large male with a grey-brown coat — has been sleeping apart from the pack for a week now, eating last, avoiding eye contact with the alpha. The dispersal urge is ancient and irresistible: leave, or be driven out. Find new territory, new genes, a new pack. Most dispersers die within the first year. But the ones that survive become the founders of new packs, and the cycle begins again.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['seasonal', 'dispersal', 'social'],
  },

  {
    id: 'wolf-winter-starvation',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'Three weeks without a successful hunt. The pack is gaunt, ribs showing through dull winter coats, eyes sunken, movements slow. You chew on a frozen moose bone from a kill made weeks ago, cracking it open to reach the marrow — the last calories in a carcass picked clean by ravens and jays. The snow is four feet deep and still falling. The deer have yarded up in dense spruce stands where wolves cannot maneuver. Every failed hunt costs more energy than the pack has to spare. You can feel your body consuming itself — muscle first, then fat reserves that are already dangerously low.',
    statEffects: [
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -4 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'weight_below', threshold: 65 },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['seasonal', 'starvation', 'winter'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-forest-fire',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'The smoke appeared at noon — a grey-brown column rising above the ridge to the west, thickening by the hour until the sun was a red disc and the air tasted of charcoal. By evening the glow was visible, a flickering orange line advancing through the jack pines with a sound like a freight train. The fire is moving with the wind, crowning from tree to tree, and the entire forest is evacuating: deer, moose, bears, all fleeing east in a panicked, interspecies exodus. The pack must move.',
    statEffects: [
      { stat: StatId.TRA, amount: 12, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
    ],
    choices: [
      {
        id: 'flee-fire-river',
        label: 'Flee toward the river',
        description: 'Water is the only firebreak. The river is two miles east.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'The fire crowned and cut off your escape route to the river.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'flee-fire-road',
        label: 'Follow the logging road north',
        description: 'The cleared road may act as a firebreak, but it leads into unknown territory',
        statEffects: [
          { stat: StatId.HOM, amount: 10, label: '+HOM' },
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The fire jumped the road. Smoke and heat overwhelmed you in the ditch.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 4,
    cooldown: 20,
    tags: ['environmental', 'danger', 'fire'],
  },

  {
    id: 'wolf-deep-snow',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The blizzard buried the forest in three feet of fresh powder overnight. The trails are gone. The scent posts are gone. The world has been erased and rewritten in white. You push through the snow with your chest, plowing a trench that the rest of the pack follows in single file — the alpha breaks trail, then rotates to the back when exhausted, and the next wolf takes the lead. It is brutal, energy-intensive travel that burns calories faster than you can replace them. Your paws are balled with ice between the toes, and every step sinks to your belly.',
    statEffects: [
      { stat: StatId.CLI, amount: 8, label: '+CLI' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -2 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['environmental', 'weather', 'winter'],
  },

  {
    id: 'wolf-frozen-lake',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'The lake stretches before you, a vast white plain of ice and snow that would cut three miles off the journey to the deer yard on the far shore. The ice boomed and cracked through the night — the deep, resonant groaning of a frozen body of water adjusting to temperature changes. You can see the dark lines of pressure cracks radiating from the center. The ice might be two feet thick and solid. It might be six inches and rotten. From the shore, there is no way to tell.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    choices: [
      {
        id: 'cross-lake',
        label: 'Cross the lake',
        description: 'Direct and fast, but the ice is uncertain',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The ice gave way beneath you a hundred yards from shore. The water was black and infinite.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'detour-lake',
        label: 'Take the long way around the shore',
        description: 'Slower and more tiring, but the ground is solid',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['environmental', 'danger', 'winter'],
  },

  {
    id: 'wolf-highway-crossing',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'Highway 53 cuts through the forest like a scar, four lanes of asphalt and death. The pack needs to cross — the territory spans both sides, and the deer are on the far side this week. You stand in the ditch at the tree line, watching the headlights sweep past in the darkness, each one a two-ton projectile traveling at seventy miles per hour. The gap between vehicles is never quite long enough. A dead wolf lies on the shoulder a quarter mile north, its body flattened and frozen, a reminder of the cost of miscalculation.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.NOV, amount: 6, label: '+NOV' },
    ],
    choices: [
      {
        id: 'cross-highway',
        label: 'Sprint across during a gap',
        description: 'Wait for the longest gap and run. Do not hesitate.',
        statEffects: [
          { stat: StatId.HOM, amount: 4, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.07,
          cause: 'A truck crested the hill at the wrong moment. You never saw the headlights.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'find-underpass',
        label: 'Search for a culvert or underpass',
        description: 'Wolves have learned to use drainage culverts. There may be one nearby.',
        statEffects: [
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
    ],
    weight: 7,
    cooldown: 8,
    tags: ['environmental', 'danger', 'human'],
    footnote: '(Vehicle collisions are a significant cause of wolf mortality in Minnesota.)',
  },

  // ══════════════════════════════════════════════
  //  FEMALE COMPETITION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-breeding-suppression',
    type: 'active',
    category: 'social',
    narrativeText:
      'The alpha female stands over you, her lips curled back, her body rigid with dominance. She has been increasingly aggressive as the breeding season approaches — pinning you, standing over you, snarling when you show any sign of hormonal readiness. In wolf packs, only the alpha female breeds. Subordinate females are suppressed through constant psychological and physical intimidation until their very hormones obey the hierarchy. Your body wants to breed. Her body says you will not. You can challenge her for breeding rights — but if you lose, you may be driven from the pack entirely.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    choices: [
      {
        id: 'challenge-alpha-female',
        label: 'Challenge the alpha female',
        description: 'Win breeding rights and the best den site for your pups',
        narrativeResult:
          'You stare directly into her eyes — the ultimate challenge. She lunges and you meet her, jaws snapping, bodies twisting in a violent, snarling tangle of fur and teeth. You fight with the desperate intensity of an animal whose bloodline depends on this moment. She is experienced, but you are younger and stronger, and when you finally pin her — your jaws locked around her muzzle, your body pressing hers into the snow — she goes still. She submits. The pack watches in silence. You are the breeding female now, and the best den site is yours.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -8, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'submit-to-alpha',
        label: 'Submit and accept suppression',
        description: 'Stay in the pack but accept subordinate breeding status',
        narrativeResult:
          'You roll onto your back, exposing your throat and belly. She stands over you, teeth bared, and you feel her breath hot on your neck. The submission is total. Your hormones will dampen, your body will not cycle properly, and if you do manage to breed, your pups will be raised in the worst den site — the shallow, exposed scrape at the pack territory\'s edge where rival packs and predators are most likely to find them.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-poor' },
          { type: 'set_flag', flag: 'pack-subordinate' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'wolf-breeding-suppression-bite-sub',
        chance: 0.15,
        narrativeText:
          'The alpha female\'s jaws clamp down on your muzzle during the challenge — a dominance bite that leaves deep punctures across the bridge of your nose. Blood runs into your mouth.',
        footnote: '(Dominance bite from alpha challenge)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'dominance-bite', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'female' },
      { type: 'season', seasons: ['winter', 'spring'] },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['social', 'hierarchy', 'female-competition'],
    footnote: 'In wolf packs, the alpha female actively suppresses reproduction in subordinate females through hormonal stress and physical intimidation. Only 20-40% of subordinate females successfully breed in any given year.',
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'wolf-courtship-howl',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The courtship begins with a duet. The alpha pair separates from the pack at dusk and stands together on the ridge, their bodies pressed flank to flank, and they begin to howl in perfect unison — a sound that is not the full-throated territorial chorus of the pack but something more intimate, more tender, a private conversation pitched for two voices. Their harmonics interweave, rise, fall, and resolve in chords that carry across the frozen lake. The other wolves listen from the rendezvous site, ears pricked, tails still. This is the bond that holds the pack together, renewed each winter in song.',
    statEffects: [
      { stat: StatId.TRA, amount: -5, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'age_range', min: 22 },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['mating', 'social', 'pack'],
  },

  {
    id: 'wolf-denning-prep',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The den must be ready. You excavate with a focus that borders on obsession, claws scraping through frozen soil and tangled roots, hauling mouthfuls of earth from the narrowing tunnel and spitting them outside in growing piles. The chamber at the end must be large enough for a wolf to turn around in, high enough to prevent flooding, deep enough to hold warmth. You line it with fur shed from your own winter coat, pulling out tufts with your teeth and pressing them into the floor. Every instinct says the pups are coming soon, and the den is the difference between life and death for newborns in a Minnesota spring.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'den-prepared' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pregnant' },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 18,
    cooldown: 12,
    tags: ['mating', 'reproduction', 'den'],
  },

  {
    id: 'wolf-pup-survival',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'The smallest pup is not thriving. While its siblings grow fat on regurgitated meat and wrestle with increasing strength, this one hangs back, thin and quiet, its eyes dull, its movements listless. It was the runt from birth — last to nurse, weakest in the litter pile, always pushed aside when food arrives. Nature is not sentimental. In a wild wolf pack, not every pup survives, and the pack\'s resources are finite. The question is whether to invest more in a pup that may not make it, or focus on the strong ones.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.TRA, amount: 4, label: '+TRA' },
    ],
    choices: [
      {
        id: 'feed-runt',
        label: 'Give the runt extra food',
        description: 'Regurgitate a private meal for the weakest pup. It may still pull through.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -1 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'focus-strong',
        label: 'Focus resources on the healthy pups',
        description: 'The strong survive. This is the arithmetic of the wild.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 10,
    cooldown: 10,
    tags: ['reproduction', 'pup', 'pack'],
  },

  {
    id: 'wolf-pup-independence',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The pups are no longer pups. They are rangy, long-legged yearlings with adult teeth and the restless energy of wolves that have outgrown the rendezvous site. They join the hunts now, running at the edges of the formation, learning the geometry of the chase, making mistakes that the older wolves correct with a snap or a body-check. One of them brought down a snowshoe hare on its own last week — a small kill, but the pack celebrated it with the same ecstatic greeting ritual reserved for any returning hunter. They are becoming wolves. Soon they will face the choice that defines every wolf\'s life: stay with the pack, or disperse into the unknown.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.TRA, amount: -4, label: '-TRA' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'pups-just-independent' },
      { type: 'remove_flag', flag: 'pups-dependent' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['gray-wolf'] },
      { type: 'has_flag', flag: 'pups-dependent' },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 16,
    cooldown: 12,
    tags: ['reproduction', 'pup', 'pack', 'dispersal'],
  },
];

export const GRAY_WOLF_EVENTS: GameEvent[] = [
  ...sharedEvents,
  ...wolfEvents,
];
