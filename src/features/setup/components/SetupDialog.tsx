import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import { Save } from "@mui/icons-material";

interface SetupDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  title: string;
  children: React.ReactNode;
  saveButtonText?: string;
  saveButtonDisabled?: boolean;
  showCancel?: boolean;
  closeOnSave?: boolean;
  additionalActions?: React.ReactNode;
}

export const SetupDialog = ({
  open,
  onClose,
  onSave,
  title,
  children,
  saveButtonText = "Save",
  saveButtonDisabled = false,
  showCancel = true,
  closeOnSave = true,
  additionalActions,
}: SetupDialogProps) => {
  const handleSave = async () => {
    await onSave();
    if (closeOnSave) {
      onClose();
    }
  };

  return (
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
        <Box>{additionalActions}</Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {showCancel && (
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveButtonDisabled}
            startIcon={<Save />}
          >
            {saveButtonText}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
