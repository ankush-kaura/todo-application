import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Select } from '../Select';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

describe('Select', () => {
  it('renders options', () => {
    renderWithProviders(<Select label="Pick" options={options} />);
    expect(screen.getByLabelText('Pick')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders placeholder', () => {
    renderWithProviders(<Select options={options} placeholder="Choose..." />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('handles selection change', async () => {
    const onChange = vi.fn();
    const { user } = renderWithProviders(
      <Select label="Pick" options={options} onChange={onChange} />,
    );
    await user.selectOptions(screen.getByLabelText('Pick'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error', () => {
    renderWithProviders(<Select options={options} label="Pick" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
