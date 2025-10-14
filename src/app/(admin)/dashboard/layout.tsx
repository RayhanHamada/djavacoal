import { guardAuthenticatedRoute } from "@/features/admin-auth/actions";
import { PropsWithChildren } from "react";
import { DashboardShell } from "@/features/dashboard/components";

type Props = PropsWithChildren;

export default async function Layout({ children }: Props) {
  await guardAuthenticatedRoute();

  return <DashboardShell>{children}</DashboardShell>;
}
