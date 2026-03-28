import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { TaskActions } from '../TaskActions';

const defaultProps = {
  onEdit: vi.fn(),
  onDuplicate: vi.fn(),
  onDelete: vi.fn(),
};

describe('TaskActions', () => {
  it('renders the actions trigger button', () => {
    renderWithProviders(<TaskActions {...defaultProps} />);
    expect(screen.getByLabelText('Task actions')).toBeInTheDocument();
  });

  it('opens menu on click', async () => {
    const { user } = renderWithProviders(<TaskActions {...defaultProps} />);
    await user.click(screen.getByLabelText('Task actions'));

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onEdit and closes menu', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <TaskActions {...defaultProps} onEdit={onEdit} />,
    );
    await user.click(screen.getByLabelText('Task actions'));
    await user.click(screen.getByText('Edit'));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('calls onDuplicate and closes menu', async () => {
    const onDuplicate = vi.fn();
    const { user } = renderWithProviders(
      <TaskActions {...defaultProps} onDuplicate={onDuplicate} />,
    );
    await user.click(screen.getByLabelText('Task actions'));
    await user.click(screen.getByText('Duplicate'));

    expect(onDuplicate).toHaveBeenCalledOnce();
    expect(screen.queryByText('Duplicate')).not.toBeInTheDocument();
  });

  it('calls onDelete and closes menu', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <TaskActions {...defaultProps} onDelete={onDelete} />,
    );
    await user.click(screen.getByLabelText('Task actions'));
    await user.click(screen.getByText('Delete'));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('closes menu on Escape', async () => {
    const { user } = renderWithProviders(<TaskActions {...defaultProps} />);
    await user.click(screen.getByLabelText('Task actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('closes menu on outside click', async () => {
    const { user } = renderWithProviders(
      <div>
        <span data-testid="outside">outside</span>
        <TaskActions {...defaultProps} />
      </div>,
    );
    await user.click(screen.getByLabelText('Task actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.click(screen.getByTestId('outside'));
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });

  it('toggles menu on repeated clicks', async () => {
    const { user } = renderWithProviders(<TaskActions {...defaultProps} />);

    await user.click(screen.getByLabelText('Task actions'));
    expect(screen.getByText('Edit')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Task actions'));
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
  });
});
