import { useT } from '../../../contexts/LocaleContext';
import styles from './LiveFeedBadge.module.scss';

interface LiveFeedBadgeProps {
  secondsLeft: number;
}

export function LiveFeedBadge({ secondsLeft }: LiveFeedBadgeProps) {
  const { t } = useT();
  return (
    <span className={styles.badge}>
      <span className={styles.dot} />
      {t.header.liveFeed}
      <span className={styles.countdown}>{secondsLeft}s</span>
    </span>
  );
}
