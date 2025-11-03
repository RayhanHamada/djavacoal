"use client";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/features/dashboard-auth/lib/better-auth-client";
import { rpc } from "@/lib/rpc";

/**
 * Hook for updating the authenticated user's name
 * Provides mutation function with optimistic updates and notifications
 */
export function useUpdateName() {
    const { refetch: refetchSession } = client.useSession();

    const mutation = useMutation(
        rpc.admins.updateMyName.mutationOptions({
            onSuccess: async () => {
                // Refetch session to update user data in UI
                await refetchSession();

                notifications.show({
                    title: "Success",
                    message: "Your name has been updated successfully",
                    color: "green",
                });
            },
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message: error.message || "Failed to update name",
                    color: "red",
                });
            },
        })
    );

    return {
        updateName: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    };
}
