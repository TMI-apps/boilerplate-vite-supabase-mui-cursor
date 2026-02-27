import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@shared/utils/queryClient";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Wraps the app with TanStack Query's QueryClientProvider.
 * Uses the singleton queryClient for app-wide cache (e.g. logout clears all).
 * DevTools are shown in development only.
 */
export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={queryClient}>
    {children}
    {import.meta.env.DEV && (
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    )}
  </QueryClientProvider>
);
