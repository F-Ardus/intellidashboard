import { Button } from '../../common/Button/Button';
import { LiveFeedBadge } from '../LiveFeedBadge/LiveFeedBadge';
import { useT } from '../../../contexts/LocaleContext';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  onExport?: () => void;
  onAddIndicator?: () => void;
  secondsLeft?: number;
}

export function PageHeader({ onExport, onAddIndicator, secondsLeft = 30 }: PageHeaderProps) {
  const { t } = useT();
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>{t.header.title}</h1>
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
