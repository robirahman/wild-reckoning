import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { usePresetStore } from '../../store/presetStore';
import { BEHAVIOR_LABELS, BEHAVIOR_DESCRIPTIONS, type BehavioralSettings as BehaviorType } from '../../types';
import type { BehaviorLevel } from '../../types/behavior';
import styles from '../../styles/behavior.module.css';

const DISPLAYED_SETTINGS: (keyof BehaviorType)[] = [
  'foraging', 'belligerence', 'mating', 'caution', 'exploration', 'sociability',
];

export function BehavioralSettings() {
  const settings = useGameStore((s) => s.behavioralSettings);
  const updateSetting = useGameStore((s) => s.updateBehavioralSetting);
  const [expandedSetting, setExpandedSetting] = useState<keyof BehaviorType | null>(null);
  const [presetName, setPresetName] = useState('');

  const presets = usePresetStore((s) => s.presets);
  const savePreset = usePresetStore((s) => s.savePreset);
  const deletePreset = usePresetStore((s) => s.deletePreset);

  const handleLoadPreset = (name: string) => {
    const preset = presets[name];
    if (!preset) return;
    for (const key of DISPLAYED_SETTINGS) {
      if (preset[key] !== undefined) {
        updateSetting(key, preset[key]);
      }
    }
  };

  const handleSavePreset = () => {
    const trimmed = presetName.trim();
    if (!trimmed) return;
    savePreset(trimmed, { ...settings });
    setPresetName('');
  };

  const presetNames = Object.keys(presets);

  return (
    <div className={styles.behaviorBar}>
      <span className={styles.label}>Behavioral Settings:</span>
      {DISPLAYED_SETTINGS.map((key) => (
        <div key={key} style={{ position: 'relative' }}>
          <button
            className={styles.settingButton}
            title={BEHAVIOR_DESCRIPTIONS[key]}
            onClick={() => setExpandedSetting(expandedSetting === key ? null : key)}
            aria-label={`${BEHAVIOR_LABELS[key]}: level ${settings[key]} of 5`}
          >
            {BEHAVIOR_LABELS[key]} ({settings[key]})
          </button>
          {expandedSetting === key && (
            <div className={styles.settingPopup}>
              <div className={styles.popupTitle}>{BEHAVIOR_LABELS[key]}</div>
              <p className={styles.popupDesc}>{BEHAVIOR_DESCRIPTIONS[key]}</p>
              <div className={styles.sliderRow}>
                {([1, 2, 3, 4, 5] as BehaviorLevel[]).map((val) => (
                  <button
                    key={val}
                    className={`${styles.sliderDot} ${settings[key] === val ? styles.sliderDotActive : ''}`}
                    onClick={() => {
                      updateSetting(key, val);
                      setExpandedSetting(null);
                    }}
                    aria-label={`Set ${BEHAVIOR_LABELS[key]} to level ${val}`}
                    aria-pressed={settings[key] === val}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Preset controls */}
      <div className={styles.presetRow}>
        {presetNames.length > 0 && (
          <span className={styles.presetGroup}>
            {presetNames.map((name) => (
              <span key={name} className={styles.presetChip}>
                <button
                  className={styles.presetButton}
                  onClick={() => handleLoadPreset(name)}
                  title={`Load preset: ${name}`}
                >
                  {name}
                </button>
                <button
                  className={styles.presetDelete}
                  onClick={() => deletePreset(name)}
                  title={`Delete preset: ${name}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </span>
        )}
        <span className={styles.presetSave}>
          <input
            className={styles.presetInput}
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSavePreset(); }}
          />
          <button
            className={styles.settingButton}
            onClick={handleSavePreset}
            disabled={!presetName.trim()}
          >
            Save
          </button>
        </span>
      </div>
    </div>
  );
}
