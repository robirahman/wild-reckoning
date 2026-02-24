import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { WHITE_TAILED_DEER_CONFIG } from './config';
import { WHITE_TAILED_DEER_EVENTS } from './events';
import { WHITE_TAILED_DEER_PARASITES } from './parasites';
import { WHITE_TAILED_DEER_INJURIES } from './injuries';
import { WHITE_TAILED_DEER_BACKSTORIES } from './backstories';

export const whiteTailedDeerBundle: SpeciesDataBundle = {
  config: WHITE_TAILED_DEER_CONFIG,
  events: WHITE_TAILED_DEER_EVENTS,
  parasites: WHITE_TAILED_DEER_PARASITES,
  injuries: WHITE_TAILED_DEER_INJURIES,
  backstories: WHITE_TAILED_DEER_BACKSTORIES,
};
