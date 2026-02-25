/** Phase 6: Territory/Home Range types */

export interface TerritoryState {
  established: boolean;
  denNodeId?: string; // Node ID where den/nest is built
  size: number; // 0-100 relative scale
  quality: number; // 0-100, affects foraging weight gain
  contested: boolean;
  markedTurns: number; // turns since last marking
  intruderPresent: boolean;
}

export const INITIAL_TERRITORY: TerritoryState = {
  established: false,
  size: 0,
  quality: 50,
  contested: false,
  markedTurns: 0,
  intruderPresent: false,
};
