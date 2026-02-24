import styles from '../../styles/health.module.css';

interface InjuryCardProps {
  name: string;
  description: string;
}

export function InjuryCard({ name, description }: InjuryCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardName}>{name}</span>
      </div>
      <p className={styles.injuryDescription}>{description}</p>
    </div>
  );
}
