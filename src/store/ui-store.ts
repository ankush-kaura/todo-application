import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskStatus, TaskPriority, TaskSortField, SortDirection } from '../types';

export type SidebarView = 'all' | 'today' | 'upcoming' | 'completed';

interface ActiveFilters {
  status: TaskStatus[];
  priority: TaskPriority[];
  tags: string[];
  search: string;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  activeFilters: ActiveFilters;
  sortField: TaskSortField;
  sortDirection: SortDirection;
}

interface UIActions {
  toggleSidebar(): void;
  setSidebarOpen(open: boolean): void;
  setSidebarView(view: SidebarView): void;
  setStatusFilter(statuses: TaskStatus[]): void;
  setPriorityFilter(priorities: TaskPriority[]): void;
  setTagFilter(tags: string[]): void;
  setSearch(query: string): void;
  setSortField(field: TaskSortField): void;
  setSortDirection(dir: SortDirection): void;
  resetFilters(): void;
}

type UIStore = UIState & UIActions;

const EMPTY_FILTERS: ActiveFilters = {
  status: [],
  priority: [],
  tags: [],
  search: '',
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarView: 'all' as SidebarView,
      activeFilters: { ...EMPTY_FILTERS },
      sortField: 'order',
      sortDirection: 'asc',

      toggleSidebar() {
        set((s) => ({ sidebarOpen: !s.sidebarOpen }));
      },

      setSidebarOpen(open) {
        set({ sidebarOpen: open });
      },

      setSidebarView(view) {
        set({ sidebarView: view });
      },

      setStatusFilter(statuses) {
        set((s) => ({
          activeFilters: { ...s.activeFilters, status: statuses },
        }));
      },

      setPriorityFilter(priorities) {
        set((s) => ({
          activeFilters: { ...s.activeFilters, priority: priorities },
        }));
      },

      setTagFilter(tags) {
        set((s) => ({
          activeFilters: { ...s.activeFilters, tags },
        }));
      },

      setSearch(query) {
        set((s) => ({
          activeFilters: { ...s.activeFilters, search: query },
        }));
      },

      setSortField(field) {
        set({ sortField: field });
      },

      setSortDirection(dir) {
        set({ sortDirection: dir });
      },

      resetFilters() {
        set({ activeFilters: { ...EMPTY_FILTERS } });
      },
    }),
    {
      name: 'todo-app-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
      }),
    },
  ),
);
