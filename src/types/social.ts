export type SocialRank = 'alpha' | 'beta' | 'subordinate' | 'omega' | 'lone';

export interface PackMember {
  id: string; // NPC ID
  rank: SocialRank;
}

export interface SocialState {
  rank: SocialRank;
  packId?: string;
  dominance: number; // 0-100, determines rank challenges
  packMembers: string[]; // NPC IDs
  
  // For hive minds (Bees/Ants)
  hive?: {
    foodStore: number;
    larvaCount: number;
    queenAlive: boolean;
  };
}

export const INITIAL_SOCIAL_STATE: SocialState = {
  rank: 'lone',
  dominance: 50,
  packMembers: [],
};
