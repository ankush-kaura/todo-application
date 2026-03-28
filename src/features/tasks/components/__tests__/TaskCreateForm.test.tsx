import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { TaskCreateForm } from '../TaskCreateForm';

describe('TaskCreateForm', () => {
  it('renders input placeholder', () => {
    renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Add a task/)).toBeInTheDocument();
  });

  it('does not submit empty title', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText(/Add a task/);
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only title', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/Add a task/), '   ');
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits on Enter', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/Add a task/), 'New task');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New task', priority: 'medium' }),
    );
  });

  it('shows Add button when title is typed', async () => {
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/Add a task/), 'Something');
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('submits via Add button', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText(/Add a task/), 'Button task');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Button task' }),
    );
  });

  it('resets form after submit', async () => {
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText(/Add a task/);
    await user.type(input, 'Will reset');
    await user.keyboard('{Enter}');

    expect(input).toHaveValue('');
  });

  it('expands on focus and shows priority/date fields', async () => {
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);

    await user.click(screen.getByPlaceholderText(/Add a task/));

    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toBeInTheDocument();
  });

  it('collapses on Escape', async () => {
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);

    await user.click(screen.getByPlaceholderText(/Add a task/));
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByLabelText('Priority')).not.toBeInTheDocument();
  });

  it('collapses on Cancel click', async () => {
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={vi.fn()} />);

    await user.click(screen.getByPlaceholderText(/Add a task/));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText('Priority')).not.toBeInTheDocument();
  });

  it('submits with selected priority', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TaskCreateForm onSubmit={onSubmit} />);

    await user.click(screen.getByPlaceholderText(/Add a task/));
    await user.selectOptions(screen.getByLabelText('Priority'), 'high');
    await user.type(screen.getByPlaceholderText(/Add a task/), 'Priority task');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Priority task', priority: 'high' }),
    );
  });
});
