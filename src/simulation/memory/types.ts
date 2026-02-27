import type { EventCategory } from '../../types/events';

// ── Event Memory ──

/** A record of an event that occurred on a specific turn */
export interface EventMemoryEntry {
  /** Turn the event occurred */
  turn: number;
  /** Trigger ID (e.g., 'sim-wolf-pack') */
  triggerId: string;
  /** Event category */
  category: EventCategory;
  /** Player's choice ID, if any */
  choiceId?: string;
  /** Whether the outcome was harmful (injury, death roll, significant stat damage) */
  harmful: boolean;
  /** Whether the player escaped/survived (for predator events) */
  escaped?: boolean;
  /** Map node where it occurred */
  nodeId?: string;
  /** NPCs involved */
  npcIds?: string[];
  /** Tags from the trigger (for quick filtering) */
  tags?: string[];
}

// ── Node Memory ──

/** Persistent state tracked per map node */
export interface NodeMemory {
  /** Predator kills witnessed/experienced at this node */
  killCount: number;
  /** Turn of the most recent kill */
  lastKillTurn: number;
  /** Scent marks left by NPCs or the player */
  scentMarks: ScentMark[];
  /** Cumulative foraging pressure (depletes food quality over time) */
  foragingPressure: number;
  /** Perceived danger level, learned from experience (0-100) */
  perceivedDanger: number;
  /** Turns the player has spent at this node (familiarity) */
  turnsOccupied: number;
}

export interface ScentMark {
  /** NPC or player ID */
  sourceId: string;
  /** Turn the mark was made */
  turn: number;
  /** Type of scent */
  type: 'territory' | 'alarm' | 'mating' | 'predator-kill';
}

// ── Threat Assessment ──

/** Accumulated threat data for a specific danger source */
export interface ThreatAssessment {
  /** Source identifier (species name or hazard type, e.g., 'Gray Wolf', 'vehicle') */
  source: string;
  /** Number of encounters in the recent window */
  recentEncounters: number;
  /** Turn of the most recent encounter */
  lastEncounterTurn: number;
  /** Running average severity (0-100): 0 = harmless sighting, 100 = near-death) */
  averageSeverity: number;
  /** Whether the player has survived an encounter (affects narrative: "you know these shapes") */
  hasBeenEncountered: boolean;
}

// ── Seasonal Totals ──

/** Aggregated stats for the current season, reset each season change */
export interface SeasonalTotals {
  /** Season these totals belong to */
  season: string;
  /** Number of foraging events this season */
  foragingEvents: number;
  /** Number of successful foraging events (net positive calories) */
  foragingSuccesses: number;
  /** Number of predator encounters */
  predatorEncounters: number;
  /** Number of predator escapes */
  predatorEscapes: number;
  /** Total harm events received */
  harmEventsReceived: number;
  /** Total calories gained from events */
  caloriesGained: number;
  /** Total calories lost from events (sprint costs, etc.) */
  caloriesLost: number;
  /** Nodes visited this season */
  nodesVisited: Set<string>;
}

// ── World Memory ──

/** Persistent world state that accumulates across turns */
export interface WorldMemory {
  /** Rolling event log (ring buffer, most recent first) */
  recentEvents: EventMemoryEntry[];
  /** Per-node persistent state */
  nodeMemory: Record<string, NodeMemory>;
  /** Threat assessments by source */
  threatMap: Record<string, ThreatAssessment>;
  /** Current season aggregated stats */
  seasonalTotals: SeasonalTotals;
}

// ── Constants ──

/** Maximum number of recent events to retain */
export const MAX_RECENT_EVENTS = 20;

/** Number of recent turns used for threat assessment window */
export const THREAT_WINDOW_TURNS = 10;

/** Scent marks fade after this many turns */
export const SCENT_FADE_TURNS = 8;

// ── Factory ──

/** Create a fresh WorldMemory for a new game */
export function createWorldMemory(season: string): WorldMemory {
  return {
    recentEvents: [],
    nodeMemory: {},
    threatMap: {},
    seasonalTotals: createSeasonalTotals(season),
  };
}

export function createSeasonalTotals(season: string): SeasonalTotals {
  return {
    season,
    foragingEvents: 0,
    foragingSuccesses: 0,
    predatorEncounters: 0,
    predatorEscapes: 0,
    harmEventsReceived: 0,
    caloriesGained: 0,
    caloriesLost: 0,
    nodesVisited: new Set(),
  };
}

export function createNodeMemory(): NodeMemory {
  return {
    killCount: 0,
    lastKillTurn: 0,
    scentMarks: [],
    foragingPressure: 0,
    perceivedDanger: 0,
    turnsOccupied: 0,
  };
}
