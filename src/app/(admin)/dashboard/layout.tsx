import { PropsWithChildren } from "react";
import React from "react";

import { DashboardLayoutClient } from "@/app/(admin)/dashboard/layout-client";
import { redirectUnauthenticatedUserActions } from "@/features/dashboard-auth/server/actions";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
    await redirectUnauthenticatedUserActions();

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
