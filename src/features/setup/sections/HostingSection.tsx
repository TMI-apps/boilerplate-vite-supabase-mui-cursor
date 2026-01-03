import { useState } from "react";
import { Box, Alert, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { SetupCard } from "../components/SetupCard";
import { SetupDialog } from "../components/SetupDialog";
import { updateSetupSectionStatus, getSetupSectionsState } from "@utils/setupUtils";
import type { SetupStatus } from "@utils/setupUtils";

interface HostingSectionProps {
  onStatusChange?: () => void;
}

export const HostingCard = ({ onStatusChange }: HostingSectionProps) => {
  const state = getSetupSectionsState();
  const status: SetupStatus = state.hosting;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <SetupCard
        title="Configure Hosting"
        description="Learn how to configure environment variables on your hosting provider for production deployment."
        status={status}
        onClick={() => setDialogOpen(true)}
      />
      <HostingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

interface HostingDialogProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

const HostingDialog = ({ open, onClose, onStatusChange }: HostingDialogProps) => {
  const handleSave = () => {
    updateSetupSectionStatus("hosting", "completed");
    onStatusChange?.();
  };

  const handleSkip = () => {
    updateSetupSectionStatus("hosting", "skipped");
    onStatusChange?.();
    onClose();
  };

  return (
    <SetupDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
      title="Configure Frontend Hosting"
      saveButtonText="Mark as Complete"
    >
      <Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          For production deployment, you'll need to configure environment variables on your hosting
          provider. Select your hosting provider below to view their documentation:
        </Typography>

        <Box sx={{ mt: 3 }}>
          <List>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://vercel.com/docs/concepts/projects/environment-variables"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    Vercel
                  </Typography>
                }
                secondary="Configure environment variables in Vercel dashboard"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://docs.netlify.com/environment-variables/overview/"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    Netlify
                  </Typography>
                }
                secondary="Configure environment variables in Netlify dashboard"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    Cloudflare Pages
                  </Typography>
                }
                secondary="Configure environment variables in Cloudflare dashboard"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://firebase.google.com/docs/hosting/environment-variables"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    Firebase Hosting
                  </Typography>
                }
                secondary="Configure environment variables for Firebase Hosting"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://docs.github.com/en/actions/security-guides/encrypted-secrets"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    GitHub Pages
                  </Typography>
                }
                secondary="Configure secrets in GitHub Actions"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    AWS Amplify
                  </Typography>
                }
                secondary="Configure environment variables in AWS Amplify console"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    component="a"
                    href="https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings"
                    target="_blank"
                    rel="noopener"
                    sx={{ color: "primary.main", textDecoration: "underline" }}
                  >
                    Azure Static Web Apps
                  </Typography>
                }
                secondary="Configure application settings in Azure Portal"
              />
            </ListItem>
          </List>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Variables to configure:</strong> Add these environment variables on your hosting
            provider:
          </Typography>
          <Box
            component="pre"
            sx={{ mt: 1, p: 1, bgcolor: "grey.100", borderRadius: 1, fontSize: "0.875rem" }}
          >
            VITE_SUPABASE_URL=your-project-url{"\n"}
            VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
          </Box>
        </Alert>

        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleSkip} color="inherit">
            Skip Hosting Setup
          </Button>
        </Box>
      </Box>
    </SetupDialog>
  );
};
