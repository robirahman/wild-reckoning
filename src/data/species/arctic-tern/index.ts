import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { ARCTIC_TERN_CONFIG } from './config';
import { ARCTIC_TERN_EVENTS } from './events';
import { ARCTIC_TERN_PARASITES } from './parasites';
import { ARCTIC_TERN_INJURIES } from './injuries';
import { ARCTIC_TERN_BACKSTORIES } from './backstories';

export const arcticTernBundle: SpeciesDataBundle = {
  config: ARCTIC_TERN_CONFIG,
  events: ARCTIC_TERN_EVENTS,
  parasites: ARCTIC_TERN_PARASITES,
  injuries: ARCTIC_TERN_INJURIES,
  backstories: ARCTIC_TERN_BACKSTORIES,
};
