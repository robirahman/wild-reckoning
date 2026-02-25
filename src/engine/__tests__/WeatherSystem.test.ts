import { describe, it, expect } from 'vitest';
import { computeWeatherPenalty } from '../WeatherSystem';
import type { WeatherState } from '../WeatherSystem';
import { StatId } from '../../types/stats';

describe('WeatherSystem', () => {
  describe('computeWeatherPenalty', () => {
    it('returns no penalty for clear weather', () => {
      const weather: WeatherState = { type: 'clear', description: '', persistenceTurnsLeft: 1, intensity: 0.5, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(0);
      expect(penalty.statModifiers).toHaveLength(0);
    });

    it('returns no penalty for cloudy weather', () => {
      const weather: WeatherState = { type: 'cloudy', description: '', persistenceTurnsLeft: 1, intensity: 0.5, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(0);
      expect(penalty.statModifiers).toHaveLength(0);
    });

    it('applies weight loss and CLI modifier for blizzard', () => {
      const weather: WeatherState = { type: 'blizzard', description: '', persistenceTurnsLeft: 2, intensity: 1.0, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(-2);
      expect(penalty.statModifiers).toHaveLength(1);
      expect(penalty.statModifiers[0].stat).toBe(StatId.CLI);
      expect(penalty.statModifiers[0].amount).toBe(10);
      expect(penalty.statModifiers[0].duration).toBe(1);
    });

    it('applies weight loss and CLI modifier for heat wave', () => {
      const weather: WeatherState = { type: 'heat_wave', description: '', persistenceTurnsLeft: 1, intensity: 1.0, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(-1.5);
      expect(penalty.statModifiers).toHaveLength(1);
      expect(penalty.statModifiers[0].stat).toBe(StatId.CLI);
      expect(penalty.statModifiers[0].amount).toBe(8);
    });

    it('scales with intensity', () => {
      const low: WeatherState = { type: 'heat_wave', description: '', persistenceTurnsLeft: 1, intensity: 0.5, windDirection: 'N', windSpeed: 0 };
      const high: WeatherState = { type: 'heat_wave', description: '', persistenceTurnsLeft: 1, intensity: 1.0, windDirection: 'N', windSpeed: 0 };
      expect(computeWeatherPenalty(high).weightChange).toBeLessThan(computeWeatherPenalty(low).weightChange);
    });

    it('applies HOM modifier for drought', () => {
      const weather: WeatherState = { type: 'drought_conditions', description: '', persistenceTurnsLeft: 3, intensity: 0.8, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.statModifiers).toHaveLength(1);
      expect(penalty.statModifiers[0].stat).toBe(StatId.HOM);
      expect(penalty.statModifiers[0].amount).toBe(Math.round(5 * 0.8));
    });

    it('applies CLI modifier for heavy rain with no weight change', () => {
      const weather: WeatherState = { type: 'heavy_rain', description: '', persistenceTurnsLeft: 1, intensity: 0.7, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(0);
      expect(penalty.statModifiers).toHaveLength(1);
      expect(penalty.statModifiers[0].stat).toBe(StatId.CLI);
    });

    it('applies only weight loss for frost (no stat modifier)', () => {
      const weather: WeatherState = { type: 'frost', description: '', persistenceTurnsLeft: 1, intensity: 1.0, windDirection: 'N', windSpeed: 0 };
      const penalty = computeWeatherPenalty(weather);
      expect(penalty.weightChange).toBe(-0.5);
      expect(penalty.statModifiers).toHaveLength(0);
    });

    it('returns zero penalty for benign weather types', () => {
      const benignTypes = ['rain', 'snow', 'fog'] as const;
      for (const type of benignTypes) {
        const weather: WeatherState = { type, description: '', persistenceTurnsLeft: 1, intensity: 0.8, windDirection: 'N', windSpeed: 0 };
        const penalty = computeWeatherPenalty(weather);
        expect(penalty.weightChange).toBe(0);
        expect(penalty.statModifiers).toHaveLength(0);
      }
    });
  });
});
