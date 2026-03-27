import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { AppShell } from '../AppShell';

describe('AppShell', () => {
  it('renders children', () => {
    renderWithProviders(
      <AppShell>
        <p>Main content</p>
      </AppShell>,
    );
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('renders header', () => {
    renderWithProviders(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    renderWithProviders(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
  });
});
