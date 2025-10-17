"use client";

import { useRouter } from "next/navigation";

import { notifications } from "@mantine/notifications";
import { onError, onSuccess } from "@orpc/client";
import { useServerAction } from "@orpc/react/hooks";

import * as actions from "@/features/admin-auth/server/actions";

export function useOnboarding() {
    const router = useRouter();
    const { execute: handleSetupFirstUser, isPending: isSetupLoading } =
        useServerAction(actions.setupFirstUserActions, {
            interceptors: [
                onSuccess(async function () {
                    notifications.show({
                        title: "Success",
                        message: "Onboarding completed successfully!",
                        color: "green",
                    });
                }),
                onError(async function ({ message, cause }) {
                    console.log(cause);

                    notifications.show({
                        title: "Error",
                        message: message || "Failed to complete onboarding.",
                        color: "red",
                    });

                    router.replace("/auth/login");
                }),
            ],
        });

    return {
        handleSetupFirstUser,
        isLoading: isSetupLoading,
    };
}
