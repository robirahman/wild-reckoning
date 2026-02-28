import { createPressureTrigger } from '../factories/pressureFactory';
import { STARVATION_PRESSURE_CONFIG } from '../data/pressureConfigs';

export const starvationPressureTrigger = createPressureTrigger(STARVATION_PRESSURE_CONFIG);
