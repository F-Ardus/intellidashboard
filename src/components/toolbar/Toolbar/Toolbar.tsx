import type { IndicatorType, Severity } from '../../../types/indicator';
import { SOURCE_OPTIONS } from '../../../constants/sources';
import { Button } from '../../common/Button/Button';
import { TagFilter } from '../TagFilter/TagFilter';
import { FilterSelect } from '../FilterSelect/FilterSelect';
import { SearchInput } from '../SearchInput/SearchInput';
import { useT } from '../../../contexts/LocaleContext';
import styles from './Toolbar.module.scss';

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
  const { t } = useT();

  const severityOptions = [
    { value: 'critical', label: t.toolbar.severity.critical },
    { value: 'high',     label: t.toolbar.severity.high },
    { value: 'medium',   label: t.toolbar.severity.medium },
    { value: 'low',      label: t.toolbar.severity.low },
  ];

  const typeOptions = [
    { value: 'ip',     label: t.toolbar.type.ip },
    { value: 'domain', label: t.toolbar.type.domain },
    { value: 'hash',   label: t.toolbar.type.hash },
    { value: 'url',    label: t.toolbar.type.url },
  ];

  return (
    <div className={styles.toolbar}>
      <SearchInput value={search} onChange={onSearchChange} placeholder={t.toolbar.searchPlaceholder} />

      <div className={styles.divider} />

      <div className={styles.group}>
        <FilterSelect
          value={severity ?? ''}
          onChange={(v) => onSeverityChange(v as Severity || undefined)}
          options={severityOptions}
          placeholder={t.toolbar.allSeverities}
        />
        <FilterSelect
          value={type ?? ''}
          onChange={(v) => onTypeChange(v as IndicatorType || undefined)}
          options={typeOptions}
          placeholder={t.toolbar.allTypes}
        />
        <FilterSelect
          value={source ?? ''}
          onChange={(v) => onSourceChange(v || undefined)}
          options={SOURCE_OPTIONS}
          placeholder={t.toolbar.allSources}
        />
        <TagFilter selected={tags} availableTags={availableTags} onChange={onTagsChange} />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          {t.toolbar.clearFilters}
        </Button>
      )}
    </div>
  );
}
