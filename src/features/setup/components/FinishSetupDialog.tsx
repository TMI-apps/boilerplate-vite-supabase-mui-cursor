import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
} from "@mui/material";
import { getEnabledFeatures } from "@utils/setupUtils";

interface FinishSetupDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  finishing: boolean;
}

export const FinishSetupDialog = ({
  open,
  onClose,
  onConfirm,
  finishing,
}: FinishSetupDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Finish Setup</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to finish setup? This action is <strong>irreversible</strong> and
          will:
        </DialogContentText>
        <Box component="ul" sx={{ mt: 2, pl: 3 }}>
          <li>
            <DialogContentText component="span">
              Delete all setup code (SetupPage, setupUtils, cleanup scripts)
            </DialogContentText>
          </li>
          <li>
            <DialogContentText component="span">
              Delete all code for features that were <strong>not enabled</strong>
            </DialogContentText>
          </li>
          <li>
            <DialogContentText component="span">
              Update App.tsx and other files to remove unused imports and routes
            </DialogContentText>
          </li>
        </Box>
        <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
          <DialogContentText>
            <strong>Enabled features:</strong> {getEnabledFeatures().join(", ") || "None"}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={finishing}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={finishing}>
          {finishing ? "Finishing..." : "Finish Setup"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
