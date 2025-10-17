"use client";

import { PropsWithChildren } from "react";

import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";

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
            <AppShellMain>{children}</AppShellMain>
        </AppShell>
    );
}
