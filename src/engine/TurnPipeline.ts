/**
 * The turn loop shared by the browser (useGameEngine) and the headless
 * GameAPI, so the two can't drift apart. A turn moves through three phases:
 *
 *   awaiting-start --beginTurn--> choosing --commitTurn--> results --dismissResults--> awaiting-start
 *
 * Each step checks the phase first, so a double-click, React StrictMode's
 * doubled effects, or an API caller repeating a step can never advance time
 * or apply a turn's effects twice.
 */

import type { StoreApi } from 'zustand';
import type { GameState } from '../store/gameStore';
import type { NPC } from '../types/npc';
import type { ResolvedEvent } from '../types/events';
import type { TurnResult } from '../types/turnResult';
import type { ScenarioOutcome } from '../types/scenario';
import type { TurnRecord } from '../store/slices/types';
import { StatId, computeEffectiveValue } from '../types/stats';
import { generateTurnEvents, resolveTurn, buildSimulationContext } from './TurnProcessor';
import { introduceNPC, introduceAllOfType, incrementEncounter, progressRelationship } from './NPCSystem';
import { tickStorylines } from './StorylineSystem';
import { generateAmbientText, synthesizeJournalEntry } from './AmbientTextGenerator';
import { tickEcosystem } from './EcosystemSystem';
import { tickTerritory, TERRITORIAL_SPECIES } from './TerritorySystem';
import { pickIllustration } from './IllustrationPicker';
import { scenarioOutcomeAfterTurn } from './ScenarioSystem';
import { timeSkipEvent } from './FastForward';
import { NPC_INTRODUCTION_MIN_TURN, TERRITORY_AUTO_ESTABLISH_TURN, TERRITORY_INITIAL_SIZE, TERRITORY_INITIAL_QUALITY } from './constants';
import { isSimulationMode } from '../simulation/mode';
import { drainDebriefingEntries } from '../simulation/events/SimEventGenerator';
import { computeInstincts } from '../simulation/instinct/engine';

export type GameStore = Pick<StoreApi<GameState>, 'getState' | 'setState'>;

export interface TurnHooks {
  /** Runs after a turn's effects are applied and death has been checked */
  onCommitted?: (state: GameState) => void;
  /** Runs once, when a Challenge Mode scenario is won or lost */
  onScenarioDecided?: (state: GameState, outcome: ScenarioOutcome) => void;
}

function statSnapshot(state: GameState): Record<StatId, number> {
  const snap = {} as Record<StatId, number>;
  for (const id of Object.values(StatId)) {
    snap[id] = computeEffectiveValue(state.animal.stats[id]);
  }
  return snap;
}

// ── Begin ────────────────────────────────────────────────────────────────

/**
 * Advance the simulation one turn (or a fast-forward skip) and generate the
 * new turn's events. Returns false if a turn can't start right now.
 */
export function beginTurn(store: GameStore): boolean {
  const before = store.getState();
  if (before.phase !== 'playing' || before.turnPhase !== 'awaiting-start') return false;

  // Storyline branches depend on choices made last turn, which advanceTurn clears
  const previousEvents = before.currentEvents;
  before.advanceTurn();

  // The animal may have died in the background (e.g. starvation) before any event
  if (killIfAlreadyDead(store)) return true;

  introduceNPCs(store);

  let state = store.getState();
  const ambientText = generateAmbientText({
    season: state.time.season,
    speciesId: state.animal.speciesId,
    regionId: state.animal.region,
    weatherType: state.currentWeather?.type,
    rng: state.rng,
    animalSex: state.animal.sex,
  });
  const ecoResult = tickEcosystem(state.ecosystem, state.animal.region, state.time.turn, state.rng);
  store.setState({ ambientText, ecosystem: ecoResult.ecosystem });

  tickTerritoryForTurn(store);

  state = store.getState();
  // Legacy and simulation events, deduplicated by category inside the generator
  const generated = generateTurnEvents(state).map((event) => {
    const image = event.definition.image ?? pickIllustration(event.definition, state.rng);
    return image ? { ...event, definition: { ...event.definition, image } } : event;
  });

  let instinctNudges: GameState['instinctNudges'] = [];
  if (isSimulationMode(state.speciesBundle.config)) {
    instinctNudges = computeInstincts(buildSimulationContext(state));
    const newEntries = drainDebriefingEntries();
    if (newEntries.length > 0) {
      const animal = store.getState().animal;
      store.setState({ animal: { ...animal, debriefingLog: [...(animal.debriefingLog ?? []), ...newEntries] } });
    }
  }

  state = store.getState();
  const storylineResult = tickStorylines({
    animal: state.animal,
    time: state.time,
    behavior: state.behavioralSettings,
    config: state.speciesBundle.config,
    rng: state.rng,
    npcs: state.npcs,
    activeStorylines: state.activeStorylines,
    currentEvents: previousEvents,
  });

  const timeSkip: ResolvedEvent[] = state.lastTimeSkip
    ? [timeSkipEvent(state.lastTimeSkip, state.speciesBundle.config, state.time.turn)]
    : [];

  state.setEvents([...timeSkip, ...generated, ...storylineResult.injectedEvents]);
  store.setState({
    turnPhase: 'choosing',
    instinctNudges,
    activeStorylines: [...storylineResult.updatedStorylines, ...storylineResult.newStorylines],
    lastTimeSkip: null,
  });
  return true;
}

function introduceNPCs(store: GameStore): void {
  let state = store.getState();

  // Introduce rivals, allies and predators on early turns, placed on the map
  if (state.npcs.length === 0 && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
    const npcs = [...state.npcs];
    const mapNodes = state.map?.nodes ?? [];
    const playerNodeId = state.map?.currentLocationId;
    for (const type of ['rival', 'ally', 'predator'] as const) {
      // For predators, introduce all unique species (e.g. wolf + hunter)
      const newNPCs: NPC[] = type === 'predator'
        ? introduceAllOfType(state.animal.speciesId, type, state.time.turn, npcs, state.rng)
        : [introduceNPC(state.animal.speciesId, type, state.time.turn, npcs, state.rng)].filter((n): n is NPC => !!n);
      for (const npc of newNPCs) {
        if (mapNodes.length > 0) {
          const candidates = type === 'ally'
            ? mapNodes.filter((n) => n.id === playerNodeId || (playerNodeId && n.connections.includes(playerNodeId)))
            : mapNodes.filter((n) => n.id !== playerNodeId);
          npc.currentNodeId = (candidates.length > 0 ? state.rng.pick(candidates) : mapNodes[0]).id;
        }
        npcs.push(npc);
      }
    }
    if (npcs.length > 0) state.setNPCs(npcs);
  }

  // Introduce a mate at mating season if there isn't one
  state = store.getState();
  const hasMate = state.npcs.some((n) => n.type === 'mate' && n.alive);
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
        const playerNodeId = state.map?.currentLocationId;
        if (playerNodeId) mateNPC.currentNodeId = playerNodeId;
        state.setNPCs([...state.npcs, mateNPC]);
      }
    }
  }
}

function tickTerritoryForTurn(store: GameStore): void {
  let state = store.getState();
  if (!TERRITORIAL_SPECIES.has(state.animal.speciesId)) return;

  // Auto-establish territory after a few turns
  if (!state.territory.established && state.time.turn >= TERRITORY_AUTO_ESTABLISH_TURN) {
    const flags = new Set(state.animal.flags);
    flags.add('territory-established');
    store.setState({
      territory: { ...state.territory, established: true, size: TERRITORY_INITIAL_SIZE, quality: TERRITORY_INITIAL_QUALITY, markedTurns: 0 },
      animal: { ...state.animal, flags },
    });
  }

  state = store.getState();
  if (state.territory.established) {
    store.setState({ territory: tickTerritory(state.territory, state.animal.speciesId, state.rng) });
  }
}

// ── Commit ───────────────────────────────────────────────────────────────

/**
 * Resolve the player's choices: apply every event's effects once, record the
 * turn, check for death, and show the results. Returns null if the turn
 * can't be committed (wrong phase, or choices still pending).
 */
export function commitTurn(store: GameStore, hooks: TurnHooks = {}): TurnResult | null {
  const state = store.getState();
  if (state.phase !== 'playing' || state.turnPhase !== 'choosing' || state.pendingChoices.length > 0) {
    return null;
  }

  const preStats = statSnapshot(state);

  const cooldownUpdates: Record<string, number> = {};
  for (const event of state.currentEvents) {
    if (event.definition.cooldown) {
      cooldownUpdates[event.definition.id] = event.definition.cooldown;
    }
  }
  state.setEventCooldowns(cooldownUpdates);

  const result = resolveTurn(state);
  result.turnResult.journalEntry = synthesizeJournalEntry(result.turnResult, {
    season: state.time.season,
    speciesId: state.animal.speciesId,
    regionId: state.animal.region,
    weatherType: state.currentWeather?.type,
    rng: state.rng,
    animalSex: state.animal.sex,
  });

  // Health/body changes first, then this turn's stat effects and consequences
  store.setState({ animal: result.animal });
  if (result.statEffects.length > 0) {
    store.getState().applyStatEffects(result.statEffects);
  }
  for (const consequence of result.consequences) {
    store.getState().applyConsequence(consequence);
  }

  const postStats = statSnapshot(store.getState());
  for (const id of Object.values(StatId)) {
    result.turnResult.statDelta[id] = postStats[id] - preStats[id];
  }

  trackEncountersAndLifetimeStats(store, state.currentEvents, result.turnResult);
  pauseFastForwardOnTrouble(store, result.turnResult);

  const record: TurnRecord = {
    turn: state.time.turn,
    month: state.time.month,
    year: state.time.year,
    season: state.time.season,
    events: state.currentEvents,
    statSnapshot: postStats,
  };
  store.setState({ turnHistory: [...store.getState().turnHistory, record] });

  store.getState().setTurnResult(result.turnResult);
  store.setState({ turnPhase: 'results' });

  checkDeathConditions(store);

  const afterTurn = store.getState();
  const outcome = scenarioOutcomeAfterTurn(afterTurn);
  if (outcome) {
    store.setState({ scenarioOutcome: outcome });
    hooks.onScenarioDecided?.(store.getState(), outcome);
  }

  hooks.onCommitted?.(store.getState());
  return result.turnResult;
}

/** Count predators evaded, prey eaten, rivals beaten and friends made; credit NPC encounters */
function trackEncountersAndLifetimeStats(store: GameStore, events: ResolvedEvent[], turnResult: TurnResult): void {
  const state = store.getState();
  let updatedNPCs = state.npcs;
  let predatorsEvaded = 0;
  let preyEaten = 0;
  let rivalsDefeated = 0;
  const foodSourceHits: Record<string, number> = {};

  for (const outcome of turnResult.eventOutcomes) {
    const event = events.find((e) => e.definition.id === outcome.eventId);
    if (!event) continue;
    const tags = event.definition.tags;
    const ateSomething = outcome.consequences.some((c) => c.type === 'modify_weight' && c.amount > 0);

    if (tags.includes('foraging') && ateSomething) {
      foodSourceHits[event.definition.id] = (foodSourceHits[event.definition.id] || 0) + 1;
      if (state.speciesBundle.config.diet !== 'herbivore') preyEaten++;
    }
    if (tags.includes('predator') && outcome.deathRollSurvived === true) {
      predatorsEvaded++;
    }
    // A fight or challenge with no injury afterwards counts as a win
    if (tags.includes('rival') && (outcome.choiceId?.includes('fight') || outcome.choiceId?.includes('challenge'))) {
      if (!outcome.consequences.some((c) => c.type === 'add_injury' && (c.severity ?? 0) > 0)) {
        rivalsDefeated++;
      }
    }

    const npcType = tags.includes('predator') ? 'predator'
      : tags.includes('rival') ? 'rival'
      : tags.includes('ally') ? 'ally'
      : tags.includes('mate') ? 'mate'
      : null;
    if (npcType) {
      const npc = updatedNPCs.find((n) => n.type === npcType && n.alive);
      if (npc) updatedNPCs = incrementEncounter(updatedNPCs, npc.id, state.time.turn);
    }
  }

  const previousFriends = state.npcs.filter((n) => n.relationship === 'friendly' || n.relationship === 'bonded').length;
  updatedNPCs = progressRelationship(updatedNPCs);
  const currentFriends = updatedNPCs.filter((n) => n.relationship === 'friendly' || n.relationship === 'bonded').length;
  const newFriendsMade = Math.max(0, currentFriends - previousFriends);
  if (updatedNPCs !== state.npcs) {
    state.setNPCs(updatedNPCs);
  }

  if (predatorsEvaded > 0 || preyEaten > 0 || rivalsDefeated > 0 || newFriendsMade > 0 || Object.keys(foodSourceHits).length > 0) {
    const animal = store.getState().animal;
    const lifetime = animal.lifetimeStats;
    const foodSources = { ...lifetime.foodSources };
    for (const [id, count] of Object.entries(foodSourceHits)) {
      foodSources[id] = (foodSources[id] || 0) + count;
    }
    store.setState({
      animal: {
        ...animal,
        lifetimeStats: {
          ...lifetime,
          predatorsEvaded: lifetime.predatorsEvaded + predatorsEvaded,
          preyEaten: lifetime.preyEaten + preyEaten,
          rivalsDefeated: lifetime.rivalsDefeated + rivalsDefeated,
          friendsMade: lifetime.friendsMade + newFriendsMade,
          foodSources,
        },
      },
    });
  }
}

/** Stop fast-forwarding through a turn that hurt the animal, and say why */
function pauseFastForwardOnTrouble(store: GameStore, turnResult: TurnResult): void {
  if (!store.getState().fastForward) return;
  const reasons = [
    turnResult.newInjuries.length > 0 ? 'you were injured' : null,
    turnResult.newParasites.length > 0 ? 'you picked up a parasite' : null,
    turnResult.pendingDeathRolls?.length ? 'your life is in danger' : null,
  ].filter((r): r is string => !!r);
  if (reasons.length === 0) return;
  store.setState({ fastForward: false });
  turnResult.notices = [...(turnResult.notices ?? []), `Fast-forward paused: ${reasons.join(', ')}.`];
}

// ── Dismiss ──────────────────────────────────────────────────────────────

/**
 * Close the results screen so the next turn can begin. Escape choices from a
 * deadly encounter must be resolved first.
 */
export function dismissResults(store: GameStore): boolean {
  const state = store.getState();
  if (state.turnPhase !== 'results') return false;
  if (state.turnResult?.pendingDeathRolls?.length) return false;
  state.dismissResults();
  store.setState({ turnPhase: 'awaiting-start' });
  return true;
}

// ── Death ────────────────────────────────────────────────────────────────

/** Deaths already decided by the simulation (no new rolls). Returns true if the animal died. */
function killIfAlreadyDead(store: GameStore): boolean {
  const state = store.getState();
  if (state.phase !== 'playing') return true;
  if (!state.animal.alive) {
    state.killAnimal(state.animal.causeOfDeath || 'Unknown cause');
    return true;
  }
  if (state.animal.weight < state.speciesBundle.config.weight.starvationDeath) {
    state.killAnimal('Starvation -- your body weight dropped below the threshold your organs could sustain.');
    return true;
  }
  return false;
}

/** End-of-turn death checks: decided deaths, health, starvation, thirst, disease, age, spawning */
export function checkDeathConditions(store: GameStore): void {
  if (killIfAlreadyDead(store)) return;

  const state = store.getState();
  const animal = state.animal;
  const config = state.speciesBundle.config;

  if (computeEffectiveValue(animal.stats[StatId.HEA]) <= 0) {
    state.killAnimal(
      'Systemic Failure -- your health has been completely depleted, and your body can no longer maintain its vital functions.'
    );
    return;
  }

  const hydrationConfig = config.hydration;
  if (hydrationConfig && animal.physiologicalStress.dehydration >= hydrationConfig.lethalThreshold) {
    if (state.rng.chance(0.15)) {
      state.killAnimal('Dehydration -- your body could no longer sustain organ function without water.');
      return;
    }
  }

  // Parasites at their final (critical) stage
  for (const parasite of animal.parasites) {
    const def = state.speciesBundle.parasites[parasite.definitionId];
    if (def && parasite.currentStage === def.stages.length - 1) {
      const imm = computeEffectiveValue(animal.stats[StatId.IMM]);
      const immFactor = 1.0 + (imm / 100); // High IMM = higher death chance
      // Day-unit species take four turns per day, so each check carries a quarter of the risk
      const turnScale = config.turnUnit === 'day' ? 0.25 : 1;
      if (state.rng.chance(config.diseaseDeathChanceAtCritical * immFactor * turnScale)) {
        state.killAnimal(
          `Died from complications of ${def.name} (${def.scientificName || 'unknown pathogen'}). ` +
          `The infection reached a critical stage your body could not overcome.`
        );
        return;
      }
    }
  }

  // Old age: escalating probability after onset
  if (animal.age > config.age.oldAgeOnsetMonths) {
    const yearsOver = (animal.age - config.age.oldAgeOnsetMonths) / 12;
    const ageDeathChance = config.age.oldAgeBaseChance * Math.pow(config.age.oldAgeEscalation, yearsOver);
    if (state.rng.chance(Math.min(ageDeathChance, config.age.maxOldAgeChance))) {
      state.killAnimal(
        `Died of old age at ${Math.floor(animal.age / 12)} years. ` +
        `Your body, worn by seasons of survival, finally gave out.`
      );
      return;
    }
  }

  if (state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
    state.killAnimal(
      'Having completed the spawning that was your life\'s purpose, your body gives out. ' +
      'The cycle is complete.'
    );
  }
}
