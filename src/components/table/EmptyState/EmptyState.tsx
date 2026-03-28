import styles from './EmptyState.module.scss';

const COLUMN_COUNT = 8;

interface EmptyStateProps {
  hasFilters: boolean;
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <tr>
      <td className={styles.cell} colSpan={COLUMN_COUNT}>
        <div className={styles.wrapper}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className={styles.title}>No indicators found</p>
          <p className={styles.hint}>
            {hasFilters
              ? 'Try adjusting your filters or search query.'
              : 'No threat indicators are available yet.'}
          </p>
        </div>
      </td>
    </tr>
  );
}
