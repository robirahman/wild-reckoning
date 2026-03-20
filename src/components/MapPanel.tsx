import { useGameStore } from '../store/gameStore';
import { describeSurroundings } from '../engine/SensoryDescriptions';
import { computeEffectiveValue, StatId } from '../types/stats';
import styles from '../styles/map.module.css';

/**
 * Animal-perspective sensory navigation panel.
 *
 * No abstract map, no node type labels, no resource numbers.
 * The animal perceives its surroundings through scent, sound,
 * ground feel, and instinct — gated by WIS.
 */
export function MapPanel() {
  const map = useGameStore((s) => s.map);
  const moveLocation = useGameStore((s) => s.moveLocation);
  const sniff = useGameStore((s) => s.sniff);
  const animal = useGameStore((s) => s.animal);
  const config = useGameStore((s) => s.speciesBundle.config);
  const weather = useGameStore((s) => s.currentWeather);
  const worldMemory = useGameStore((s) => s.worldMemory);
  const rng = useGameStore((s) => s.rng);
  const turn = useGameStore((s) => s.time.turn);
  const phase = useGameStore((s) => s.phase);

  if (!map || phase !== 'playing') return null;

  const currentNode = map.nodes.find((n) => n.id === map.currentLocationId);
  if (!currentNode) return null;

  const adjacentNodes = currentNode.connections
    .map((connId: string) => map.nodes.find((n) => n.id === connId))
    .filter(Boolean) as typeof map.nodes;

  const wisdom = computeEffectiveValue(animal.stats[StatId.WIS]);
  const canMove = animal.energy >= 10;

  const description = describeSurroundings(
    currentNode,
    adjacentNodes,
    animal,
    config,
    weather,
    worldMemory,
    wisdom,
    rng,
    turn,
  );

  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>Surroundings</h3>

      <div className={styles.currentLocation}>
        <p className={styles.sensoryText}>{description.current}</p>
      </div>

      {description.directions.length > 0 && (
        <div className={styles.adjacentSection}>
          {!canMove && (
            <p className={styles.tiredText}>Your legs won't carry you.</p>
          )}
          {description.directions.map((dir) => (
            <button
              key={dir.nodeId}
              className={styles.adjacentButton}
              onClick={() => canMove && moveLocation(dir.nodeId)}
              disabled={!canMove}
            >
              <span className={styles.dirLabel}>{dir.sensoryLabel}</span>
              <span className={styles.effortLabel}>{dir.effortLabel}</span>
              {dir.waterCue && (
                <span className={styles.waterCue}>{dir.waterCue}</span>
              )}
              {dir.dangerCue && (
                <span className={styles.dangerCue}>{dir.dangerCue}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {animal.energy >= 5 && (
        <button
          className={styles.sniffButton}
          onClick={() => sniff()}
        >
          {description.sniffLabel}
        </button>
      )}
    </div>
  );
}
