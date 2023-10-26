import {
  PropsWithChildren,
  createContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CreateSpendingItem, SpendingItem } from "@src/types";
import {
  useCreateSpendingItem,
  useDeleteSpendingItem,
  useFetchSpendingItems,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { useAuth } from "../auth/useAuth";
import { useSearchParams } from "react-router-dom";
import { CreateSpendingForm } from "@src/components/spending-editor-dialog/CreateSpendingForm";
import { UpdateSpendingForm } from "@src/components/spending-editor-dialog/UpdateSpendingForm";
import { DeleteSpendingConfirmation } from "@src/components/spending-editor-dialog/DeleteSpendingConfirmation";

type DialogMode = "add" | "edit" | "delete" | null;

type SpendingEditorContextType = {
  spendingEditItem: SpendingItem | null;
  dialogMode: DialogMode;
  openAddDialog: () => void;
  openEditDialog: (item: SpendingItem) => void;
  openDeleteDialog: (item: SpendingItem) => void;
  closeDialog: () => void;
};

export const SpendingEditorContext = createContext<SpendingEditorContextType>({
  spendingEditItem: null,
  dialogMode: null,
  openAddDialog: () => {},
  openEditDialog: () => {},
  openDeleteDialog: () => {},
  closeDialog: () => {},
});

export function SpendingEditorProvider({ children }: PropsWithChildren) {
  const [params, setParams] = useSearchParams();

  const { user } = useAuth();

  const [spendingDeleteItem, setSpendingDeleteItem] =
    useState<SpendingItem | null>(null);

  const dialogMode = useMemo(
    () => params.get("dialogMode") as DialogMode,
    [params]
  );

  const spendingItemId = useMemo(() => params.get("spendingItemId"), [params]);

  const { refetchSpendingItems } = useFetchSpendingItems(
    { user_id: user?.id },
    { enabled: !!user?.id }
  );

  const { createSpendingItem, isCreatingSpendingItem, isSpendingItemCreated } =
    useCreateSpendingItem();

  const { updateSpendingItem, isUpdatingSpendingItem, isSpendingItemUpdated } =
    useUpdateSpendingItem();

  const { deleteSpendingItem, isDeletingSpendingItem, isSpendingItemDeleted } =
    useDeleteSpendingItem();

  function openAddDialog() {
    // navigate to add the dialogMode query param
    setParams({ dialogMode: "add" });
  }

  function openEditDialog(item: SpendingItem) {
    // navigate to add the dialogMode query param
    setParams({ dialogMode: "edit", spendingItemId: item.id });
    // setSpendingEditItem(item);
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

  // Refetch spending items after a spending item is created or updated
  // This will update the spending items list and the spending items chart
  useEffect(() => {
    if (
      isSpendingItemCreated ||
      isSpendingItemUpdated ||
      isSpendingItemDeleted
    ) {
      refetchSpendingItems();
      closeDialog();
    }
  }, [
    isSpendingItemCreated,
    isSpendingItemUpdated,
    isSpendingItemDeleted,
    refetchSpendingItems,
    closeDialog,
  ]);

  return (
    <SpendingEditorContext.Provider
      value={{
        spendingEditItem: spendingDeleteItem,
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
        isOpen={dialogMode === "edit" && !!spendingItemId}
        spendingItemId={spendingItemId}
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
