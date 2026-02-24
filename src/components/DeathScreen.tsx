import { useGameStore } from '../store/gameStore';
import type { Offspring } from '../types/reproduction';

function getFitnessRating(fitness: number): { label: string; color: string } {
  if (fitness === 0) return { label: 'No Surviving Offspring', color: 'var(--color-danger)' };
  if (fitness === 1) return { label: 'Below Average', color: '#c87533' };
  if (fitness === 2) return { label: 'Average — Replacement Rate', color: 'var(--color-text)' };
  if (fitness <= 4) return { label: 'Above Average', color: '#5a9e5a' };
  return { label: 'Exceptional', color: '#3a8a3a' };
}

function offspringFate(o: Offspring): string {
  if (o.matured) return 'Survived to reproductive age';
  if (!o.alive) return o.causeOfDeath || 'Died';
  return `Alive — ${o.ageTurns} weeks old`;
}

export function DeathScreen() {
  const animal = useGameStore((s) => s.animal);
  const time = useGameStore((s) => s.time);
  const turnHistory = useGameStore((s) => s.turnHistory);
  const reproduction = useGameStore((s) => s.reproduction);

  const rating = getFitnessRating(reproduction.totalFitness);
  const hasOffspring = reproduction.offspring.length > 0;

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '48px 32px',
      fontFamily: 'var(--font-narrative)',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '1.8rem',
        marginBottom: 24,
        color: 'var(--color-danger)',
      }}>
        You Have Died
      </h1>

      <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 32 }}>
        {animal.causeOfDeath || 'Your body could no longer sustain the burden of survival.'}
      </p>

      {/* ── Fitness Score ── */}
      <div style={{
        padding: '24px',
        border: '2px solid var(--color-border)',
        borderRadius: 4,
        background: 'var(--color-panel-bg)',
        marginBottom: 24,
      }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--color-text-muted)',
          marginBottom: 8,
        }}>
          Inclusive Genetic Fitness
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: 700,
          fontFamily: 'var(--font-ui)',
          color: rating.color,
          lineHeight: 1.1,
          marginBottom: 4,
        }}>
          {reproduction.totalFitness}
        </div>
        <div style={{
          fontSize: '0.85rem',
          fontFamily: 'var(--font-ui)',
          color: 'var(--color-text-muted)',
          marginBottom: 8,
        }}>
          offspring survived to reproductive age
        </div>
        <div style={{
          fontSize: '0.9rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          color: rating.color,
        }}>
          {rating.label}
        </div>
      </div>

      {/* ── Offspring Breakdown ── */}
      {hasOffspring && (
        <div style={{
          padding: '16px 20px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-panel-bg)',
          textAlign: 'left',
          marginBottom: 24,
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
        }}>
          <div style={{
            fontWeight: 600,
            marginBottom: 8,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            color: 'var(--color-text-muted)',
          }}>
            Offspring
          </div>
          {reproduction.offspring.map((o) => (
            <div key={o.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              borderBottom: '1px solid var(--color-border)',
              lineHeight: 1.6,
            }}>
              <span>
                {o.sex === 'female' ? '\u2640' : '\u2642'}{' '}
                Fawn (born Year {o.bornInYear})
                {o.siredByPlayer && <span style={{ color: 'var(--color-text-muted)' }}> — sired</span>}
              </span>
              <span style={{
                color: o.matured ? '#5a9e5a' : !o.alive ? 'var(--color-danger)' : 'var(--color-text-muted)',
                fontStyle: o.matured ? 'normal' : 'italic',
              }}>
                {offspringFate(o)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Summary Stats ── */}
      <div style={{
        padding: '20px 24px',
        border: '1px solid var(--color-border)',
        borderRadius: 4,
        background: 'var(--color-panel-bg)',
        textAlign: 'left',
        marginBottom: 32,
        fontFamily: 'var(--font-ui)',
        fontSize: '0.9rem',
        lineHeight: 1.8,
      }}>
        <div><strong>Species:</strong> White-Tailed Deer</div>
        <div><strong>Sex:</strong> {animal.sex === 'female' ? 'Female' : 'Male'}</div>
        <div><strong>Age at death:</strong> {animal.age} months ({Math.floor(animal.age / 12)} years)</div>
        <div><strong>Final weight:</strong> {animal.weight} lbs</div>
        <div><strong>Survived:</strong> {time.turn} turns ({time.month}, Year {time.year})</div>
        <div><strong>Parasites contracted:</strong> {animal.parasites.length}</div>
        <div><strong>Injuries sustained:</strong> {animal.injuries.length}</div>
        <div><strong>Events experienced:</strong> {turnHistory.length} turns</div>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '12px 32px',
          fontSize: '1rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          border: '2px solid var(--color-text)',
          borderRadius: 4,
          background: 'var(--color-panel-bg)',
          cursor: 'pointer',
        }}
      >
        Start Over
      </button>
    </div>
  );
}
