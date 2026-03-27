import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';

vi.mock('@/hooks/useSWUpdate', () => ({
  useSWUpdate: vi.fn().mockReturnValue({ needRefresh: false, update: vi.fn(), dismiss: vi.fn() }),
}));

import { useSWUpdate } from '@/hooks/useSWUpdate';
import { SWUpdatePrompt } from '../SWUpdatePrompt';

const mockUseSWUpdate = vi.mocked(useSWUpdate);

describe('SWUpdatePrompt', () => {
  it('renders nothing when no update available', () => {
    mockUseSWUpdate.mockReturnValue({ needRefresh: false, update: vi.fn(), dismiss: vi.fn() });
    const { container } = renderWithProviders(<SWUpdatePrompt />);
    expect(container.innerHTML).toBe('');
  });

  it('shows update prompt when refresh needed', () => {
    mockUseSWUpdate.mockReturnValue({ needRefresh: true, update: vi.fn(), dismiss: vi.fn() });
    renderWithProviders(<SWUpdatePrompt />);
    expect(screen.getByText('A new version is available')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('calls update on button click', async () => {
    const update = vi.fn();
    mockUseSWUpdate.mockReturnValue({ needRefresh: true, update, dismiss: vi.fn() });
    const { user } = renderWithProviders(<SWUpdatePrompt />);
    await user.click(screen.getByText('Update'));
    expect(update).toHaveBeenCalledOnce();
  });

  it('calls dismiss on close click', async () => {
    const dismiss = vi.fn();
    mockUseSWUpdate.mockReturnValue({ needRefresh: true, update: vi.fn(), dismiss });
    const { user } = renderWithProviders(<SWUpdatePrompt />);
    await user.click(screen.getByLabelText('Dismiss'));
    expect(dismiss).toHaveBeenCalledOnce();
  });
});
