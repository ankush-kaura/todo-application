import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  it('renders with label', () => {
    renderWithProviders(<Checkbox label="Agree" />);
    expect(screen.getByLabelText('Agree')).toBeInTheDocument();
  });

  it('toggles on click', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(
      <Checkbox label="Check" onChange={onChange} />,
    );
    await user.click(screen.getByLabelText('Check'));
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('Check')).toBeChecked();
  });

  it('renders as disabled', () => {
    renderWithProviders(<Checkbox label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('renders without label', () => {
    renderWithProviders(<Checkbox data-testid="cb" />);
    expect(screen.getByTestId('cb')).toBeInTheDocument();
  });
});
