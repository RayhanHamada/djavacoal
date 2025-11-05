"use client";

import "react-photo-view/dist/react-photo-view.css";

import { PropsWithChildren } from "react";

import { AppShell, AppShellHeader, AppShellMain, Flex } from "@mantine/core";
import { IconMinus, IconPlus, IconRotate } from "@tabler/icons-react";
import { PhotoProvider } from "react-photo-view";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "@/features/dashboard/components/molecules";

type Props = PropsWithChildren;

export function DashboardShell({ children }: Props) {
    return (
        <AppShell
            padding="md"
            header={{ height: 60 }}
            navbar={{ width: 280, breakpoint: "sm" }}
        >
            <AppShellHeader>
                <DashboardHeader />
            </AppShellHeader>
            <DashboardSidebar />
            <AppShellMain>
                <PhotoProvider
                    maskOpacity={0.5}
                    toolbarRender={({ onScale, onRotate, rotate, scale }) => (
                        <Flex gap="md" mr="lg">
                            <IconPlus onClick={() => onScale(scale + 1)} />
                            <IconMinus onClick={() => onScale(scale - 1)} />
                            <IconRotate onClick={() => onRotate(rotate + 90)} />
                        </Flex>
                    )}
                >
                    {children}
                </PhotoProvider>
            </AppShellMain>
        </AppShell>
    );
}
