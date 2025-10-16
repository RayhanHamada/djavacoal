import { redirectUnauthenticatedUserActions } from "@/features/admin-auth/server/actions";
import { PropsWithChildren } from "react";
import { DashboardLayoutClient } from "./layout-client";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await redirectUnauthenticatedUserActions();

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
