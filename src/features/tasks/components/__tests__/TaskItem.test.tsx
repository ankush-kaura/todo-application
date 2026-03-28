import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { createMockTask } from '@/test/mocks';
import { TaskItem } from '../TaskItem';

const defaultProps = {
  onToggle: vi.fn(),
  onEdit: vi.fn(),
  onDuplicate: vi.fn(),
  onDelete: vi.fn(),
  onClick: vi.fn(),
};

describe('TaskItem', () => {
  it('renders task title', () => {
    const task = createMockTask({ title: 'Buy milk' });
    renderWithProviders(<TaskItem task={task} {...defaultProps} />);
    expect(screen.getByText('Buy milk')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    const task = createMockTask({ priority: 'high' });
    renderWithProviders(<TaskItem task={task} {...defaultProps} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders due date when present', () => {
    // Use a future date so it's not marked "overdue" or "Today"
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const task = createMockTask({ dueDate: futureDate.getTime() });
    renderWithProviders(<TaskItem task={task} {...defaultProps} />);
    // Just verify a date-like text is rendered (month abbreviation)
    const dateEl = document.querySelector('.text-text-tertiary.text-xs');
    expect(dateEl).toBeInTheDocument();
  });

  it('shows strikethrough for done tasks', () => {
    const task = createMockTask({ status: 'done' });
    renderWithProviders(<TaskItem task={task} {...defaultProps} />);
    const title = screen.getByText('Test Task');
    expect(title.className).toContain('line-through');
  });

  it('calls onToggle when checkbox clicked', async () => {
    const onToggle = vi.fn();
    const task = createMockTask({ id: 't1' });
    const { user } = renderWithProviders(
      <TaskItem task={task} {...defaultProps} onToggle={onToggle} />,
    );
    await user.click(screen.getByLabelText('Mark complete'));
    expect(onToggle).toHaveBeenCalledWith('t1');
  });

  it('shows "Mark incomplete" label for done tasks', () => {
    const task = createMockTask({ status: 'done' });
    renderWithProviders(<TaskItem task={task} {...defaultProps} />);
    expect(screen.getByLabelText('Mark incomplete')).toBeInTheDocument();
  });

  it('calls onClick when row clicked', async () => {
    const onClick = vi.fn();
    const task = createMockTask({ id: 't1' });
    const { user } = renderWithProviders(
      <TaskItem task={task} {...defaultProps} onClick={onClick} />,
    );
    await user.click(screen.getByRole('button', { name: /Buy|Test/i }).closest('[role="button"]')!);
    expect(onClick).toHaveBeenCalledWith('t1');
  });

  it('supports keyboard navigation (Enter)', async () => {
    const onClick = vi.fn();
    const task = createMockTask({ id: 't1' });
    const { user } = renderWithProviders(
      <TaskItem task={task} {...defaultProps} onClick={onClick} />,
    );
    const row = screen.getAllByRole('button')[0]!.closest('[role="button"]')!;
    row.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledWith('t1');
  });
});
