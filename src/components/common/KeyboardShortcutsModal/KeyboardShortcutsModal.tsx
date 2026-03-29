import { useRef } from 'react';
import { useFocusTrap } from '../../../hooks/useFocusTrap';
import styles from './KeyboardShortcutsModal.module.scss';

const SHORTCUTS = [
  { key: '/',       action: 'Focus search' },
  { key: '↑ / ↓',  action: 'Navigate table rows' },
  { key: 'Enter',   action: 'Open detail panel' },
  { key: 'Space',   action: 'Toggle row checkbox' },
  { key: '← / →',  action: 'Previous / next page' },
  { key: 'Esc',     action: 'Close panel or modal' },
  { key: '?',       action: 'Show this help' },
];

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="shortcuts-title" className={styles.title}>Keyboard Shortcuts</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <ul className={styles.list} role="list">
          {SHORTCUTS.map(({ key, action }) => (
            <li key={key} className={styles.item}>
              <kbd className={styles.kbd}>{key}</kbd>
              <span className={styles.action}>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
