import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { POLAR_BEAR_CONFIG } from './config';
import { POLAR_BEAR_EVENTS } from './events';
import { POLAR_BEAR_PARASITES } from './parasites';
import { POLAR_BEAR_INJURIES } from './injuries';
import { POLAR_BEAR_BACKSTORIES } from './backstories';

export const polarBearBundle: SpeciesDataBundle = {
  config: POLAR_BEAR_CONFIG,
  events: POLAR_BEAR_EVENTS,
  parasites: POLAR_BEAR_PARASITES,
  injuries: POLAR_BEAR_INJURIES,
  backstories: POLAR_BEAR_BACKSTORIES,
};
