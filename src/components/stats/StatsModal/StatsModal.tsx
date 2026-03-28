import type { Stats } from '../../../types/stats';
import styles from './StatsModal.module.scss';

const SEVERITY_SEGMENTS = [
  { key: 'critical', label: 'Critical', color: 'var(--severity-critical)' },
  { key: 'high',     label: 'High',     color: 'var(--severity-high)' },
  { key: 'medium',   label: 'Medium',   color: 'var(--severity-medium)' },
  { key: 'low',      label: 'Low',      color: 'var(--severity-low)' },
] as const;

const TYPE_ROWS = [
  { key: 'ip',     label: 'IP Address' },
  { key: 'domain', label: 'Domain' },
  { key: 'hash',   label: 'File Hash' },
  { key: 'url',    label: 'URL' },
] as const;

function pct(value: number, total: number) {
  return total > 0 ? `${Math.round((value / total) * 100)}%` : '—';
}

interface DonutChartProps {
  stats: Stats;
}

function DonutChart({ stats }: DonutChartProps) {
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
          {SEVERITY_SEGMENTS.map((seg) => {
            const value = stats[seg.key];
            if (value === 0) return null;
            const dash = (value / stats.total) * C;
            const segOffset = offset;
            offset += dash;
            return (
              <circle
                key={seg.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-segOffset}
              />
            );
          })}
        </svg>
        <div className={styles.donutCenter}>
          <span className={styles.donutValue}>{stats.total.toLocaleString('en-US')}</span>
          <span className={styles.donutLabel}>Total</span>
        </div>
      </div>
      <div className={styles.legend}>
        {SEVERITY_SEGMENTS.map((seg) => (
          <div key={seg.key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: seg.color }} />
            <span className={styles.legendName}>{seg.label}</span>
            <span className={styles.legendCount}>{stats[seg.key].toLocaleString('en-US')}</span>
            <span className={styles.legendPct}>{pct(stats[seg.key], stats.total)}</span>
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
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Threat Intelligence Overview</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            <h4>Severity Distribution</h4>
            <DonutChart stats={stats} />
          </div>
          <div className={styles.section}>
            <h4>Indicators by Type</h4>
            <table className={styles.kpiTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Count</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td>{row.label}</td>
                    <td>{stats.byType[row.key].toLocaleString('en-US')}</td>
                    <td>{pct(stats.byType[row.key], stats.total)}</td>
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
