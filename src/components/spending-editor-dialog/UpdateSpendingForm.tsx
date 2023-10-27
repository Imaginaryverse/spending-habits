import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { SpendingItem, SpendingItemInput } from "@src/types";
import { SpendingEditorDialog } from "./SpendingEditorDialog";
import {
  Button,
  CircularProgress,
  FormGroup,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@src/utils/local-storage-utils";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";

type UpdateSpendingFormProps = {
  isOpen: boolean;
  spendingItem: SpendingItem | null;
  onSubmit: (item: SpendingItem) => void;
  onClose: () => void;
  isUpdatingSpendingItem: boolean;
};

export const UpdateSpendingForm = ({
  isOpen,
  spendingItem,
  onSubmit,
  onClose,
  isUpdatingSpendingItem,
}: UpdateSpendingFormProps) => {
  const { spendingCategories } = useSpendings();

  const initialInput: SpendingItemInput = {
    title: spendingItem?.title ?? "",
    comment: spendingItem?.comment ?? "",
    category_id: spendingItem?.category_id ?? spendingCategories[0]?.id ?? 1,
    amount: spendingItem?.amount ?? 0,
    created_at: dayjs(spendingItem?.created_at ?? null),
  };

  const [input, setInput] = useState<SpendingItemInput>(initialInput);

  function resetForm() {
    setInput(initialInput);
  }

  const disableSubmit = !spendingItem || isUpdatingSpendingItem;

  function updateInput(key: keyof SpendingItemInput, value: unknown) {
    const MAX_TITLE_LENGTH = 20;

    if (key === "title" && String(value).length > MAX_TITLE_LENGTH) {
      return;
    }

    if (key === "amount" && Number.isNaN(Number(value))) {
      return;
    }

    setInput({
      ...input,
      [key]: value,
    });
    saveToLocalStorage("update-spending-item-input", {
      ...input,
      [key]: value,
    });
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!spendingItem) {
      return;
    }

    onSubmit({
      ...spendingItem,
      ...input,
      created_at: input.created_at?.toDate() ?? new Date(),
    });
  }

  function handleClose(reason?: string) {
    if (reason === "backdropClick") {
      return;
    }

    resetForm();
    onClose();
  }

  useEffect(() => {
    const currentInput = getFromLocalStorage<SpendingItemInput>(
      "update-spending-item-input"
    );

    if (currentInput) {
      setInput(currentInput);
    }
  }, []);

  useEffect(() => {
    if (spendingItem) {
      const item = {
        ...spendingItem,
        created_at: dayjs(spendingItem.created_at),
      };

      setInput(item);
      saveToLocalStorage("update-spending-item-input", item);
    }
  }, [spendingItem]);

  return (
    <SpendingEditorDialog
      open={isOpen}
      onClose={handleClose}
      title="Update spending"
    >
      <Stack
        direction="column"
        component="form"
        onSubmit={handleSave}
        autoComplete="off"
        spacing={1}
        px={2}
        pb={2}
      >
        <FormGroup>
          <FormLabel htmlFor="title">Title</FormLabel>
          <TextField
            id="title"
            value={input.title}
            onChange={(e) => updateInput("title", e.target.value)}
            disabled={isUpdatingSpendingItem}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="comment">Comment</FormLabel>
          <TextField
            id="comment"
            value={input.comment}
            onChange={(e) => updateInput("comment", e.target.value)}
            disabled={isUpdatingSpendingItem}
          />
        </FormGroup>

        {!!spendingCategories.length && (
          <FormGroup>
            <FormLabel htmlFor="category">Category</FormLabel>
            <TextField
              id="category"
              select
              value={input.category_id}
              onChange={(e) =>
                setInput({ ...input, category_id: Number(e.target.value) })
              }
              disabled={isUpdatingSpendingItem}
            >
              {spendingCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </FormGroup>
        )}

        <FormGroup>
          <FormLabel htmlFor="amount">Amount</FormLabel>
          <TextField
            id="amount"
            value={input.amount}
            onChange={(e) => updateInput("amount", Number(e.target.value))}
            disabled={isUpdatingSpendingItem}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="created_at">Date</FormLabel>
          <DateTimePicker
            value={dayjs(input.created_at)}
            onChange={(date) => updateInput("created_at", date)}
            referenceDate={dayjs(new Date())}
            slotProps={{ textField: { id: "created_at" } }}
            disabled={isUpdatingSpendingItem}
          />

          <Typography variant="caption" mt={0.5} ml={2}>
            Defaults to current date and time
          </Typography>
        </FormGroup>

        <Button
          type="submit"
          variant={isUpdatingSpendingItem ? "text" : "contained"}
          disabled={disableSubmit}
          fullWidth
        >
          {isUpdatingSpendingItem ? <CircularProgress size="1.5rem" /> : "Save"}
        </Button>
      </Stack>
    </SpendingEditorDialog>
  );
};
