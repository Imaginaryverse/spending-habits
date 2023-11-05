import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContentText,
  Paper,
  Typography,
} from "@mui/material";
import { SpendingItem } from "@src/types";
import { SpendingEditorDialog } from "./SpendingEditorDialog";
import { formatDate } from "@src/utils/date-utils";

type DeleteSpendingConfirmationProps = {
  isOpen: boolean;
  onConfirm: (item: SpendingItem) => void;
  onClose: () => void;
  spendingItem: SpendingItem | null;
  isDeletingSpendingItem: boolean;
};

export function DeleteSpendingConfirmation({
  isOpen,
  onConfirm,
  onClose,
  spendingItem,
  isDeletingSpendingItem,
}: DeleteSpendingConfirmationProps) {
  if (!spendingItem) {
    return null;
  }

  return (
    <SpendingEditorDialog
      open={isOpen}
      title="Delete spending?"
      onClose={onClose}
    >
      <DialogContentText>
        Are you sure you want to delete this item?
      </DialogContentText>

      <Paper elevation={1} sx={{ p: 2, my: 3 }}>
        <Typography fontWeight="bold">
          {spendingItem.title} - {spendingItem.amount} kr
        </Typography>

        <Typography variant="caption">
          {formatDate(spendingItem.created_at, "ddd, MMM D YYYY, HH:mm")}
        </Typography>
      </Paper>

      <DialogActions sx={{ pr: 0 }}>
        <Button
          size="small"
          onClick={onClose}
          disabled={isDeletingSpendingItem}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => onConfirm(spendingItem)}
          disabled={isDeletingSpendingItem}
        >
          {isDeletingSpendingItem ? (
            <CircularProgress size="1.5rem" />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </SpendingEditorDialog>
  );
}
