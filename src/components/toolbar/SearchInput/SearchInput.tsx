import { useEffect, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import styles from './SearchInput.module.scss';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounced = useDebounce(localValue, 300);

  // Sync debounced value up to parent
  useEffect(() => {
    onChange(debounced);
  }, [debounced, onChange]);

  // Sync down if parent resets filters
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={styles.wrapper}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className={styles.input}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
