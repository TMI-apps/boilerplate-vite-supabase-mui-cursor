import { updateSetupSectionStatus } from "@utils/setupUtils";

export interface AdvanceStepParams {
  activeStep: number;
  goToNext: () => Promise<void>;
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  fetchTableStructure: (apiKey: string, baseId: string, tableId: string) => Promise<void>;
}

/**
 * Performs step transition and optional table fetch (step 1 → 2).
 */
export async function advanceAirtableWizardStep(p: AdvanceStepParams): Promise<void> {
  const {
    activeStep,
    goToNext,
    airtableApiKey,
    airtableBaseId,
    airtableTableId,
    fetchTableStructure,
  } = p;

  if (activeStep === 0) {
    if (!airtableApiKey) return;
    await goToNext();
    return;
  }

  if (activeStep === 1) {
    if (!airtableBaseId || !airtableTableId) return;
    await goToNext();
    await fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId);
    return;
  }

  if (activeStep === 2) {
    await goToNext();
  }
}

export interface CompleteWizardParams {
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  envWritten: boolean;
  writeEnv: (vars: Record<string, string>) => Promise<{ success: boolean; error?: string } | void>;
  onStatusChange?: () => void;
  onClose: () => void;
}

/**
 * Final step: write .env, or mark completed and close.
 */
export async function completeAirtableWizard(p: CompleteWizardParams): Promise<void> {
  const {
    airtableApiKey,
    airtableBaseId,
    airtableTableId,
    envWritten,
    writeEnv,
    onStatusChange,
    onClose,
  } = p;

  if (!envWritten) {
    await writeEnv({
      VITE_AIRTABLE_API_KEY: airtableApiKey,
      VITE_AIRTABLE_BASE_ID: airtableBaseId,
      VITE_AIRTABLE_TABLE_ID: airtableTableId,
    });
    return;
  }

  updateSetupSectionStatus("airtable", "completed");
  onStatusChange?.();
  onClose();
}

export interface SkipWizardParams {
  onStatusChange?: () => void;
  onClose: () => void;
}

/**
 * Marks the Airtable section as skipped and closes the dialog.
 */
export function skipAirtableWizard(p: SkipWizardParams): void {
  updateSetupSectionStatus("airtable", "skipped");
  p.onStatusChange?.();
  p.onClose();
}
