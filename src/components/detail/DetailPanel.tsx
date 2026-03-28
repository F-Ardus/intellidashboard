import { Button } from '../common/Button';
import { SeverityBadge } from '../table/SeverityBadge';
import { TagPill } from '../table/TagPill';
import { TypeIcon } from '../table/TypeIcon';
import { useIndicatorDetail } from '../../hooks/useIndicatorDetail';
import { formatAbsoluteTime, formatRelativeTime } from '../../utils/time';
import styles from './DetailPanel.module.scss';

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'var(--severity-critical)',
  high: 'var(--severity-high)',
  medium: 'var(--severity-medium)',
  low: 'var(--severity-low)',
};

interface DetailPanelProps {
  id: string;
  onClose: () => void;
}

export function DetailPanel({ id, onClose }: DetailPanelProps) {
  const { indicator, loading } = useIndicatorDetail(id);

  if (loading && !indicator) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>Indicator Details</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
      </div>
    );
  }

  if (!indicator) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Indicator Details</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">✕</button>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Value</div>
          <div className={styles.value}>{indicator.value}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Classification</div>
          <div className={styles.classification}>
            <SeverityBadge severity={indicator.severity} />
            <span className={styles.typeLabel}>
              <TypeIcon type={indicator.type} size={13} />
              {indicator.type}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Confidence Score</div>
          <div className={styles.confidenceWrapper}>
            <div className={styles.confidenceTrack}>
              <div
                className={styles.confidenceFill}
                style={{
                  width: `${indicator.confidence}%`,
                  background: SEVERITY_COLORS[indicator.severity],
                }}
              />
            </div>
            <span
              className={styles.confidenceValue}
              style={{ color: SEVERITY_COLORS[indicator.severity] }}
            >
              {indicator.confidence}%
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Tags</div>
          <div className={styles.tags}>
            {indicator.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Timeline</div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>First Seen</span>
            <span className={styles.rowValue}>{formatAbsoluteTime(indicator.firstSeen)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Last Seen</span>
            <span className={styles.rowValue}>{formatRelativeTime(indicator.lastSeen)}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Source</div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Provider</span>
            <span className={styles.rowValue}>{indicator.source}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button className={styles.actionBtn} variant="secondary" size="sm">Investigate</Button>
          <Button className={styles.actionBtn} variant="danger" size="sm">Block</Button>
        </div>
      </div>
    </div>
  );
}
