import { Button } from '../common/Button';
import { LiveFeedBadge } from './LiveFeedBadge';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  onExport?: () => void;
  onAddIndicator?: () => void;
}

export function PageHeader({ onExport, onAddIndicator }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Threat Intelligence Dashboard</h1>
        <p>Real-time threat indicators and campaign intelligence</p>
      </div>
      <div className={styles.actions}>
        <span className={styles.liveFeed}>
          <LiveFeedBadge />
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
