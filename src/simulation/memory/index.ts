export type {
  WorldMemory,
  EventMemoryEntry,
  NodeMemory,
  ScentMark,
  ThreatAssessment,
  SeasonalTotals,
} from './types';

export {
  MAX_RECENT_EVENTS,
  THREAT_WINDOW_TURNS,
  SCENT_FADE_TURNS,
  createWorldMemory,
  createSeasonalTotals,
  createNodeMemory,
} from './types';

export { tickWorldMemory } from './ticker';
