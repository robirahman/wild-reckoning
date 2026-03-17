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
      'You flatten onto the ice beside a breathing hole, nose tucked under a forepaw. Wind scours your fur. Hours pass. Then a faint ripple below the ice. You smash through with both forepaws and haul the seal out in a spray of freezing water.',
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
          'The seal twists in your grip and bites into your forepaw. Blood on the ice.',
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
          'You eat the seal meat warm. Trichinella larvae coiled in the muscle fibers pass into your gut.',
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
      'Bearded seals hauled out on a low ice shelf. You approach from downwind, belly to the ice. At thirty meters you sprint. The seals roll toward the water but you reach the nearest one before it slides off the edge.',
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
      'Beluga whales trapped in a shrinking pocket of open water. They surface in turns to breathe, white backs against dark water. You wait at the ice edge. When one rises close, you lunge and hook it with your claws. The blubber smell is overwhelming.',
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
      'A smell reaches you from far downwind, rich and rank. Whale carcass. You follow the scent to the shore. Three other bears are already there, feeding on split-open blubber. You approach. The proximity is tense.',
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
      'No ice. You wade into the shallows and pull kelp from the rocks with your teeth. Bitter, stringy, almost no calories. Your stomach cramps around the unfamiliar food.',
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
      'Seal scent near a crack in the ice. You stalk, but the ice here is thin. Each step creaks. Twenty meters out, the surface gives way beneath your hindquarters. You plunge in to your chest. The seal is gone. You haul out, soaked, shivering.',
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
      'Temperature drops and holds. Grease ice forms along the coast, thickens into pancake ice, consolidates into a solid platform. You step onto it, paws spreading your weight. Seal scent already on the wind.',
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
      'The ice is breaking apart. Shrinking floes separated by widening leads of dark water. Each day the cracks grow wider. You make your last kill and eat every scrap, fat and bone and skin.',
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
      'The next floe is distant, a white shape on grey water. You slide in and swim. Forepaws pulling, steady. The water is below freezing. Your blubber insulates but the swim is long. Hours pass. Muscles burn. Finally, claws scrape ice.',
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
      'The ice groans and flexes beneath you. Cracks radiate outward from your weight. You freeze, then move slowly toward thicker ice. The cracks follow, branching and splitting.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'crawl-carefully',
        label: 'Crawl on your belly to spread your weight',
        description: 'Slow and careful. Maximize surface area.',
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
      'No sun for weeks. The sky shifts through shades of dark blue at midday, then back to black. Green light ripples overhead. You hunt by scent and hearing. Ice creaks. Wind carries seal smell. The world is sound and smell and cold.',
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
      'The sun circles the horizon without setting. Constant light on the ice. No shadows to stalk in. The seals are warier, harder to approach. You hunt, rest, hunt again.',
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
      'The bay will not freeze. You pace the shoreline, testing mush ice that forms at the margins and dissolves by afternoon. No seal scent on the wind. Your fat reserves thin with each day.',
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
      'The ice is breaking up early. Floes that should hold your weight are cracking and drifting apart. The seal hunting grounds are open water. You are forced ashore, lighter than you should be.',
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
      'The ice formed late. It will melt early. The seal-hunting season is shorter than last year. Your body burns through fat faster than you can replace it.',
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
      'The smell of rotting food pulls you toward a human settlement. Refuse piled in the open. Other bears are already rummaging through it. Humans patrol nearby. Your gut is empty.',
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
      'A large male between you and the seal carcass. Head low, swinging. Scarred muzzle, torn ear. He huffs. You feel the sound in your chest. The blubber smell is strong.',
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
      'The female\'s scent trail winds through the pressure ridges, warm against the sterile cold. Another male steps from behind a hummock. Heavy, scarred muzzle, breath pluming. He sees you and stops. Lowers his head. Opens his mouth. The female watches from fifty meters away.',
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
          'You rise onto hind legs. He mirrors you. You slam together chest to chest, forepaws grappling at shoulders and neck. The ice groans. You bite at his face. He rakes your shoulder with claws. The sounds are teeth on bone, tearing hide, heavy breathing fogging the air. Your muscles burn. One of you falters.',
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
          cause: 'His canines found your throat during the grapple.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
      {
        id: 'circle-and-test',
        label: 'Circle and test his resolve',
        description: 'Pace around him, jaw-gape, assess whether he will back down without a full fight',
        narrativeResult:
          'You circle, head low, mouth open, showing canines. He turns to face you. You lunge and snap the air near his face. He flinches but holds. You snap again. He does not move.',
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
          cause: 'He charged without warning and bit into your neck.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'back-away-breeding',
        label: 'Back away',
        description: 'Yield the female. There will be other springs, other chances.',
        narrativeResult:
          'You lower your head and turn sideways. He watches you go. You walk away across the ice, uninjured.',
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
          'His forepaw rakes across you. Four parallel lines through fur and hide. Blood wells up, hot against the cold air.',
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
          'He lunges for your neck. Canines punch through hide into muscle. You wrench free, leaving skin and fur in his teeth. The punctures are deep.',
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
      'Your cubs follow you across the ice. You stop at a breathing hole and flatten down. Forepaws tucked, nose hidden. The cubs try to copy. One pounces on its sibling. You cuff it and resume the position.',
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
      'A deep snowdrift on a south-facing slope. You dig with your forepaws, scooping compacted snow, carving a tunnel that angles upward into a chamber. The entrance lower than the sleeping platform. Cold air drains down and out.',
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
    footnote: 'Pregnant female polar bears enter maternity dens in late October or November and may not emerge until March or April, a fast of up to 8 months, the longest of any mammal.',
  },

  {
    id: 'pb-den-competition',
    type: 'active',
    category: 'social',
    narrativeText:
      'A deep south-facing snowdrift, sheltered. Another female stands at the entrance, breath pluming, body heavy with fat. She is your size. There is one south-facing drift on this slope. The north-facing drifts are shallow and wind-exposed.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'fight-for-den',
        label: 'Fight for the south-facing den',
        description: 'Warmer den means healthier cubs, but she will not yield easily',
        narrativeResult:
          'You charge. The collision shakes snow from the drift. Forepaws grappling, biting at face and neck, claws through thick fur. You drive her backward from the entrance. She breaks off and retreats across the slope. The south-facing drift is yours.',
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
          'You circle the slope. The only other drift faces north. Shallow, wind-scoured, hard-packed. You dig anyway. The chamber feels too small, too cold. Wind will find every crack.',
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
          'Her forepaw catches your shoulder. Four claws through thick fur into the fat beneath. Blood mats your fur.',
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
          'She lunges for your neck. Canines punch through the scruff into muscle. You wrench free. The punctures are deep.',
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
      'You rub your body against a prominent ice ridge, leaving scent from the glands on your feet and face. You urinate on the ice. Steam rises in the cold air. Other bears will smell this and adjust their path.',
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
      'The den is sealed. Your heartbeat slows. Body temperature drops. Outside, blizzards. Inside the snow chamber, still air, warmed by your body. Your fat reserves burn down slowly.',
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
      'Light. Blinding off the snow after months in the dark den. You stand at the entrance and blink. The air smells of open space and distant ocean. You are thin. But seal scent rides the wind from the ice.',
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
      'No ice. The bay is open grey-blue water. You lie on the gravel beach, conserving energy. Your body burns through fat reserves. Other bears sprawl on the tundra nearby, sleeping. Waiting for freeze-up.',
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
    footnote: 'During the ice-free period, polar bears enter a state called "walking hibernation," metabolically similar to a denning bear but while remaining active. They can lose up to 1 kg per day.',
  },

  {
    id: 'pb-autumn-freeze-up',
    type: 'passive',
    category: 'seasonal',
    narrativeText:
      'North wind. Temperature dropping. Shoreline puddles freeze overnight and hold through the day. You test the bay ice each morning, a few steps out, then retreat. Not thick enough yet. But the seal smell is there.',
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
      'A large male has been following your scent for two days. He approaches now, head low, chuffing softly. His shoulders are broad, coat scarred but thick with fat. Your body is ready.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'pb-accept-mate',
        label: 'Accept the boar',
        description: 'Mate and prepare for autumn denning. Pregnancy lasts ~8 months.',
        narrativeResult: 'You allow him to approach. The mating is brief. For the next week you walk together across the ice. Then he wanders off. The embryos will not implant until you den in autumn.',
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
        narrativeResult: 'You snarl and snap at his muzzle. He holds, then turns away across the ice. You are unburdened.',
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
    weight: 12,
    cooldown: 36,  // Real polar bears breed every 3-4 years (cub dependency 2.5y)
    tags: ['reproduction', 'social'],
  },

  {
    id: 'pb-courtship-on-ice',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'Three days following a female\'s scent trail across the pack ice. Her tracks are fresh now. A pale shape moving along a pressure ridge. You approach slowly, head low, chuffing. She turns and faces you.',
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
      'Contractions in the warm darkness of the den. The cubs arrive tiny, blind, covered in fine white fuzz. They nuzzle toward your belly and find the milk. You curl around them. Your body heat keeps them alive.',
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
    footnote: 'Polar bear cubs weigh only 600-700 grams at birth, one of the smallest offspring-to-mother ratios of any placental mammal. The mother may lose over 40% of her body weight during the denning period.',
  },

  {
    id: 'pb-cub-teaching-hunt',
    type: 'passive',
    category: 'reproduction',
    narrativeText:
      'Your cubs follow you onto the ice. You stop at a breathing hole and show them: downwind, flat, still. The older cub holds the pose for almost a minute before pouncing on a piece of floating ice. The younger one falls asleep.',
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
      'Your cubs are nearly three years old. You walk faster, do not wait when they lag, snarl when they approach at a kill. Within days they begin to hunt on their own. Two pale shapes receding across the ice.',
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
    narrativeText: 'A large male approaching. Nose to the wind, moving deliberately. He is not looking at you. He is looking at your cubs. Twice your size. Your cubs press against your hind legs.',
    statEffects: [{ stat: StatId.TRA, amount: 8, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'pb-infanticide-fight',
        label: 'Fight to protect your cubs',
        description: 'Charge the male. You are smaller, but maternal fury is ferocious.',
        narrativeResult: 'You charge. The male rears back. You slash his face with your claws. He retreats, slowly. Your cubs are behind you. You are bleeding but standing.',
        statEffects: [{ stat: StatId.ADV, amount: 6, label: '+ADV' }],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'Killed by the male while defending cubs.',
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
        narrativeResult: 'You herd your cubs and run across the ice. The male chases, gaining. Then he stops. Your cubs are alive.',
        statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
        consequences: [{ type: 'modify_weight', amount: -3 }],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'pb-infanticide-abandon',
        label: 'Abandon the cubs',
        description: 'Walk away. Save yourself for the next breeding season.',
        narrativeResult: 'You turn and walk away across the ice. Behind you, the male approaches the cubs.',
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
    footnote: 'Male polar bears (Ursus maritimus) are well-documented infanticidal predators. Females with cubs avoid large males, but encounters on the sea ice are inevitable. Infanticide is a reproductive strategy: by killing cubs, males can bring females back into estrus months earlier.',
  },
  {
    id: 'pb-infanticide-aftermath',
    type: 'passive',
    category: 'psychological',
    narrativeText: 'The ice where your cubs were is empty. Wind has erased their tracks. You return to the spot, sniffing, circling. Then you move on. You are warier now around large males.',
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
    narrativeText: 'Your mother swats you. Claws retracted, but hard. She has been snarling more when you approach. You are nearly her size now. She turns away and does not wait for you.',
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
    narrativeText: 'Open water to the horizon. Your floe is shrinking. The nearest ice is a dark line far off. The water is below freezing.',
    statEffects: [{ stat: StatId.TRA, amount: 5, label: '+TRA' }],
    consequences: [],
    choices: [
      {
        id: 'pb-swim-now',
        label: 'Swim for it',
        description: 'Enter the water and swim for the distant ice.',
        narrativeResult: 'You slide into the water and swim. Hours pass. Muscles burn, body temperature drops. Finally, ice under your paws. You haul out, shaking.',
        statEffects: [{ stat: StatId.HOM, amount: 6, label: '+HOM' }, { stat: StatId.CLI, amount: 4, label: '+CLI' }],
        consequences: [{ type: 'modify_weight', amount: -4 }],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.08,
          cause: 'Drowned during the open-water crossing.',
          statModifiers: [
            { stat: StatId.HEA, factor: -0.0006 },
          ],
        },
      },
      {
        id: 'pb-swim-wait',
        label: 'Wait on the ice',
        description: 'Hope the wind pushes the floes closer together.',
        narrativeResult: 'You wait. Overnight the wind shifts and the gap narrows. A short swim. But a day without food.',
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
    narrativeText: 'A stretch of coastline. Abundant seal breathing holes. No fresh bear scent. The ice is stable, the pressure ridges provide shelter. The seals surface without caution.',
    statEffects: [],
    consequences: [],
    choices: [
      {
        id: 'pb-settle-claim',
        label: 'Establish your hunting range',
        description: 'Begin patrolling and hunting this area exclusively.',
        narrativeResult: 'You learn every breathing hole and seal haul-out along this stretch. The seals grow warier. You grow more skilled.',
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
        narrativeResult: 'You continue north along the ice edge. Fewer seal holes. Burning calories traveling.',
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
    narrativeText: 'Heat presses down on you. Your dense fur and thick blubber hold it in. You pant, sprawled on a patch of remaining ice. Your body is burning through fat reserves just trying to stay cool.',
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
    narrativeText: "Thousands of terns ahead, screaming. They dive-bomb anything that moves. The ground is covered with nests. Eggs and small, downy chicks. The smell of protein.",
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV (mobbing birds)' },
    ],
    choices: [
      {
        id: 'raid-nests',
        label: 'Raid the colony for eggs and chicks',
        description: 'High weight gain, but risk of injury from sharp beaks.',
        narrativeResult: 'You walk into the colony. Birds strike at your eyes and nose, beaks drawing blood. You gulp down eggs and chicks from nest after nest until your stomach is full.',
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
        narrativeResult: 'The noise and pecking drive you off. You skirt the colony edge and keep moving.',
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

  // ══════════════════════════════════════════════
  //  SEA ICE BREAKUP (missing: #1 modern threat, ~20-30% of deaths)
  // ══════════════════════════════════════════════

  {
    id: 'pb-ice-breakup-swim',
    type: 'active',
    category: 'environmental',
    narrativeText: 'The floe you are resting on cracks. A widening lead of dark water separates you from the main ice sheet. The nearest solid ice is a long swim through open ocean. Your fat reserves will determine whether you reach it.',
    statEffects: [
      { stat: StatId.CLI, amount: 12, label: '+CLI' },
      { stat: StatId.HOM, amount: 10, label: '+HOM' },
    ],
    choices: [
      {
        id: 'swim-for-ice',
        label: 'Swim for the distant ice',
        description: 'A long-distance swim through open water',
        statEffects: [
          { stat: StatId.HEA, amount: -5, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -20 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'Drowned during a long-distance swim between ice floes.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.004 }],
        },
      },
      {
        id: 'swim-to-shore',
        label: 'Swim to the distant shore',
        description: 'Land is farther but certain. No seals there.',
        statEffects: [
          { stat: StatId.HOM, amount: 15, label: '+HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -30 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.06,
          cause: 'Exhaustion during the swim to shore. The water was too cold and the distance too great.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.005 }],
        },
      },
    ],
    conditions: [
      { type: 'season', seasons: ['spring', 'summer'] },
    ],
    weight: 6,
    cooldown: 10,
    tags: ['environmental', 'danger'],
    footnote: 'As Arctic sea ice declines, polar bears are forced to swim longer distances between floes. Swims of over 100 km have been documented, with significant mortality among cubs and weakened adults.',
  },

  // ══════════════════════════════════════════════
  //  SUBSISTENCE HUNTING (missing: #1 known cause of mortality, ~25-35%)
  // ══════════════════════════════════════════════

  {
    id: 'pb-subsistence-hunter',
    type: 'active',
    category: 'predator',
    narrativeText: 'The flat crack of a rifle carries across the ice. You smell humans and machine oil. Snowmobiles sit at the edge of the pressure ridge.',
    statEffects: [
      { stat: StatId.TRA, amount: 18, label: '+TRA' },
      { stat: StatId.ADV, amount: 12, label: '+ADV' },
    ],
    choices: [
      {
        id: 'retreat-downwind',
        label: 'Retreat downwind',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.05,
          cause: 'Shot by a subsistence hunter.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.002 }],
        },
      },
      {
        id: 'stand-ground-hunter',
        label: 'Stand your ground',
        description: 'You are the largest predator on the ice',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.12,
          cause: 'You stood your ground. The hunter did not miss.',
          statModifiers: [{ stat: StatId.HEA, factor: -0.003 }],
        },
      },
    ],
    conditions: [],
    weight: 8,
    cooldown: 12,
    tags: ['predator', 'danger', 'human'],
    footnote: 'Subsistence hunting by Indigenous Arctic communities is currently the greatest known single cause of polar bear mortality, with an average of 800+ bears taken annually across the circumpolar range.',
  },

  // ══════════════════════════════════════════════
  //  EXTENDED FASTING (starvation from reduced hunting access)
  // ══════════════════════════════════════════════

  {
    id: 'pb-extended-fast',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Another day on shore with nothing to eat. You chew kelp washed up on the beach. It does nothing. Your body is consuming its own fat and muscle. The ice will not return for weeks.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, label: '+HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: -15 },
    ],
    conditions: [
      { type: 'season', seasons: ['summer', 'autumn'] },
    ],
    weight: 4,
    cooldown: 12,
    tags: ['environmental', 'starvation'],
    footnote: 'Polar bears can fast for months during ice-free periods, surviving on stored fat. However, as ice-free seasons lengthen, bears face longer fasting periods that can be fatal, particularly for subadults.',
  },
];
