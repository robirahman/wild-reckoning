import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { DebriefingEntry } from '../simulation/narrative/types';
import type { CausalChain } from '../simulation/memory/causalChain';
import styles from '../styles/debriefing.module.css';

type DebriefingView = 'timeline' | 'chains';

export function DebriefingPanel() {
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<DebriefingView>('timeline');
  const debriefingLog = useGameStore((s) => s.animal.debriefingLog);
  const causalChains = useGameStore((s) => s.animal.causalChains);

  if (!debriefingLog || debriefingLog.length === 0) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Life Debriefing' : 'View Life Debriefing'}
      </button>

      {expanded && (
        <>
          <div className={styles.intro}>
            What you experienced as an animal, and what was actually happening
            — told in the language of the species that named everything.
          </div>

          {causalChains && causalChains.length > 0 && (
            <div className={styles.viewToggle}>
              <button
                className={view === 'timeline' ? styles.viewButtonActive : styles.viewButton}
                onClick={() => setView('timeline')}
              >
                Timeline
              </button>
              <button
                className={view === 'chains' ? styles.viewButtonActive : styles.viewButton}
                onClick={() => setView('chains')}
              >
                Cause Chains ({causalChains.length})
              </button>
            </div>
          )}

          {view === 'timeline' ? (
            <div className={styles.entryList}>
              {debriefingLog.map((entry, i) => (
                <DebriefingEntryCard key={`${entry.turn}-${i}`} entry={entry} />
              ))}
            </div>
          ) : (
            <div className={styles.entryList}>
              {causalChains?.map((chain) => (
                <CausalChainCard key={chain.id} chain={chain} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DebriefingEntryCard({ entry }: { entry: DebriefingEntry }) {
  return (
    <div className={entry.fatal ? styles.entryFatal : styles.entry}>
      <div className={styles.entryHeader}>
        <span className={styles.turnLabel}>Turn {entry.turn}</span>
        {entry.fatal && <span className={styles.fatalBadge}>Fatal</span>}
      </div>

      <div className={styles.summaryLine}>{entry.summaryLine}</div>

      <div className={styles.dualView}>
        <div className={styles.animalView}>
          <div className={styles.viewLabel}>What you perceived</div>
          <div className={styles.viewText}>{entry.animalNarrative}</div>
        </div>
        <div className={styles.clinicalView}>
          <div className={styles.viewLabel}>What actually happened</div>
          <div className={styles.clinicalViewText}>{entry.clinicalNarrative}</div>
        </div>
      </div>

      {entry.choiceLabel && (
        <div className={styles.choiceLabel}>Choice: {entry.choiceLabel}</div>
      )}
    </div>
  );
}

const EFFECT_TYPE_ICONS: Record<string, string> = {
  injury: '.',
  infection: '~',
  fever: '*',
  sepsis: '!',
  weight_loss: '-',
  stat_decline: 'v',
  death: 'x',
};

function CausalChainCard({ chain }: { chain: CausalChain }) {
  return (
    <div className={chain.fatal ? styles.entryFatal : styles.entry}>
      <div className={styles.entryHeader}>
        <span className={styles.turnLabel}>
          Turn {chain.rootEventTurn}: {chain.rootEventLabel}
        </span>
        {chain.fatal && <span className={styles.fatalBadge}>Fatal Chain</span>}
      </div>

      <div className={styles.chainLinks}>
        {chain.links.map((link, i) => (
          <div key={i} className={styles.chainLink}>
            <span className={styles.chainIcon}>
              {EFFECT_TYPE_ICONS[link.effectType] ?? '.'}
            </span>
            <span className={styles.chainTurn}>T{link.turn}</span>
            <span className={styles.chainArrow}>
              {link.causeLabel}
            </span>
            <span className={styles.chainEffect}>
              {link.effectLabel}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chainSummary}>{chain.summary}</div>
    </div>
  );
}
