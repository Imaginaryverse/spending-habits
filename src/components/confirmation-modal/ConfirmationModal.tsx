import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  CircularProgress,
  Button,
  TextField,
  InputLabel,
} from "@mui/material";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  requiredInput?: string;
  confirmBtnLabel?: string;
  cancelBtnLabel?: string;
  closeOnOutsideClick?: boolean;
  closeOnEscapeKeyPress?: boolean;
};

export const ConfirmationModal = ({
  isOpen,
  title,
  description,
  isLoading,
  onConfirm,
  onCancel,
  requiredInput,
  confirmBtnLabel,
  cancelBtnLabel,
  closeOnOutsideClick = true,
  closeOnEscapeKeyPress = true,
}: ConfirmationModalProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue("");
  }, [isOpen, requiredInput]);

  const isInputValid = requiredInput ? inputValue === requiredInput : true;

  function handleClose(reason?: "backdropClick" | "escapeKeyDown") {
    if (isLoading) {
      return;
    }

    if (!closeOnOutsideClick && reason === "backdropClick") {
      return;
    }

    if (!closeOnEscapeKeyPress && reason === "escapeKeyDown") {
      return;
    }

    onCancel();
  }

  function handleConfirm() {
    if (isLoading) {
      return;
    }

    if (!isInputValid) {
      return;
    }

    onConfirm();
  }

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => handleClose(reason)}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
    >
      <DialogTitle id="confirmation-title">{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText id="confirmation-description">
            {description}
          </DialogContentText>

          {!!requiredInput && (
            <Stack spacing={1}>
              <InputLabel htmlFor="confirmation-input">
                Required input
              </InputLabel>

              <TextField
                id="confirmation-input"
                variant="outlined"
                value={inputValue}
                placeholder={`Enter "${requiredInput}" to confirm`}
                onChange={(e) => setInputValue(e.target.value)}
                error={inputValue.length > 0 && !isInputValid}
                fullWidth
              />
            </Stack>
          )}
        </Stack>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          height="5rem"
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleClose()}
                disabled={isLoading}
              >
                {cancelBtnLabel ?? "Cancel"}
              </Button>

              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={isLoading || !isInputValid}
              >
                {confirmBtnLabel ?? "Confirm"}
              </Button>
            </React.Fragment>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
