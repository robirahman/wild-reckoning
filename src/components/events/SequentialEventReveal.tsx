import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { EventCard } from './EventCard';
import { TurnControls } from '../TurnControls';
import { ActionPanel } from '../ActionPanel';
import styles from '../../styles/events.module.css';

/**
 * Shows events one at a time in sequence. The player resolves each event
 * (makes a choice if required), then the next event is revealed. After all
 * events are shown, the turn controls appear.
 *
 * Passive events are shown as brief narrative blocks between active events.
 * This replaces the old simultaneous dump of ActiveEvents + PassiveEvents.
 */
export function SequentialEventReveal() {
  const currentEvents = useGameStore((s) => s.currentEvents);
  const makeChoice = useGameStore((s) => s.makeChoice);

  // Track how many events have been "revealed" to the player
  const [revealedCount, setRevealedCount] = useState(0);
  const prevLengthRef = useRef(currentEvents.length);

  // Reset only on new turn (length shrinks or goes to 0→N); auto-reveal appended events
  useEffect(() => {
    const prevLen = prevLengthRef.current;
    prevLengthRef.current = currentEvents.length;

    if (currentEvents.length === 0) {
      setRevealedCount(0);
    } else if (prevLen === 0 || currentEvents.length <= prevLen) {
      // New turn: reset to show first event
      setRevealedCount(1);
    } else {
      // Events were appended (e.g. action performed) — auto-reveal them
      setRevealedCount(currentEvents.length);
    }
  }, [currentEvents]);

  if (currentEvents.length === 0) {
    return (
      <section className={styles.eventsSection}>
        <p className={styles.narrative} style={{ fontStyle: 'italic', opacity: 0.7 }}>
          Nothing new happens. You go through yesterday's motions.
        </p>
        <ActionPanel />
        <TurnControls />
      </section>
    );
  }

  const revealed = currentEvents.slice(0, revealedCount);
  const allRevealed = revealedCount >= currentEvents.length;
  const currentEvent = revealed[revealed.length - 1];
  const currentNeedsChoice = currentEvent &&
    currentEvent.definition.type === 'active' &&
    currentEvent.definition.choices &&
    currentEvent.definition.choices.length > 0 &&
    !currentEvent.choiceMade;

  const handleAdvance = () => {
    if (revealedCount < currentEvents.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  return (
    <div>
      {revealed.map((event, idx) => {
        const isActive = event.definition.type === 'active';
        const isCurrent = idx === revealed.length - 1;

        if (!isActive) {
          // Passive event: show as a compact narrative block
          return (
            <section key={event.definition.id} className={styles.passiveEvent} style={{
              opacity: isCurrent ? 1 : 0.7,
              marginBottom: 'var(--space-md)',
            }}>
              <p className={styles.narrative}>{event.resolvedNarrative}</p>
              {event.definition.statEffects.length > 0 && (
                <div className={styles.statEffects}>
                  {event.definition.statEffects.map((e, i) => (
                    <span key={i} className={styles.statEffect}>{e.label}</span>
                  ))}
                </div>
              )}
            </section>
          );
        }

        // Active event: full EventCard
        return (
          <div key={event.definition.id} style={{
            opacity: isCurrent ? 1 : 0.65,
            transition: 'opacity 0.3s',
          }}>
            <EventCard
              index={idx + 1}
              narrative={event.resolvedNarrative}
              image={event.definition.image}
              statEffects={event.definition.statEffects.map((e) => ({ label: e.label }))}
              subEventText={
                event.triggeredSubEvents.length > 0
                  ? event.triggeredSubEvents[0].narrativeText
                  : undefined
              }
              subEventFootnote={
                event.triggeredSubEvents.length > 0
                  ? event.triggeredSubEvents[0].footnote
                  : undefined
              }
              choices={event.definition.choices?.map((c) => ({
                id: c.id,
                label: c.label,
                description: c.description,
                style: c.style,
                revocable: c.revocable,
                selected: event.choiceMade === c.id,
              }))}
              choiceMade={event.choiceMade}
              onChoiceSelect={(choiceId) => {
                if (event.choiceMade === choiceId) {
                  // Deselect
                  useGameStore.setState((s) => ({
                    currentEvents: s.currentEvents.map((e) =>
                      e.definition.id === event.definition.id
                        ? { ...e, choiceMade: undefined }
                        : e
                    ),
                    pendingChoices: [...s.pendingChoices, event.definition.id],
                  }));
                } else {
                  makeChoice(event.definition.id, choiceId);
                }
              }}
            />
          </div>
        );
      })}

      {/* Continue button: shown after the current event has been resolved */}
      {!allRevealed && !currentNeedsChoice && (
        <div style={{ textAlign: 'center', margin: 'var(--space-md) 0' }}>
          <button
            className={styles.continueButton}
            onClick={handleAdvance}
          >
            Continue...
          </button>
        </div>
      )}

      {/* Turn controls: shown after all events are revealed and choices made */}
      {allRevealed && (
        <>
          <ActionPanel />
          <TurnControls />
        </>
      )}
    </div>
  );
}
