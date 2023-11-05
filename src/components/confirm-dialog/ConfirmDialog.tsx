import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { ComponentProps, useCallback } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmBtnLabel?: string;
  confirmBtnVariant?: ComponentProps<typeof Button>["variant"];
  confirmBtnColor?: ComponentProps<typeof Button>["color"];
  onCancel: () => void;
  cancelBtnLabel?: string;
  cancelBtnVariant?: ComponentProps<typeof Button>["variant"];
  cancelBtnColor?: ComponentProps<typeof Button>["color"];
  loading?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscapeKeyPress?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  confirmBtnLabel = "Confirm",
  confirmBtnVariant = "contained",
  confirmBtnColor = "primary",
  onCancel,
  cancelBtnLabel = "Cancel",
  cancelBtnVariant = "text",
  cancelBtnColor = "primary",
  loading = false,
  closeOnOutsideClick = true,
  closeOnEscapeKeyPress = true,
}: ConfirmDialogProps) {
  const handleClose = useCallback(
    (e: object, reason: string) => {
      if (reason === "backdropClick" && !closeOnOutsideClick) {
        return;
      } else if (reason === "escapeKeyDown" && !closeOnEscapeKeyPress) {
        return;
      }

      onCancel();
    },
    [closeOnEscapeKeyPress, closeOnOutsideClick, onCancel]
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>

        <DialogActions sx={{ mt: 2, pr: 0 }}>
          <Button
            onClick={onCancel}
            variant={cancelBtnVariant}
            color={cancelBtnColor}
            size="small"
            disabled={loading}
          >
            {cancelBtnLabel}
          </Button>
          <Button
            onClick={onConfirm}
            variant={confirmBtnVariant}
            color={confirmBtnColor}
            size="small"
            disabled={loading}
          >
            {confirmBtnLabel}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
