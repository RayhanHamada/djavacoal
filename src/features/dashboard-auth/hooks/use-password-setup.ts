"use client";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

import { rpc } from "@/lib/rpc";

export function usePasswordSetup(onPasswordSet?: () => void) {
    const { mutateAsync: handleSetPassword, isPending: isSetPasswordLoading } =
        useMutation(
            rpc.admins.setPassword.mutationOptions({
                onSuccess() {
                    notifications.show({
                        title: "Success",
                        message: "Password set successfully!",
                        color: "green",
                    });

                    // Call the callback if provided
                    onPasswordSet?.();
                },
                onError(error) {
                    notifications.show({
                        title: "Error",
                        message: error.message || "Failed to set password.",
                        color: "red",
                    });
                },
            })
        );

    return {
        handleSetPassword,
        isLoading: isSetPasswordLoading,
    };
}
