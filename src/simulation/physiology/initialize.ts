import type { PhysiologyState } from './types';
import type { SpeciesConfig } from '../../types/speciesConfig';
import { computeBodyCondition } from './helpers';

/**
 * Create the initial PhysiologyState for a newly-started simulation-mode animal.
 * Called once at game start alongside anatomy initialization.
 */
export function initializePhysiology(
  config: SpeciesConfig,
  startingWeight: number,
): PhysiologyState {
  const bodyCondition = computeBodyCondition(startingWeight, config);

  return {
    // Metabolism: start with modest reserves (healthy but not fat)
    caloricReserve: startingWeight * 15, // ~15 kcal-units per lb at start
    caloricIntakeThisTurn: 0,
    avgCaloricBalance: 0,

    // Thermoregulation: normal
    coreTemperatureDeviation: 0,
    thermoregulationCost: 0,

    // Immune: healthy baseline
    immuneCapacity: 80,
    immuneLoad: 0,
    immunocompromised: false,

    // Condition cascades
    feverLevel: 0,

    // Derived
    bodyConditionScore: bodyCondition,
    negativeEnergyBalance: false,
  };
}
