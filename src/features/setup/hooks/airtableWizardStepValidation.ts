export interface AirtableWizardStepValidation {
  canProceed: boolean;
  buttonText: string;
  disabled?: boolean;
}

export interface AirtableWizardValidationContext {
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  tableStructure: unknown;
  loadingStructure: boolean;
  structureError: string | null;
  envWritten: boolean;
  writingEnv: boolean;
}

/** Pure step validation for the Airtable wizard (used by hook and tests). */
export function computeStepValidation(
  activeStep: number,
  ctx: AirtableWizardValidationContext
): AirtableWizardStepValidation {
  switch (activeStep) {
    case 0:
      return { canProceed: !!ctx.airtableApiKey, buttonText: "Next" };
    case 1:
      return {
        canProceed: !!(ctx.airtableBaseId && ctx.airtableTableId),
        buttonText: "Next",
      };
    case 2: {
      const ready = ctx.tableStructure !== null && !ctx.loadingStructure && !ctx.structureError;
      return {
        canProceed: ready,
        buttonText: ready ? "Next" : "Validating...",
        disabled: ctx.loadingStructure,
      };
    }
    case 3:
      return {
        canProceed: true,
        buttonText: ctx.envWritten ? "Finish Setup" : "Save to .env",
        disabled: ctx.writingEnv,
      };
    default:
      return { canProceed: false, buttonText: "Next" };
  }
}
