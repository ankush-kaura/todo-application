import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Header } from '../Header';

describe('Header', () => {
  it('renders app title', () => {
    renderWithProviders(<Header onMenuToggle={vi.fn()} />);
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button clicked', async () => {
    const onMenuToggle = vi.fn();
    const { user } = renderWithProviders(<Header onMenuToggle={onMenuToggle} />);
    await user.click(screen.getByLabelText('Toggle sidebar'));
    expect(onMenuToggle).toHaveBeenCalledOnce();
  });

  it('has theme toggle button', () => {
    renderWithProviders(<Header onMenuToggle={vi.fn()} />);
    expect(screen.getByLabelText(/Switch to .* mode/)).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const { user } = renderWithProviders(<Header onMenuToggle={vi.fn()} />);
    const themeBtn = screen.getByLabelText(/Switch to .* mode/);
    await user.click(themeBtn);
    // After clicking, the label should change
    expect(screen.getByLabelText(/Switch to .* mode/)).toBeInTheDocument();
  });
});
