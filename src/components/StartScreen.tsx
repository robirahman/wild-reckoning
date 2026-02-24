import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getAllSpeciesBundles } from '../data/species';
import { hasSaveGame } from '../store/persistence';
import type { SpeciesDataBundle } from '../types/speciesConfig';
import type { Backstory } from '../types/species';
import type { Difficulty } from '../types/difficulty';
import { DIFFICULTY_DESCRIPTIONS } from '../types/difficulty';
import { AchievementList } from './achievements/AchievementList';
import { ScenarioSelect } from './ScenarioSelect';
import { Encyclopedia } from './Encyclopedia';
import { SPECIES_UNLOCKS } from '../data/speciesUnlocks';
import { useAchievementStore } from '../store/achievementStore';
import { SCENARIOS } from '../data/scenarios';

function isSpeciesUnlocked(speciesId: string, unlockedAchievements: Set<string>, speciesPlayed: Set<string>): boolean {
  const unlock = SPECIES_UNLOCKS.find((u) => u.speciesId === speciesId);
  if (!unlock) return true; // No unlock requirement = always available
  if (unlock.requirement.type === 'default') return true;
  if (unlock.requirement.type === 'achievement') return unlockedAchievements.has(unlock.requirement.achievementId);
  if (unlock.requirement.type === 'species_played') return speciesPlayed.has(unlock.requirement.speciesId);
  return true;
}

function getUnlockHint(speciesId: string): string | null {
  const unlock = SPECIES_UNLOCKS.find((u) => u.speciesId === speciesId);
  if (!unlock || unlock.requirement.type === 'default') return null;
  return unlock.requirement.description;
}

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const allBundles = getAllSpeciesBundles();
  const [saveExists] = useState(() => hasSaveGame());
  const [subScreen, setSubScreen] = useState<'none' | 'scenarios' | 'encyclopedia'>('none');
  const unlockedAchievements = useAchievementStore((s) => s.unlockedIds);
  const speciesPlayed = useAchievementStore((s) => s.speciesPlayed);

  const [selectedSpeciesId, setSelectedSpeciesId] = useState(allBundles[0].config.id);
  const selectedBundle = allBundles.find((b) => b.config.id === selectedSpeciesId)!;

  const [selectedBackstoryType, setSelectedBackstoryType] = useState(selectedBundle.backstories[0].type);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female'>('female');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  // Reset backstory when species changes
  const handleSpeciesChange = (bundle: SpeciesDataBundle) => {
    setSelectedSpeciesId(bundle.config.id);
    setSelectedBackstoryType(bundle.backstories[0].type);
  };

  const backstory: Backstory = selectedBundle.backstories.find((b) => b.type === selectedBackstoryType)
    ?? selectedBundle.backstories[0];

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;
    const bundle = allBundles.find((b) => b.config.id === scenario.speciesId);
    if (!bundle) return;
    const scenarioBackstory = scenario.backstoryType
      ? bundle.backstories.find((b) => b.type === scenario.backstoryType) ?? bundle.backstories[0]
      : bundle.backstories[0];
    const sex = scenario.sex ?? 'female';
    startGame(scenario.speciesId, scenarioBackstory, sex, scenario.difficulty);
  };

  if (subScreen === 'scenarios') {
    return <ScenarioSelect onSelect={handleScenarioSelect} onBack={() => setSubScreen('none')} />;
  }
  if (subScreen === 'encyclopedia') {
    return <Encyclopedia onBack={() => setSubScreen('none')} />;
  }

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

      {saveExists && (
        <button
          onClick={() => resumeGame()}
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
            marginBottom: 40,
          }}
        >
          Resume Game
        </button>
      )}

      {/* ── Species Selector ── */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Species</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {allBundles.map((bundle) => {
            const unlocked = isSpeciesUnlocked(bundle.config.id, unlockedAchievements, speciesPlayed);
            const hint = getUnlockHint(bundle.config.id);

            return (
              <button
                key={bundle.config.id}
                onClick={() => unlocked && handleSpeciesChange(bundle)}
                disabled={!unlocked}
                style={{
                  padding: '12px 16px',
                  border: `2px solid ${selectedSpeciesId === bundle.config.id && unlocked ? 'var(--color-text)' : 'var(--color-border)'}`,
                  borderRadius: 4,
                  background: selectedSpeciesId === bundle.config.id && unlocked ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                  textAlign: 'left',
                  cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.45,
                }}
              >
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: selectedSpeciesId === bundle.config.id && unlocked ? 700 : 400 }}>
                  {unlocked ? bundle.config.name : '???'}
                  {unlocked && (
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 8, fontSize: '0.85rem' }}>
                      ({bundle.config.scientificName})
                    </span>
                  )}
                </div>
                {unlocked ? (
                  <>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      {bundle.config.description}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4, fontFamily: 'var(--font-ui)' }}>
                      {bundle.config.defaultRegionDisplayName}
                      {bundle.config.reproduction.type === 'semelparous' && ' — Semelparous lifecycle'}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Locked — {hint}
                  </div>
                )}
              </button>
            );
          })}
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

      {/* ── Difficulty Selector ── */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-ui)', marginBottom: 12 }}>Difficulty</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {(['easy', 'normal', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              style={{
                flex: 1,
                padding: '10px 16px',
                border: `2px solid ${selectedDifficulty === diff ? 'var(--color-text)' : 'var(--color-border)'}`,
                borderRadius: 4,
                background: selectedDifficulty === diff ? 'var(--color-bar-bg)' : 'var(--color-panel-bg)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: selectedDifficulty === diff ? 700 : 400, marginBottom: 4 }}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {DIFFICULTY_DESCRIPTIONS[diff]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <AchievementList />

      <button
        onClick={() => startGame(selectedSpeciesId, backstory, selectedSex, selectedDifficulty)}
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
          marginBottom: 12,
        }}
      >
        Begin
      </button>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => setSubScreen('scenarios')}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            border: '2px solid var(--color-border)',
            borderRadius: 4,
            background: 'var(--color-panel-bg)',
            cursor: 'pointer',
          }}
        >
          Challenge Mode
        </button>
        <button
          onClick={() => setSubScreen('encyclopedia')}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            border: '2px solid var(--color-border)',
            borderRadius: 4,
            background: 'var(--color-panel-bg)',
            cursor: 'pointer',
          }}
        >
          Encyclopedia
        </button>
      </div>
    </div>
  );
}
