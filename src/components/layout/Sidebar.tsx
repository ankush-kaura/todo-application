import { cn } from "@/utils/cn";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function Sidebar({ open, onClose, className }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-overlay md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-14 left-0 z-40 flex h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-border bg-bg-secondary transition-transform duration-200",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <SidebarLink icon={<InboxIcon />} label="All Tasks" active />
            <SidebarLink icon={<TodayIcon />} label="Today" />
            <SidebarLink icon={<UpcomingIcon />} label="Upcoming" />
            <SidebarLink icon={<CompletedIcon />} label="Completed" />
          </div>

          <div className="mt-8">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Projects
            </h3>
            <div className="space-y-1">
              <SidebarLink icon={<DotIcon color="text-primary" />} label="Personal" />
              <SidebarLink icon={<DotIcon color="text-success" />} label="Work" />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary-light text-primary"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
      )}
    >
      <span className="h-5 w-5 shrink-0">{icon}</span>
      {label}
    </button>
  );
}

function InboxIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UpcomingIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DotIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", color)} fill="currentColor">
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
