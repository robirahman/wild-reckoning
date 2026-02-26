import type { SpeciesDataBundle } from '../../../../types/speciesConfig';
import { CHICKEN_CONFIG } from './config';
import { CHICKEN_EVENTS } from './events';
import { CHICKEN_PARASITES } from './parasites';
import { CHICKEN_INJURIES } from './injuries';
import { CHICKEN_BACKSTORIES } from './backstories';

export const chickenBundle: SpeciesDataBundle = {
  config: CHICKEN_CONFIG,
  events: CHICKEN_EVENTS,
  parasites: CHICKEN_PARASITES,
  injuries: CHICKEN_INJURIES,
  backstories: CHICKEN_BACKSTORIES,
};
