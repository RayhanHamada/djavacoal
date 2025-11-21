"use client";

import "@mantine/notifications/styles.css";

import { PropsWithChildren } from "react";

import {
    DirectionProvider,
    MantineProvider,
    ColorSchemeScript,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import theme from "@/lib/mantine-theme";

type Props = PropsWithChildren;

export default function AdminLayout({ children }: Props) {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="light" />
            <DirectionProvider>
                <MantineProvider theme={theme} defaultColorScheme="light">
                    <ModalsProvider>
                        <Notifications />
                        {children}
                    </ModalsProvider>
                </MantineProvider>
            </DirectionProvider>
        </>
    );
}
