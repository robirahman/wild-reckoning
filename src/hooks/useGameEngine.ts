import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateTurnEvents, resolveTurn } from '../engine/TurnProcessor';
import { StatId, computeEffectiveValue } from '../types/stats';
import { saveGame } from '../store/persistence';
import { checkAchievements } from '../engine/AchievementChecker';
import { useAchievementStore } from '../store/achievementStore';
import { introduceNPC, incrementEncounter } from '../engine/NPCSystem';
import { tickStorylines } from '../engine/StorylineSystem';

export function useGameEngine() {
  const store = useGameStore();

  const startTurn = useCallback(() => {
    store.advanceTurn();

    const state = useGameStore.getState();

    // Introduce NPCs on early turns if none exist yet
    if (state.npcs.length === 0 && state.time.turn >= 3) {
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
    const stateForMate = useGameStore.getState();
    const hasMate = stateForMate.npcs.some((n) => n.type === 'mate' && n.alive);
    if (!hasMate && stateForMate.time.turn >= 3) {
      const reproConfig = stateForMate.speciesBundle.config.reproduction;
      const isMating =
        (reproConfig.type === 'iteroparous' &&
          (reproConfig.matingSeasons === 'any' || reproConfig.matingSeasons.includes(stateForMate.time.season))) ||
        (reproConfig.type === 'semelparous' &&
          stateForMate.animal.flags.has(reproConfig.spawningMigrationFlag));
      if (isMating) {
        const mateNPC = introduceNPC(stateForMate.animal.speciesId, 'mate', stateForMate.time.turn, stateForMate.npcs, stateForMate.rng);
        if (mateNPC) {
          store.setNPCs([...stateForMate.npcs, mateNPC]);
        }
      }
    }

    const currentState = useGameStore.getState();
    const events = generateTurnEvents(currentState);

    // Tick storylines and inject storyline events
    const storylineResult = tickStorylines({
      animal: currentState.animal,
      time: currentState.time,
      behavior: currentState.behavioralSettings,
      config: currentState.speciesBundle.config,
      rng: currentState.rng,
      npcs: currentState.npcs,
      activeStorylines: currentState.activeStorylines,
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

    // Also compute actual weight change including seasonal
    result.turnResult.weightChange = result.turnResult.weightChange;

    // Track NPC encounters based on event tags
    const encounterState = useGameStore.getState();
    let updatedNPCs = encounterState.npcs;
    for (const event of state.currentEvents) {
      const tags = event.definition.tags;
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
    if (updatedNPCs !== encounterState.npcs) {
      store.setNPCs(updatedNPCs);
    }

    // Show the turn results screen
    store.setTurnResult(result.turnResult);

    // Check for death conditions
    checkDeathConditions();

    // Check achievements after turn
    checkAchievements(useGameStore.getState(), 'turn');
  }, [store]);

  const dismissResults = useCallback(() => {
    store.dismissResults();
    startTurn();
  }, [store, startTurn]);

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

  return {
    startTurn,
    confirmChoices,
    dismissResults,
    phase: store.phase,
    hasPendingChoices: store.pendingChoices.length > 0,
    showingResults: store.showingResults,
  };
}
