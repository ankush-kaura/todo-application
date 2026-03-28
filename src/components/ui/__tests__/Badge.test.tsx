import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    renderWithProviders(<Badge>High</Badge>);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    renderWithProviders(<Badge variant="danger">Urgent</Badge>);
    expect(screen.getByText('Urgent').className).toContain('bg-danger-light');
  });

  it('applies size class', () => {
    renderWithProviders(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small').className).toContain('text-xs');
  });

  it('defaults to default variant and md size', () => {
    renderWithProviders(<Badge>Default</Badge>);
    const el = screen.getByText('Default');
    expect(el.className).toContain('bg-bg-tertiary');
    expect(el.className).toContain('px-2');
  });
});
