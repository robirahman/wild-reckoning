import styles from '../../styles/events.module.css';

interface EventChoiceProps {
  label: string;
  style: 'default' | 'danger';
  selected?: boolean;
  onClick: () => void;
}

export function EventChoice({ label, style, selected, onClick }: EventChoiceProps) {
  const className = [
    styles.choiceButton,
    style === 'danger' ? styles.choiceDanger : styles.choiceDefault,
    selected ? styles.choiceSelected : '',
  ].join(' ');

  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  );
}
