import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    renderWithProviders(<EmptyState title="No items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderWithProviders(<EmptyState title="Empty" description="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders icon', () => {
    renderWithProviders(
      <EmptyState title="Empty" icon={<svg data-testid="icon" />} />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action', () => {
    renderWithProviders(
      <EmptyState title="Empty" action={<button>Create</button>} />,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    renderWithProviders(<EmptyState title="Minimal" />);
    expect(screen.getByText('Minimal')).toBeInTheDocument();
  });
});
