import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { generateTurnEvents, resolveTurn } from '../engine/TurnProcessor';
import { parasiteDefinitions } from '../data/parasites';

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

    // Already dead from a death consequence (predator, etc.)
    if (!animal.alive) {
      store.killAnimal(animal.causeOfDeath || 'Unknown cause');
      return;
    }

    // 1. Starvation
    if (animal.weight < 35) {
      store.killAnimal(
        'Starvation — your body weight dropped below the threshold your organs could sustain.'
      );
      return;
    }

    // 2. Disease death: parasites at final (critical) stage
    for (const parasite of animal.parasites) {
      const def = parasiteDefinitions[parasite.definitionId];
      if (def && parasite.currentStage === def.stages.length - 1) {
        if (state.rng.chance(0.08)) {
          store.killAnimal(
            `Died from complications of ${def.name} (${def.scientificName || 'unknown pathogen'}). ` +
            `The infection reached a critical stage your body could not overcome.`
          );
          return;
        }
      }
    }

    // 3. Old age: escalating probability after 96 months (8 years)
    if (animal.age > 96) {
      const yearsOver = (animal.age - 96) / 12;
      const ageDeathChance = 0.02 * Math.pow(1.5, yearsOver);
      if (state.rng.chance(Math.min(ageDeathChance, 0.95))) {
        store.killAnimal(
          `Died of old age at ${Math.floor(animal.age / 12)} years. ` +
          `Your body, worn by seasons of survival, finally gave out.`
        );
        return;
      }
    }
  }, [store]);

  return {
    startTurn,
    confirmChoices,
    phase: store.phase,
    hasPendingChoices: store.pendingChoices.length > 0,
  };
}
