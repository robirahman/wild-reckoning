import type { StatId } from './stats';
import type { Season } from './world';
import type { Diet, Backstory } from './species';
import type { GameEvent } from './events';
import type { ParasiteDefinition, InjuryDefinition } from './health';

// ════════════════════════════════════════════════
//  REPRODUCTION CONFIGS
// ════════════════════════════════════════════════

export interface MaleCompetitionConfig {
  enabled: boolean;
  baseWinProb: number;
  maxWinProb: number;
  minWinProb: number;
  heaFactor: number;
  weightReferencePoint: number;
  weightFactor: number;
  lowStressThreshold: number;
  lowStressFactor: number;
  injuryPenalty: number;
  parasitePenalty: number;
  lossInjuryChance: number;
  lossInjuryId: string;
  lossInjuryBodyParts: string[];
  challengeFlag: string;
  matedFlag: string;
}

export interface OffspringCountFormula {
  weightReference: number;
  weightDivisor: number;
  heaReference: number;
  heaDivisor: number;
  singleThreshold: number;
  tripletThreshold: number;
  maxOffspring: number;
}

export interface IteroparousReproConfig {
  type: 'iteroparous';
  matingMinAge: number;
  matingOnsetAge: number;
  matingSeasons: Season[] | 'any';
  matingSeasonResetMonth: string;
  maleCompetition: MaleCompetitionConfig;
  gestationTurns: number;
  offspringCountFormula: OffspringCountFormula;
  offspringLabel: string;
  offspringLabelPlural: string;
  offspringLabelSingle: string;
  offspringLabelTwin: string;
  offspringLabelTriple: string;
  dependenceTurns: number;
  maturationTurns: number;
  offspringBaseSurvival: number;
  offspringSurvivalWinterPenalty: number;
  offspringSurvivalSummerBonus: number;
  offspringSurvivalYoungPenalty: number;
  offspringSurvivalYoungThreshold: number;
  offspringSurvivalMin: number;
  offspringSurvivalMax: number;
  offspringDeathCauses: string[];
  pregnantFlag: string;
  dependentFlag: string;
  independenceFlag: string;
}

export interface SemelparousReproConfig {
  type: 'semelparous';
  spawningMinAge: number;
  spawningSeasons: Season[];
  baseEggCount: number;
  eggCountHeaFactor: number;
  eggCountWeightFactor: number;
  eggSurvivalBase: number;
  eggSurvivalWisFactor: number;
  spawningMigrationFlag: string;
  spawningGroundsFlag: string;
  spawningCompleteFlag: string;
  maleCompetition: MaleCompetitionConfig;
}

export type ReproductionConfig = IteroparousReproConfig | SemelparousReproConfig;

// ════════════════════════════════════════════════
//  LIFECYCLE PHASES (salmon)
// ════════════════════════════════════════════════

export interface LifecyclePhase {
  id: string;
  label: string;
  entryFlag?: string;
  regionId: string;
  description: string;
}

// ════════════════════════════════════════════════
//  MAIN SPECIES CONFIG
// ════════════════════════════════════════════════

export interface SpeciesConfig {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  diet: Diet;
  defaultRegion: string;
  defaultRegionDisplayName: string;

  startingWeight: { male: number; female: number };
  startingAge: Record<string, number>;
  baseStats: Record<StatId, number>;

  weight: {
    starvationDeath: number;
    starvationDebuff: number;
    vulnerabilityThreshold: number;
    minFloor: number;
    debuffMaxPenalty: number;
  };

  age: {
    oldAgeOnsetMonths: number;
    oldAgeBaseChance: number;
    oldAgeEscalation: number;
    maxOldAgeChance: number;
  };

  diseaseDeathChanceAtCritical: number;

  predationVulnerability: {
    injuryProbIncrease: number;
    parasiteProbIncrease: number;
    underweightFactor: number;
    underweightThreshold: number;
    deathChanceMin: number;
    deathChanceMax: number;
  };

  reproduction: ReproductionConfig;

  phases?: LifecyclePhase[];

  templateVars: {
    speciesName: string;
    regionName: string;
    maleNoun: string;
    femaleNoun: string;
    youngNoun: string;
    youngNounPlural: string;
    groupNoun: string;
    habitat: string;
  };
}

// ════════════════════════════════════════════════
//  SPECIES DATA BUNDLE
// ════════════════════════════════════════════════

export interface SpeciesDataBundle {
  config: SpeciesConfig;
  events: GameEvent[];
  parasites: Record<string, ParasiteDefinition>;
  injuries: Record<string, InjuryDefinition>;
  backstories: Backstory[];
}
