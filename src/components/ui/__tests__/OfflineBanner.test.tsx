import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';

// We need to mock the hook before importing the component
vi.mock('@/hooks/useOnlineStatus', () => ({
  useOnlineStatus: vi.fn().mockReturnValue({ isOnline: true, wasOffline: false }),
}));

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineBanner } from '../OfflineBanner';

const mockUseOnlineStatus = vi.mocked(useOnlineStatus);

describe('OfflineBanner', () => {
  it('renders nothing when online and not recently offline', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: false });
    const { container } = renderWithProviders(<OfflineBanner />);
    expect(container.innerHTML).toBe('');
  });

  it('shows offline message when offline', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: false, wasOffline: true });
    renderWithProviders(<OfflineBanner />);
    expect(screen.getByRole('status')).toHaveTextContent(/offline/i);
  });

  it('shows back online message', () => {
    mockUseOnlineStatus.mockReturnValue({ isOnline: true, wasOffline: true });
    renderWithProviders(<OfflineBanner />);
    expect(screen.getByRole('status')).toHaveTextContent(/back online/i);
  });
});
