import { create } from 'zustand';
import type { BehavioralSettings } from '../types/behavior';

const STORAGE_KEY = 'wild-reckoning-behavior-presets';

interface PresetState {
  presets: Record<string, BehavioralSettings>;
  savePreset: (name: string, settings: BehavioralSettings) => void;
  deletePreset: (name: string) => void;
  loadPresets: () => Record<string, BehavioralSettings>;
}

function readPresets(): Record<string, BehavioralSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const usePresetStore = create<PresetState>((set, get) => ({
  presets: readPresets(),
  savePreset(name, settings) {
    const updated = { ...get().presets, [name]: { ...settings } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ presets: updated });
  },
  deletePreset(name) {
    const updated = { ...get().presets };
    delete updated[name];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ presets: updated });
  },
  loadPresets: () => get().presets,
}));
