import type { GameSlice, WorldSlice } from './types';
import { createInitialTime } from '../../engine/TimeSystem';
import { initializeEcosystem } from '../../engine/EcosystemSystem';
import { INITIAL_TERRITORY } from '../../types/territory';

export const createWorldSlice: GameSlice<WorldSlice> = (set, get) => ({
  time: createInitialTime(5, 1),
  currentWeather: null,
  climateShift: 0,
  ecosystem: initializeEcosystem(),
  territory: { ...INITIAL_TERRITORY },
  map: null,
  npcs: [],
  activeStorylines: [],
  scenario: null,

  tickNPCMovement: () => {
    const state = get();
    if (!state.map) return;

    const updatedNPCs = state.npcs.map(npc => {
      if (!npc.alive || !npc.currentNodeId) return npc;
      if (state.rng.chance(0.3)) {
        const currentNode = state.map!.nodes.find(n => n.id === npc.currentNodeId);
        if (currentNode && currentNode.connections.length > 0) {
          const nextNodeId = state.rng.pick(currentNode.connections);
          return { ...npc, currentNodeId: nextNodeId };
        }
      }
      return npc;
    });

    set({ npcs: updatedNPCs });
  },

  setActiveStorylines: (storylines) => set({ activeStorylines: storylines }),
  setNPCs: (npcs) => set({ npcs }),
});
