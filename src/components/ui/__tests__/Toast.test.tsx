import { describe, it, expect, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { ToastProvider, useToast } from '../Toast';

function ToastTrigger() {
  const { toast } = useToast();
  return (
    <>
      <button onClick={() => toast('Hello', 'success')}>Show toast</button>
      <button onClick={() => toast('Error!', 'error')}>Show error</button>
    </>
  );
}

describe('Toast', () => {
  it('shows toast on trigger', async () => {
    const { user } = renderWithProviders(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Show toast'));
    expect(screen.getByRole('alert')).toHaveTextContent('Hello');
  });

  it('shows error toast', async () => {
    const { user } = renderWithProviders(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Show error'));
    expect(screen.getByRole('alert')).toHaveTextContent('Error!');
  });

  it('auto-dismisses after timeout', () => {
    vi.useFakeTimers();

    renderWithProviders(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    // Use fireEvent (synchronous) instead of userEvent to avoid timer conflicts
    act(() => {
      fireEvent.click(screen.getByText('Show toast'));
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4100));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('dismisses on click', () => {
    vi.useFakeTimers();

    renderWithProviders(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    act(() => {
      fireEvent.click(screen.getByText('Show toast'));
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByLabelText('Dismiss'));
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('throws when useToast is used outside provider', () => {
    function Orphan() {
      useToast();
      return null;
    }
    expect(() => renderWithProviders(<Orphan />)).toThrow(
      'useToast must be used within ToastProvider',
    );
  });
});
