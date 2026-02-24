import type { Season } from '../types/world';

const SEASON_FREQUENCIES: Record<Season, number> = {
  spring: 220,
  summer: 196,
  autumn: 174,
  winter: 146,
};

/** Creates a soft ambient drone that varies by season */
export function createAmbientDrone(
  ctx: AudioContext,
  season: Season,
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = SEASON_FREQUENCIES[season];
  osc.type = 'sine';
  gain.gain.value = 0.03; // Very quiet
  osc.connect(gain).connect(ctx.destination);
  return { osc, gain };
}

/** Creates a secondary harmonic layer for depth */
export function createHarmonicLayer(
  ctx: AudioContext,
  baseFreq: number,
): { osc: OscillatorNode; gain: GainNode } {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = baseFreq * 1.5; // Fifth harmonic
  osc.type = 'sine';
  gain.gain.value = 0.015;
  osc.connect(gain).connect(ctx.destination);
  return { osc, gain };
}

type SfxCategory =
  | 'predator'
  | 'foraging'
  | 'health'
  | 'social'
  | 'seasonal'
  | 'environmental'
  | 'psychological'
  | 'migration'
  | 'reproduction'
  | 'default';

const SFX_FREQUENCIES: Record<SfxCategory, { freq: number; type: OscillatorType; duration: number }> = {
  predator: { freq: 110, type: 'sawtooth', duration: 0.4 },
  foraging: { freq: 440, type: 'triangle', duration: 0.2 },
  health: { freq: 330, type: 'sine', duration: 0.3 },
  social: { freq: 350, type: 'triangle', duration: 0.25 },
  seasonal: { freq: 280, type: 'sine', duration: 0.3 },
  environmental: { freq: 260, type: 'sine', duration: 0.35 },
  psychological: { freq: 300, type: 'sine', duration: 0.25 },
  migration: { freq: 320, type: 'triangle', duration: 0.3 },
  reproduction: { freq: 380, type: 'triangle', duration: 0.25 },
  default: { freq: 300, type: 'triangle', duration: 0.2 },
};

/** Plays a short SFX tone for an event category */
export function playSfxTone(ctx: AudioContext, category: string, volume: number = 0.08): void {
  const config = SFX_FREQUENCIES[category as SfxCategory] ?? SFX_FREQUENCIES.default;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = config.freq;
  osc.type = config.type;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + config.duration);
}
