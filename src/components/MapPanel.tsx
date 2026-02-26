import { useGameStore } from '../store/gameStore';
import { RegionalHealth } from './RegionalHealth';
import styles from '../styles/map.module.css';

export function MapPanel() {
  const map = useGameStore((s) => s.map);
  const animal = useGameStore((s) => s.animal);
  const time = useGameStore((s) => s.time);
  const weather = useGameStore((s) => s.currentWeather);
  const moveLocation = useGameStore((s) => s.moveLocation);
  const sniff = useGameStore((s) => s.sniff);
  const phase = useGameStore((s) => s.phase);

  if (!map || phase !== 'playing') return null;

  const currentNode = map.nodes.find((n) => n.id === map.currentLocationId);
  
  return (
    <div className={styles.mapContainer}>
      {/* Sky & Time HUD */}
      <div style={{ 
        marginBottom: 12, 
        padding: '8px 12px', 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        <span>🕒 {time.timeOfDay}</span>
        <span>🌙 {time.lunarPhase} Moon</span>
        <span>💨 {weather?.windDirection} {weather?.windSpeed}mph</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 className={styles.mapTitle} style={{ margin: 0 }}>Territory Map</h3>
        <button 
          onClick={sniff}
          className={styles.moveButton}
          style={{ margin: 0 }}
          title="Use senses to reveal nearby nodes (-5 Energy)"
        >
          👃 Sniff
        </button>
      </div>
      
      <div className={styles.mapViewport}>
        {/* Scent & Noise Layer */}
        {map.nodes.map((node) => (
          <div key={`sensory-${node.id}`} style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: 40,
            height: 40,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {/* Scent Cloud */}
            {node.scentLevel > 10 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(212, 148, 11, ${node.scentLevel / 200}) 0%, transparent 70%)`,
                filter: 'blur(4px)'
              }} />
            )}
            {/* Noise Ripples */}
            {node.noiseLevel > 20 && (
              <div className={styles.noiseRipple} style={{
                position: 'absolute',
                inset: '25%',
                border: `1px solid rgba(255, 255, 255, ${node.noiseLevel / 100})`,
                borderRadius: '50%',
                opacity: 0.5
              }} />
            )}
          </div>
        ))}

        {/* Connections */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {map.nodes.map((node) => 
            node.connections.map((connId) => {
              const target = map.nodes.find(n => n.id === connId);
              if (!target || node.id > target.id) return null;
              if (!node.discovered && !target.discovered) return null;
              return (
                <line 
                  key={`${node.id}-${target.id}`}
                  x1={`${node.x}%`} y1={`${node.y}%`}
                  x2={`${target.x}%`} y2={`${target.y}%`}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              );
            })
          )}
        </svg>

        {/* Nodes */}
        {map.nodes.map((node) => (
          node.discovered ? (
            <div
              key={node.id}
              className={`${styles.node} ${node.id === map.currentLocationId ? styles.currentNode : ''} ${node.visited ? styles.visitedNode : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => {
                if (currentNode?.connections.includes(node.id)) {
                  moveLocation(node.id);
                }
              }}
              title={`${node.type} - Food: ${Math.round(node.resources.food)}%`}
            />
          ) : (
            <div 
              key={node.id}
              className={styles.node}
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`, 
                background: 'rgba(255,255,255,0.05)',
                cursor: 'default' 
              }}
            />
          )
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-ui)' }}>
        <span>⚡ Energy: {Math.round(animal.energy)}%</span>
        <span>👁️ Perception: {animal.perceptionRange}</span>
      </div>

      {currentNode && (
        <div className={styles.nodeInfo}>
          <strong>Current Location: {currentNode.type.toUpperCase()}</strong>
          <br />
          Resources: Food {Math.round(currentNode.resources.food)}% | Cover {currentNode.resources.cover}%
        </div>
      )}
      
      <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
        <RegionalHealth />
      </div>
    </div>
  );
}
