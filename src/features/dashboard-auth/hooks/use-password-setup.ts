"use client";

import { notifications } from "@mantine/notifications";
import { onError, onSuccess } from "@orpc/client";
import { useServerAction } from "@orpc/react/hooks";

import * as actions from "@/features/dashboard-auth/server/actions";

export function usePasswordSetup(onPasswordSet?: () => void) {
    const { execute: handleSetPassword, isPending: isSetPasswordLoading } =
        useServerAction(actions.setPasswordActions, {
            interceptors: [
                onSuccess(async function () {
                    notifications.show({
                        title: "Success",
                        message: "Password set successfully!",
                        color: "green",
                    });

                    // Call the callback if provided
                    onPasswordSet?.();
                }),
                onError(async function ({ message }) {
                    notifications.show({
                        title: "Error",
                        message: message || "Failed to set password.",
                        color: "red",
                    });
                }),
            ],
        });

    return {
        handleSetPassword,
        isLoading: isSetPasswordLoading,
    };
}
