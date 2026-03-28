import { Button } from '../../common/Button/Button';
import styles from './SelectionBar.module.scss';

interface SelectionBarProps {
  count: number;
  total: number;
  allOnPageSelected: boolean;
  allPagesSelected: boolean;
  onExport: () => void;
  onClear: () => void;
  onSelectAllPages: () => void;
}

export function SelectionBar({
  count,
  total,
  allOnPageSelected,
  allPagesSelected,
  onExport,
  onClear,
  onSelectAllPages,
}: SelectionBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.info}>
          {allPagesSelected
            ? `All ${total.toLocaleString('en-US')} indicators selected`
            : `${count} indicator${count !== 1 ? 's' : ''} selected`}
        </span>

        {allOnPageSelected && !allPagesSelected && count < total && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.pageNote}>
              You are only selecting indicators on this page.{' '}
              <button className={styles.selectAllBtn} onClick={onSelectAllPages}>
                Select all {total.toLocaleString('en-US')} instead?
              </button>
            </span>
          </>
        )}

        {allPagesSelected && (
          <>
            <span className={styles.separator}>·</span>
            <button className={styles.selectAllBtn} onClick={onClear}>
              Clear full selection
            </button>
          </>
        )}
      </div>

      <div className={styles.actions}>
        {!allPagesSelected && (
          <Button variant="ghost" size="sm" onClick={onClear}>Clear selection</Button>
        )}
        <Button variant="primary" size="sm" onClick={onExport}>Export CSV</Button>
      </div>
    </div>
  );
}
