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
}

export function IndicatorRow({
  indicator,
  isSelected,
  onSelect,
  isChecked,
  onToggleCheck,
}: IndicatorRowProps) {
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
          {indicator.tags.slice(0, 1).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {indicator.tags.length > 1 && (
            <span className={styles.tagsMore}>+{indicator.tags.length - 1}</span>
          )}
        </div>
      </td>
    </tr>
  );
}
