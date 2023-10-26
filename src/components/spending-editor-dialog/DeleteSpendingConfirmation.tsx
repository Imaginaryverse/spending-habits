import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { SpendingItem } from "@src/types";
import { SpendingEditorDialog } from "./SpendingEditorDialog";

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
      <DialogContent>
        <Stack spacing={2}>
          <Typography>Are you sure you want to delete this item?</Typography>

          <Typography>
            {spendingItem.title} ({spendingItem.amount} kr)
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isDeletingSpendingItem}>
          Cancel
        </Button>
        <Button
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
