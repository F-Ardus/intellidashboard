import { useCallback, useState } from 'react';
import { en, es, ja, LOCALES } from '../i18n';
import type { LocaleId, Translations } from '../i18n';

const STORAGE_KEY = 'augur-locale';

const LOCALE_MAP: Record<LocaleId, Translations> = { en, es, ja };

function readLocale(): LocaleId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in LOCALE_MAP) return stored as LocaleId;
  } catch {
    // ignore
  }
  return 'en';
}

export function useLocale() {
  const [locale, setLocaleState] = useState<LocaleId>(readLocale);

  const setLocale = useCallback((id: LocaleId) => {
    setLocaleState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  const translations = LOCALE_MAP[locale];
  const intlLocale = LOCALES.find((l) => l.id === locale)?.intl ?? 'en-US';

  return { locale, setLocale, translations, intlLocale };
}
