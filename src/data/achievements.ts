import type { GameState } from '../store/gameStore';
import { computeEffectiveValue, StatId } from '../types/stats';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  /** Check at end of turn or on death */
  checkOn: 'turn' | 'death' | 'both';
  check: (state: GameState) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Survival milestones
  {
    id: 'survivor-10',
    name: 'First Steps',
    description: 'Survive 10 turns.',
    checkOn: 'turn',
    check: (s) => s.time.turn >= 10,
  },
  {
    id: 'survivor-50',
    name: 'Seasoned Survivor',
    description: 'Survive 50 turns.',
    checkOn: 'turn',
    check: (s) => s.time.turn >= 50,
  },
  {
    id: 'survivor-100',
    name: 'Enduring Spirit',
    description: 'Survive 100 turns.',
    checkOn: 'turn',
    check: (s) => s.time.turn >= 100,
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
  },
  {
    id: 'wise-elder',
    name: 'Wise Elder',
    description: 'Reach 80+ Wisdom.',
    checkOn: 'turn',
    check: (s) => computeEffectiveValue(s.animal.stats[StatId.WIS]) >= 80,
  },

  // Weight achievements
  {
    id: 'heavy-weight',
    name: 'Heavy Weight',
    description: 'Reach 200+ lbs body weight.',
    checkOn: 'turn',
    check: (s) => s.animal.weight >= 200,
  },
  {
    id: 'near-starvation',
    name: 'Skin and Bones',
    description: 'Survive a turn at under 80 lbs.',
    checkOn: 'turn',
    check: (s) => s.animal.weight < 80 && s.animal.alive,
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
];
