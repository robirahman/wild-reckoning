/** Phase 14: Encyclopedia/Bestiary UI */

import { useState } from 'react';
import { ENCYCLOPEDIA_ENTRIES } from '../data/encyclopedia';
import { useEncyclopediaStore } from '../store/encyclopediaStore';
import type { EncyclopediaEntry } from '../types/encyclopedia';
import styles from '../styles/encyclopedia.module.css';

const CATEGORIES: { key: EncyclopediaEntry['category']; label: string }[] = [
  { key: 'species', label: 'Species' },
  { key: 'ecology', label: 'Ecology' },
  { key: 'behavior', label: 'Behavior' },
  { key: 'anatomy', label: 'Adaptations' },
  { key: 'habitat', label: 'Habitats' },
];

interface Props {
  onBack: () => void;
}

export function Encyclopedia({ onBack }: Props) {
  const unlockedIds = useEncyclopediaStore((s) => s.unlockedEntryIds);
  const [selectedCategory, setSelectedCategory] = useState<EncyclopediaEntry['category'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedCategory === 'all'
    ? ENCYCLOPEDIA_ENTRIES
    : ENCYCLOPEDIA_ENTRIES.filter((e) => e.category === selectedCategory);

  const totalUnlocked = ENCYCLOPEDIA_ENTRIES.filter((e) => unlockedIds.has(e.id)).length;
  const total = ENCYCLOPEDIA_ENTRIES.length;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Encyclopedia</h2>
      <div className={styles.progress}>
        {totalUnlocked} / {total} entries unlocked
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.filterBtn} ${selectedCategory === cat.key ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((entry) => {
          const unlocked = unlockedIds.has(entry.id);
          const expanded = expandedId === entry.id;

          return (
            <div
              key={entry.id}
              className={`${styles.entry} ${unlocked ? styles.unlocked : styles.locked}`}
              onClick={() => unlocked && setExpandedId(expanded ? null : entry.id)}
            >
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>
                  {unlocked ? entry.title : '???'}
                </span>
                <span className={styles.entryCategory}>{entry.category}</span>
              </div>
              {unlocked && expanded && (
                <div className={styles.entryContent}>{entry.content}</div>
              )}
              {!unlocked && (
                <div className={styles.lockedHint}>
                  {entry.unlockCondition.type === 'species_played'
                    ? 'Play this species to unlock'
                    : entry.unlockCondition.type === 'achievement'
                    ? 'Earn an achievement to unlock'
                    : 'Keep playing to unlock'
                  }
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className={styles.backButton} onClick={onBack}>
        Back
      </button>
    </div>
  );
}
