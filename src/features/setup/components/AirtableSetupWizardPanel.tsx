import { Box, Typography, Button, Stepper, Step, StepLabel } from "@mui/material";
import { EnvVariablesDisplay } from "./EnvVariablesDisplay";
import { AirtableFormFields } from "./AirtableFormFields";
import { AirtableDescription } from "./AirtableDescription";
import { AirtablePatInstructions } from "./AirtablePatInstructions";
import { TableStructureDisplay } from "./TableStructureDisplay";
import type { AirtableTableStructure } from "@shared/services/airtableService";

const AIRTABLE_ENV_VARS = (
  apiKey: string,
  baseId: string,
  tableId: string
): { name: string; value: string }[] => [
  { name: "VITE_AIRTABLE_API_KEY", value: apiKey },
  { name: "VITE_AIRTABLE_BASE_ID", value: baseId },
  { name: "VITE_AIRTABLE_TABLE_ID", value: tableId },
];

interface ValidateStepProps {
  tableStructure: AirtableTableStructure | null;
  loadingStructure: boolean;
  structureError: string | null;
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
  fetchTableStructure: (apiKey: string, baseId: string, tableId: string) => Promise<void>;
  onBack: () => void;
}

function AirtableValidateConnectionStep({
  tableStructure,
  loadingStructure,
  structureError,
  airtableApiKey,
  airtableBaseId,
  airtableTableId,
  fetchTableStructure,
  onBack,
}: ValidateStepProps) {
  return (
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
          <Button variant="outlined" onClick={onBack} sx={{ mr: 1 }}>
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
  );
}

interface CompleteStepProps {
  tableStructure: AirtableTableStructure | null;
  envWritten: boolean;
  airtableApiKey: string;
  airtableBaseId: string;
  airtableTableId: string;
}

function AirtableCompleteSetupStep({
  tableStructure,
  envWritten,
  airtableApiKey,
  airtableBaseId,
  airtableTableId,
}: CompleteStepProps) {
  const vars = AIRTABLE_ENV_VARS(airtableApiKey, airtableBaseId, airtableTableId);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Setup Complete
      </Typography>
      <TableStructureDisplay structure={tableStructure} />
      {!envWritten ? (
        <EnvVariablesDisplay
          variables={vars}
          title="Environment Variables"
          description="Click 'Save to .env' to write these values to your .env file:"
        />
      ) : (
        <EnvVariablesDisplay
          variables={vars}
          title="Environment Variables Saved"
          description="These values have been written to your .env file:"
          showRestartWarning={true}
        />
      )}
    </>
  );
}

export interface AirtableSetupWizardPanelProps {
  readonly steps: readonly string[];
  readonly activeStep: number;
  readonly isFirstStep: boolean;
  readonly isLastStep: boolean;
  readonly airtableApiKey: string;
  readonly setAirtableApiKey: (v: string) => void;
  readonly airtableBaseId: string;
  readonly setAirtableBaseId: (v: string) => void;
  readonly airtableTableId: string;
  readonly setAirtableTableId: (v: string) => void;
  readonly tableStructure: AirtableTableStructure | null;
  readonly loadingStructure: boolean;
  readonly structureError: string | null;
  readonly envWritten: boolean;
  readonly fetchTableStructure: (apiKey: string, baseId: string, tableId: string) => Promise<void>;
  readonly handleBack: () => void;
}

/**
 * Step UI for the Airtable setup wizard (presentation only).
 */
export function AirtableSetupWizardPanel({
  steps,
  activeStep,
  isFirstStep,
  isLastStep,
  airtableApiKey,
  setAirtableApiKey,
  airtableBaseId,
  setAirtableBaseId,
  airtableTableId,
  setAirtableTableId,
  tableStructure,
  loadingStructure,
  structureError,
  envWritten,
  fetchTableStructure,
  handleBack,
}: AirtableSetupWizardPanelProps) {
  return (
    <>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <AirtablePatInstructions apiKey={airtableApiKey} onApiKeyChange={setAirtableApiKey} />
      )}

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

      {activeStep === 2 && (
        <AirtableValidateConnectionStep
          tableStructure={tableStructure}
          loadingStructure={loadingStructure}
          structureError={structureError}
          airtableApiKey={airtableApiKey}
          airtableBaseId={airtableBaseId}
          airtableTableId={airtableTableId}
          fetchTableStructure={fetchTableStructure}
          onBack={handleBack}
        />
      )}

      {activeStep === 3 && (
        <AirtableCompleteSetupStep
          tableStructure={tableStructure}
          envWritten={envWritten}
          airtableApiKey={airtableApiKey}
          airtableBaseId={airtableBaseId}
          airtableTableId={airtableTableId}
        />
      )}

      {!isFirstStep && !isLastStep && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleBack}>Back</Button>
          <Box />
        </Box>
      )}
    </>
  );
}
