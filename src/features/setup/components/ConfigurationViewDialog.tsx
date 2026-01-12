import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { ResetConfirmDialog } from "./ResetConfirmDialog";

interface ConfigurationViewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onReset: () => Promise<void>;
  sectionName: string;
  resetInProgress?: boolean;
}

/**
 * Generic dialog wrapper for viewing configuration in read-only mode
 */
export const ConfigurationViewDialog = ({
  open,
  onClose,
  title,
  children,
  onReset,
  sectionName,
  resetInProgress = false,
}: ConfigurationViewDialogProps) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const handleResetConfirm = async () => {
    try {
      await onReset();
      setResetDialogOpen(false);
      onClose(); // Close the view dialog after successful reset
    } catch {
      // Error is handled by the hook
      setResetDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
            maxWidth: "1200px",
            height: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DialogTitle sx={{ flexShrink: 0 }}>{title}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ flexShrink: 0, justifyContent: "space-between", p: 2 }}>
          <Button onClick={handleResetClick} color="warning" variant="outlined">
            Reset Configuration
          </Button>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ResetConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetConfirm}
        sectionName={sectionName}
        resetting={resetInProgress}
      />
    </>
  );
};
