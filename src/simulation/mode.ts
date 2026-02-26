import type { SpeciesConfig } from '../types/speciesConfig';
import type { AnimalState } from '../types/species';

/**
 * Whether a species uses the simulation engine (anatomy + harm physics + sim triggers)
 * vs. the legacy hardcoded event system.
 *
 * A species is in simulation mode if it has an anatomyId set in its config.
 */
export function isSimulationMode(config: SpeciesConfig): boolean {
  return !!config.anatomyId;
}

/** Whether the animal has an active body state (simulation layer initialized) */
export function hasBodyState(animal: AnimalState): boolean {
  return !!animal.bodyState && !!animal.anatomyIndex;
}
