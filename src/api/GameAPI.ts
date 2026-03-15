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
import { introduceNPC, incrementEncounter, progressRelationship } from '../engine/NPCSystem';
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
import { BACKSTORY_OPTIONS, type Backstory } from '../types/species';
import { getAllSpeciesIds } from '../data/species';
import type { SimulationContext } from '../simulation/events/types';
import type { CalibratedRates } from '../simulation/calibration/types';
import type { ResolvedEvent } from '../types/events';
import type { TurnResult, PendingDeathRoll } from '../types/turnResult';
import type { BehavioralSettings, BehaviorLevel } from '../types/behavior';

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

  private get store() {
    return useGameStore.getState();
  }

  private set(partial: Partial<GameState>) {
    useGameStore.setState(partial);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  /** Start a new game. Returns the initial snapshot. */
  start(opts: StartOptions): GameSnapshot {
    const backstory = BACKSTORY_OPTIONS.find(b => b.type === opts.backstory);
    if (!backstory) {
      throw new Error(
        `Unknown backstory "${opts.backstory}". Valid: ${BACKSTORY_OPTIONS.map(b => b.type).join(', ')}`
      );
    }
    this.store.startGame(
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
    this.store.returnToMenu();
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
    const store = this.store;

    // 1. Advance physical simulation (time, weather, physiology, etc.)
    store.advanceTurn();

    let state = useGameStore.getState();

    // 2. Introduce NPCs on early turns
    if (state.npcs.length === 0 && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
      const npcs = [...state.npcs];
      for (const type of ['rival', 'ally', 'predator'] as const) {
        const npc = introduceNPC(state.animal.speciesId, type, state.time.turn, npcs, state.rng);
        if (npc) npcs.push(npc);
      }
      if (npcs.length > 0) store.setNPCs(npcs);
    }

    // Introduce mate NPC at mating season
    state = useGameStore.getState();
    const hasMate = state.npcs.some(n => n.type === 'mate' && n.alive);
    if (!hasMate && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
      const reproConfig = state.speciesBundle.config.reproduction;
      const isMating =
        (reproConfig.type === 'iteroparous' &&
          (reproConfig.matingSeasons === 'any' || reproConfig.matingSeasons.includes(state.time.season as 'spring' | 'summer' | 'fall' | 'winter'))) ||
        (reproConfig.type === 'semelparous' &&
          state.animal.flags.has(reproConfig.spawningMigrationFlag));
      if (isMating) {
        const mateNPC = introduceNPC(state.animal.speciesId, 'mate', state.time.turn, state.npcs, state.rng);
        if (mateNPC) store.setNPCs([...state.npcs, mateNPC]);
      }
    }

    state = useGameStore.getState();

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
      state = useGameStore.getState();
      if (state.territory.established) {
        const newTerritory = tickTerritory(state.territory, state.animal.speciesId, state.rng);
        this.set({ territory: newTerritory });
      }
    }

    state = useGameStore.getState();

    // 6. Generate events synchronously (no Web Worker)
    const generatedEvents = generateTurnEvents(state);

    // 7. Generate simulation events (same as useGameEngine main-thread path)
    let simEvents: ResolvedEvent[] = [];
    const config = state.speciesBundle.config;
    if (isSimulationMode(config)) {
      const mapNode = state.map?.nodes.find(n => n.id === state.map!.currentLocationId);
      const simCtx: SimulationContext = {
        animal: state.animal,
        time: state.time,
        behavior: state.behavioralSettings,
        config,
        rng: state.rng,
        difficulty: state.difficulty,
        npcs: state.npcs,
        regionDef: getRegionDefinition(state.animal.region),
        currentWeather: state.currentWeather ?? undefined,
        ecosystem: state.ecosystem,
        currentNodeType: mapNode?.type,
        calibratedRates: getCalibratedRates(config.id),
        fastForward: state.fastForward,
      };
      simEvents = generateSimulationEvents(simCtx);

      const nudges = computeInstincts(simCtx);
      store.setInstinctNudges(nudges);

      const newEntries = drainDebriefingEntries();
      if (newEntries.length > 0) {
        const animal = useGameStore.getState().animal;
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

    state = useGameStore.getState();

    return {
      turn: state.time.turn,
      month: state.time.month,
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
    this.store.makeChoice(eventId, choiceId);
  }

  /**
   * Auto-resolve all pending choices by picking the first available choice
   * for each event. Useful for automated testing / fast-forwarding.
   * Returns the choices that were made.
   */
  autoChoose(): Array<{ eventId: string; choiceId: string }> {
    const state = useGameStore.getState();
    const made: Array<{ eventId: string; choiceId: string }> = [];
    for (const eventId of [...state.pendingChoices]) {
      const event = state.currentEvents.find(e => e.definition.id === eventId);
      const firstChoice = event?.definition.choices?.[0];
      if (firstChoice) {
        this.store.makeChoice(eventId, firstChoice.id);
        made.push({ eventId, choiceId: firstChoice.id });
      }
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
    const state = useGameStore.getState();
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
      useGameStore.getState().applyStatEffects(result.statEffects);
    }
    for (const consequence of result.consequences) {
      useGameStore.getState().applyConsequence(consequence);
    }

    // Compute stat deltas
    const postStats = this.getStatSnapshot();
    const statDelta = {} as StatSnapshot;
    for (const id of Object.values(StatId)) {
      statDelta[id] = postStats[id] - preStats[id];
    }
    result.turnResult.statDelta = statDelta;

    // NPC encounter tracking + lifetime stats (mirrors useGameEngine)
    const encounterState = useGameStore.getState();
    let updatedNPCs = encounterState.npcs;
    let predatorsEvaded = 0;
    let preyEaten = 0;
    let rivalsDefeated = 0;
    const foodSourceHits: Record<string, number> = {};

    for (const outcome of result.turnResult.eventOutcomes) {
      const event = state.currentEvents.find(e => e.definition.id === outcome.eventId);
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
        const npc = updatedNPCs.find(n => n.type === npcType && n.alive);
        if (npc) updatedNPCs = incrementEncounter(updatedNPCs, npc.id, encounterState.time.turn);
      }
    }

    const previousFriends = encounterState.npcs.filter(n => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    updatedNPCs = progressRelationship(updatedNPCs);
    const currentFriends = updatedNPCs.filter(n => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    const newFriendsMade = Math.max(0, currentFriends - previousFriends);

    if (updatedNPCs !== encounterState.npcs) {
      useGameStore.getState().setNPCs(updatedNPCs);
    }

    // Update lifetime stats
    const latestAnimal = useGameStore.getState().animal;
    const currentFoodSources = { ...latestAnimal.lifetimeStats.foodSources };
    for (const [id, count] of Object.entries(foodSourceHits)) {
      currentFoodSources[id] = (currentFoodSources[id] || 0) + count;
    }
    if (predatorsEvaded > 0 || preyEaten > 0 || rivalsDefeated > 0 || newFriendsMade > 0 || Object.keys(foodSourceHits).length > 0) {
      this.set({
        animal: {
          ...useGameStore.getState().animal,
          lifetimeStats: {
            ...useGameStore.getState().animal.lifetimeStats,
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
    useGameStore.getState().setTurnResult(result.turnResult);
    this.checkDeathConditions();

    return summarizeTurnResult(result.turnResult, statDelta);
  }

  /**
   * Resolve a pending death roll (predator escape). Must be called if
   * `endTurn()` returned `pendingDeathRolls`.
   */
  resolveDeathRoll(eventId: string, escapeOptionId: string): { survived: boolean } {
    const stateBefore = useGameStore.getState();
    const wasDead = stateBefore.phase === 'dead';
    this.store.resolveDeathRoll(eventId, escapeOptionId);
    const stateAfter = useGameStore.getState();
    return { survived: stateAfter.phase !== 'dead' && !wasDead };
  }

  // ── Behavioral settings ────────────────────────────────────────────────

  /** Set a behavioral slider (1–5). */
  setBehavior(key: keyof BehavioralSettings, value: BehaviorLevel): void {
    this.store.updateBehavioralSetting(key, value);
  }

  // ── Movement ───────────────────────────────────────────────────────────

  /** Move to an adjacent map node. */
  moveTo(nodeId: string): void {
    this.store.moveLocation(nodeId);
  }

  /** Get available map nodes the animal can move to. */
  getAdjacentNodes(): Array<{ id: string; type: string; name?: string }> {
    const state = useGameStore.getState();
    if (!state.map) return [];
    const current = state.map.nodes.find(n => n.id === state.map!.currentLocationId);
    if (!current) return [];
    return current.edges.map(edgeId => {
      const node = state.map!.nodes.find(n => n.id === edgeId);
      return node ? { id: node.id, type: node.type, name: (node as { name?: string }).name } : { id: edgeId, type: 'unknown' };
    });
  }

  // ── State inspection ───────────────────────────────────────────────────

  /** Get a compact snapshot of the current game state. */
  getSnapshot(): GameSnapshot {
    const state = useGameStore.getState();
    const a = state.animal;
    return {
      phase: state.phase,
      turn: state.time.turn,
      month: state.time.month,
      year: state.time.year,
      season: state.time.season,
      species: a.speciesId,
      sex: a.sex,
      age: a.age,
      weight: a.weight,
      alive: a.alive,
      causeOfDeath: a.causeOfDeath,
      stats: this.getStatSnapshot(),
      parasites: a.parasites.map(p => p.definitionId),
      injuries: a.injuries.map(i => i.definitionId),
      conditions: (a.conditions ?? []).map(c => c.id ?? c.definitionId ?? String(c)),
      flags: Array.from(a.flags),
      behavioralSettings: { ...state.behavioralSettings },
      energy: a.energy,
    };
  }

  /** Get computed (effective) stat values. */
  getStatSnapshot(): StatSnapshot {
    const stats = useGameStore.getState().animal.stats;
    const snap = {} as StatSnapshot;
    for (const id of Object.values(StatId)) {
      snap[id] = computeEffectiveValue(stats[id]);
    }
    return snap;
  }

  /** Whether the game is still in progress. */
  get isAlive(): boolean {
    return useGameStore.getState().phase === 'playing';
  }

  /** Current phase: 'menu' | 'playing' | 'dead' | 'evolving'. */
  get phase(): string {
    return useGameStore.getState().phase;
  }

  /** Access the raw Zustand store for advanced use. */
  get rawState(): GameState {
    return useGameStore.getState();
  }

  // ── Convenience: play N turns automatically ────────────────────────────

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

      // Dismiss results (updates store state)
      useGameStore.getState().dismissResults();

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
    const state = useGameStore.getState();
    const animal = state.animal;
    const config = state.speciesBundle.config;
    const parasiteDefs = state.speciesBundle.parasites;

    if (!animal.alive) {
      state.killAnimal(animal.causeOfDeath || 'Unknown cause');
      return;
    }

    if (computeEffectiveValue(animal.stats[StatId.HEA]) <= 0) {
      state.killAnimal('Systemic Failure — health completely depleted.');
      return;
    }

    if (animal.weight < config.weight.starvationDeath) {
      state.killAnimal('Starvation — body weight dropped below survival threshold.');
      return;
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
      state.killAnimal('Post-spawning death — the cycle is complete.');
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
        .filter((c: { type: string }) => c.type === 'modify_weight')
        .reduce((sum: number, c: { type: string; amount?: number }) => sum + ((c as { amount: number }).amount ?? 0), 0),
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
