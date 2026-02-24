/** Phase 8: Challenge/Scenario Mode types */

export interface ScenarioWinCondition {
  type: 'survive_turns' | 'reach_weight' | 'reproduce' | 'reach_region';
  target: number | string;
  description: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  speciesId: string;
  difficulty: 'easy' | 'normal' | 'hard';
  sex?: 'male' | 'female';
  backstoryType?: string;
  startingWeight?: number;
  startingAge?: number;
  startingFlags?: string[];
  startingInjuries?: { injuryId: string; severity: number }[];
  startingParasites?: { parasiteId: string; stage: number }[];
  regionOverride?: string;
  winCondition: ScenarioWinCondition;
}

export interface ScenarioScore {
  scenarioId: string;
  turnsCompleted: number;
  won: boolean;
  fitness: number;
  date: number; // timestamp
}
