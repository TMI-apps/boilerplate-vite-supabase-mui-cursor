import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

/**
 * TanStack Query devtools — bottom-left on /tasks to avoid overlapping the task list and FAB.
 * Loaded dynamically in dev only so production bundles exclude the devtools package.
 */
export const QueryDevtoolsGate = () => {
  const { pathname } = useLocation();
  const buttonPosition = pathname === "/tasks" ? "bottom-left" : "bottom-right";

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition={buttonPosition} />
    </Suspense>
  );
};
