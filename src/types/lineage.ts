/** Phase 9: Trait Inheritance types */

import { StatId } from './stats';

export interface LineageTraits {
  generation: number;
  parentFinalStats: Record<StatId, number>;
  traitBiases: Partial<Record<StatId, number>>; // inherited deviation from baseline
  lineageFlags: string[]; // persistent flags across generations
}
