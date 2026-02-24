import type { Season } from '../types/world';
import type { GameEvent, EventCategory } from '../types/events';
import { AMBIENT_TRACKS, SFX_BY_CATEGORY, SFX_BY_TAG } from './AudioAssets';
import { createAmbientDrone, createHarmonicLayer, playSfxTone } from './ToneGenerator';

export interface AudioSettings {
  masterVolume: number; // 0-1
  ambientVolume: number; // 0-1
  sfxVolume: number; // 0-1
  muted: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.7,
  ambientVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
};

/**
 * Singleton audio manager using Web Audio API.
 * Handles ambient loops (per-season) and SFX stings (per-event-category).
 * Falls back to programmatic tones when no audio files are available.
 */
class AudioManagerImpl {
  private ctx: AudioContext | null = null;
  private settings: AudioSettings = DEFAULT_SETTINGS;
  private currentAmbient: HTMLAudioElement | null = null;
  private currentSeason: Season | null = null;
  private currentDrone: { osc: OscillatorNode; gain: GainNode } | null = null;
  private currentHarmonic: { osc: OscillatorNode; gain: GainNode } | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  setSettings(settings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.updateVolumes();
    this.saveSettings();
  }

  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  private updateVolumes() {
    const vol = this.settings.muted
      ? 0
      : this.settings.masterVolume * this.settings.ambientVolume;

    if (this.currentAmbient) {
      this.currentAmbient.volume = vol;
    }
    if (this.currentDrone) {
      this.currentDrone.gain.gain.value = vol * 0.06;
    }
    if (this.currentHarmonic) {
      this.currentHarmonic.gain.gain.value = vol * 0.03;
    }
  }

  /** Start or switch the ambient loop for the current season */
  playAmbient(season: Season) {
    if (season === this.currentSeason) return;
    this.currentSeason = season;

    // Stop current ambient
    this.stopAmbient();

    const track = AMBIENT_TRACKS[season];
    if (track) {
      // Use audio file if available
      const audio = new Audio(track);
      audio.loop = true;
      audio.volume = this.settings.muted
        ? 0
        : this.settings.masterVolume * this.settings.ambientVolume;
      audio.play().catch(() => {
        // Autoplay may be blocked until user interaction
      });
      this.currentAmbient = audio;
    } else {
      // Fall back to programmatic tone generation
      try {
        const ctx = this.getContext();
        const vol = this.settings.muted
          ? 0
          : this.settings.masterVolume * this.settings.ambientVolume;

        const drone = createAmbientDrone(ctx, season);
        drone.gain.gain.value = vol * 0.06;
        drone.osc.start();
        this.currentDrone = drone;

        const harmonic = createHarmonicLayer(ctx, drone.osc.frequency.value);
        harmonic.gain.gain.value = vol * 0.03;
        harmonic.osc.start();
        this.currentHarmonic = harmonic;
      } catch {
        // AudioContext may not be available
      }
    }
  }

  private stopAmbient() {
    if (this.currentAmbient) {
      this.currentAmbient.pause();
      this.currentAmbient = null;
    }
    if (this.currentDrone) {
      try {
        this.currentDrone.osc.stop();
        this.currentDrone.osc.disconnect();
        this.currentDrone.gain.disconnect();
      } catch {
        // Already stopped
      }
      this.currentDrone = null;
    }
    if (this.currentHarmonic) {
      try {
        this.currentHarmonic.osc.stop();
        this.currentHarmonic.osc.disconnect();
        this.currentHarmonic.gain.disconnect();
      } catch {
        // Already stopped
      }
      this.currentHarmonic = null;
    }
  }

  /** Play a one-shot SFX for an event */
  playSfx(event: GameEvent) {
    if (this.settings.muted) return;

    // Find SFX by tag first, then category
    let sfxPool: string[] = [];
    for (const tag of event.tags) {
      if (SFX_BY_TAG[tag]?.length) {
        sfxPool = SFX_BY_TAG[tag];
        break;
      }
    }
    if (sfxPool.length === 0) {
      sfxPool = SFX_BY_CATEGORY[event.category as EventCategory] ?? [];
    }

    if (sfxPool.length > 0) {
      // Use audio file
      const src = sfxPool[Math.floor(Math.random() * sfxPool.length)];
      const audio = new Audio(src);
      audio.volume = this.settings.masterVolume * this.settings.sfxVolume;
      audio.play().catch(() => {
        // Silently fail
      });
    } else {
      // Fall back to programmatic tone
      try {
        const ctx = this.getContext();
        const vol = this.settings.masterVolume * this.settings.sfxVolume;
        playSfxTone(ctx, event.category, vol * 0.1);
      } catch {
        // AudioContext may not be available
      }
    }
  }

  /** Stop all audio */
  stopAll() {
    this.stopAmbient();
    this.currentSeason = null;
  }

  /** Toggle mute */
  toggleMute() {
    this.settings.muted = !this.settings.muted;
    this.updateVolumes();
    this.saveSettings();
  }

  private saveSettings() {
    try {
      localStorage.setItem('wild-reckoning-audio', JSON.stringify(this.settings));
    } catch {
      // Silently fail
    }
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem('wild-reckoning-audio');
      if (raw) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch {
      // Use defaults
    }
  }

  /** Resume AudioContext after user interaction (required by browsers) */
  resume() {
    this.getContext().resume().catch(() => {});
  }
}

export const AudioManager = new AudioManagerImpl();
