import type { ReactNode } from 'react';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  sidebar: ReactNode;
  children?: ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      {sidebar}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
