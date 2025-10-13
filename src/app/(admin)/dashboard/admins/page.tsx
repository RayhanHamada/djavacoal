"use client";

import { AdminListTable } from "@/features/admin-auth/components/organism";
import {
  useAdminList,
  useInviteAdmin,
  useRemoveAdmin,
} from "@/features/admin-auth/hooks";

export default function AdminsPage() {
  const { admins, isLoading } = useAdminList();
  const { inviteAdmin, isInviting } = useInviteAdmin();
  const { removeAdmin, isRemoving } = useRemoveAdmin();

  return (
    <AdminListTable
      admins={admins}
      isLoading={isLoading}
      onInvite={inviteAdmin}
      onRemove={removeAdmin}
      isInviting={isInviting}
      isRemoving={isRemoving}
    />
  );
}
