import { useState, useMemo, useEffect } from "react";
import {
  Stack,
  Typography,
  FormGroup,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { CreateSpendingItem, SpendingItemInput } from "@src/types";
import dayjs from "dayjs";
import { SpendingEditorDialog } from "./SpendingEditorDialog";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "@src/utils/local-storage-utils";
import { useSpendings } from "@src/features/spendings/useSpendingsProvider";

type CreateSpendingFormProps = {
  isOpen: boolean;
  onSubmit: (item: CreateSpendingItem) => void;
  onClose: () => void;
  isCreatingSpendingItem: boolean;
};

export const CreateSpendingForm = ({
  isOpen,
  onSubmit,
  onClose,
  isCreatingSpendingItem,
}: CreateSpendingFormProps) => {
  const { spendingCategories } = useSpendings();

  const initialInput: SpendingItemInput = {
    title: "",
    comment: "",
    category_id: spendingCategories[0]?.id ?? 1,
    amount: 0,
    created_at: null,
  };

  const [input, setInput] = useState<SpendingItemInput>(initialInput);

  function resetForm() {
    setInput(initialInput);
  }

  const disableSubmit = useMemo(() => {
    return isCreatingSpendingItem || !input.title || input.amount < 1;
  }, [isCreatingSpendingItem, input.title, input.amount]);

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
    saveToLocalStorage("create-spending-item-input", {
      ...input,
      [key]: value,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSubmit({
      title: input.title,
      comment: input.comment,
      category_id: input.category_id,
      amount: input.amount,
      created_at: input.created_at?.toDate() ?? new Date(),
    });

    resetForm();
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
      "create-spending-item-input"
    );

    if (currentInput) {
      setInput(currentInput);
    }
  }, []);

  return (
    <SpendingEditorDialog
      open={isOpen}
      onClose={handleClose}
      title="Add Spending"
    >
      <Stack
        direction="column"
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        spacing={2}
        px={2}
        pb={2}
      >
        <TextField
          id="title"
          label="Title"
          value={input.title}
          onChange={(e) => updateInput("title", e.target.value)}
          disabled={isCreatingSpendingItem}
          size="small"
        />

        <TextField
          label="Comment"
          id="comment"
          value={input.comment}
          onChange={(e) => updateInput("comment", e.target.value)}
          disabled={isCreatingSpendingItem}
          size="small"
        />

        {!!spendingCategories.length && (
          <TextField
            label="Category"
            id="category"
            select
            value={input.category_id}
            onChange={(e) =>
              setInput({ ...input, category_id: Number(e.target.value) })
            }
            disabled={isCreatingSpendingItem}
            size="small"
          >
            {spendingCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="Amount"
          id="amount"
          value={input.amount}
          onChange={(e) => updateInput("amount", Number(e.target.value))}
          disabled={isCreatingSpendingItem}
          size="small"
        />

        <FormGroup>
          <DateTimePicker
            value={input.created_at}
            onChange={(date) => updateInput("created_at", date)}
            referenceDate={dayjs(new Date())}
            slotProps={{ textField: { id: "created_at" } }}
            disabled={isCreatingSpendingItem}
          />

          <Typography variant="caption" mt={0.5} ml={2}>
            Defaults to current date and time
          </Typography>
        </FormGroup>

        <Button
          type="submit"
          variant={isCreatingSpendingItem ? "text" : "contained"}
          disabled={disableSubmit}
          fullWidth
        >
          {isCreatingSpendingItem ? <CircularProgress size="1.5rem" /> : "Add"}
        </Button>
      </Stack>
    </SpendingEditorDialog>
  );
};
