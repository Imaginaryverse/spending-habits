import { Close } from "@mui/icons-material";
import { Dialog, IconButton, Stack, Typography } from "@mui/material";
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
    <Dialog open={open} onClose={(_, reason) => onClose(reason)} fullWidth>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
      >
        <Typography variant="h4">{title}</Typography>
        <IconButton size="small" onClick={() => onClose()}>
          <Close fontSize="small" />
        </IconButton>
      </Stack>

      {children}
    </Dialog>
  );
}
