import type { EventCategory } from '../types/events';

/**
 * Maps event categories to available illustration pools.
 * Each pool is a list of image paths relative to /images/events/.
 * When images are added to the public directory, register them here.
 *
 * Usage: Drop images into public/images/events/{category}/ and add the filenames below.
 */
export const ILLUSTRATION_POOLS: Record<EventCategory, string[]> = {
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

/**
 * Tag-based overrides: if an event has a specific tag, prefer these images.
 * Checked before the category pool.
 */
export const TAG_ILLUSTRATIONS: Record<string, string[]> = {
  // Example: 'wolf': ['/images/events/predator/wolf-encounter.jpg'],
};
