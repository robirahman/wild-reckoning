import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { DebriefingEntry } from '../simulation/narrative/types';
import styles from '../styles/debriefing.module.css';

export function DebriefingPanel() {
  const [expanded, setExpanded] = useState(false);
  const debriefingLog = useGameStore((s) => s.animal.debriefingLog);

  if (!debriefingLog || debriefingLog.length === 0) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Life Debriefing' : 'View Life Debriefing'}
      </button>

      {expanded && (
        <>
          <div className={styles.intro}>
            What you experienced as an animal, and what was actually happening
            — told in the language of the species that named everything.
          </div>

          <div className={styles.entryList}>
            {debriefingLog.map((entry, i) => (
              <DebriefingEntryCard key={`${entry.turn}-${i}`} entry={entry} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DebriefingEntryCard({ entry }: { entry: DebriefingEntry }) {
  return (
    <div className={entry.fatal ? styles.entryFatal : styles.entry}>
      <div className={styles.entryHeader}>
        <span className={styles.turnLabel}>Turn {entry.turn}</span>
        {entry.fatal && <span className={styles.fatalBadge}>Fatal</span>}
      </div>

      <div className={styles.summaryLine}>{entry.summaryLine}</div>

      <div className={styles.dualView}>
        <div className={styles.animalView}>
          <div className={styles.viewLabel}>What you perceived</div>
          <div className={styles.viewText}>{entry.animalNarrative}</div>
        </div>
        <div className={styles.clinicalView}>
          <div className={styles.viewLabel}>What actually happened</div>
          <div className={styles.clinicalViewText}>{entry.clinicalNarrative}</div>
        </div>
      </div>

      {entry.choiceLabel && (
        <div className={styles.choiceLabel}>Choice: {entry.choiceLabel}</div>
      )}
    </div>
  );
}
