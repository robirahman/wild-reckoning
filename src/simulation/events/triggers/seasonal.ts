import { createSeasonalTrigger } from '../factories/seasonalFactory';
import {
  ANTLER_VELVET_CONFIG,
  INSECT_HARASSMENT_CONFIG,
  AUTUMN_RUT_CONFIG,
  WINTER_YARD_CONFIG,
  RUT_ENDS_CONFIG,
} from '../data/seasonalConfigs';

export const antlerVelvetTrigger = createSeasonalTrigger(ANTLER_VELVET_CONFIG);
export const insectHarassmentTrigger = createSeasonalTrigger(INSECT_HARASSMENT_CONFIG);
export const autumnRutTrigger = createSeasonalTrigger(AUTUMN_RUT_CONFIG);
export const winterYardTrigger = createSeasonalTrigger(WINTER_YARD_CONFIG);
export const rutEndsTrigger = createSeasonalTrigger(RUT_ENDS_CONFIG);
