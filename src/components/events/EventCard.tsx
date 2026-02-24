import { StatEffect } from './StatEffect';
import { EventChoice } from './EventChoice';
import styles from '../../styles/events.module.css';

interface EventCardProps {
  index: number;
  narrative: string;
  image?: string;
  statEffects?: { label: string }[];
  subEventText?: string;
  subEventFootnote?: string;
  choices?: {
    id: string;
    label: string;
    description?: string;
    style: 'default' | 'danger';
    revocable: boolean;
    selected?: boolean;
  }[];
  revocableNote?: string;
  choiceMade?: string;
  onChoiceSelect?: (choiceId: string) => void;
}

export function EventCard({
  index,
  narrative,
  image,
  statEffects,
  subEventText,
  subEventFootnote,
  choices,
  revocableNote,
  choiceMade,
  onChoiceSelect,
}: EventCardProps) {
  return (
    <div className={styles.eventCard}>
      <div className={styles.eventHeader}>
        <span className={styles.eventNumber}>{index}.</span>
      </div>

      <div className={styles.eventBody}>
        <div className={styles.narrativeRow}>
          {image && (
            <img src={image} alt="" className={styles.eventImage} />
          )}
          <p className={styles.narrative}>
            {narrative}
          </p>
        </div>

        {statEffects && statEffects.length > 0 && (
          <div className={styles.effectTags}>
            ({statEffects.map((e, i) => (
              <span key={i}>
                {i > 0 && ', '}
                <StatEffect label={e.label} />
              </span>
            ))})
          </div>
        )}

        {subEventText && (
          <div className={styles.subEvent}>
            <p className={styles.narrative}>{subEventText}</p>
            {subEventFootnote && (
              <p className={styles.footnote}>{subEventFootnote}</p>
            )}
          </div>
        )}

        {choices && choices.length > 0 && (
          <div className={styles.choices}>
            {choices.map((choice) => (
              <EventChoice
                key={choice.id}
                label={choice.label}
                description={choice.description}
                style={choice.style}
                selected={choiceMade === choice.id}
                onClick={() => onChoiceSelect?.(choice.id)}
              />
            ))}
          </div>
        )}

        {revocableNote && (
          <p className={styles.revocableNote}>{revocableNote}</p>
        )}
      </div>
    </div>
  );
}
