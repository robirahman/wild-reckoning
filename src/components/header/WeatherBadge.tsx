import { useGameStore } from '../../store/gameStore';
import { weatherLabel } from '../../engine/WeatherSystem';
import type { WeatherType } from '../../engine/WeatherSystem';
import styles from '../../styles/header.module.css';

function weatherIcon(type: WeatherType): string {
  switch (type) {
    case 'clear': return '\u2600';       // ☀
    case 'cloudy': return '\u26C5';      // ⛅
    case 'rain': return '\u{1F327}';     // 🌧
    case 'heavy_rain': return '\u{1F327}';
    case 'snow': return '\u2744';        // ❄
    case 'blizzard': return '\u2744';
    case 'fog': return '\u{1F32B}';      // 🌫
    case 'heat_wave': return '\u{1F321}'; // 🌡
    case 'frost': return '\u2744';
    case 'drought_conditions': return '\u{1F3DC}'; // 🏜
  }
}

export function WeatherBadge() {
  const weather = useGameStore((s) => s.currentWeather);
  if (!weather) return null;

  return (
    <span className={styles.weatherBadge} title={weather.description}>
      {weatherIcon(weather.type)} {weatherLabel(weather.type)}
    </span>
  );
}
