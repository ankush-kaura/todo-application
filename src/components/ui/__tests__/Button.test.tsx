import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    renderWithProviders(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { rerender } = renderWithProviders(<Button variant="danger">Del</Button>);
    expect(screen.getByRole('button').className).toContain('bg-danger');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button').className).toContain('bg-transparent');
  });

  it('applies size classes', () => {
    renderWithProviders(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('h-8');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    renderWithProviders(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});
