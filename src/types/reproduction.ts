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
  fawnCount: number;
}

export interface ReproductionState {
  offspring: Offspring[];
  pregnancy: PregnancyState | null;
  matedThisSeason: boolean;
  totalFitness: number;
}

export const INITIAL_REPRODUCTION_STATE: ReproductionState = {
  offspring: [],
  pregnancy: null,
  matedThisSeason: false,
  totalFitness: 0,
};
