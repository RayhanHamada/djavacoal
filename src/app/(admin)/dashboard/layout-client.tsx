"use client";

import { PropsWithChildren, useEffect } from "react";
import { DashboardShell } from "@/features/dashboard/components";
import { SetPasswordModal } from "@/features/admin-auth/components";
import { useServerAction } from "@orpc/react/hooks";
import { checkNeedsPasswordActions } from "@/features/admin-auth/server/actions";

type Props = PropsWithChildren;

export function DashboardLayoutClient({ children }: Props) {
  const { data, isPending, execute } = useServerAction(
    checkNeedsPasswordActions
  );

  useEffect(() => {
    execute();
  }, [execute]);

  const needsPassword = data?.needsPassword ?? false;
  const showModal = needsPassword && !isPending;

  return (
    <>
      {showModal && <SetPasswordModal />}
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
