
import { useCallback, useRef } from 'react';
import EventWorker from '../engine/EventWorker?worker';
import type { GameState } from '../store/gameStore';
import type { ResolvedEvent } from '../types/events';

export function useEventWorker() {
  const workerRef = useRef<Worker | null>(null);

  const generateEventsAsync = useCallback((state: GameState): Promise<{ results: ResolvedEvent[], rngState: number }> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        workerRef.current = new EventWorker();
      }

      const worker = workerRef.current;

      const handleMessage = (e: MessageEvent) => {
        worker.removeEventListener('message', handleMessage);
        resolve(e.data);
      };

      worker.addEventListener('message', handleMessage);

      // Serialize state for worker
      const ctx = {
        animal: {
          ...state.animal,
          flags: Array.from(state.animal.flags) // Convert Set to Array
        },
        time: state.time,
        behavior: state.behavioralSettings,
        cooldowns: state.eventCooldowns,
        rngState: state.rng.getState(),
        events: state.speciesBundle.events,
        config: state.speciesBundle.config,
        difficulty: state.difficulty,
        npcs: state.npcs,
        ecosystem: state.ecosystem,
        fastForward: state.fastForward,
      };

      worker.postMessage(ctx);
    });
  }, []);

  return { generateEventsAsync };
}
