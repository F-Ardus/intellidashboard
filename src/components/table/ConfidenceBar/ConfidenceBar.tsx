import type { Severity } from '../../../types/indicator';
import styles from './ConfidenceBar.module.scss';

interface ConfidenceBarProps {
  confidence: number;
  severity: Severity;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'var(--severity-critical)',
  high: 'var(--severity-high)',
  medium: 'var(--severity-medium)',
  low: 'var(--severity-low)',
};

export function ConfidenceBar({ confidence, severity }: ConfidenceBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{
            width: `${confidence}%`,
            background: SEVERITY_COLORS[severity],
          }}
        />
      </div>
      <span className={styles.value}>{confidence}%</span>
    </div>
  );
}
