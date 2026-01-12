import { Box, Typography, Alert, CircularProgress, Divider } from "@mui/material";
import { ConfigurationItem } from "../ConfigurationItem";
import { SensitiveDataDisplay } from "../SensitiveDataDisplay";
import type { AirtableConfiguration } from "../../types/config.types";

interface AirtableConfigViewProps {
  config: AirtableConfiguration | null;
  loading: boolean;
  error: string | null;
}

/**
 * View component for Airtable configuration
 */
export const AirtableConfigView = ({ config, loading, error }: AirtableConfigViewProps) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!config || !config.configured) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Airtable is not configured. Please complete the setup first.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Your Airtable connection is configured with the following settings:
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Base & Table Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {config.baseId && (
          <ConfigurationItem
            label="Base ID"
            value={config.baseId}
            canCopy={true}
            helpText="Your Airtable base identifier"
          />
        )}

        {config.tableId && (
          <ConfigurationItem
            label="Table ID"
            value={config.tableId}
            canCopy={true}
            helpText="The name of your table"
          />
        )}

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Authentication
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <SensitiveDataDisplay
          label="Personal Access Token"
          isSet={config.apiKey?.set ?? false}
          keyName={config.apiKey?.name ?? "VITE_AIRTABLE_API_KEY"}
          helpText="Your Airtable PAT with required scopes"
        />
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> To modify these settings, you'll need to reset this configuration
          and set it up again.
        </Typography>
      </Alert>
    </Box>
  );
};
