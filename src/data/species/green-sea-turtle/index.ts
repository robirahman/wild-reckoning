import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { GREEN_SEA_TURTLE_CONFIG } from './config';
import { GREEN_SEA_TURTLE_EVENTS } from './events';
import { GREEN_SEA_TURTLE_PARASITES } from './parasites';
import { GREEN_SEA_TURTLE_INJURIES } from './injuries';
import { GREEN_SEA_TURTLE_BACKSTORIES } from './backstories';

export { GREEN_SEA_TURTLE_CONFIG } from './config';
export { GREEN_SEA_TURTLE_EVENTS } from './events';
export { GREEN_SEA_TURTLE_PARASITES } from './parasites';
export { GREEN_SEA_TURTLE_INJURIES } from './injuries';
export { GREEN_SEA_TURTLE_BACKSTORIES } from './backstories';

export const greenSeaTurtleBundle: SpeciesDataBundle = {
  config: GREEN_SEA_TURTLE_CONFIG,
  events: GREEN_SEA_TURTLE_EVENTS,
  parasites: GREEN_SEA_TURTLE_PARASITES,
  injuries: GREEN_SEA_TURTLE_INJURIES,
  backstories: GREEN_SEA_TURTLE_BACKSTORIES,
};
