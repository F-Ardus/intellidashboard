import { useRef } from 'react';
import type { Stats } from '../../../types/stats';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useT } from '../../../contexts/LocaleContext';
import styles from './StatsModal.module.scss';

const SEVERITY_SEGMENT_KEYS = ['critical', 'high', 'medium', 'low'] as const;
const TYPE_ROW_KEYS = ['ip', 'domain', 'hash', 'url'] as const;

function pct(value: number, total: number) {
  return total > 0 ? `${Math.round((value / total) * 100)}%` : '—';
}

interface DonutChartProps {
  stats: Stats;
  labels: Record<string, string>;
  intlLocale: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--severity-critical)',
  high:     'var(--severity-high)',
  medium:   'var(--severity-medium)',
  low:      'var(--severity-low)',
};

function DonutChart({ stats, labels, intlLocale }: DonutChartProps) {
  const r = 50;
  const cx = 60;
  const cy = 60;
  const C = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className={styles.donutWrapper}>
      <div className={styles.donutChart}>
        <svg viewBox="0 0 120 120">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="16" />
          {SEVERITY_SEGMENT_KEYS.map((key) => {
            const value = stats[key];
            if (value === 0) return null;
            const dash = (value / stats.total) * C;
            const segOffset = offset;
            offset += dash;
            return (
              <circle
                key={key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={SEVERITY_COLORS[key]}
                strokeWidth="16"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-segOffset}
              />
            );
          })}
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.donutValue}>{stats.total.toLocaleString(intlLocale)}</span>
          <span className={styles.donutLabel}>{labels.total}</span>
        </div>
      </div>
      <div className={styles.legend}>
        {SEVERITY_SEGMENT_KEYS.map((key) => (
          <div key={key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: SEVERITY_COLORS[key] }} />
            <span className={styles.legendName}>{labels[key]}</span>
            <span className={styles.legendCount}>{stats[key].toLocaleString(intlLocale)}</span>
            <span className={styles.legendPct}>{pct(stats[key], stats.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatsModalProps {
  stats: Stats;
  onClose: () => void;
}

export function StatsModal({ stats, onClose }: StatsModalProps) {
  const { t, intlLocale } = useT();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  const severityLabels = {
    total: t.statsModal.total,
    critical: t.statsModal.critical,
    high: t.statsModal.high,
    medium: t.statsModal.medium,
    low: t.statsModal.low,
  };

  const typeLabels: Record<string, string> = {
    ip: t.statsModal.ip,
    domain: t.statsModal.domain,
    hash: t.statsModal.hash,
    url: t.statsModal.url,
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="stats-modal-title">{t.statsModal.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            <h4>{t.statsModal.severityDistribution}</h4>
            <DonutChart stats={stats} labels={severityLabels} intlLocale={intlLocale} />
          </div>
          <div className={styles.section}>
            <h4>{t.statsModal.byType}</h4>
            <table className={styles.kpiTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>{t.statsModal.typeCount}</th>
                  <th>{t.statsModal.typePct}</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_ROW_KEYS.map((key) => (
                  <tr key={key}>
                    <td>{typeLabels[key]}</td>
                    <td>{stats.byType[key].toLocaleString(intlLocale)}</td>
                    <td>{pct(stats.byType[key], stats.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
