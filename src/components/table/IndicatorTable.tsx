import type { Indicator } from '../../types/indicator';
import { EmptyState } from './EmptyState';
import styles from './IndicatorTable.module.scss';
import { IndicatorRow } from './IndicatorRow';
import { SkeletonRow } from './SkeletonRow';

const SKELETON_COUNT = 5;

interface IndicatorTableProps {
  indicators: Indicator[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasFilters: boolean;
}

export function IndicatorTable({
  indicators,
  loading,
  selectedId,
  onSelect,
  hasFilters,
}: IndicatorTableProps) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Indicator</th>
            <th className={styles.th}>Type</th>
            <th className={styles.th}>Severity</th>
            <th className={styles.th}>Source</th>
            <th className={styles.th}>Confidence</th>
            <th className={styles.th}>Last Seen</th>
            <th className={styles.th}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonRow key={i} />)
          ) : indicators.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            indicators.map((indicator) => (
              <IndicatorRow
                key={indicator.id}
                indicator={indicator}
                isSelected={indicator.id === selectedId}
                onSelect={onSelect}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
