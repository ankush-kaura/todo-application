import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  it('renders navigation links', () => {
    renderWithProviders(<Sidebar open={false} onClose={vi.fn()} />);
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders project section', () => {
    renderWithProviders(<Sidebar open={false} onClose={vi.fn()} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('shows overlay when open on mobile', () => {
    renderWithProviders(<Sidebar open={true} onClose={vi.fn()} />);
    // The overlay div should be present
    const overlay = document.querySelector('.bg-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('hides overlay when closed', () => {
    renderWithProviders(<Sidebar open={false} onClose={vi.fn()} />);
    const overlay = document.querySelector('.bg-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('calls onClose when overlay clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(<Sidebar open={true} onClose={onClose} />);
    const overlay = document.querySelector('.bg-overlay')!;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
