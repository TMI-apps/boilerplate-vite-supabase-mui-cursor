import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@shared/utils/queryClient";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with TanStack Query's QueryClientProvider.
 * Uses the singleton queryClient for app-wide cache (e.g. logout clears all).
 * Devtools mount inside the router — see `QueryDevtoolsGate` in App.tsx.
 */
export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
