import type { GameSlice, UISlice } from './types';

export const createUISlice: GameSlice<UISlice> = (set, get) => ({
  phase: 'menu',
  showingResults: false,
  tutorialStep: null,
  ambientText: null,
  fastForward: false,
  turnResult: null,
  instinctNudges: [],

  toggleFastForward: () => set({ fastForward: !get().fastForward }),
  
  advanceTutorial: () => {
    const current = get().tutorialStep;
    if (current !== null) {
      if (current >= 4) { // Max tutorial steps
        localStorage.setItem('wild-reckoning-tutorial-seen', 'true');
        set({ tutorialStep: null });
      } else {
        set({ tutorialStep: current + 1 });
      }
    }
  },

  skipTutorial: () => {
    localStorage.setItem('wild-reckoning-tutorial-seen', 'true');
    set({ tutorialStep: null });
  },

  dismissResults: () => {
    set({ showingResults: false, turnResult: null });
    get().advanceTurn();
  },

  setTurnResult: (result) => set({ turnResult: result, showingResults: true }),
  setInstinctNudges: (nudges) => set({ instinctNudges: nudges }),

  returnToMenu: () => {
    // Note: deleteSaveGame is called in the main store or here if we import it
    set({ 
      phase: 'menu',
      turnResult: null,
      showingResults: false
    });
  },
});
