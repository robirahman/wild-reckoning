import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import type { TurnRecord } from '../store/slices/types';
import styles from '../styles/runsummary.module.css';

interface TimelineEntry {
  turn: number;
  month: string;
  year: number;
  text: string;
  category: 'injury' | 'parasite' | 'offspring' | 'migration' | 'milestone' | 'death';
}

function extractTimelineEntries(turnHistory: TurnRecord[], causeOfDeath?: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const seenFlags = new Set<string>();
  const seenParasites = new Set<string>();
  const seenInjuries = new Set<string>();

  for (const record of turnHistory) {
    for (const event of record.events) {
      const def = event.definition;
      const tags = def.tags;

      // Track milestones (one-time flag-setting events)
      if (def.consequences) {
        for (const c of def.consequences) {
          if (c.type === 'set_flag' && !seenFlags.has(c.flag)) {
            seenFlags.add(c.flag);
            if (tags.includes('milestone') || tags.includes('migration')) {
              entries.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: def.narrativeText.slice(0, 120) + (def.narrativeText.length > 120 ? '...' : ''),
                category: tags.includes('migration') ? 'migration' : 'milestone',
              });
            }
          }

          // Track parasites acquired
          if (c.type === 'add_parasite' && !seenParasites.has(c.parasiteId)) {
            seenParasites.add(c.parasiteId);
            entries.push({
              turn: record.turn,
              month: record.month,
              year: record.year,
              text: `Contracted ${c.parasiteId.replace(/-/g, ' ')}`,
              category: 'parasite',
            });
          }

          // Track injuries
          if (c.type === 'add_injury' && !seenInjuries.has(c.injuryId + (c.bodyPart ?? ''))) {
            seenInjuries.add(c.injuryId + (c.bodyPart ?? ''));
            entries.push({
              turn: record.turn,
              month: record.month,
              year: record.year,
              text: `Suffered ${c.injuryId.replace(/-/g, ' ')}${c.bodyPart ? ` (${c.bodyPart})` : ''}`,
              category: 'injury',
            });
          }

          // Track offspring
          if (c.type === 'start_pregnancy' || c.type === 'sire_offspring' || c.type === 'spawn') {
            entries.push({
              turn: record.turn,
              month: record.month,
              year: record.year,
              text: c.type === 'spawn' ? 'Spawned' : c.type === 'start_pregnancy' ? 'Became pregnant' : 'Sired offspring',
              category: 'offspring',
            });
          }
        }
      }

      // Also check choices for consequences
      if (event.choiceMade && def.choices) {
        const choice = def.choices.find(ch => ch.id === event.choiceMade);
        if (choice?.consequences) {
          for (const c of choice.consequences) {
            if (c.type === 'add_parasite' && !seenParasites.has(c.parasiteId)) {
              seenParasites.add(c.parasiteId);
              entries.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: `Contracted ${c.parasiteId.replace(/-/g, ' ')}`,
                category: 'parasite',
              });
            }
            if (c.type === 'add_injury' && !seenInjuries.has(c.injuryId + (c.bodyPart ?? ''))) {
              seenInjuries.add(c.injuryId + (c.bodyPart ?? ''));
              entries.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: `Suffered ${c.injuryId.replace(/-/g, ' ')}${c.bodyPart ? ` (${c.bodyPart})` : ''}`,
                category: 'injury',
              });
            }
            if (c.type === 'start_pregnancy' || c.type === 'sire_offspring' || c.type === 'spawn') {
              entries.push({
                turn: record.turn,
                month: record.month,
                year: record.year,
                text: c.type === 'spawn' ? 'Spawned' : c.type === 'start_pregnancy' ? 'Became pregnant' : 'Sired offspring',
                category: 'offspring',
              });
            }
          }
        }
      }

      // Track sub-events
      for (const sub of event.triggeredSubEvents) {
        for (const c of sub.consequences) {
          if (c.type === 'add_parasite' && !seenParasites.has(c.parasiteId)) {
            seenParasites.add(c.parasiteId);
            entries.push({
              turn: record.turn,
              month: record.month,
              year: record.year,
              text: `Contracted ${c.parasiteId.replace(/-/g, ' ')}`,
              category: 'parasite',
            });
          }
          if (c.type === 'add_injury' && !seenInjuries.has(c.injuryId + (c.bodyPart ?? ''))) {
            seenInjuries.add(c.injuryId + (c.bodyPart ?? ''));
            entries.push({
              turn: record.turn,
              month: record.month,
              year: record.year,
              text: `Suffered ${c.injuryId.replace(/-/g, ' ')}${c.bodyPart ? ` (${c.bodyPart})` : ''}`,
              category: 'injury',
            });
          }
        }
      }
    }
  }

  // Add death entry
  if (causeOfDeath) {
    const lastRecord = turnHistory[turnHistory.length - 1];
    if (lastRecord) {
      entries.push({
        turn: lastRecord.turn,
        month: lastRecord.month,
        year: lastRecord.year,
        text: causeOfDeath.slice(0, 150),
        category: 'death',
      });
    }
  }

  return entries;
}

function generateTextSummary(
  entries: TimelineEntry[],
  speciesName: string,
  sex: string,
  age: number,
  turnCount: number,
  causeOfDeath: string | undefined,
  fitness: number,
): string {
  let text = `WILD RECKONING \u2014 Life of a ${speciesName}\n`;
  text += `${'='.repeat(40)}\n`;
  text += `Sex: ${sex} | Survived: ${turnCount} turns | Age: ${age} months\n`;
  text += `Cause of death: ${causeOfDeath || 'Unknown'}\n`;
  text += `Fitness score: ${fitness}\n\n`;
  text += `LIFE TIMELINE:\n`;
  text += `${'-'.repeat(40)}\n`;
  for (const entry of entries) {
    text += `[${entry.month}, Year ${entry.year}] ${entry.text}\n`;
  }
  text += `\n\u2014 Generated by Wild Reckoning\n`;
  return text;
}

export function RunSummary() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const turnHistory = useGameStore((s) => s.turnHistory);
  const causeOfDeath = useGameStore((s) => s.animal.causeOfDeath);
  const speciesName = useGameStore((s) => s.speciesBundle.config.name);
  const sex = useGameStore((s) => s.animal.sex);
  const age = useGameStore((s) => s.animal.age);
  const turnCount = useGameStore((s) => s.time.turn);
  const fitness = useGameStore((s) => s.reproduction.totalFitness);

  const entries = useMemo(
    () => extractTimelineEntries(turnHistory, causeOfDeath),
    [turnHistory, causeOfDeath],
  );

  if (entries.length === 0) return null;

  const sexLabel = sex === 'female' ? 'Female' : 'Male';

  function getTextSummary(): string {
    return generateTextSummary(entries, speciesName, sexLabel, age, turnCount, causeOfDeath, fitness);
  }

  function handleCopy() {
    navigator.clipboard.writeText(getTextSummary()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const text = getTextSummary();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wild-reckoning-${speciesName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Life Timeline' : 'View Life Timeline'}
      </button>

      {expanded && (
        <>
          <div className={styles.timeline}>
            {entries.map((entry, i) => (
              <div key={`${entry.turn}-${i}`} className={`${styles.entry} ${styles[entry.category]}`}>
                <div className={styles.entryDate}>
                  {entry.month}, Year {entry.year} (Turn {entry.turn})
                </div>
                <div className={styles.entryText}>{entry.text}</div>
              </div>
            ))}
          </div>
          <div className={styles.exportButtons}>
            <button className={styles.exportButton} onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button className={styles.exportButton} onClick={handleDownload}>
              Download .txt
            </button>
          </div>
        </>
      )}
    </div>
  );
}
