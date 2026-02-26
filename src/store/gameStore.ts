import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UISlice, GameSystemSlice, AnimalSlice, WorldSlice, TurnSlice } from './slices/types';
import { createUISlice } from './slices/uiSlice';
import { createGameSystemSlice } from './slices/gameSystemSlice';
import { createAnimalSlice } from './slices/animalSlice';
import { createWorldSlice } from './slices/worldSlice';
import { createTurnSlice } from './slices/turnSlice';

export interface GameState extends UISlice, GameSystemSlice, AnimalSlice, WorldSlice, TurnSlice {}

export const useGameStore = create<GameState>()(
  devtools((...a) => ({
    ...createUISlice(...a),
    ...createGameSystemSlice(...a),
    ...createAnimalSlice(...a),
    ...createWorldSlice(...a),
    ...createTurnSlice(...a),
  }))
);
