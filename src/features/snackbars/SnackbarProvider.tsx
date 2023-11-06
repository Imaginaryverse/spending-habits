import {
  ComponentProps,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, Slide, Snackbar, SnackbarCloseReason } from "@mui/material";

type SnackbarType = "success" | "error" | "warning" | "info";

type AlertVariant = ComponentProps<typeof Alert>["variant"];

type SnackbarContextType = {
  openSnackbar: (
    message: string,
    type: SnackbarType,
    duration?: number,
    variant?: AlertVariant
  ) => void;
  closeSnackbar: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType>({
  openSnackbar: () => {},
  closeSnackbar: () => {},
});

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<SnackbarType>("info");
  const [alertVariant, setAlertVariant] = useState<AlertVariant>("standard");
  const [snackbarDuration, setSnackbarDuration] = useState<number | undefined>(
    undefined
  );

  const openSnackbar = useCallback(
    (
      message: string,
      type: SnackbarType = "info",
      duration: number | undefined = undefined,
      variant: AlertVariant = "standard"
    ) => {
      setSnackbarMessage(message);
      if (type !== snackbarType) {
        setSnackbarType(type);
      }

      if (duration !== snackbarDuration) {
        setSnackbarDuration(duration);
      }

      if (variant !== alertVariant) {
        setAlertVariant(variant ?? "standard");
      }

      setOpen(true);
    },
    [snackbarType, snackbarDuration, alertVariant]
  );

  const handleClose = useCallback((reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  }, []);

  const resetSnackbar = useCallback(async () => {
    // short delay to allow the snackbar to close
    // this prevents the snackbar's size from changing while it's closing

    await new Promise((resolve) => setTimeout(resolve, 200));

    if (snackbarMessage !== "") {
      setSnackbarMessage("");
    }

    if (snackbarType !== "info") {
      setSnackbarType("info");
    }

    if (snackbarDuration !== undefined) {
      setSnackbarDuration(undefined);
    }

    if (alertVariant !== "standard") {
      setAlertVariant("standard");
    }
  }, [snackbarMessage, snackbarType, snackbarDuration, alertVariant]);

  useEffect(() => {
    if (!open) {
      resetSnackbar();
    }
  }, [open, resetSnackbar]);

  return (
    <SnackbarContext.Provider
      value={{ openSnackbar, closeSnackbar: handleClose }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={snackbarDuration}
        onClose={(_, reason) => handleClose(reason)}
      >
        <Slide in={open} direction="up" mountOnEnter unmountOnExit>
          <Alert
            variant={alertVariant}
            severity={snackbarType}
            elevation={6}
            onClose={() => handleClose()}
            sx={{ width: "100%", maxWidth: 360 }}
          >
            {snackbarMessage}
          </Alert>
        </Slide>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
