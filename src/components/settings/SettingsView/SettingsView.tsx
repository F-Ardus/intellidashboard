import { useEffect, useRef, useState } from 'react';
import type { ThemeId } from '../../../hooks/useTheme';
import { THEMES } from '../../../hooks/useTheme';
import { LOCALES } from '../../../i18n';
import type { LocaleId } from '../../../i18n';
import { useT } from '../../../contexts/LocaleContext';
import styles from './SettingsView.module.scss';

interface SettingsViewProps {
  theme: ThemeId;
  onThemeChange: (id: ThemeId) => void;
}

function LocaleDropdown({ locale, setLocale }: { locale: LocaleId; setLocale: (id: LocaleId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.id === locale) ?? LOCALES[0]!;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={styles.localeDropdown}>
      <button
        className={`${styles.localeTrigger} ${open ? styles.localeTriggerOpen : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.localeFlag}>{current.flag}</span>
        <span className={styles.localeName}>{current.name}</span>
        <span className={styles.localeCaret}>▾</span>
      </button>

      {open && (
        <ul className={styles.localeList} role="listbox">
          {LOCALES.map((loc) => (
            <li key={loc.id} role="option" aria-selected={loc.id === locale}>
              <button
                className={`${styles.localeOption} ${loc.id === locale ? styles.localeOptionActive : ''}`}
                onClick={() => { setLocale(loc.id as LocaleId); setOpen(false); }}
              >
                <span className={styles.localeFlag}>{loc.flag}</span>
                <span className={styles.localeName}>{loc.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SettingsView({ theme, onThemeChange }: SettingsViewProps) {
  const { t, locale, setLocale } = useT();

  return (
    <div className={styles.view}>
      <div className={styles.header}>
        <h1>{t.settings.title}</h1>
        <p>{t.settings.subtitle}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.settings.appearance}</h2>

        {/* Theme row */}
        <div className={styles.row}>
          <div className={styles.rowLabel}>
            <span className={styles.optionTitle}>{t.settings.theme}</span>
            <span className={styles.optionDesc}>{t.settings.themeDesc}</span>
          </div>
          <div className={styles.themeGrid}>
            {THEMES.map((th) => (
              <button
                key={th.id}
                className={`${styles.themeCard} ${theme === th.id ? styles.themeCardActive : ''}`}
                onClick={() => onThemeChange(th.id)}
                aria-pressed={theme === th.id}
                aria-label={`${th.name}${theme === th.id ? ' (active)' : ''}`}
              >
                <div className={styles.themePreview}>
                  <img src={`/themes/${th.id}.png`} alt="" aria-hidden="true" />
                </div>
                <span className={styles.themeName}>{th.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language row */}
        <div className={`${styles.row} ${styles.rowLast}`}>
          <div className={styles.rowLabel}>
            <span className={styles.optionTitle}>{t.settings.language}</span>
            <span className={styles.optionDesc}>{t.settings.languageDesc}</span>
          </div>
          <LocaleDropdown locale={locale} setLocale={setLocale} />
        </div>
      </section>
    </div>
  );
}
