import type { SocialRank } from './social';

export type NPCType = 'rival' | 'ally' | 'mate' | 'predator' | 'offspring';

export type NPCRelationship = 'hostile' | 'neutral' | 'friendly' | 'bonded';

export interface NPC {
  id: string;
  name: string;
  type: NPCType;
  speciesId: string;
  speciesLabel: string; // e.g., "buck", "doe", "wolf"
  relationship: NPCRelationship;
  rank?: SocialRank;
  alive: boolean;
  currentNodeId?: string;
  introducedOnTurn: number;
  lastSeenTurn: number;
  encounters: number;
}

export interface NPCTemplate {
  type: NPCType;
  speciesLabel: string;
  namePool: string[];
}
