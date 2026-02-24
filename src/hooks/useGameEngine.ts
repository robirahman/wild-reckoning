import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateTurnEvents, resolveTurn } from '../engine/TurnProcessor';

export function useGameEngine() {
  const store = useGameStore();

  const startTurn = useCallback(() => {
    store.advanceTurn();

    const state = useGameStore.getState();
    const events = generateTurnEvents(state);
    store.setEvents(events);
  }, [store]);

  const confirmChoices = useCallback(() => {
    const state = useGameStore.getState();

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

    // Check for death conditions
    checkDeathConditions();
  }, [store]);

  const checkDeathConditions = useCallback(() => {
    const state = useGameStore.getState();
    const animal = state.animal;
    const config = state.speciesBundle.config;
    const parasiteDefs = state.speciesBundle.parasites;

    // Already dead from a death consequence (predator, etc.)
    if (!animal.alive) {
      store.killAnimal(animal.causeOfDeath || 'Unknown cause');
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
        if (state.rng.chance(config.diseaseDeathChanceAtCritical)) {
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
    phase: store.phase,
    hasPendingChoices: store.pendingChoices.length > 0,
  };
}
