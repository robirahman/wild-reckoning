/** Phase 11: Species Unlock Progression */

export interface SpeciesUnlockRequirement {
  speciesId: string;
  requirement:
    | { type: 'default' }
    | { type: 'achievement'; achievementId: string; description: string }
    | { type: 'species_played'; speciesId: string; description: string };
}

export const SPECIES_UNLOCKS: SpeciesUnlockRequirement[] = [
  // Always available
  { speciesId: 'white-tailed-deer', requirement: { type: 'default' } },
  { speciesId: 'gray-wolf', requirement: { type: 'default' } },

  // Unlock by playing deer or wolf
  {
    speciesId: 'african-elephant',
    requirement: {
      type: 'achievement',
      achievementId: 'survivor-50',
      description: 'Survive 50 turns with any species',
    },
  },
  {
    speciesId: 'chinook-salmon',
    requirement: {
      type: 'species_played',
      speciesId: 'white-tailed-deer',
      description: 'Play as White-tailed Deer',
    },
  },
  {
    speciesId: 'polar-bear',
    requirement: {
      type: 'achievement',
      achievementId: 'survive-winter',
      description: 'Survive a full winter',
    },
  },
  {
    speciesId: 'green-sea-turtle',
    requirement: {
      type: 'species_played',
      speciesId: 'chinook-salmon',
      description: 'Play as Chinook Salmon',
    },
  },
  {
    speciesId: 'monarch-butterfly',
    requirement: {
      type: 'achievement',
      achievementId: 'first-migration',
      description: 'Complete a migration',
    },
  },
  {
    speciesId: 'fig-wasp',
    requirement: {
      type: 'achievement',
      achievementId: 'first-offspring',
      description: 'Produce offspring',
    },
  },

  // New species — gated by achievements from earlier species
  {
    speciesId: 'common-octopus',
    requirement: {
      type: 'species_played',
      speciesId: 'green-sea-turtle',
      description: 'Play as Green Sea Turtle',
    },
  },
  {
    speciesId: 'honeybee-worker',
    requirement: {
      type: 'species_played',
      speciesId: 'fig-wasp',
      description: 'Play as Fig Wasp',
    },
  },
  {
    speciesId: 'arctic-tern',
    requirement: {
      type: 'species_played',
      speciesId: 'monarch-butterfly',
      description: 'Play as Monarch Butterfly',
    },
  },
  {
    speciesId: 'poison-dart-frog',
    requirement: {
      type: 'species_played',
      speciesId: 'common-octopus',
      description: 'Play as Common Octopus',
    },
  },
];
