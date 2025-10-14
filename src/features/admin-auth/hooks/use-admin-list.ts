"use client";

import { InviteAdminFormSchema } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import type { z } from "zod/v4";
import { useQuery } from "@tanstack/react-query";
import { rpc } from "@/lib/rpc";
import { useState, useEffect } from "react";
import { useDebounce } from "ahooks";

type InviteAdminFormValues = z.infer<typeof InviteAdminFormSchema>;

/**
 * Hook for managing admin list with search and pagination
 */
export function useAdminList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), { wait: 500 });

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const query = useQuery(
    rpc.admins.listAllAdmins.queryOptions({
      input: {
        search: debouncedSearchQuery,
        page,
        limit,
      },
    })
  );

  return {
    admins: query.data?.admins ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? 1,
    pageSize: query.data?.pageSize ?? limit,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    searchQuery,
    setSearchQuery,
    setPage,
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
