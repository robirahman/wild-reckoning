/**
 * Headless Game API for Wild Reckoning.
 *
 * Allows the game to be played and tested programmatically without a browser
 * or React. The API drives the same Zustand store and the same turn pipeline
 * (engine/TurnPipeline) that the UI uses, so headless runs behave exactly
 * like a player's game.
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
import { beginTurn, commitTurn, dismissResults } from '../engine/TurnPipeline';
import { StatId, computeEffectiveValue } from '../types/stats';
import { getSpeciesBundle, getAllSpeciesIds } from '../data/species';
import { BACKSTORY_OPTIONS } from '../types/species';
import type { ResolvedEvent, EventChoice } from '../types/events';
import type { ActiveParasite, ActiveInjury, ActiveCondition } from '../types/health';
import type { TurnResult } from '../types/turnResult';
import type { BehavioralSettings, BehaviorLevel } from '../types/behavior';
import type { MapNode } from '../types/map';

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
    this.finishPreviousTurn();
    beginTurn(this._store);

    const state = this._store.getState();
    return {
      turn: state.time.turn,
      month: state.time.monthIndex,
      year: state.time.year,
      season: state.time.season,
      events: state.currentEvents.map(summarizeEvent),
      pendingChoices: [...state.pendingChoices],
      ambientText: state.ambientText,
    };
  }

  /**
   * Close a results screen the caller left open so the next turn can begin.
   * Deadly encounters still awaiting an escape choice take the first option.
   */
  private finishPreviousTurn(): void {
    const state = this._store.getState();
    if (state.turnPhase !== 'results') return;
    for (const roll of [...(state.turnResult?.pendingDeathRolls ?? [])]) {
      if (this._store.getState().phase !== 'playing') return;
      if (roll.escapeOptions.length > 0) this.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
    }
    dismissResults(this._store);
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

    const turnResult = commitTurn(this._store);
    if (!turnResult) {
      throw new Error(
        this._store.getState().phase !== 'playing'
          ? `Cannot end turn: the game is over (phase: ${this._store.getState().phase}).`
          : 'Cannot end turn: no turn is in progress. Call generateTurn() first.'
      );
    }
    return summarizeTurnResult(turnResult, turnResult.statDelta);
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
      // The animal can die in the background before the turn's events (e.g. starvation)
      if (!this.isAlive) break;

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

      dismissResults(this._store);

      log.push({
        turn: turnInfo.turn,
        result,
        snapshot: this.getSnapshot(),
      });
    }

    return log;
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
