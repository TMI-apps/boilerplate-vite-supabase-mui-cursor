import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { SetupCard } from "../SetupCard";
import { SetupDialog } from "../SetupDialog";
import { ConfigurationViewDialog } from "../ConfigurationViewDialog";
import { AirtableConfigView } from "../views/AirtableConfigView";
import { AirtableSetupWizardPanel } from "../AirtableSetupWizardPanel";
import { useAirtableDialogFlow } from "../../hooks/useAirtableDialogFlow";
import { useConfigurationData } from "../../hooks/useConfigurationData";
import { useConfigurationReset } from "../../hooks/useConfigurationReset";
import { getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";
import { useAirtableSetup } from "../../hooks/useAirtableSetup";
import type { AirtableConfiguration } from "../../types/config.types";

interface AirtableSectionProps {
  onStatusChange?: () => void;
}

export const AirtableCard = ({ onStatusChange }: AirtableSectionProps) => {
  const { isConfigured } = useAirtableSetup();
  const state = getSetupSectionsState();
  const status: SetupStatus = isConfigured ? "completed" : state.airtable;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleCardClick = () => {
    if (status === "completed") {
      setViewDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <SetupCard
        title="Configure Airtable"
        description="Set up Airtable as an alternative data backend. Data-only; authentication still requires Supabase."
        status={status}
        onClick={handleCardClick}
      />
      <AirtableDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
      <AirtableViewDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface AirtableDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const AirtableDialog = ({ open, onClose, onStatusChange }: AirtableDialogProps) => {
  const flow = useAirtableDialogFlow({
    open,
    onClose,
    onStatusChange,
  });

  const {
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
    stepValidation,
    steps,
    showSkipButton,
  } = flow;

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Airtable"
      saveButtonText={stepValidation.buttonText}
      saveButtonDisabled={!stepValidation.canProceed || Boolean(stepValidation.disabled)}
      showCancel={showSkipButton}
      closeOnSave={isLastStep}
      additionalActions={
        showSkipButton && (
          <Button variant="outlined" onClick={handleSkip}>
            Skip Airtable Setup
          </Button>
        )
      }
    >
      <AirtableSetupWizardPanel
        steps={steps}
        activeStep={activeStep}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        airtableApiKey={airtableApiKey}
        setAirtableApiKey={setAirtableApiKey}
        airtableBaseId={airtableBaseId}
        setAirtableBaseId={setAirtableBaseId}
        airtableTableId={airtableTableId}
        setAirtableTableId={setAirtableTableId}
        tableStructure={tableStructure}
        loadingStructure={loadingStructure}
        structureError={structureError}
        envWritten={envWriter.envWritten}
        fetchTableStructure={fetchTableStructure}
        handleBack={handleBack}
      />
    </SetupDialog>
  );
};

interface AirtableViewDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const AirtableViewDialog = ({ open, onClose, onStatusChange }: AirtableViewDialogProps) => {
  const { data, loading, error, refetch } = useConfigurationData<AirtableConfiguration>("airtable");
  const { reset, resetting } = useConfigurationReset("airtable", () => {
    onStatusChange?.();
  });

  useEffect(() => {
    if (open) {
      const syncConfig = async () => {
        try {
          const { syncConfiguration } = await import("../../services/configService");
          const result = await syncConfiguration();
          if (result.success) {
            void refetch();
          }
        } catch {
          // Silently handle sync errors - configuration will still be displayed
        }
      };
      void syncConfig();
    }
  }, [open, refetch]);

  return (
    <ConfigurationViewDialog
      open={open}
      onClose={onClose}
      title="Airtable Configuration"
      sectionName="Airtable"
      onReset={reset}
      resetInProgress={resetting}
    >
      <AirtableConfigView config={data} loading={loading} error={error} />
    </ConfigurationViewDialog>
  );
};
