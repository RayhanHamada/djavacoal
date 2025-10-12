import "@mantine/notifications/styles.css";

import theme from "@/lib/mantine-theme";
import { DirectionProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export default function AdminLayout({ children }: Props) {
  return (
    <DirectionProvider>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </DirectionProvider>
  );
}
