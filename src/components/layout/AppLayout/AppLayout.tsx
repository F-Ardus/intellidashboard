import type { ReactNode } from 'react';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  sidebar: ReactNode;
  children?: ReactNode;
  mobileNavOpen: boolean;
  onMobileNavOpen: () => void;
  onMobileNavClose: () => void;
}

function LogoMark() {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M14 10l-5 10h10l-5-10z" style={{ fill: 'var(--augur-blue)' }} opacity="0.5" />
    </svg>
  );
}

export function AppLayout({ sidebar, children, mobileNavOpen, onMobileNavOpen, onMobileNavClose }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Desktop sidebar */}
      <div className={styles.sidebarSlot}>{sidebar}</div>

      {/* Mobile top bar */}
      <header className={styles.mobileTopBar}>
        <div className={styles.mobileLogoWrap}>
          <LogoMark />
          <span className={styles.mobileLogoText}>Augur</span>
        </div>
        <button
          className={styles.hamburger}
          onClick={onMobileNavOpen}
          aria-label="Open navigation"
          aria-expanded={mobileNavOpen}
          data-tour="mobile-menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <>
          <div className={styles.drawerBackdrop} onClick={onMobileNavClose} aria-hidden="true" />
          <div className={styles.drawerPanel} role="dialog" aria-modal="true" aria-label="Navigation">
            <button className={styles.drawerClose} onClick={onMobileNavClose} aria-label="Close navigation">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {sidebar}
          </div>
        </>
      )}

      <main className={styles.main}>{children}</main>
    </div>
  );
}
