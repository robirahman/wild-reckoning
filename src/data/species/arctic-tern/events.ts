import type { GameEvent } from '../../../types/events';
import { StatId } from '../../../types/stats';

export const ARCTIC_TERN_EVENTS: GameEvent[] = [
  // ══════════════════════════════════════════════
  //  CHICK/JUVENILE PHASE
  // ══════════════════════════════════════════════

  {
    id: 'tern-first-flight',
    type: 'passive',
    category: 'seasonal',
    narrativeText: 'The wind lifts you from the cliff edge for the first time. For a terrifying moment you drop — then your wings catch the updraft and the world tilts beneath you. The ocean stretches in every direction, glittering and immense. You are flying.',
    statEffects: [
      { stat: StatId.NOV, amount: 10, label: '+NOV' },
      { stat: StatId.ADV, amount: -5, label: '-ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'first-flight-complete' },
    ],
    conditions: [
      { type: 'age_range', max: 6 },
      { type: 'no_flag', flag: 'first-flight-complete' },
    ],
    weight: 30,
    tags: ['milestone', 'juvenile'],
  },

  {
    id: 'tern-colony-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText: 'Your parent returns with a sand eel dangling from its beak, hovering above the nest. The fish is slippery and your coordination is still developing.',
    statEffects: [
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.008 },
    ],
    conditions: [
      { type: 'age_range', max: 3 },
    ],
    weight: 20,
    cooldown: 1,
    tags: ['foraging', 'food', 'juvenile'],
  },

  // ══════════════════════════════════════════════
  //  FORAGING (all ages)
  // ══════════════════════════════════════════════

  {
    id: 'tern-plunge-dive',
    type: 'active',
    category: 'foraging',
    narrativeText: 'You spot a silver flash beneath the surface — a school of sand eels tumbling in the current. You hover, wings beating furiously, then fold and plunge headfirst into the freezing water.',
    statEffects: [
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    choices: [
      {
        id: 'dive-deep',
        label: 'Dive deep',
        description: 'Commit to a full plunge for the largest fish.',
        narrativeResult: 'You strike the water like an arrow, driving a full body-length beneath the surface. Your beak closes on a fat sand eel — the biggest catch in days.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.012 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'skim-surface',
        label: 'Skim the surface',
        description: 'Snatch from the surface — safer but smaller fish.',
        narrativeResult: 'You dip your beak and snag a small fish from the surface, barely wetting your breast feathers. It is a modest meal, but you stay dry and warm.',
        statEffects: [],
        consequences: [
          { type: 'modify_weight', amount: 0.005 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 18,
    cooldown: 2,
    tags: ['foraging', 'food'],
  },

  {
    id: 'tern-krill-swarm',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The water below is stained pink-red with Antarctic krill — millions of tiny crustaceans swarming near the surface. Other terns are already diving, and petrels circle overhead. This is the abundance that drew you halfway across the world.',
    statEffects: [
      { stat: StatId.HOM, amount: -5, label: '-HOM' },
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.015 },
    ],
    conditions: [
      { type: 'has_flag', flag: 'has-migrated' },
    ],
    weight: 15,
    cooldown: 3,
    tags: ['foraging', 'food', 'migration'],
  },

  {
    id: 'tern-tidal-pool-foraging',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The receding tide has left shallow pools along the rocky shore, trapping small fish and shrimp. You wade through ankle-deep water, picking off prey with precision.',
    statEffects: [
      { stat: StatId.WIS, amount: 3, duration: 2, label: '+WIS' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.008 },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['foraging', 'food'],
  },

  // ══════════════════════════════════════════════
  //  PREDATOR ENCOUNTERS
  // ══════════════════════════════════════════════

  {
    id: 'tern-skua-attack',
    type: 'active',
    category: 'predator',
    narrativeText: 'A great skua powers toward the colony with intent — a dark, heavy-bodied pirate twice your size. It is targeting a neighbor\'s nest, but the alarm calls of the colony galvanize you. Skuas are persistent: if one succeeds, it will return.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-dive',
        label: 'Join the mob',
        description: 'Dive-bomb the skua with the colony.',
        narrativeResult: 'You scream in fury, diving at the skua\'s head with your sharp beak. The combined assault of twenty terns drives it away — for now. Your colony bond has strengthened.',
        statEffects: [
          { stat: StatId.HOM, amount: 5, label: '+HOM' },
          { stat: StatId.TRA, amount: -4, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'guard-nest',
        label: 'Guard your nest',
        description: 'Stay on your eggs and hope the mob handles it.',
        narrativeResult: 'You hunker down over your nest, wings spread, beak raised. The mob eventually chases the skua off, but your absence from the defense was noted by your neighbors.',
        statEffects: [
          { stat: StatId.HOM, amount: -3, label: '-HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
      { type: 'age_range', min: 12 },
    ],
    weight: 12,
    cooldown: 4,
    tags: ['predator', 'colony'],
  },

  {
    id: 'tern-gull-predation',
    type: 'active',
    category: 'predator',
    narrativeText: 'A herring gull circles low over the colony edge, watching for unguarded eggs or chicks. Its heavy beak can crush a tern chick in a single strike.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'attack-gull',
        label: 'Attack the gull',
        description: 'Drive it away with aggressive swoops.',
        narrativeResult: 'You streak toward the gull, screaming, and rake its back with your beak. It veers away, surprised by the ferocity of something a third its size. Blood spots your beak tip — its, not yours.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The herring gull caught you mid-dive. One snap of its beak ended your defiance.',
          statModifiers: [{ stat: StatId.STR, factor: -0.0005 }],
        },
      },
      {
        id: 'call-alarm',
        label: 'Sound the alarm',
        description: 'Alert the colony and rely on group defense.',
        narrativeResult: 'Your alarm cry pierces the air, and the colony erupts. The gull retreats before the storm of screaming terns.',
        statEffects: [
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 6 },
    ],
    weight: 10,
    cooldown: 5,
    tags: ['predator'],
  },

  {
    id: 'tern-peregrine-encounter',
    type: 'active',
    category: 'predator',
    narrativeText: 'A peregrine falcon stoops out of the high sky — a gray blur falling faster than anything you have ever seen. It is hunting the flock of terns returning from the fishing grounds.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
    ],
    choices: [
      {
        id: 'evasive-dive',
        label: 'Dive toward the water',
        description: 'Drop altitude — peregrines lose their advantage close to the surface.',
        narrativeResult: 'You fold your wings and plummet toward the waves. The peregrine overshoots, unable to pull out of its stoop so close to the surface. You level off inches from the water, heart hammering.',
        statEffects: [
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
          { stat: StatId.ADV, amount: -3, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'tight-turn',
        label: 'Turn sharply',
        description: 'Use your agility advantage in a tight aerial turn.',
        narrativeResult: 'You bank hard, your forked tail cutting the air like a rudder. The peregrine, built for speed not agility, overshoots on the turn. You escape into the flock.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The peregrine anticipated your turn. Its talons closed around you at 200 miles per hour.',
          statModifiers: [{ stat: StatId.STR, factor: -0.0005 }],
        },
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['predator'],
  },

  // ══════════════════════════════════════════════
  //  MIGRATION EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'tern-departure-south',
    type: 'passive',
    category: 'migration',
    narrativeText: 'The Arctic summer is fading. Days shorten, and an ancient restlessness stirs in your blood. One by one, terns lift from the colony and turn south. The longest migration on Earth begins.',
    statEffects: [
      { stat: StatId.HOM, amount: 8, duration: 3, label: '+HOM' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'will-migrate' },
    ],
    conditions: [
      { type: 'season', seasons: ['autumn'] },
      { type: 'no_flag', flag: 'will-migrate' },
      { type: 'no_flag', flag: 'has-migrated' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    tags: ['migration', 'seasonal'],
  },

  {
    id: 'tern-mid-atlantic-storm',
    type: 'active',
    category: 'environmental',
    narrativeText: 'A mid-Atlantic storm builds to your west — towering cumulonimbus clouds and a wall of rain advancing across the ocean. There is no land for a thousand miles in any direction.',
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fly-through',
        label: 'Fly through it',
        description: 'Push straight through — storms pass quickly at sea.',
        narrativeResult: 'Rain lashes your feathers and wind throws you sideways. For two hours you fight the gale, barely maintaining heading. When the storm passes, you are exhausted but on course.',
        statEffects: [
          { stat: StatId.STR, amount: -6, label: '-STR' },
          { stat: StatId.CLI, amount: -4, label: '-CLI' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.008 },
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.05,
          cause: 'The storm drove you into the sea. Waterlogged and exhausted, you could not lift off from the waves.',
          statModifiers: [{ stat: StatId.STR, factor: -0.0008 }],
        },
      },
      {
        id: 'detour-around',
        label: 'Detour around',
        description: 'Add miles to avoid the worst of the weather.',
        narrativeResult: 'You angle east, adding perhaps fifty miles to your journey. The storm rumbles past to the west, a dark curtain trailing sheets of rain. You are safe but have burned precious fuel reserves on the detour.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.004 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'will-migrate' },
    ],
    weight: 14,
    cooldown: 4,
    tags: ['migration', 'environmental', 'weather'],
  },

  {
    id: 'tern-wind-pattern',
    type: 'active',
    category: 'migration',
    narrativeText: 'The wind shifts. You feel the change in the pressure against your outstretched wings — a massive weather system is rearranging the air currents over the Atlantic. This could help or hinder your journey.',
    statEffects: [],
    choices: [
      {
        id: 'ride-tailwind',
        label: 'Ride the tailwind',
        description: 'Shift course to catch the favorable wind.',
        narrativeResult: 'You angle your wings and the tailwind catches you, carrying you south at twice your normal speed. The ocean blurs beneath you. Miles melt away effortlessly.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.TRA, amount: -3, label: '-TRA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.004 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'stay-course',
        label: 'Maintain course',
        description: 'Your current heading is proven. Don\'t risk getting lost.',
        narrativeResult: 'You push on, steady and straight. The wind is neutral — neither helping nor hindering. You burn calories at the normal rate, trusting your internal compass.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'will-migrate' },
      { type: 'age_range', min: 3 },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['migration'],
  },

  {
    id: 'tern-rest-on-water',
    type: 'active',
    category: 'migration',
    narrativeText: 'Exhaustion weighs on your wings. The ocean below is calm — a rare flat stretch between swells. You could rest on the surface, but floating terns are vulnerable to sharks and exposure.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    choices: [
      {
        id: 'rest-briefly',
        label: 'Rest on the water',
        description: 'Float for a few hours to recover strength.',
        narrativeResult: 'You settle on the ocean surface, tucking your beak under your wing. The gentle rocking of the swells lulls you into a half-sleep. When you rise again, your muscles feel renewed.',
        statEffects: [
          { stat: StatId.HEA, amount: 6, label: '+HEA' },
          { stat: StatId.STR, amount: 5, label: '+STR' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'Something large moved beneath you in the dark water. You never saw what pulled you under.',
        },
      },
      {
        id: 'push-on',
        label: 'Keep flying',
        description: 'Push through the fatigue.',
        narrativeResult: 'You force your wings to keep beating, drawing on reserves you did not know you had. The horizon stretches endlessly ahead.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.006 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'will-migrate' },
    ],
    weight: 10,
    cooldown: 3,
    tags: ['migration'],
  },

  {
    id: 'tern-arrival-south',
    type: 'passive',
    category: 'migration',
    narrativeText: 'Ice. The first unmistakable edge of the Antarctic pack ice appears on the horizon — a white line dividing the dark ocean from the pale sky. The water below teems with krill, fish, and squid. You have reached the bottom of the world.',
    statEffects: [
      { stat: StatId.HOM, amount: -8, label: '-HOM' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'has-migrated' },
      { type: 'no_flag', flag: 'arrived-antarctic' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'arrived-antarctic' },
    ],
    weight: 30,
    tags: ['migration', 'milestone'],
  },

  {
    id: 'tern-departure-north',
    type: 'passive',
    category: 'migration',
    narrativeText: 'The Antarctic daylight is shrinking. The pack ice is advancing, and the krill are retreating to deeper water. The ancient compass in your brain swings north. It is time to return to the Arctic, where the breeding grounds await.',
    statEffects: [
      { stat: StatId.HOM, amount: 6, duration: 3, label: '+HOM' },
    ],
    consequences: [
      { type: 'remove_flag', flag: 'arrived-antarctic' },
    ],
    conditions: [
      { type: 'season', seasons: ['spring'] },
      { type: 'has_flag', flag: 'has-migrated' },
      { type: 'age_range', min: 3 },
    ],
    weight: 30,
    tags: ['migration', 'seasonal'],
  },

  // ══════════════════════════════════════════════
  //  BREEDING / COLONY
  // ══════════════════════════════════════════════

  {
    id: 'tern-mating-encounter',
    type: 'active',
    category: 'reproduction',
    narrativeText:
      'A male Arctic Tern approaches you at the colony edge, his wings vibrating, a small silver fish held carefully in his beak. He offers the fish to you — a courtship gift that proves his ability to provide for future chicks. Mating in the crowded colony is a loud, communal affair, but it is the prerequisite for the long summer of nesting ahead.',
    statEffects: [
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'tern-accept-gift',
        label: 'Accept the gift and mate',
        description: 'Begin the nesting cycle. Gestation is ~3 weeks.',
        narrativeResult: 'You take the fish and allow the male to mount. The bond is sealed. For the next three weeks, you will carry the developing eggs, preparing for the moment you must settle on your scrape.',
        statEffects: [
          { stat: StatId.WIS, amount: 2, label: '+WIS' },
        ],
        consequences: [
          { type: 'start_pregnancy', offspringCount: 0 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'tern-ignore-gift',
        label: 'Ignore the gift',
        description: 'Stay focused on your own fishing. Preserves your strength.',
        narrativeResult: 'You turn your head away and take flight, leaving the hopeful male behind. You are free of the burden of eggs for now, but the breeding season is short in the Arctic.',
        statEffects: [
          { stat: StatId.TRA, amount: 2, label: '+TRA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'mated-this-season' },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'species', speciesIds: ['arctic-tern'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'sex', sex: 'female' },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'pregnant' },
      { type: 'no_flag', flag: 'mated-this-season' },
    ],
    weight: 15,
    cooldown: 8,
    tags: ['reproduction', 'social'],
  },

  {
    id: 'tern-nest-scrape',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'The breeding colony is filling up. The best nest sites — slight depressions in the gravel close to the colony center — are contested. You need to claim a scrape before the prime locations are taken.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'center-site',
        label: 'Fight for a central site',
        description: 'Central nests are safest from skuas but most contested.',
        narrativeResult: 'You chase off two rivals with screaming displays and pecking lunges. The central scrape is yours — surrounded by neighbors who will help defend against predators.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
          { stat: StatId.HOM, amount: 3, label: '+HOM' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'edge-site',
        label: 'Take an edge site',
        description: 'Less competition but more exposed to predators.',
        narrativeResult: 'You settle on the colony periphery. The scrape is undisturbed, but you will be the first line of defense when skuas come hunting.',
        statEffects: [
          { stat: StatId.ADV, amount: 5, label: '+ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'eggs-incubating' },
    ],
    weight: 14,
    cooldown: 6,
    tags: ['reproduction', 'colony'],
  },

  {
    id: 'tern-colony-nest-fight',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A rival pair has occupied the central nest scrape you used last season — the prime spot, deep in the colony where the density of neighbors provides the best protection against skuas. The rival female mantles over the scrape, wings spread, beak raised, while her mate dive-bombs you from above. Central nests lose fewer eggs to predation; edge nests are raided three times as often. Your eggs — your entire breeding season — depend on where you nest.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'dive-bomb-defend',
        label: 'Dive-bomb the rivals and reclaim the scrape',
        description: 'Central colony position means 3x fewer eggs lost to skuas',
        narrativeResult: 'You scream in fury and dive at the rival female, striking her with your wing in a sharp, snapping blow. She retaliates, and the air fills with feathers and shrieking as you batter each other above the contested scrape. Your mate joins the assault from the other side, and the rival pair breaks — retreating to the colony edge, their display of ownership shattered. The central scrape is yours. Your eggs will be surrounded by vigilant neighbors.',
        statEffects: [
          { stat: StatId.HOM, amount: 6, label: '+HOM' },
          { stat: StatId.ADV, amount: -6, label: '-ADV' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'nest-quality-prime' },
        ],
        revocable: false,
        style: 'danger',
      },
      {
        id: 'accept-edge',
        label: 'Accept a position on the colony edge',
        description: 'No fight, but 3x higher skua predation on your eggs',
        narrativeResult: 'You bank away and settle on the colony periphery, where unclaimed scrapes dot the sparse gravel. There are fewer neighbors here — the defensive mob is thinner, the skuas bolder. Last year, the edge nests lost two out of three clutches. You begin to scrape a shallow depression in the gravel, knowing that when the skuas come, you will be the first line of defense and the last.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA' },
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
        eventId: 'tern-nest-fight-wing-strike-sub',
        chance: 0.12,
        narrativeText: 'The rival female\'s wing catches you across the body in a sharp, cracking blow that sends you tumbling sideways in the air. The impact jars your flight muscles and you feel something strain in the wing joint.',
        footnote: '(Wing strike from nest fight)',
        statEffects: [
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'add_injury', injuryId: 'wing-strike', severity: 0 },
        ],
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'nest-quality-prime' },
      { type: 'no_flag', flag: 'nest-quality-poor' },
    ],
    weight: 12,
    cooldown: 6,
    tags: ['reproduction', 'colony', 'female-competition'],
    footnote: 'Nest position within a tern colony strongly predicts breeding success. Central nests benefit from the "selfish herd" effect — surrounded by vigilant neighbors who collectively mob predators. Edge nests suffer 2-3 times higher predation from skuas and gulls.',
  },

  {
    id: 'tern-courtship-fish',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'The courtship display begins with a gift. You must catch the finest fish you can and present it to a potential mate — beak to beak, in an aerial display that proves your skill as a provider.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'big-fish',
        label: 'Catch the biggest fish',
        description: 'An impressive gift, but harder to carry in flight.',
        narrativeResult: 'You plunge deep and emerge with a large sand eel — almost too big to carry in your beak. Your prospective mate watches as you fly the spiraling display flight, fish dangling impressively.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'courtship-success' },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'quick-catch',
        label: 'Any fish will do',
        description: 'Speed matters more than size in courtship.',
        narrativeResult: 'You snatch a small fish and hurry back. Your display is adequate but unremarkable. The female accepts the fish but does not seem deeply impressed.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'sex', sex: 'male' },
      { type: 'season', seasons: ['summer'] },
      { type: 'age_range', min: 24 },
      { type: 'no_flag', flag: 'mating-complete' },
    ],
    weight: 14,
    cooldown: 3,
    tags: ['reproduction', 'mate'],
  },

  {
    id: 'tern-chick-feeding',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'Your chick begs incessantly, its mouth agape. Each fishing trip takes energy you can barely spare, but a hungry chick is a dead chick.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'extra-trip',
        label: 'Make an extra fishing trip',
        description: 'Exhaust yourself to keep the chick well-fed.',
        narrativeResult: 'You make three trips to the fishing grounds before dusk, each one a little more exhausting. The chick is plump and quiet at last, its crop bulging with fish.',
        statEffects: [
          { stat: StatId.STR, amount: -5, label: '-STR' },
          { stat: StatId.HEA, amount: -3, label: '-HEA' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.005 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'normal-feeding',
        label: 'Standard feeding rate',
        description: 'Conserve your own energy while providing basic nutrition.',
        narrativeResult: 'You bring back the usual two fish. The chick eats and grows, though not as quickly as the well-fed chicks in neighboring nests.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'has_flag', flag: 'chicks-dependent' },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 14,
    cooldown: 2,
    tags: ['reproduction', 'foraging'],
  },

  // ══════════════════════════════════════════════
  //  ENVIRONMENTAL
  // ══════════════════════════════════════════════

  {
    id: 'tern-midnight-sun',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'The sun barely dips below the horizon before climbing again. In this land of endless summer daylight, you can fish around the clock. The golden light gilds the water at midnight, and the colony never truly sleeps.',
    statEffects: [
      { stat: StatId.CLI, amount: -5, duration: 2, label: '-CLI' },
      { stat: StatId.HEA, amount: 3, duration: 2, label: '+HEA' },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
      { type: 'region', regionIds: ['arctic-breeding-colony'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['environmental', 'seasonal'],
  },

  {
    id: 'tern-ice-edge-feeding',
    type: 'active',
    category: 'foraging',
    narrativeText: 'The pack ice edge is a boundary of extraordinary productivity. Where cold water meets colder ice, nutrients upwell and phytoplankton blooms feed everything from krill to whales. You hover above a lead in the ice, watching for fish.',
    statEffects: [
      { stat: StatId.CLI, amount: 5, label: '+CLI' },
    ],
    consequences: [
      { type: 'modify_weight', amount: 0.010 },
    ],
    conditions: [
      { type: 'has_flag', flag: 'has-migrated' },
    ],
    weight: 12,
    cooldown: 3,
    tags: ['foraging', 'food', 'migration'],
  },

  {
    id: 'tern-fishing-boat',
    type: 'active',
    category: 'foraging',
    narrativeText: 'A trawler drags its nets through the water ahead, churning up a cloud of bycatch and scraps. Gulls and other seabirds swarm around it. The easy food is tempting, but the nets are dangerous.',
    statEffects: [],
    choices: [
      {
        id: 'follow-trawler',
        label: 'Scavenge behind the trawler',
        description: 'Easy food but risk of entanglement.',
        narrativeResult: 'You dart among the gulls, snatching scraps of fish thrown up by the net. The food is easy but the competition is fierce, and the net cables whip unpredictably through the water.',
        statEffects: [
          { stat: StatId.NOV, amount: 5, label: '+NOV' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.010 },
        ],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.03,
          cause: 'A trawler cable caught your wing, dragging you beneath the waves. Your body joins the bycatch.',
        },
      },
      {
        id: 'avoid-trawler',
        label: 'Avoid the boat',
        description: 'Fish naturally, away from human activity.',
        narrativeResult: 'You veer away from the noise and diesel fumes, returning to the clean open water where fish must be earned through skill.',
        statEffects: [],
        consequences: [],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['foraging', 'human'],
  },

  {
    id: 'tern-aurora-borealis',
    type: 'passive',
    category: 'environmental',
    narrativeText: 'Curtains of green and violet light ripple across the sky, reflecting off the dark water. The aurora borealis — or, in these southern waters, the aurora australis. The light illuminates the night sea, and for a brief time the ocean seems to glow from within.',
    statEffects: [
      { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
      { stat: StatId.WIS, amount: 3, duration: 2, label: '+WIS' },
    ],
    conditions: [
      { type: 'season', seasons: ['winter', 'autumn'] },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['environmental'],
  },

  {
    id: 'tern-oil-slick',
    type: 'active',
    category: 'environmental',
    narrativeText: 'An iridescent sheen coats the water ahead — oil from a distant spill or a passing ship. The slick stinks of petroleum and the fish beneath it are tainted.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fly-around',
        label: 'Fly around the slick',
        description: 'Add miles to avoid contamination.',
        narrativeResult: 'You detour wide around the slick, losing time and energy but keeping your feathers clean. Oil destroys waterproofing — a death sentence for a seabird.',
        statEffects: [
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [
          { type: 'modify_weight', amount: -0.003 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'cross-slick',
        label: 'Cross through',
        description: 'It looks thin enough to risk.',
        narrativeResult: 'You skim low across the slick, and a fine mist of petroleum coats your belly feathers. You preen furiously, but the damage may already be done.',
        statEffects: [
          { stat: StatId.HEA, amount: -8, label: '-HEA' },
          { stat: StatId.CLI, amount: 8, label: '+CLI' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'age_range', min: 3 },
    ],
    weight: 6,
    cooldown: 8,
    tags: ['environmental', 'human', 'pollution'],
  },

  // ══════════════════════════════════════════════
  //  SOCIAL
  // ══════════════════════════════════════════════

  {
    id: 'tern-territorial-display',
    type: 'active',
    category: 'social',
    narrativeText: 'A rival tern lands too close to your nest scrape and raises its beak skyward in a challenge display. In the crowded colony, every few inches of territory matter.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'display-back',
        label: 'Match the display',
        description: 'Stand your ground with a counter-display.',
        narrativeResult: 'You point your beak skyward, spread your wings, and step deliberately toward the intruder. After a tense standoff, the rival backs away. Your territory is secure.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
          { stat: StatId.WIS, amount: 3, label: '+WIS' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
      },
      {
        id: 'escalate',
        label: 'Escalate to pecking',
        description: 'Drive the rival off with physical force.',
        narrativeResult: 'You lunge forward, pecking at the rival\'s head and wings. Feathers fly, and the intruder retreats with a bleeding scalp. But the commotion has attracted a predator\'s attention.',
        statEffects: [
          { stat: StatId.ADV, amount: -8, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'danger',
      },
    ],
    conditions: [
      { type: 'season', seasons: ['summer'] },
      { type: 'age_range', min: 24 },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'rival'],
  },

  {
    id: 'tern-flock-navigation',
    type: 'passive',
    category: 'social',
    narrativeText: 'You fall in with a flock of thirty terns heading south. The collective wisdom of the group — slightly different heading adjustments, altitude changes — creates a navigation intelligence greater than any single bird. You fly easier in their company.',
    statEffects: [
      { stat: StatId.WIS, amount: 5, duration: 3, label: '+WIS' },
      { stat: StatId.HOM, amount: -3, label: '-HOM' },
    ],
    conditions: [
      { type: 'has_flag', flag: 'will-migrate' },
    ],
    weight: 10,
    cooldown: 4,
    tags: ['social', 'migration'],
  },

  // ══════════════════════════════════════════════
  //  LATE GAME / AGING
  // ══════════════════════════════════════════════

  {
    id: 'tern-aging-migration',
    type: 'passive',
    category: 'health',
    narrativeText: 'This migration feels different. Your wings ache earlier, your navigation feels less certain, and the storms that once thrilled you now frighten. You have flown this route more times than you can count, but each crossing takes a greater toll.',
    statEffects: [
      { stat: StatId.HEA, amount: -5, label: '-HEA' },
      { stat: StatId.WIS, amount: 5, label: '+WIS' },
      { stat: StatId.STR, amount: -5, label: '-STR' },
    ],
    conditions: [
      { type: 'age_range', min: 240 },
    ],
    weight: 10,
    cooldown: 6,
    tags: ['health', 'aging'],
  },

  {
    id: 'tern-tenth-migration',
    type: 'passive',
    category: 'seasonal',
    narrativeText: 'You have crossed the planet ten times now — pole to pole and back, tracing an invisible thread between the ice caps. Few creatures alive have seen more of the Earth. The journey is etched into your muscles, your feathers, your very bones.',
    statEffects: [
      { stat: StatId.WIS, amount: 10, label: '+WIS' },
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
    ],
    conditions: [
      { type: 'age_range', min: 120 },
      { type: 'no_flag', flag: 'tenth-migration-noted' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'tenth-migration-noted' },
    ],
    weight: 25,
    tags: ['milestone'],
  },

  // ══════════════════════════════════════════════
  //  COOPERATIVE FORAGING EVENTS
  // ══════════════════════════════════════════════

  {
    id: 'tern-colony-foraging-info',
    type: 'passive',
    category: 'foraging',
    narrativeText: 'You watch {{npc.ally.name}} return to the colony from the south, beak full of sand eels. Other terns notice the direction of arrival and one by one, they launch and fly south. Colonial nesting is not just about safety in numbers — it is an information network. By watching which birds return with full beaks and from what direction, the colony shares real-time intelligence about fish locations. You follow the signal south and find a dense school of sand eels just below the surface.',
    statEffects: [{ stat: StatId.WIS, amount: 2, label: '+WIS' }],
    consequences: [{ type: 'modify_weight', amount: 1 }],
    choices: [],
    subEvents: [],
    conditions: [
      { type: 'species', speciesIds: ['arctic-tern'] },
      { type: 'has_npc', npcType: 'ally' },
      { type: 'season', seasons: ['summer'] },
    ],
    weight: 8,
    cooldown: 6,
    tags: ['foraging', 'social'],
  },
  {
    id: 'tern-polar-bear-colony-raid',
    type: 'active',
    category: 'predator',
    narrativeText: "A massive, cream-colored shape is moving through the colony — a Polar Bear. It is systematically raiding the nests, its huge paws crushing eggs and its jaws snapping up chicks. The air is thick with thousands of terns screaming and diving in a collective attempt to drive the giant away.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA (colony panic)' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-bear',
        label: 'Join the mobbing attack',
        description: 'Dive-bomb the bear to protect the colony. Risky, but can save many nests.',
        narrativeResult: 'You fold your wings and scream, diving at the bear\'s sensitive nose. You strike again and again, joining a cloud of hundreds of other birds. The bear snarls and swathes at the air, eventually deciding the feast isn\'t worth the constant stings. It retreats toward the shoreline.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, label: '+WIS' },
          { stat: StatId.STR, amount: -5, label: '-STR' },
        ],
        consequences: [
          { type: 'modify_population', speciesName: 'Polar Bear', amount: -0.05 }, // Discourages the bear
        ],
        revocable: false,
        style: 'danger',
        deathChance: {
          probability: 0.02,
          cause: 'The bear caught you with a lucky swat during a low dive.',
        },
      },
      {
        id: 'flee-sea',
        label: 'Flee to the sea',
        description: 'Save yourself and wait for the bear to leave.',
        narrativeResult: 'You take to the air and head for the open water, circling at a distance until the bear has finished its grim work and left the colony behind. Many nests are destroyed, but you are safe.',
        statEffects: [
          { stat: StatId.TRA, amount: 5, label: '+TRA (loss of brood)' },
        ],
        consequences: [
          { type: 'modify_population', speciesName: 'Arctic Tern', amount: -0.1 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['arctic-breeding-colony'] },
      { type: 'season', seasons: ['summer'] },
      { type: 'population_above', speciesName: 'Polar Bear', threshold: 0 },
    ],
    weight: 8,
    cooldown: 12,
    tags: ['predator', 'danger', 'social'],
  },
  {
    id: 'tern-salmon-smolt-forage',
    type: 'active',
    category: 'foraging',
    narrativeText: "The river mouth is boiling with activity. Thousands of young Chinook Salmon — smolts — are making their way from the freshwater into the sea. This bottleneck provides an incredible opportunity for a skilled diver. Other terns and gulls are already screaming and plunging into the brackish water, each emerging with a silver flash in its beak.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'plunge-dive-smolts',
        label: 'Plunge-dive for smolts',
        description: 'High energy cost, but high weight gain.',
        narrativeResult: 'You hover twenty feet above the surface, eyes locked on the silver schools below. You tuck your wings and dive, hitting the water with a sharp splash. You emerge with a wriggling smolt and gulp it down before a nearby gull can steal it. You repeat the process until your belly is full.',
        statEffects: [
          { stat: StatId.STR, amount: -4, label: '-STR' },
          { stat: StatId.HOM, amount: -12, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.1 }, // Significant for a bird
          { type: 'modify_population', speciesName: 'Chinook Salmon', amount: -0.05 },
        ],
        revocable: false,
        style: 'default',
      },
      {
        id: 'hover-and-wait',
        label: 'Wait for easier pickings',
        description: 'Less exhausting, but less food.',
        narrativeResult: 'You wait for the tide to push the smolts closer to the surface. It takes longer, but you manage to snag several smaller fish with minimal effort. Your energy remains high, though you are not as full as you could be.',
        statEffects: [
          { stat: StatId.HOM, amount: -5, label: '-HOM' },
        ],
        consequences: [
          { type: 'modify_weight', amount: 0.04 },
        ],
        revocable: false,
        style: 'default',
      },
    ],
    conditions: [
      { type: 'region', regionIds: ['pacific-northwest-river'] },
      { type: 'population_above', speciesName: 'Chinook Salmon', threshold: 0 },
    ],
    weight: 15,
    cooldown: 10,
    tags: ['foraging', 'food'],
  },
];
