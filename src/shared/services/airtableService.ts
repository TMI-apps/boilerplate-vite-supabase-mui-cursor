import Airtable from "airtable";

const airtableApiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const airtableBaseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
const airtableTableId = import.meta.env.VITE_AIRTABLE_TABLE_ID;

let airtableBase: Airtable.Base | null = null;

/**
 * Check if Airtable is configured
 */
export const isAirtableConfigured = (): boolean => {
  return !!(
    airtableApiKey &&
    airtableBaseId &&
    airtableTableId &&
    airtableApiKey !== "your-api-key" &&
    airtableBaseId !== "your-base-id" &&
    airtableTableId !== "your-table-id"
  );
};

/**
 * Initialize Airtable client if configured
 */
export const initAirtable = (): Airtable.Base | null => {
  if (!isAirtableConfigured() || !airtableApiKey || !airtableBaseId) {
    return null;
  }

  if (!airtableBase) {
    const airtable = new Airtable({ apiKey: airtableApiKey });
    airtableBase = airtable.base(airtableBaseId);
  }

  return airtableBase;
};

/**
 * Get Airtable base (throws if not configured)
 */
export const getAirtableBase = (): Airtable.Base => {
  if (!isAirtableConfigured() || !airtableApiKey || !airtableBaseId) {
    throw new Error("Airtable is not configured. Please complete the setup wizard.");
  }

  if (!airtableBase) {
    const airtable = new Airtable({ apiKey: airtableApiKey });
    airtableBase = airtable.base(airtableBaseId);
  }

  return airtableBase;
};

/**
 * Get Airtable table ID from environment
 */
export const getAirtableTableId = (): string => {
  if (!airtableTableId || airtableTableId === "your-table-id") {
    throw new Error("Airtable table ID is not configured.");
  }
  return airtableTableId;
};

/**
 * Test Airtable connection
 */
export const testAirtableConnection = async (
  apiKey: string,
  baseId: string,
  tableId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const airtable = new Airtable({ apiKey });
    const base = airtable.base(baseId);
    const table = base(tableId);

    // Try to fetch first record to test connection
    await table.select({ maxRecords: 1 }).firstPage();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect to Airtable",
    };
  }
};

// Initialize on module load if configured
if (isAirtableConfigured()) {
  initAirtable();
}
