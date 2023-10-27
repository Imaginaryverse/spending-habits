import { Stack, StackOwnProps } from "@mui/material";
import { CSSProperties, PropsWithChildren } from "react";

type PageProps = {
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  spacing?: StackOwnProps["spacing"];
};

export function Page({
  justifyContent = "flex-start",
  alignItems = "center",
  spacing = 2,
  children,
}: PropsWithChildren<PageProps>) {
  return (
    <Stack
      flex={1}
      width="100%"
      maxWidth="md"
      p={2}
      pb={4}
      spacing={spacing}
      overflow="auto"
      justifyContent={justifyContent}
      alignItems={alignItems}
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {children}
    </Stack>
  );
}
