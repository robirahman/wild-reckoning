/**
 * NPC Behavior State Machine
 *
 * Lightweight state for off-screen NPCs. Not a full physiology simulation —
 * just enough state to produce believable movement patterns and encounter timing.
 */

/** Intent determines NPC movement and interaction behavior */
export type NPCIntent =
  | 'hunting'      // Predator: actively seeking prey, moves toward prey-rich nodes
  | 'patrolling'   // Predator: default, moves through territory
  | 'resting'      // Any: stays at current node, recovering
  | 'foraging'     // Herbivore: seeking food-rich nodes
  | 'migrating'    // Any: moving toward a goal node
  | 'territorial'  // Rival: defending territory, stays near home range
  | 'mating'       // Rival/mate: seeking mates during rut
  | 'fleeing';     // Any: moving away from danger

export interface NPCBehaviorState {
  /** Current behavioral intent */
  intent: NPCIntent;
  /** Hunger level (0-100). High hunger drives hunting/foraging. */
  hunger: number;
  /** Health level (0-100). Low health drives resting. */
  health: number;
  /** Goal node (for migration, hunting paths). undefined = no specific goal. */
  goalNodeId?: string;
  /** Recent nodes visited (ring buffer, last 5). Avoids backtracking. */
  recentNodes: string[];
  /** Home range center node (for territorial NPCs) */
  homeNodeId?: string;
  /** Number of turns in current intent state */
  turnsInState: number;
  /** Accumulated scars/injuries (narrative detail, not simulated) */
  scars: number;
  /** Turn of last successful kill (predators only) */
  lastKillTurn?: number;
}

/** Default behavior state for a newly created NPC */
export function createBehaviorState(
  intent: NPCIntent,
  homeNodeId?: string,
): NPCBehaviorState {
  return {
    intent,
    hunger: 40, // moderately hungry
    health: 90,
    homeNodeId,
    recentNodes: [],
    turnsInState: 0,
    scars: 0,
  };
}

/**
 * Intent transition rules per NPC type.
 * Used by the behavior engine to determine when to switch intent.
 */
export interface IntentTransition {
  from: NPCIntent;
  to: NPCIntent;
  /** Condition function: returns true if transition should fire */
  condition: (state: NPCBehaviorState, ctx: NPCTickContext) => boolean;
  /** Priority (higher = evaluated first) */
  priority: number;
}

/** Context provided to the NPC behavior engine per tick */
export interface NPCTickContext {
  /** Current turn number */
  turn: number;
  /** Current season */
  season: string;
  /** Player's current node ID */
  playerNodeId?: string;
  /** Adjacent node IDs from the NPC's current position */
  adjacentNodeIds: string[];
  /** Food level at the NPC's current node (0-100) */
  currentNodeFood: number;
  /** Food levels at adjacent nodes */
  adjacentNodeFood: Record<string, number>;
  /** Whether the NPC is at the same node as the player */
  atPlayerNode: boolean;
  /** Fast-forward multiplier */
  ffMult: number;
}
