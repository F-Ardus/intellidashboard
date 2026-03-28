import styles from './Sidebar.module.scss';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
}

interface NavSection {
  label?: string;
  items: NavItem[];
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L2 26h24L14 2z" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M14 10l-5 10h10l-5-10z" fill="#6383ff" opacity="0.3" />
    </svg>
  );
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

function GridIcon() {
  return (
    <NavIcon>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </NavIcon>
  );
}

function LayersIcon() {
  return (
    <NavIcon>
      <polygon points="12 2 2 7 12 12 22 7" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </NavIcon>
  );
}

function SearchIcon() {
  return (
    <NavIcon>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </NavIcon>
  );
}

function ShieldIcon() {
  return (
    <NavIcon>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </NavIcon>
  );
}

function GlobeIcon() {
  return (
    <NavIcon>
      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
    </NavIcon>
  );
}

function UsersIcon() {
  return (
    <NavIcon>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </NavIcon>
  );
}

function FileTextIcon() {
  return (
    <NavIcon>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </NavIcon>
  );
}

function BarChartIcon() {
  return (
    <NavIcon>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </NavIcon>
  );
}

function MenuIcon() {
  return (
    <NavIcon>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </NavIcon>
  );
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', icon: <GridIcon />, active: true, badge: '3' },
      { label: 'Augur Events', icon: <LayersIcon /> },
      { label: 'Investigate', icon: <SearchIcon /> },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Threat Indicators', icon: <ShieldIcon /> },
      { label: 'Campaigns', icon: <GlobeIcon /> },
      { label: 'Actors', icon: <UsersIcon /> },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Executive Reports', icon: <FileTextIcon /> },
      { label: 'Analytics', icon: <BarChartIcon /> },
    ],
  },
  {
    label: 'Settings',
    items: [{ label: 'Integrations', icon: <MenuIcon /> }],
  },
];

export function Sidebar() {
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
            {section.items.map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem}${item.active ? ` ${styles.active}` : ''}`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
