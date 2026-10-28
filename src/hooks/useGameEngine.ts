import { useCallback } from 'react';
import { useGameStore, type GameState } from '../store/gameStore';
import {
  beginTurn,
  commitTurn,
  dismissResults as dismissTurnResults,
  resolveDeathRoll as resolveTurnDeathRoll,
  type TurnHooks,
} from '../engine/TurnPipeline';
import { saveGame } from '../store/persistence';
import { checkAchievements } from '../engine/AchievementChecker';
import { useAchievementStore } from '../store/achievementStore';
import { ENCYCLOPEDIA_ENTRIES } from '../data/encyclopedia';
import { useEncyclopediaStore } from '../store/encyclopediaStore';
import { useScenarioStore } from '../store/scenarioStore';

/** Unlock any encyclopedia entries whose conditions are now met */
function unlockEncyclopediaEntries(): void {
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
}

function checkProgress(state: GameState): void {
  checkAchievements(state, 'turn');
  if (state.phase === 'dead') checkAchievements(state, 'death');
  unlockEncyclopediaEntries();
}

/** Browser-only side effects layered on the shared turn pipeline */
const uiHooks: TurnHooks = {
  onCommitted: checkProgress,
  onScenarioDecided: (state, outcome) => {
    if (!state.scenario) return;
    useScenarioStore.getState().addScore({
      scenarioId: state.scenario.id,
      turnsCompleted: state.time.turn,
      won: outcome.status === 'won',
      fitness: state.reproduction.totalFitness,
      date: Date.now(),
    });
  },
};

export function useGameEngine() {
  const phase = useGameStore((s) => s.phase);
  const hasPendingChoices = useGameStore((s) => s.pendingChoices.length > 0);
  const showingResults = useGameStore((s) => s.showingResults);

  /** Start the next turn if one is due; safe to call repeatedly */
  const startTurn = useCallback(() => {
    if (!beginTurn(useGameStore)) return;
    const state = useGameStore.getState();
    if (state.phase === 'dead') {
      checkAchievements(state, 'death');
      return;
    }
    useAchievementStore.getState().recordSpeciesPlayed(state.animal.speciesId);
    // Auto-save once the new turn's events exist
    saveGame(state);
  }, []);

  const confirmChoices = useCallback(() => {
    commitTurn(useGameStore, uiHooks);
  }, []);

  const dismissResults = useCallback(() => {
    if (dismissTurnResults(useGameStore)) startTurn();
  }, [startTurn]);

  const resolveDeathRoll = useCallback((eventId: string, escapeOptionId: string) => {
    resolveTurnDeathRoll(useGameStore, eventId, escapeOptionId, uiHooks);
  }, []);

  return {
    startTurn,
    confirmChoices,
    dismissResults,
    resolveDeathRoll,
    phase,
    hasPendingChoices,
    showingResults,
  };
}
