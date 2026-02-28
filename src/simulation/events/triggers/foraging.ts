import { createSeasonalBrowseTrigger, createRiskyForagingTrigger, createToxicPlantTrigger } from '../factories/foragingFactory';
import { SEASONAL_BROWSE_CONFIG, RISKY_FORAGING_CONFIG, TOXIC_PLANT_CONFIG } from '../data/foragingConfigs';

export const seasonalBrowseTrigger = createSeasonalBrowseTrigger(SEASONAL_BROWSE_CONFIG);
export const riskyForagingTrigger = createRiskyForagingTrigger(RISKY_FORAGING_CONFIG);
export const toxicPlantTrigger = createToxicPlantTrigger(TOXIC_PLANT_CONFIG);
