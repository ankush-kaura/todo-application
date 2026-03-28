import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { TextArea } from '../TextArea';

describe('TextArea', () => {
  it('renders with label', () => {
    renderWithProviders(<TextArea label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('handles input', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<TextArea label="Notes" onChange={onChange} />);
    await user.type(screen.getByLabelText('Notes'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    renderWithProviders(<TextArea label="Desc" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Desc')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text when no error', () => {
    renderWithProviders(<TextArea label="Desc" helperText="Write something" />);
    expect(screen.getByText('Write something')).toBeInTheDocument();
  });

  it('prefers error over helper text', () => {
    renderWithProviders(<TextArea label="Desc" error="Bad" helperText="Help" />);
    expect(screen.getByText('Bad')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('renders without label', () => {
    renderWithProviders(<TextArea placeholder="Type..." />);
    expect(screen.getByPlaceholderText('Type...')).toBeInTheDocument();
  });
});
