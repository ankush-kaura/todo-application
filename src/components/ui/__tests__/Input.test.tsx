import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    renderWithProviders(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders without label', () => {
    renderWithProviders(<Input placeholder="Type..." />);
    expect(screen.getByPlaceholderText('Type...')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(<Input label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    renderWithProviders(<Input label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text when no error', () => {
    renderWithProviders(<Input label="Name" helperText="Enter your name" />);
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  it('shows error over helper text', () => {
    renderWithProviders(<Input label="Name" error="Bad" helperText="Help" />);
    expect(screen.getByText('Bad')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });
});
