import { useState, useEffect } from "react";
import {
  advanceAirtableWizardStep,
  completeAirtableWizard,
  skipAirtableWizard,
} from "./airtableDialogFlowActions";
import { useAirtableDialogStepValidation } from "./useAirtableDialogStepValidation";
import { useAirtableSetup } from "./useAirtableSetup";
import { useEnvWriter } from "./useEnvWriter";
import { useWizardStep } from "./useWizardStep";

const TOTAL_STEPS = 4;

export const AIRTABLE_WIZARD_STEP_LABELS = [
  "Create PAT",
  "Choose Base & Table",
  "Validate Connection",
  "Complete Setup",
] as const;

interface UseAirtableDialogFlowOptions {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

/**
 * Orchestrates the Airtable setup wizard (steps, validation, env write, completion).
 */
export function useAirtableDialogFlow({
  open,
  onClose,
  onStatusChange,
}: UseAirtableDialogFlowOptions) {
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");

  const { fetchTableStructure, tableStructure, loadingStructure, structureError, resetStructure } =
    useAirtableSetup();

  const envWriter = useEnvWriter();

  const wizard = useWizardStep({
    totalSteps: TOTAL_STEPS,
    onReset: resetStructure,
  });

  useEffect(() => {
    if (!open) {
      wizard.reset();
      setAirtableApiKey("");
      setAirtableBaseId("");
      setAirtableTableId("");
      resetStructure();
    }
  }, [open, resetStructure, wizard]);

  const handleNext = async () => {
    await advanceAirtableWizardStep({
      activeStep: wizard.activeStep,
      goToNext: wizard.goToNext,
      airtableApiKey,
      airtableBaseId,
      airtableTableId,
      fetchTableStructure,
    });
  };

  const handleBack = () => {
    wizard.goToPrevious();
  };

  const handleSave = async () => {
    if (!wizard.isLastStep) {
      await handleNext();
      return;
    }

    await completeAirtableWizard({
      airtableApiKey,
      airtableBaseId,
      airtableTableId,
      envWritten: envWriter.envWritten,
      writeEnv: envWriter.writeEnv,
      onStatusChange,
      onClose,
    });
  };

  const handleSkip = () => {
    skipAirtableWizard({ onStatusChange, onClose });
  };

  const stepValidation = useAirtableDialogStepValidation({
    activeStep: wizard.activeStep,
    airtableApiKey,
    airtableBaseId,
    airtableTableId,
    tableStructure,
    loadingStructure,
    structureError,
    envWritten: envWriter.envWritten,
    writingEnv: envWriter.writingEnv,
  });

  const { activeStep, isFirstStep, isLastStep } = wizard;
  const showSkipButton = activeStep === 0 || activeStep === 1;

  return {
    airtableApiKey,
    setAirtableApiKey,
    airtableBaseId,
    setAirtableBaseId,
    airtableTableId,
    setAirtableTableId,
    fetchTableStructure,
    tableStructure,
    loadingStructure,
    structureError,
    envWriter,
    activeStep,
    isFirstStep,
    isLastStep,
    handleBack,
    handleSave,
    handleSkip,
    handleNext,
    stepValidation,
    steps: AIRTABLE_WIZARD_STEP_LABELS,
    showSkipButton,
  };
}
