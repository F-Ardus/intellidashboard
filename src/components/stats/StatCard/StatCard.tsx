import type { Severity } from '../../../types/indicator';
import styles from './StatCard.module.scss';

type StatVariant = 'total' | Severity;

interface StatCardProps {
  label: string;
  value: number | null;
  variant: StatVariant;
  subLabel: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

function formatValue(value: number): string {
  return value.toLocaleString('en-US');
}

export function StatCard({ label, value, variant, subLabel, icon, onClick }: StatCardProps) {
  const cardClass = [
    styles.card,
    variant !== 'total' ? styles[variant] : '',
    onClick ? styles.clickable : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      {value === null ? (
        <div className={styles.skeleton} />
      ) : (
        <div className={styles.value}>{formatValue(value)}</div>
      )}
      <div className={styles.sub}>{subLabel}</div>
    </div>
  );
}
