import {
  PropsWithChildren,
  createContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { CreateSpendingItem, SpendingItem } from "@src/types";
import {
  useCreateSpendingItem,
  useFetchSpendingItems,
  useUpdateSpendingItem,
} from "@src/api/spending-items";
import { useAuth } from "../auth/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CreateSpendingForm } from "@src/components/spending-editor-dialog/CreateSpendingForm";
import { UpdateSpendingForm } from "@src/components/spending-editor-dialog/UpdateSpendingForm";

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
  const navigate = useNavigate();
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

  function closeDialog() {
    // navigate back to remove the dialogMode query param
    navigate(-1);
    setSpendingDeleteItem(null);
  }

  function handleAddSpendingItem(item: CreateSpendingItem) {
    createSpendingItem(item);
  }

  function handleEditSpendingItem(item: SpendingItem) {
    updateSpendingItem(item);
  }

  // Refetch spending items after a spending item is created or updated
  // This will update the spending items list and the spending items chart
  useEffect(() => {
    if (isSpendingItemCreated || isSpendingItemUpdated) {
      refetchSpendingItems();
      closeDialog();
    }
  }, [isSpendingItemCreated, isSpendingItemUpdated, refetchSpendingItems]);

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

      {children}
    </SpendingEditorContext.Provider>
  );
}
