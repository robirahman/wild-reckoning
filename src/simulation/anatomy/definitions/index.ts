import type { AnatomyDefinition } from '../types';
import { DEER_ANATOMY } from './deer';

/** Registry of anatomy definitions keyed by species ID */
const ANATOMY_REGISTRY: Record<string, AnatomyDefinition> = {
  'white-tailed-deer': DEER_ANATOMY,
};

/** Get the anatomy definition for a species, if one exists */
export function getAnatomyDefinition(speciesId: string): AnatomyDefinition | undefined {
  return ANATOMY_REGISTRY[speciesId];
}

/** Check if a species has an anatomy definition */
export function hasAnatomy(speciesId: string): boolean {
  return speciesId in ANATOMY_REGISTRY;
}
