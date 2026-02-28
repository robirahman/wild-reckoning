import { createPressureTrigger } from '../factories/pressureFactory';
import { IMMUNE_PRESSURE_CONFIG } from '../data/pressureConfigs';

export const immunePressureTrigger = createPressureTrigger(IMMUNE_PRESSURE_CONFIG);
