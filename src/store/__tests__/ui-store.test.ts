import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUIStore } from '@/store/ui-store';

function getStore() {
  return useUIStore.getState();
}

describe('ui-store', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.setState({
      sidebarOpen: true,
      activeFilters: { status: [], priority: [], tags: [], search: '' },
      sortField: 'order',
      sortDirection: 'asc',
    });
  });

  describe('sidebar', () => {
    it('toggles sidebar', () => {
      act(() => getStore().toggleSidebar());
      expect(getStore().sidebarOpen).toBe(false);

      act(() => getStore().toggleSidebar());
      expect(getStore().sidebarOpen).toBe(true);
    });

    it('sets sidebar open state directly', () => {
      act(() => getStore().setSidebarOpen(false));
      expect(getStore().sidebarOpen).toBe(false);

      act(() => getStore().setSidebarOpen(true));
      expect(getStore().sidebarOpen).toBe(true);
    });
  });

  describe('filters', () => {
    it('sets status filter', () => {
      act(() => getStore().setStatusFilter(['todo', 'in_progress']));
      expect(getStore().activeFilters.status).toEqual(['todo', 'in_progress']);
    });

    it('sets priority filter', () => {
      act(() => getStore().setPriorityFilter(['high', 'urgent']));
      expect(getStore().activeFilters.priority).toEqual(['high', 'urgent']);
    });

    it('sets tag filter', () => {
      act(() => getStore().setTagFilter(['work', 'personal']));
      expect(getStore().activeFilters.tags).toEqual(['work', 'personal']);
    });

    it('sets search query', () => {
      act(() => getStore().setSearch('groceries'));
      expect(getStore().activeFilters.search).toBe('groceries');
    });

    it('resets all filters', () => {
      act(() => {
        getStore().setStatusFilter(['done']);
        getStore().setPriorityFilter(['high']);
        getStore().setTagFilter(['work']);
        getStore().setSearch('test');
      });

      act(() => getStore().resetFilters());

      const { activeFilters } = getStore();
      expect(activeFilters.status).toEqual([]);
      expect(activeFilters.priority).toEqual([]);
      expect(activeFilters.tags).toEqual([]);
      expect(activeFilters.search).toBe('');
    });

    it('preserves other filters when setting one', () => {
      act(() => getStore().setStatusFilter(['todo']));
      act(() => getStore().setPriorityFilter(['high']));

      expect(getStore().activeFilters.status).toEqual(['todo']);
      expect(getStore().activeFilters.priority).toEqual(['high']);
    });
  });

  describe('sorting', () => {
    it('sets sort field', () => {
      act(() => getStore().setSortField('priority'));
      expect(getStore().sortField).toBe('priority');
    });

    it('sets sort direction', () => {
      act(() => getStore().setSortDirection('desc'));
      expect(getStore().sortDirection).toBe('desc');
    });
  });

  describe('persistence', () => {
    it('persists sidebarOpen, sortField, sortDirection but not filters', () => {
      act(() => {
        getStore().setSidebarOpen(false);
        getStore().setSortField('priority');
        getStore().setSortDirection('desc');
        getStore().setSearch('test');
      });

      const stored = JSON.parse(localStorage.getItem('todo-app-ui') ?? '{}');
      expect(stored.state?.sidebarOpen).toBe(false);
      expect(stored.state?.sortField).toBe('priority');
      expect(stored.state?.sortDirection).toBe('desc');
      // Filters should NOT be persisted
      expect(stored.state?.activeFilters).toBeUndefined();
    });
  });
});
