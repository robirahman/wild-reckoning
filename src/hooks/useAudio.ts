import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { AudioManager } from '../audio/AudioManager';

/**
 * Hook that manages audio playback based on game state.
 * Call this once at the top level of the game layout.
 */
export function useAudio() {
  const phase = useGameStore((s) => s.phase);
  const season = useGameStore((s) => s.time.season);

  // Load saved audio settings on mount
  useEffect(() => {
    AudioManager.loadSettings();
  }, []);

  // Update ambient based on season
  useEffect(() => {
    if (phase === 'playing') {
      AudioManager.playAmbient(season);
    } else {
      AudioManager.stopAll();
    }
  }, [phase, season]);

  // Resume AudioContext on first user interaction
  useEffect(() => {
    const handler = () => {
      AudioManager.resume();
      document.removeEventListener('click', handler);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return {
    toggleMute: () => AudioManager.toggleMute(),
    getSettings: () => AudioManager.getSettings(),
    setSettings: (settings: Parameters<typeof AudioManager.setSettings>[0]) =>
      AudioManager.setSettings(settings),
  };
}
