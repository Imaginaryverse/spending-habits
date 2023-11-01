import { Box, Stack, StackOwnProps, Typography } from "@mui/material";
import { CSSProperties, PropsWithChildren } from "react";

type PageProps = {
  title?: string;
  headerButtons?: React.ReactNode | React.ReactNode[];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  spacing?: StackOwnProps["spacing"];
};

export function Page({
  title,
  headerButtons,
  justifyContent = "flex-start",
  alignItems = "flex-start",
  spacing = 3,
  children,
}: PropsWithChildren<PageProps>) {
  return (
    <Stack
      flex={1}
      position="relative"
      width="100%"
      maxWidth="lg"
      px={{ xs: 2, sm: 3, md: 4 }}
      py={3}
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {!!title && (
        <Box
          component="header"
          className="page-header"
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography className="page-header-title" variant="h1">
            {title}
          </Typography>
          {!!headerButtons && (
            <Stack
              className="page-header-buttons"
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {headerButtons}
            </Stack>
          )}
        </Box>
      )}
      {children}
    </Stack>
  );
}
