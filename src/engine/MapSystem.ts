import type { RegionMap, MapNode } from '../types/map';
import type { Rng } from './RandomUtils';

export function generateRegionMap(rng: Rng, nodeCount: number = 8): RegionMap {
  const nodes: MapNode[] = [];
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `node-${i}`,
      x: rng.int(10, 90),
      y: rng.int(10, 90),
      type: rng.pick(['forest', 'plain', 'water', 'mountain']),
      resources: {
        food: rng.int(20, 80),
        water: rng.int(20, 80),
        cover: rng.int(20, 80),
      },
      hazards: {
        predatorDensity: rng.int(0, 50),
      },
      scentLevel: rng.int(0, 20),
      noiseLevel: rng.int(0, 10),
      visited: i === 0,
      discovered: i === 0,
      connections: [],
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
