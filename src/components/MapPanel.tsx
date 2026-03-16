import { useGameStore } from '../store/gameStore';
import styles from '../styles/map.module.css';

const NODE_TYPE_LABELS: Record<string, string> = {
  forest: 'Dense forest',
  plain: 'Open ground',
  water: 'Water',
  mountain: 'Rocky slopes',
  wetland: 'Wetland',
  edge: 'Forest edge',
};

function describeNode(type: string, food: number, cover: number): string {
  const foodDesc = food > 70 ? 'rich forage' : food > 40 ? 'some forage' : 'sparse forage';
  const coverDesc = cover > 70 ? 'good cover' : cover > 40 ? 'some cover' : 'little cover';
  return `${NODE_TYPE_LABELS[type] ?? type} — ${foodDesc}, ${coverDesc}`;
}

export function MapPanel() {
  const map = useGameStore((s) => s.map);
  const moveLocation = useGameStore((s) => s.moveLocation);
  const animal = useGameStore((s) => s.animal);
  const phase = useGameStore((s) => s.phase);

  if (!map || phase !== 'playing') return null;

  const currentNode = map.nodes.find((n) => n.id === map.currentLocationId);
  if (!currentNode) return null;

  const adjacent = currentNode.connections
    .map((connId: string) => map.nodes.find((n) => n.id === connId))
    .filter(Boolean);

  const canMove = animal.energy >= 10;

  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>Surroundings</h3>

      <div className={styles.currentLocation}>
        <div className={styles.locationLabel}>You are in</div>
        <div className={styles.locationName}>
          {describeNode(currentNode.type, currentNode.resources.food, currentNode.resources.cover)}
        </div>
      </div>

      {adjacent.length > 0 && (
        <div className={styles.adjacentSection}>
          <div className={styles.locationLabel}>
            Nearby {canMove ? '(click to move)' : '(too tired to move)'}
          </div>
          {adjacent.map((node) => (
            <button
              key={node!.id}
              className={styles.adjacentButton}
              onClick={() => canMove && moveLocation(node!.id)}
              disabled={!canMove}
            >
              {describeNode(node!.type, node!.resources.food, node!.resources.cover)}
            </button>
          ))}
        </div>
      )}

      <div className={styles.energyBar}>
        Energy: {Math.round(animal.energy)}%
      </div>
    </div>
  );
}
