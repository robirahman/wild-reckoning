import { createMigrationTrigger } from '../factories/migrationFactory';
import { WINTER_YARD_SCOUT_CONFIG, TRAVEL_HAZARDS_CONFIG, SPRING_RETURN_CONFIG } from '../data/migrationConfigs';

export const winterYardScoutTrigger = createMigrationTrigger(WINTER_YARD_SCOUT_CONFIG);
export const travelHazardsTrigger = createMigrationTrigger(TRAVEL_HAZARDS_CONFIG);
export const springReturnTrigger = createMigrationTrigger(SPRING_RETURN_CONFIG);
