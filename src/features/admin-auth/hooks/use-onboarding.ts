"use client";

import { useAction } from "next-safe-action/hooks";
import { notifications } from "@mantine/notifications";
import * as actions from "@/features/admin-auth/actions/function";
import { useRouter } from "next/navigation";

export function useOnboarding() {
  const router = useRouter();

  const { executeAsync: handleOnboardingAdmin, isPending: isLoading } =
    useAction(actions.onboardAdmin, {
      onSuccess() {
        notifications.show({
          title: "Success",
          message: "Onboarding completed successfully!",
          color: "green",
        });

        router.replace("/auth/login");
      },

      onError({ error }) {
        notifications.show({
          title: "Error",
          message: error.serverError || "Failed to complete onboarding.",
          color: "red",
        });
      },
    });

  return {
    handleOnboardingAdmin,
    isLoading,
  };
}
