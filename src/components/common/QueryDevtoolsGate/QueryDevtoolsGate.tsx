import { useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/**
 * TanStack Query devtools — bottom-left on /tasks to avoid overlapping the task list and FAB.
 */
export const QueryDevtoolsGate = () => {
  const { pathname } = useLocation();
  const buttonPosition = pathname === "/tasks" ? "bottom-left" : "bottom-right";

  if (!import.meta.env.DEV) {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} buttonPosition={buttonPosition} />;
};
