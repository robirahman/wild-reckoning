import { useGameStore } from '../../store/gameStore';
import { WeatherBadge } from './WeatherBadge';
import styles from '../../styles/header.module.css';

interface Props {
  onToggleHistory?: () => void;
}

export function TurnHeader({ onToggleHistory }: Props) {
  const time = useGameStore((s) => s.time);
  const config = useGameStore((s) => s.speciesBundle.config);
  const animal = useGameStore((s) => s.animal);
  const ambientText = useGameStore((s) => s.ambientText);

  // Determine lifecycle phase for species with phases
  const currentPhase = config.phases?.slice().reverse().find(
    (p) => !p.entryFlag || animal.flags.has(p.entryFlag)
  );

  return (
    <div className={styles.turnHeader}>
      <span className={styles.date}>
        {(config.turnUnit ?? 'week') === 'month'
          ? `${time.month}, Year ${time.year}`
          : `Week ${time.week}, ${time.month}, Year ${time.year}`}
        {currentPhase && config.phases && config.phases.length > 1 && (
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
            — {currentPhase.label}
          </span>
        )}
        <WeatherBadge />
      </span>
      {ambientText && (
        <div style={{
          fontFamily: 'var(--font-narrative)',
          fontSize: '0.82rem',
          fontStyle: 'italic',
          color: 'var(--color-text-muted)',
          marginTop: 4,
          lineHeight: 1.4,
          gridColumn: '1 / -1',
        }}>
          {ambientText}
        </div>
      )}
      <span className={styles.turn}>
        {onToggleHistory && (
          <button
            onClick={onToggleHistory}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              padding: '2px 8px',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              marginRight: 10,
            }}
          >
            History
          </button>
        )}
        Turn {time.turn}
      </span>
    </div>
  );
}
