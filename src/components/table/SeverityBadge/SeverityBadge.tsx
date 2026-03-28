import type { Severity } from '../../../types/indicator';
import styles from './SeverityBadge.module.scss';

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[severity]}`}>{severity}</span>
  );
}
