import { useEffect, useRef } from 'react';
import type { Indicator } from '../../../types/indicator';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './IndicatorTable.module.scss';
import { IndicatorRow } from '../IndicatorRow/IndicatorRow';
import { SkeletonRow } from '../SkeletonRow/SkeletonRow';

const SKELETON_COUNT = 5;

interface IndicatorTableProps {
  indicators: Indicator[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasFilters: boolean;
  checkedIds: Set<string>;
  onToggleCheck: (id: string) => void;
  onToggleAll: () => void;
}

export function IndicatorTable({
  indicators,
  loading,
  selectedId,
  onSelect,
  hasFilters,
  checkedIds,
  onToggleCheck,
  onToggleAll,
}: IndicatorTableProps) {
  const allChecked = indicators.length > 0 && indicators.every((i) => checkedIds.has(i.id));
  const someChecked = !allChecked && indicators.some((i) => checkedIds.has(i.id));
  const headerCheckRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.thCheck}`}>
              <input
                type="checkbox"
                ref={headerCheckRef}
                checked={allChecked}
                onChange={onToggleAll}
                aria-label="Select all"
              />
            </th>
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
                isChecked={checkedIds.has(indicator.id)}
                onToggleCheck={onToggleCheck}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
