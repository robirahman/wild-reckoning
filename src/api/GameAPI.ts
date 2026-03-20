/**
 * Headless Game API for Wild Reckoning.
 *
 * Allows the game to be played and tested programmatically without a browser
 * or React. The API drives the same Zustand store and engine modules that the
 * UI uses, but replaces the React hook + Web Worker event pipeline with
 * synchronous calls.
 *
 * Usage:
 *   import { GameAPI } from './api/GameAPI';
 *   const game = new GameAPI();
 *   game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female' });
 *   let turn = game.generateTurn();
 *   // inspect turn.events, make choices …
 *   game.makeChoice(eventId, choiceId);
 *   let result = game.endTurn();
 *   // inspect result, then loop
 */

import { useGameStore, type GameState } from '../store/gameStore';
import { generateTurnEvents, resolveTurn } from '../engine/TurnProcessor';
import { StatId, computeEffectiveValue } from '../types/stats';
import { getSpeciesBundle } from '../data/species';
import { introduceNPC, introduceAllOfType, incrementEncounter, progressRelationship } from '../engine/NPCSystem';
import { tickStorylines } from '../engine/StorylineSystem';
import { generateAmbientText, synthesizeJournalEntry } from '../engine/AmbientTextGenerator';
import { tickEcosystem } from '../engine/EcosystemSystem';
import { tickTerritory, TERRITORIAL_SPECIES } from '../engine/TerritorySystem';
import { NPC_INTRODUCTION_MIN_TURN, TERRITORY_AUTO_ESTABLISH_TURN, TERRITORY_INITIAL_SIZE, TERRITORY_INITIAL_QUALITY } from '../engine/constants';
import { isSimulationMode } from '../simulation/mode';
import { generateSimulationEvents, drainDebriefingEntries } from '../simulation/events/SimEventGenerator';
import { calibrate } from '../simulation/calibration/calibrator';
import { DEER_MORTALITY } from '../simulation/calibration/data/deer';
import { getRegionDefinition } from '../data/regions';
import { computeInstincts } from '../simulation/instinct/engine';
import { pickIllustration } from '../engine/IllustrationPicker';
import { BACKSTORY_OPTIONS } from '../types/species';
import { getAllSpeciesIds } from '../data/species';
import type { SimulationContext } from '../simulation/events/types';
import type { CalibratedRates } from '../simulation/calibration/types';
import type { ResolvedEvent, EventChoice } from '../types/events';
import type { ActiveParasite, ActiveInjury, ActiveCondition } from '../types/health';
import type { TurnResult } from '../types/turnResult';
import type { BehavioralSettings, BehaviorLevel } from '../types/behavior';
import type { MapNode } from '../types/map';
import type { NPC } from '../types/npc';

// ---------------------------------------------------------------------------
// Types exposed by the API
// ---------------------------------------------------------------------------

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface StartOptions {
  species: string;
  backstory: string; // backstory type key, e.g. 'wild-born'
  sex: 'male' | 'female';
  difficulty?: Difficulty;
  seed?: number;
}

/** Minimal view of an event choice the caller can pick from. */
export interface ChoiceSummary {
  id: string;
  label: string;
  description?: string;
  style: 'default' | 'danger';
}

/** Minimal view of a generated event. */
export interface EventSummary {
  id: string;
  type: 'active' | 'passive';
  category: string;
  narrative: string;
  choices: ChoiceSummary[];
  tags: string[];
  choiceMade?: string;
}

/** Returned by generateTurn(). */
export interface TurnInfo {
  turn: number;
  month: number;
  year: number;
  season: string;
  events: EventSummary[];
  pendingChoices: string[];
  ambientText: string | null;
}

/** Compact stat snapshot. */
export type StatSnapshot = Record<StatId, number>;

/** Returned by getSnapshot(). */
export interface GameSnapshot {
  phase: string;
  turn: number;
  month: number;
  year: number;
  season: string;
  species: string;
  sex: string;
  age: number;
  weight: number;
  alive: boolean;
  causeOfDeath?: string;
  stats: StatSnapshot;
  parasites: string[];
  injuries: string[];
  conditions: string[];
  flags: string[];
  behavioralSettings: BehavioralSettings;
  energy: number;
  dehydration: number;
}

/** Detailed timeline entry for the run summary. */
export interface TimelineEntry {
  turn: number;
  month: string;
  year: number;
  text: string;
  category: 'injury' | 'parasite' | 'offspring' | 'migration' | 'milestone' | 'death';
}

/** Comprehensive end-of-run summary. */
export interface RunSummary {
  speciesName: string;
  sex: string;
  turnsLived: number;
  ageMonths: number;
  causeOfDeath?: string;
  totalFitness: number;
  grade: string;
  lifetimeStats: any; // LifetimeStats type from stats.ts
  timeline: TimelineEntry[];
}

/** Returned by endTurn(). */
export interface TurnResultSummary {
  eventOutcomes: {
    eventId: string;
    narrative: string;
    choiceLabel?: string;
    choiceId?: string;
    choiceNarrative?: string;
    deathRollSurvived?: boolean;
    deathRollProbability?: number;
    weightChange: number;
  }[];
  healthNarratives: string[];
  weightChange: number;
  newParasites: string[];
  newInjuries: string[];
  statDelta: StatSnapshot;
  pendingDeathRolls?: {
    eventId: string;
    cause: string;
    baseProbability: number;
    escapeOptions: { id: string; label: string; description: string; survivalModifier: number }[];
  }[];
  journalEntry?: string;
}

// ---------------------------------------------------------------------------
// Calibration cache (mirrors useGameEngine)
// ---------------------------------------------------------------------------

const calibrationCache = new Map<string, CalibratedRates>();
function getCalibratedRates(speciesId: string): CalibratedRates | undefined {
  if (calibrationCache.has(speciesId)) return calibrationCache.get(speciesId);
  if (speciesId === 'white-tailed-deer') {
    const rates = calibrate(DEER_MORTALITY);
    calibrationCache.set(speciesId, rates);
    return rates;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// API Class
// ---------------------------------------------------------------------------

export class GameAPI {
  // Expose static helpers so callers can discover valid options.
  static readonly speciesIds = getAllSpeciesIds();
  static readonly backstoryOptions = BACKSTORY_OPTIONS;

  private _store: any; // Using any to avoid complex Zustand type issues in constructor for now

  constructor(customStore?: any) {
    this._store = customStore || useGameStore;
  }

  private set(partial: Partial<GameState>) {
    this._store.setState(partial);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  /** Start a new game. Returns the initial snapshot. */
  start(opts: StartOptions): GameSnapshot {
    // Look up species-specific backstories first, fall back to shared defaults
    const bundle = getSpeciesBundle(opts.species);
    const backstory = bundle.backstories.find(b => b.type === opts.backstory)
      ?? BACKSTORY_OPTIONS.find(b => b.type === opts.backstory);
    if (!backstory) {
      const valid = bundle.backstories.map(b => b.type);
      throw new Error(
        `Unknown backstory "${opts.backstory}" for ${opts.species}. Valid: ${valid.join(', ')}`
      );
    }
    this._store.getState().startGame(
      opts.species,
      backstory,
      opts.sex,
      opts.difficulty ?? 'normal',
      opts.seed,
    );
    return this.getSnapshot();
  }

  /** Reset the store to menu state (ends any in-progress game). */
  reset(): void {
    this._store.getState().returnToMenu();
  }

  // ── Turn flow ──────────────────────────────────────────────────────────

  /**
   * Advance the simulation clock and generate events for the new turn.
   *
   * This is the equivalent of clicking into a new turn in the UI. After
   * calling this, inspect `TurnInfo.events` and call `makeChoice()` for
   * every active event that has choices, then call `endTurn()`.
   */
  generateTurn(): TurnInfo {
    const store = this._store.getState();

    // 1. Advance physical simulation (time, weather, physiology, etc.)
    store.advanceTurn();

    let state = this._store.getState();

    // 2. Introduce NPCs on early turns (assign map positions)
    if (state.npcs.length === 0 && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
      const npcs = [...state.npcs];
      const mapNodes = state.map?.nodes ?? [];
      const playerNodeId = state.map?.currentLocationId;
      for (const type of ['rival', 'ally', 'predator'] as const) {
        // For predators, introduce all unique species (e.g. wolf + hunter)
        const newNPCs = type === 'predator'
          ? introduceAllOfType(state.animal.speciesId, type, state.time.turn, npcs, state.rng)
          : [introduceNPC(state.animal.speciesId, type, state.time.turn, npcs, state.rng)].filter(Boolean) as any[];
        for (const npc of newNPCs) {
          if (mapNodes.length > 0) {
            const candidates = type === 'ally'
              ? mapNodes.filter((n: MapNode) => n.id === playerNodeId || (playerNodeId && n.connections.includes(playerNodeId)))
              : mapNodes.filter((n: MapNode) => n.id !== playerNodeId);
            const startNode = candidates.length > 0 ? state.rng.pick(candidates) : mapNodes[0];
            npc.currentNodeId = startNode.id;
          }
          npcs.push(npc);
        }
      }
      if (npcs.length > 0) store.setNPCs(npcs);
    }

    // Introduce mate NPC at mating season
    state = this._store.getState();
    const hasMate = state.npcs.some((n: NPC) => n.type === 'mate' && n.alive);
    if (!hasMate && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
      const reproConfig = state.speciesBundle.config.reproduction;
      const isMating =
        (reproConfig.type === 'iteroparous' &&
          (reproConfig.matingSeasons === 'any' || reproConfig.matingSeasons.includes(state.time.season))) ||
        (reproConfig.type === 'semelparous' &&
          state.animal.flags.has(reproConfig.spawningMigrationFlag));
      if (isMating) {
        const mateNPC = introduceNPC(state.animal.speciesId, 'mate', state.time.turn, state.npcs, state.rng);
        if (mateNPC) {
          // Place mate near the player
          const playerNodeId = state.map?.currentLocationId;
          if (playerNodeId) mateNPC.currentNodeId = playerNodeId;
          store.setNPCs([...state.npcs, mateNPC]);
        }
      }
    }

    state = this._store.getState();

    // 3. Ambient text
    const ambientText = generateAmbientText({
      season: state.time.season,
      speciesId: state.animal.speciesId,
      regionId: state.animal.region,
      weatherType: state.currentWeather?.type,
      rng: state.rng,
      animalSex: state.animal.sex,
    });
    this.set({ ambientText });

    // 4. Ecosystem tick
    const ecoResult = tickEcosystem(state.ecosystem, state.animal.region, state.time.turn, state.rng);
    this.set({ ecosystem: ecoResult.ecosystem });

    // 5. Territory
    if (TERRITORIAL_SPECIES.has(state.animal.speciesId)) {
      if (!state.territory.established && state.time.turn >= TERRITORY_AUTO_ESTABLISH_TURN) {
        const flags = new Set(state.animal.flags);
        flags.add('territory-established');
        this.set({
          territory: { ...state.territory, established: true, size: TERRITORY_INITIAL_SIZE, quality: TERRITORY_INITIAL_QUALITY, markedTurns: 0 },
          animal: { ...state.animal, flags },
        });
      }
      state = this._store.getState();
      if (state.territory.established) {
        const newTerritory = tickTerritory(state.territory, state.animal.speciesId, state.rng);
        this.set({ territory: newTerritory });
      }
    }

    state = this._store.getState();

    // 6. Generate events synchronously (no Web Worker)
    const generatedEvents = generateTurnEvents(state);

    // 7. Generate simulation events (same as useGameEngine main-thread path)
    let simEvents: ResolvedEvent[] = [];
    const config = state.speciesBundle.config;
    if (isSimulationMode(config)) {
      const mapNode = state.map?.nodes.find((n: MapNode) => n.id === state.map!.currentLocationId);
      const simCtx: SimulationContext = {
        animal: state.animal,
        time: state.time,
        behavior: state.behavioralSettings,
        config,
        rng: state.rng,
        difficulty: state.difficulty,
        npcs: state.npcs,
        npcBehaviorStates: state.npcBehaviorStates,
        regionDef: getRegionDefinition(state.animal.region),
        currentWeather: state.currentWeather ?? undefined,
        ecosystem: state.ecosystem,
        currentNodeId: state.map?.currentLocationId,
        currentNodeType: mapNode?.type,
        currentNodeResources: mapNode?.resources,
        worldMemory: state.worldMemory,
        calibratedRates: getCalibratedRates(config.id),
        fastForward: state.fastForward,
      };
      simEvents = generateSimulationEvents(simCtx);

      const nudges = computeInstincts(simCtx);
      store.setInstinctNudges(nudges);

      const newEntries = drainDebriefingEntries();
      if (newEntries.length > 0) {
        const animal = this._store.getState().animal;
        const log = [...(animal.debriefingLog ?? []), ...newEntries];
        this.set({ animal: { ...animal, debriefingLog: log } });
      }

      // Deduplicate: remove hardcoded events in sim-covered categories
      const simCategories = new Set(simEvents.map(e => e.definition.category));
      const filteredHardcoded = simCategories.size > 0
        ? generatedEvents.filter(e => !simCategories.has(e.definition.category))
        : generatedEvents;
      generatedEvents.length = 0;
      generatedEvents.push(...filteredHardcoded);
    } else {
      store.setInstinctNudges([]);
    }

    // 8. Illustrations
    const workerEvents = generatedEvents.map(event => {
      const image = event.definition.image ?? pickIllustration(event.definition, state.rng);
      return {
        ...event,
        definition: image ? { ...event.definition, image } : event.definition,
      };
    });
    const events = [...simEvents, ...workerEvents];

    // 9. Storylines
    const storylineResult = tickStorylines({
      animal: state.animal,
      time: state.time,
      behavior: state.behavioralSettings,
      config: state.speciesBundle.config,
      rng: state.rng,
      npcs: state.npcs,
      activeStorylines: state.activeStorylines,
      currentEvents: state.currentEvents,
    });
    const allStorylines = [...storylineResult.updatedStorylines, ...storylineResult.newStorylines];
    store.setActiveStorylines(allStorylines);

    const allEvents = [...events, ...storylineResult.injectedEvents];
    store.setEvents(allEvents);

    state = this._store.getState();

    return {
      turn: state.time.turn,
      month: state.time.monthIndex,
      year: state.time.year,
      season: state.time.season,
      events: allEvents.map(summarizeEvent),
      pendingChoices: [...state.pendingChoices],
      ambientText: state.ambientText,
    };
  }

  // ── Choices ────────────────────────────────────────────────────────────

  /** Make a choice for an active event. */
  makeChoice(eventId: string, choiceId: string): void {
    this._store.getState().makeChoice(eventId, choiceId);
  }

  /**
   * Auto-resolve all pending choices by picking the first available choice
   * for each event. Useful for automated testing / fast-forwarding.
   *
   * @param strategy
   *   - `'first'`  – always pick the first choice (legacy default)
   *   - `'cautious'` – weighted random: danger choices picked ~25% of the
   *      time, safe choices ~75%.  Uses the game's seeded RNG so results
   *      are deterministic per seed.
   */
  autoChoose(strategy: 'first' | 'cautious' = 'cautious'): Array<{ eventId: string; choiceId: string }> {
    const state = this._store.getState();
    const rng = state.rng;
    const made: Array<{ eventId: string; choiceId: string }> = [];
    for (const eventId of [...state.pendingChoices]) {
      const event = state.currentEvents.find((e: ResolvedEvent) => e.definition.id === eventId);
      const choices = event?.definition.choices;
      if (!choices || choices.length === 0) continue;

      let picked: EventChoice;
      if (strategy === 'first' || choices.length === 1) {
        picked = choices[0];
      } else {
        // Weighted random: danger choices get 25% relative weight, safe get 75%
        const weights = choices.map((c: EventChoice) =>
          c.style === 'danger' ? 0.25 : 0.75
        );
        const idx = rng.weightedSelect(weights);
        picked = choices[idx];
      }

      this._store.getState().makeChoice(eventId, picked.id);
      made.push({ eventId, choiceId: picked.id });
    }
    return made;
  }

  // ── Turn resolution ────────────────────────────────────────────────────

  /**
   * Resolve all choices and apply effects. Equivalent to clicking "Next Turn"
   * after making all choices.
   *
   * Throws if there are still pending choices.
   */
  endTurn(): TurnResultSummary {
    const state = this._store.getState();
    if (state.pendingChoices.length > 0) {
      throw new Error(
        `Cannot end turn: ${state.pendingChoices.length} pending choices remain. ` +
        `Use makeChoice() or autoChoose() first.`
      );
    }

    // Capture pre-resolution stats
    const preStats = this.getStatSnapshot();

    // Set cooldowns
    const cooldownUpdates: Record<string, number> = {};
    for (const event of state.currentEvents) {
      if (event.definition.cooldown) {
        cooldownUpdates[event.definition.id] = event.definition.cooldown;
      }
    }
    state.setEventCooldowns(cooldownUpdates);

    // Resolve
    const result = resolveTurn(state);

    // Journal entry
    const journalEntry = synthesizeJournalEntry(result.turnResult, {
      season: state.time.season,
      speciesId: state.animal.speciesId,
      regionId: state.animal.region,
      weatherType: state.currentWeather?.type,
      rng: state.rng,
      animalSex: state.animal.sex,
    });
    result.turnResult.journalEntry = journalEntry;

    // Apply to state
    this.set({ animal: result.animal });
    if (result.statEffects.length > 0) {
      this._store.getState().applyStatEffects(result.statEffects);
    }
    for (const consequence of result.consequences) {
      this._store.getState().applyConsequence(consequence);
    }

    // Compute stat deltas
    const postStats = this.getStatSnapshot();
    const statDelta = {} as StatSnapshot;
    for (const id of Object.values(StatId)) {
      statDelta[id] = postStats[id] - preStats[id];
    }
    result.turnResult.statDelta = statDelta;

    // NPC encounter tracking + lifetime stats (mirrors useGameEngine)
    const encounterState = this._store.getState();
    let updatedNPCs = encounterState.npcs;
    let predatorsEvaded = 0;
    let preyEaten = 0;
    let rivalsDefeated = 0;
    const foodSourceHits: Record<string, number> = {};

    for (const outcome of result.turnResult.eventOutcomes) {
      const event = state.currentEvents.find((e: ResolvedEvent) => e.definition.id === outcome.eventId);
      if (!event) continue;
      const tags = event.definition.tags;

      if (tags.includes('foraging') && outcome.consequences.some((c: { type: string; amount?: number }) => c.type === 'modify_weight' && (c as { amount: number }).amount > 0)) {
        foodSourceHits[event.definition.id] = (foodSourceHits[event.definition.id] || 0) + 1;
      }
      if (tags.includes('predator') && outcome.deathRollSurvived === true) predatorsEvaded++;
      if (tags.includes('foraging') && outcome.consequences.some((c: { type: string; amount?: number }) => c.type === 'modify_weight' && (c as { amount: number }).amount > 0)) {
        if (state.speciesBundle.config.diet !== 'herbivore') preyEaten++;
      }
      if (tags.includes('rival') && (outcome.choiceId?.includes('fight') || outcome.choiceId?.includes('challenge'))) {
        if (!outcome.consequences.some((c: { type: string; severity?: number }) => c.type === 'add_injury' && (c.severity ?? 0) > 0)) {
          rivalsDefeated++;
        }
      }

      const npcType = tags.includes('predator') ? 'predator'
        : tags.includes('rival') ? 'rival'
        : tags.includes('ally') ? 'ally'
        : tags.includes('mate') ? 'mate'
        : null;
      if (npcType) {
        const npc = updatedNPCs.find((n: NPC) => n.type === npcType && n.alive);
        if (npc) updatedNPCs = incrementEncounter(updatedNPCs, npc.id, encounterState.time.turn);
      }
    }

    const previousFriends = encounterState.npcs.filter((n: NPC) => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    updatedNPCs = progressRelationship(updatedNPCs);
    const currentFriends = updatedNPCs.filter((n: NPC) => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    const newFriendsMade = Math.max(0, currentFriends - previousFriends);

    if (updatedNPCs !== encounterState.npcs) {
      this._store.getState().setNPCs(updatedNPCs);
    }

    // Update lifetime stats
    const latestAnimal = this._store.getState().animal;
    const currentFoodSources = { ...latestAnimal.lifetimeStats.foodSources };
    for (const [id, count] of Object.entries(foodSourceHits)) {
      currentFoodSources[id] = (currentFoodSources[id] || 0) + count;
    }
    if (predatorsEvaded > 0 || preyEaten > 0 || rivalsDefeated > 0 || newFriendsMade > 0 || Object.keys(foodSourceHits).length > 0) {
      this.set({
        animal: {
          ...this._store.getState().animal,
          lifetimeStats: {
            ...this._store.getState().animal.lifetimeStats,
            predatorsEvaded: latestAnimal.lifetimeStats.predatorsEvaded + predatorsEvaded,
            preyEaten: latestAnimal.lifetimeStats.preyEaten + preyEaten,
            rivalsDefeated: latestAnimal.lifetimeStats.rivalsDefeated + rivalsDefeated,
            friendsMade: latestAnimal.lifetimeStats.friendsMade + newFriendsMade,
            foodSources: currentFoodSources,
          },
        },
      });
    }

    // Show results + check death
    this._store.getState().setTurnResult(result.turnResult);
    this.checkDeathConditions();

    return summarizeTurnResult(result.turnResult, statDelta);
  }

  /**
   * Resolve a pending death roll (predator escape). Must be called if
   * `endTurn()` returned `pendingDeathRolls`.
   */
  resolveDeathRoll(eventId: string, escapeOptionId: string): { survived: boolean } {
    const stateBefore = this._store.getState();
    const wasDead = stateBefore.phase === 'dead';
    this._store.getState().resolveDeathRoll(eventId, escapeOptionId);
    const stateAfter = this._store.getState();
    return { survived: stateAfter.phase !== 'dead' && !wasDead };
  }

  // ── Behavioral settings ────────────────────────────────────────────────

  /** Set a behavioral slider (1–5). */
  setBehavior(key: keyof BehavioralSettings, value: BehaviorLevel): void {
    this._store.getState().updateBehavioralSetting(key, value);
  }

  // ── Movement ───────────────────────────────────────────────────────────

  /** Move to an adjacent map node. */
  moveTo(nodeId: string): void {
    this._store.getState().moveLocation(nodeId);
  }

  /** Get available map nodes the animal can move to. */
  getAdjacentNodes(): Array<{ id: string; type: string; name?: string }> {
    const state = this._store.getState();
    if (!state.map) return [];
    const current = state.map.nodes.find((n: MapNode) => n.id === state.map!.currentLocationId);
    if (!current) return [];
    return current.connections.map((connId: string) => {
      const node = state.map!.nodes.find((n: MapNode) => n.id === connId);
      return node ? { id: node.id, type: node.type, name: (node as { name?: string }).name } : { id: connId, type: 'unknown' };
    });
  }

  // ── State inspection ───────────────────────────────────────────────────

  /** Get a compact snapshot of the current game state. */
  getSnapshot(): GameSnapshot {
    const state = this._store.getState();
    const a = state.animal;
    return {
      phase: state.phase,
      turn: state.time.turn,
      month: state.time.monthIndex,
      year: state.time.year,
      season: state.time.season,
      species: a.speciesId,
      sex: a.sex,
      age: a.age,
      weight: a.weight,
      alive: a.alive,
      causeOfDeath: a.causeOfDeath,
      stats: this.getStatSnapshot(),
      parasites: a.parasites.map((p: ActiveParasite) => p.definitionId),
      injuries: a.injuries.map((i: ActiveInjury) => i.definitionId),
      conditions: (a.conditions ?? []).map((c: ActiveCondition) => c.definitionId),
      flags: Array.from(a.flags),
      behavioralSettings: { ...state.behavioralSettings },
      energy: a.energy,
      dehydration: a.physiologicalStress.dehydration,
    };
  }

  /** Get computed (effective) stat values. */
  getStatSnapshot(): StatSnapshot {
    const stats = this._store.getState().animal.stats;
    const snap = {} as StatSnapshot;
    for (const id of Object.values(StatId)) {
      snap[id] = computeEffectiveValue(stats[id]);
    }
    return snap;
  }

  /** Whether the game is still in progress. */
  get isAlive(): boolean {
    return this._store.getState().phase === 'playing';
  }

  /** Current phase: 'menu' | 'playing' | 'dead' | 'evolving'. */
  get phase(): string {
    return this._store.getState().phase;
  }

  /** Access the raw Zustand store for advanced use. */
  get rawState(): GameState {
    return this._store.getState();
  }

  /**
   * Generates a comprehensive summary of the run, typically called after death.
   * Mirrors the logic used in the UI RunSummary and DeathScreen components.
   */
  getRunSummary(): RunSummary {
    const state = this._store.getState();
    const config = state.speciesBundle.config;
    const animal = state.animal;
    const reproduction = state.reproduction;

    // 1. Calculate Grade (mirrors DeathScreen.tsx)
    const getGrade = (fitness: number, type: 'iteroparous' | 'semelparous'): string => {
      if (fitness === 0) return 'F';
      if (type === 'iteroparous') {
        if (fitness === 1) return 'D';
        if (fitness === 2) return 'C';
        if (fitness <= 4) return 'B';
        return 'A';
      } else {
        if (fitness <= 2) return 'D';
        if (fitness <= 5) return 'C';
        if (fitness <= 12) return 'B';
        return 'A';
      }
    };

    const grade = getGrade(reproduction.totalFitness, reproduction.type);

    // 2. Extract Timeline (mirrors RunSummary.tsx)
    const timeline: TimelineEntry[] = [];
    const seenFlags = new Set<string>();
    const seenParasites = new Set<string>();
    const seenInjuries = new Set<string>();

    for (const record of state.turnHistory) {
      for (const event of record.events) {
        const def = event.definition;
        const tags = def.tags;

        // Milestones & Migrations
        if (def.consequences) {
          for (const c of def.consequences) {
            if (c.type === 'set_flag' && !seenFlags.has(c.flag)) {
              seenFlags.add(c.flag);
              if (tags.includes('milestone') || tags.includes('migration')) {
                timeline.push({
                  turn: record.turn,
                  month: record.month,
                  year: record.year,
                  text: def.narrativeText.slice(0, 150),
                  category: tags.includes('migration') ? 'migration' : 'milestone',
                });
              }
            }
            if (c.type === 'add_parasite' && !seenParasites.has(c.parasiteId)) {
              seenParasites.add(c.parasiteId);
              timeline.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: `Contracted ${c.parasiteId.replace(/-/g, ' ')}`,
                category: 'parasite',
              });
            }
            if (c.type === 'add_injury' && !seenInjuries.has(c.injuryId + (c.bodyPart ?? ''))) {
              seenInjuries.add(c.injuryId + (c.bodyPart ?? ''));
              timeline.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: `Suffered ${c.injuryId.replace(/-/g, ' ')}${c.bodyPart ? ` (${c.bodyPart})` : ''}`,
                category: 'injury',
              });
            }
            if (c.type === 'start_pregnancy' || c.type === 'sire_offspring' || c.type === 'spawn') {
              timeline.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: c.type === 'spawn' ? 'Spawned' : c.type === 'start_pregnancy' ? 'Became pregnant' : 'Sired offspring',
                category: 'offspring',
              });
            }
          }
        }

        // Also check choices for consequences
        if (event.choiceMade && def.choices) {
          const choice = def.choices.find((ch: EventChoice) => ch.id === event.choiceMade);
          if (choice?.consequences) {
            for (const c of choice.consequences) {
              if (c.type === 'add_parasite' && !seenParasites.has(c.parasiteId)) {
                seenParasites.add(c.parasiteId);
                timeline.push({
                  turn: record.turn,
                  month: record.month,
                  year: record.year,
                  text: `Contracted ${c.parasiteId.replace(/-/g, ' ')}`,
                  category: 'parasite',
                });
              }
              if (c.type === 'add_injury' && !seenInjuries.has(c.injuryId + (c.bodyPart ?? ''))) {
                seenInjuries.add(c.injuryId + (c.bodyPart ?? ''));
                timeline.push({
                  turn: record.turn,
                  month: record.month,
                  year: record.year,
                  text: `Suffered ${c.injuryId.replace(/-/g, ' ')}${c.bodyPart ? ` (${c.bodyPart})` : ''}`,
                  category: 'injury',
                });
              }
              if (c.type === 'start_pregnancy' || c.type === 'sire_offspring' || c.type === 'spawn') {
                timeline.push({
                  turn: record.turn,
                  month: record.month,
                  year: record.year,
                  text: c.type === 'spawn' ? 'Spawned' : c.type === 'start_pregnancy' ? 'Became pregnant' : 'Sired offspring',
                  category: 'offspring',
                });
              }
            }
          }
        }
      }
    }

    if (animal.causeOfDeath) {
      const last = state.turnHistory[state.turnHistory.length - 1];
      timeline.push({
        turn: state.time.turn,
        month: last?.month || state.time.month.toString(),
        year: state.time.year,
        text: animal.causeOfDeath,
        category: 'death',
      });
    }

    return {
      speciesName: config.name,
      sex: animal.sex,
      turnsLived: state.time.turn,
      ageMonths: animal.age,
      causeOfDeath: animal.causeOfDeath,
      totalFitness: reproduction.totalFitness,
      grade,
      lifetimeStats: { ...animal.lifetimeStats },
      timeline,
    };
  }

  // ── Convenience: play N turns automatically ────────────────────────────

  // ── Automated movement (for simulate loop) ───────────────────────────

  /**
   * Need-driven automated movement. ~60% chance of moving per turn.
   * Prefers water when thirsty, food when hungry, unexplored otherwise.
   * Respects the energy >= 10 gate — exhausted animals cannot move.
   */
  private autoMove(): void {
    const state = this._store.getState();
    if (!state.map) return;

    const rng = state.rng;
    const config = state.speciesBundle.config;
    const animal = state.animal;

    // Energy gate (same as MapPanel UI)
    if (animal.energy < 10) return;

    // Base movement probability, scaled by turn unit (monthly species move less per turn)
    // and reduced by locomotion impairment
    const turnUnit = config.turnUnit ?? 'week';
    const baseMoveProb = turnUnit === 'day' ? 0.3 : turnUnit === 'month' ? 0.25 : 0.5;
    const locomotion = animal.bodyState?.capabilities['locomotion'] ?? 100;
    const moveProb = baseMoveProb * Math.min(1, locomotion / 100);
    // Override: always try to move if severely dehydrated and have energy
    const hydrationConfig = config.hydration;
    const urgentThirst = hydrationConfig && animal.physiologicalStress.dehydration > hydrationConfig.movementPenaltyThreshold;
    if (!urgentThirst && !rng.chance(moveProb)) return;

    const adjacent = this.getAdjacentNodes();
    if (adjacent.length === 0) return;

    const scores = adjacent.map(node => {
      let score = 1.0;
      const fullNode = state.map!.nodes.find((n: MapNode) => n.id === node.id);

      // Thirst drive: strongly prefer water nodes when dehydrated
      const hydrationConfig = config.hydration;
      if (hydrationConfig && animal.physiologicalStress.dehydration > hydrationConfig.debuffThreshold) {
        if (node.type === 'water') {
          const urgency = animal.physiologicalStress.dehydration / 100;
          score += 5 * urgency;
        }
      }

      // Hunger drive: prefer food-rich nodes when starving
      if (animal.physiologicalStress.starvation > 30 || animal.weight < config.weight.starvationDebuff) {
        const food = fullNode?.resources?.food ?? 50;
        score += (food / 100) * 2;
      }

      // Exploration bonus for unvisited nodes
      if (fullNode && !fullNode.visited) {
        score += 0.5;
      }

      // Avoid expensive terrain when low energy
      if (animal.energy < 30 && fullNode) {
        score -= (fullNode.movementCost ?? 10) / 20;
      }

      return Math.max(0.1, score);
    });

    const idx = rng.weightedSelect(scores);
    this.moveTo(adjacent[idx].id);
  }

  /**
   * Run the game for up to `maxTurns` turns (or until death), auto-choosing
   * the first option for every event. Optionally pass a `choiceStrategy`
   * callback to make smarter choices.
   *
   * Returns a summary log of every turn.
   */
  simulate(
    maxTurns: number,
    choiceStrategy?: (events: EventSummary[]) => Array<{ eventId: string; choiceId: string }>,
  ): Array<{ turn: number; result: TurnResultSummary; snapshot: GameSnapshot }> {
    const log: Array<{ turn: number; result: TurnResultSummary; snapshot: GameSnapshot }> = [];

    for (let i = 0; i < maxTurns; i++) {
      if (!this.isAlive) break;

      // Automated movement before generating events (location affects event pool)
      this.autoMove();

      const turnInfo = this.generateTurn();

      if (choiceStrategy) {
        const choices = choiceStrategy(turnInfo.events);
        for (const { eventId, choiceId } of choices) {
          this.makeChoice(eventId, choiceId);
        }
      } else {
        this.autoChoose();
      }

      const result = this.endTurn();

      // Auto-resolve death rolls (pick first escape option)
      if (result.pendingDeathRolls) {
        for (const roll of result.pendingDeathRolls) {
          if (roll.escapeOptions.length > 0) {
            this.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
          }
        }
      }

      // Clear turn result state without triggering another advanceTurn()
      // (dismissResults() calls advanceTurn() via the UI slice, which would
      // double-tick physiology and corrupt map node types)
      this.set({ showingResults: false, turnResult: null });

      log.push({
        turn: turnInfo.turn,
        result,
        snapshot: this.getSnapshot(),
      });
    }

    return log;
  }

  // ── Death check (mirrors useGameEngine.checkDeathConditions) ───────────

  private checkDeathConditions(): void {
    const state = this._store.getState();
    const animal = state.animal;
    const config = state.speciesBundle.config;
    const parasiteDefs = state.speciesBundle.parasites;

    if (!animal.alive) {
      state.killAnimal(animal.causeOfDeath || 'Unknown cause');
      return;
    }

    if (computeEffectiveValue(animal.stats[StatId.HEA]) <= 0) {
      state.killAnimal('Systemic Failure -- health completely depleted.');
      return;
    }

    if (animal.weight < config.weight.starvationDeath) {
      state.killAnimal('Starvation -- body weight dropped below survival threshold.');
      return;
    }

    // Dehydration death
    const hydrationConfig = config.hydration;
    if (hydrationConfig && animal.physiologicalStress.dehydration >= hydrationConfig.lethalThreshold) {
      if (state.rng.chance(0.15)) {
        state.killAnimal('Dehydration -- organ function failed without water.');
        return;
      }
    }

    for (const parasite of animal.parasites) {
      const def = parasiteDefs[parasite.definitionId];
      if (def && parasite.currentStage === def.stages.length - 1) {
        const imm = computeEffectiveValue(animal.stats[StatId.IMM]);
        const immFactor = 1.0 + (imm / 100);
        // Scale disease death check by turn frequency — day-turn species
        // get 4× more checks per day than weekly species
        const turnScale = (config.turnUnit === 'day') ? 0.25 : 1;
        if (state.rng.chance(config.diseaseDeathChanceAtCritical * immFactor * turnScale)) {
          state.killAnimal(`Died from complications of ${def.name}.`);
          return;
        }
      }
    }

    if (animal.age > config.age.oldAgeOnsetMonths) {
      const yearsOver = (animal.age - config.age.oldAgeOnsetMonths) / 12;
      const ageDeathChance = config.age.oldAgeBaseChance * Math.pow(config.age.oldAgeEscalation, yearsOver);
      if (state.rng.chance(Math.min(ageDeathChance, config.age.maxOldAgeChance))) {
        state.killAnimal(`Died of old age at ${Math.floor(animal.age / 12)} years.`);
        return;
      }
    }

    if (state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
      state.killAnimal('Post-spawning death -- the cycle is complete.');
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function summarizeEvent(e: ResolvedEvent): EventSummary {
  return {
    id: e.definition.id,
    type: e.definition.type,
    category: e.definition.category,
    narrative: e.resolvedNarrative,
    choices: (e.definition.choices ?? []).map(c => ({
      id: c.id,
      label: c.label,
      description: c.description,
      style: c.style,
    })),
    tags: e.definition.tags,
    choiceMade: e.choiceMade,
  };
}

function summarizeTurnResult(tr: TurnResult, statDelta: StatSnapshot): TurnResultSummary {
  return {
    eventOutcomes: tr.eventOutcomes.map(o => ({
      eventId: o.eventId,
      narrative: o.eventNarrative,
      choiceLabel: o.choiceLabel,
      choiceId: o.choiceId,
      choiceNarrative: o.narrativeResult,
      deathRollSurvived: o.deathRollSurvived,
      deathRollProbability: o.deathRollProbability,
      weightChange: o.consequences
        .filter((c: any) => c.type === 'modify_weight')
        .reduce((sum: number, c: any) => sum + (c.amount ?? 0), 0),
    })),
    healthNarratives: tr.healthNarratives,
    weightChange: tr.weightChange,
    newParasites: tr.newParasites,
    newInjuries: tr.newInjuries,
    statDelta,
    pendingDeathRolls: tr.pendingDeathRolls?.map(r => ({
      eventId: r.eventId,
      cause: r.cause,
      baseProbability: r.baseProbability,
      escapeOptions: r.escapeOptions.map(o => ({
        id: o.id,
        label: o.label,
        description: o.description,
        survivalModifier: o.survivalModifier,
      })),
    })),
    journalEntry: tr.journalEntry,
  };
}
