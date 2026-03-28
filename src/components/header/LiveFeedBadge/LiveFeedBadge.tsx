import styles from './LiveFeedBadge.module.scss';

export function LiveFeedBadge() {
  return (
    <span className={styles.badge}>
      <span className={styles.dot} />
      Live feed
    </span>
  );
}
