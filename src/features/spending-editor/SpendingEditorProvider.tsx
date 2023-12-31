import { PropsWithChildren, createContext, useState } from "react";
import { QUERY_KEY, SpendingItem } from "@src/types";
import {
  useCreateSpendingItem,
  useDeleteSpendingItem,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { CreateSpendingForm } from "@src/components/spending-editor-dialog/CreateSpendingForm";
import { UpdateSpendingForm } from "@src/components/spending-editor-dialog/UpdateSpendingForm";
import { DeleteSpendingConfirmation } from "@src/components/spending-editor-dialog/DeleteSpendingConfirmation";
import { useQueryClient } from "react-query";
import { useSnackbar } from "../snackbars/useSnackbar";

type DialogMode = "add" | "edit" | "delete" | null;

type SpendingEditorContextType = {
  dialogMode: DialogMode;
  openAddDialog: () => void;
  openEditDialog: (item: SpendingItem) => void;
  openDeleteDialog: (item: SpendingItem) => void;
  closeDialog: () => void;
};

export const SpendingEditorContext = createContext<SpendingEditorContextType>({
  dialogMode: null,
  openAddDialog: () => {},
  openEditDialog: () => {},
  openDeleteDialog: () => {},
  closeDialog: () => {},
});

export function SpendingEditorProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [spendingEditItem, setSpendingEditItem] = useState<SpendingItem | null>(
    null
  );
  const [spendingDeleteItem, setSpendingDeleteItem] =
    useState<SpendingItem | null>(null);

  function invalidateQueryAndClose() {
    queryClient.invalidateQueries(QUERY_KEY.spending_items);
    closeDialog();
  }

  function openAddDialog() {
    setDialogMode("add");
  }

  function openEditDialog(item: SpendingItem) {
    setDialogMode("edit");
    setSpendingEditItem(item);
  }

  function openDeleteDialog(item: SpendingItem) {
    setSpendingDeleteItem(item);
  }

  function closeDialog() {
    setDialogMode(null);
    setSpendingDeleteItem(null);
    setSpendingEditItem(null);
  }

  const { createSpendingItem, isCreatingSpendingItem } = useCreateSpendingItem({
    onSuccess: () => {
      invalidateQueryAndClose();
      openSnackbar("Item created", "success", 4000);
    },
    onError: () => {
      openSnackbar("Error creating item", "error");
    },
  });

  const { updateSpendingItem, isUpdatingSpendingItem } = useUpdateSpendingItem({
    onSuccess: () => {
      invalidateQueryAndClose();
      openSnackbar("Item updated", "success", 4000);
    },
    onError: () => {
      openSnackbar("Error updating item", "error");
    },
  });

  const { deleteSpendingItem, isDeletingSpendingItem } = useDeleteSpendingItem({
    onSuccess: () => {
      invalidateQueryAndClose();
      openSnackbar("Item deleted", "success", 4000);
    },
    onError: () => {
      openSnackbar("Error deleting item", "error");
    },
  });

  return (
    <SpendingEditorContext.Provider
      value={{
        dialogMode,
        openAddDialog,
        openEditDialog,
        openDeleteDialog,
        closeDialog,
      }}
    >
      <CreateSpendingForm
        isOpen={dialogMode === "add"}
        onSubmit={createSpendingItem}
        onClose={closeDialog}
        isCreatingSpendingItem={isCreatingSpendingItem}
      />

      <UpdateSpendingForm
        isOpen={dialogMode === "edit" && !!spendingEditItem}
        spendingItem={spendingEditItem}
        onSubmit={updateSpendingItem}
        onClose={closeDialog}
        isUpdatingSpendingItem={isUpdatingSpendingItem}
      />

      <DeleteSpendingConfirmation
        isOpen={!!spendingDeleteItem}
        spendingItem={spendingDeleteItem}
        onConfirm={(item) => deleteSpendingItem(item.id)}
        onClose={closeDialog}
        isDeletingSpendingItem={isDeletingSpendingItem}
      />

      {children}
    </SpendingEditorContext.Provider>
  );
}
