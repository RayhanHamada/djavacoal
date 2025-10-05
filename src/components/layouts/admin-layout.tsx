import theme from "@/lib/mantine-theme";
import { DirectionProvider, MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function AdminLayout({ children }: Props) {
  return (
    <DirectionProvider>
      <MantineProvider theme={theme}>{children}</MantineProvider>
    </DirectionProvider>
  );
}
