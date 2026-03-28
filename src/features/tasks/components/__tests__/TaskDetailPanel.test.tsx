import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { createMockTask } from '@/test/mocks';
import { TaskDetailPanel } from '../TaskDetailPanel';

const defaultProps = {
  onClose: vi.fn(),
  onSave: vi.fn(),
  onDelete: vi.fn(),
};

describe('TaskDetailPanel', () => {
  it('renders nothing when closed', () => {
    renderWithProviders(
      <TaskDetailPanel task={undefined} open={false} {...defaultProps} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when open with task', () => {
    const task = createMockTask({ title: 'Edit me' });
    renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} />,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Task Details')).toBeInTheDocument();
  });

  it('populates form fields from task', () => {
    const task = createMockTask({
      title: 'My Task',
      description: 'A description',
      priority: 'high',
      status: 'in_progress',
    });
    renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} />,
    );

    expect(screen.getByLabelText('Title')).toHaveValue('My Task');
    expect(screen.getByLabelText('Description')).toHaveValue('A description');
    expect(screen.getByLabelText('Priority')).toHaveValue('high');
    expect(screen.getByLabelText('Status')).toHaveValue('in_progress');
  });

  it('calls onSave with updated values', async () => {
    const onSave = vi.fn();
    const task = createMockTask({ id: 't1', title: 'Old Title' });
    const { user } = renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} onSave={onSave} />,
    );

    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith(
      't1',
      expect.objectContaining({ title: 'New Title' }),
    );
  });

  it('disables Save when title is empty', async () => {
    const task = createMockTask({ title: 'Has title' });
    const { user } = renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} />,
    );

    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('calls onClose when Cancel clicked', async () => {
    const onClose = vi.fn();
    const task = createMockTask();
    const { user } = renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} onClose={onClose} />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when X button clicked', async () => {
    const onClose = vi.fn();
    const task = createMockTask();
    const { user } = renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} onClose={onClose} />,
    );

    await user.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onDelete and onClose when Delete clicked', async () => {
    const onDelete = vi.fn();
    const onClose = vi.fn();
    const task = createMockTask({ id: 't1' });
    const { user } = renderWithProviders(
      <TaskDetailPanel
        task={task}
        open={true}
        {...defaultProps}
        onDelete={onDelete}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onDelete).toHaveBeenCalledWith('t1');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows metadata (created/updated dates)', () => {
    const task = createMockTask({
      createdAt: new Date('2025-01-15T10:00:00').getTime(),
      updatedAt: new Date('2025-01-16T14:30:00').getTime(),
    });
    renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} />,
    );

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it('shows completed date for done tasks', () => {
    const task = createMockTask({
      status: 'done',
      completedAt: new Date('2025-01-17T09:00:00').getTime(),
    });
    renderWithProviders(
      <TaskDetailPanel task={task} open={true} {...defaultProps} />,
    );

    expect(screen.getByText(/Completed:/)).toBeInTheDocument();
  });
});
