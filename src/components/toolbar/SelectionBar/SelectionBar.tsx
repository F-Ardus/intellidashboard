import { Button } from '../../common/Button/Button';
import { useT } from '../../../contexts/LocaleContext';
import { fmt } from '../../../i18n';
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
  const { t, intlLocale } = useT();
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.info}>
          {allPagesSelected
            ? fmt(t.selection.allSelected, { total: total.toLocaleString(intlLocale) })
            : fmt(count !== 1 ? t.selection.countSelectedPlural : t.selection.countSelected, { count: count.toLocaleString(intlLocale) })}
        </span>

        {allOnPageSelected && !allPagesSelected && count < total && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.pageNote}>
              {t.selection.pageOnlyNote}{' '}
              <button className={styles.selectAllBtn} onClick={onSelectAllPages}>
                {fmt(t.selection.selectAllInstead, { total: total.toLocaleString(intlLocale) })}
              </button>
            </span>
          </>
        )}

        {allPagesSelected && (
          <>
            <span className={styles.separator}>·</span>
            <button className={styles.selectAllBtn} onClick={onClear}>
              {t.selection.clearFullSelection}
            </button>
          </>
        )}
      </div>

      <div className={styles.actions}>
        {!allPagesSelected && (
          <Button variant="ghost" size="sm" onClick={onClear}>{t.selection.clearSelection}</Button>
        )}
        <Button variant="primary" size="sm" onClick={onExport}>{t.selection.exportCsv}</Button>
      </div>
    </div>
  );
}
