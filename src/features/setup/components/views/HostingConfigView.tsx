import { Box, Typography, Alert } from "@mui/material";

/**
 * View component for Hosting configuration
 * Currently hosting is instruction-only, so this is a placeholder
 */
export const HostingConfigView = () => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        Hosting configuration details:
      </Typography>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Hosting configuration is currently instruction-only and doesn't require environment
          variables or stored configuration.
        </Typography>
      </Alert>

      <Typography variant="body2" sx={{ mt: 3 }}>
        For hosting setup instructions, please refer to the hosting section in the setup wizard.
      </Typography>
    </Box>
  );
};
