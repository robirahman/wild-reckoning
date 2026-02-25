/** Phase 5: Ecosystem Web types */
import type { NPC } from './npc';

export interface PopulationState {
  speciesName: string;
  level: number; // -2 to +2 deviation from baseline (0 = normal)
  trend: 'declining' | 'stable' | 'growing';
}

export interface EcosystemLink {
  predator: string; // species name (display)
  prey: string;
  regionIds: string[];
  strength: number; // how strongly predator depends on prey (0-1)
}

export interface EcosystemEvent {
  threshold: number; // population level that triggers this
  direction: 'below' | 'above';
  speciesName: string;
  narrativeText: string;
}

export interface EcosystemState {
  populations: Record<string, PopulationState>;
  lastEventTurn: number;
  resourcePressure: number; // 0-100, affects recovery and cascade triggers
  regionNPCs: Record<string, NPC[]>; // Tracking individuals globally
}
