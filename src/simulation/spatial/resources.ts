import type { MapNode } from '../../types/map';
import type { Season } from '../../types/world';

/**
 * Seasonal regeneration multipliers for food.
 * Spring growth surge, winter near-dormancy.
 */
const SEASON_REGEN_MULTIPLIER: Record<Season, number> = {
  spring: 1.5,
  summer: 1.0,
  autumn: 0.5,
  winter: 0.1,
};

export interface NodeResourceTickInput {
  /** All map nodes */
  nodes: MapNode[];
  /** Current season */
  season: Season;
  /** Foraging effort at the player's current node (behavioral setting 1-5) */
  foragingEffort: number;
  /** ID of the node the player currently occupies */
  currentNodeId: string;
  /** NPC IDs present at each node (from NPC system) */
  npcNodeMap: Record<string, string[]>;
  /** Fast-forward multiplier */
  ffMult: number;
}

/**
 * Tick resource levels for all map nodes.
 *
 * - Player's current node is depleted by foraging effort.
 * - Nodes with NPCs are depleted by NPC foraging (lighter footprint).
 * - All nodes regenerate food based on season and foodRegenRate.
 * - Food is capped at foodCapacity.
 *
 * Returns new node array (immutable update).
 */
export function tickNodeResources(input: NodeResourceTickInput): MapNode[] {
  const { nodes, season, foragingEffort, currentNodeId, npcNodeMap, ffMult } = input;
  const seasonMult = SEASON_REGEN_MULTIPLIER[season] ?? 1.0;

  return nodes.map(node => {
    let food = node.resources.food;

    // Player foraging depletion (only at current node)
    if (node.id === currentNodeId) {
      const depletion = foragingEffort * 1.2 * ffMult;
      food -= depletion;
    }

    // NPC foraging depletion (lighter than player — background pressure)
    const npcsHere = npcNodeMap[node.id];
    if (npcsHere && npcsHere.length > 0) {
      // Each NPC depletes ~0.8 food per turn (herbivores compete, predators don't forage)
      const npcDepletion = npcsHere.length * 0.8 * ffMult;
      food -= npcDepletion;
    }

    // Seasonal regeneration
    const regen = node.foodRegenRate * seasonMult * ffMult;
    food += regen;

    // Clamp to [0, capacity]
    food = Math.max(0, Math.min(node.foodCapacity, food));

    // Prune stale activity entries (older than 5 turns)
    // (We don't have current turn here, so we trust the caller to prune if needed)

    if (food === node.resources.food) return node;

    return {
      ...node,
      resources: { ...node.resources, food },
    };
  });
}

/**
 * Build NPC → node mapping from NPC list for resource tick.
 */
export function buildNPCNodeMap(npcs: { currentNodeId?: string; alive: boolean; type?: string }[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const npc of npcs) {
    if (!npc.alive || !npc.currentNodeId) continue;
    // Only herbivore/conspecific NPCs deplete food (predators don't forage plants)
    if (npc.type === 'predator') continue;
    if (!map[npc.currentNodeId]) map[npc.currentNodeId] = [];
    map[npc.currentNodeId].push(npc.currentNodeId);
  }
  return map;
}
