import { createPressureTrigger } from '../factories/pressureFactory';
import { INJURY_IMPACT_CONFIG } from '../data/pressureConfigs';

export const injuryImpactTrigger = createPressureTrigger(INJURY_IMPACT_CONFIG);
