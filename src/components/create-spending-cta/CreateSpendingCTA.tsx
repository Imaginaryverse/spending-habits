import { Box, Button, Paper, Typography } from "@mui/material";
import { useSpendingEditor } from "@src/features/spending-editor/useSpendingEditor";

export const CreateSpendingCTA = () => {
  const { openAddDialog } = useSpendingEditor();

  return (
    <Paper
      sx={{ width: "100%", display: "flex", flexDirection: "column", p: 2 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">Add spending</Typography>

        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={openAddDialog}
        >
          Create
        </Button>
      </Box>
    </Paper>
  );
};
