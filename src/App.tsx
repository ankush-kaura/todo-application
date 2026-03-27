import { AppShell } from "@/components/layout";
import {
  OfflineBanner,
  SWUpdatePrompt,
  ToastProvider,
} from "@/components/ui";
import { TaskList } from "@/features/tasks";

function App() {
  return (
    <ToastProvider>
      <OfflineBanner />
      <AppShell>
        <TaskList />
      </AppShell>
      <SWUpdatePrompt />
    </ToastProvider>
  );
}

export { App };
