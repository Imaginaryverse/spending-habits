import {
  PropsWithChildren,
  createContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { CreateSpendingItem, SpendingItem } from "@src/types";
import {
  useCreateSpendingItem,
  useDeleteSpendingItem,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { useSearchParams } from "react-router-dom";
import { CreateSpendingForm } from "@src/components/spending-editor-dialog/CreateSpendingForm";
import { UpdateSpendingForm } from "@src/components/spending-editor-dialog/UpdateSpendingForm";
import { DeleteSpendingConfirmation } from "@src/components/spending-editor-dialog/DeleteSpendingConfirmation";
import { useSpendings } from "../spendings/useSpendingsProvider";
import { removeFromLocalStorage } from "@src/utils/local-storage-utils";

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
  const [params, setParams] = useSearchParams();

  const { refetchSpendingItems } = useSpendings();

  const [spendingEditItem, setSpendingEditItem] = useState<SpendingItem | null>(
    null
  );
  const [spendingDeleteItem, setSpendingDeleteItem] =
    useState<SpendingItem | null>(null);

  const dialogMode = useMemo(
    () => params.get("dialogMode") as DialogMode,
    [params]
  );

  function onMutationSuccess() {
    refetchSpendingItems();
    closeDialog();
    removeFromLocalStorage("update-spending-item-input");
    removeFromLocalStorage("create-spending-item-input");
  }

  function openAddDialog() {
    setParams({ dialogMode: "add" });
  }

  function openEditDialog(item: SpendingItem) {
    setParams({ dialogMode: "edit" });
    setSpendingEditItem(item);
  }

  function openDeleteDialog(item: SpendingItem) {
    setSpendingDeleteItem(item);
  }

  const closeDialog = useCallback(() => {
    setParams({}, { replace: true });
    setSpendingDeleteItem(null);
  }, [setParams]);

  function handleAddSpendingItem(item: CreateSpendingItem) {
    createSpendingItem(item);
  }

  function handleEditSpendingItem(item: SpendingItem) {
    updateSpendingItem(item);
  }

  function handleDeleteSpendingItem(item: SpendingItem) {
    deleteSpendingItem(item.id);
  }

  const { createSpendingItem, isCreatingSpendingItem } = useCreateSpendingItem({
    onSuccess: onMutationSuccess,
  });

  const { updateSpendingItem, isUpdatingSpendingItem } = useUpdateSpendingItem({
    onSuccess: onMutationSuccess,
  });

  const { deleteSpendingItem, isDeletingSpendingItem } = useDeleteSpendingItem({
    onSuccess: onMutationSuccess,
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
        onSubmit={handleAddSpendingItem}
        onClose={closeDialog}
        isCreatingSpendingItem={isCreatingSpendingItem}
      />

      <UpdateSpendingForm
        isOpen={dialogMode === "edit" && !!spendingEditItem}
        spendingItem={spendingEditItem}
        onSubmit={handleEditSpendingItem}
        onClose={closeDialog}
        isUpdatingSpendingItem={isUpdatingSpendingItem}
      />

      <DeleteSpendingConfirmation
        isOpen={!!spendingDeleteItem}
        spendingItem={spendingDeleteItem}
        onConfirm={handleDeleteSpendingItem}
        onClose={closeDialog}
        isDeletingSpendingItem={isDeletingSpendingItem}
      />

      {children}
    </SpendingEditorContext.Provider>
  );
}
