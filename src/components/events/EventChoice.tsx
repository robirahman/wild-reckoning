import styles from '../../styles/events.module.css';

interface EventChoiceProps {
  label: string;
  description?: string;
  style: 'default' | 'danger';
  selected?: boolean;
  dimmed?: boolean;
  onClick: () => void;
}

export function EventChoice({ label, description, style, selected, dimmed, onClick }: EventChoiceProps) {
  const className = [
    styles.choiceButton,
    style === 'danger' ? styles.choiceDanger : styles.choiceDefault,
    selected ? styles.choiceSelected : '',
    dimmed ? styles.choiceDimmed : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${label}${description ? ': ' + description : ''}`}
    >
      {label}
      {description && (
        <span className={styles.choiceDescription}>{description}</span>
      )}
    </button>
  );
}
