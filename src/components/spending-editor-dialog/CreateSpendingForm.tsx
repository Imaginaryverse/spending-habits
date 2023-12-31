import { useState, useMemo } from "react";
import {
  Stack,
  Typography,
  FormGroup,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  DialogActions,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  CreateSpendingItem,
  SpendingCategory,
  SpendingItemInput,
} from "@src/types";
import dayjs from "dayjs";
import { SpendingEditorDialog } from "./SpendingEditorDialog";
import { useFetchSpendingCategories } from "@src/api/spending-categories";
import { sortSpendingCategories } from "@src/utils/data-utils";

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
  const { spendingCategories } = useFetchSpendingCategories({
    select: (data) => sortSpendingCategories(data),
  });

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
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fallbackCategory: Omit<SpendingCategory, "description"> = {
      id: 1,
      name: "Other",
    };

    const category = spendingCategories.find((c) => c.id === input.category_id);

    onSubmit({
      title: input.title,
      comment: input.comment,
      category_id: category?.id ?? fallbackCategory.id,
      category_name: category?.name ?? fallbackCategory.name,
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
        p={2}
        pb={0}
      >
        <TextField
          id="title"
          label="Title"
          value={input.title}
          onChange={(e) => updateInput("title", e.target.value)}
          disabled={isCreatingSpendingItem}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <TextField
          label="Amount"
          id="amount"
          value={input.amount}
          onChange={(e) => updateInput("amount", Number(e.target.value))}
          disabled={isCreatingSpendingItem}
          InputLabelProps={{ shrink: true }}
          size="small"
          inputProps={{ inputMode: "numeric" }}
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
            InputLabelProps={{ shrink: true }}
            size="small"
          >
            {spendingCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <FormGroup>
          <DateTimePicker
            label="Date and time"
            value={input.created_at}
            onChange={(date) => updateInput("created_at", date)}
            referenceDate={dayjs(new Date())}
            disabled={isCreatingSpendingItem}
            slotProps={{
              textField: {
                id: "created_at",
                InputLabelProps: { shrink: true },
              },
            }}
            ampm={false}
            disableFuture
          />

          <Typography variant="caption" mt={0.5} ml={2}>
            Defaults to current date and time
          </Typography>
        </FormGroup>

        <TextField
          label="Comment"
          id="comment"
          value={input.comment}
          onChange={(e) => updateInput("comment", e.target.value)}
          disabled={isCreatingSpendingItem}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <DialogActions sx={{ pr: 0 }}>
          <Button
            size="small"
            onClick={() => handleClose()}
            disabled={isCreatingSpendingItem}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            size="small"
            color="primary"
            type="submit"
            disabled={disableSubmit}
          >
            {isCreatingSpendingItem ? (
              <CircularProgress size="1.5rem" />
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Stack>
    </SpendingEditorDialog>
  );
};
