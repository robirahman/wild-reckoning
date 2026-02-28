import { createPredatorTrigger } from '../factories/predatorFactory';
import {
  WOLF_PACK_CONFIG,
  COYOTE_CONFIG,
  COUGAR_CONFIG,
  HUNTING_CONFIG,
} from '../data/predatorConfigs';

export const wolfPackTrigger = createPredatorTrigger(WOLF_PACK_CONFIG);
export const coyoteStalkerTrigger = createPredatorTrigger(COYOTE_CONFIG);
export const cougarAmbushTrigger = createPredatorTrigger(COUGAR_CONFIG);
export const huntingSeasonTrigger = createPredatorTrigger(HUNTING_CONFIG);
