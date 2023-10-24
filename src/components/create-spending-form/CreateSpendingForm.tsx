import {
  Box,
  Button,
  Collapse,
  FormGroup,
  FormLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFetchCategories } from "@src/api/categories";
import { useAuth } from "@src/features/auth/useAuth";
import { CreateSpendingItem } from "@src/types";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

type CreateSpendingFormProps = {
  onSubmit: (item: CreateSpendingItem) => void;
  isCreatingSpendingItem: boolean;
  isSpendingItemCreated: boolean;
};

export const CreateSpendingForm = ({
  onSubmit,
  isCreatingSpendingItem,
  isSpendingItemCreated,
}: CreateSpendingFormProps) => {
  const { user } = useAuth();
  const { categories, isFetchingCategories } = useFetchCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [amount, setAmount] = useState("");
  const [created_at, setCreatedAt] = useState<Dayjs | null>(null);

  const disableSubmit = useMemo(() => {
    return (
      isFetchingCategories ||
      isCreatingSpendingItem ||
      !title ||
      !comment ||
      Number(amount) < 1
    );
  }, [isFetchingCategories, isCreatingSpendingItem, title, comment, amount]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!user || !categories.length || disableSubmit) {
        return;
      }

      const item: CreateSpendingItem = {
        user_id: user.id,
        category_id: categories[categoryIdx].id,
        created_at: created_at?.toDate() ?? new Date(),
        title,
        comment,
        amount: Number(amount),
      };

      onSubmit(item);
    },
    [
      user,
      categories,
      categoryIdx,
      created_at,
      title,
      comment,
      amount,
      disableSubmit,
      onSubmit,
    ]
  );

  useEffect(() => {
    if (isSpendingItemCreated) {
      setCreatedAt(null);
      setTitle("");
      setComment("");
      setCategoryIdx(0);
      setAmount("0");
    }
  }, [isSpendingItemCreated]);

  return (
    <Paper>
      <Stack py={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pl={2}
          pr={1}
        >
          <Typography variant="h3">Add spending</Typography>

          <Button
            variant="contained"
            size="small"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? "Hide" : "Show"}
          </Button>
        </Box>

        <Collapse in={isOpen}>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Stack spacing={2} padding={2}>
              <FormGroup>
                <FormLabel htmlFor="title">Title</FormLabel>
                <TextField
                  id="title"
                  value={title}
                  placeholder="e.g. Lunch"
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="comment">Comment</FormLabel>
                <TextField
                  id="comment"
                  value={comment}
                  placeholder="e.g. sallad, coffee, etc."
                  onChange={(e) => setComment(e.target.value)}
                  fullWidth
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="category">Category</FormLabel>
                <TextField
                  id="category"
                  select
                  value={categoryIdx}
                  onChange={(e) => setCategoryIdx(Number(e.target.value))}
                  fullWidth
                  required
                >
                  {categories.map((category, idx) => (
                    <MenuItem key={category.id} value={idx}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="amount">Amount</FormLabel>
                <TextField
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="created_at">Date</FormLabel>
                <DateTimePicker
                  value={created_at}
                  onChange={setCreatedAt}
                  referenceDate={dayjs(new Date())}
                />

                <Typography variant="caption" mt={0.5} ml={2}>
                  Defaults to current date and time
                </Typography>
              </FormGroup>

              <Button
                type="submit"
                variant="contained"
                disabled={disableSubmit}
              >
                Add
              </Button>
            </Stack>
          </form>
        </Collapse>
      </Stack>
    </Paper>
  );
};
