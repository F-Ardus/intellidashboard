import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleContext } from '../../../contexts/LocaleContext';
import { en, fmt } from '../../../i18n';
import { EmptyState } from './EmptyState';

const localeValue = { locale: 'en' as const, setLocale: () => {}, t: en, fmt, intlLocale: 'en' };

function renderWithLocale(ui: React.ReactElement) {
  return render(
    <LocaleContext.Provider value={localeValue}>
      <table><tbody>{ui}</tbody></table>
    </LocaleContext.Provider>,
  );
}

describe('EmptyState', () => {
  it('shows filter hint when filters are active', () => {
    renderWithLocale(<EmptyState hasFilters={true} />);
    expect(screen.getByText(/adjusting your filters/i)).toBeInTheDocument();
  });

  it('shows generic hint when no filters are active', () => {
    renderWithLocale(<EmptyState hasFilters={false} />);
    expect(screen.getByText(/no threat indicators are available yet/i)).toBeInTheDocument();
  });

  it('always shows the "No indicators found" title', () => {
    renderWithLocale(<EmptyState hasFilters={false} />);
    expect(screen.getByText(/no indicators found/i)).toBeInTheDocument();
  });
});
