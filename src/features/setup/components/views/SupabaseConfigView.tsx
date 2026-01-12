import { Box, Typography, Alert, CircularProgress, Divider } from "@mui/material";
import { ConfigurationItem } from "../ConfigurationItem";
import { SensitiveDataDisplay } from "../SensitiveDataDisplay";
import type { SupabaseConfiguration } from "../../types/config.types";

interface SupabaseConfigViewProps {
  config: SupabaseConfiguration | null;
  loading: boolean;
  error: string | null;
}

/**
 * View component for Supabase configuration
 */
export const SupabaseConfigView = ({ config, loading, error }: SupabaseConfigViewProps) => {
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
        Supabase is not configured. Please complete the setup first.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Your Supabase connection is configured with the following settings:
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {config.url && (
          <ConfigurationItem
            label="Project URL"
            value={config.url}
            canCopy={true}
            helpText="Your Supabase project URL"
          />
        )}

        <SensitiveDataDisplay
          label="API Key"
          isSet={config.keyKey?.set ?? false}
          keyName={config.keyKey?.name ?? "VITE_SUPABASE_PUBLISHABLE_KEY"}
          helpText={
            config.keyKey?.name === "VITE_SUPABASE_PUBLISHABLE_KEY"
              ? "Publishable key (recommended)"
              : "Anonymous key (legacy)"
          }
        />

        <SensitiveDataDisplay
          label="Project URL Key"
          isSet={config.urlKey?.set ?? false}
          keyName={config.urlKey?.name ?? "VITE_SUPABASE_URL"}
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
