import { AppShell } from "@/components/layout";
import {
  EmptyState,
  OfflineBanner,
  SWUpdatePrompt,
  ToastProvider,
} from "@/components/ui";

function App() {
  return (
    <ToastProvider>
      <OfflineBanner />
      <AppShell>
        <EmptyState
          icon={
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="No tasks yet"
          description="Create your first task to get started with organizing your day."
        />
      </AppShell>
      <SWUpdatePrompt />
    </ToastProvider>
  );
}

export { App };
