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
//  AGE PHASES
// ════════════════════════════════════════════════

export interface AgePhase {
  id: string;
  label: string;
  minAge: number;          // In months (inclusive)
  maxAge?: number;         // In months (exclusive); undefined = no upper bound
  statModifiers?: { stat: StatId; amount: number }[];
}

// ════════════════════════════════════════════════
//  MIGRATION CONFIG
// ════════════════════════════════════════════════

export interface MigrationConfig {
  winterRegionId: string;
  winterRegionName: string;
  migrationFlag: string;        // 'will-migrate'
  migratedFlag: string;         // 'has-migrated'
  returnFlag: string;           // 'returned-from-migration'
  migrationSeason: Season;      // When migration happens
  returnSeason: Season;         // When return happens
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

  /** Thermal stress profile. Ectotherms lose weight in heat (higher metabolism), endotherms lose weight in cold (thermoregulation cost). */
  thermalProfile?: {
    type: 'ectotherm' | 'endotherm';
    heatPenalty: number;
    coldPenalty: number;
    coldBenefit: number;
  };

  /** Classification of body size for mathematical scaling. */
  massType?: 'micro' | 'macro' | 'mega';

  /** Per-turn passive weight change by season. Positive = gain, negative = loss. */
  seasonalWeight: {
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
    /** Multiplier applied to foraging behavioral setting (1-5). E.g., 0.3 means +0.3 to +1.5 lbs/turn. */
    foragingBonus: number;
  };

  /** Age phase thresholds (in months) and stat modifiers */
  agePhases: AgePhase[];

  /** Migration config (deer only for now; undefined means no migration) */
  migration?: MigrationConfig;

  reproduction: ReproductionConfig;

  phases?: LifecyclePhase[];

  /** Time unit per turn. 'week' = 4 turns/month (default). 'month' = 1 turn/month. */
  turnUnit?: 'week' | 'month' | 'day';

  /** Natural activity pattern */
  diurnalType?: 'diurnal' | 'nocturnal' | 'crepuscular';

  /** If true, when the animal dies after spawning, continue as next generation instead of game over */
  lineageMode?: boolean;

  /** Display unit for weight (default: 'lbs'). Used for UI display only. */
  weightUnit?: string;

  /** Multiplier to convert internal weight (lbs) to display unit. E.g., 453592 converts lbs to mg. */
  weightDisplayMultiplier?: number;

  /** Species-specific overrides for voluntary actions */
  actions?: {
    overrides?: Record<string, {
      label?: string;
      description?: string;
      narrative?: string;
      weightGain?: number;
    }>;
  };

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
