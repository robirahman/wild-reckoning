import type { GameState } from '../store/gameStore';
import { computeEffectiveValue, StatId } from '../types/stats';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  /** Check at end of turn or on death */
  checkOn: 'turn' | 'death' | 'both';
  /** If set, only check/show for these species IDs */
  species?: string | string[];
  check: (state: GameState) => boolean;
  /** Returns partial progress for display. Undefined = binary unlock. */
  progress?: (state: any) => { current: number; target: number } | null;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Survival milestones
  {
    id: 'survivor-10',
    name: 'First Steps',
    description: 'Survive 10 turns.',
    checkOn: 'both',
    check: (s) => s.time.turn >= 10,
    progress: (s) => ({ current: Math.min(s.time.turn, 10), target: 10 }),
  },
  {
    id: 'survivor-50',
    name: 'Seasoned Survivor',
    description: 'Survive 50 turns.',
    checkOn: 'both',
    check: (s) => s.time.turn >= 50,
    progress: (s) => ({ current: Math.min(s.time.turn, 50), target: 50 }),
  },
  {
    id: 'survivor-100',
    name: 'Enduring Spirit',
    description: 'Survive 100 turns.',
    checkOn: 'both',
    check: (s) => s.time.turn >= 100,
    progress: (s) => ({ current: Math.min(s.time.turn, 100), target: 100 }),
  },
  {
    id: 'survive-winter',
    name: 'Winter Survivor',
    description: 'Survive until Spring.',
    checkOn: 'turn',
    check: (s) => s.time.season === 'spring' && s.time.turn > 0,
  },
  {
    id: 'first-migration',
    name: 'Wanderer',
    description: 'Complete a migration.',
    checkOn: 'turn',
    check: (s) =>
      s.animal.flags.has('has-migrated') ||
      s.animal.flags.has('reached-spawning-grounds') ||
      s.animal.flags.has('arrived-antarctic') ||
      s.animal.region === 'oyamel-fir-forest-mexico',
  },

  // Fitness achievements
  {
    id: 'first-offspring',
    name: 'New Life',
    description: 'Produce your first offspring.',
    checkOn: 'turn',
    check: (s) =>
      (s.reproduction.type === 'iteroparous' && s.reproduction.offspring.length > 0) ||
      (s.reproduction.type === 'semelparous' && s.reproduction.spawned),
  },
  {
    id: 'fitness-5',
    name: 'Genetic Legacy',
    description: 'Reach a fitness score of 5 or more.',
    checkOn: 'both',
    check: (s) => s.reproduction.totalFitness >= 5,
    progress: (s) => ({ current: Math.min(Math.floor(s.reproduction.totalFitness), 5), target: 5 }),
  },

  // Health challenges
  {
    id: 'parasite-survivor',
    name: 'Parasite Survivor',
    description: 'Survive while carrying 2 or more parasites.',
    checkOn: 'turn',
    check: (s) => s.animal.parasites.length >= 2 && s.animal.alive,
  },
  {
    id: 'injury-recovery',
    name: 'Scarred but Standing',
    description: 'Survive a turn with 2 or more active injuries.',
    checkOn: 'turn',
    check: (s) => s.animal.injuries.length >= 2 && s.animal.alive,
  },

  // Stat achievements
  {
    id: 'peak-health',
    name: 'Peak Condition',
    description: 'Reach 90+ Health.',
    checkOn: 'turn',
    check: (s) => computeEffectiveValue(s.animal.stats[StatId.HEA]) >= 90,
    progress: (s) => ({ current: Math.min(Math.round(computeEffectiveValue(s.animal.stats[StatId.HEA])), 90), target: 90 }),
  },
  {
    id: 'wise-elder',
    name: 'Wise Elder',
    description: 'Reach 80+ Wisdom.',
    checkOn: 'turn',
    check: (s) => computeEffectiveValue(s.animal.stats[StatId.WIS]) >= 80,
    progress: (s) => ({ current: Math.min(Math.round(computeEffectiveValue(s.animal.stats[StatId.WIS])), 80), target: 80 }),
  },

  // Weight achievements (deer-specific)
  {
    id: 'heavy-weight',
    name: 'Heavy Weight',
    description: 'Reach 200+ lbs body weight.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) => s.animal.weight >= 200,
  },
  {
    id: 'near-starvation',
    name: 'Skin and Bones',
    description: 'Survive a turn at under 80 lbs.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) => s.animal.weight < 80 && s.animal.alive,
  },

  // Elephant-specific
  {
    id: 'elephant-titan',
    name: 'Titan',
    description: 'Reach 14,000+ lbs as an elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.animal.weight >= 14000,
  },
  {
    id: 'elephant-drought',
    name: 'Drought Survivor',
    description: 'Survive while dangerously underweight as an elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.animal.weight < 3500 && s.animal.alive,
  },

  // Salmon-specific
  {
    id: 'salmon-upstream',
    name: 'Against the Current',
    description: 'Reach the spawning grounds.',
    checkOn: 'turn',
    species: 'chinook-salmon',
    check: (s) => s.animal.flags.has('reached-spawning-grounds'),
  },
  {
    id: 'salmon-spawn',
    name: 'Circle of Life',
    description: 'Successfully spawn.',
    checkOn: 'both',
    species: 'chinook-salmon',
    check: (s) => s.reproduction.type === 'semelparous' && s.reproduction.spawned,
  },

  // Species-specific
  {
    id: 'play-all-species',
    name: 'Biodiversity',
    description: 'Start a game with every available species.',
    checkOn: 'turn',
    // This is checked via the persistent store's speciesPlayed set
    check: () => false, // Special: handled in AchievementChecker
  },

  // Difficulty
  {
    id: 'hard-mode-50',
    name: 'Against All Odds',
    description: 'Survive 50 turns on Hard difficulty.',
    checkOn: 'turn',
    check: (s) => s.difficulty === 'hard' && s.time.turn >= 50,
    progress: (s) => s.difficulty === 'hard' ? { current: Math.min(s.time.turn, 50), target: 50 } : null,
  },

  // Death achievements
  {
    id: 'old-age',
    name: 'Full Life',
    description: 'Die of old age.',
    checkOn: 'death',
    check: (s) => !!s.animal.causeOfDeath?.includes('old age'),
  },
  {
    id: 'starvation-death',
    name: 'Famine\'s Toll',
    description: 'Die of starvation.',
    checkOn: 'death',
    check: (s) => !!s.animal.causeOfDeath?.includes('Starvation'),
  },

  // NPC milestones
  {
    id: 'predator-veteran',
    name: 'Ghost of the Forest',
    description: 'Survive 5 encounters with your predator NPC.',
    checkOn: 'turn',
    check: (s) => s.npcs.some((n) => n.type === 'predator' && n.encounters >= 5),
    progress: (s) => {
      const pred = s.npcs.find((n: any) => n.type === 'predator');
      return pred ? { current: Math.min(pred.encounters, 5), target: 5 } : { current: 0, target: 5 };
    },
  },
  {
    id: 'predator-champion',
    name: 'Apex Survivor',
    description: 'Survive 10 encounters with your predator NPC.',
    checkOn: 'turn',
    check: (s) => s.npcs.some((n) => n.type === 'predator' && n.encounters >= 10),
    progress: (s) => {
      const pred = s.npcs.find((n: any) => n.type === 'predator');
      return pred ? { current: Math.min(pred.encounters, 10), target: 10 } : { current: 0, target: 10 };
    },
  },
  {
    id: 'rival-outlasted',
    name: 'Outlasting the Shadow',
    description: 'Survive 8 encounters with your rival.',
    checkOn: 'turn',
    check: (s) => s.npcs.some((n) => n.type === 'rival' && n.encounters >= 8),
    progress: (s) => {
      const rival = s.npcs.find((n: any) => n.type === 'rival');
      return rival ? { current: Math.min(rival.encounters, 8), target: 8 } : { current: 0, target: 8 };
    },
  },
  {
    id: 'found-mate',
    name: 'Not Alone',
    description: 'Meet a mate.',
    checkOn: 'turn',
    check: (s) => s.npcs.some((n) => n.type === 'mate'),
  },

  // Parasite survival
  {
    id: 'critical-parasite-survived',
    name: 'Host but Not Defeated',
    description: 'Survive while carrying a critical-stage parasite.',
    checkOn: 'turn',
    check: (s) => {
      const parasiteDefs = s.speciesBundle.parasites;
      return s.animal.parasites.some((p) => {
        const def = parasiteDefs[p.definitionId];
        return def && p.currentStage >= def.stages.length - 1;
      }) && s.animal.alive;
    },
  },
  {
    id: 'parasite-cleared',
    name: 'The Body Remembers',
    description: 'Clear a parasite through natural remission.',
    checkOn: 'turn',
    check: (s) => s.animal.flags.has('parasite-cleared-naturally'),
  },

  // Weather survival
  {
    id: 'survived-blizzard',
    name: 'Whiteout',
    description: 'Survive a blizzard.',
    checkOn: 'turn',
    check: (s) => s.animal.flags.has('survived-blizzard'),
  },
  {
    id: 'survived-heat-wave',
    name: 'Scorched Ground',
    description: 'Survive a heat wave.',
    checkOn: 'turn',
    check: (s) => s.animal.flags.has('survived-heat-wave'),
  },

  // Per-species milestones
  {
    id: 'deer-migrated',
    name: 'The Yard',
    description: 'Complete your first winter migration.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) => s.animal.flags.has('has-migrated'),
  },
  {
    id: 'deer-raised-twins',
    name: 'Double Blessing',
    description: 'Successfully raise twin fawns to independence.',
    checkOn: 'turn',
    species: 'white-tailed-deer',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.filter((o) => o.matured).length >= 2,
  },
  {
    id: 'elephant-musth',
    name: 'State of Musth',
    description: 'Enter musth as a bull elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.animal.sex === 'male' && s.animal.flags.has('in-musth'),
  },
  {
    id: 'elephant-decade',
    name: 'A Decade',
    description: 'Survive 10 game years as an elephant.',
    checkOn: 'turn',
    species: 'african-elephant',
    check: (s) => s.time.year >= 10,
    progress: (s) => ({ current: Math.min(s.time.year, 10), target: 10 }),
  },
  {
    id: 'salmon-ocean-prime',
    name: 'King of the Deep',
    description: 'Reach adult phase in the ocean.',
    checkOn: 'turn',
    species: 'chinook-salmon',
    check: (s) => s.animal.age >= 36 && !s.animal.flags.has('spawning-migration-begun'),
  },
  {
    id: 'salmon-gauntlet',
    name: 'Through the Gauntlet',
    description: 'Survive 3 predator encounters during migration.',
    checkOn: 'turn',
    species: 'chinook-salmon',
    check: (s) =>
      s.npcs.some((n) => n.type === 'predator' && n.encounters >= 3) &&
      s.animal.flags.has('spawning-migration-begun'),
  },

  // Gray Wolf achievements
  {
    id: 'wolf-pack-hunt',
    name: 'Pack Hunter',
    description: 'Complete a successful cooperative hunt as a wolf.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.flags.has('pack-hunt-success'),
  },
  {
    id: 'wolf-survive-year',
    name: 'Year of the Wolf',
    description: 'Survive one full year as a wolf.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.age >= 12,
  },
  {
    id: 'wolf-raise-pups',
    name: 'Den Mother',
    description: 'Raise pups to independence.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },
  {
    id: 'wolf-alpha',
    name: 'Alpha',
    description: 'Win a hierarchy challenge.',
    checkOn: 'turn',
    species: 'gray-wolf',
    check: (s) => s.animal.flags.has('alpha-status'),
  },

  // Polar Bear achievements
  {
    id: 'pb-ice-free-survivor',
    name: 'The Long Fast',
    description: 'Survive an entire ice-free summer season.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) => s.animal.flags.has('survived-ice-free'),
  },
  {
    id: 'pb-heavy-weight',
    name: 'Arctic Titan',
    description: 'Reach 1,000+ lbs as a polar bear.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) => s.animal.weight >= 1000,
  },
  {
    id: 'pb-raise-cubs',
    name: 'Mother of the North',
    description: 'Raise cubs to independence as a polar bear.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },
  {
    id: 'pb-fifteen-years',
    name: 'Elder of the Ice',
    description: 'Survive 15 years as a polar bear.',
    checkOn: 'turn',
    species: 'polar-bear',
    check: (s) => s.animal.age >= 180,
    progress: (s) => ({ current: Math.min(s.animal.age, 180), target: 180 }),
  },

  // Green Sea Turtle achievements
  {
    id: 'turtle-natal-beach',
    name: 'Homecoming',
    description: 'Return to your natal beach for nesting.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) => s.animal.flags.has('returned-natal-beach'),
  },
  {
    id: 'turtle-forty-years',
    name: 'Ancient Mariner',
    description: 'Survive 40 years as a sea turtle.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) => s.animal.age >= 480,
    progress: (s) => ({ current: Math.min(s.animal.age, 480), target: 480 }),
  },
  {
    id: 'turtle-nesting',
    name: 'Nesting Mother',
    description: 'Successfully nest and lay eggs.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.length > 0,
  },
  {
    id: 'turtle-shark-survivor',
    name: 'Bite Marks',
    description: 'Survive a shark attack.',
    checkOn: 'turn',
    species: 'green-sea-turtle',
    check: (s) => s.animal.injuries.some((i) => i.definitionId === 'shark-bite'),
  },

  // Monarch Butterfly achievements
  {
    id: 'monarch-metamorphosis',
    name: 'Transformation',
    description: 'Complete metamorphosis from caterpillar to butterfly.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.animal.flags.has('metamorphosis-complete'),
  },
  {
    id: 'monarch-reach-mexico',
    name: 'The Journey South',
    description: 'Reach the overwintering grounds in Mexico.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.animal.region === 'oyamel-fir-forest-mexico',
  },
  {
    id: 'monarch-five-generations',
    name: 'The Eternal Migration',
    description: 'Survive across 5 generations.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.time.turn >= 100,
    progress: (s) => ({ current: Math.min(s.time.turn, 100), target: 100 }),
  },
  {
    id: 'monarch-clean-wings',
    name: 'Untouched Wings',
    description: 'Reach adulthood without OE protozoan infection.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) =>
      s.animal.age >= 2 &&
      !s.animal.parasites.some((p) => p.definitionId === 'oe-protozoan'),
  },
  {
    id: 'monarch-garden-eggs',
    name: 'Suburban Sanctuary',
    description: 'Lay eggs on garden milkweed.',
    checkOn: 'turn',
    species: 'monarch-butterfly',
    check: (s) => s.animal.flags.has('garden-eggs'),
  },

  // Fig Wasp achievements
  {
    id: 'figwasp-full-cycle',
    name: 'The Mutualism',
    description: 'Complete the full lifecycle: develop, emerge, fly, enter a new fig, pollinate, and lay eggs.',
    checkOn: 'both',
    species: 'fig-wasp',
    check: (s) => s.animal.flags.has('eggs-laid'),
  },
  {
    id: 'figwasp-tunnel-hero',
    name: 'The Tunnel Maker',
    description: 'As a male, successfully chew an exit tunnel through the fig wall.',
    checkOn: 'turn',
    species: 'fig-wasp',
    check: (s) => s.animal.sex === 'male' && s.animal.flags.has('tunnel-chewed'),
  },
  {
    id: 'figwasp-pollen-carrier',
    name: 'Pollen Courier',
    description: 'Collect pollen and carry it to a new fig as a female.',
    checkOn: 'turn',
    species: 'fig-wasp',
    check: (s) =>
      s.animal.sex === 'female' &&
      s.animal.flags.has('pollen-collected') &&
      s.animal.flags.has('entered-new-fig'),
  },
  {
    id: 'figwasp-lineage-3',
    name: 'Three Figs Deep',
    description: 'Survive across 3 generations in lineage mode.',
    checkOn: 'turn',
    species: 'fig-wasp',
    check: (s) => s.time.turn >= 48,
    progress: (s) => ({ current: Math.min(s.time.turn, 48), target: 48 }),
  },
  {
    id: 'figwasp-male-combat-victor',
    name: 'King of the Dark',
    description: 'Win a combat encounter as a wingless, blind male inside the fig.',
    checkOn: 'turn',
    species: 'fig-wasp',
    check: (s) =>
      s.animal.sex === 'male' &&
      s.animal.flags.has('fig-combat-attempted') &&
      s.animal.flags.has('mated-in-fig'),
  },

  // Honeybee Worker achievements
  {
    id: 'bee-first-forager',
    name: 'Into the Light',
    description: 'Complete your first foraging flight as a honeybee.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.flags.has('first-flight-complete'),
  },
  {
    id: 'bee-waggle-dancer',
    name: 'The Language of Dance',
    description: 'Perform a waggle dance to communicate a food source.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.flags.has('waggle-dance-performed'),
  },
  {
    id: 'bee-hive-defender',
    name: 'For the Colony',
    description: 'Successfully defend the hive from an intruder.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.flags.has('hive-defender'),
  },
  {
    id: 'bee-winter-survivor',
    name: 'The Long Cold',
    description: 'Survive an entire winter as a honeybee.',
    checkOn: 'turn',
    species: 'honeybee-worker',
    check: (s) => s.animal.age >= 5 && s.time.season === 'spring',
  },

  // Common Octopus achievements
  {
    id: 'octopus-tool-use',
    name: 'The Inventor',
    description: 'Discover tool use as an octopus.',
    checkOn: 'turn',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('tool-use-discovered'),
  },
  {
    id: 'octopus-camouflage',
    name: 'Invisible',
    description: 'Activate camouflage to avoid a predator.',
    checkOn: 'turn',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('camouflage-active'),
  },
  {
    id: 'octopus-den-builder',
    name: 'Architect',
    description: 'Build a fortified den on the reef.',
    checkOn: 'turn',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('den-built'),
  },
  {
    id: 'octopus-full-cycle',
    name: 'Eight Arms, One Purpose',
    description: 'Complete the full octopus lifecycle: mate and lay eggs.',
    checkOn: 'both',
    species: 'common-octopus',
    check: (s) => s.animal.flags.has('eggs-laid'),
  },

  // Arctic Tern achievements
  {
    id: 'tern-first-migration',
    name: 'Pole to Pole',
    description: 'Complete your first southward migration.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) => s.animal.flags.has('arrived-antarctic'),
  },
  {
    id: 'tern-ten-year-survivor',
    name: 'Decade Flyer',
    description: 'Survive 10 years (120 months) as an arctic tern.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) => s.animal.age >= 120,
    progress: (s) => ({ current: Math.min(s.animal.age, 120), target: 120 }),
  },
  {
    id: 'tern-raise-chicks',
    name: 'Colony Parent',
    description: 'Raise chicks to fledging age.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },
  {
    id: 'tern-tenth-migration',
    name: 'The Endless Summer',
    description: 'Complete 10 pole-to-pole migrations.',
    checkOn: 'turn',
    species: 'arctic-tern',
    check: (s) => s.animal.flags.has('tenth-migration-noted'),
  },

  // Poison Dart Frog achievements
  {
    id: 'frog-toxin-master',
    name: 'Chemical Warrior',
    description: 'Build high toxin levels from foraging on alkaloid-rich prey.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) => s.animal.flags.has('toxin-level-high'),
  },
  {
    id: 'frog-metamorphosis',
    name: 'From Water to Land',
    description: 'Complete metamorphosis from tadpole to frog.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) => s.animal.flags.has('metamorphosis-complete'),
  },
  {
    id: 'frog-wrestling-victor',
    name: 'The Wrestler',
    description: 'Win a wrestling match against a rival male.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) => s.animal.sex === 'male' && s.animal.flags.has('wrestling-match'),
  },
  {
    id: 'frog-raise-tadpoles',
    name: 'Devoted Parent',
    description: 'Successfully raise tadpoles to independence.',
    checkOn: 'turn',
    species: 'poison-dart-frog',
    check: (s) =>
      s.reproduction.type === 'iteroparous' &&
      s.reproduction.offspring.some((o) => o.matured),
  },

  // Cross-species Easter Egg achievement (Phase 15)
  {
    id: 'cross-species-observer',
    name: 'Through Their Eyes',
    description: 'Play as 4 different species.',
    checkOn: 'turn',
    check: (s) => {
      // This checks the achievement store, but since we only have game state here,
      // we check if the current species has been played
      void s;
      return false; // Handled by achievementStore.speciesPlayed.size >= 4
    },
    // Progress is computed in AchievementList using achievementStore.speciesPlayed
    progress: () => null,
  },
];
