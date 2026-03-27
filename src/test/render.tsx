import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

interface ProviderOptions {
  // Extend as providers are added (theme, store, etc.)
}

function AllProviders({ children }: { children: React.ReactNode }) {
  // Wrap with providers as they are created (e.g., StoreProvider, ThemeProvider)
  return <>{children}</>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & ProviderOptions,
) {
  const { ...renderOptions } = options ?? {};
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
  };
}

export { renderWithProviders as renderApp };
