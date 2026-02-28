import { createSocialTrigger } from '../factories/socialFactory';
import {
  HERD_ALARM_CONFIG,
  BACHELOR_GROUP_CONFIG,
  DOE_HIERARCHY_CONFIG,
  FAWN_PLAY_CONFIG,
  TERRITORIAL_SCRAPE_CONFIG,
  RIVAL_RETURNS_CONFIG,
  ALLY_WARNS_CONFIG,
  YEARLING_DISPERSAL_CONFIG,
} from '../data/socialConfigs';

export const herdAlarmTrigger = createSocialTrigger(HERD_ALARM_CONFIG);
export const bachelorGroupTrigger = createSocialTrigger(BACHELOR_GROUP_CONFIG);
export const doeHierarchyTrigger = createSocialTrigger(DOE_HIERARCHY_CONFIG);
export const fawnPlayTrigger = createSocialTrigger(FAWN_PLAY_CONFIG);
export const territorialScrapeTrigger = createSocialTrigger(TERRITORIAL_SCRAPE_CONFIG);
export const rivalReturnsTrigger = createSocialTrigger(RIVAL_RETURNS_CONFIG);
export const allyWarnsTrigger = createSocialTrigger(ALLY_WARNS_CONFIG);
export const yearlingDispersalTrigger = createSocialTrigger(YEARLING_DISPERSAL_CONFIG);
