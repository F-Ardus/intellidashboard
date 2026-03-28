import { buildPages } from './buildPages';
import styles from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPages(page, totalPages);

  return (
    <div className={styles.pagination}>
      <span className={styles.info}>
        Showing {from.toLocaleString('en-US')}–{to.toLocaleString('en-US')} of {total.toLocaleString('en-US')} indicators
      </span>

      <div className={styles.controls}>
        <button
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
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
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
