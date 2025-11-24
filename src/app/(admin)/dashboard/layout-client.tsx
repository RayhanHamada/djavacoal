"use client";

import { PropsWithChildren } from "react";

import { useQuery } from "@tanstack/react-query";

import { DashboardShell } from "@/features/dashboard/components";
import { SetPasswordModal } from "@/features/dashboard-auth/components";
import { rpc } from "@/lib/rpc";

type Props = PropsWithChildren;

export function DashboardLayoutClient({ children }: Props) {
    const { data, isPending } = useQuery(
        rpc.admins.checkNeedsPassword.queryOptions()
    );

    const needsPassword = data?.needsPassword ?? false;
    const showModal = needsPassword && !isPending;

    return (
        <>
            {showModal && <SetPasswordModal />}
            <DashboardShell>{children}</DashboardShell>
        </>
    );
}
