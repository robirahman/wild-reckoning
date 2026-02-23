import { useGameStore } from '../../store/gameStore';
import { StatEffect } from './StatEffect';
import styles from '../../styles/events.module.css';

export function PassiveEvents() {
  const currentEvents = useGameStore((s) => s.currentEvents);

  const passiveEvents = currentEvents.filter((e) => e.definition.type === 'passive');

  if (passiveEvents.length === 0) return null;

  return (
    <section className={styles.eventsSection}>
      <h3 className={styles.sectionTitle}>Passive Developments</h3>
      {passiveEvents.map((event, idx) => (
        <div key={event.definition.id} className={styles.passiveEvent}>
          <span className={styles.eventNumber}>{idx + 1}.</span>
          <div>
            <p className={styles.narrative}>{event.resolvedNarrative}</p>
            {event.definition.statEffects.length > 0 && (
              <div className={styles.effectTags}>
                ({event.definition.statEffects.map((e, i) => (
                  <span key={i}>
                    {i > 0 && ', '}
                    <StatEffect label={e.label} />
                  </span>
                ))})
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
