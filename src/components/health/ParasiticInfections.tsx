import { useGameStore } from '../../store/gameStore';
import { ParasiteCard } from './ParasiteCard';
import { parasiteDefinitions } from '../../data/parasites';
import styles from '../../styles/health.module.css';

export function ParasiticInfections() {
  const parasites = useGameStore((s) => s.animal.parasites);

  if (parasites.length === 0) return null;

  return (
    <section className={styles.healthSection}>
      <h3 className={styles.sectionTitle}>Parasitic Infections</h3>
      {parasites.map((parasite) => {
        const def = parasiteDefinitions[parasite.definitionId];
        if (!def) return null;
        const stage = def.stages[parasite.currentStage];
        return (
          <ParasiteCard
            key={parasite.definitionId}
            name={def.name}
            severity={stage.severity}
            effects={[
              ...stage.statEffects.map((e) => {
                const sign = e.amount > 0 ? '+' : '';
                return `${stage.description.split('.')[0]} (${sign}${e.stat})`;
              }),
              ...stage.secondaryEffects,
            ]}
          />
        );
      })}
    </section>
  );
}
