import { redirectUnauthenticatedUserActions } from "@/features/admin-auth/server/actions";
import { PropsWithChildren } from "react";
import { DashboardShell } from "@/features/dashboard/components";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await redirectUnauthenticatedUserActions();

  return <DashboardShell>{children}</DashboardShell>;
}
