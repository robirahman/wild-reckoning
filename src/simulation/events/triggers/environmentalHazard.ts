import { createEnvironmentalTrigger } from '../factories/environmentalFactory';
import {
  FALL_HAZARD_CONFIG,
  BLIZZARD_EXPOSURE_CONFIG,
  VEHICLE_STRIKE_CONFIG,
  FOREST_FIRE_CONFIG,
  FLOODING_CREEK_CONFIG,
  DISPERSAL_NEW_RANGE_CONFIG,
  BARBED_WIRE_CONFIG,
  ICE_FALL_THROUGH_CONFIG,
  MUD_TRAP_CONFIG,
} from '../data/environmentalConfigs';

export const fallHazardTrigger = createEnvironmentalTrigger(FALL_HAZARD_CONFIG);
export const blizzardExposureTrigger = createEnvironmentalTrigger(BLIZZARD_EXPOSURE_CONFIG);
export const vehicleStrikeTrigger = createEnvironmentalTrigger(VEHICLE_STRIKE_CONFIG);
export const forestFireTrigger = createEnvironmentalTrigger(FOREST_FIRE_CONFIG);
export const floodingCreekTrigger = createEnvironmentalTrigger(FLOODING_CREEK_CONFIG);
export const dispersalNewRangeTrigger = createEnvironmentalTrigger(DISPERSAL_NEW_RANGE_CONFIG);
export const barbedWireTrigger = createEnvironmentalTrigger(BARBED_WIRE_CONFIG);
export const iceFallThroughTrigger = createEnvironmentalTrigger(ICE_FALL_THROUGH_CONFIG);
export const mudTrapTrigger = createEnvironmentalTrigger(MUD_TRAP_CONFIG);
