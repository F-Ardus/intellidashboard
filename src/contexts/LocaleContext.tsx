import { createContext, useContext } from 'react';
import type { LocaleId, Translations } from '../i18n';
import { fmt } from '../i18n';

interface LocaleContextValue {
  locale: LocaleId;
  setLocale: (id: LocaleId) => void;
  t: Translations;
  fmt: typeof fmt;
  intlLocale: string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useT(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useT must be used within LocaleProvider');
  return ctx;
}
