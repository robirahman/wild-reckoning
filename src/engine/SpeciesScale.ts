export interface ScalingConstants {
  weightGainMult: number;
  weightLossMult: number;
  metabolicRate: number; // energy drain per turn
  healingRate: number;
  movementCost: number; // energy cost per map move
}

export const SPECIES_SCALES: Record<'micro' | 'macro' | 'mega', ScalingConstants> = {
  micro: {
    weightGainMult: 0.000001,
    weightLossMult: 0.000002,
    metabolicRate: 15, // fast drain
    healingRate: 5,
    movementCost: 10,
  },
  macro: {
    weightGainMult: 1.0,
    weightLossMult: 1.0,
    metabolicRate: 5,
    healingRate: 2,
    movementCost: 5,
  },
  mega: {
    weightGainMult: 10.0,
    weightLossMult: 8.0,
    metabolicRate: 2, // slow but high volume
    healingRate: 1,
    movementCost: 2,
  }
};

export function getScaling(massType: string = 'macro'): ScalingConstants {
  return SPECIES_SCALES[massType as keyof typeof SPECIES_SCALES] || SPECIES_SCALES.macro;
}
