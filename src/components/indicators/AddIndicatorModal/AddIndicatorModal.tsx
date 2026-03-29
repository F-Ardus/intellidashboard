import { useRef, useState } from 'react';
import { SOURCES } from '../../../constants/sources';
import { ALL_TAGS } from '../../../hooks/useAvailableTags';
import type { Indicator, IndicatorType, Severity } from '../../../types/indicator';
import { Button } from '../../common/Button/Button';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import { useT } from '../../../contexts/LocaleContext';
import styles from './AddIndicatorModal.module.scss';

function colorIndex(tag: string): number {
  let sum = 0;
  for (let i = 0; i < tag.length; i++) sum += tag.charCodeAt(i);
  return sum % 5;
}
const COLOR_CLASSES = ['red', 'blue', 'purple', 'teal', 'gray'] as const;

interface FormState {
  value: string;
  type: IndicatorType | '';
  severity: Severity | '';
  source: string;
  confidence: number;
  tags: string[];
}

interface Errors {
  value?: string;
  type?: string;
  severity?: string;
  source?: string;
}

interface AddIndicatorModalProps {
  onClose: () => void;
  onAdd: (indicator: Indicator) => void;
}

export function AddIndicatorModal({ onClose, onAdd }: AddIndicatorModalProps) {
  const { t } = useT();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);
  const [form, setForm] = useState<FormState>({
    value: '',
    type: '',
    severity: '',
    source: '',
    confidence: 75,
    tags: [],
  });
  const [errors, setErrors] = useState<Errors>({});

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleTag(tag: string) {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter((t) => t !== tag)
      : [...form.tags, tag],
    );
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!form.value.trim()) next.value = t.addIndicator.valueRequired;
    if (!form.type) next.type = t.addIndicator.typeRequired;
    if (!form.severity) next.severity = t.addIndicator.severityRequired;
    if (!form.source) next.source = t.addIndicator.sourceRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const indicator: Indicator = {
      id: `local-${Date.now()}`,
      value: form.value.trim(),
      type: form.type as IndicatorType,
      severity: form.severity as Severity,
      source: form.source.trim(),
      confidence: form.confidence,
      tags: form.tags,
      firstSeen: now,
      lastSeen: now,
    };

    onAdd(indicator);
    onClose();
  }

  const typeOptions: { value: IndicatorType; label: string }[] = [
    { value: 'ip',     label: t.toolbar.type.ip },
    { value: 'domain', label: t.toolbar.type.domain },
    { value: 'hash',   label: t.toolbar.type.hash },
    { value: 'url',    label: t.toolbar.type.url },
  ];

  const severityOptions: { value: Severity; label: string }[] = [
    { value: 'critical', label: t.toolbar.severity.critical },
    { value: 'high',     label: t.toolbar.severity.high },
    { value: 'medium',   label: t.toolbar.severity.medium },
    { value: 'low',      label: t.toolbar.severity.low },
  ];

  return (
    <div className={styles.overlay} onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div ref={modalRef} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t.addIndicator.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          {/* Value */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-value">
              {t.addIndicator.valueLabelText} <span className={styles.required}>*</span>
            </label>
            <input
              id="ind-value"
              className={`${styles.input} ${errors.value ? styles.inputError : ''}`}
              type="text"
              placeholder={t.addIndicator.valuePlaceholder}
              value={form.value}
              onChange={(e) => set('value', e.target.value)}
              autoFocus
            />
            {errors.value && <span className={styles.error}>{errors.value}</span>}
          </div>

          {/* Type + Severity row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="ind-type">
                {t.addIndicator.typeLabel} <span className={styles.required}>*</span>
              </label>
              <select
                id="ind-type"
                className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
                value={form.type}
                onChange={(e) => set('type', e.target.value as IndicatorType | '')}
              >
                <option value="">{t.addIndicator.selectType}</option>
                {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.type && <span className={styles.error}>{errors.type}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="ind-severity">
                {t.addIndicator.severityLabel} <span className={styles.required}>*</span>
              </label>
              <select
                id="ind-severity"
                className={`${styles.select} ${errors.severity ? styles.inputError : ''}`}
                value={form.severity}
                onChange={(e) => set('severity', e.target.value as Severity | '')}
              >
                <option value="">{t.addIndicator.selectSeverity}</option>
                {severityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.severity && <span className={styles.error}>{errors.severity}</span>}
            </div>
          </div>

          {/* Source */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-source">
              {t.addIndicator.sourceLabel} <span className={styles.required}>*</span>
            </label>
            <select
              id="ind-source"
              className={`${styles.select} ${errors.source ? styles.inputError : ''}`}
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
            >
              <option value="">{t.addIndicator.selectSource}</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.source && <span className={styles.error}>{errors.source}</span>}
          </div>

          {/* Confidence */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-confidence">
              {t.addIndicator.confidenceLabel}
              <span className={styles.confidenceValue}>{form.confidence}%</span>
            </label>
            <input
              id="ind-confidence"
              className={styles.slider}
              type="range"
              min={0}
              max={100}
              value={form.confidence}
              onChange={(e) => set('confidence', Number(e.target.value))}
            />
          </div>

          {/* Tags */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t.addIndicator.tagsLabel} <span className={styles.optional}>{t.addIndicator.tagsOptional}</span>
            </label>
            <div className={styles.tagPills}>
              {ALL_TAGS.map((tag) => {
                const active = form.tags.includes(tag);
                const color = COLOR_CLASSES[colorIndex(tag)] ?? 'gray';
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${styles.tagPill} ${styles[color]} ${active ? styles.tagPillActive : ''}`}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.footer}>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>{t.addIndicator.cancel}</Button>
            <Button type="submit" variant="primary" size="sm">{t.addIndicator.submit}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
