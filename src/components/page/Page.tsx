import { Stack, StackOwnProps } from "@mui/material";
import { CSSProperties, PropsWithChildren } from "react";

type PageProps = {
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  spacing?: StackOwnProps["spacing"];
};

export function Page({
  justifyContent = "flex-start",
  alignItems = "flex-start",
  spacing = 3,
  children,
}: PropsWithChildren<PageProps>) {
  return (
    <Stack
      flex={1}
      width="100%"
      maxWidth="lg"
      px={{ xs: 2, sm: 3, md: 4 }}
      py={3}
      spacing={spacing}
      justifyContent={justifyContent}
      alignItems={alignItems}
    >
      {children}
    </Stack>
  );
}
