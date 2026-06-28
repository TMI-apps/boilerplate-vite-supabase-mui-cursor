import Dialog, { type DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export interface ModalProps extends Omit<MuiDialogProps, "open"> {
  open: boolean;
  title?: string;
  actions?: React.ReactNode;
}

export const Modal = ({ open, title, children, actions, onClose, ...props }: ModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} {...props}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
