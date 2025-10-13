"use client";

import { useState } from "react";
import type { AdminListItem } from "@/features/admin-auth/lib/types";
import { InviteAdminFormSchema } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import type { z } from "zod/v4";
// import { listAdmins } from "@/features/admin-auth/actions/function";

type InviteAdminFormValues = z.infer<typeof InviteAdminFormSchema>;

/**
 * Hook for managing admin list with search and filtering
 * Ready for TanStack Query integration
 */
export function useAdminList() {
  // TODO: Replace with TanStack Query useQuery hook
  // Example:
  // const { data: admins, isLoading, error, refetch } = useQuery({
  //   queryKey: ['admins'],
  //   queryFn: async () => {
  //     const result = await listAdmins();
  //     return result;
  //   },
  // });

  // Mock data for now - replace with actual query
  const [admins] = useState<AdminListItem[]>([
    // TODO: Remove mock data when backend is ready
    {
      id: "1",
      email: "admin@example.com",
      name: "Admin User",
    },
    {
      id: "2",
      email: "john.doe@example.com",
      name: "John Doe",
    },
  ]);

  const isLoading = false; // TODO: Get from useQuery

  return {
    admins,
    isLoading,
    // refetch, // TODO: Uncomment when using TanStack Query
  };
}

/**
 * Hook for inviting new admin
 * Ready for TanStack Query mutation integration
 */
export function useInviteAdmin() {
  // TODO: Import the action when ready
  // import { inviteAdmin as inviteAdminAction } from "@/features/admin-auth/actions/function";

  // TODO: Replace with TanStack Query useMutation hook
  // Example:
  // const mutation = useMutation({
  //   mutationFn: async (values: InviteAdminFormValues) => {
  //     const result = await inviteAdminAction(values);
  //     return result;
  //   },
  //   onSuccess: () => {
  //     notifications.show({
  //       message: "Invitation sent successfully",
  //       color: "green",
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['admins'] });
  //   },
  //   onError: (error) => {
  //     notifications.show({
  //       message: error.message || "Failed to send invitation",
  //       color: "red",
  //     });
  //   },
  // });

  async function inviteAdmin(values: InviteAdminFormValues) {
    // TODO: Call server action here
    // await inviteAdminAction(values);

    console.log("Inviting admin:", values);

    // Mock success notification
    notifications.show({
      message: `Invitation sent to ${values.email}`,
      color: "green",
    });

    // TODO: Remove mock delay when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const isInviting = false; // TODO: Get from mutation.isPending

  return {
    inviteAdmin,
    isInviting,
  };
}

/**
 * Hook for removing admin
 * Ready for TanStack Query mutation integration
 */
export function useRemoveAdmin() {
  // TODO: Import the action when ready
  // import { removeAdmin as removeAdminAction } from "@/features/admin-auth/actions/function";

  // TODO: Replace with TanStack Query useMutation hook
  // Example:
  // const mutation = useMutation({
  //   mutationFn: async (adminId: string) => {
  //     const result = await removeAdminAction({ adminId });
  //     return result;
  //   },
  //   onSuccess: () => {
  //     notifications.show({
  //       message: "Admin removed successfully",
  //       color: "green",
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['admins'] });
  //   },
  //   onError: (error) => {
  //     notifications.show({
  //       message: error.message || "Failed to remove admin",
  //       color: "red",
  //     });
  //   },
  // });

  async function removeAdmin(adminId: string) {
    // TODO: Call server action here
    // await removeAdminAction({ adminId });

    console.log("Removing admin:", adminId);

    // Mock success notification
    notifications.show({
      message: "Admin removed successfully",
      color: "green",
    });

    // TODO: Remove mock delay when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const isRemoving = false; // TODO: Get from mutation.isPending

  return {
    removeAdmin,
    isRemoving,
  };
}
