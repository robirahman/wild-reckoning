import { SeverityBadge } from '../common/SeverityBadge';
import type { Severity } from '../../types';
import styles from '../../styles/health.module.css';

interface ParasiteCardProps {
  name: string;
  severity: Severity;
  effects: string[];
  image?: string;
}

export function ParasiteCard({ name, severity, effects, image }: ParasiteCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {image && <img src={image} alt="" className={styles.cardIcon} />}
        <div>
          <span className={styles.cardName}>{name}</span>{' '}
          <SeverityBadge severity={severity} />
        </div>
      </div>
      <ul className={styles.effectsList}>
        {effects.map((effect, i) => (
          <li key={i} className={styles.effectItem}>- {effect}</li>
        ))}
      </ul>
    </div>
  );
}
