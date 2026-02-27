export type NodeType = 'forest' | 'water' | 'mountain' | 'plain' | 'den';

export interface MapNode {
  id: string;
  x: number; // 0-100 visual position
  y: number; // 0-100 visual position
  type: NodeType;
  resources: {
    food: number; // 0-100 current food level
    water: number; // 0-100
    cover: number; // 0-100 (safety)
  };
  /** Maximum food this node can hold (varies by terrain type) */
  foodCapacity: number;
  /** Base food regeneration per turn (before seasonal multiplier) */
  foodRegenRate: number;
  /** Base energy cost to traverse this node */
  movementCost: number;
  hazards: {
    predatorDensity: number; // 0-100
  };
  scentLevel: number; // 0-100, fades over time
  noiseLevel: number; // 0-100, anthropogenic or natural
  visited: boolean;
  discovered: boolean;
  connections: string[]; // IDs of connected nodes
  /** NPC IDs currently present at this node */
  presentNPCIds: string[];
  /** Recent activity log for spatial awareness */
  recentActivity: NodeActivityEntry[];
}

export interface NodeActivityEntry {
  type: 'predator_sighting' | 'kill' | 'conspecific' | 'human_activity';
  turn: number;
  sourceId?: string; // NPC or event ID
}

export interface RegionMap {
  nodes: MapNode[];
  currentLocationId: string;
}
