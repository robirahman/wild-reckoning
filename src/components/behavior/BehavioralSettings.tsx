import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
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

  return (
    <div className={styles.behaviorBar}>
      <span className={styles.label}>Behavioral Settings:</span>
      {DISPLAYED_SETTINGS.map((key) => (
        <div key={key} style={{ position: 'relative' }}>
          <button
            className={styles.settingButton}
            title={BEHAVIOR_DESCRIPTIONS[key]}
            onClick={() => setExpandedSetting(expandedSetting === key ? null : key)}
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
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
