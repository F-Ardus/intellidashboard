import { useT } from '../../../contexts/LocaleContext';
import styles from './Sidebar.module.scss';

export type AppView = 'dashboard' | 'settings';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M14 10l-5 10h10l-5-10z" style={{ fill: 'var(--augur-blue)' }} opacity="0.5" />
    </svg>
  );
}

function GridIcon() {
  return <NavIcon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></NavIcon>;
}
function LayersIcon() {
  return <NavIcon><polygon points="12 2 2 7 12 12 22 7" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></NavIcon>;
}
function SearchIcon() {
  return <NavIcon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></NavIcon>;
}
function ShieldIcon() {
  return <NavIcon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></NavIcon>;
}
function GlobeIcon() {
  return <NavIcon><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" /></NavIcon>;
}
function UsersIcon() {
  return <NavIcon><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></NavIcon>;
}
function FileTextIcon() {
  return <NavIcon><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></NavIcon>;
}
function BarChartIcon() {
  return <NavIcon><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></NavIcon>;
}
function MenuIcon() {
  return <NavIcon><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></NavIcon>;
}
function SettingsIcon() {
  return (
    <NavIcon>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </NavIcon>
  );
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { t } = useT();

  interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    onClick?: () => void;
  }

  const NAV_SECTIONS: Array<{ label?: string; items: NavItem[] }> = [
    {
      items: [
        { key: 'dashboard', label: t.nav.dashboard, icon: <GridIcon />, badge: '3', onClick: () => onNavigate('dashboard') },
        { key: 'augurEvents', label: t.nav.augurEvents, icon: <LayersIcon /> },
        { key: 'investigate', label: t.nav.investigate, icon: <SearchIcon /> },
      ],
    },
    {
      label: t.nav.intelligence,
      items: [
        { key: 'threatIndicators', label: t.nav.threatIndicators, icon: <ShieldIcon /> },
        { key: 'campaigns', label: t.nav.campaigns, icon: <GlobeIcon /> },
        { key: 'actors', label: t.nav.actors, icon: <UsersIcon /> },
      ],
    },
    {
      label: t.nav.reports,
      items: [
        { key: 'executiveReports', label: t.nav.executiveReports, icon: <FileTextIcon /> },
        { key: 'analytics', label: t.nav.analytics, icon: <BarChartIcon /> },
      ],
    },
    {
      label: t.nav.settings,
      items: [{ key: 'integrations', label: t.nav.integrations, icon: <MenuIcon /> }],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <LogoIcon />
        <span>Augur</span>
      </div>

      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} className={styles.section}>
            {section.label && (
              <div className={styles.sectionLabel}>{section.label}</div>
            )}
            {section.items.map((item) => {
              const isActive = item.key === 'dashboard' && activeView === 'dashboard';
              return (
                <button
                  key={item.key}
                  className={`${styles.navItem}${isActive ? ` ${styles.active}` : ''}`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <button
          className={`${styles.navItem}${activeView === 'settings' ? ` ${styles.active}` : ''}`}
          onClick={() => onNavigate('settings')}
          data-tour="settings-nav"
        >
          <SettingsIcon />
          {t.nav.settings}
        </button>
      </div>
    </aside>
  );
}
