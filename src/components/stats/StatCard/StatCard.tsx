import type { Severity } from '../../../types/indicator';
import styles from './StatCard.module.scss';

type StatVariant = 'total' | Severity;

interface StatCardProps {
  label: string;
  value: number | null;
  variant: StatVariant;
  subLabel: string;
  icon?: React.ReactNode;
}

function formatValue(value: number): string {
  return value.toLocaleString('en-US');
}

export function StatCard({ label, value, variant, subLabel, icon }: StatCardProps) {
  const cardClass = [styles.card, variant !== 'total' ? styles[variant] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClass}>
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
