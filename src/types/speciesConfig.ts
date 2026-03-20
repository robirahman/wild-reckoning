import type { StatId } from './stats';
import type { Season } from './world';
import type { Diet, Backstory } from './species';
import type { GameEvent } from './events';
import type { ParasiteDefinition, InjuryDefinition } from './health';
import type { GameFlag } from './flags';

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
  challengeFlag: GameFlag;
  matedFlag: GameFlag;
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
  /** Per-turn probability of automatic mating when conditions are met (female, right age/season, not pregnant).
   *  Calibrate so mean lifetime fitness ≈ 2 (demographic replacement rate). Default: 0.08. */
  autoMatingProbability?: number;
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
  pregnantFlag: GameFlag;
  dependentFlag: GameFlag;
  independenceFlag: GameFlag;
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
  spawningMigrationFlag: GameFlag;
  spawningGroundsFlag: GameFlag;
  spawningCompleteFlag: GameFlag;
  maleCompetition: MaleCompetitionConfig;
}

export type ReproductionConfig = IteroparousReproConfig | SemelparousReproConfig;

// ════════════════════════════════════════════════
//  LIFECYCLE PHASES (salmon)
// ════════════════════════════════════════════════

export interface LifecyclePhase {
  id: string;
  label: string;
  entryFlag?: GameFlag;
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
  migrationFlag: GameFlag;        // 'will-migrate'
  migratedFlag: GameFlag;         // 'has-migrated'
  returnFlag: GameFlag;           // 'returned-from-migration'
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
    maximumBiologicalWeight: number;
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

  /** Hydration profile. If absent, species does not track thirst (aquatic/enclosed). */
  hydration?: {
    baseDehydrationRate: number;
    heatMultiplier: number;
    waterNodeRecovery: number;
    passiveMoistureRecovery: number;
    debuffThreshold: number;
    movementPenaltyThreshold: number;
    lethalThreshold: number;
    heaPenalty: number;
  };

  /** Classification of body size for mathematical scaling. */
  massType?: 'micro' | 'macro' | 'mega';

  /** Anatomy definition ID for the simulation layer. If set, body state tracking is enabled. */
  anatomyId?: string;

  /** Metabolism config ID for the physiology engine. If set, continuous physiology ticking is enabled. */
  metabolismId?: string;

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

  /** Per-turn passive HEA recovery (0–5). Represents natural healing capacity.
   *  Long-lived species need this to counteract cumulative event-based HEA drain.
   *  Applied each turn as a temporary +HEA modifier when effective HEA is below base. */
  naturalHealingRate?: number;

  /** Weight-based health recovery for long-lived species. When above minWeight,
   *  the animal trades weightCostPerHeal lbs for healPerTurn HEA each turn. */
  weightBasedHealing?: {
    minWeight: number;
    healPerTurn: number;
    weightCostPerHeal: number;
  };

  /** Base attention budget for behavioral sliders. Total slider points cannot exceed this.
   *  Varies by species intelligence (elephant 22, deer 18, insect 12). Age and wisdom
   *  can increase the effective budget at runtime. Default: 18. */
  attentionBudget?: number;

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
