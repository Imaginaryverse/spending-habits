import { Paper, Stack } from "@mui/material";
import { ComponentProps, PropsWithChildren } from "react";

type PaperStackProps = {
  spacing?: number;
  py?: number;
  px?: number;
  width?: string;
  elevation?: number;
  sx?: ComponentProps<typeof Paper>["sx"];
};

export function PaperStack({
  spacing = 3,
  py = 2,
  px = 2,
  width = "100%",
  elevation = 1,
  children,
  sx,
}: PropsWithChildren<PaperStackProps>) {
  return (
    <Paper
      component={Stack}
      spacing={spacing}
      py={py}
      px={px}
      width={width}
      elevation={elevation}
      sx={sx}
    >
      {children}
    </Paper>
  );
}
