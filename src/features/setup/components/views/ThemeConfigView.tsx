import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import type { ThemeConfiguration } from "../../types/config.types";

interface ThemeConfigViewProps {
  config: ThemeConfiguration | null;
  loading: boolean;
  error: string | null;
}

/**
 * View component for Theme configuration
 */
export const ThemeConfigView = ({ config, loading, error }: ThemeConfigViewProps) => {
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

  if (!config) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Theme configuration not found.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Your application theme configuration:
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Theme Status
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body1">Custom Theme</Typography>
              <Chip
                icon={config.hasCustomTheme ? <CheckCircle /> : <Cancel />}
                label={config.hasCustomTheme ? "Active" : "Not Active"}
                color={config.hasCustomTheme ? "success" : "default"}
              />
            </Box>
          </CardContent>
        </Card>

        {config.hasCustomTheme ? (
          <>
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                A custom theme is currently active. Your application is using your custom MUI theme
                configuration.
              </Typography>
            </Alert>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              The custom theme is stored in <code>localStorage</code> under the key{" "}
              <strong>customTheme</strong>. To modify the theme, you'll need to reset this
              configuration and reconfigure it.
            </Typography>
          </>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Using the default theme. You can customize your theme by setting up a custom theme
              configuration.
            </Typography>
          </Alert>
        )}
      </Box>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> To modify the theme, you'll need to reset this configuration and
          set it up again with your new theme JSON.
        </Typography>
      </Alert>
    </Box>
  );
};
