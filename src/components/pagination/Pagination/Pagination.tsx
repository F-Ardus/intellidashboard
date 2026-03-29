import { buildPages } from './buildPages';
import { useT } from '../../../contexts/LocaleContext';
import { fmt } from '../../../i18n';
import styles from './Pagination.module.scss';

const LIMIT_OPTIONS = [10, 20, 50, 100];

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }: PaginationProps) {
  const { t, intlLocale } = useT();

  if (totalPages <= 1 && total <= (LIMIT_OPTIONS[0] ?? 10)) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPages(page, totalPages);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        {fmt(t.pagination.showing, {
          from: from.toLocaleString(intlLocale),
          to: to.toLocaleString(intlLocale),
          total: total.toLocaleString(intlLocale),
        })}
      </span>

      <div className={styles.limitSelect}>
        <label className={styles.limitLabel} htmlFor="rows-per-page">{t.pagination.rows}</label>
        <select
          id="rows-per-page"
          className={styles.limitDropdown}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {LIMIT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.btn} ${styles.arrow}`}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label={t.pagination.previousPage}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <button key={`ellipsis-${i}`} className={`${styles.btn} ${styles.ellipsis}`} disabled>
              …
            </button>
          ) : (
            <button
              key={p}
              className={`${styles.btn}${p === page ? ` ${styles.active}` : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`${styles.btn} ${styles.arrow}`}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label={t.pagination.nextPage}
        >
          ›
        </button>
      </div>
    </div>
  );
}
