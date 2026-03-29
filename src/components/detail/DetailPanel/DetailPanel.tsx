import { Button } from '../../common/Button/Button';
import { SeverityBadge } from '../../table/SeverityBadge/SeverityBadge';
import { TagPill } from '../../table/TagPill/TagPill';
import { TypeIcon } from '../../table/TypeIcon/TypeIcon';
import { useIndicatorDetail } from '../../../hooks/useIndicatorDetail';
import { useT } from '../../../contexts/LocaleContext';
import { formatAbsoluteTime, formatRelativeTime } from '../../../utils/time';
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
  const { t } = useT();

  if (loading && !indicator) {
    return (
      <aside className={styles.panel} role="complementary" aria-label={t.detail.title}>
        <div className={styles.header}>
          <span className={styles.title}>{t.detail.title}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">✕</button>
        </div>
      </aside>
    );
  }

  if (!indicator) return null;

  return (
    <aside className={styles.panel} role="complementary" aria-label={t.detail.title}>
      <div className={styles.header}>
        <span className={styles.title}>{t.detail.title}</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">✕</button>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.detail.value}</div>
          <div className={styles.value}>{indicator.value}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.detail.classification}</div>
          <div className={styles.classification}>
            <SeverityBadge severity={indicator.severity} />
            <span className={styles.typeLabel}>
              <TypeIcon type={indicator.type} size={13} />
              {indicator.type}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.detail.confidenceScore}</div>
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
          <div className={styles.sectionLabel}>{t.detail.tags}</div>
          <div className={styles.tags}>
            {indicator.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.detail.timeline}</div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t.detail.firstSeen}</span>
            <span className={styles.rowValue}>{formatAbsoluteTime(indicator.firstSeen)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t.detail.lastSeen}</span>
            <span className={styles.rowValue}>{formatRelativeTime(indicator.lastSeen)}</span>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t.detail.source}</div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{t.detail.provider}</span>
            <span className={styles.rowValue}>{indicator.source}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            className={styles.actionBtn}
            variant="secondary"
            size="sm"
            onClick={() => window.open(`https://www.virustotal.com/gui/search/${encodeURIComponent(indicator.value)}`, '_blank', 'noopener,noreferrer')}
          >
            {t.detail.investigate}
          </Button>
          <Button
            className={styles.actionBtn}
            variant="danger"
            size="sm"
            disabled
            title={t.detail.blockTooltip}
          >
            {t.detail.block}
          </Button>
        </div>
      </div>
    </aside>
  );
}
