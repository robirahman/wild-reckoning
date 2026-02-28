import { createPressureTrigger } from '../factories/pressureFactory';
import { HYPOTHERMIA_PRESSURE_CONFIG } from '../data/pressureConfigs';

export const hypothermiaPressureTrigger = createPressureTrigger(HYPOTHERMIA_PRESSURE_CONFIG);
