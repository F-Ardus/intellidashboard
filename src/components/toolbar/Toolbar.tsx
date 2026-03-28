import type { IndicatorType, Severity } from '../../types/indicator';
import { Button } from '../common/Button';
import { FilterSelect } from './FilterSelect';
import { SearchInput } from './SearchInput';
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

const SOURCE_OPTIONS = [
  'AbuseIPDB', 'OTX AlienVault', 'VirusTotal', 'Emerging Threats', 'MalwareBazaar',
  'PhishTank', 'Spamhaus', 'ThreatFox', 'URLhaus', 'CIRCL', 'Shodan',
  'GreyNoise', 'BinaryEdge', 'Censys', 'Silent Push', 'DomainTools',
].map((s) => ({ value: s, label: s }));

interface ToolbarProps {
  search: string;
  severity: Severity | undefined;
  type: IndicatorType | undefined;
  source: string | undefined;
  onSearchChange: (v: string) => void;
  onSeverityChange: (v: Severity | undefined) => void;
  onTypeChange: (v: IndicatorType | undefined) => void;
  onSourceChange: (v: string | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function Toolbar({
  search,
  severity,
  type,
  source,
  onSearchChange,
  onSeverityChange,
  onTypeChange,
  onSourceChange,
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
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
