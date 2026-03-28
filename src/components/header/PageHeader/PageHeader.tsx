import { Button } from '../../common/Button/Button';
import { LiveFeedBadge } from '../LiveFeedBadge/LiveFeedBadge';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  onExport?: () => void;
  onAddIndicator?: () => void;
  secondsLeft?: number;
}

export function PageHeader({ onExport, onAddIndicator, secondsLeft = 30 }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Threat Intelligence Dashboard</h1>
        <p>Real-time threat indicators and campaign intelligence</p>
      </div>
      <div className={styles.actions}>
        <span className={styles.liveFeed}>
          <LiveFeedBadge secondsLeft={secondsLeft} />
        </span>
        <Button variant="secondary" size="sm" onClick={onExport}>
          ⬇ Export
        </Button>
        <Button variant="primary" size="sm" onClick={onAddIndicator}>
          + Add Indicator
        </Button>
      </div>
    </header>
  );
}
