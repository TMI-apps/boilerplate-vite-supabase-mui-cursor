import { useMemo } from "react";
import { computeStepValidation } from "./airtableWizardStepValidation";
import type { AirtableTableStructure } from "@shared/services/airtableService";

interface UseAirtableDialogStepValidationParams {
  activeStep: number;
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  tableStructure: AirtableTableStructure | null;
  loadingStructure: boolean;
  structureError: string | null;
  envWritten: boolean;
  writingEnv: boolean;
}

/**
 * Memoized step validation state for the Airtable setup wizard.
 */
export function useAirtableDialogStepValidation(p: UseAirtableDialogStepValidationParams) {
  const {
    activeStep,
    airtableApiKey,
    airtableBaseId,
    airtableTableId,
    tableStructure,
    loadingStructure,
    structureError,
    envWritten,
    writingEnv,
  } = p;

  return useMemo(
    () =>
      computeStepValidation(activeStep, {
        airtableApiKey,
        airtableBaseId,
        airtableTableId,
        tableStructure,
        loadingStructure,
        structureError,
        envWritten,
        writingEnv,
      }),
    [
      activeStep,
      airtableApiKey,
      airtableBaseId,
      airtableTableId,
      tableStructure,
      loadingStructure,
      structureError,
      envWritten,
      writingEnv,
    ]
  );
}
