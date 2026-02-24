/** A simplified record of an offspring — not a full AnimalState simulation */
export interface Offspring {
  id: string;
  sex: 'male' | 'female';
  bornOnTurn: number;
  bornInYear: number;
  motherWisAtBirth: number;
  alive: boolean;
  causeOfDeath?: string;
  independent: boolean;
  matured: boolean;
  ageTurns: number;
  siredByPlayer: boolean;
}

export interface PregnancyState {
  conceivedOnTurn: number;
  turnsRemaining: number;
  offspringCount: number;
}

export interface IteroparousReproductionState {
  type: 'iteroparous';
  offspring: Offspring[];
  pregnancy: PregnancyState | null;
  matedThisSeason: boolean;
  totalFitness: number;
}

export interface SemelparousReproductionState {
  type: 'semelparous';
  spawned: boolean;
  eggCount: number;
  estimatedSurvivors: number;
  totalFitness: number;
}

export type ReproductionState = IteroparousReproductionState | SemelparousReproductionState;

export const INITIAL_ITEROPAROUS_STATE: IteroparousReproductionState = {
  type: 'iteroparous',
  offspring: [],
  pregnancy: null,
  matedThisSeason: false,
  totalFitness: 0,
};

export const INITIAL_SEMELPAROUS_STATE: SemelparousReproductionState = {
  type: 'semelparous',
  spawned: false,
  eggCount: 0,
  estimatedSurvivors: 0,
  totalFitness: 0,
};
