import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAllSpeciesBundles } from '../data/species';
import type { SpeciesDataBundle } from '../types/speciesConfig';
import type { Backstory } from '../types/species';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const allBundles = getAllSpeciesBundles();

  const [selectedSpeciesId, setSelectedSpeciesId] = useState(allBundles[0].config.id);
  const selectedBundle = allBundles.find((b) => b.config.id === selectedSpeciesId)!;

  const [selectedBackstoryType, setSelectedBackstoryType] = useState(selectedBundle.backstories[0].type);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female'>('female');

  // Reset backstory when species changes
  const handleSpeciesChange = (bundle: SpeciesDataBundle) => {
    setSelectedSpeciesId(bundle.config.id);
    setSelectedBackstoryType(bundle.backstories[0].type);
  };

  const backstory: Backstory = selectedBundle.backstories.find((b) => b.type === selectedBackstoryType)
    ?? selectedBundle.backstories[0];

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

      {/* ── Species Selector ── */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Species</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allBundles.map((bundle) => (
            <button
              key={bundle.config.id}
              onClick={() => handleSpeciesChange(bundle)}
              style={{
                padding: '12px 16px',
                border: `2px solid ${selectedSpeciesId === bundle.config.id ? 'var(--color-text)' : 'var(--color-border)'}`,
                borderRadius: 4,
                background: selectedSpeciesId === bundle.config.id ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: selectedSpeciesId === bundle.config.id ? 700 : 400 }}>
                {bundle.config.name}
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 8, fontSize: '0.85rem' }}>
                  ({bundle.config.scientificName})
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                {bundle.config.description}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4, fontFamily: 'var(--font-ui)' }}>
                {bundle.config.defaultRegionDisplayName}
                {bundle.config.reproduction.type === 'semelparous' && ' — Semelparous lifecycle'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sex Selector ── */}
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
              {sex === 'female'
                ? `\u2640 ${selectedBundle.config.templateVars.femaleNoun.charAt(0).toUpperCase() + selectedBundle.config.templateVars.femaleNoun.slice(1)}`
                : `\u2642 ${selectedBundle.config.templateVars.maleNoun.charAt(0).toUpperCase() + selectedBundle.config.templateVars.maleNoun.slice(1)}`
              }
            </button>
          ))}
        </div>
      </div>

      {/* ── Backstory Selector ── */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Backstory</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedBundle.backstories.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedBackstoryType(option.type)}
              style={{
                padding: '12px 16px',
                border: `2px solid ${selectedBackstoryType === option.type ? 'var(--color-text)' : 'var(--color-border)'}`,
                borderRadius: 4,
                background: selectedBackstoryType === option.type ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: selectedBackstoryType === option.type ? 600 : 400,
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
        onClick={() => startGame(selectedSpeciesId, backstory, selectedSex)}
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
