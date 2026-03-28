import { useEffect, useState } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), 2700);
    return () => clearTimeout(fadeTimer);
  }, []);

  function handleAnimationEnd() {
    if (leaving) onDismiss();
  }

  return (
    <div
      className={`${styles.toast} ${leaving ? styles.leaving : ''}`}
      onAnimationEnd={handleAnimationEnd}
      role="status"
      aria-live="polite"
    >
      <span className={styles.icon}>✓</span>
      {message}
      <button className={styles.close} onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
