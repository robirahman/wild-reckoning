import type { RegionMap, MapNode, NodeType } from '../types/map';
import type { Rng } from './RandomUtils';

/** Terrain-specific defaults for new nodes */
const TERRAIN_DEFAULTS: Record<NodeType, { foodCapacity: number; foodRegenRate: number; movementCost: number; coverBase: [number, number] }> = {
  forest:   { foodCapacity: 90,  foodRegenRate: 4, movementCost: 10, coverBase: [50, 90] },
  plain:    { foodCapacity: 70,  foodRegenRate: 3, movementCost: 8,  coverBase: [10, 40] },
  water:    { foodCapacity: 50,  foodRegenRate: 2, movementCost: 15, coverBase: [20, 50] },
  mountain: { foodCapacity: 40,  foodRegenRate: 1, movementCost: 20, coverBase: [30, 60] },
  den:      { foodCapacity: 60,  foodRegenRate: 3, movementCost: 10, coverBase: [70, 95] },
};

export function generateRegionMap(rng: Rng, nodeCount: number = 8): RegionMap {
  const nodes: MapNode[] = [];

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const type: NodeType = rng.pick(['forest', 'plain', 'water', 'mountain']);
    const defaults = TERRAIN_DEFAULTS[type];
    const foodCapacity = defaults.foodCapacity + rng.int(-10, 10);
    nodes.push({
      id: `node-${i}`,
      x: rng.int(10, 90),
      y: rng.int(10, 90),
      type,
      resources: {
        food: rng.int(Math.round(foodCapacity * 0.4), foodCapacity),
        water: rng.int(20, 80),
        cover: rng.int(defaults.coverBase[0], defaults.coverBase[1]),
      },
      foodCapacity,
      foodRegenRate: defaults.foodRegenRate,
      movementCost: defaults.movementCost,
      hazards: {
        predatorDensity: rng.int(0, 50),
      },
      scentLevel: rng.int(0, 20),
      noiseLevel: rng.int(0, 10),
      visited: i === 0,
      discovered: i === 0,
      connections: [],
      presentNPCIds: [],
      recentActivity: [],
    });
  }
  
  // Connect nodes linearly + some random loops
  for (let i = 0; i < nodeCount - 1; i++) {
    nodes[i].connections.push(nodes[i + 1].id);
    nodes[i + 1].connections.push(nodes[i].id);
  }
  
  // Add random connections
  for (let i = 0; i < nodeCount; i++) {
    if (rng.chance(0.3)) {
      const target = rng.int(0, nodeCount - 1);
      if (target !== i && !nodes[i].connections.includes(nodes[target].id)) {
        nodes[i].connections.push(nodes[target].id);
        nodes[target].connections.push(nodes[i].id);
      }
    }
  }
  
  return {
    nodes,
    currentLocationId: nodes[0].id,
  };
}
