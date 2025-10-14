"use client";

import { PropsWithChildren, useEffect } from "react";
import { DashboardShell } from "@/features/dashboard/components";
import { SetPasswordModal } from "@/features/admin-auth/components";
import { useServerAction } from "@orpc/react/hooks";
import * as actions from "@/features/admin-auth/server/actions";

type Props = PropsWithChildren;

export function DashboardLayoutClient({ children }: Props) {
  const { data, isPending, execute } = useServerAction(
    actions.checkNeedsPasswordActions
  );

  useEffect(() => {
    execute({});
  }, [execute]);

  const needsPassword = data?.needsPassword ?? false;

  return (
    <>
      {needsPassword && !isPending && <SetPasswordModal />}
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
