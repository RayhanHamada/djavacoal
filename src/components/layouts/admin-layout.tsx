import "@mantine/notifications/styles.css";

import { PropsWithChildren } from "react";

import { DirectionProvider, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import theme from "@/lib/mantine-theme";

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
