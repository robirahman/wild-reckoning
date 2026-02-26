/** Phase 11: Species Unlock Progression */

export interface SpeciesUnlockRequirement {
  speciesId: string;
  requirement:
    | { type: 'default' }
    | { type: 'achievement'; achievementId: string; description: string }
    | { type: 'species_played'; speciesId: string; description: string };
}

export const SPECIES_UNLOCKS: SpeciesUnlockRequirement[] = [
  // --- Starter Species ---
  { speciesId: 'white-tailed-deer', requirement: { type: 'default' } },
  { speciesId: 'gray-wolf', requirement: { type: 'default' } },

  // --- Tier 1: Specialized Mammals & Fish ---
  {
    speciesId: 'african-elephant',
    requirement: {
      type: 'achievement',
      achievementId: 'deer-raised-twins',
      description: 'Raise twin fawns to independence as a White-Tailed Deer',
    },
  },
  {
    speciesId: 'polar-bear',
    requirement: {
      type: 'achievement',
      achievementId: 'wolf-alpha',
      description: 'Win a hierarchy challenge as a Gray Wolf',
    },
  },
  {
    speciesId: 'chinook-salmon',
    requirement: {
      type: 'achievement',
      achievementId: 'deer-migrated',
      description: 'Complete a winter migration as a White-Tailed Deer',
    },
  },

  // --- Tier 2: Marine Life ---
  {
    speciesId: 'green-sea-turtle',
    requirement: {
      type: 'achievement',
      achievementId: 'salmon-spawn',
      description: 'Successfully spawn as a Chinook Salmon',
    },
  },
  {
    speciesId: 'common-octopus',
    requirement: {
      type: 'achievement',
      achievementId: 'turtle-nesting',
      description: 'Successfully nest and lay eggs as a Green Sea Turtle',
    },
  },

  // --- Tier 3: Amphibians & Insects ---
  {
    speciesId: 'poison-dart-frog',
    requirement: {
      type: 'achievement',
      achievementId: 'octopus-full-cycle',
      description: 'Complete the full lifecycle as a Common Octopus',
    },
  },
  {
    speciesId: 'monarch-butterfly',
    requirement: {
      type: 'achievement',
      achievementId: 'frog-metamorphosis',
      description: 'Complete metamorphosis as a Poison Dart Frog',
    },
  },
  {
    speciesId: 'arctic-tern',
    requirement: {
      type: 'achievement',
      achievementId: 'monarch-reach-mexico',
      description: 'Reach the overwintering grounds in Mexico as a Monarch Butterfly',
    },
  },
  {
    speciesId: 'honeybee-worker',
    requirement: {
      type: 'achievement',
      achievementId: 'tern-first-migration',
      description: 'Complete a southward migration as an Arctic Tern',
    },
  },
  {
    speciesId: 'fig-wasp',
    requirement: {
      type: 'achievement',
      achievementId: 'bee-waggle-dancer',
      description: 'Perform a waggle dance as a Honeybee Worker',
    },
  },
  // --- Easter Eggs: Farm Animals ---
  { speciesId: 'chicken', requirement: { type: 'default' } },
  { speciesId: 'pig', requirement: { type: 'default' } },
];
