import { describe, it, expect } from 'vitest';
import { selectPriorityBadgeVariant } from '@/store';

describe('selectPriorityBadgeVariant', () => {
  it('returns danger for urgent', () => {
    expect(selectPriorityBadgeVariant('urgent')).toBe('danger');
  });

  it('returns warning for high', () => {
    expect(selectPriorityBadgeVariant('high')).toBe('warning');
  });

  it('returns primary for medium', () => {
    expect(selectPriorityBadgeVariant('medium')).toBe('primary');
  });

  it('returns default for low', () => {
    expect(selectPriorityBadgeVariant('low')).toBe('default');
  });
});
