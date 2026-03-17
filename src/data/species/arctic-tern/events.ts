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
    narrativeText: 'Wind pushes under your spread wings and the rock drops away beneath your feet. Your body falls, then lifts. Salt air rushes across your feathers and the colony shrinks to specks below.',
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
    narrativeText: 'A sand eel dangles above you, gripped in a beak. You lunge and miss. The fish slaps wet against your face before you manage to clamp down on it.',
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
    narrativeText: 'Silver flickers below the surface. A school of sand eels, turning in the current. You hover, wings blurring, locking the image through polarized light.',
    statEffects: [
      { stat: StatId.TRA, amount: -3, label: '-TRA' },
    ],
    choices: [
      {
        id: 'dive-deep',
        label: 'Dive deep',
        description: 'Commit to a full plunge for the largest fish.',
        narrativeResult: 'You fold and punch through the surface. Cold water closes over your head. Your beak clamps on a fat sand eel and you kick upward, breaking into air with the fish squirming.',
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
        description: 'Snatch from the surface, safer but smaller fish.',
        narrativeResult: 'You dip your beak and snag a small fish from the surface. Your breast feathers stay dry. The fish is thin and goes down fast.',
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
    narrativeText: 'The water below is stained pink-red with krill. Millions of crustaceans churn near the surface. Other terns plunge around you, petrels wheeling above.',
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
    narrativeText: 'The tide has pulled back, leaving rock pools. Small fish and shrimp flick in the shallows. You step through the cold water, striking at movement.',
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
    narrativeText: 'A dark shape, heavy-bodied and twice your size, drives toward the colony. Alarm calls erupt from every direction. The skua banks toward a neighbor\'s nest.',
    statEffects: [
      { stat: StatId.TRA, amount: 8, label: '+TRA' },
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-dive',
        label: 'Join the mob',
        description: 'Dive-bomb the skua with the colony.',
        narrativeResult: 'You dive at the skua\'s head, beak-first, screaming. Twenty terns strike together. The skua veers off and flaps heavily away over the water.',
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
        narrativeResult: 'You press flat over your eggs, wings spread, beak up. The mob drives the skua off without you. Nearby terns settle back to their scrapes, facing away from you.',
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
    narrativeText: 'A herring gull circles low over the colony edge. Its heavy beak hangs open. It is watching the nests.',
    statEffects: [
      { stat: StatId.ADV, amount: 8, label: '+ADV' },
    ],
    choices: [
      {
        id: 'attack-gull',
        label: 'Attack the gull',
        description: 'Drive it away with aggressive swoops.',
        narrativeResult: 'You streak toward the gull and rake its back with your beak. It flinches sideways, banking hard. Blood on your beak tip. Not yours.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, label: '-ADV' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.04,
          cause: 'The gull caught you mid-dive. Its beak closed around your body.',
          statModifiers: [{ stat: StatId.STR, factor: -0.0005 }],
        },
      },
      {
        id: 'call-alarm',
        label: 'Sound the alarm',
        description: 'Alert the colony and rely on group defense.',
        narrativeResult: 'Your alarm call cuts the air. The colony lifts. The gull wheels away from the mass of diving birds.',
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
    narrativeText: 'A gray shape drops from high altitude, accelerating. Peregrine. It is falling toward the returning flock faster than any bird you have seen fly.',
    statEffects: [
      { stat: StatId.TRA, amount: 10, label: '+TRA' },
    ],
    choices: [
      {
        id: 'evasive-dive',
        label: 'Dive toward the water',
        description: 'Drop altitude. Peregrines lose their advantage close to the surface.',
        narrativeResult: 'You fold and drop toward the waves. The peregrine overshoots, pulling up hard near the surface. You level off just above the water, wing tips skimming spray.',
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
        narrativeResult: 'You bank hard, forked tail twisting. The peregrine overshoots on the turn, unable to match your arc. You slip into the flock.',
        statEffects: [
          { stat: StatId.STR, amount: -3, label: '-STR' },
          { stat: StatId.TRA, amount: -5, label: '-TRA' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.06,
          cause: 'The peregrine read the turn. Talons closed around your body at full stoop speed.',
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
    narrativeText: 'The light is shortening. A tension builds in your breast muscles, a restlessness that does not ease. Other terns lift from the colony and turn south. You follow.',
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
    narrativeText: 'Dark cloud mass building to the west. Wind shifting, pressure dropping against your wings. Rain wall advancing across open ocean. No land in any direction.',
    statEffects: [
      { stat: StatId.CLI, amount: 10, label: '+CLI' },
      { stat: StatId.TRA, amount: 6, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fly-through',
        label: 'Fly through it',
        description: 'Push straight through. Storms pass quickly at sea.',
        narrativeResult: 'Rain batters your feathers. Wind throws you sideways. You fight for heading, wings straining. When it passes, you are on course but spent.',
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
          cause: 'Wind drove you into the waves. Waterlogged feathers. Could not lift off.',
          statModifiers: [{ stat: StatId.STR, factor: -0.0008 }],
        },
      },
      {
        id: 'detour-around',
        label: 'Detour around',
        description: 'Add miles to avoid the worst of the weather.',
        narrativeResult: 'You angle east. The storm passes to the west, rain sheets trailing behind it. The detour burns through your fat reserves.',
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
    narrativeText: 'Pressure shifts against your outstretched wings. The wind has changed direction. Air currents are rearranging over the open water.',
    statEffects: [],
    choices: [
      {
        id: 'ride-tailwind',
        label: 'Ride the tailwind',
        description: 'Shift course to catch the favorable wind.',
        narrativeResult: 'You angle your wings into the new current. The tailwind doubles your speed. Ocean slides past below with less effort per wingbeat.',
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
        narrativeResult: 'You hold your heading. The wind is neutral. You beat steadily south, the magnetic pull constant in your skull.',
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
    narrativeText: 'Your wing muscles ache. The ocean below is flat between swells. You could land on the surface, but a floating bird is exposed from beneath.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
    ],
    choices: [
      {
        id: 'rest-briefly',
        label: 'Rest on the water',
        description: 'Float for a few hours to recover strength.',
        narrativeResult: 'You settle onto the water and tuck your beak under your wing. The swells rock you. When you lift off again, the ache has faded.',
        statEffects: [
          { stat: StatId.HEA, amount: 6, label: '+HEA' },
          { stat: StatId.STR, amount: 5, label: '+STR' },
        ],
        consequences: [],
        revocable: false,
        style: 'default',
        deathChance: {
          probability: 0.02,
          cause: 'Something large moved beneath you in the dark water. A pull from below.',
        },
      },
      {
        id: 'push-on',
        label: 'Keep flying',
        description: 'Push through the fatigue.',
        narrativeResult: 'You keep beating. Wing muscles burn. The horizon line does not change. Water below, air above, and you between them.',
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
    narrativeText: 'A white line on the horizon. Pack ice. The water below thickens with krill, fish, squid. The UV glare off the ice is blinding and familiar.',
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
    narrativeText: 'Daylight shrinking. Ice advancing. Krill dropping deeper. The magnetic pull in your skull swings north. You lift off and turn.',
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
      'A male approaches at the colony edge, wings vibrating, a silver fish gripped in his beak. He extends the fish toward you. Around you, the colony noise is constant.',
    statEffects: [
      { stat: StatId.NOV, amount: 4, label: '+NOV' },
    ],
    choices: [
      {
        id: 'tern-accept-gift',
        label: 'Accept the gift and mate',
        description: 'Begin the nesting cycle. Gestation is ~3 weeks.',
        narrativeResult: 'You take the fish from his beak. He mounts. The eggs will develop inside you over the next three weeks.',
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
        narrativeResult: 'You turn your head and lift off, leaving him standing with the fish. The air is open ahead of you.',
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
    weight: 8,
    cooldown: 18,  // ~1.5 years between successful nestings (many fail in real life)
    tags: ['reproduction', 'social'],
  },

  {
    id: 'tern-nest-scrape',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'The colony gravel is filling with nesting birds. The shallow scrapes near the center are contested. You need a spot.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'center-site',
        label: 'Fight for a central site',
        description: 'Central nests are safest from skuas but most contested.',
        narrativeResult: 'You lunge and scream at two rivals until they back off. The central scrape is yours, surrounded by other nesting birds.',
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
        narrativeResult: 'You settle on the edge. The gravel scrape is open and uncontested. Fewer neighbors here. More open sky above.',
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
    narrativeText: 'A rival pair holds the central scrape you used last season. The female mantles over it, wings spread, beak up. Her mate dive-bombs you from above. Edge nests lose eggs three times as often to skuas.',
    statEffects: [
      { stat: StatId.ADV, amount: 6, label: '+ADV' },
    ],
    choices: [
      {
        id: 'dive-bomb-defend',
        label: 'Dive-bomb the rivals and reclaim the scrape',
        description: 'Central colony position means 3x fewer eggs lost to skuas',
        narrativeResult: 'You dive at the rival female and strike her with your wing. She strikes back. Feathers scatter. Your mate attacks from the other side. The rival pair breaks and retreats to the colony edge. The central scrape is yours.',
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
        narrativeResult: 'You bank away and settle on the periphery. Unclaimed scrapes in sparse gravel. Fewer neighbors. You begin to hollow out a depression, exposed to the open sky.',
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
        narrativeText: 'The rival\'s wing catches you across the body. A cracking impact. Something strains in your wing joint as you tumble sideways.',
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
    footnote: 'Nest position within a tern colony strongly predicts breeding success. Central nests benefit from the "selfish herd" effect, surrounded by vigilant neighbors who collectively mob predators. Edge nests suffer 2-3 times higher predation from skuas and gulls.',
  },

  {
    id: 'tern-courtship-fish',
    type: 'active',
    category: 'reproduction',
    narrativeText: 'A female watches from the colony edge. You need a fish to present. Beak to beak, in the air.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'big-fish',
        label: 'Catch the biggest fish',
        description: 'An impressive gift, but harder to carry in flight.',
        narrativeResult: 'You plunge deep and come up with a large sand eel, almost too heavy for your beak. You spiral upward in the display flight, the fish dangling.',
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
        narrativeResult: 'You snatch a small fish and return. The display flight is brief. The female takes the fish but turns away after.',
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
    narrativeText: 'Your chick holds its mouth open, calling without pause. Each trip to the fishing grounds costs more than the last.',
    statEffects: [
      { stat: StatId.HOM, amount: 5, label: '+HOM' },
    ],
    choices: [
      {
        id: 'extra-trip',
        label: 'Make an extra fishing trip',
        description: 'Exhaust yourself to keep the chick well-fed.',
        narrativeResult: 'Three trips to the fishing grounds before dusk. Each return heavier in the wings. The chick is finally still, crop bulging.',
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
        narrativeResult: 'Two fish. The chick swallows them and calls for more, but you settle onto the scrape. Neighboring chicks are larger.',
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
    narrativeText: 'The sun grazes the horizon and rises again. Continuous light. You can see fish at any hour. The colony noise never stops.',
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
    narrativeText: 'Where dark water meets ice edge, the surface churns with life. Krill clouds, fish schools, whale spouts in the distance. You hover above a lead in the ice, watching for movement below.',
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
    narrativeText: 'A large floating shape drags cables through the water, churning up dead fish and scraps. Gulls swarm around it. The smell of fish is strong. The cables whip unpredictably.',
    statEffects: [],
    choices: [
      {
        id: 'follow-trawler',
        label: 'Scavenge behind the trawler',
        description: 'Easy food but risk of entanglement.',
        narrativeResult: 'You dart between the gulls, snatching fish scraps flung up by the net. Cables swing past. The food comes fast.',
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
          cause: 'A cable caught your wing and pulled you under the surface.',
        },
      },
      {
        id: 'avoid-trawler',
        label: 'Avoid the boat',
        description: 'Fish naturally, away from human activity.',
        narrativeResult: 'You veer away from the noise and acrid fumes. Open water ahead. Fish are harder to find here but the air is clean.',
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
    narrativeText: 'Green and violet light ripples across the sky, reflecting off the dark water. The shifting glow illuminates the sea surface. Your UV-sensitive eyes pick up wavelengths invisible to most birds.',
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
    narrativeText: 'An iridescent sheen on the water ahead. The sharp chemical smell hits you in flight. The fish below are coated in it.',
    statEffects: [
      { stat: StatId.TRA, amount: 5, label: '+TRA' },
    ],
    choices: [
      {
        id: 'fly-around',
        label: 'Fly around the slick',
        description: 'Add miles to avoid contamination.',
        narrativeResult: 'You fly wide around the slick. The detour burns energy, but your feathers stay clean and waterproof.',
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
        narrativeResult: 'You cross low over the slick. A fine chemical mist coats your belly feathers. You preen at them but the substance clings.',
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
    narrativeText: 'A tern lands within striking distance of your scrape and points its beak skyward. Challenge posture.',
    statEffects: [
      { stat: StatId.ADV, amount: 5, label: '+ADV' },
    ],
    choices: [
      {
        id: 'display-back',
        label: 'Match the display',
        description: 'Stand your ground with a counter-display.',
        narrativeResult: 'You point your beak up, spread your wings, and step toward the intruder. It holds, then backs off the scrape.',
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
        narrativeResult: 'You lunge and peck at its head and wings. Feathers scatter. The rival retreats, bleeding from the scalp. The commotion draws attention from above.',
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
    narrativeText: 'Thirty terns, heading south. You fall in among them. Their small heading corrections and altitude shifts pull at your own flight path. You fly easier in the group.',
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
    narrativeText: 'Your wings ache sooner than they used to. The magnetic sense wavers at times. Storms that once passed through you now batter hard. Each crossing takes more.',
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
    narrativeText: 'Ten pole-to-pole crossings. The route is in your body now. Wind patterns, feeding stops, magnetic waypoints. Your feathers are worn thinner each year.',
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
    narrativeText: '{{npc.ally.name}} returns from the south, beak full of sand eels. Other terns notice the direction and launch one by one, heading south. You follow. A dense school of sand eels churns just below the surface.',
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
    narrativeText: "A massive pale shape moves through the colony. Huge paws crush nests. Jaws snap up chicks. Thousands of terns scream and dive at it.",
    statEffects: [
      { stat: StatId.TRA, amount: 15, label: '+TRA (colony panic)' },
      { stat: StatId.ADV, amount: 10, label: '+ADV' },
    ],
    choices: [
      {
        id: 'mob-bear',
        label: 'Join the mobbing attack',
        description: 'Dive-bomb the bear to protect the colony. Risky, but can save many nests.',
        narrativeResult: 'You dive at the bear\'s nose, striking with your beak. Hundreds of terns do the same. The bear snarls and swats the air. It turns and lumbers toward the shoreline.',
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
          cause: 'The bear swatted you out of the air on a low dive.',
        },
      },
      {
        id: 'flee-sea',
        label: 'Flee to the sea',
        description: 'Save yourself and wait for the bear to leave.',
        narrativeResult: 'You fly out over open water and circle at a distance. The bear feeds until it is done, then leaves. Crushed shells and silence behind it.',
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
    narrativeText: "The river mouth churns with silver. Thousands of salmon smolts pour from freshwater into the sea. Other terns and gulls are already plunging into the brackish water, each emerging with a fish.",
    statEffects: [
      { stat: StatId.NOV, amount: 5, label: '+NOV' },
    ],
    choices: [
      {
        id: 'plunge-dive-smolts',
        label: 'Plunge-dive for smolts',
        description: 'High energy cost, but high weight gain.',
        narrativeResult: 'You hover above the surface, eyes locked on the silver mass below. Tuck and dive. A sharp splash, cold water, a wriggling smolt in your beak. You gulp it down and dive again until your belly is heavy.',
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
        narrativeResult: 'You wait for the tide to push smolts closer to the surface. Slower, but less effort per fish. You snag several small ones without full dives.',
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

  // ── Parasite Events ──
  {
    id: 'tern-mosquito-stopover',
    type: 'passive',
    category: 'health',
    narrativeText: 'At a coastal stopover, mosquitoes swarm at dusk. They find the thin skin around your eyes and the base of your bill. The biting does not stop.',
    statEffects: [
      { stat: StatId.HEA, amount: -3, label: '-HEA' },
      { stat: StatId.IMM, amount: -2, label: '-IMM' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'avian-malaria' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'avian-malaria' },
      { type: 'season', seasons: ['summer'] },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite'],
  },
  {
    id: 'tern-feather-lice-colony',
    type: 'passive',
    category: 'health',
    narrativeText: 'Close quarters in the colony. Something crawls along your flight feathers. Lice, transferred from neighboring birds, gnawing the barbs.',
    statEffects: [
      { stat: StatId.HEA, amount: -2, label: '-HEA' },
    ],
    consequences: [
      { type: 'add_parasite', parasiteId: 'feather-lice' },
    ],
    conditions: [
      { type: 'no_parasite', parasiteId: 'feather-lice' },
    ],
    cooldown: 9999,
    weight: 3,
    tags: ['health', 'parasite', 'social'],
  },
];
