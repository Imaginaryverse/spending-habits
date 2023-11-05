import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { PropsWithChildren } from "react";

type SpendingEditorDialogProps = {
  open: boolean;
  title: string;
  onClose: (reason?: "backdropClick" | "escapeKeyDown") => void;
};

export function SpendingEditorDialog({
  open,
  title,
  onClose,
  children,
}: PropsWithChildren<SpendingEditorDialogProps>) {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => onClose(reason)}
      fullWidth
      sx={{ "& .MuiDialog-paper": { maxWidth: 400 } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
