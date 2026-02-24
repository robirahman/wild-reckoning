import styles from '../../styles/events.module.css';

interface EventChoiceProps {
  label: string;
  description?: string;
  style: 'default' | 'danger';
  selected?: boolean;
  onClick: () => void;
}

export function EventChoice({ label, description, style, selected, onClick }: EventChoiceProps) {
  const className = [
    styles.choiceButton,
    style === 'danger' ? styles.choiceDanger : styles.choiceDefault,
    selected ? styles.choiceSelected : '',
  ].join(' ');

  return (
    <button className={className} onClick={onClick}>
      {label}
      {description && (
        <span className={styles.choiceDescription}>{description}</span>
      )}
    </button>
  );
}
