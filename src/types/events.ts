import type { Season } from './world';
import { StatId } from './stats';

export type EventType = 'active' | 'passive';

export type EventCategory =
  | 'foraging'
  | 'predator'
  | 'seasonal'
  | 'social'
  | 'environmental'
  | 'health'
  | 'psychological'
  | 'migration'
  | 'reproduction';

// ── Stat Effects ──

export interface StatEffect {
  stat: StatId;
  amount: number; // Positive = increase stat, Negative = decrease
  duration?: number; // Turns; omit for instant permanent change
  label: string; // Display text: "-TRA", "+HOM"
}

// ── Event Conditions ──

export type EventCondition =
  | { type: 'season'; seasons: Season[] }
  | { type: 'region'; regionIds: string[] }
  | { type: 'species'; speciesIds: string[] }
  | { type: 'diet'; diets: string[] }
  | { type: 'stat_above'; stat: StatId; threshold: number }
  | { type: 'stat_below'; stat: StatId; threshold: number }
  | { type: 'has_parasite'; parasiteId: string }
  | { type: 'no_parasite'; parasiteId: string }
  | { type: 'has_injury' }
  | { type: 'age_range'; min?: number; max?: number }
  | { type: 'has_flag'; flag: string }
  | { type: 'no_flag'; flag: string }
  | { type: 'weight_above'; threshold: number }
  | { type: 'weight_below'; threshold: number }
  | { type: 'sex'; sex: 'male' | 'female' }
  | { type: 'weather'; weatherTypes: string[] };

// ── Consequences ──

export type Consequence =
  | { type: 'add_parasite'; parasiteId: string; startStage?: number }
  | { type: 'add_injury'; injuryId: string; severity?: number; bodyPart?: string }
  | { type: 'remove_parasite'; parasiteId: string }
  | { type: 'change_region'; regionId: string }
  | { type: 'set_flag'; flag: string }
  | { type: 'remove_flag'; flag: string }
  | { type: 'modify_weight'; amount: number }
  | { type: 'modify_age'; amount: number }
  | { type: 'death'; cause: string }
  | { type: 'trigger_event'; eventId: string }
  | { type: 'start_pregnancy'; offspringCount: number }
  | { type: 'sire_offspring'; offspringCount: number }
  | { type: 'spawn' }
  | { type: 'introduce_npc'; npcType: 'rival' | 'ally' | 'mate' | 'predator' | 'offspring' }
  | { type: 'modify_population'; speciesName: string; amount: number }
  | { type: 'modify_territory'; sizeChange?: number; qualityChange?: number };

// ── Sub-Events ──

export interface SubEventTrigger {
  eventId: string;
  chance: number; // 0-1 probability
  conditions?: EventCondition[];
  narrativeText: string;
  footnote?: string;
  statEffects: StatEffect[];
  consequences: Consequence[];
}

// ── Choices ──

export interface DeathChance {
  probability: number;
  cause: string;
  statModifiers?: { stat: StatId; factor: number }[];
}

export interface EventChoice {
  id: string;
  label: string;
  description?: string; // Tooltip or sub-text
  narrativeResult?: string; // Text shown after choosing
  statEffects: StatEffect[];
  consequences: Consequence[];
  revocable: boolean; // "You can freely change this option later"
  style: 'default' | 'danger'; // "Don't follow" had red border
  deathChance?: DeathChance;
}

// ── Main Event Definition ──

export interface GameEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  narrativeText: string; // Supports {{template.variables}}
  image?: string;
  statEffects: StatEffect[];
  consequences?: Consequence[];
  choices?: EventChoice[];
  subEvents?: SubEventTrigger[];
  conditions: EventCondition[];
  weight: number; // Base probability weight for event selection
  cooldown?: number; // Minimum turns before this event can fire again
  tags: string[]; // For behavioral setting influence: ["foraging", "food"]
  footnote?: string;
}

// ── Resolved Event (runtime, after generation) ──

export interface ResolvedSubEvent {
  eventId: string;
  narrativeText: string;
  footnote?: string;
  statEffects: StatEffect[];
  consequences: Consequence[];
}

export interface ResolvedEvent {
  definition: GameEvent;
  resolvedNarrative: string; // Template variables filled in
  triggeredSubEvents: ResolvedSubEvent[];
  choiceMade?: string; // Choice ID if the player has chosen
}
