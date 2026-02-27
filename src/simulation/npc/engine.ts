import type { NPC } from '../../types/npc';
import type { MapNode } from '../../types/map';
import type { Rng } from '../../engine/RandomUtils';
import type { NPCBehaviorState, NPCTickContext } from './types';
import { createBehaviorState } from './types';

/**
 * NPC Behavior Engine
 *
 * Runs once per turn for each NPC. Updates intent (state machine),
 * hunger/health, and movement. Pure function — returns updated NPC + behavior.
 */

export interface NPCBehaviorInput {
  npcs: NPC[];
  nodes: MapNode[];
  playerNodeId?: string;
  turn: number;
  season: string;
  rng: Rng;
  ffMult: number;
  /** Map of NPC ID → behavior state (stored separately from NPC to avoid type changes) */
  behaviorStates: Record<string, NPCBehaviorState>;
}

export interface NPCBehaviorResult {
  npcs: NPC[];
  behaviorStates: Record<string, NPCBehaviorState>;
}

/**
 * Tick all NPC behaviors for one turn.
 * Returns updated NPCs (with new positions) and behavior states.
 */
export function tickNPCBehavior(input: NPCBehaviorInput): NPCBehaviorResult {
  const { npcs, nodes, playerNodeId, turn, season, rng, ffMult, behaviorStates } = input;

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const updatedNPCs: NPC[] = [];
  const updatedStates: Record<string, NPCBehaviorState> = { ...behaviorStates };

  for (const npc of npcs) {
    if (!npc.alive) {
      updatedNPCs.push(npc);
      continue;
    }

    // Get or create behavior state
    let behavior = updatedStates[npc.id];
    if (!behavior) {
      const defaultIntent = npc.type === 'predator' ? 'patrolling' : 'foraging';
      behavior = createBehaviorState(defaultIntent as 'patrolling' | 'foraging', npc.currentNodeId);
    } else {
      behavior = { ...behavior };
    }

    const currentNode = npc.currentNodeId ? nodeMap.get(npc.currentNodeId) : undefined;
    const adjacentIds = currentNode?.connections ?? [];
    const adjacentFood: Record<string, number> = {};
    for (const id of adjacentIds) {
      const node = nodeMap.get(id);
      if (node) adjacentFood[id] = node.resources.food;
    }

    const ctx: NPCTickContext = {
      turn,
      season,
      playerNodeId,
      adjacentNodeIds: adjacentIds,
      currentNodeFood: currentNode?.resources.food ?? 0,
      adjacentNodeFood: adjacentFood,
      atPlayerNode: npc.currentNodeId === playerNodeId,
      ffMult,
    };

    // 1. Update hunger and health
    behavior.hunger = Math.min(100, behavior.hunger + 3 * ffMult);
    if (behavior.intent === 'resting') {
      behavior.health = Math.min(100, behavior.health + 5 * ffMult);
    }
    if (behavior.hunger > 70) {
      behavior.health = Math.max(0, behavior.health - 1 * ffMult);
    }

    // 2. Intent transitions
    behavior = transitionIntent(npc, behavior, ctx, rng);
    behavior.turnsInState += ffMult;

    // 3. Movement based on intent
    const newNodeId = computeMovement(npc, behavior, ctx, rng);
    let updatedNPC = npc;
    if (newNodeId && newNodeId !== npc.currentNodeId) {
      updatedNPC = { ...npc, currentNodeId: newNodeId };
      behavior.recentNodes = [...behavior.recentNodes.slice(-4), newNodeId];
    }

    // 4. Hunger reduction from foraging/killing
    if (behavior.intent === 'foraging' && ctx.currentNodeFood > 30) {
      behavior.hunger = Math.max(0, behavior.hunger - 10 * ffMult);
    }
    if (behavior.intent === 'hunting' && ctx.atPlayerNode && rng.chance(0.15)) {
      // NPC "hunted something else" nearby — not the player
      behavior.hunger = Math.max(0, behavior.hunger - 40);
      behavior.lastKillTurn = turn;
    }

    updatedNPCs.push(updatedNPC);
    updatedStates[npc.id] = behavior;
  }

  return { npcs: updatedNPCs, behaviorStates: updatedStates };
}

/**
 * Determine intent transitions for an NPC.
 */
function transitionIntent(
  npc: NPC,
  behavior: NPCBehaviorState,
  ctx: NPCTickContext,
  rng: Rng,
): NPCBehaviorState {
  const { intent, hunger, health } = behavior;

  if (npc.type === 'predator') {
    return transitionPredator(behavior, ctx, rng);
  }

  // Herbivore / conspecific NPCs
  switch (intent) {
    case 'foraging':
      if (health < 30) {
        return resetIntent(behavior, 'resting');
      }
      if (ctx.season === 'autumn' && npc.type === 'rival') {
        return resetIntent(behavior, 'territorial');
      }
      break;

    case 'resting':
      if (health > 60 && hunger > 50) {
        return resetIntent(behavior, 'foraging');
      }
      break;

    case 'territorial':
      if (ctx.season !== 'autumn' || behavior.turnsInState > 8) {
        return resetIntent(behavior, 'foraging');
      }
      break;

    case 'mating':
      if (behavior.turnsInState > 4) {
        return resetIntent(behavior, 'foraging');
      }
      break;

    case 'fleeing':
      if (behavior.turnsInState > 2) {
        return resetIntent(behavior, hunger > 60 ? 'foraging' : 'resting');
      }
      break;

    default:
      break;
  }

  return behavior;
}

/**
 * Predator-specific intent transitions.
 */
function transitionPredator(
  behavior: NPCBehaviorState,
  _ctx: NPCTickContext,
  rng: Rng,
): NPCBehaviorState {
  const { intent, hunger, health } = behavior;

  switch (intent) {
    case 'patrolling':
      if (hunger > 60) {
        return resetIntent(behavior, 'hunting');
      }
      if (health < 30) {
        return resetIntent(behavior, 'resting');
      }
      break;

    case 'hunting':
      if (hunger < 30) {
        return resetIntent(behavior, 'resting');
      }
      if (health < 20) {
        return resetIntent(behavior, 'resting');
      }
      if (behavior.turnsInState > 6 && rng.chance(0.3)) {
        // Give up the hunt
        return resetIntent(behavior, 'patrolling');
      }
      break;

    case 'resting':
      if (health > 60) {
        return resetIntent(behavior, hunger > 50 ? 'hunting' : 'patrolling');
      }
      break;

    default:
      // Predators don't forage — reset to patrol
      return resetIntent(behavior, 'patrolling');
  }

  return behavior;
}

function resetIntent(behavior: NPCBehaviorState, newIntent: NPCBehaviorState['intent']): NPCBehaviorState {
  return { ...behavior, intent: newIntent, turnsInState: 0 };
}

/**
 * Determine NPC movement based on intent.
 * Returns the target node ID, or undefined to stay put.
 */
function computeMovement(
  npc: NPC,
  behavior: NPCBehaviorState,
  ctx: NPCTickContext,
  rng: Rng,
): string | undefined {
  if (!npc.currentNodeId || ctx.adjacentNodeIds.length === 0) return undefined;

  switch (behavior.intent) {
    case 'resting':
      // Stay put
      return undefined;

    case 'hunting': {
      // Move toward player node if adjacent, otherwise toward food-rich areas
      if (ctx.playerNodeId && ctx.adjacentNodeIds.includes(ctx.playerNodeId)) {
        if (rng.chance(0.5)) return ctx.playerNodeId; // Not always — unpredictable
      }
      // Prefer nodes not recently visited
      return pickUnvisitedNode(behavior, ctx.adjacentNodeIds, rng);
    }

    case 'patrolling': {
      // Random walk, avoiding recently visited nodes
      if (!rng.chance(0.4)) return undefined; // Often stays put
      return pickUnvisitedNode(behavior, ctx.adjacentNodeIds, rng);
    }

    case 'foraging': {
      // Move toward food-rich adjacent nodes
      if (ctx.currentNodeFood > 50) return undefined; // Stay if food is good
      const foodRich = ctx.adjacentNodeIds.filter(id => (ctx.adjacentNodeFood[id] ?? 0) > ctx.currentNodeFood);
      if (foodRich.length > 0) return rng.pick(foodRich);
      if (rng.chance(0.3)) return rng.pick(ctx.adjacentNodeIds);
      return undefined;
    }

    case 'territorial': {
      // Stay near home range
      if (behavior.homeNodeId && npc.currentNodeId !== behavior.homeNodeId) {
        if (ctx.adjacentNodeIds.includes(behavior.homeNodeId)) {
          return behavior.homeNodeId;
        }
      }
      return undefined;
    }

    case 'migrating': {
      // Move toward goal, or random if no goal
      if (behavior.goalNodeId && ctx.adjacentNodeIds.includes(behavior.goalNodeId)) {
        return behavior.goalNodeId;
      }
      return pickUnvisitedNode(behavior, ctx.adjacentNodeIds, rng);
    }

    case 'fleeing': {
      // Move away from player
      const awayFromPlayer = ctx.adjacentNodeIds.filter(id => id !== ctx.playerNodeId);
      if (awayFromPlayer.length > 0) return rng.pick(awayFromPlayer);
      return rng.pick(ctx.adjacentNodeIds);
    }

    case 'mating':
      // Wander looking for mates
      if (rng.chance(0.3)) return rng.pick(ctx.adjacentNodeIds);
      return undefined;

    default:
      return undefined;
  }
}

/**
 * Pick an adjacent node that hasn't been recently visited.
 */
function pickUnvisitedNode(
  behavior: NPCBehaviorState,
  adjacentIds: string[],
  rng: Rng,
): string | undefined {
  const unvisited = adjacentIds.filter(id => !behavior.recentNodes.includes(id));
  if (unvisited.length > 0) return rng.pick(unvisited);
  return rng.pick(adjacentIds);
}
