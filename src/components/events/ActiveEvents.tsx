import { useGameStore } from '../../store/gameStore';
import { EventCard } from './EventCard';
import styles from '../../styles/events.module.css';

export function ActiveEvents() {
  const currentEvents = useGameStore((s) => s.currentEvents);
  const makeChoice = useGameStore((s) => s.makeChoice);

  const activeEvents = currentEvents.filter((e) => e.definition.type === 'active');

  if (activeEvents.length === 0) {
    // Show fallback only when there are no events at all (active or passive)
    if (currentEvents.length === 0) {
      return (
        <section className={styles.eventsSection}>
          <p className={styles.narrative} style={{ fontStyle: 'italic', opacity: 0.7 }}>
            Nothing new happens. You go through yesterday's motions.
          </p>
        </section>
      );
    }
    return null;
  }

  return (
    <section className={styles.eventsSection}>
      <h3 className={styles.sectionTitle}>Active Events</h3>
      {activeEvents.map((event, idx) => (
        <EventCard
          key={event.definition.id}
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
          revocableNote={
            event.definition.choices?.some((c) => c.revocable)
              ? '(You can freely change this option later)'
              : undefined
          }
          choiceMade={event.choiceMade}
          onChoiceSelect={(choiceId) => {
            if (event.choiceMade === choiceId) {
              // Deselect: clear choice and add back to pending
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
      ))}
    </section>
  );
}
