import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BACKSTORY_OPTIONS, type BackstoryType } from '../types/species';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const [selectedBackstory, setSelectedBackstory] = useState<BackstoryType>('rehabilitation');
  const [selectedSex, setSelectedSex] = useState<'male' | 'female'>('female');

  const backstory = BACKSTORY_OPTIONS.find((b) => b.type === selectedBackstory)!;

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '48px 32px',
      fontFamily: 'var(--font-narrative)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '2rem',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Wild Reckoning
      </h1>
      <p style={{
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        marginBottom: 40,
        fontStyle: 'italic',
      }}>
        A wildlife survival simulator
      </p>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Species</h3>
        <div style={{
          padding: '12px 16px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-panel-bg)',
        }}>
          <strong>White-Tailed Deer</strong>
          <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
            (Odocoileus virginianus)
          </span>
          <p style={{ fontSize: '0.9rem', marginTop: 4, color: 'var(--color-text-muted)' }}>
            Northern Minnesota
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Sex</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['female', 'male'] as const).map((sex) => (
            <button
              key={sex}
              onClick={() => setSelectedSex(sex)}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: `2px solid ${selectedSex === sex ? 'var(--color-text)' : 'var(--color-border)'}`,
                borderRadius: 4,
                background: selectedSex === sex ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontWeight: selectedSex === sex ? 700 : 400,
              }}
            >
              {sex === 'female' ? '\u2640 Female' : '\u2642 Male'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Backstory</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BACKSTORY_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedBackstory(option.type)}
              style={{
                padding: '12px 16px',
                border: `2px solid ${selectedBackstory === option.type ? 'var(--color-text)' : 'var(--color-border)'}`,
                borderRadius: 4,
                background: selectedBackstory === option.type ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: selectedBackstory === option.type ? 600 : 400,
              }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', marginBottom: 4 }}>
                {option.label}
              </div>
              <div style={{ fontFamily: 'var(--font-narrative)', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => startGame('white-tailed-deer', backstory, selectedSex)}
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: '1.1rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          border: '2px solid var(--color-text)',
          borderRadius: 4,
          background: 'var(--color-text)',
          color: 'var(--color-panel-bg)',
          cursor: 'pointer',
        }}
      >
        Begin
      </button>
    </div>
  );
}
