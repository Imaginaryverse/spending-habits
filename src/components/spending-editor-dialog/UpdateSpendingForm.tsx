import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { SpendingItem, SpendingItemInput } from "@src/types";
import { SpendingEditorDialog } from "./SpendingEditorDialog";
import {
  Button,
  CircularProgress,
  FormGroup,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useFetchSpendingCategories } from "@src/api/spending-categories";

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
  const { spendingCategories } = useFetchSpendingCategories();

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
    if (spendingItem) {
      const item = {
        ...spendingItem,
        created_at: dayjs(spendingItem.created_at),
      };

      setInput(item);
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
        spacing={2}
        px={2}
        pb={2}
      >
        <TextField
          label="Title"
          id="title"
          value={input.title}
          onChange={(e) => updateInput("title", e.target.value)}
          disabled={isUpdatingSpendingItem}
          size="small"
        />

        <TextField
          label="Amount"
          id="amount"
          value={input.amount}
          onChange={(e) => updateInput("amount", Number(e.target.value))}
          disabled={isUpdatingSpendingItem}
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
            disabled={isUpdatingSpendingItem}
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
            value={dayjs(input.created_at)}
            onChange={(date) => updateInput("created_at", date)}
            referenceDate={dayjs(new Date())}
            slotProps={{ textField: { id: "created_at" } }}
            disabled={isUpdatingSpendingItem}
            ampm={false}
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
          disabled={isUpdatingSpendingItem}
          size="small"
        />

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
