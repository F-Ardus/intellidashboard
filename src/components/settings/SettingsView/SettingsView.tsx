import type { ThemeId } from '../../../hooks/useTheme';
import { THEMES } from '../../../hooks/useTheme';
import styles from './SettingsView.module.scss';

interface SettingsViewProps {
  theme: ThemeId;
  onThemeChange: (id: ThemeId) => void;
}

export function SettingsView({ theme, onThemeChange }: SettingsViewProps) {
  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your dashboard preferences</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appearance</h2>

        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <span className={styles.optionTitle}>Theme</span>
            <span className={styles.optionDesc}>Choose a colour scheme for the dashboard</span>
          </div>
        </div>

        <div className={styles.themeGrid}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`${styles.themeCard} ${theme === t.id ? styles.themeCardActive : ''}`}
              onClick={() => onThemeChange(t.id)}
              aria-pressed={theme === t.id}
              aria-label={`${t.name} theme${theme === t.id ? ' (active)' : ''}`}
            >
              <div className={styles.themePreview}>
                <img src={`/themes/${t.id}.png`} alt="" aria-hidden="true" />
              </div>
              <span className={styles.themeName}>{t.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
