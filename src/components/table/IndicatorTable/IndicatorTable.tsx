import { useEffect, useRef } from 'react';
import type { SortField, SortState } from '../../../hooks/useSort';
import type { Indicator } from '../../../types/indicator';
import { EmptyState } from '../EmptyState/EmptyState';
import { IndicatorRow } from '../IndicatorRow/IndicatorRow';
import { SkeletonRow } from '../SkeletonRow/SkeletonRow';
import styles from './IndicatorTable.module.scss';

const SKELETON_COUNT = 5;

interface IndicatorTableProps {
  indicators: Indicator[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hasFilters: boolean;
  checkedIds: Set<string>;
  onToggleCheck: (id: string, indicator: Indicator) => void;
  onToggleAll: () => void;
  sort: SortState;
  onSort: (field: SortField) => void;
}

interface SortableThProps {
  field: SortField;
  sort: SortState;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}

function SortableTh({ field, sort, onSort, children, className }: SortableThProps) {
  const active = sort.field === field;
  const dir = active ? sort.dir : null;

  return (
    <th className={`${styles.th} ${styles.thSortable}${className ? ` ${className}` : ''}`}>
      <button
        className={`${styles.sortBtn} ${active ? styles.sortActive : ''}`}
        onClick={() => onSort(field)}
        aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
      >
        {children}
        <span className={`${styles.caret} ${active ? styles.caretActive : ''}`}>
          {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
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
  sort,
  onSort,
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
            <SortableTh field="value" sort={sort} onSort={onSort} className={styles.thIndicator}>Indicator</SortableTh>
            <SortableTh field="type" sort={sort} onSort={onSort}>Type</SortableTh>
            <SortableTh field="severity" sort={sort} onSort={onSort}>Severity</SortableTh>
            <SortableTh field="source" sort={sort} onSort={onSort}>Source</SortableTh>
            <SortableTh field="confidence" sort={sort} onSort={onSort}>Confidence</SortableTh>
            <SortableTh field="lastSeen" sort={sort} onSort={onSort}>Last Seen</SortableTh>
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
