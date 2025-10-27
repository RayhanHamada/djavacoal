"use client";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

/**
 * Hook for changing the authenticated user's password
 * Provides mutation function with notifications
 */
export function useChangePassword() {
    const mutation = useMutation(
        rpc.admins.changeMyPassword.mutationOptions({
            onSuccess: () => {
                notifications.show({
                    title: "Success",
                    message: "Your password has been changed successfully",
                    color: "green",
                });
            },
            onError: (error) => {
                notifications.show({
                    title: "Error",
                    message:
                        error.message ||
                        "Failed to change password. Please check your current password.",
                    color: "red",
                });
            },
        })
    );

    return {
        changePassword: mutation.mutateAsync,
        isChanging: mutation.isPending,
    };
}
