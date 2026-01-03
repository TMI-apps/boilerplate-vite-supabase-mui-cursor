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
}: SetupDialogProps) => {
  const handleSave = async () => {
    await onSave();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>{children}</Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
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
          sx={{ ml: "auto" }}
        >
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
