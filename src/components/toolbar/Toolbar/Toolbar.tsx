import type { IndicatorType, Severity } from '../../../types/indicator';
import { SOURCE_OPTIONS } from '../../../constants/sources';
import { Button } from '../../common/Button/Button';
import { TagFilter } from '../TagFilter/TagFilter';
import { FilterSelect } from '../FilterSelect/FilterSelect';
import { SearchInput } from '../SearchInput/SearchInput';
import styles from './Toolbar.module.scss';

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const TYPE_OPTIONS = [
  { value: 'ip', label: 'IP Address' },
  { value: 'domain', label: 'Domain' },
  { value: 'hash', label: 'File Hash' },
  { value: 'url', label: 'URL' },
];

interface ToolbarProps {
  search: string;
  severity: Severity | undefined;
  type: IndicatorType | undefined;
  source: string | undefined;
  tags: string[];
  availableTags: string[];
  onSearchChange: (v: string) => void;
  onSeverityChange: (v: Severity | undefined) => void;
  onTypeChange: (v: IndicatorType | undefined) => void;
  onSourceChange: (v: string | undefined) => void;
  onTagsChange: (v: string[]) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function Toolbar({
  search,
  severity,
  type,
  source,
  tags,
  availableTags,
  onSearchChange,
  onSeverityChange,
  onTypeChange,
  onSourceChange,
  onTagsChange,
  onClear,
  hasActiveFilters,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <SearchInput value={search} onChange={onSearchChange} />

      <div className={styles.divider} />

      <div className={styles.group}>
        <FilterSelect
          value={severity ?? ''}
          onChange={(v) => onSeverityChange(v as Severity || undefined)}
          options={SEVERITY_OPTIONS}
          placeholder="All Severities"
        />
        <FilterSelect
          value={type ?? ''}
          onChange={(v) => onTypeChange(v as IndicatorType || undefined)}
          options={TYPE_OPTIONS}
          placeholder="All Types"
        />
        <FilterSelect
          value={source ?? ''}
          onChange={(v) => onSourceChange(v || undefined)}
          options={SOURCE_OPTIONS}
          placeholder="All Sources"
        />
        <TagFilter selected={tags} availableTags={availableTags} onChange={onTagsChange} />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
