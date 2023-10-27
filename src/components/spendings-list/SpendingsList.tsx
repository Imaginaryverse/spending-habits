import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";
import { SpendingItem } from "@src/types";

type SpendingsListProps = {
  spendingItems: SpendingItem[];
  dense?: boolean;
  itemElevation?: number;
};

export function SpendingsList({
  spendingItems,
  dense,
  itemElevation,
}: SpendingsListProps) {
  const { openEditDialog, openDeleteDialog } = useSpendingEditor();

  return (
    <List dense={dense}>
      {spendingItems.map((item) => (
        <SpendingsListItem
          key={item.id}
          item={item}
          onEditClick={openEditDialog}
          onDeleteClick={openDeleteDialog}
          elevation={itemElevation}
        />
      ))}
    </List>
  );
}

type SpendingsListItemProps = {
  item: SpendingItem;
  onEditClick: (item: SpendingItem) => void;
  onDeleteClick: (item: SpendingItem) => void;
  elevation?: number;
};

function SpendingsListItem({
  item,
  onEditClick,
  onDeleteClick,
  elevation = 5,
}: SpendingsListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ListItem sx={{ width: "100%" }} disableGutters>
      <Paper
        elevation={elevation}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
            pl: 2,
            pr: 1,
          }}
        >
          <Stack>
            <Typography variant="h5">
              {item.title} - {item.amount} kr
            </Typography>
            <Typography variant="caption">
              {formatDate(item.created_at)}
            </Typography>
          </Stack>
          <IconButton
            color="primary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ExpandMoreIcon
              fontSize="small"
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Stack
            spacing={2}
            sx={{
              py: 2,
              px: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography variant="caption">
              {item.comment || "No comment"}
            </Typography>

            <Stack spacing={1} direction="row">
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => onDeleteClick(item)}
                fullWidth
              >
                Delete
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => onEditClick(item)}
                fullWidth
              >
                Edit
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Paper>
    </ListItem>
  );
}

function formatDate(date: Date): string {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleString("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
