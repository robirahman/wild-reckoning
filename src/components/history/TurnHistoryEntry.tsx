import { useState } from 'react';
import type { TurnRecord } from '../../store/slices/types';
import type { ResolvedEvent, EventChoice } from '../../types/events';
import styles from '../../styles/history.module.css';

interface Props {
  record: TurnRecord;
}

export function TurnHistoryEntry({ record }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.turnEntry}>
      <div
        className={styles.turnEntryHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <span>Turn {record.turn}</span>
        <span className={styles.turnEntryDate}>
          {record.month}, Year {record.year} — {record.season}
          {' '}{expanded ? '\u25B2' : '\u25BC'}
        </span>
      </div>
      {expanded && (
        <div className={styles.turnEntryBody}>
          {record.events.length === 0 ? (
            <div className={styles.emptyState}>No events this turn.</div>
          ) : (
            record.events.map((event: ResolvedEvent) => (
              <div key={event.definition.id} className={styles.eventEntry}>
                <div className={styles.eventNarrative}>
                  {event.resolvedNarrative}
                </div>
                {event.choiceMade && event.definition.choices && (
                  <div className={styles.eventChoice}>
                    Chose: {event.definition.choices.find((c: EventChoice) => c.id === event.choiceMade)?.label ?? event.choiceMade}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
