import type { Season } from '../types/world';
import type { EventCategory } from '../types/events';

/**
 * Audio asset registry. When audio files are added to public/audio/,
 * register them here to enable playback.
 *
 * Drop files into:
 * - public/audio/ambient/ for seasonal ambient loops
 * - public/audio/sfx/ for event sound effects
 */
export const AMBIENT_TRACKS: Record<Season, string | null> = {
  spring: null, // e.g., '/audio/ambient/spring-birds.mp3'
  summer: null,
  autumn: null,
  winter: null,
};

export const SFX_BY_CATEGORY: Record<EventCategory, string[]> = {
  foraging: [],
  predator: [],
  seasonal: [],
  social: [],
  environmental: [],
  health: [],
  psychological: [],
  migration: [],
  reproduction: [],
};

export const SFX_BY_TAG: Record<string, string[]> = {
  // Example: 'wolf': ['/audio/sfx/wolf-howl.mp3'],
};
