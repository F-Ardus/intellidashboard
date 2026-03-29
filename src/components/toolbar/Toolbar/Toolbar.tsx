import { useEffect, useRef, useState } from 'react';
import type { IndicatorType, Severity } from '../../../types/indicator';
import type { FilterPreset } from '../../../hooks/useFilterPresets';
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
  presets: FilterPreset[];
  activePresetId: string | null;
  onSavePreset: (name: string) => void;
  onApplyPreset: (preset: FilterPreset) => void;
  onDeletePreset: (id: string) => void;
}

function PresetsDropdown({
  presets,
  activePresetId,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
}: Pick<ToolbarProps, 'presets' | 'activePresetId' | 'onSavePreset' | 'onApplyPreset' | 'onDeletePreset'>) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSave() {
    const name = saveName.trim();
    if (!name) return;
    onSavePreset(name);
    setSaveName('');
  }

  const activePreset = presets.find((p) => p.id === activePresetId) ?? null;

  return (
    <div ref={ref} className={styles.presetsWrap}>
      <button
        className={`${styles.presetsTrigger} ${open ? styles.presetsTriggerOpen : ''} ${activePreset ? styles.presetsTriggerActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* bookmark icon */}
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 2h10a1 1 0 0 1 1 1v11l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={activePreset ? 'currentColor' : 'none'}/>
        </svg>
        <span>{activePreset ? activePreset.name : t.toolbar.presets}</span>
        {!activePreset && presets.length > 0 && <span className={styles.presetsCount}>{presets.length}</span>}
        <span className={styles.presetsCaret}>▾</span>
      </button>

      {open && (
        <div className={styles.presetsPanel}>
          {presets.length > 0 ? (
            <ul className={styles.presetsList}>
              {presets.map((preset) => (
                <li key={preset.id} className={styles.presetsItem}>
                  <button
                    className={`${styles.presetsApply} ${preset.id === activePresetId ? styles.presetsApplyActive : ''}`}
                    onClick={() => { onApplyPreset(preset); setOpen(false); }}
                  >
                    {preset.id === activePresetId && (
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {preset.name}
                  </button>
                  <button
                    className={styles.presetsDelete}
                    onClick={() => onDeletePreset(preset.id)}
                    aria-label={t.toolbar.deletePreset}
                    title={t.toolbar.deletePreset}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 4h12M6 4V2h4v2M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.presetsEmpty}>{t.toolbar.noPresets}</p>
          )}
          <div className={styles.presetsSaveRow}>
            <input
              ref={inputRef}
              className={styles.presetsSaveInput}
              placeholder={t.toolbar.savePresetPlaceholder}
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              maxLength={60}
            />
            <button
              className={styles.presetsSaveBtn}
              disabled={!saveName.trim()}
              onClick={handleSave}
            >
              {t.toolbar.savePreset}
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
  presets,
  activePresetId,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
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

      <div className={styles.presetsSlot}>
        <PresetsDropdown
          presets={presets}
          activePresetId={activePresetId}
          onSavePreset={onSavePreset}
          onApplyPreset={onApplyPreset}
          onDeletePreset={onDeletePreset}
        />
      </div>
    </div>
  );
}
