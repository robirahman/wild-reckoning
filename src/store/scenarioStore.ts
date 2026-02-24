/** Phase 8: Scenario score persistence */

import { create } from 'zustand';
import type { ScenarioScore } from '../types/scenario';

const STORAGE_KEY = 'wild-reckoning-scenario-scores';

interface ScenarioState {
  scores: ScenarioScore[];
  addScore: (score: ScenarioScore) => void;
  getBestScore: (scenarioId: string) => ScenarioScore | null;
}

function loadScores(): ScenarioScore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveScores(scores: ScenarioScore[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Silently fail
  }
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scores: loadScores(),

  addScore(score) {
    const newScores = [...get().scores, score];
    saveScores(newScores);
    set({ scores: newScores });
  },

  getBestScore(scenarioId) {
    const matching = get().scores
      .filter((s) => s.scenarioId === scenarioId && s.won)
      .sort((a, b) => b.fitness - a.fitness);
    return matching[0] ?? null;
  },
}));
