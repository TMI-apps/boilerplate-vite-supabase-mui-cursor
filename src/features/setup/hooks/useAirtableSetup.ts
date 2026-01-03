import { isAirtableConfigured, testAirtableConnection } from "@shared/services/airtableService";

/**
 * Hook for Airtable setup functionality.
 * Provides configuration check and connection testing.
 * Wraps service calls to follow architecture rules (components cannot import services directly).
 */
export const useAirtableSetup = () => {
  const isConfigured = isAirtableConfigured();

  return {
    isConfigured,
    testAirtableConnection,
  };
};
