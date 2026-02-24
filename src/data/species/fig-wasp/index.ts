import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { FIG_WASP_CONFIG } from './config';
import { FIG_WASP_EVENTS } from './events';
import { FIG_WASP_PARASITES } from './parasites';
import { FIG_WASP_INJURIES } from './injuries';
import { FIG_WASP_BACKSTORIES } from './backstories';

export const figWaspBundle: SpeciesDataBundle = {
  config: FIG_WASP_CONFIG,
  events: FIG_WASP_EVENTS,
  parasites: FIG_WASP_PARASITES,
  injuries: FIG_WASP_INJURIES,
  backstories: FIG_WASP_BACKSTORIES,
};
