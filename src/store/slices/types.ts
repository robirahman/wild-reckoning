import type { StateCreator } from 'zustand';
import type { GameState } from '../gameStore';
import type { Difficulty } from '../../types/difficulty';
import type { SpeciesDataBundle } from '../../types/speciesConfig';
import type { AnimalState, Backstory } from '../../types/species';
import type { TimeState } from '../../types/world';
import type { BehavioralSettings } from '../../types/behavior';
import type { ResolvedEvent, StatEffect, Consequence } from '../../types/events';
import type { NPC } from '../../types/npc';
import type { ActiveStoryline } from '../../types/storyline';
import type { ReproductionState } from '../../types/reproduction';
import type { TurnResult } from '../../types/turnResult';
import type { EcosystemState } from '../../types/ecosystem';
import type { TerritoryState } from '../../types/territory';
import type { ScenarioDefinition } from '../../types/scenario';
import type { RegionMap } from '../../types/map';
import type { WeatherState } from '../../engine/WeatherSystem';
import type { EvolutionState } from '../../types/evolution';
import type { Rng } from '../../engine/RandomUtils';
import type { LineageTraits } from '../../types/lineage';
import { StatId, type LifetimeStats } from '../../types/stats';
import type { InstinctNudge } from '../../simulation/instinct/types';
import type { WorldMemory } from '../../simulation/memory/types';
import type { NPCBehaviorState } from '../../simulation/npc/types';

export type GameSlice<T> = StateCreator<GameState, [['zustand/devtools', never]], [], T>;

export interface TurnRecord {
  turn: number;
  month: string;
  year: number;
  season: string;
  events: ResolvedEvent[];
  statSnapshot: Record<StatId, number>;
}

export interface UISlice {
  phase: 'menu' | 'playing' | 'dead' | 'evolving';
  showingResults: boolean;
  tutorialStep: number | null;
  ambientText: string | null;
  fastForward: boolean;
  turnResult: TurnResult | null;
  /** Active instinct nudges for the current turn (transient, advisory only) */
  instinctNudges: InstinctNudge[];

  toggleFastForward: () => void;
  advanceTutorial: () => void;
  skipTutorial: () => void;
  dismissResults: () => void;
  returnToMenu: () => void;
  setTurnResult: (result: TurnResult) => void;
  setInstinctNudges: (nudges: InstinctNudge[]) => void;
}

export interface GameSystemSlice {
  speciesBundle: SpeciesDataBundle;
  difficulty: Difficulty;
  seed: number;
  rng: Rng;
  
  startGame: (speciesId: string, backstory: Backstory, sex: 'male' | 'female', difficulty?: Difficulty, seed?: number) => void;
  resumeGame: () => boolean;
}

export interface AnimalSlice {
  animal: AnimalState;
  behavioralSettings: BehavioralSettings;
  reproduction: ReproductionState;
  actionsPerformed: string[];
  evolution: EvolutionState;
  lineage: LineageTraits | null;
  lifetimeStats: LifetimeStats;

  updateBehavioralSetting: (key: keyof BehavioralSettings, value: 1 | 2 | 3 | 4 | 5) => void;
  performAction: (actionId: string) => void;
  killAnimal: (cause: string) => void;
  moveLocation: (nodeId: string) => void;
  sniff: () => void;
  selectMutation: (mutationId: string) => void;
}

export interface WorldSlice {
  time: TimeState;
  currentWeather: WeatherState | null;
  climateShift: number;
  ecosystem: EcosystemState;
  territory: TerritoryState;
  map: RegionMap | null;
  npcs: NPC[];
  activeStorylines: ActiveStoryline[];
  scenario: ScenarioDefinition | null;
  worldMemory: WorldMemory;
  /** NPC behavior states (keyed by NPC ID, stored separately for backward compatibility) */
  npcBehaviorStates: Record<string, NPCBehaviorState>;

  tickNPCMovement: () => void;
  setActiveStorylines: (storylines: ActiveStoryline[]) => void;
  setNPCs: (npcs: NPC[]) => void;
}

export interface TurnSlice {
  currentEvents: ResolvedEvent[];
  pendingChoices: string[];
  revocableChoices: Record<string, string>;
  turnHistory: TurnRecord[];
  eventCooldowns: Record<string, number>;

  setEvents: (events: ResolvedEvent[]) => void;
  makeChoice: (eventId: string, choiceId: string) => void;
  applyStatEffects: (effects: StatEffect[]) => void;
  applyConsequence: (consequence: Consequence) => void;
  advanceTurn: () => void;
  setEventCooldowns: (cooldowns: Record<string, number>) => void;
  resolveDeathRoll: (eventId: string, escapeOptionId: string) => void;
}
