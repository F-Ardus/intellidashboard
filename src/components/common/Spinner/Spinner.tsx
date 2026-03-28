import styles from './Spinner.module.scss';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
}

export function Spinner({ size = 'sm' }: SpinnerProps) {
  const classes = [styles.spinner, size !== 'sm' ? styles[size] : '']
    .filter(Boolean)
    .join(' ');

  return <span className={classes} role="status" aria-label="Loading" />;
}
