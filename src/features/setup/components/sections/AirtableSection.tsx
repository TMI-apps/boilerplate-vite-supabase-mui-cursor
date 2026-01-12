import { useState, useEffect } from "react";
import { Box, Typography, Button, Stepper, Step, StepLabel } from "@mui/material";
import { SetupCard } from "../SetupCard";
import { SetupDialog } from "../SetupDialog";
import { EnvVariablesDisplay } from "../EnvVariablesDisplay";
import { AirtableFormFields } from "../AirtableFormFields";
import { AirtableDescription } from "../AirtableDescription";
import { AirtablePatInstructions } from "../AirtablePatInstructions";
import { TableStructureDisplay } from "../TableStructureDisplay";
import { ConfigurationViewDialog } from "../ConfigurationViewDialog";
import { AirtableConfigView } from "../views/AirtableConfigView";
import { useAirtableSetup } from "../../hooks/useAirtableSetup";
import { useConfigurationData } from "../../hooks/useConfigurationData";
import { useConfigurationReset } from "../../hooks/useConfigurationReset";
import { useEnvWriter } from "../../hooks/useEnvWriter";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";
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
  const [activeStep, setActiveStep] = useState(0);
  const [airtableApiKey, setAirtableApiKey] = useState("");
  const [airtableBaseId, setAirtableBaseId] = useState("");
  const [airtableTableId, setAirtableTableId] = useState("");
  const { fetchTableStructure, tableStructure, loadingStructure, structureError, resetStructure } =
    useAirtableSetup();

  const envWriter = useEnvWriter();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setAirtableApiKey("");
      setAirtableBaseId("");
      setAirtableTableId("");
      resetStructure();
    }
  }, [open, resetStructure]);

  const handleNext = async () => {
    if (activeStep === 0) {
      // Step 0: Validate PAT is filled
      if (!airtableApiKey) {
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Step 1: Validate base and table are filled
      if (!airtableBaseId || !airtableTableId) {
        return;
      }
      // Move to validation step and fetch structure
      setActiveStep(2);
      await fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId);
    } else if (activeStep === 2) {
      // Step 2: Move to completion step
      setActiveStep(3);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        // Reset structure when going back from completion step
        resetStructure();
      }
    }
  };

  const handleSave = async () => {
    if (activeStep < 3) {
      await handleNext();
      return;
    }

    // Final step - write env vars and mark as completed
    if (!envWriter.envWritten) {
      await envWriter.writeEnv({
        VITE_AIRTABLE_API_KEY: airtableApiKey,
        VITE_AIRTABLE_BASE_ID: airtableBaseId,
        VITE_AIRTABLE_TABLE_ID: airtableTableId,
      });
      return;
    }

    updateSetupSectionStatus("airtable", "completed");
    onStatusChange?.();
    onClose();
  };

  const handleSkip = () => {
    updateSetupSectionStatus("airtable", "skipped");
    onStatusChange?.();
    onClose();
  };

  const canProceedFromStep0 = !!airtableApiKey;
  const canProceedFromStep1 = airtableBaseId && airtableTableId;
  const canProceedFromStep2 = tableStructure !== null && !loadingStructure && !structureError;

  const getSaveButtonText = () => {
    if (activeStep === 0) return "Next";
    if (activeStep === 1) return "Next";
    if (activeStep === 2) return canProceedFromStep2 ? "Next" : "Validating...";
    return envWriter.envWritten ? "Finish Setup" : "Save to .env";
  };

  const getSaveButtonDisabled = () => {
    if (activeStep === 0) return !canProceedFromStep0;
    if (activeStep === 1) return !canProceedFromStep1;
    if (activeStep === 2) return loadingStructure || !canProceedFromStep2;
    return envWriter.writingEnv;
  };

  const steps = ["Create PAT", "Choose Base & Table", "Validate Connection", "Complete Setup"];

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Airtable"
      saveButtonText={getSaveButtonText()}
      saveButtonDisabled={getSaveButtonDisabled()}
      showCancel={activeStep === 0 || activeStep === 1}
      closeOnSave={activeStep === 3}
      additionalActions={
        (activeStep === 0 || activeStep === 1) && (
          <Button variant="outlined" onClick={handleSkip} color="inherit">
            Skip Airtable Setup
          </Button>
        )
      }
    >
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step 0: Create PAT */}
      {activeStep === 0 && (
        <AirtablePatInstructions apiKey={airtableApiKey} onApiKeyChange={setAirtableApiKey} />
      )}

      {/* Step 1: Choose Base & Table */}
      {activeStep === 1 && (
        <>
          <AirtableDescription />

          <AirtableFormFields
            baseId={airtableBaseId}
            tableId={airtableTableId}
            onBaseIdChange={setAirtableBaseId}
            onTableIdChange={setAirtableTableId}
          />
        </>
      )}

      {/* Step 2: Validate Connection */}
      {activeStep === 2 && (
        <>
          <Typography variant="h6" gutterBottom>
            Validating Connection
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Fetching table structure from Airtable...
          </Typography>

          <TableStructureDisplay
            structure={tableStructure}
            loading={loadingStructure}
            error={structureError}
          />

          {structureError && (
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => fetchTableStructure(airtableApiKey, airtableBaseId, airtableTableId)}
                disabled={loadingStructure}
              >
                Retry
              </Button>
            </Box>
          )}
        </>
      )}

      {/* Step 3: Complete Setup */}
      {activeStep === 3 && (
        <>
          <Typography variant="h6" gutterBottom>
            Setup Complete
          </Typography>

          <TableStructureDisplay structure={tableStructure} />

          {!envWriter.envWritten ? (
            <EnvVariablesDisplay
              variables={[
                { name: "VITE_AIRTABLE_API_KEY", value: airtableApiKey },
                { name: "VITE_AIRTABLE_BASE_ID", value: airtableBaseId },
                { name: "VITE_AIRTABLE_TABLE_ID", value: airtableTableId },
              ]}
              title="Environment Variables"
              description="Click 'Save to .env' to write these values to your .env file:"
            />
          ) : (
            <EnvVariablesDisplay
              variables={[
                { name: "VITE_AIRTABLE_API_KEY", value: airtableApiKey },
                { name: "VITE_AIRTABLE_BASE_ID", value: airtableBaseId },
                { name: "VITE_AIRTABLE_TABLE_ID", value: airtableTableId },
              ]}
              title="Environment Variables Saved"
              description="These values have been written to your .env file:"
              showRestartWarning={true}
            />
          )}
        </>
      )}

      {/* Navigation buttons */}
      {activeStep > 0 && activeStep < 3 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleBack}>Back</Button>
          <Box />
        </Box>
      )}
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

  // Auto-sync configuration when dialog opens
  useEffect(() => {
    if (open) {
      const syncConfig = async () => {
        try {
          const { syncConfiguration } = await import("../../services/configService");
          const result = await syncConfiguration();
          if (result.success) {
            // Refetch after successful sync
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
