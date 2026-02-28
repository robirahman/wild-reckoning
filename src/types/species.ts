import type { StatBlock } from './stats';
import type { BehavioralSettings } from './behavior';
import type { ActiveParasite, ActiveInjury, ActiveCondition } from './health';
import type { Season } from './world';
import type { Mutation } from './evolution';
import type { SocialState } from './social';
import type { GameFlag } from './flags';
import type { LifetimeStats } from './stats';
import type { BodyState } from '../simulation/anatomy/bodyState';
import type { AnatomyIndex } from '../simulation/anatomy/types';
import type { DebriefingEntry } from '../simulation/narrative/types';
import type { PhysiologyState } from '../simulation/physiology/types';
import type { CausalChain } from '../simulation/memory/causalChain';

export type Diet = 'herbivore' | 'carnivore' | 'omnivore';

export interface WeightRange {
  ageMonths: number;
  male: { min: number; max: number };
  female: { min: number; max: number };
}

export interface SeasonalBehavior {
  season: Season;
  description: string;
  statModifiers?: { stat: string; amount: number }[];
  behavioralDefaults?: Partial<BehavioralSettings>;
}

export interface MigrationPattern {
  triggerSeason: Season;
  triggerMonth: number; // Month index
  fromRegion: string;
  toRegion: string;
  description: string;
}

export interface SpeciesDefinition {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  diet: Diet;
  regions: string[];
  baseStats: StatBlock;
  weightRanges: WeightRange[];
  lifespan: { typical: number; max: number }; // In months
  predators: string[];
  seasonalBehaviors: SeasonalBehavior[];
  migrationPatterns?: MigrationPattern[];
  portraitImage?: string;
}

// ── Backstory ──

export type BackstoryType = string;

export interface Backstory {
  type: BackstoryType;
  label: string;
  description: string;
  monthsSinceEvent: number;
  statAdjustments: { stat: string; amount: number }[];
}

export const BACKSTORY_OPTIONS: Backstory[] = [
  {
    type: 'rehabilitation',
    label: 'Rehabilitated & Released',
    description: 'You were found injured as a fawn and nursed back to health at a wildlife rehabilitation center before being released into the wild.',
    monthsSinceEvent: 11,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'NOV', amount: 15 },
      { stat: 'WIS', amount: -10 },
      { stat: 'ADV', amount: -5 },
    ],
  },
  {
    type: 'wild-born',
    label: 'Wild Born',
    description: 'You were born in the forest and raised by your mother until she was taken by predators. You have survived on your own since.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 10 },
      { stat: 'TRA', amount: 5 },
      { stat: 'ADV', amount: 10 },
    ],
  },
  {
    type: 'orphaned',
    label: 'Orphaned Young',
    description: 'Your mother was killed by hunters when you were only a few months old. You barely survived your first winter alone.',
    monthsSinceEvent: 8,
    statAdjustments: [
      { stat: 'TRA', amount: 20 },
      { stat: 'ADV', amount: 15 },
      { stat: 'WIS', amount: 5 },
      { stat: 'HEA', amount: -10 },
    ],
  },
];

// ── Animal State (runtime) ──

export interface AnimalState {
  speciesId: string;
  name?: string;
  age: number; // In months
  weight: number; // In lbs
  sex: 'male' | 'female';
  region: string; // Current region ID
  stats: StatBlock;
  parasites: ActiveParasite[];
  injuries: ActiveInjury[];
  conditions: ActiveCondition[];
  backstory: Backstory;
  flags: Set<GameFlag>; // Persistent flags set by events
  alive: boolean;
  causeOfDeath?: string;
  
  // New Systems
  activeMutations: Mutation[];
  social: SocialState;
  perceptionRange: number; // 1 = adjacent, 2 = 2 nodes away
  energy: number; // 0-100
  
  // New Visceral Systems
  nutrients: {
    minerals: number; // 0-100
    vitamins: number; // 0-100
  };
  physiologicalStress: {
    hypothermia: number; // 0-100
    starvation: number; // 0-100
    panic: number; // 0-100
  };
  lifetimeStats: LifetimeStats;

  // Simulation Layer (Phase 0+)
  /** Anatomy-based body state. Present only for species with anatomy definitions. */
  bodyState?: BodyState;
  /** Indexed anatomy definition for fast lookups. Present only if bodyState is. */
  anatomyIndex?: AnatomyIndex;
  /** Debriefing log: clinical summaries of events, replayed at game over. */
  debriefingLog?: DebriefingEntry[];

  /** Continuous physiology simulation state. Present only for species with metabolismId. */
  physiologyState?: PhysiologyState;

  /** Causal chains built at death: connected sequences from initial event to final outcome. */
  causalChains?: CausalChain[];
}
