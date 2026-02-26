import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { resolveTurn } from '../engine/TurnProcessor';
import { StatId, computeEffectiveValue } from '../types/stats';
import { saveGame } from '../store/persistence';
import { checkAchievements } from '../engine/AchievementChecker';
import { useAchievementStore } from '../store/achievementStore';
import { introduceNPC, incrementEncounter, progressRelationship } from '../engine/NPCSystem';
import { tickStorylines } from '../engine/StorylineSystem';
import { generateAmbientText, synthesizeJournalEntry } from '../engine/AmbientTextGenerator';
import { tickEcosystem } from '../engine/EcosystemSystem';
import { tickTerritory, TERRITORIAL_SPECIES } from '../engine/TerritorySystem';
import { ENCYCLOPEDIA_ENTRIES } from '../data/encyclopedia';
import { useEncyclopediaStore } from '../store/encyclopediaStore';
import { useEventWorker } from './useEventWorker';
import { pickIllustration } from '../engine/IllustrationPicker';
import { NPC_INTRODUCTION_MIN_TURN, TERRITORY_AUTO_ESTABLISH_TURN, TERRITORY_INITIAL_SIZE, TERRITORY_INITIAL_QUALITY } from '../engine/constants';
import { isSimulationMode } from '../simulation/mode';
import { generateSimulationEvents, drainDebriefingEntries } from '../simulation/events/SimEventGenerator';
import { calibrate } from '../simulation/calibration/calibrator';
import { DEER_MORTALITY } from '../simulation/calibration/data/deer';
import { getRegionDefinition } from '../data/regions';
import type { SimulationContext } from '../simulation/events/types';
import type { CalibratedRates } from '../simulation/calibration/types';

// Cached calibration rates per species (computed once)
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

export function useGameEngine() {
  const store = useGameStore();
  const { generateEventsAsync } = useEventWorker();

  const startTurn = useCallback(async () => {
    store.advanceTurn();

    let state = useGameStore.getState();

    // Introduce NPCs on early turns if none exist yet
    if (state.npcs.length === 0 && state.time.turn >= NPC_INTRODUCTION_MIN_TURN) {
      const npcs = [...state.npcs];
      for (const type of ['rival', 'ally', 'predator'] as const) {
        const npc = introduceNPC(state.animal.speciesId, type, state.time.turn, npcs, state.rng);
        if (npc) npcs.push(npc);
      }
      if (npcs.length > 0) {
        store.setNPCs(npcs);
      }
    }

    // Introduce mate NPC at mating season onset if no mate exists yet
    state = useGameStore.getState();
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
          store.setNPCs([...state.npcs, mateNPC]);
        }
      }
    }

    state = useGameStore.getState();

    // Generate ambient text for this turn
    const ambientText = generateAmbientText({
      season: state.time.season,
      speciesId: state.animal.speciesId,
      regionId: state.animal.region,
      weatherType: state.currentWeather?.type,
      rng: state.rng,
      animalSex: state.animal.sex
    });
    useGameStore.setState({ ambientText });

    // Tick ecosystem populations
    const ecoResult = tickEcosystem(
      state.ecosystem,
      state.animal.region,
      state.time.turn,
      state.rng,
    );
    useGameStore.setState({ ecosystem: ecoResult.ecosystem });

    // Tick territory for territorial species
    if (TERRITORIAL_SPECIES.has(state.animal.speciesId)) {
      // Auto-establish territory after a few turns
      if (!state.territory.established && state.time.turn >= TERRITORY_AUTO_ESTABLISH_TURN) {
        const flags = new Set(state.animal.flags);
        flags.add('territory-established');
        useGameStore.setState({
          territory: { ...state.territory, established: true, size: TERRITORY_INITIAL_SIZE, quality: TERRITORY_INITIAL_QUALITY, markedTurns: 0 },
          animal: { ...state.animal, flags },
        });
      }

      state = useGameStore.getState();
      if (state.territory.established) {
        const newTerritory = tickTerritory(
          state.territory,
          state.animal.speciesId,
          state.rng,
        );
        useGameStore.setState({ territory: newTerritory });
      }
    }

    state = useGameStore.getState();

    // Use Web Worker for event generation
    const { results: generatedEvents, rngState } = await generateEventsAsync(state);
    state.rng.setState(rngState);

    // Generate simulation events on main thread (the worker only handles hardcoded events)
    let simEvents: import('../types/events').ResolvedEvent[] = [];
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

      // Collect debriefing entries and store them
      const newEntries = drainDebriefingEntries();
      if (newEntries.length > 0) {
        const animal = useGameStore.getState().animal;
        const log = [...(animal.debriefingLog ?? []), ...newEntries];
        useGameStore.setState({ animal: { ...animal, debriefingLog: log } });
      }

      // In simulation mode, filter out hardcoded events in categories covered by simulation
      const simCategories = new Set(simEvents.map(e => e.definition.category));
      const filteredHardcoded = simCategories.size > 0
        ? generatedEvents.filter(e => !simCategories.has(e.definition.category))
        : generatedEvents;
      generatedEvents.length = 0;
      generatedEvents.push(...filteredHardcoded);
    }

    // Pick illustrations for generated events (main thread)
    const workerEvents = generatedEvents.map(event => {
      const image = event.definition.image ?? pickIllustration(event.definition, state.rng);
      return {
        ...event,
        definition: image ? { ...event.definition, image } : event.definition
      };
    });
    const events = [...simEvents, ...workerEvents];

    // Tick storylines and inject storyline events
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

    // Merge storyline events with generated events
    const allEvents = [...events, ...storylineResult.injectedEvents];
    store.setEvents(allEvents);

    // Record species played for achievements
    useAchievementStore.getState().recordSpeciesPlayed(useGameStore.getState().animal.speciesId);

    // Auto-save after events are generated (state is complete)
    saveGame(useGameStore.getState());
  }, [store, generateEventsAsync]);

  const checkDeathConditions = useCallback(() => {
    const state = useGameStore.getState();
    const animal = state.animal;
    const config = state.speciesBundle.config;
    const parasiteDefs = state.speciesBundle.parasites;

    // Already dead from a death consequence (predator, etc.)
    if (!animal.alive) {
      store.killAnimal(animal.causeOfDeath || 'Unknown cause');
      checkAchievements(useGameStore.getState(), 'death');
      return;
    }

    // 0. Total Health Depletion
    if (computeEffectiveValue(animal.stats[StatId.HEA]) <= 0) {
      store.killAnimal(
        'Systemic Failure — your health has been completely depleted, and your body can no longer maintain its vital functions.'
      );
      return;
    }

    // 1. Starvation
    if (animal.weight < config.weight.starvationDeath) {
      store.killAnimal(
        'Starvation — your body weight dropped below the threshold your organs could sustain.'
      );
      return;
    }

    // 2. Disease death: parasites at final (critical) stage
    for (const parasite of animal.parasites) {
      const def = parasiteDefs[parasite.definitionId];
      if (def && parasite.currentStage === def.stages.length - 1) {
        const imm = computeEffectiveValue(animal.stats[StatId.IMM]);
        const immFactor = 1.0 + (imm / 100);  // High IMM = higher death chance
        if (state.rng.chance(config.diseaseDeathChanceAtCritical * immFactor)) {
          store.killAnimal(
            `Died from complications of ${def.name} (${def.scientificName || 'unknown pathogen'}). ` +
            `The infection reached a critical stage your body could not overcome.`
          );
          return;
        }
      }
    }

    // 3. Old age: escalating probability after onset
    if (animal.age > config.age.oldAgeOnsetMonths) {
      const yearsOver = (animal.age - config.age.oldAgeOnsetMonths) / 12;
      const ageDeathChance = config.age.oldAgeBaseChance * Math.pow(config.age.oldAgeEscalation, yearsOver);
      if (state.rng.chance(Math.min(ageDeathChance, config.age.maxOldAgeChance))) {
        store.killAnimal(
          `Died of old age at ${Math.floor(animal.age / 12)} years. ` +
          `Your body, worn by seasons of survival, finally gave out.`
        );
        return;
      }
    }

    // 4. Post-spawning death (semelparous species)
    if (state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
      store.killAnimal(
        'Having completed the spawning that was your life\'s purpose, your body gives out. ' +
        'The cycle is complete.'
      );
      return;
    }
  }, [store]);

  const confirmChoices = useCallback(() => {
    const state = useGameStore.getState();

    // Capture pre-resolution stat snapshot
    const preStats: Record<StatId, number> = {} as Record<StatId, number>;
    for (const id of Object.values(StatId)) {
      preStats[id] = computeEffectiveValue(state.animal.stats[id]);
    }

    // Set cooldowns for all fired events
    const cooldownUpdates: Record<string, number> = {};
    for (const event of state.currentEvents) {
      if (event.definition.cooldown) {
        cooldownUpdates[event.definition.id] = event.definition.cooldown;
      }
    }
    store.setEventCooldowns(cooldownUpdates);

    // Resolve all event effects
    const result = resolveTurn(state);

    // Synthesize cohesive journal entry
    const journalEntry = synthesizeJournalEntry(result.turnResult, {
      season: state.time.season,
      speciesId: state.animal.speciesId,
      regionId: state.animal.region,
      weatherType: state.currentWeather?.type,
      rng: state.rng,
      animalSex: state.animal.sex
    });
    result.turnResult.journalEntry = journalEntry;

    // Apply health and other resolution changes to animal state
    useGameStore.setState({ animal: result.animal });

    // Apply stat effects
    if (result.statEffects.length > 0) {
      store.applyStatEffects(result.statEffects);
    }

    // Apply consequences
    for (const consequence of result.consequences) {
      store.applyConsequence(consequence);
    }

    // Compute stat deltas after effects are applied
    const postState = useGameStore.getState();
    const statDelta: Record<StatId, number> = {} as Record<StatId, number>;
    for (const id of Object.values(StatId)) {
      statDelta[id] = computeEffectiveValue(postState.animal.stats[id]) - preStats[id];
    }
    result.turnResult.statDelta = statDelta;

    // Track NPC encounters and lifetime stats based on event tags/results
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
      
      // Track food sources
      if (tags.includes('foraging') && outcome.consequences.some(c => c.type === 'modify_weight' && c.amount > 0)) {
        const foodName = event.definition.id;
        foodSourceHits[foodName] = (foodSourceHits[foodName] || 0) + 1;
      }

      // Predators evaded
      if (tags.includes('predator') && outcome.deathRollSurvived === true) {
        predatorsEvaded++;
      }

      // Prey eaten (if foraging result was positive weight and species is not pure herbivore)
      if (tags.includes('foraging') && outcome.consequences.some(c => c.type === 'modify_weight' && c.amount > 0)) {
        if (state.speciesBundle.config.diet !== 'herbivore') {
          preyEaten++;
        }
      }

      // Rivals defeated (if outcome tags or choices imply victory)
      if (tags.includes('rival') && (outcome.choiceId?.includes('fight') || outcome.choiceId?.includes('challenge'))) {
        // Assume success if no major injury consequences
        if (!outcome.consequences.some(c => c.type === 'add_injury' && (c.severity ?? 0) > 0)) {
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
        if (npc) {
          updatedNPCs = incrementEncounter(updatedNPCs, npc.id, encounterState.time.turn);
        }
      }
    }

    // Progress NPC relationships and count friends
    const previousFriends = encounterState.npcs.filter(n => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    updatedNPCs = progressRelationship(updatedNPCs);
    const currentFriends = updatedNPCs.filter(n => n.relationship === 'friendly' || n.relationship === 'bonded').length;
    const newFriendsMade = Math.max(0, currentFriends - previousFriends);

    if (updatedNPCs !== encounterState.npcs) {
      store.setNPCs(updatedNPCs);
    }

    // Apply accumulated lifetime stats
    const currentFoodSources = { ...useGameStore.getState().animal.lifetimeStats.foodSources };
    for (const [id, count] of Object.entries(foodSourceHits)) {
      currentFoodSources[id] = (currentFoodSources[id] || 0) + count;
    }

    if (predatorsEvaded > 0 || preyEaten > 0 || rivalsDefeated > 0 || newFriendsMade > 0 || Object.keys(foodSourceHits).length > 0) {
      useGameStore.setState({
        animal: {
          ...useGameStore.getState().animal,
          lifetimeStats: {
            ...useGameStore.getState().animal.lifetimeStats,
            predatorsEvaded: useGameStore.getState().animal.lifetimeStats.predatorsEvaded + predatorsEvaded,
            preyEaten: useGameStore.getState().animal.lifetimeStats.preyEaten + preyEaten,
            rivalsDefeated: useGameStore.getState().animal.lifetimeStats.rivalsDefeated + rivalsDefeated,
            friendsMade: useGameStore.getState().animal.lifetimeStats.friendsMade + newFriendsMade,
            foodSources: currentFoodSources,
          }
        }
      });
    }

    // Show the turn results screen
    store.setTurnResult(result.turnResult);

    // Check for death conditions
    checkDeathConditions();

    // Check achievements after turn
    checkAchievements(useGameStore.getState(), 'turn');

    // Check encyclopedia unlocks
    const encStore = useEncyclopediaStore.getState();
    const achStore = useAchievementStore.getState();
    for (const entry of ENCYCLOPEDIA_ENTRIES) {
      if (encStore.unlockedEntryIds.has(entry.id)) continue;
      const cond = entry.unlockCondition;
      if (cond.type === 'default') {
        encStore.unlock(entry.id);
      } else if (cond.type === 'species_played' && achStore.speciesPlayed.has(cond.speciesId)) {
        encStore.unlock(entry.id);
      } else if (cond.type === 'achievement' && achStore.unlockedIds.has(cond.achievementId)) {
        encStore.unlock(entry.id);
      }
    }
  }, [store, checkDeathConditions]);

  const dismissResults = useCallback(async () => {
    store.dismissResults();
    await startTurn();
  }, [store, startTurn]);

  return {
    startTurn,
    confirmChoices,
    dismissResults,
    phase: store.phase,
    hasPendingChoices: store.pendingChoices.length > 0,
    showingResults: store.showingResults,
  };
}
