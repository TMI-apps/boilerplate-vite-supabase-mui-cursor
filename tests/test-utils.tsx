import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates a QueryClient for tests with retry disabled.
 * Use this instead of the app's createQueryClient to avoid flaky tests from retries.
 */
export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: 0,
      },
    },
  });

/**
 * Wraps children with QueryClientProvider for tests.
 * Use when rendering components that use useQuery/useMutation without mocking.
 *
 * @example
 * render(
 *   createQueryClientWrapper()(
 *     <ProfileMenu />
 *   )
 * );
 *
 * // Or with custom options:
 * const wrapper = createQueryClientWrapper({ defaultOptions: { ... } });
 */
export const createQueryClientWrapper = (options?: { queryClient?: QueryClient }) => {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  return function QueryClientWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};
