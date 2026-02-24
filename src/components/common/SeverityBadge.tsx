import type { Severity } from '../../types';

const SEVERITY_COLORS: Record<Severity, string> = {
  minor: 'var(--color-severity-minor)',
  moderate: 'var(--color-severity-moderate)',
  severe: 'var(--color-severity-severe)',
  critical: 'var(--color-severity-critical)',
};

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      style={{
        color: SEVERITY_COLORS[severity],
        fontWeight: 700,
        fontSize: '0.85rem',
        fontFamily: 'var(--font-ui)',
      }}
    >
      ({severity})
    </span>
  );
}
