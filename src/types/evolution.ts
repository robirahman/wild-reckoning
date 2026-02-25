import type { StatId } from './stats';

export interface Mutation {
  id: string;
  name: string;
  description: string;
  type: 'stat' | 'trait' | 'ability';
  statModifiers?: { stat: StatId; amount: number }[];
  traitId?: string; // e.g., 'cold_resistance'
  rarity: 'common' | 'rare' | 'legendary';
}

export interface AncestorRecord {
  generation: number;
  speciesId: string;
  name?: string;
  causeOfDeath: string;
  mutationChosen?: Mutation;
}

export interface EvolutionState {
  activeMutations: Mutation[];
  availableChoices: Mutation[]; // For the selection screen
  generationCount: number;
  lineageHistory: AncestorRecord[];
}
