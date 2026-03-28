import type { Indicator } from '../../types/indicator';
import { formatRelativeTime } from '../../utils/time';
import { ConfidenceBar } from './ConfidenceBar';
import styles from './IndicatorRow.module.scss';
import { SeverityBadge } from './SeverityBadge';
import { TagPill } from './TagPill';
import { TypeIcon } from './TypeIcon';

interface IndicatorRowProps {
  indicator: Indicator;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function IndicatorRow({ indicator, isSelected, onSelect }: IndicatorRowProps) {
  return (
    <tr
      className={`${styles.row}${isSelected ? ` ${styles.selected}` : ''}`}
      onClick={() => onSelect(indicator.id)}
    >
      <td className={styles.cell}>
        <span className={styles.indicator}>{indicator.value}</span>
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
          {indicator.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </td>
    </tr>
  );
}
