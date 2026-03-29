import { useEffect, useRef } from 'react';
import type { SortField, SortState } from '../../../hooks/useSort';
import type { Indicator } from '../../../types/indicator';
import type { RowDensity } from '../../../hooks/useTablePrefs';
import { useT } from '../../../contexts/LocaleContext';
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
  density: RowDensity;
  expandTags: boolean;
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
    <th
      className={`${styles.th} ${styles.thSortable}${className ? ` ${className}` : ''}`}
      scope="col"
      aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none'}
    >
      <button
        className={`${styles.sortBtn} ${active ? styles.sortActive : ''}`}
        onClick={() => onSort(field)}
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
  density,
  expandTags,
}: IndicatorTableProps) {
  const { t } = useT();
  const allChecked = indicators.length > 0 && indicators.every((i) => checkedIds.has(i.id));
  const someChecked = !allChecked && indicators.some((i) => checkedIds.has(i.id));
  const headerCheckRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someChecked;
    }
  }, [someChecked]);

  const densityClass = density === 'compact' ? styles.densityCompact : density === 'comfortable' ? styles.densityComfortable : styles.densityNormal;

  return (
    <div className={styles.container} data-tour="table">
    <div className={styles.scrollArea}>
      <table className={`${styles.table} ${densityClass}`}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.thCheck}`} scope="col" aria-label="Row selection">
              <input
                type="checkbox"
                ref={headerCheckRef}
                checked={allChecked}
                onChange={onToggleAll}
                aria-label="Select all"
              />
            </th>
            <SortableTh field="value" sort={sort} onSort={onSort}>{t.table.indicator}</SortableTh>
            <SortableTh field="type" sort={sort} onSort={onSort}>{t.table.type}</SortableTh>
            <SortableTh field="severity" sort={sort} onSort={onSort}>{t.table.severity}</SortableTh>
            <SortableTh field="source" sort={sort} onSort={onSort}>{t.table.source}</SortableTh>
            <SortableTh field="confidence" sort={sort} onSort={onSort}>{t.table.confidence}</SortableTh>
            <SortableTh field="lastSeen" sort={sort} onSort={onSort}>{t.table.lastSeen}</SortableTh>
            <th className={styles.th} scope="col">{t.table.tags}</th>
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
                expandTags={expandTags}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
