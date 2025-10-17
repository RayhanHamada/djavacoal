"use client";

import { InviteAdminFormSchema } from "@/features/admin-auth/lib/form-schema";
import { notifications } from "@mantine/notifications";
import type { z } from "zod/v4";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, rpc } from "@/lib/rpc";
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
 * Hook for inviting new admin using Better Auth magic link
 */
export function useInviteAdmin() {
  const mutation = useMutation({
    mutationFn: async (values: InviteAdminFormValues) => {
      const result = await client.admins.inviteAdmin({
        email: values.email,
        name: values.name,
      });
      return result;
    },
    onSuccess: (_, variables) => {
      notifications.show({
        title: "Invitation Sent",
        message: `An invitation email has been sent to ${variables.email}`,
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Invitation Failed",
        message:
          error.message || "Failed to send invitation. Please try again.",
        color: "red",
      });
    },
  });

  return {
    inviteAdmin: mutation.mutateAsync,
    isInviting: mutation.isPending,
  };
}

/**
 * Hook for removing admin
 */
export function useRemoveAdmin() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    rpc.admins.removeAdmin.mutationOptions({
      onSuccess() {
        notifications.show({
          title: "Admin Removed",
          message: "Admin has been successfully removed",
          color: "green",
        });

        // Invalidate all admin list queries to refresh the data
        queryClient.invalidateQueries({
          queryKey: rpc.admins.listAllAdmins.key(),
        });
      },
      onError(error) {
        notifications.show({
          title: "Removal Failed",
          message: error.message || "Failed to remove admin. Please try again.",
          color: "red",
        });
      },
    })
  );

  async function removeAdmin(id: string) {
    return mutation.mutateAsync({ id });
  }

  return {
    removeAdmin,
    isRemoving: mutation.isPending,
  };
}
