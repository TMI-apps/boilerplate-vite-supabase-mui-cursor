import { getEnabledFeatures } from "@utils/setupUtils";

/**
 * Service for setup-related API calls.
 * Follows architecture: pure functions, no React hooks.
 */
export const finishSetup = async (): Promise<void> => {
  // Mark setup as complete
  localStorage.setItem("setup_complete", "true");

  // Call cleanup script endpoint
  const response = await fetch("/api/finish-setup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enabledFeatures: getEnabledFeatures(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to finish setup");
  }

  // Reload page to apply changes
  window.location.reload();
};
