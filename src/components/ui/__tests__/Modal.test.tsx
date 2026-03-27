import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    renderWithProviders(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <Modal open={true} onClose={onClose} title="Test">
        <button>Focus me</button>
      </Modal>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    const backdrop = screen.getByRole('presentation');
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has close button', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>,
    );
    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('sets aria-modal', () => {
    renderWithProviders(
      <Modal open={true} onClose={vi.fn()} title="Accessible">
        <p>Content</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
