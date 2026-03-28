import styles from './LiveFeedBadge.module.scss';

interface LiveFeedBadgeProps {
  secondsLeft: number;
}

export function LiveFeedBadge({ secondsLeft }: LiveFeedBadgeProps) {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} />
      Live feed
      <span className={styles.countdown}>{secondsLeft}s</span>
    </span>
  );
}
