import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { StatId } from '../types/stats';
import { LineageHistory } from './LineageHistory';
import styles from '../styles/journal.module.css';

const SEASON_COLORS: Record<string, string> = {
  spring: '#6dbf6d',
  summer: '#d4940b',
  autumn: '#c0392b',
  winter: '#3498db',
};

export function JournalView({ onClose }: { onClose: () => void }) {
  const turnHistory = useGameStore((s) => s.turnHistory);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'lineage'>('history');

  // Group by year-season
  const groups: { key: string; year: number; season: string; turns: typeof turnHistory }[] = [];
  let currentKey = '';
  for (const record of turnHistory) {
    const key = `${record.year}-${record.season}`;
    if (key !== currentKey) {
      groups.push({ key, year: record.year, season: record.season, turns: [] });
      currentKey = key;
    }
    groups[groups.length - 1].turns.push(record);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              className={styles.panelTitle} 
              style={{ background: 'none', border: 'none', color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
              onClick={() => setActiveTab('history')}
            >
              Life History
            </button>
            <button 
              className={styles.panelTitle} 
              style={{ background: 'none', border: 'none', color: activeTab === 'lineage' ? 'var(--color-primary)' : 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
              onClick={() => setActiveTab('lineage')}
            >
              Lineage
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>Close</button>
        </div>
        <div className={styles.content}>
          {activeTab === 'lineage' ? (
            <LineageHistory />
          ) : (
            <>
              {groups.map((group) => (
                <div key={group.key} className={styles.seasonGroup}>
                  <button
                    className={styles.seasonHeader}
                    onClick={() => setExpandedKey(expandedKey === group.key ? null : group.key)}
                    style={{ borderLeftColor: SEASON_COLORS[group.season] || '#666' }}
                  >
                    <span className={styles.seasonLabel}>
                      {group.season.charAt(0).toUpperCase() + group.season.slice(1)}, Year {group.year}
                    </span>
                    <span className={styles.turnCount}>{group.turns.length} turns</span>
                  </button>
                  {expandedKey === group.key && (
                    <div className={styles.turnList}>
                      {group.turns.map((record) => (
                        <div key={record.turn} className={styles.turnEntry}>
                          <span className={styles.turnLabel}>Turn {record.turn} — {record.month}</span>
                          <div className={styles.statGrid}>
                            {Object.values(StatId).map((sid) => (
                              <span key={sid} className={styles.statItem}>
                                {sid}: {record.statSnapshot[sid]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {groups.length === 0 && (
                <p className={styles.empty}>No history yet. Play some turns first.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
