import { useState } from 'react';
import type { Indicator } from '../../../types/indicator';
import { formatRelativeTime } from '../../../utils/time';
import { ConfidenceBar } from '../ConfidenceBar/ConfidenceBar';
import styles from './IndicatorRow.module.scss';
import { SeverityBadge } from '../SeverityBadge/SeverityBadge';
import { TagPill } from '../TagPill/TagPill';
import { TypeIcon } from '../TypeIcon/TypeIcon';

interface IndicatorRowProps {
  indicator: Indicator;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isChecked: boolean;
  onToggleCheck: (id: string, indicator: Indicator) => void;
  expandTags: boolean;
}

export function IndicatorRow({
  indicator,
  isSelected,
  onSelect,
  isChecked,
  onToggleCheck,
  expandTags,
}: IndicatorRowProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(indicator.value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const visibleTags = expandTags ? indicator.tags : indicator.tags.slice(0, 1);
  const hiddenCount = expandTags ? 0 : indicator.tags.length - 1;

  return (
    <tr
      className={`${styles.row}${isSelected ? ` ${styles.selected}` : ''}`}
      onClick={() => onSelect(indicator.id)}
    >
      <td className={`${styles.cell} ${styles.checkCell}`}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onToggleCheck(indicator.id, indicator)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${indicator.value}`}
        />
      </td>
      <td className={styles.cell}>
        <div className={styles.indicatorCell}>
          <span className={styles.indicator}>{indicator.value}</span>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : `Copy ${indicator.value}`}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="5" y="5" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 11V3a1 1 0 0 1 1-1h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </td>
      <td className={styles.cell}>
        <span className={styles.typeCell}>
          <TypeIcon type={indicator.type} size={14} />
          {indicator.type}
        </span>
      </td>
      <td className={styles.cell}>
        <SeverityBadge severity={indicator.severity} />
      </td>
      <td className={styles.cell}>
        <span className={styles.source}>{indicator.source}</span>
      </td>
      <td className={styles.cell}>
        <ConfidenceBar confidence={indicator.confidence} severity={indicator.severity} />
      </td>
      <td className={styles.cell}>
        <span className={styles.time}>{formatRelativeTime(indicator.lastSeen)}</span>
      </td>
      <td className={styles.cell}>
        <div className={styles.tags}>
          {visibleTags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {hiddenCount > 0 && (
            <span className={styles.tagsMore}>+{hiddenCount}</span>
          )}
        </div>
      </td>
    </tr>
  );
}
