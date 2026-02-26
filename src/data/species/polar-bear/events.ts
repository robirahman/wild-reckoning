import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const POLAR_BEAR_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  HUNTING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-seal-breathing-hole',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'You lower yourself onto the ice beside a ringed seal breathing hole, your black nose tucked beneath a forepaw to hide the only dark spot on your body. Hours pass. The wind scours your fur. Then — a faint ripple, a whisker-twitch of movement beneath the ice. You explode downward, smashing through the thin crust with both forepaws, and haul the seal out in a spray of freezing water.',
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 8 },
    ],
    subEvents: [
      {
        eventId: 'pb-seal-bite-sub',
        chance: 0.12,
        narrativeText:
          'The seal twists in your grip and sinks its teeth into your forepaw before you can deliver the killing bite. Blood stains the ice.',
        footnote: '(Seal bite injury)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'seal-bite', severity: 0 },
        ],
      },
      {
        eventId: 'pb-trichinella-sub',
        chance: 0.08,
        conditions: [
          { type: 'no_parasite', parasiteId: 'trichinella' },
        ],
        narrativeText:
          'You devour the seal meat raw and warm. Coiled within the muscle fibers, Trichinella larvae begin their journey into your gut.',
        footnote: '(Parasitized by Trichinella)',
        statEffects: [],
        consequences: [
          { type: 'add_parasite', parasiteId: 'trichinella', startStage: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['winter', 'spring'] },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food', 'hunting'],
  },

  {
    id: 'pb-seal-haul-out-raid',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'A group of bearded seals has hauled out onto a low ice shelf to bask. You approach from downwind, belly pressed to the ice, moving with glacial patience. At thirty meters you burst into a sprint across the floe. The seals panic and roll toward the water, but you reach the nearest one before it can slide off the edge. The kill is clean and heavy — a bearded seal can weigh more than you.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 12 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['foraging', 'food', 'hunting'],
  },

  {
    id: 'pb-beluga-hunt',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'A pod of beluga whales is trapped in a shrinking polynya — a pocket of open water surrounded by thickening ice. They surface in turns to breathe, their white backs ghostly against the dark water. You station yourself at the edge and wait. When a beluga rises close enough, you lunge and hook it with your claws. The struggle is immense, but blubber is the richest food in the Arctic.',
    statEffects: [
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 20 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 4,
    cooldown: 8,
    tags: ['foraging', 'food', 'hunting'],
  },

  {
    id: 'pb-whale-carcass',
    type: 'passive',
    category: 'foraging',
    narrativeText:
      'The wind carries a smell so rich and rank it makes your mouth water from a kilometer away. A bowhead whale carcass has washed ashore, its flanks split open by decay and the feeding of other bears. You approach cautiously — three other bears are already there, gorging on blubber. There is enough for everyone, but proximity to other bears is always tense.',
    statEffects: [
      { stat: StatId.HOM, amount: -10, label: '-HOM' },
      { stat: StatId.TRA, amount: 3, label: '+TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 15 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 5,
    cooldown: 10,
    tags: ['foraging', 'food', 'social'],
  },

  {
    id: 'pb-kelp-foraging',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Stranded ashore with no ice to hunt from, you wade into the shallows and pull strands of kelp from the rocks with your teeth. It is bitter, stringy, and nearly devoid of calories — a carnivore reduced to grazing like a herbivore. Your stomach cramps around the unfamiliar food. This is what the ice-free season has become.',
    statEffects: [
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 1 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 12,
    cooldown: 2,
    tags: ['foraging', 'food', 'desperation'],
  },

  {
    id: 'pb-failed-hunt-thin-ice',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'You spot a seal basking near a crack in the ice and begin your stalk. But the ice here is thin and rotten — each step produces an ominous creak. Twenty meters from the seal, a section gives way beneath your hindquarters and you plunge into the water up to your chest. The seal vanishes. You haul yourself out, soaked and shivering, calories spent for nothing.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
      { stat: StatId.ADV, amount: 4, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -3 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring', 'autumn'] },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['foraging', 'hunting', 'danger'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-sea-ice-formation',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The temperature drops below minus thirty and holds. Along the coastline, grease ice forms first — a slick, oily sheen that thickens into pancake ice, then consolidates into a solid platform stretching toward the horizon. The sea ice is back. You step onto it with something like joy, your massive paws spreading your weight across the surface. The hunting season has begun.',
    statEffects: [
      { stat: StatId.ADV, amount: -8, label: '-ADV' },
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.CLI, amount: -3, label: '-CLI' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 12,
    cooldown: 10,
    tags: ['environment', 'ice', 'seasonal'],
    footnote: 'Sea ice formation in Hudson Bay typically occurs in November, though the date has shifted later by an average of 2-3 weeks since the 1980s.',
  },

  {
    id: 'pb-ice-breakup',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The ice is disintegrating. What was a solid highway to the seal hunting grounds is now a maze of shrinking floes separated by widening leads of dark water. Each day the cracks grow wider and the floes smaller. Soon there will be nothing left but open ocean and a long, hungry summer on land. You make your last kill and eat every scrap, fat and bone and skin, packing on every calorie you can before the fast begins.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 5 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 12,
    cooldown: 10,
    tags: ['environment', 'ice', 'seasonal'],
    footnote: 'Hudson Bay ice breakup has advanced by roughly 3 weeks since 1979. Each week of earlier breakup costs bears approximately 10 kg of body condition.',
  },

  {
    id: 'pb-swimming-between-floes',
    type: 'active',
    category: 'environmental',
    narrativeText:
      'The next floe is visible but distant — a white raft on the grey sea. You slide into the water and begin to swim, your massive forepaws pulling you forward in a steady dog-paddle. The water is minus one degree Celsius. Your thick blubber insulates you, but the swim is long and the current fights you. Hours pass. Your muscles burn. Finally, your claws scrape ice and you haul yourself out, exhausted.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -5 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['environment', 'swimming', 'danger'],
    footnote: 'Polar bears have been recorded swimming over 600 km continuously. Long-distance swims increase with sea ice loss but carry significant metabolic costs and drowning risk, especially for cubs.',
  },

  {
    id: 'pb-thin-ice-danger',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The ice beneath you groans and flexes. A web of cracks radiates outward from where you stand. You freeze, distributing your weight carefully, then begin to move — slowly, so slowly — toward thicker ice. Each step is a negotiation with physics. The cracks chase you, branching and splitting.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'crawl-carefully',
        label: 'Crawl on your belly to spread your weight',
        description: 'Slow and careful — maximize surface area',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'sprint-to-safety',
        label: 'Sprint for the thick ice',
        description: 'Fast but the impact of each step could shatter the floe',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Drowned after falling through thin sea ice',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring', 'autumn'] },
    ],
    weight: 7,
    cooldown: 6,
    tags: ['environment', 'ice', 'danger'],
  },

  {
    id: 'pb-polar-night',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The sun does not rise. It has not risen for weeks. The sky cycles through shades of indigo and violet at midday before descending back into starlit darkness. The aurora borealis ripples overhead, green and pink curtains of light that illuminate the ice in an eerie glow. You hunt by starlight and scent alone. The world has become a place of sound and smell.',
    statEffects: [
      { stat: StatId.NOV, amount: 3, label: '+NOV' },
      { stat: StatId.CLI, amount: 4, label: '+CLI' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['winter'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['environment', 'seasonal'],
    footnote: 'At the latitude of Hudson Bay, the polar night is not total, but December and January see only a few hours of twilight. True polar night occurs above the Arctic Circle.',
  },

  {
    id: 'pb-midnight-sun',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The sun circles the horizon without setting, a pale disc that gilds the ice in perpetual golden light. There is no night. Time becomes meaningless — you hunt, rest, and hunt again in an endless luminous haze. The seals are wary in this constant light, harder to stalk when there are no shadows to hide in.',
    statEffects: [
      { stat: StatId.NOV, amount: 2, label: '+NOV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 8,
    cooldown: 8,
    tags: ['environment', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  CLIMATE CHANGE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-late-ice-formation',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'November passes. Then December begins, and still the bay refuses to freeze. The water is too warm, holding summer heat deep in its currents. You pace the shoreline, testing the mush ice that forms at the margins and dissolves by afternoon. Your fat reserves are dwindling. Every day without ice is a day without seals.',
    statEffects: [
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -8 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['environment', 'climate-change', 'ice'],
    footnote: 'Freeze-up in western Hudson Bay now occurs an average of 2-3 weeks later than in the 1980s. This directly reduces the time bears have to build fat reserves for summer fasting.',
  },

  {
    id: 'pb-early-ice-melt',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'The ice is breaking up weeks ahead of schedule. In April the floes should be solid enough to support your weight anywhere, but this year the southern edge of the ice pack has already retreated past your hunting grounds. You are forced ashore lighter than you should be, facing a longer fast with fewer reserves.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -6 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring'] },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['environment', 'climate-change', 'ice'],
    footnote: 'Spring breakup in Hudson Bay now occurs roughly 3 weeks earlier than historical averages. For every week of earlier breakup, bears come ashore approximately 10 kg lighter.',
  },

  {
    id: 'pb-reduced-hunting-window',
    type: 'passive',
    category: 'environmental',
    narrativeText:
      'You do the math that every polar bear does instinctively: the ice formed late and it will melt early. The window for seal hunting — your entire annual caloric budget — has shrunk again. Last year it was five months. The year before, five and a half. Your grandmother hunted for seven months on the ice. The numbers are going in one direction.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
    ],
    weight: 6,
    cooldown: 12,
    tags: ['environment', 'climate-change'],
    footnote: 'The ice-free season in western Hudson Bay has increased by approximately 3 weeks since 1979. The polar bear population in this region has declined by roughly 30% since the mid-1980s.',
  },

  {
    id: 'pb-garbage-dump',
    type: 'active',
    category: 'foraging',
    narrativeText:
      'Driven ashore by the melting ice and weakened by weeks of fasting, you follow the smell of refuse to the outskirts of a human settlement. The dump is a chaos of plastic bags, rotting food scraps, and rusted metal. Other bears are already here, rummaging through the garbage. It is degrading and dangerous — humans with cracker shells and rubber bullets patrol nearby — but your body demands calories.',
    statEffects: [
      { stat: StatId.NOV, amount: 8, label: '+NOV' },
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'scavenge-dump',
        label: 'Scavenge the dump',
        description: 'Risk human confrontation for desperately needed calories',
        statEffects: [
          { stat: StatId.ADV, amount: 4, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 3 },
          { type: 'set_flag', flag: 'scavenged-human-garbage' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'Destroyed as a problem bear near human settlement',
          statModifiers: [{ stat: StatId.HEA, factor: -0.001 }],
        },
      },
      {
        id: 'leave-dump',
        label: 'Turn away and keep fasting',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['foraging', 'human', 'climate-change', 'desperation'],
    footnote: 'As ice-free seasons lengthen, polar bear-human conflict increases. Churchill, Manitoba has a "Polar Bear Alert" program and a "polar bear jail" to manage bears that enter town.',
  },

  // ══════════════════════════════════════════════
  //  SOCIAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-rival-confrontation',
    type: 'active',
    category: 'social',
    narrativeText:
      'A large male stands between you and the seal carcass, his head lowered and swinging. He is at least your size, maybe bigger, his scarred muzzle and torn ear speaking of many fights won. He huffs a warning — a deep, resonant sound that you feel in your chest. The carcass is rich with blubber. But so is he with muscle.',
    statEffects: [
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'challenge-rival',
        label: 'Challenge for the carcass',
        description: 'Stand tall, jaw-gape, and fight if he does not yield',
        statEffects: [
          { stat: StatId.ADV, amount: 8, label: '+ADV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 6 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'Killed by rival male polar bear',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'yield-to-rival',
        label: 'Yield and move on',
        description: 'Live to hunt another day',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'male' },
    ],
    weight: 8,
    cooldown: 5,
    tags: ['social', 'conflict', 'danger'],
  },

  {
    id: 'pb-breeding-fight',
    type: 'active',
    category: 'social',
    narrativeText:
      'The female is close — you can smell her trail woven through the pressure ridges, warm and urgent against the sterile cold of the ice. But you are not the only male who has followed it. Another bear steps out from behind a hummock, massive and deliberate, his breath pluming in the frozen air. He is heavy with spring seal fat, his shoulders rolling with muscle beneath scarred hide. His muzzle is a map of old fights — torn lip, notched ear, a canine-width groove across the bridge of his nose. He sees you and stops. Lowers his head. Opens his mouth to show the yellowed canines. The female watches from fifty meters away, indifferent to which of you survives this.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'grapple-rival',
        label: 'Rise up and grapple',
        description: 'Rear onto your hind legs, lock forepaws with him, and fight with everything you have',
        narrativeResult:
          'You rise onto your hind legs and he mirrors you — two half-ton animals standing upright on the ice like grotesque dancers. You slam together chest to chest, forepaws grappling for purchase on each other\'s shoulders and neck. The ice groans beneath your combined weight. You bite at his face; he rakes your shoulder with claws the length of a man\'s finger. You shove and twist, trying to throw him down where you can pin him. The sound is terrible — the wet crack of teeth on bone, the tearing of hide, grunts of exertion that fog the air between you. Minutes pass. Your muscles burn with lactic acid. Finally, one of you falters, and the other presses the advantage with savage, single-minded fury.',
        statEffects: [
          { stat: StatId.HOM, amount: 15, label: '+HOM' },
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -4 },
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.03,
          cause: 'Killed in a breeding fight with a rival male polar bear. His canines found your throat.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'circle-and-test',
        label: 'Circle and test his resolve',
        description: 'Pace around him, jaw-gape, assess whether he will back down without a full fight',
        narrativeResult:
          'You do not charge. Instead you begin to circle, head low, mouth open to display your canines. He turns to face you, mirroring your arc. You are reading each other — every scar, every pound of body mass, every subtle signal of confidence or hesitation. You lunge forward and snap the air near his face; he flinches but holds his ground. You repeat the display, each feint a question: are you sure? How much are you willing to pay for this? The negotiation is silent and brutal in its honesty.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -2 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.005,
          cause: 'The rival male charged without warning during a circling display and delivered a fatal bite to the neck.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'back-away-breeding',
        label: 'Back away',
        description: 'Yield the female — there will be other springs, other chances',
        narrativeResult:
          'You lower your head and turn your body sideways — the universal signal of submission among bears. He watches you go with flat, expressionless eyes, his breath still heavy with adrenaline. You walk away across the ice, and with each step the urgency drains from your body and is replaced by something quieter: the knowledge that discretion has kept you alive and whole for another breeding season. The scars you do not carry are worth more than the ones you would have earned.',
        statEffects: [
          { stat: StatId.TRA, amount: 3, label: '+TRA' },
          { stat: StatId.WIS, amount: 4, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [
      {
        eventId: 'pb-breeding-claw-rake-sub',
        chance: 0.30,
        narrativeText:
          'In the grapple, his forepaw rakes across you with terrible force — claws tearing through fur and hide in four parallel lines. Blood wells up instantly, hot against the cold air, and the pain arrives a half-second later like fire drawn across your skin.',
        footnote: '(Bear claw rake injury)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'bear-claw-rake', severity: 0 },
        ],
      },
      {
        eventId: 'pb-breeding-bite-wound-sub',
        chance: 0.20,
        narrativeText:
          'He lunges for your neck and his jaws clamp down — you feel the canines punch through your hide and into the muscle beneath. You wrench sideways and tear free, leaving skin and fur in his teeth. The puncture wounds are deep and already swelling.',
        footnote: '(Bear bite wound)',
        statEffects: [
          { stat: StatId.HEA, amount: -6, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'bear-bite-wound', severity: 1 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['spring'] },
      { type: 'age_range', min: 60 },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['social', 'conflict', 'breeding', 'danger'],
    footnote: 'Male polar bears fight intensely during the spring breeding season (March-May) over access to receptive females. Fights involve standing on hind legs and grappling, biting at the face, neck, and shoulders. Scars on a male\'s muzzle and neck are reliable indicators of breeding experience and dominance status.',
  },

  {
    id: 'pb-mother-cub-teaching',
    type: 'passive',
    category: 'social',
    narrativeText:
      'Your cubs tumble after you across the ice, mimicking your every move with clumsy enthusiasm. You stop at a seal breathing hole and demonstrate the technique: lie flat, forepaws tucked, nose hidden. Wait. The cubs try to copy you but cannot hold still — one pounces on its sibling, sending both rolling. You cuff the offender gently and resume the lesson. Patience is the first thing a polar bear must learn.',
    statEffects: [
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.WIS, amount: 3, label: '+WIS' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'cubs-dependent' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'reproduction', 'parenting'],
  },

  {
    id: 'pb-den-construction',
    type: 'active',
    category: 'social',
    narrativeText:
      'You find a snowdrift on a south-facing slope and begin to dig. Your massive forepaws scoop out compacted snow, carving a tunnel that angles upward into a chamber just large enough for your body. The work is hard but the engineering is precise — the entrance must be lower than the sleeping platform so cold air drains away. Inside, your body heat will raise the temperature to near freezing even when it is minus forty outside.',
    statEffects: [
      { stat: StatId.HOM, amount: -6, label: '-HOM' },
      { stat: StatId.CLI, amount: -5, label: '-CLI' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'has-den' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['autumn', 'winter'] },
      { type: 'sex', sex: 'female' },
    ],
    weight: 10,
    cooldown: 12,
    tags: ['social', 'denning', 'seasonal'],
    footnote: 'Pregnant female polar bears enter maternity dens in late October or November and may not emerge until March or April — a fast of up to 8 months, the longest of any mammal.',
  },

  {
    id: 'pb-den-competition',
    type: 'active',
    category: 'social',
    narrativeText:
      'You have found the perfect denning site — a deep, south-facing snowdrift on a sheltered slope, the kind that will hold its shape through the worst blizzards and warm to near freezing from your body heat alone. But another pregnant female has found it too. She stands at the entrance to the drift, her breath pluming, her body heavy with the fat reserves that will sustain her through months of fasting and nursing. She is your size, perhaps slightly larger, and she has no intention of leaving. There is only one south-facing drift on this slope. The north-facing drifts are shallow, poorly insulated, and exposed to the prevailing wind — a den dug there will cost more energy to heat and offer less protection for newborn cubs.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-for-den',
        label: 'Fight for the south-facing den',
        description: 'Warmer den means healthier cubs, but she will not yield easily',
        narrativeResult:
          'You charge. The two of you collide with a force that shakes snow from the overhanging drift — half a ton of pregnant bear slamming into half a ton of pregnant bear. You grapple with forepaws, biting at face and neck, your claws raking through thick fur. She is strong but you are desperate, and desperation has its own kind of strength. You drive her backward, away from the drift entrance, pressing every advantage of angle and footing. She breaks off and retreats across the slope, huffing with exertion. The south-facing drift is yours. Your cubs will be born in warmth.',
        statEffects: [
          { stat: StatId.HOM, amount: 8, label: '+HOM' },
          { stat: StatId.ADV, amount: -6, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
          { type: 'modify_weight', amount: -3 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'search-elsewhere',
        label: 'Search for another drift',
        description: 'Avoid the fight, but the north-facing slopes are poor denning sites',
        narrativeResult:
          'You turn away and circle the slope, searching for alternatives. The only viable drift faces north — shallow, wind-scoured, the snow packed hard rather than soft. You dig anyway, carving a tunnel that angles upward into a chamber that feels too small, too cold, too exposed. When the blizzards come, the wind will find every crack. Your cubs will be born in a den that costs you more calories to heat and offers less insulation than the one you walked away from.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
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
        eventId: 'pb-den-fight-claw-rake-sub',
        chance: 0.25,
        narrativeText:
          'Her forepaw catches you across the shoulder during the grapple, four claws tearing through your thick fur and into the fat beneath. Blood mats your fur in dark streaks.',
        footnote: '(Claw rake from den fight)',
        statEffects: [
          { stat: StatId.HEA, amount: -4, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'bear-claw-rake', severity: 0 },
        ],
      },
      {
        eventId: 'pb-den-fight-bite-wound-sub',
        chance: 0.15,
        narrativeText:
          'She lunges for your neck and her jaws close on the thick scruff, canines punching through hide into muscle. You wrench free but the punctures are deep and already swelling.',
        footnote: '(Bite wound from den fight)',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'bear-bite-wound', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'season', seasons: ['autumn'] },
      { type: 'has_flag', flag: 'has-den' },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 12,
    cooldown: 12,
    tags: ['social', 'denning', 'female-competition'],
    footnote: 'Pregnant female polar bears compete for prime denning sites. South-facing snowdrifts with deep, stable snow provide the best insulation and are strongly preferred. Den quality directly affects cub survival rates.',
  },

  {
    id: 'pb-territorial-marking',
    type: 'active',
    category: 'social',
    narrativeText:
      'You pause at a prominent ice ridge and rub your body against it, leaving scent from glands on your feet and face. Then you urinate on the ice, the steam rising in the cold air. This is not territory in the way a wolf claims territory — polar bears are too solitary for that — but it is a message: I am here, I am large, I passed this way recently. Other bears will read it and adjust their movements accordingly.',
    statEffects: [
      { stat: StatId.ADV, amount: -2, label: '-ADV' },
      { stat: StatId.NOV, amount: -2, label: '-NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
    ],
    weight: 8,
    cooldown: 4,
    tags: ['social'],
  },

  // ══════════════════════════════════════════════
  //  SEASONAL EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-winter-denning',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The den is complete. You seal yourself inside and your metabolism begins to slow. Your heart rate drops. Your body temperature decreases slightly. Outside, blizzards rage and temperatures plunge below minus fifty, but inside your snow chamber the air is still and almost warm. If you are pregnant, your cubs will be born here in the deepest cold of January — blind, hairless, and utterly dependent on your dwindling fat reserves.',
    statEffects: [
      { stat: StatId.CLI, amount: -8, label: '-CLI' },
      { stat: StatId.HOM, amount: -4, label: '-HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -10 },
      { type: 'set_flag', flag: 'denning' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'has-den' },
    ],
    weight: 15,
    cooldown: 12,
    tags: ['seasonal', 'denning'],
    footnote: 'Unlike true hibernators, denning polar bears maintain a body temperature above 31 degrees C. They can wake quickly if disturbed, which is important for defending cubs from threats.',
  },

  {
    id: 'pb-spring-emergence',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The light is blinding. After months in the darkness of the den, the spring sun reflecting off the snow is almost painful. You stand at the den entrance and blink, breathing air that tastes of open space and distant ocean. You are thin — gaunt, even — having lost a third of your body weight through the denning period. But the ice is out there, and on the ice, seals are waiting.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: -4, label: '-ADV' },
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'denning' },
      { type: 'remove_flag', flag: 'has-den' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring'] },
      { type: 'has_flag', flag: 'denning' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['seasonal', 'denning'],
  },

  {
    id: 'pb-summer-land-fasting',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The ice is gone. All of it. The bay is a flat expanse of grey-blue water without a floe in sight. You lie on the gravel beach, conserving energy, your body burning through the fat reserves you built during the spring seal hunt. Nearby, other bears do the same — sprawled on the tundra like pale boulders, sleeping twenty hours a day, waiting for the world to freeze again.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, label: '+HOM' },
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -8 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['seasonal', 'fasting'],
    footnote: 'During the ice-free period, polar bears enter a state called "walking hibernation" — metabolically similar to a denning bear but while remaining active. They can lose up to 1 kg per day.',
  },

  {
    id: 'pb-autumn-freeze-up',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'The wind has shifted to the north and the temperature is plummeting. Along the shoreline, puddles freeze overnight and do not thaw by noon. You test the bay ice each morning, venturing a few steps out before retreating. Not yet. Not strong enough. But soon. The anticipation is electric — you have been fasting for months, living on reserves, and the hunger is a constant, gnawing companion. When the ice sets, you will hunt.',
    statEffects: [
      { stat: StatId.ADV, amount: -3, label: '-ADV' },
      { stat: StatId.HOM, amount: 3, label: '+HOM' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['autumn'] },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['seasonal', 'ice'],
  },

  // ══════════════════════════════════════════════
  //  REPRODUCTION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-mating-sow',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'A large boar polar bear has been shadowing you for two days, his scent thick and urgent on the wind. He approaches now, head low, making soft chuffing sounds. You assess him: he is massive, his shoulders broad, his coat scarred but thick with fat. Mating will initiate a long biological burden — delayed implantation means you will not den for months — but your cycle is at its peak.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'pb-accept-mate',
        label: 'Accept the boar',
        description: 'Mate and prepare for autumn denning. Pregnancy lasts ~8 months.',
        narrativeResult: 'You allow the boar to approach. The mating is brief but intense. For the next week, you walk together across the ice before he finally wanders off. You are now carrying the potential for new life, though the embryos will not implant until you enter your maternity den in autumn.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'pb-reject-mate',
        label: 'Reject the boar',
        description: 'Flee or drive him off. Preserves your strength for hunting.',
        narrativeResult: 'You snarl and snap at his muzzle, making it clear his advances are unwelcome. After a tense standoff, he turns away — there are other sows on the ice. You remain unburdened, free to focus entirely on your own survival.',
        statEffects: [
          { stat: StatId.TRA, amount: 4, label: '+TRA' },
          { stat: StatId.ADV, amount: 3, label: '+ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 60 },
      { type: 'no_flag', flag: 'pregnant' },
      { type: 'no_flag', flag: 'mated-this-season' },
      { type: 'no_flag', flag: 'cubs-dependent' },
    ],
    weight: 20,
    cooldown: 24,
    tags: ['reproduction', 'social'],
  },

  {
    id: 'pb-courtship-on-ice',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'You have been following the scent trail of a female for three days across the pack ice. Her tracks are fresh now, and you can see her — a pale shape moving along the edge of a pressure ridge. You approach with deliberate slowness, head low, making soft chuffing sounds. She turns to assess you: your size, your condition, the breadth of your shoulders. If you pass her inspection, you will walk together for days before she allows mating.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
      { stat: StatId.NOV, amount: -4, label: '-NOV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['spring'] },
      { type: 'sex', sex: 'male' },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 10,
    cooldown: 8,
    tags: ['reproduction', 'social'],
    footnote: 'Polar bear courtship involves pairs walking and resting together for days or even weeks before mating. Males may follow females for over 100 km across the sea ice.',
  },

  {
    id: 'pb-denning-birth',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'In the warm darkness of the den, you feel the contractions begin. The birth is quick — your cubs arrive tiny, blind, and covered in fine white fuzz, each one small enough to fit in a human hand. They instinctively nuzzle toward your belly, finding the rich milk that is over 30% fat. You curl around them, your massive body a furnace against the Arctic cold. Everything now depends on the fat you stored last spring.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -8 },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['winter'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'pregnant' },
      { type: 'has_flag', flag: 'denning' },
    ],
    weight: 20,
    cooldown: 12,
    tags: ['reproduction', 'denning'],
    footnote: 'Polar bear cubs weigh only 600-700 grams at birth — one of the smallest offspring-to-mother ratios of any placental mammal. The mother may lose over 40% of her body weight during the denning period.',
  },

  {
    id: 'pb-cub-teaching-hunt',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'Your cubs are old enough now to follow you onto the ice for their first real hunting lesson. You lead them to a breathing hole and show them how to position themselves — downwind, flat on the belly, perfectly still. The older cub manages to hold the pose for almost a minute before attacking a piece of floating ice. The younger one falls asleep. You have two and a half years to turn these clumsy bundles into apex predators.',
    statEffects: [
      { stat: StatId.WIS, amount: 2, label: '+WIS' },
      { stat: StatId.ADV, amount: -2, label: '-ADV' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'cubs-dependent' },
      { type: 'season', seasons: ['spring', 'winter'] },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['reproduction', 'parenting'],
  },

  {
    id: 'pb-cub-independence',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'The time has come. Your cubs are nearly three years old, as large as you were when your own mother drove you away. You begin to distance yourself — walking faster, not waiting when they lag, snarling when they approach at a kill. They are confused at first, trailing behind with bewildered huffs. But instinct runs deep, and within days they begin to hunt on their own. You watch them go, two pale shapes receding across the ice, and feel the strange lightness of a body that is once again your own.',
    statEffects: [
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'cubs-dependent' },
      { type: 'set_flag', flag: 'cubs-just-independent' },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'cubs-dependent' },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['reproduction', 'parenting'],
  },

  // ══════════════════════════════════════════════
  //  INFANTICIDE EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'pb-male-infanticide-encounter',
    type: 'active',
    category: 'predator',
    narrativeText: 'A large male polar bear is approaching — slowly, deliberately, nose to the wind. He is not interested in you. He is interested in your cubs. Male polar bears regularly kill cubs to bring females back into estrus. The male is twice your size and utterly indifferent to your snarling. Your cubs press against your hind legs, whimpering.',
    statEffects: [{ stat: StatId.TRA, amount: 8, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'pb-infanticide-fight',
        label: 'Fight to protect your cubs',
        description: 'Charge the male. You are smaller, but maternal fury is ferocious.',
        narrativeResult: 'You charge with a roar that echoes across the ice. The male rears back, startled by your aggression. You slash his face with your claws and he retreats — but slowly, assessing whether you are worth the effort. This time, he decides you are not. Your cubs survive. You are bleeding but standing.',
        statEffects: [{ stat: StatId.ADV, amount: 6, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'Killed by a male bear while defending cubs',
          statModifiers: [{ stat: StatId.HEA, factor: -0.0006 }],
          escapeOptions: [
            {
              id: 'pb-infanticide-desperate-attack',
              label: 'Go for the eyes',
              description: 'Target the most vulnerable spot.',
              survivalModifier: 0.04,
            },
            {
              id: 'pb-infanticide-bluff-retreat',
              label: 'Feint and retreat',
              description: 'Make him think you are giving up, then run with the cubs.',
              survivalModifier: 0.03,
              statCost: [{ stat: StatId.HOM, amount: 4, label: '+HOM' }],
            },
          ],
        },
      },
      {
        id: 'pb-infanticide-flee',
        label: 'Flee with the cubs',
        description: 'Run. You cannot outfight him, but you might outrun him.',
        narrativeResult: 'You herd your cubs and run. The male gives chase across the ice, gaining steadily. After a terrifying pursuit, he stops — the effort of chasing is not worth it when easier targets exist. Your cubs are shaken but alive.',
        statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
        consequences: [{ type: 'modify_weight', amount: -3 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'pb-infanticide-abandon',
        label: 'Abandon the cubs',
        description: 'Walk away. Save yourself for the next breeding season.',
        narrativeResult: 'You turn and walk away. Behind you, the male approaches the cubs. You do not look back. The loss is biological calculus — you can breed again. The cubs cannot be saved without risking your own life.',
        statEffects: [{ stat: StatId.TRA, amount: 15, label: '+TRA' }],
        consequences: [{ type: 'set_flag', flag: 'infanticide-occurred' }],
        revocable: false,
        style: 'danger',
      },
    ],
    subEvents: [
      {
        eventId: 'pb-infanticide-flee-caught',
        chance: 0.40,
        conditions: [{ type: 'has_flag', flag: 'infanticide-occurred' }],
        narrativeText: '',
        statEffects: [],
        consequences: [],
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'cubs-dependent' },
    ],
    weight: 5,
    cooldown: 12,
    tags: ['predator', 'social'],
    footnote: 'Male polar bears (Ursus maritimus) are well-documented infanticidal predators. Females with cubs avoid large males, but encounters on the sea ice are inevitable. Infanticide is a reproductive strategy — by killing cubs, males can bring females back into estrus months earlier.',
  },
  {
    id: 'pb-infanticide-aftermath',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'The ice where your cubs last played is empty. The wind has already erased their tracks. You return to the spot repeatedly, sniffing, circling, before finally moving on. The loss reshapes your behavior — you are warier now, quicker to flee from large males, more alert to danger on the horizon. The Arctic is indifferent to grief.',
    statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }, { stat: StatId.WIS, amount: 3, label: '+WIS' }],
    consequences: [{ type: 'remove_flag', flag: 'infanticide-occurred' }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'infanticide-occurred' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['psychological'],
  },
  {
    id: 'pb-mother-separation',
    type: 'passive',
    category: 'social',
    narrativeText: 'Your mother has been increasingly aggressive toward you. Today she turns and swats you — claws retracted, but the message is unmistakable. You are nearly three years old now, large enough to hunt seals on your own. She has tolerated your presence long enough. The next time she mates, she will need you gone. The bond that kept you alive through two Arctic winters is severing, one growl at a time.',
    statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }, { stat: StatId.NOV, amount: 6, label: '+NOV' }],
    consequences: [{ type: 'set_flag', flag: 'dispersal-begun' }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'age_range', min: 30, max: 42 },
      { type: 'no_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 9,
    cooldown: 12,
    tags: ['social'],
  },
  {
    id: 'pb-dispersal-long-swim',
    type: 'active',
    category: 'environmental',
    narrativeText: 'Open water stretches to the horizon. The ice floe you are on is shrinking, and the nearest substantial ice is kilometers away — a dark line barely visible against the sky. You must swim. Polar bears are strong swimmers, but open-ocean crossings kill young bears every year. The water is -1°C and the distance is uncertain.',
    statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'pb-swim-now',
        label: 'Swim for it',
        description: 'Enter the water and swim for the distant ice.',
        narrativeResult: 'You slide into the freezing water and begin the long paddle. Hours pass. Your muscles burn, your body temperature drops. But finally, ice appears beneath your paws. You haul yourself out, shaking and exhausted.',
        statEffects: [{ stat: StatId.HOM, amount: 6, label: '+HOM' }, { stat: StatId.CLI, amount: 4, label: '+CLI' }],
        consequences: [{ type: 'modify_weight', amount: -4 }],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'Drowned during an open-water crossing between ice floes',
          statModifiers: [
            { stat: StatId.HEA, factor: -0.0006 },
          ],
        },
      },
      {
        id: 'pb-swim-wait',
        label: 'Wait on the ice',
        description: 'Hope the wind pushes the floes closer together.',
        narrativeResult: 'You wait. The wind shifts overnight and the gap narrows enough to swim safely. But the waiting cost you a day without food.',
        statEffects: [{ stat: StatId.HOM, amount: 4, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['danger', 'exploration'],
  },
  {
    id: 'pb-dispersal-territory-claim',
    type: 'active',
    category: 'environmental',
    narrativeText: 'You have found a stretch of coastline with abundant seal breathing holes and no fresh bear sign. The ice here is stable, the pressure ridges provide shelter, and the seals are naive — they surface without checking for predators. This could be your hunting ground.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'pb-settle-claim',
        label: 'Establish your hunting range',
        description: 'Begin patrolling and hunting this area exclusively.',
        narrativeResult: 'You settle into a routine of patient hunting, learning every breathing hole and seal haul-out. The seals become warier, but you become more skilled. This is your ice now.',
        statEffects: [{ stat: StatId.WIS, amount: 5, label: '+WIS' }, { stat: StatId.NOV, amount: -5, label: '-NOV' }],
        consequences: [
          { type: 'set_flag', flag: 'dispersal-settled' },
          { type: 'remove_flag', flag: 'dispersal-begun' },
          { type: 'modify_territory', qualityChange: 20 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'pb-settle-continue',
        label: 'Keep moving along the coast',
        description: 'The ice may be better further north.',
        narrativeResult: 'You continue north along the ice edge. The hunting is thinner here, and you burn calories traveling. Perhaps you should have stayed.',
        statEffects: [{ stat: StatId.HOM, amount: 3, label: '+HOM' }],
        consequences: [{ type: 'modify_weight', amount: -2 }],
        revocable: false,
        style: 'default',
      },
    ],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'has_flag', flag: 'dispersal-begun' },
      { type: 'no_flag', flag: 'dispersal-settled' },
      { type: 'age_range', min: 48 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['exploration'],
  },
  {
    id: 'pb-summer-heat-stress',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The summer heat is oppressive. You are built for -40°C, not +25°C. Your dense fur and thick blubber layer — essential for Arctic winter survival — are now liabilities. You pant heavily, sprawled on a patch of remaining ice, unable to hunt. Every hour in this heat burns through your fat reserves. Polar bears are the most heat-sensitive of all Arctic mammals.',
    statEffects: [
      { stat: StatId.CLI, amount: 6, label: '+CLI' },
      { stat: StatId.HOM, amount: 4, label: '+HOM' },
    ],
    consequences: [{ type: 'modify_weight', amount: -3 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['polar-bear'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'weather', weatherTypes: ['heat_wave'] },
    ],
    weight: 9,
    cooldown: 4,
    tags: ['environmental'],
  },
  {
    id: 'pb-arctic-tern-colony-raid',
    type: 'active',
    category: 'foraging',
    narrativeText: "The ground ahead is white with the wings of thousands of Arctic Terns. Their high-pitched screams fill the air as they dive-bomb anything that approaches. The ground is littered with nests containing eggs and small, downy chicks. It is a bounty of protein, but the birds are relentless in their defense.",
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV (mobbing birds)' },
    ],
    choices: [
      {
        id: 'raid-nests',
        label: 'Raid the colony for eggs and chicks',
        description: 'High weight gain, but risk of injury from sharp beaks.',
        narrativeResult: 'You lumber into the colony, ignoring the cloud of screaming birds. You systematically raid the nests, gulping down eggs and chicks. The terns strike at your eyes and nose, their sharp beaks drawing blood, but you gorge yourself until you are full.',
        statEffects: [
          { stat: StatId.HOM, amount: -15, label: '-HOM' },
          { stat: StatId.HEA, amount: -5, label: '-HEA (pecks)' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 8 },
          { type: 'modify_population', speciesName: 'Arctic Tern', amount: -0.2 },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'bypass-colony',
        label: 'Bypass the colony',
        narrativeResult: 'The noise and the constant pecking are not worth the effort. You skirt the edge of the colony, leaving the birds to their frantic defense.',
        statEffects: [
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['arctic-breeding-colony'] },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 12,
    cooldown: 8,
    tags: ['foraging', 'food', 'danger'],
  },
];
