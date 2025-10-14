"use client";

import { useServerAction } from "@orpc/react/hooks";
import { notifications } from "@mantine/notifications";
import * as actions from "@/features/admin-auth/server/actions";
import { onError, onSuccess } from "@orpc/client";

export function useOnboarding() {
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
        onError(async function ({ message }) {
          notifications.show({
            title: "Error",
            message: message || "Failed to complete onboarding.",
            color: "red",
          });
        }),
      ],
    });

  return {
    handleSetupFirstUser,
    isLoading: isSetupLoading,
  };
}
