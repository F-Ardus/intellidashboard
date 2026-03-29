export type { Translations } from './types';
export { en } from './locales/en';
export { es } from './locales/es';
export { ja } from './locales/ja';

export type LocaleId = 'en' | 'es' | 'ja';

export const LOCALES = [
  { id: 'en' as LocaleId, name: 'English', flag: '🇺🇸', intl: 'en-US' },
  { id: 'es' as LocaleId, name: 'Español', flag: '🇪🇸', intl: 'es-ES' },
  { id: 'ja' as LocaleId, name: '日本語', flag: '🇯🇵', intl: 'ja-JP' },
];

/** Replace {{key}} placeholders in a translated string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}
