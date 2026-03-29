import { Button } from '../../common/Button/Button';
import { LiveFeedBadge } from '../LiveFeedBadge/LiveFeedBadge';
import { useT } from '../../../contexts/LocaleContext';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  onExport?: () => void;
  onAddIndicator?: () => void;
  onShowShortcuts?: () => void;
  secondsLeft?: number;
}

export function PageHeader({ onExport, onAddIndicator, onShowShortcuts, secondsLeft = 30 }: PageHeaderProps) {
  const { t } = useT();
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.titleRow}>
          <h1>{t.header.title}</h1>
          <span className={styles.shortcutsWrap}>
            <button
              className={styles.shortcutsBtn}
              onClick={onShowShortcuts}
              aria-label="Keyboard shortcuts"
              aria-keyshortcuts="?"
            >
              ?
            </button>
          </span>
        </div>
        <p>{t.header.subtitle}</p>
      </div>
      <div className={styles.actions}>
        <span className={styles.liveFeed} data-tour="refresh">
          <LiveFeedBadge secondsLeft={secondsLeft} />
        </span>
        <Button variant="secondary" size="sm" onClick={onExport}>
          {t.header.export}
        </Button>
        <Button variant="primary" size="sm" onClick={onAddIndicator}>
          {t.header.addIndicator}
        </Button>
      </div>
    </header>
  );
}
