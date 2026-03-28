import { type ReactNode, useCallback, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/utils/cn";

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Header onMenuToggle={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <main
        className={cn(
          "pt-14 transition-[margin] duration-200 md:ml-64",
          className,
        )}
      >
        <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
