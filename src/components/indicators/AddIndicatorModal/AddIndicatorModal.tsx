import { useState } from 'react';
import { SOURCES } from '../../../constants/sources';
import { ALL_TAGS } from '../../../hooks/useAvailableTags';
import type { Indicator, IndicatorType, Severity } from '../../../types/indicator';
import { Button } from '../../common/Button/Button';
import styles from './AddIndicatorModal.module.scss';

const TYPE_OPTIONS: { value: IndicatorType; label: string }[] = [
  { value: 'ip',     label: 'IP Address' },
  { value: 'domain', label: 'Domain' },
  { value: 'hash',   label: 'File Hash' },
  { value: 'url',    label: 'URL' },
];

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'medium',   label: 'Medium' },
  { value: 'low',      label: 'Low' },
];

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
    if (!form.value.trim()) next.value = 'Value is required';
    if (!form.type) next.type = 'Type is required';
    if (!form.severity) next.severity = 'Severity is required';
    if (!form.source) next.source = 'Source is required';
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Indicator</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit} noValidate>
          {/* Value */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-value">Value <span className={styles.required}>*</span></label>
            <input
              id="ind-value"
              className={`${styles.input} ${errors.value ? styles.inputError : ''}`}
              type="text"
              placeholder="e.g. 192.168.1.1, evil.com, abc123..."
              value={form.value}
              onChange={(e) => set('value', e.target.value)}
              autoFocus
            />
            {errors.value && <span className={styles.error}>{errors.value}</span>}
          </div>

          {/* Type + Severity row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="ind-type">Type <span className={styles.required}>*</span></label>
              <select
                id="ind-type"
                className={`${styles.select} ${errors.type ? styles.inputError : ''}`}
                value={form.type}
                onChange={(e) => set('type', e.target.value as IndicatorType | '')}
              >
                <option value="">Select type…</option>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.type && <span className={styles.error}>{errors.type}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="ind-severity">Severity <span className={styles.required}>*</span></label>
              <select
                id="ind-severity"
                className={`${styles.select} ${errors.severity ? styles.inputError : ''}`}
                value={form.severity}
                onChange={(e) => set('severity', e.target.value as Severity | '')}
              >
                <option value="">Select severity…</option>
                {SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.severity && <span className={styles.error}>{errors.severity}</span>}
            </div>
          </div>

          {/* Source */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-source">Source <span className={styles.required}>*</span></label>
            <select
              id="ind-source"
              className={`${styles.select} ${errors.source ? styles.inputError : ''}`}
              value={form.source}
              onChange={(e) => set('source', e.target.value)}
            >
              <option value="">Select source…</option>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.source && <span className={styles.error}>{errors.source}</span>}
          </div>

          {/* Confidence */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ind-confidence">
              Confidence
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
            <label className={styles.label}>Tags <span className={styles.optional}>(optional)</span></label>
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
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Add Indicator</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
