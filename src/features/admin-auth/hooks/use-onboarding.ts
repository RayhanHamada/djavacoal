"use client";

import { useServerAction } from "@orpc/react/hooks";
import { notifications } from "@mantine/notifications";
import * as actions from "@/features/admin-auth/actions";
import { onError, onSuccess } from "@orpc/client";

export function useOnboarding() {
  const { execute: handleOnboardingAdmin, isPending: isOnboardingLoading } =
    useServerAction(actions.onboardAdmin, {
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
    handleOnboardingAdmin,
    isLoading: isOnboardingLoading,
  };
}
