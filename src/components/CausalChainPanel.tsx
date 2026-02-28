import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { CausalChain, CausalLink } from '../simulation/memory/causalChain';
import styles from '../styles/causalchain.module.css';

function linkColor(effectType: CausalLink['effectType']): string {
  switch (effectType) {
    case 'injury': return 'var(--color-danger)';
    case 'infection': return '#9b59b6';
    case 'fever': return '#e67e22';
    case 'sepsis': return '#8b0000';
    case 'death': return 'var(--color-danger)';
    case 'weight_loss': return '#f1c40f';
    case 'stat_decline': return 'var(--color-text-muted)';
    default: return 'var(--color-text-muted)';
  }
}

function ChainCard({ chain, defaultExpanded }: { chain: CausalChain; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const summaryParts = chain.links.map(l => l.effectLabel);

  return (
    <div className={chain.fatal ? styles.chainFatal : styles.chain}>
      <button
        className={styles.chainHeader}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className={styles.chainSummary}>
          <strong>{chain.rootEventLabel}</strong>
          {summaryParts.map((part, i) => (
            <span key={i}>
              <span className={styles.chainArrow}>{' \u2192 '}</span>
              {part}
            </span>
          ))}
        </span>
        <span className={styles.chainTurn}>Turn {chain.rootEventTurn}</span>
        {chain.fatal && (
          <span className={styles.chainTurn} style={{ background: 'var(--color-danger)', color: '#fff' }}>
            Fatal
          </span>
        )}
        <span>{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>

      {expanded && (
        <div className={styles.chainLinks}>
          {chain.links.map((link, i) => (
            <div key={i} className={styles.link}>
              <span
                className={styles.linkDot}
                style={{ background: linkColor(link.effectType) }}
              />
              <span className={styles.linkLabel}>
                {link.causeLabel} {'\u2192'} {link.effectLabel}
              </span>
              <span className={styles.linkTurn}>Turn {link.turn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CausalChainPanel() {
  const chains = useGameStore((s) => s.animal.causalChains);
  const [visible, setVisible] = useState(false);

  if (!chains || chains.length === 0) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Hide Causal Chains' : 'View Causal Chains'}
      </button>

      {visible && (
        <>
          <div className={styles.heading}>How You Died</div>
          {chains.map((chain, i) => (
            <ChainCard
              key={chain.id}
              chain={chain}
              defaultExpanded={chain.fatal}
            />
          ))}
        </>
      )}
    </div>
  );
}
