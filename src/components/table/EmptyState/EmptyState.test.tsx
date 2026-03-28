import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('shows filter hint when filters are active', () => {
    render(
      <table><tbody><EmptyState hasFilters={true} /></tbody></table>,
    );
    expect(screen.getByText(/adjusting your filters/i)).toBeInTheDocument();
  });

  it('shows generic hint when no filters are active', () => {
    render(
      <table><tbody><EmptyState hasFilters={false} /></tbody></table>,
    );
    expect(screen.getByText(/no threat indicators are available yet/i)).toBeInTheDocument();
  });

  it('always shows the "No indicators found" title', () => {
    render(
      <table><tbody><EmptyState hasFilters={false} /></tbody></table>,
    );
    expect(screen.getByText(/no indicators found/i)).toBeInTheDocument();
  });
});
