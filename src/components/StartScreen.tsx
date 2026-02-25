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
import { SpeciesComparison } from './SpeciesComparison';
import { SPECIES_UNLOCKS } from '../data/speciesUnlocks';
import { useAchievementStore } from '../store/achievementStore';
import { SCENARIOS } from '../data/scenarios';
import { ThemeToggle } from './ThemeToggle';
import styles from '../styles/startscreen.module.css';

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
  const [subScreen, setSubScreen] = useState<'none' | 'scenarios' | 'encyclopedia' | 'comparison'>('none');
  const unlockedAchievements = useAchievementStore((s) => s.unlockedIds);
  const speciesPlayed = useAchievementStore((s) => s.speciesPlayed);

  const [selectedSpeciesId, setSelectedSpeciesId] = useState(allBundles[0].config.id);
  const selectedBundle = allBundles.find((b) => b.config.id === selectedSpeciesId)!;

  const [selectedBackstoryType, setSelectedBackstoryType] = useState(selectedBundle.backstories[0].type);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female'>('female');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [seedInput, setSeedInput] = useState<string>('');

  // Reset backstory when species changes
  const handleSpeciesChange = (bundle: SpeciesDataBundle) => {
    setSelectedSpeciesId(bundle.config.id);
    setSelectedBackstoryType(bundle.backstories[0].type);
  };

  const backstory: Backstory = selectedBundle.backstories.find((b) => b.type === selectedBackstoryType)
    ?? selectedBundle.backstories[0];

  const handleStartGame = () => {
    const seed = seedInput.trim() !== '' ? parseInt(seedInput, 10) : undefined;
    startGame(selectedSpeciesId, backstory, selectedSex, selectedDifficulty, isNaN(seed as any) ? undefined : seed);
  };

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
  if (subScreen === 'comparison') {
    return <SpeciesComparison onBack={() => setSubScreen('none')} />;
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <ThemeToggle />
      </div>
      <h1 className={styles.title}>
        Wild Reckoning
      </h1>
      <p className={styles.subtitle}>
        A wildlife survival simulator
      </p>

      {saveExists && (
        <button
          onClick={() => resumeGame()}
          className={styles.resumeButton}
        >
          Resume Game
        </button>
      )}

      {/* ── Species Selector ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Species</h3>
        <div className={styles.columnGroup}>
          {allBundles.map((bundle) => {
            const unlocked = isSpeciesUnlocked(bundle.config.id, unlockedAchievements, speciesPlayed);
            const hint = getUnlockHint(bundle.config.id);
            const isSelected = selectedSpeciesId === bundle.config.id && unlocked;

            return (
              <button
                key={bundle.config.id}
                onClick={() => unlocked && handleSpeciesChange(bundle)}
                disabled={!unlocked}
                className={`${styles.speciesButton} ${isSelected ? styles.selected : ''}`}
              >
                <div className={`${styles.speciesName} ${isSelected ? styles.selected : ''}`}>
                  {unlocked ? bundle.config.name : '???'}
                  {unlocked && (
                    <span className={styles.scientificName}>
                      ({bundle.config.scientificName})
                    </span>
                  )}
                </div>
                {unlocked ? (
                  <>
                    <div className={styles.speciesDescription}>
                      {bundle.config.description}
                    </div>
                    <div className={styles.speciesRegion}>
                      {bundle.config.defaultRegionDisplayName}
                      {bundle.config.reproduction.type === 'semelparous' && ' — Semelparous lifecycle'}
                    </div>
                  </>
                ) : (
                  <div className={styles.lockedHint}>
                    Locked — {hint}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sex Selector ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sex</h3>
        <div className={styles.rowGroup}>
          {(['female', 'male'] as const).map((sex) => (
            <button
              key={sex}
              onClick={() => setSelectedSex(sex)}
              className={`${styles.toggleButton} ${selectedSex === sex ? styles.selected : ''}`}
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
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Backstory</h3>
        <div className={styles.columnGroup}>
          {selectedBundle.backstories.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedBackstoryType(option.type)}
              className={`${styles.backstoryButton} ${selectedBackstoryType === option.type ? styles.selected : ''}`}
            >
              <div className={styles.backstoryLabel}>
                {option.label}
              </div>
              <div className={styles.backstoryDescription}>
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Difficulty Selector ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Difficulty</h3>
        <div className={styles.rowGroup}>
          {(['easy', 'normal', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`${styles.difficultyButton} ${selectedDifficulty === diff ? styles.selected : ''}`}
            >
              <div className={`${styles.difficultyLabel} ${selectedDifficulty === diff ? styles.selected : ''}`}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </div>
              <div className={styles.difficultyDescription}>
                {DIFFICULTY_DESCRIPTIONS[diff]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Seed Input ── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>World Seed (Optional)</h3>
        <div className={styles.rowGroup}>
          <input
            type="text"
            placeholder="Random"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            className={styles.seedInput}
          />
        </div>
      </div>

      <AchievementList />

      <button
        onClick={handleStartGame}
        className={styles.beginButton}
      >
        Begin
      </button>

      <div className={styles.navRow}>
        <button
          onClick={() => setSubScreen('scenarios')}
          className={styles.navButton}
        >
          Challenge Mode
        </button>
        <button
          onClick={() => setSubScreen('encyclopedia')}
          className={styles.navButton}
        >
          Encyclopedia
        </button>
        <button
          onClick={() => setSubScreen('comparison')}
          className={styles.navButton}
        >
          Compare Species
        </button>
      </div>
    </div>
  );
}
