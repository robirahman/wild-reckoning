export type NPCType = 'rival' | 'ally' | 'mate' | 'predator' | 'offspring';

export type NPCRelationship = 'hostile' | 'neutral' | 'friendly' | 'bonded';

export interface NPC {
  id: string;
  name: string;
  type: NPCType;
  speciesLabel: string; // e.g., "buck", "doe", "wolf"
  relationship: NPCRelationship;
  alive: boolean;
  introducedOnTurn: number;
  lastSeenTurn: number;
}

export interface NPCTemplate {
  type: NPCType;
  speciesLabel: string;
  namePool: string[];
}
