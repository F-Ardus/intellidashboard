import { useCallback, useState } from 'react';

export interface TourStep {
  /** CSS selector for the element to highlight. Empty string = centered welcome card. */
  target: string;
  /** Fallback selector used when `target` is not visible (e.g. sidebar hidden on mobile). */
  fallbackTarget?: string;
  title: string;
  description: string;
  /** Alternative description shown when the fallback target is used. */
  fallbackDescription?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Placement override used when the fallback target is active. */
  fallbackPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const STORAGE_KEY = 'augur-tour-seen';

export const TOUR_STEPS: TourStep[] = [
  {
    target: '',
    placement: 'center',
    title: 'Welcome to Augur',
    description:
      'A threat intelligence dashboard for monitoring and investigating indicators of compromise. This quick tour covers the key features — skip any time.',
  },
  {
    target: '[data-tour="stats"]',
    placement: 'bottom',
    title: 'Threat Summary',
    description:
      'Live counts broken down by severity. Click any card to filter the table to that severity, or the Total card to open a detailed breakdown with a donut chart.',
  },
  {
    target: '[data-tour="refresh"]',
    placement: 'bottom',
    title: 'Live Feed',
    description:
      'The dashboard auto-refreshes every 30 seconds. The countdown ring shows time until the next update. Note: indicators added via the form are optimistic — they will be cleared on the next refresh.',
  },
  {
    target: '[data-tour="search"]',
    placement: 'bottom',
    title: 'Search Indicators',
    description:
      'Full-text search across indicator values, sources, and tags. Results update as you type with a short debounce to avoid unnecessary requests.',
  },
  {
    target: '[data-tour="filters"]',
    placement: 'bottom',
    title: 'Filter & Refine',
    description:
      'Narrow results by severity, type (IP, domain, hash, URL), source feed, or tags. Multiple filters combine — only indicators matching all conditions are shown.',
  },
  {
    target: '[data-tour="presets"]',
    placement: 'bottom',
    title: 'Saved Searches',
    description:
      'Save any filter combination as a named preset. Presets persist across sessions and can be applied in one click or deleted from this dropdown.',
  },
  {
    target: '[data-tour="table"]',
    placement: 'top',
    title: 'Indicator Table',
    description:
      'Click any row to open a detailed side panel with full metadata, timeline, and actions. Hover a row to reveal a copy-to-clipboard button on the indicator value. Use checkboxes for multi-select and bulk CSV export. Column headers are sortable.',
  },
  {
    target: '[data-tour="pagination"]',
    placement: 'top',
    title: 'Navigate Results',
    description:
      'Page through results and adjust how many rows are shown. Active filters are reflected in the URL — making filtered views bookmarkable and shareable.',
  },
  {
    target: '[data-tour="settings-nav"]',
    fallbackTarget: '[data-tour="mobile-menu"]',
    placement: 'right',
    fallbackPlacement: 'bottom',
    title: 'Settings',
    description:
      'Customise the dashboard: choose a theme (system, midnight, dusk, or light), switch language (English, Spanish, Japanese), and adjust table density and tag display preferences.',
    fallbackDescription:
      'Tap the menu button to open the sidebar, then go to Settings to customise your theme, language, table density, and tag display preferences.',
  },
];

export function useTour() {
  const [active, setActive] = useState(() => localStorage.getItem(STORAGE_KEY) !== 'true');
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    setStep((s) => {
      const nextStep = s + 1;
      if (nextStep >= TOUR_STEPS.length) {
        setActive(false);
        localStorage.setItem(STORAGE_KEY, 'true');
        return s;
      }
      return nextStep;
    });
  }, []);

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const skip = useCallback(() => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const restart = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
    setActive(true);
  }, []);

  return {
    active,
    step,
    steps: TOUR_STEPS,
    total: TOUR_STEPS.length,
    next,
    prev,
    skip,
    restart,
  };
}
