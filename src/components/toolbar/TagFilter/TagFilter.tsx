import { useEffect, useRef, useState } from 'react';
import styles from './TagFilter.module.scss';

function colorIndex(tag: string): number {
  let sum = 0;
  for (let i = 0; i < tag.length; i++) sum += tag.charCodeAt(i);
  return sum % 5;
}

const COLOR_CLASSES = ['red', 'blue', 'purple', 'teal', 'gray'] as const;

function tagColor(tag: string) {
  return COLOR_CLASSES[colorIndex(tag)] ?? 'gray';
}

interface TagFilterProps {
  selected: string[];
  availableTags: string[];
  onChange: (tags: string[]) => void;
}

export function TagFilter({ selected, availableTags, onChange }: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function toggle(tag: string) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag],
    );
  }

  function remove(tag: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selected.filter((t) => t !== tag));
  }

  const hasSelection = selected.length > 0;

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${hasSelection ? styles.triggerActive : ''}`}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {hasSelection ? (
          <span className={styles.selectedPills}>
            {selected.map((tag) => (
              <span key={tag} className={`${styles.chip} ${styles[tagColor(tag)]}`}>
                {tag}
                <span className={styles.chipRemove} onClick={(e) => remove(tag, e)}>×</span>
              </span>
            ))}
          </span>
        ) : (
          <span className={styles.placeholder}>Tags</span>
        )}
        <span className={styles.caret}>▾</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownPills}>
            {availableTags.length === 0 && (
              <span className={styles.empty}>No more tags match the current selection</span>
            )}
            {availableTags.map((tag) => {
              const active = selected.includes(tag);
              const color = tagColor(tag);
              return (
                <button
                  key={tag}
                  className={`${styles.pill} ${styles[color]} ${active ? styles.pillActive : ''}`}
                  onClick={() => toggle(tag)}
                  type="button"
                  aria-pressed={active}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
