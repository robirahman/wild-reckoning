export interface MapNode {
  id: string;
  x: number; // 0-100 visual position
  y: number; // 0-100 visual position
  type: 'forest' | 'water' | 'mountain' | 'plain' | 'den';
  resources: {
    food: number; // 0-100
    water: number; // 0-100
    cover: number; // 0-100 (safety)
  };
  hazards: {
    predatorDensity: number; // 0-100
  };
  scentLevel: number; // 0-100, fades over time
  noiseLevel: number; // 0-100, anthropogenic or natural
  visited: boolean;
  discovered: boolean;
  connections: string[]; // IDs of connected nodes
}

export interface RegionMap {
  nodes: MapNode[];
  currentLocationId: string;
}
