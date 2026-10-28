import { getAllSpeciesBundles } from '../data/species';
import { useSpeciesUnlocks } from '../hooks/useSpeciesUnlocks';
import { isCaptive } from '../engine/captivity';
import { StatId, STAT_NAMES } from '../types/stats';
import styles from '../styles/comparison.module.css';

interface Props {
  onBack: () => void;
}

export function SpeciesComparison({ onBack }: Props) {
  const { isUnlocked } = useSpeciesUnlocks();
  const bundles = getAllSpeciesBundles().filter((b) => !isCaptive(b.config));

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Species Comparison</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headerCell}>Stat</th>
              {bundles.map((b) => (
                <th key={b.config.id} className={styles.headerCell}>
                  {isUnlocked(b.config.id) ? b.config.name : '???'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.labelCell}>Diet</td>
              {bundles.map((b) => (
                <td key={b.config.id} className={styles.valueCell}>
                  {isUnlocked(b.config.id) ? b.config.diet : '\u2014'}
                </td>
              ))}
            </tr>
            <tr>
              <td className={styles.labelCell}>Reproduction</td>
              {bundles.map((b) => (
                <td key={b.config.id} className={styles.valueCell}>
                  {isUnlocked(b.config.id) ? b.config.reproduction.type : '\u2014'}
                </td>
              ))}
            </tr>
            <tr>
              <td className={styles.labelCell}>Turn Unit</td>
              {bundles.map((b) => (
                <td key={b.config.id} className={styles.valueCell}>
                  {isUnlocked(b.config.id) ? (b.config.turnUnit || 'week') : '\u2014'}
                </td>
              ))}
            </tr>
            {Object.values(StatId).map((sid) => (
              <tr key={sid}>
                <td className={styles.labelCell}>{STAT_NAMES[sid]}</td>
                {bundles.map((b) => (
                  <td key={b.config.id} className={styles.valueCell}>
                    {isUnlocked(b.config.id) ? b.config.baseStats[sid] : '\u2014'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={styles.backButton} onClick={onBack}>Back</button>
    </div>
  );
}
